/**
 * Google Drive Folder Scanner
 * Scans subfolders for a specific letter at a time.
 * User provides folder link + letter, script scans only folders starting with that letter.
 * If it times out, click "Continue Scan" to resume where it left off.
 */

// ── Menu ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Folder Scanner')
    .addItem('Scan Letter', 'scanLetter')
    .addItem('Continue Scan', 'continueScan')
    .addSeparator()
    .addItem('Reset / Cancel', 'resetScan')
    .addToUi();
}

// ── Scan a specific letter ───────────────────────────────────────────
function scanLetter() {
  var ui = SpreadsheetApp.getUi();

  // Ask for folder ID/URL
  var folderResponse = ui.prompt(
    'Step 1 of 2',
    'Paste the Google Drive folder ID or URL:',
    ui.ButtonSet.OK_CANCEL
  );
  if (folderResponse.getSelectedButton() !== ui.Button.OK) return;

  var folderId = extractFolderId(folderResponse.getResponseText());
  if (!folderId) {
    ui.alert('Could not extract a folder ID from your input.');
    return;
  }

  // Validate access
  try {
    DriveApp.getFolderById(folderId);
  } catch (e) {
    ui.alert('Cannot access that folder. Check the ID/URL and sharing permissions.');
    return;
  }

  // Ask for letter
  var letterResponse = ui.prompt(
    'Step 2 of 2',
    'Enter the letter to scan (A-Z), or # for numbers/special characters:',
    ui.ButtonSet.OK_CANCEL
  );
  if (letterResponse.getSelectedButton() !== ui.Button.OK) return;

  var letter = letterResponse.getResponseText().trim().toUpperCase();
  if (letter !== '#' && (letter.length !== 1 || !/^[A-Z]$/.test(letter))) {
    ui.alert('Please enter a single letter A-Z, or # for non-alpha folders.');
    return;
  }

  // Clear previous state and initialize
  var props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
  props.setProperties({
    ROOT_FOLDER_ID: folderId,
    SCAN_LETTER: letter,
    STATUS: 'scanning',
    FOLDERS_FOUND: '0',
    CONTINUATION_TOKEN: '',
    PENDING_QUEUE: '[]'
  });

  // Clear the tab for this letter (fresh scan)
  clearLetterTab(letter);

  ui.alert('Starting scan for letter "' + letter + '"...\n\nThe scan will run now. If it times out, click "Continue Scan" to resume.');

  // Start scanning
  scanBatch();
}

// ── Continue a timed-out scan ────────────────────────────────────────
function continueScan() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var status = props.getProperty('STATUS');

  if (status !== 'scanning') {
    ui.alert('No scan in progress. Use "Scan Letter" to start a new scan.');
    return;
  }

  var letter = props.getProperty('SCAN_LETTER');
  var found = props.getProperty('FOLDERS_FOUND') || '0';
  ui.alert('Resuming scan for letter "' + letter + '"...\nFolders found so far: ' + found);

  scanBatch();
}

// ── Main scan logic (processes folders in batches within 5 min) ──────
function scanBatch() {
  var startTime = Date.now();
  var MAX_RUNTIME_MS = 5 * 60 * 1000; // 5 min safety margin
  var props = PropertiesService.getScriptProperties();

  try {
    var rootId = props.getProperty('ROOT_FOLDER_ID');
    var letter = props.getProperty('SCAN_LETTER');
    var totalFound = parseInt(props.getProperty('FOLDERS_FOUND'), 10) || 0;

    // Load the queue of folder IDs still to process
    // Queue contains folder IDs we need to recurse into
    var queue = JSON.parse(props.getProperty('PENDING_QUEUE') || '[]');

    // If queue is empty, this is the first run — seed with root folder
    if (queue.length === 0) {
      queue.push(rootId);
    }

    var matchedFolders = []; // Buffer for writing in bulk

    while (queue.length > 0) {
      // Timeout check
      if ((Date.now() - startTime) >= MAX_RUNTIME_MS) {
        // Write what we have so far before saving state
        if (matchedFolders.length > 0) {
          writeToLetterTab(letter, matchedFolders);
          totalFound += matchedFolders.length;
        }
        props.setProperty('PENDING_QUEUE', JSON.stringify(queue));
        props.setProperty('FOLDERS_FOUND', String(totalFound));
        props.setProperty('STATUS', 'scanning');
        Logger.log('Timed out. Queue remaining: ' + queue.length + '. Folders found: ' + totalFound);
        return;
      }

      // Process next folder in queue
      var currentFolderId = queue.shift();
      var currentFolder;
      try {
        currentFolder = DriveApp.getFolderById(currentFolderId);
      } catch (e) {
        // Skip inaccessible folders
        continue;
      }

      var subfolders = currentFolder.getFolders();
      while (subfolders.hasNext()) {
        // Timeout check inside inner loop too
        if ((Date.now() - startTime) >= MAX_RUNTIME_MS) {
          // We can't save a FolderIterator, so we need to re-process this folder
          // Put it back at the front of the queue
          queue.unshift(currentFolderId);

          if (matchedFolders.length > 0) {
            writeToLetterTab(letter, matchedFolders);
            totalFound += matchedFolders.length;
          }
          props.setProperty('PENDING_QUEUE', JSON.stringify(queue));
          props.setProperty('FOLDERS_FOUND', String(totalFound));
          props.setProperty('STATUS', 'scanning');
          Logger.log('Timed out mid-folder. Queue remaining: ' + queue.length + '. Folders found: ' + totalFound);
          return;
        }

        var subfolder = subfolders.next();
        var name = subfolder.getName();
        var id = subfolder.getId();

        // Add to queue for recursive processing
        queue.push(id);

        // Check if this folder matches the target letter
        var firstChar = name.toUpperCase().charAt(0);
        var matches = false;
        if (letter === '#') {
          matches = !/^[A-Z]/.test(firstChar);
        } else {
          matches = (firstChar === letter);
        }

        if (matches) {
          matchedFolders.push({
            name: name,
            url: subfolder.getUrl()
          });
        }

        // Periodically write to sheet to avoid losing data (every 50 matches)
        if (matchedFolders.length >= 50) {
          writeToLetterTab(letter, matchedFolders);
          totalFound += matchedFolders.length;
          matchedFolders = [];
        }
      }
    }

    // Write remaining matches
    if (matchedFolders.length > 0) {
      writeToLetterTab(letter, matchedFolders);
      totalFound += matchedFolders.length;
    }

    // Done — sort the tab
    sortLetterTab(letter);

    props.setProperty('STATUS', 'done');
    props.setProperty('FOLDERS_FOUND', String(totalFound));

    try {
      SpreadsheetApp.getUi().alert(
        'Scan Complete',
        'Letter "' + letter + '" done! Found ' + totalFound + ' folders.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (e) {}

  } catch (error) {
    props.setProperty('STATUS', 'error');
    Logger.log('Scan error: ' + error.message);
    try {
      SpreadsheetApp.getUi().alert('Error during scan: ' + error.message);
    } catch (e) {}
  }
}

// ── Extract Folder ID ────────────────────────────────────────────────
function extractFolderId(input) {
  input = (input || '').trim();
  var match = input.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]+$/.test(input)) return input;
  return null;
}

// ── Clear a letter tab (or create fresh) ─────────────────────────────
function clearLetterTab(letter) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(letter);
  if (sheet) {
    sheet.clear();
    sheet.getRange('A1:B1').setValues([['Folder Name', 'Folder Link']]);
    sheet.getRange('A1:B1').setFontWeight('bold');
  } else {
    getOrCreateLetterSheet(letter);
  }
}

// ── Create or get a letter tab with headers ──────────────────────────
function getOrCreateLetterSheet(letter) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(letter);
  if (sheet) return sheet;

  sheet = ss.insertSheet(letter);
  sheet.getRange('A1:B1').setValues([['Folder Name', 'Folder Link']]);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.setColumnWidth(1, 350);
  sheet.setColumnWidth(2, 500);
  sheet.setFrozenRows(1);
  return sheet;
}

// ── Write a batch of folders to a letter tab ─────────────────────────
function writeToLetterTab(tabName, batch) {
  if (!batch || batch.length === 0) return;

  var sheet = getOrCreateLetterSheet(tabName);
  var rows = batch.map(function(f) {
    return [f.name, f.url];
  });

  var lastRow = sheet.getLastRow();
  var startRow = lastRow + 1;
  sheet.getRange(startRow, 1, rows.length, 2).setValues(rows);
}

// ── Sort a letter tab alphabetically ─────────────────────────────────
function sortLetterTab(letter) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(letter);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return; // Only header or empty

  // Sort data range (excluding header) by column A ascending
  var range = sheet.getRange(2, 1, lastRow - 1, 2);
  range.sort({ column: 1, ascending: true });
}

// ── Reset / Cancel ───────────────────────────────────────────────────
function resetScan() {
  var props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
  SpreadsheetApp.getUi().alert('Scan cancelled. All state cleared.');
}
