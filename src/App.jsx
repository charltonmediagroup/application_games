import { useState, useEffect, useRef, useCallback } from "react";

var pop = function(el) { if (!el) return; el.style.transform = "scale(0.93)"; setTimeout(function() { if (el) el.style.transform = "scale(1)"; }, 120); };
function shuffle(arr) { var a = [].concat(arr); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

var SHEET_URL = "https://script.google.com/macros/s/AKfycbyEGC26m_SdZh0yMiRiejJ-u_qplD9Pzv56-dIhtYHSsCuQNlVCt64omdIbKBxw3SXu/exec";

var GAMES = [
  { id: "word", label: "Word sprint", icon: "\u{1f4ac}", color: "#534AB7", bg: "#EEEDFE" },
  { id: "keep", label: "Keep going", icon: "\u{1f525}", color: "#D85A30", bg: "#FAECE7" },
  { id: "scan", label: "Info scan", icon: "\u{1f50d}", color: "#1D9E75", bg: "#E1F5EE" },
  { id: "snap", label: "Snap decision", icon: "\u26a1", color: "#D4537E", bg: "#FBEAF0" },
];

// ═══ WORD DATA ═══
var WSample = { letters: ["D","E","A","L","S"], words: ["deals","dales","lades","lased","leads","slade","dale","dals","deal","dels","elds","lade","lads","lead","sled","ales","lase","leas","sade","sale","seal"] };
var WB = {
  MARKETING: { l: ["M","A","R","K","E","T","I","N","G"], w: ["marketing","remaking","retaking","emigrant","remating","marking","mankier","ramekin","karting","keratin","garment","germain","mangier","margent","marting","metring","migrant","migrate","mintage","ragtime","reaming","teaming","terming","granite","ingrate","tangier","tearing","making","market","merkin","arking","raking","taking","intake","reknit","takier","tanker","tinker","arming","enigma","gamier","gamine","german","imager","magnet","maigre","manger","margin","mating","minger","mirage","taming","inmate","marine","marten","matier","minter","remain","remint","argent","eating","gainer","garnet","gratin","rating","regain","regina","triage","retain","retina","maker","anker","inker","kiter","taken","taker","trank","trike","gamer","grime","image","aimer","anime","inarm","mater","meant","merit","miner","namer","ramen","remit","tamer","timer","agent","anger","gater","giant","grant","grate","great","range","reign","retag","tiger","tinge","inert","inter","irate","train","mark","mike","mink","akin","kent","knit","rake","rank","rink","take","germ","gram","grim","mage","mega","amen","emit","item","mane","mare","mart","meat","meta","mint","mire","ream","team","term","time","tram","trim","gait","gear","gent","grin","gnar","gnat","gran","rage","ring","trig","ante","anti","earn","near","neat","rain","rant","rate","rent","rite","tain","tarn","tern","tier","tire"] },
  CAMPAIGNS: { l: ["C","A","M","P","A","I","G","N","S"], w: ["campaigns","campaign","campings","paganism","scamping","caimans","camping","magians","maniacs","scaping","siamang","spacing","agamic","amigas","amping","animas","caiman","camisa","capias","casing","gamins","gasman","macing","magian","magics","mangas","maniac","manias","manics","pacing","pagans","paisan","pangas","panics","sampan","scampi","again","agism","agmas","amain","amias","amiga","amins","amnia","angas","anima","apian","aping","aspic","cains","camas","campi","camps","gains","gamas","gamic","gamin","gamps","magic","mains","manas","manga","mania","manic","micas","minas","napas","nipas","pacas","pagan","pains","paisa","panga","pangs","panic","pians","picas","pimas","pinas","pings","saiga","sanga","scamp","sigma","signa","spang","spica","agas","agin","agma","aims","ains","amas","amia","amin","amis","amps","anas","anga","anis","ansa","asci","cain","camp","cams","cans","caps","casa","cigs","gain","gama","gamp","gams","gaps","gasp","gins","imps","macs","magi","mags","main","mana","mans","maps","masa","mica","mics","mina","nags","napa","naps","nipa","paca","pacs","pain","pams","pang","pans","pian","pias","pica","pics","pigs","pima","pina","ping","pins","saga","sain","samp","sang","scam","scan","sign","sima","simp","sing","snag","snap","snip","spam","span","spin"] },
  PROMOTION: { l: ["P","R","O","M","O","T","I","O","N"], w: ["promotion","moonport","monitor","portion","tompion","import","morion","motion","option","potion","pronto","proton","tropin","intro","minor","moron","motor","nitro","nomoi","orpin","pinot","pinto","piton","point","poori","primo","print","prion","promo","topoi","tromp","troop","inro","into","iron","mint","mono","moon","moor","moot","morn","mort","noir","nori","norm","omit","onto","pint","pion","pirn","pomo","poon","poor","poot","port","prim","prom","riot","romp","room","root","roti","roto","tiro","toom","toon","topi","topo","tori","torn","toro","trim","trio","trip"] },
  TARGETING: { l: ["T","A","R","G","E","T","I","N","G"], w: ["targeting","gnattier","treating","gearing","getting","gittern","granite","gratine","grating","ingrate","intreat","iterant","naggier","nattier","nitrate","ratting","retting","tangier","tarting","tearing","tertian","ageing","aigret","argent","attire","earing","eating","engirt","gaeing","gainer","gaiter","ganger","garget","garnet","gating","ginger","grange","gratin","ingate","nagger","natter","raging","ratine","rating","ratite","ratten","reagin","regain","regina","retain","retina","retint","tagger","target","taring","tinter","triage","agent","agger","aggie","aging","anger","antre","eggar","gager","garni","gater","giant","grain","grant","grate","great","inert","inter","irate","niter","nitre","range","reign","retag","retia","riant","taint","targe","tater","tenia","terai","tiger","tinea","tinge","titan","titer","titre","train","trait","treat","trine","trite","ager","agin","airn","airt","ante","anti","earn","etna","gaen","gage","gain","gait","gane","gang","gate","gear","gent","geta","gien","giga","girn","girt","gite","gnar","gnat","gran","grig","grin","grit","iter","near","neat","nett","nite","rage","ragg","ragi","rain","rang","rani","rant","rate","rein","rent","ring","rite","tain","tang","tare","tarn","tart","tate","tear","teat","tent","tern","tier","tine","ting","tint","tire","tret","trig"] },
  PRINTABLE: { l: ["P","R","I","N","T","A","B","L","E"], w: ["printable","interlap","partible","trapline","triplane","bepaint","biplane","latrine","librate","painter","pantile","pertain","plainer","plaiter","planter","platier","praline","ratline","reliant","repaint","replant","retinal","trenail","triable","albeit","albite","aliner","alpine","antler","aplite","arpent","bailer","baiter","banter","barite","berlin","binate","enrapt","entail","entrap","labret","larine","learnt","leptin","librae","linear","linter","nailer","palier","palter","panier","pantie","parent","patine","penial","pineal","pineta","pintle","pirate","plaint","planer","planet","platen","plater","pliant","pterin","rapine","ratine","ratlin","rebait","renail","rental","replan","retail","retain","retial","retina","riblet","tailer","tenail","terbia","tineal","trepan","tribal","trinal","triple","abler","alert","alien","aline","alter","anile","antre","apter","ariel","arpen","artel","atrip","bairn","baler","binal","biner","birle","biter","blain","blare","blate","blear","bleat","blent","blite","brail","brain","brant","brent","brine","elain","inapt","inept","inert","inlet","inter","irate","lapin","laten","later","leant","leapt","learn","liane","liber","libra","liner","liter","litre","niter","nitre","paint","paler","palet","panel","parle","paten","pater","patin","pearl","peart","penal","peril","petal","pieta","pilea","pinta","plain","plait","plane","plant","plate","pleat","plena","plier","prate","print","ratel","relit","renal","repin","retia","riant","ripen","taber","table","taler","taper","tapir","telia","tenia","tepal","terai","tiler","tinea","trail","train","trial","tribe","trine","tripe","abet","able","abri","airn","airt","alit","anil","ante","anti","aper","aril","bail","bait","bale","bane","bare","barn","bate","bean","bear","beat","belt","bent","beta","bier","bile","bine","bint","birl","bite","blae","blat","blet","blin","blip","brae","bran","brat","bren","brie","brin","brit","earl","earn","elan","etna","ilea","iter","lain","lair","lane","lari","late","lati","lean","leap","lear","lent","liar","lien","lier","line","lint","lipa","lipe","lira","lire","lite","nabe","nail","nape","neap","near","neat","nipa","nite","pail","pain","pair","pale","pane","pant","pare","part","pate","peal","pean","pear","peat","pein","pelt","pent","peri","pert","pial","pian","pier","pile","pina","pine","pint","pirn","pita","plan","plat","plea","pleb","plie","prat","rail","rain","rale","rani","rant","rape","rapt","rate","real","reap","rein","rent","rial","riel","rile","ripe","rite","tael","tail","tain","tale","tali","tape","tare","tarn","tarp","teal","tear","tela","tern","tier","tile","tine","tire","tirl","trap","trip"] },
  MAGAZINES: { l: ["M","A","G","A","Z","I","N","E","S"], w: ["magazines","magazine","magnesia","agnizes","amazing","amnesia","anemias","enigmas","gamines","magians","manages","sagamen","seaming","siamang","ageism","agnize","amazes","amigas","amines","anemia","animas","animes","azines","easing","enigma","gamine","gamins","gasman","gasmen","images","inseam","magian","maizes","manage","mangas","manges","manias","mazing","mesian","mizens","nizams","seaman","semina","zamias","zanies","aegis","again","agaze","agism","agmas","amain","amaze","amens","amias","amies","amiga","amine","amins","amnia","angas","anima","anime","anise","ansae","azans","azine","gains","gamas","games","gamin","gazes","image","mages","mains","maize","manas","manes","manga","mange","mania","manse","mazes","means","mensa","miens","minae","minas","mines","mizen","names","nemas","nizam","saiga","sanga","segni","sengi","sigma","signa","singe","smaze","zamia","zeins","zines","zings","agas","ages","agin","agma","aims","ains","amas","amen","amia","amie","amin","amis","anas","anga","anis","ansa","asea","azan","gaen","gaes","gain","gama","game","gams","gane","gaze","gems","gens","gien","gies","gins","maes","mage","magi","mags","main","mana","mane","mans","masa","maze","mean","mega","megs","mesa","mien","mina","mine","mise","nags","name","nema","nims","saga","sage","sain","same","sane","sang","seam","semi","sign","sima","sine","sing","size","snag","zags","zein","zigs","zine","zing"] },
  EDITORIAL: { l: ["E","D","I","T","O","R","I","A","L"], w: ["editorial","idolater","tailored","dariole","delator","deliria","dilater","dilator","diorite","leotard","redtail","trailed","adroit","airted","ariled","dartle","derail","detail","dialer","dilate","dotier","editor","eidola","iodate","iolite","laired","loader","loiter","oilier","orated","ordeal","railed","redial","relaid","reload","retail","retial","retold","rialto","rioted","roadie","roiled","tailed","tailer","tailor","tidier","tirade","tirled","toiled","toiler","triode","adore","aider","ailed","aioli","aired","alder","alert","alter","ariel","aroid","artel","dater","deair","dealt","delta","derat","dotal","doter","drail","droit","ideal","idiot","idler","irade","irate","lader","laird","lated","later","liard","lidar","lirot","liter","litre","oared","oater","oiled","oiler","older","oldie","orate","oread","oriel","radii","radio","rated","ratel","ratio","redia","relit","reoil","retia","riled","taler","tared","teiid","telia","teloi","terai","tidal","tilde","tiled","tiler","tired","toile","tolar","toled","torii","trade","trail","tread","triad","trial","tried","triol","trode","adit","aero","aide","airt","alit","aloe","alto","arid","aril","dale","dare","dart","date","dato","deal","dear","deil","deli","delt","dial","diel","diet","diol","dire","dirl","dirt","dita","dite","doat","doer","doit","dole","dolt","dore","dote","drat","earl","edit","idea","idle","idol","ilea","iota","ired","irid","iter","lade","laid","lair","lard","lari","late","lati","lead","lear","liar","lido","lied","lier","lira","lire","lite","load","lode","loid","lord","lore","lota","loti","odea","olea","orad","oral","orle","raid","rail","rale","rate","rato","read","real","redo","rial","ride","riel","rile","riot","rite","road","rode","roil","role","rota","rote","roti","rotl","tael","tail","tale","tali","tare","taro","teal","tear","tela","tide","tied","tier","tile","tire","tirl","tiro","toad","toea","toed","toil","tola","told","tole","tora","tore","tori","trad","trio","trod"] },
  INTERVIEW: { l: ["I","N","T","E","R","V","I","E","W"], w: ["interview","reinvite","invitee","inviter","niterie","twinier","veinier","viewier","vitrine","entire","envier","invert","invite","retine","review","tinier","triene","twiner","veiner","venire","venter","verite","viewer","vinier","weiner","wiener","wienie","winier","winter","wivern","enter","event","evert","evite","inert","inter","nerve","never","newer","newie","nieve","niter","nitre","reive","renew","rente","retie","revet","rewet","rewin","riven","rivet","terne","treen","trine","tween","twier","twine","wiver","write","erne","even","ever","ewer","inti","iter","neve","nevi","newt","nite","rein","rent","rete","rite","rive","teen","tern","tier","tine","tire","tree","twee","twin","veer","vein","vent","vert","vier","view","vine","ween","weer","weet","weir","went","were","wert","wine","wire","wite","wive","wren","writ"] },
  PUBLISHED: { l: ["P","U","B","L","I","S","H","E","D"], w: ["published","sulphide","blueish","blushed","publish","sulphid","bields","bipeds","bluish","builds","bushed","bushel","busied","delish","dispel","lisped","lushed","pileus","pished","pulsed","pushed","shield","sliped","spiled","upheld","upside","bides","bield","biles","biped","blips","blued","blues","blush","buhls","build","bused","deils","delis","duels","dulse","dupes","duple","heils","helps","hides","hilus","idles","ileus","isled","leuds","lieus","lubed","lubes","ludes","piled","piles","pilus","plebs","plied","plies","plush","pseud","pubes","pubis","puled","pules","pulis","pulse","shied","shiel","shlep","shlub","sidhe","siped","slide","slipe","slued","speil","spied","spiel","spile","spued","beds","bels","bide","bids","bile","bise","bled","blip","blue","buds","buhl","bush","debs","deil","deli","dels","dibs","diel","dies","dips","dish","dubs","duel","dues","dupe","dups","edhs","elds","elhi","heil","held","help","hide","hied","hies","hips","hubs","hued","hues","ides","idle","isle","leis","leud","libs","lids","lied","lies","lieu","lipe","lips","lisp","lube","lude","lues","lush","peds","pehs","phis","pied","pies","pile","pish","pleb","pled","plie","plus","pubs","puds","pule","puli","puls","push","shed","ship","shul","side","sidh","sild","sipe","sled","slid","slip","slub","slue","sped","spud","spue","sued","supe","used"] },
};

// ═══ KEEP GOING ═══
var DL = ["","Easy","Warming up","Medium","Tough","Hard","Brutal"];
var DC = ["","#1D9E75","#639922","#EF9F27","#D85A30","#E24B4A","#A32D2D"];
function genQ(lv) {
  var r=function(a,b){return a+Math.floor(Math.random()*(b-a+1));};
  if(lv<=1){var a=r(2,20),b=r(1,10),op=Math.random()>0.5?"+":"-";var ans=op==="+"?a+b:a-b;var w1=ans+r(1,3),w2=ans-r(1,5);return{q:a+" "+op+" "+b,answer:ans,opts:shuffle([ans,w1===ans?w1+1:w1,w2===ans||w2===w1?w2+2:w2])};}
  if(lv===2){var a=r(10,50),b=r(5,25),op=Math.random()>0.5?"+":"-";var ans=op==="+"?a+b:a-b;var w1=ans+r(1,4),w2=ans-r(3,7);return{q:a+" "+op+" "+b,answer:ans,opts:shuffle([ans,w1===ans?w1+2:w1,w2===ans||w2===w1?w2+3:w2])};}
  if(lv===3){var a=r(10,40),b=r(2,12),c=r(1,10);var o1=Math.random()>0.5?"+":"-",o2=["+","-","\u00d7"][Math.floor(Math.random()*3)];var ans=o1==="+"?a+b:a-b;ans=o2==="+"?ans+c:o2==="-"?ans-c:ans*c;var w1=ans+(r(-5,5)||3),w2=ans+(r(-8,8)||-4);return{q:"("+a+" "+o1+" "+b+") "+o2+" "+c,answer:ans,opts:shuffle([ans,w1===ans?w1+3:w1,w2===ans||w2===w1?w2+4:w2])};}
  if(lv===4){var a=r(15,60),b=r(3,15),c=r(2,8);var ans=(a+b)*c;var w1=a*c+b,w2=ans+(r(-10,10)||7);return{q:"("+a+" + "+b+") \u00d7 "+c,answer:ans,opts:shuffle([ans,w1===ans?w1+5:w1,w2===ans||w2===w1?w2+6:w2])};}
  if(lv===5){var a=r(20,80),b=r(5,20),c=r(2,6),d=r(1,15);var ans=(a+b)*c-d;var w1=(a+b)*c+d,w2=a*c-d+b;return{q:"("+a+" + "+b+") \u00d7 "+c+" - "+d,answer:ans,opts:shuffle([ans,w1===ans?w1+4:w1,w2===ans||w2===w1?w2+5:w2])};}
  var a=r(30,99),b=r(10,40),c=r(3,9),d=r(5,25);var ans=(a-b)*c+d;var w1=(a+b)*c-d,w2=(a-b)*c-d;return{q:"("+a+" - "+b+") \u00d7 "+c+" + "+d,answer:ans,opts:shuffle([ans,w1===ans?w1+7:w1,w2===ans||w2===w1?w2+8:w2])};
}

// ═══ INFO SCAN ═══
var SPractice = {name:"John Smith",title:"Marketing Director",company:"BrightWave Media",industry:"Media & Advertising",hq:"Sydney",revenue:"$18M",employees:"50",region:"Oceania",founded:"2015",questions:[{q:"What is John Smith's job title?",answer:"Marketing Director",opts:["Marketing Director","Creative Director","Sales Manager"]},{q:"Where is BrightWave Media based?",answer:"Sydney",opts:["Sydney","Melbourne","Auckland"]}]};
var SP = [
  {name:"Mei Lin Tan",title:"Chief Revenue Officer",company:"Dragon Gate Capital",industry:"Financial Services",hq:"Singapore",revenue:"$3.2B",employees:"8,500",region:"Southeast Asia",founded:"2001",questions:[{q:"What is Mei Lin Tan's title?",answer:"Chief Revenue Officer",opts:["Chief Revenue Officer","Chief Financial Officer","VP of Sales"]},{q:"What is Dragon Gate Capital's revenue?",answer:"$3.2B",opts:["$3.2B","$6.8B","$420M"]},{q:"Where is Dragon Gate Capital HQ'd?",answer:"Singapore",opts:["Singapore","Jakarta","Shanghai"]},{q:"How many employees at Dragon Gate?",answer:"8,500",opts:["8,500","15,000","6,200"]},{q:"When was Dragon Gate founded?",answer:"2001",opts:["2001","1994","2010"]}]},
  {name:"Hiroshi Yamamoto",title:"VP of Strategy",company:"Sakura Industries",industry:"Manufacturing",hq:"Osaka",revenue:"$6.8B",employees:"34,000",region:"East Asia",founded:"1976",questions:[{q:"What is Hiroshi Yamamoto's title?",answer:"VP of Strategy",opts:["VP of Strategy","Director of Innovation","Chief Marketing Officer"]},{q:"Where is Sakura Industries HQ'd?",answer:"Osaka",opts:["Osaka","Tokyo","Seoul"]},{q:"How many employees at Sakura?",answer:"34,000",opts:["34,000","22,000","8,500"]},{q:"What industry is Sakura in?",answer:"Manufacturing",opts:["Manufacturing","Logistics & Supply Chain","Real Estate & Hospitality"]},{q:"What is Sakura's revenue?",answer:"$6.8B",opts:["$6.8B","$4.7B","$3.2B"]}]},
  {name:"Priya Nair",title:"Head of Digital",company:"Monsoon Ventures",industry:"Technology Consulting",hq:"Bangalore",revenue:"$420M",employees:"2,100",region:"South Asia",founded:"2010",questions:[{q:"What industry is Monsoon Ventures in?",answer:"Technology Consulting",opts:["Technology Consulting","Financial Services","Healthcare & Biotech"]},{q:"When was Monsoon Ventures founded?",answer:"2010",opts:["2010","2001","2015"]},{q:"Where is Monsoon Ventures HQ'd?",answer:"Bangalore",opts:["Bangalore","Mumbai","Jakarta"]},{q:"What is Priya Nair's title?",answer:"Head of Digital",opts:["Head of Digital","Chief Revenue Officer","Group CEO"]},{q:"How many employees at Monsoon?",answer:"2,100",opts:["2,100","6,200","8,500"]}]},
  {name:"Daniel Kwon",title:"Chief Marketing Officer",company:"Atlas Pacific Group",industry:"Real Estate & Hospitality",hq:"Seoul",revenue:"$1.5B",employees:"6,200",region:"East Asia",founded:"1994",questions:[{q:"What is Daniel Kwon's role?",answer:"Chief Marketing Officer",opts:["Chief Marketing Officer","VP of Strategy","Head of Digital"]},{q:"What industry is Atlas Pacific in?",answer:"Real Estate & Hospitality",opts:["Real Estate & Hospitality","Logistics & Supply Chain","Manufacturing"]},{q:"Where is Atlas Pacific HQ'd?",answer:"Seoul",opts:["Seoul","Osaka","Shanghai"]},{q:"What is Atlas Pacific's revenue?",answer:"$1.5B",opts:["$1.5B","$2.1B","$3.2B"]},{q:"When was Atlas Pacific founded?",answer:"1994",opts:["1994","1976","1988"]}]},
  {name:"Anika Rahman",title:"Group CEO",company:"Emerald Trade Networks",industry:"Logistics & Supply Chain",hq:"Jakarta",revenue:"$2.1B",employees:"15,000",region:"Southeast Asia",founded:"1988",questions:[{q:"Where is Emerald Trade HQ'd?",answer:"Jakarta",opts:["Jakarta","Singapore","Bangalore"]},{q:"How many employees at Emerald Trade?",answer:"15,000",opts:["15,000","6,200","34,000"]},{q:"What is Anika Rahman's title?",answer:"Group CEO",opts:["Group CEO","Chief Revenue Officer","Director of Innovation"]},{q:"What is Emerald Trade's revenue?",answer:"$2.1B",opts:["$2.1B","$1.5B","$4.7B"]},{q:"What industry is Emerald Trade in?",answer:"Logistics & Supply Chain",opts:["Logistics & Supply Chain","Real Estate & Hospitality","Technology Consulting"]}]},
  {name:"Wei Chen",title:"Director of Innovation",company:"Zenith Pharmaceuticals",industry:"Healthcare & Biotech",hq:"Shanghai",revenue:"$4.7B",employees:"22,000",region:"East Asia",founded:"1965",questions:[{q:"What is Zenith's revenue?",answer:"$4.7B",opts:["$4.7B","$2.1B","$6.8B"]},{q:"When was Zenith founded?",answer:"1965",opts:["1965","1976","1988"]},{q:"Where is Zenith HQ'd?",answer:"Shanghai",opts:["Shanghai","Osaka","Seoul"]},{q:"What is Wei Chen's title?",answer:"Director of Innovation",opts:["Director of Innovation","VP of Strategy","Chief Marketing Officer"]},{q:"How many employees at Zenith?",answer:"22,000",opts:["22,000","15,000","34,000"]}]},
];

// ═══ SNAP DECISION ═══
var SnapPractice = {situation:"A colleague asks you to help with their task, but you have your own deadline in an hour.",best:"Let them know you can help after your deadline and suggest a specific time",opts:["Drop everything and help them immediately","Let them know you can help after your deadline and suggest a specific time","Say you're too busy and can't help at all"]};
var SNAPS = [
  {situation:"A CEO says: \"We don't have time for awards.\"",best:"Acknowledge their time is valuable and briefly explain the nomination takes just 5 minutes",opts:["Acknowledge their time is valuable and briefly explain the nomination takes just 5 minutes","Offer to do the entire nomination on their behalf","Ask when they'd have more free time","Explain all the benefits of winning the award"]},
  {situation:"You've called a company 3 times and no one picks up.",best:"Try a different channel \u2014 email or LinkedIn message",opts:["Try a different channel \u2014 email or LinkedIn message","Call again at a different time of day","Mark them as unresponsive and move to the next lead","Ask the receptionist to schedule a callback"]},
  {situation:"A senior executive says they'll only give you 2 minutes.",best:"Deliver your key value prop in 30 seconds and ask one qualifying question",opts:["Deliver your key value prop in 30 seconds and ask one qualifying question","Rush through your entire pitch to fit the time","Ask to reschedule for a longer conversation","Thank them and send a follow-up email instead"]},
  {situation:"Mid-call, you realize you're speaking to the wrong department.",best:"Ask who the right person would be and request an introduction",opts:["Ask who the right person would be and request an introduction","Continue your pitch anyway \u2014 they might pass it along","Apologize and end the call","Ask them to transfer you directly"]},
  {situation:"A prospect says: \"Send me an email with the details.\"",best:"Agree, confirm exactly what to include, and set a specific follow-up date",opts:["Agree, confirm exactly what to include, and set a specific follow-up date","Say you'd prefer to explain everything over the phone","Send a detailed brochure right away without confirming what they need","Take it as a polite rejection and move on"]},
  {situation:"A prospect says: \"We participated last year and didn't see value.\"",best:"Ask what they expected vs what they experienced, then address the gap",opts:["Ask what they expected vs what they experienced, then address the gap","Explain that this year's event is completely different","Offer a discounted rate to try again","Share testimonials from other companies"]},
  {situation:"You can't find the right contact on the company's website.",best:"Check LinkedIn, search for the relevant department head by title",opts:["Check LinkedIn, search for the relevant department head by title","Call the general line and ask the receptionist","Email the info@ address with your pitch","Skip this company and move to the next one"]},
  {situation:"A prospect gets frustrated and says your call is wasting their time.",best:"Stay calm, acknowledge their frustration, and offer to follow up at a better time",opts:["Stay calm, acknowledge their frustration, and offer to follow up at a better time","Apologize repeatedly and end the call immediately","Defend your reason for calling \u2014 the opportunity is genuinely valuable","Offer something free to make up for the inconvenience"]},
  {situation:"Your target list has 40 companies. It's 3pm and you've only reached 8.",best:"Reprioritize \u2014 focus on the highest-value targets for the remaining time",opts:["Reprioritize \u2014 focus on the highest-value targets for the remaining time","Speed through calls with a shorter pitch","Stay late to finish the entire list","Report to your manager that the list is too large"]},
  {situation:"A prospect says: \"I need to check with my boss before committing.\"",best:"Ask who their boss is and offer to join a brief call with both of them",opts:["Ask who their boss is and offer to join a brief call with both of them","Say no problem and wait for them to get back to you","Ask them to forward your email to their boss","Push them to decide now since the deadline is approaching"]},
  {situation:"You're about to call a CEO but know very little about their company.",best:"Spend 5 minutes researching their recent news and focus before calling",opts:["Spend 5 minutes researching their recent news and focus before calling","Call anyway and ask them to tell you about their company","Skip them and come back tomorrow after research","Use a generic script that works for any company"]},
  {situation:"A prospect asks: \"How did you get my number?\"",best:"Explain you found them through professional research as a leader in their industry",opts:["Explain you found them through professional research as a leader in their industry","Deflect the question and redirect to your pitch","Say their colleague referred you","Apologize for the intrusion and offer to call back later"]},
  {situation:"A prospect keeps postponing the follow-up meeting.",best:"Suggest a very specific time \u2014 \"How about Tuesday at 10am for just 10 minutes?\"",opts:["Suggest a very specific time \u2014 \"How about Tuesday at 10am for just 10 minutes?\"","Keep following up weekly until they commit","Accept that they're not interested and move on","Send all info by email so they don't need a meeting"]},
  {situation:"A prospect asks a question you don't know the answer to.",best:"Be honest, say you'll find out, and follow up with the answer by end of day",opts:["Be honest, say you'll find out, and follow up with the answer by end of day","Give your best guess based on what you know","Redirect to something you do know","Put them on hold and ask a colleague"]},
  {situation:"A company you're targeting just had negative press coverage.",best:"Acknowledge the situation and position the award as a chance to highlight their strengths",opts:["Acknowledge the situation and position the award as a chance to highlight their strengths","Avoid mentioning it and proceed with your normal pitch","Postpone calling until the situation blows over","Lead with sympathy about the negative coverage"]},
];

// ═══ PROFILE CARD ═══
function PC(props) {
  var p=props.p;var fields=[["Industry",p.industry],["HQ",p.hq],["Revenue",p.revenue],["Employees",p.employees],["Region",p.region],["Founded",p.founded]];
  return (<div style={{padding:"16px",borderRadius:14,background:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",border:"2px solid #E1F5EE"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div style={{width:44,height:44,borderRadius:12,background:"#E1F5EE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:"#0F6E56"}}>{p.name.split(" ").map(function(n){return n[0];}).join("")}</div>
      <div><div style={{fontWeight:600,fontSize:15}}>{p.name}</div><div style={{fontSize:12,color:"#888"}}>{p.title+" \u00b7 "+p.company}</div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 14px",fontSize:13}}>
      {fields.map(function(f){return(<div key={f[0]} style={{padding:"5px 0",borderBottom:"0.5px solid #f0f0ec"}}><span style={{color:"#999",fontSize:11}}>{f[0]}</span><div style={{fontWeight:500}}>{f[1]}</div></div>);})}
    </div>
  </div>);
}

// ═══ MAIN APP ═══
export default function App() {
  var _s=useState("name"),screen=_s[0],setScreen=_s[1];
  var _g=useState(0),gi=_g[0],setGi=_g[1];
  var _gr=useState([]),gResults=_gr[0],setGResults=_gr[1];
  var _an=useState(""),appName=_an[0],setAppName=_an[1];
  var _sub=useState("idle"),submitStatus=_sub[0],setSubmitStatus=_sub[1];
  // Sub-screen within each game
  var _ss=useState("intro"),sub=_ss[0],setSub=_ss[1];

  // Word Sprint
  var _wr=useState([]),wRounds=_wr[0],setWRounds=_wr[1];
  var _wri=useState(0),wri=_wri[0],setWri=_wri[1];
  var _wi=useState(""),wIn=_wi[0],setWIn=_wi[1];
  var _wfo=useState([]),wFound=_wfo[0],setWFound=_wfo[1];
  var _wt=useState(30),wTime=_wt[0],setWTime=_wt[1];
  var _wfb=useState(null),wFb=_wfb[0],setWFb=_wfb[1];
  var _wre=useState([]),wRes=_wre[0],setWRes=_wre[1];
  var _wsf=useState([]),wSF=_wsf[0],setWSF=_wsf[1];
  var _wst=useState(15),wST=_wst[0],setWST=_wst[1];
  var _wsc=useState([]),wScr=_wsc[0],setWScr=_wsc[1];
  var wRef=useRef(null),wIRef=useRef(null);

  // Keep Going
  var _kl=useState(1),kLv=_kl[0],setKLv=_kl[1];
  var _kq=useState(null),kQ=_kq[0],setKQ=_kq[1];
  var _ks=useState(0),kStr=_ks[0],setKStr=_ks[1];
  var _kms=useState(0),kMS=_kms[0],setKMS=_kms[1];
  var _kml=useState(1),kML=_kml[0],setKML=_kml[1];
  var _kt=useState(0),kTot=_kt[0],setKTot=_kt[1];
  var _kc=useState(0),kCor=_kc[0],setKCor=_kc[1];
  var _kfb=useState(null),kFb=_kfb[0],setKFb=_kfb[1];
  var _kw=useState(0),kWr=_kw[0],setKWr=_kw[1];
  var _ktl=useState(90),kTime=_ktl[0],setKTime=_ktl[1];
  var _kdq=useState(false),kQuit=_kdq[0],setKQuit=_kdq[1];
  var _ksc=useState(0),kSC=_ksc[0],setKSC=_ksc[1];
  var _kscr=useState(0),kSCr=_kscr[0],setKSCr=_kscr[1];
  var _ksfb=useState(null),kSFb=_ksfb[0],setKSFb=_ksfb[1];
  var kRef=useRef(null),kDone=useRef(false);

  // Info Scan
  var _sp=useState([]),sProf=_sp[0],setSProf=_sp[1];
  var _sq=useState([]),sQs=_sq[0],setSQs=_sq[1];
  var _spi=useState(0),spi=_spi[0],setSpi=_spi[1];
  var _sqi=useState(0),sqi=_sqi[0],setSqi=_sqi[1];
  var _sph=useState("study"),sPh=_sph[0],setSPh=_sph[1];
  var _sst=useState(10),sSt=_sst[0],setSSt=_sst[1];
  var _ssc=useState(0),sSc=_ssc[0],setSSc=_ssc[1];
  var _sfb=useState(null),sFb=_sfb[0],setSFb=_sfb[1];
  var _sso=useState([]),sOp=_sso[0],setSOp=_sso[1];
  var _spph=useState("study"),sPPh=_spph[0],setSPPh=_spph[1];
  var _spst=useState(12),sPSt=_spst[0],setSPSt=_spst[1];
  var _spqi=useState(0),sPQi=_spqi[0],setSPQi=_spqi[1];
  var _spsc=useState(0),sPSc=_spsc[0],setSPSc=_spsc[1];
  var _spfb=useState(null),sPFb=_spfb[0],setSPFb=_spfb[1];
  var _spo=useState([]),sPOp=_spo[0],setSPOp=_spo[1];
  var sRef=useRef(null),sDone=useRef(false);

  // Snap Decision
  var _ns=useState([]),nSc=_ns[0],setNSc=_ns[1];
  var _nsi=useState(0),nsi=_nsi[0],setNsi=_nsi[1];
  var _nsc=useState(0),nSco=_nsc[0],setNSco=_nsc[1];
  var _nfb=useState(null),nFb=_nfb[0],setNFb=_nfb[1];
  var _nt=useState(15),nTime=_nt[0],setNTime=_nt[1];
  var _nso=useState([]),nOp=_nso[0],setNOp=_nso[1];
  var _npfb=useState(null),nPFb=_npfb[0],setNPFb=_npfb[1];
  var _npo=useState([]),nPOp=_npo[0],setNPOp=_npo[1];
  var _nps=useState(0),nPS=_nps[0],setNPS=_nps[1];
  var nRef=useRef(null),nDone=useRef(false);

  var game=GAMES[gi];
  var submitResults=function(results){
    setSubmitStatus("sending");
    var pct=results.map(function(r){return r.total>0?Math.round((r.score/r.total)*100):0;});
    var payload={name:appName.trim(),wordSprint:pct[0],keepGoing:pct[1],infoScan:pct[2],snapDecision:pct[3],timestamp:new Date().toISOString()};
    fetch(SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}).then(function(){setSubmitStatus("sent");}).catch(function(){setSubmitStatus("error");});
  };
  var finishGame=function(result){var nr=[].concat(gResults,[result]);setGResults(nr);if(gi+1<GAMES.length){setGi(gi+1);setSub("intro");}else{setScreen("final");submitResults(nr);}};

  // ═══ TIMERS ═══
  useEffect(function(){
    if(screen!=="playing") return;
    var id=game.id;
    // Word Sprint timers
    if(id==="word"&&(sub==="sample"||sub==="game")){
      wRef.current=setInterval(function(){if(sub==="sample")setWST(function(t){return t-1;});else setWTime(function(t){return t-1;});},1000);
      return function(){clearInterval(wRef.current);};
    }
    // Keep Going timer
    if(id==="keep"&&sub==="game"){
      kRef.current=setInterval(function(){setKTime(function(t){return t-1;});},1000);
      return function(){clearInterval(kRef.current);};
    }
    // Info Scan study timer
    if(id==="scan"&&((sub==="practice"&&sPPh==="study")||(sub==="game"&&sPh==="study"))){
      sRef.current=setInterval(function(){if(sub==="practice")setSPSt(function(t){return t-1;});else setSSt(function(t){return t-1;});},1000);
      return function(){clearInterval(sRef.current);};
    }
    // Snap timer
    if(id==="snap"&&sub==="game"){
      nRef.current=setInterval(function(){setNTime(function(t){return t-1;});},1000);
      return function(){clearInterval(nRef.current);};
    }
  },[screen,sub,gi,sPPh,sPh,spi,wri,nsi]);

  // Word Sprint time-up
  useEffect(function(){if(screen==="playing"&&game.id==="word"&&sub==="sample"&&wST<=0){clearInterval(wRef.current);setSub("sampleresult");}}, [wST,sub,screen]);
  useEffect(function(){if(screen==="playing"&&game.id==="word"&&sub==="game"&&wTime<=0){clearInterval(wRef.current);var bk=WB[wRounds[wri]];var mx=Math.min(bk.w.length,15);var nr=[].concat(wRes,[{bank:wRounds[wri],found:wFound.length,max:mx}]);setWRes(nr);if(wri+1<3){setWri(wri+1);setWFound([]);setWIn("");setWTime(30);setWFb(null);setSub("roundbreak");}else{finishGame({label:"Word sprint",score:nr.reduce(function(a,r){return a+r.found;},0),total:nr.reduce(function(a,r){return a+r.max;},0)});}}}, [wTime,sub,screen]);

  // Keep Going time-up
  useEffect(function(){if(screen==="playing"&&game.id==="keep"&&sub==="game"&&kTime<=0&&!kDone.current){kDone.current=true;clearInterval(kRef.current);finishGame({label:"Keep going",score:kCor,total:Math.max(kTot,1),maxLevel:kML,maxStreak:kMS,quit:false});}}, [kTime,sub,screen]);

  // Info Scan study end
  useEffect(function(){if(screen==="playing"&&game.id==="scan"&&sub==="practice"&&sPPh==="study"&&sPSt<=0){clearInterval(sRef.current);setSPPh("answer");setSPOp(shuffle([].concat(SPractice.questions[0].opts)));}}, [sPSt,sub,sPPh,screen]);
  useEffect(function(){if(screen==="playing"&&game.id==="scan"&&sub==="game"&&sPh==="study"&&sSt<=0){clearInterval(sRef.current);setSPh("answer");setSOp(shuffle([].concat(sQs[spi][0].opts)));}}, [sSt,sub,sPh,screen,spi]);

  // Snap time-up
  useEffect(function(){if(screen==="playing"&&game.id==="snap"&&sub==="game"&&nTime<=0&&!nDone.current){clearInterval(nRef.current);setNFb("timeout");var ns=nSco;setTimeout(function(){setNFb(null);if(nsi+1<nSc.length){setNsi(nsi+1);setNTime(15);setNOp(shuffle([].concat(nSc[nsi+1].opts)));}else{nDone.current=true;finishGame({label:"Snap decision",score:ns,total:nSc.length});}},1200);}}, [nTime,sub,screen]);

  // Focus word input
  useEffect(function(){if(screen==="playing"&&game.id==="word"&&(sub==="sample"||sub==="game")&&wIRef.current)wIRef.current.focus();},[sub,wri,screen]);

  // ═══ GAME ACTIONS ═══
  var wValidate=function(w,bank){var avail=bank.l.map(function(x){return x.toLowerCase();});var used=[].concat(avail);for(var i=0;i<w.length;i++){var idx=used.indexOf(w[i]);if(idx===-1)return"badletters";used.splice(idx,1);}if(bank.w.indexOf(w)!==-1)return"correct";return"wrong";};
  var wSubmit=function(){var w=wIn.trim().toLowerCase();if(!w||w.length<4){setWFb("short");setWIn("");setTimeout(function(){setWFb(null);},600);return;}var isSample=sub==="sample";var cf=isSample?wSF:wFound;var bank=isSample?WSample:WB[wRounds[wri]];if(cf.indexOf(w)!==-1){setWFb("duplicate");setWIn("");setTimeout(function(){setWFb(null);},600);return;}var res=wValidate(w,isSample?{l:WSample.letters,w:WSample.words}:bank);setWFb(res);if(res==="correct"){if(isSample)setWSF(function(f){return[].concat(f,[w]);});else setWFound(function(f){return[].concat(f,[w]);});}setWIn("");setTimeout(function(){setWFb(null);},500);if(wIRef.current)wIRef.current.focus();};

  var kPick=function(val,el){if(kFb!==null||kDone.current)return;pop(el);var correct=val===kQ.answer;setKTot(function(t){return t+1;});setKFb(correct?"correct":"wrong");if(correct){var ns=kStr+1;setKCor(function(c){return c+1;});setKStr(ns);setKMS(function(m){return Math.max(m,ns);});setKWr(0);if(ns%3===0&&kLv<6){var nl=kLv+1;setKLv(nl);setKML(function(m){return Math.max(m,nl);});}}else{setKStr(0);setKWr(function(w){return w+1;});}setTimeout(function(){var nl2=correct&&(kStr+1)%3===0?Math.min(kLv+1,6):kLv;setKQ(genQ(nl2));setKFb(null);},600);};

  var kSamplePick=function(val,el){if(kSFb!==null)return;pop(el);var correct=val===kQ.answer;if(correct)setKSCr(function(c){return c+1;});setKSFb(correct?"correct":"wrong");var nc=kSC+1;setKSC(nc);setTimeout(function(){setKSFb(null);if(nc>=2){setSub("sampleresult");}else{setKQ(genQ(1));}},800);};

  var sPracticePick=function(val,el){if(sPFb!==null)return;pop(el);var correct=val===SPractice.questions[sPQi].answer;if(correct)setSPSc(function(s){return s+1;});setSPFb(correct?"correct":"wrong");setTimeout(function(){setSPFb(null);if(sPQi+1<SPractice.questions.length){setSPQi(sPQi+1);setSPOp(shuffle([].concat(SPractice.questions[sPQi+1].opts)));}else{setSub("sampleresult");}},1000);};

  var sGamePick=function(val,el){if(sFb!==null||sDone.current)return;pop(el);var cq=sQs[spi][sqi];var correct=val===cq.answer;var ns=correct?sSc+1:sSc;if(correct)setSSc(ns);setSFb(correct?"correct":"wrong");setTimeout(function(){setSFb(null);if(sqi+1<sQs[spi].length){setSqi(sqi+1);setSOp(shuffle([].concat(sQs[spi][sqi+1].opts)));}else if(spi+1<sProf.length){setSpi(spi+1);setSqi(0);setSPh("study");setSSt(Math.max(10-(spi+1)*2,6));}else{sDone.current=true;finishGame({label:"Info scan",score:ns,total:6});}},1000);};

  var nPick=function(val,el){if(nFb!==null||nDone.current)return;pop(el);clearInterval(nRef.current);var correct=val===nSc[nsi].best;var ns=correct?nSco+1:nSco;if(correct)setNSco(ns);setNFb(correct?"correct":"wrong");setTimeout(function(){setNFb(null);if(nsi+1<nSc.length){setNsi(nsi+1);setNTime(15);setNOp(shuffle([].concat(nSc[nsi+1].opts)));}else{nDone.current=true;finishGame({label:"Snap decision",score:ns,total:nSc.length});}},1200);};
  var nPracticePick=function(val,el){if(nPFb!==null)return;pop(el);var correct=val===SnapPractice.best;if(correct)setNPS(1);setNPFb(correct?"correct":"wrong");setTimeout(function(){setSub("sampleresult");},1000);};

  // ═══ SETUP FUNCTIONS ═══
  var setupWord=function(){var keys=shuffle(Object.keys(WB)).slice(0,3);setWRounds(keys);setWri(0);setWFound([]);setWIn("");setWTime(30);setWRes([]);setWSF([]);setWST(15);setSub("practice_intro");};
  var setupKeep=function(){setKLv(1);setKQ(genQ(1));setKStr(0);setKMS(0);setKML(1);setKTot(0);setKCor(0);setKFb(null);setKWr(0);setKTime(90);setKQuit(false);kDone.current=false;setKSC(0);setKSCr(0);setKSFb(null);setSub("practice_intro");};
  var setupScan=function(){var sel=shuffle([].concat(SP)).slice(0,3);var qs=sel.map(function(p){return shuffle([].concat(p.questions)).slice(0,2);});setSProf(sel);setSQs(qs);setSpi(0);setSqi(0);setSSc(0);sDone.current=false;setSPPh("study");setSPSt(12);setSPQi(0);setSPSc(0);setSPFb(null);setSub("practice_intro");};
  var setupSnap=function(){var picked=shuffle([].concat(SNAPS)).slice(0,7);setNSc(picked);setNsi(0);setNSco(0);setNFb(null);setNTime(15);nDone.current=false;setNPFb(null);setNPS(0);setSub("practice_intro");};

  var startCurrentGame=function(){var id=game.id;if(id==="word")setupWord();else if(id==="keep")setupKeep();else if(id==="scan")setupScan();else setupSnap();setScreen("playing");};

  // Current game helpers
  var wCurFound=sub==="sample"?wSF:wFound;
  var wCurTime=sub==="sample"?wST:wTime;
  var wMaxTime=sub==="sample"?15:30;
  var wPct=Math.max((wCurTime/wMaxTime)*100,0);
  var wTClr=wCurTime<=5?"#E24B4A":wCurTime<=10?"#EF9F27":"#534AB7";
  var kPct=Math.max((kTime/90)*100,0);
  var kTClr=kTime<=15?"#E24B4A":kTime<=30?"#EF9F27":"#D85A30";
  var sCurStudy=sub==="practice"?sPSt:sSt;
  var sMaxStudy=sub==="practice"?12:Math.max(10-spi*2,6);
  var sSPct=Math.max((sCurStudy/sMaxStudy)*100,0);
  var sSTClr=sCurStudy<=3?"#E24B4A":"#1D9E75";
  var nPct=Math.max((nTime/15)*100,0);
  var nTClr=nTime<=5?"#E24B4A":nTime<=8?"#EF9F27":"#D4537E";

  return (
    <div style={{maxWidth:420,margin:"0 auto",fontFamily:"system-ui"}}>
      <style>{
        "@keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}"+
        "@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}"+
        "@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}"+
        "@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}"
      }</style>

      {/* ═══ NAME INPUT ═══ */}
      {screen==="name"&&(
        <div style={{textAlign:"center",padding:"40px 16px"}}>
          <div style={{fontSize:48,marginBottom:8,animation:"float 2s ease-in-out infinite"}}>{"\u270D\uFE0F"}</div>
          <h1 style={{fontSize:22,fontWeight:700,marginBottom:4,background:"linear-gradient(135deg,#D85A30,#D4537E)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Welcome</h1>
          <p style={{color:"#888",fontSize:13,lineHeight:1.6,marginBottom:20}}>Please enter your name to begin the assessment</p>
          <input value={appName} onChange={function(e){setAppName(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&appName.trim())setScreen("intro");}} placeholder="Your full name" style={{width:"100%",maxWidth:300,padding:"12px 16px",borderRadius:12,border:"2px solid #eee",fontSize:15,outline:"none",textAlign:"center",marginBottom:16,boxSizing:"border-box"}} />
          <br />
          <button onClick={function(){if(appName.trim())setScreen("intro");}} style={{padding:"12px 36px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:appName.trim()?"pointer":"default",background:appName.trim()?"linear-gradient(135deg,#D85A30,#D4537E)":"#ccc",color:"#fff",boxShadow:appName.trim()?"0 4px 16px rgba(216,90,48,0.3)":"none",opacity:appName.trim()?1:0.6}}>Continue</button>
        </div>
      )}

      {/* ═══ MAIN INTRO ═══ */}
      {screen==="intro"&&(
        <div style={{textAlign:"center",padding:"28px 16px"}}>
          <div style={{fontSize:48,marginBottom:4,animation:"float 2s ease-in-out infinite"}}>{"\u{1f4de}"}</div>
          <h1 style={{fontSize:22,fontWeight:700,marginBottom:4,background:"linear-gradient(135deg,#D85A30,#D4537E)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Events associate</h1>
          <p style={{fontSize:12,color:"#888",marginBottom:2}}>Screening assessment</p>
          <p style={{color:"#999",fontSize:12,lineHeight:1.6,marginBottom:20}}>4 games testing key cognitive traits</p>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {GAMES.map(function(g,i){return(<div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:g.bg,animation:"popIn 0.4s ease "+(i*0.08)+"s both"}}><span style={{fontSize:20}}>{g.icon}</span><div style={{flex:1,textAlign:"left"}}><div style={{fontWeight:600,fontSize:13,color:g.color}}>{g.label}</div></div></div>);})}
          </div>
          <button onClick={startCurrentGame} style={{padding:"12px 36px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:"linear-gradient(135deg,#D85A30,#D4537E)",color:"#fff",boxShadow:"0 4px 16px rgba(216,90,48,0.3)",animation:"pulse 2s ease-in-out infinite"}}>Begin assessment</button>
        </div>
      )}

      {/* ═══ PLAYING ═══ */}
      {screen==="playing"&&(
        <div>
          {/* Game header */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 0",borderBottom:"2px solid "+game.bg}}>
            <span style={{fontSize:20}}>{game.icon}</span>
            <span style={{fontWeight:700,fontSize:15,color:game.color}}>{game.label}</span>
            <div style={{marginLeft:"auto",display:"flex",gap:4}}>
              {GAMES.map(function(_,i){return <div key={i} style={{width:8,height:8,borderRadius:4,background:i===gi?game.color:i<gi?"#1D9E75":"#ddd"}} />;})}
            </div>
          </div>

          {/* ═══ BETWEEN-GAME TRANSITION ═══ */}
          {sub==="intro"&&(
            <div style={{textAlign:"center",padding:"28px 16px",animation:"popIn 0.3s ease"}}>
              <div style={{fontSize:48,marginBottom:8,animation:"float 2s ease-in-out infinite"}}>{game.icon}</div>
              <h2 style={{fontSize:20,fontWeight:700,color:game.color,marginBottom:4}}>{"Up next: "+game.label}</h2>
              <p style={{color:"#888",fontSize:13,marginBottom:20}}>{"Game "+(gi+1)+" of "+GAMES.length}</p>
              <button onClick={startCurrentGame} style={{padding:"12px 32px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:game.color,color:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.15)"}}>Start</button>
            </div>
          )}

          {/* ═══ WORD SPRINT ═══ */}
          {game.id==="word"&&sub==="practice_intro"&&(
            <div style={{textAlign:"center",padding:"20px 16px",animation:"popIn 0.3s ease"}}>
              <p style={{color:"#666",fontSize:14,lineHeight:1.7,marginBottom:16,textAlign:"left",maxWidth:360,margin:"0 auto 16px"}}>This game tests how quickly you can think of words under pressure.</p>
              <div style={{textAlign:"left",maxWidth:340,margin:"0 auto 16px"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:8}}>How it works:</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {["You'll see 9 letters on screen","Type as many valid English words as you can","Words must be at least 4 letters long","Each letter can only be used once per word","You have 30 seconds per round, 3 rounds total"].map(function(t,i){return(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#555"}}><span style={{minWidth:20,height:20,borderRadius:6,background:"#EEEDFE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#534AB7"}}>{i+1}</span><span>{t}</span></div>);})}
                </div>
              </div>
              <p style={{fontSize:12,color:"#888",marginBottom:12}}>{"Let's start with a quick practice round"}</p>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
                {WSample.letters.map(function(l,i){return <div key={i} style={{width:48,height:48,borderRadius:10,background:"#EEEDFE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#534AB7"}}>{l}</div>;})}
              </div>
              <button onClick={function(){setSub("sample");}} style={{padding:"10px 28px",borderRadius:10,background:"#534AB7",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Start practice</button>
            </div>
          )}
          {game.id==="word"&&(sub==="sample"||sub==="game")&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#888"}}>{sub==="sample"?"Practice":("Round "+(wri+1)+"/3")+(" \u00b7 Found: "+wCurFound.length)}</span>
                <span style={{fontSize:13,fontWeight:600,color:wTClr}}>{Math.max(wCurTime,0)+"s"}</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"#eee",marginBottom:14}}><div style={{width:wPct+"%",height:"100%",borderRadius:3,background:wTClr,transition:"width 1s linear"}} /></div>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6,marginBottom:16}}>
                {(sub==="sample"?WSample.letters:wScr).map(function(l,i){var sz=sub==="sample"?48:42;return <div key={i} style={{width:sz,height:sz,borderRadius:10,background:"#EEEDFE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sub==="sample"?22:18,fontWeight:700,color:"#534AB7"}}>{l}</div>;})}
              </div>
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                <input ref={wIRef} value={wIn} onChange={function(e){setWIn(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")wSubmit();}} placeholder="Type a word..." style={{flex:1,padding:"10px 14px",borderRadius:10,border:wFb==="correct"?"2px solid #1D9E75":(wFb==="wrong"||wFb==="badletters")?"2px solid #E24B4A":"2px solid #eee",fontSize:15,outline:"none",background:"#fff"}} />
                <button onClick={wSubmit} style={{padding:"10px 18px",borderRadius:10,background:"#534AB7",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Go</button>
              </div>
              <div style={{minHeight:20,textAlign:"center",fontSize:12,marginBottom:8}}>
                {wFb==="correct"&&<span style={{color:"#1D9E75",fontWeight:600}}>Nice!</span>}
                {wFb==="wrong"&&<span style={{color:"#E24B4A"}}>Not a valid word</span>}
                {wFb==="duplicate"&&<span style={{color:"#EF9F27"}}>Already found!</span>}
                {wFb==="short"&&<span style={{color:"#EF9F27"}}>4 letters minimum!</span>}
                {wFb==="badletters"&&<span style={{color:"#E24B4A"}}>{"Can't form that from these letters!"}</span>}
              </div>
              {wCurFound.length>0&&(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{wCurFound.map(function(w){return <span key={w} style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:"#E1F5EE",color:"#0F6E56",fontWeight:500}}>{w}</span>;})}</div>)}
            </div>
          )}
          {game.id==="word"&&sub==="sampleresult"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#534AB7",marginBottom:4}}>Practice complete!</h2>
              <p style={{fontSize:14,color:"#666",marginBottom:12}}>{"You found "}<strong>{wSF.length}</strong>{" word"+(wSF.length!==1?"s":"")}</p>
              <button onClick={function(){setWScr(shuffle(WB[wRounds[0]].l));setSub("game");}} style={{padding:"12px 32px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:"#534AB7",color:"#fff"}}>{"Start the real rounds!"}</button>
            </div>
          )}
          {game.id==="word"&&sub==="roundbreak"&&(
            <div style={{textAlign:"center",padding:"36px 16px",animation:"popIn 0.3s ease"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#534AB7",marginBottom:6}}>{"Round "+wri+" complete!"}</h2>
              <p style={{fontSize:14,color:"#666",marginBottom:4}}>{"You found "}<strong>{wRes[wRes.length-1].found}</strong>{" words"}</p>
              <p style={{fontSize:13,color:"#999",marginBottom:20}}>{"Round "+(wri+1)+" of 3 coming up!"}</p>
              <button onClick={function(){setWScr(shuffle(WB[wRounds[wri]].l));setWFound([]);setWIn("");setWTime(30);setWFb(null);setSub("game");}} style={{padding:"12px 28px",borderRadius:10,background:"#534AB7",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Next round</button>
            </div>
          )}

          {/* ═══ KEEP GOING ═══ */}
          {game.id==="keep"&&sub==="practice_intro"&&(
            <div style={{textAlign:"center",padding:"20px 16px",animation:"popIn 0.3s ease"}}>
              <p style={{color:"#666",fontSize:14,lineHeight:1.7,marginBottom:16,textAlign:"left",maxWidth:360,margin:"0 auto 16px"}}>This game tests how you perform when things get progressively harder.</p>
              <div style={{textAlign:"left",maxWidth:340,margin:"0 auto 16px"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#333",marginBottom:8}}>How it works:</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {["Solve math problems as fast as you can","Difficulty level increases as you go","You have 90 seconds \u2014 try your best!"].map(function(t,i){return(<div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#555"}}><span style={{minWidth:20,height:20,borderRadius:6,background:"#FAECE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#D85A30"}}>{i+1}</span><span>{t}</span></div>);})}
                </div>
              </div>
              <p style={{fontSize:12,color:"#888",marginBottom:12}}>{"Let's start with a quick practice round"}</p>
              <button onClick={function(){setKQ(genQ(1));setKSC(0);setKSCr(0);setKSFb(null);setSub("sample");}} style={{padding:"10px 28px",borderRadius:10,background:"#D85A30",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Start practice</button>
            </div>
          )}
          {game.id==="keep"&&sub==="sample"&&kQ&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{fontSize:12,color:"#888",marginBottom:8}}>{"Practice \u00b7 Question "+(kSC+1)+" of 2"}</div>
              <div style={{textAlign:"center",padding:"22px 14px",borderRadius:16,background:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",marginBottom:14,border:kSFb==="correct"?"2px solid #1D9E75":kSFb==="wrong"?"2px solid #E24B4A":"2px solid transparent"}}>
                <div style={{fontSize:30,fontWeight:700,color:"#333"}}>{kQ.q}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {kQ.opts.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(kSFb!==null){if(o===kQ.answer){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#FCEBEB";clr="#999";}}return <button key={i} onClick={function(e){kSamplePick(o,e.currentTarget);}} style={{flex:1,padding:"16px 8px",borderRadius:14,background:bg,border:brd,color:clr,fontWeight:600,fontSize:20,cursor:kSFb?"default":"pointer"}}>{o}</button>;})}
              </div>
            </div>
          )}
          {game.id==="keep"&&sub==="sampleresult"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#D85A30",marginBottom:4}}>Practice complete!</h2>
              <p style={{fontSize:14,color:"#666",marginBottom:16}}>{"You got "}<strong>{kSCr}</strong>{" out of 2 correct"}</p>
              <button onClick={function(){setKLv(1);setKQ(genQ(1));setKStr(0);setKTot(0);setKCor(0);setKFb(null);setKWr(0);setKTime(90);kDone.current=false;setSub("game");}} style={{padding:"12px 32px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:"#D85A30",color:"#fff"}}>{"Start the real game!"}</button>
            </div>
          )}
          {game.id==="keep"&&sub==="game"&&kQ&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:12,color:"#888"}}>{"Level: "}<span style={{fontWeight:600,color:DC[kLv]}}>{DL[kLv]}</span></div>
                <span style={{fontSize:13,fontWeight:600,color:kTClr}}>{Math.max(kTime,0)+"s"}</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"#eee",marginBottom:6}}><div style={{width:kPct+"%",height:"100%",borderRadius:3,background:kTClr,transition:"width 1s linear"}} /></div>
              <div style={{display:"flex",gap:3,marginBottom:14}}>{[1,2,3,4,5,6].map(function(l){return <div key={l} style={{flex:1,height:6,borderRadius:3,background:l<=kLv?DC[l]:"#eee"}} />;})}</div>
              {kWr>=3&&(<div style={{textAlign:"center",marginBottom:12,padding:"10px 14px",borderRadius:10,background:"#FCEBEB"}}><p style={{fontSize:13,color:"#A32D2D",fontWeight:600,marginBottom:6}}>Getting tough! Keep going or call it quits?</p><button onClick={function(){kDone.current=true;clearInterval(kRef.current);finishGame({label:"Keep going",score:kCor,total:Math.max(kTot,1),maxLevel:kML,maxStreak:kMS,quit:true});}} style={{padding:"6px 18px",borderRadius:8,background:"#fff",border:"1.5px solid #E24B4A",color:"#E24B4A",fontSize:12,fontWeight:500,cursor:"pointer"}}>{"I'll stop here"}</button></div>)}
              <div style={{textAlign:"center",padding:"22px 14px",borderRadius:16,background:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",marginBottom:14,border:kFb==="correct"?"2px solid #1D9E75":kFb==="wrong"?"2px solid #E24B4A":"2px solid transparent",animation:kFb==="wrong"?"shake 0.3s ease":"none"}}>
                <div style={{fontSize:11,color:DC[kLv],fontWeight:600,marginBottom:6}}>{"LEVEL "+kLv+" \u2014 "+DL[kLv].toUpperCase()}</div>
                <div style={{fontSize:30,fontWeight:700,color:"#333"}}>{kQ.q}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {kQ.opts.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(kFb!==null){if(o===kQ.answer){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#FCEBEB";clr="#999";}}return <button key={i} onClick={function(e){kPick(o,e.currentTarget);}} style={{flex:1,padding:"16px 8px",borderRadius:14,background:bg,border:brd,color:clr,fontWeight:600,fontSize:20,cursor:kFb?"default":"pointer"}}>{o}</button>;})}
              </div>
              <div style={{textAlign:"center",marginTop:10,fontSize:13}}><span style={{fontWeight:700,color:"#1D9E75"}}>{kCor}</span><span style={{color:"#aaa"}}>{" / "+kTot+" correct"}</span></div>
            </div>
          )}

          {/* ═══ INFO SCAN ═══ */}
          {game.id==="scan"&&sub==="practice_intro"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <div style={{fontSize:40,marginBottom:8}}>{"\u{1f3af}"}</div>
              <h2 style={{fontSize:18,fontWeight:700,color:"#1D9E75",marginBottom:16}}>{"Let's practice!"}</h2>
              <button onClick={function(){setSPPh("study");setSPSt(12);setSPQi(0);setSPSc(0);setSPFb(null);setSub("practice");}} style={{padding:"10px 28px",borderRadius:10,background:"#1D9E75",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Start practice</button>
            </div>
          )}
          {game.id==="scan"&&sub==="practice"&&sPPh==="study"&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#888"}}>Practice</span>
                <span style={{fontSize:13,fontWeight:600,color:sSTClr}}>{"Study: "+Math.max(sPSt,0)+"s"}</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"#eee",marginBottom:14}}><div style={{width:sSPct+"%",height:"100%",borderRadius:3,background:sSTClr,transition:"width 1s linear"}} /></div>
              <PC p={SPractice} />
            </div>
          )}
          {game.id==="scan"&&sub==="practice"&&sPPh==="answer"&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,color:"#888"}}>{"Practice \u00b7 Q"+(sPQi+1)+" of 2"}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#D85A30"}}>Answer!</span>
              </div>
              <div style={{textAlign:"center",padding:"16px",borderRadius:14,background:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",marginBottom:12}}>
                <div style={{fontSize:12,color:"#888",marginBottom:4}}>{"About "+SPractice.name+":"}</div>
                <div style={{fontSize:15,fontWeight:600}}>{SPractice.questions[sPQi].q}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {sPOp.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(sPFb!==null){if(o===SPractice.questions[sPQi].answer){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#f8f7f4";clr="#999";}}return <button key={i} onClick={function(e){sPracticePick(o,e.currentTarget);}} style={{padding:"12px 16px",borderRadius:10,background:bg,border:brd,color:clr,fontWeight:500,fontSize:14,cursor:sPFb?"default":"pointer",textAlign:"left"}}>{o}</button>;})}
              </div>
            </div>
          )}
          {game.id==="scan"&&sub==="sampleresult"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#1D9E75",marginBottom:4}}>Practice complete!</h2>
              <p style={{fontSize:14,color:"#666",marginBottom:16}}>{"You got "}<strong>{sPSc}</strong>{" out of 2 correct"}</p>
              <button onClick={function(){setSPh("study");setSSt(10);setSub("game");}} style={{padding:"12px 32px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:"#1D9E75",color:"#fff"}}>{"Start the real game!"}</button>
            </div>
          )}
          {game.id==="scan"&&sub==="game"&&sPh==="study"&&sProf[spi]&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#888"}}>{"Profile "+(spi+1)+" of 3"}</span>
                <span style={{fontSize:13,fontWeight:600,color:sSTClr}}>{"Study: "+Math.max(sSt,0)+"s"}</span>
              </div>
              <div style={{height:5,borderRadius:3,background:"#eee",marginBottom:14}}><div style={{width:sSPct+"%",height:"100%",borderRadius:3,background:sSTClr,transition:"width 1s linear"}} /></div>
              <PC p={sProf[spi]} />
            </div>
          )}
          {game.id==="scan"&&sub==="game"&&sPh==="answer"&&sProf[spi]&&sQs[spi]&&sQs[spi][sqi]&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,color:"#888"}}>{"Profile "+(spi+1)+" \u00b7 Q"+(sqi+1)+" of 2"}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#D85A30"}}>Answer!</span>
              </div>
              <div style={{textAlign:"center",padding:"16px",borderRadius:14,background:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",marginBottom:12}}>
                <div style={{fontSize:12,color:"#888",marginBottom:4}}>{"About "+sProf[spi].name+":"}</div>
                <div style={{fontSize:15,fontWeight:600}}>{sQs[spi][sqi].q}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {sOp.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(sFb!==null){if(o===sQs[spi][sqi].answer){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#f8f7f4";clr="#999";}}return <button key={i} onClick={function(e){sGamePick(o,e.currentTarget);}} style={{padding:"12px 16px",borderRadius:10,background:bg,border:brd,color:clr,fontWeight:500,fontSize:14,cursor:sFb?"default":"pointer",textAlign:"left"}}>{o}</button>;})}
              </div>
            </div>
          )}

          {/* ═══ SNAP DECISION ═══ */}
          {game.id==="snap"&&sub==="practice_intro"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <div style={{fontSize:40,marginBottom:8}}>{"\u{1f3af}"}</div>
              <h2 style={{fontSize:18,fontWeight:700,color:"#D4537E",marginBottom:16}}>{"Let's practice!"}</h2>
              <button onClick={function(){setNPFb(null);setNPS(0);setNPOp(shuffle([].concat(SnapPractice.opts)));setSub("sample");}} style={{padding:"10px 28px",borderRadius:10,background:"#D4537E",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"}}>Start practice</button>
            </div>
          )}
          {game.id==="snap"&&sub==="sample"&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{fontSize:12,color:"#888",marginBottom:8}}>Practice round</div>
              <div style={{padding:"14px 16px",borderRadius:14,background:"#FBEAF0",marginBottom:12,border:"1.5px solid #D4537E33"}}>
                <div style={{fontSize:14,fontWeight:600,color:"#72243E",lineHeight:1.5}}>{SnapPractice.situation}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {nPOp.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(nPFb!==null){if(o===SnapPractice.best){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#f8f7f4";clr="#999";}}return <button key={i} onClick={function(e){nPracticePick(o,e.currentTarget);}} style={{padding:"11px 14px",borderRadius:10,background:bg,border:brd,color:clr,fontWeight:500,fontSize:13,cursor:nPFb?"default":"pointer",textAlign:"left",lineHeight:1.4}}>{o}</button>;})}
              </div>
            </div>
          )}
          {game.id==="snap"&&sub==="sampleresult"&&(
            <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.3s ease"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#D4537E",marginBottom:4}}>Practice complete!</h2>
              <p style={{fontSize:14,color:"#666",marginBottom:16}}>{"You got it "}<strong>{nPS===1?"right":"wrong"}</strong></p>
              <button onClick={function(){setNTime(15);setNOp(shuffle([].concat(nSc[0].opts)));setNFb(null);setSub("game");}} style={{padding:"12px 32px",borderRadius:12,border:"none",fontWeight:700,fontSize:15,cursor:"pointer",background:"#D4537E",color:"#fff"}}>{"Start the real game!"}</button>
            </div>
          )}
          {game.id==="snap"&&sub==="game"&&nSc[nsi]&&(
            <div style={{animation:"popIn 0.3s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#888"}}>{"Scenario "+(nsi+1)+" of "+nSc.length}</span>
                <span style={{fontSize:13,fontWeight:600,color:nTClr}}>{Math.max(nTime,0)+"s"}</span>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:8}}>{nSc.map(function(_,i){return <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<nsi?"#1D9E75":i===nsi?"#D4537E":"#eee"}} />;})}</div>
              <div style={{height:5,borderRadius:3,background:"#eee",marginBottom:14}}><div style={{width:nPct+"%",height:"100%",borderRadius:3,background:nTClr,transition:"width 1s linear"}} /></div>
              <div style={{padding:"14px 16px",borderRadius:14,background:"#FBEAF0",marginBottom:12,border:"1.5px solid #D4537E33"}}>
                <div style={{fontSize:14,fontWeight:600,color:"#72243E",lineHeight:1.5}}>{nSc[nsi].situation}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {nOp.map(function(o,i){var bg="#fff",brd="2px solid #eee",clr="#333";if(nFb!==null){if(o===nSc[nsi].best){bg="#E1F5EE";brd="2px solid #1D9E75";clr="#0F6E56";}else{bg="#f8f7f4";clr="#999";}}return <button key={i} onClick={function(e){nPick(o,e.currentTarget);}} style={{padding:"11px 14px",borderRadius:10,background:bg,border:brd,color:clr,fontWeight:500,fontSize:13,cursor:nFb?"default":"pointer",textAlign:"left",lineHeight:1.4}}>{o}</button>;})}
              </div>
              {nFb==="timeout"&&<div style={{textAlign:"center",marginTop:10,fontSize:13,color:"#E24B4A",fontWeight:500}}>{"Time's up!"}</div>}
            </div>
          )}
        </div>
      )}

      {/* ═══ FINAL SCORECARD ═══ */}
      {screen==="final"&&(
        <div style={{textAlign:"center",padding:"24px 16px",animation:"popIn 0.4s ease"}}>
          <div style={{fontSize:48,marginBottom:4}}>{"\u{1f3c6}"}</div>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:4}}>{appName.trim()}</h2>
          <p style={{fontSize:13,color:"#888",marginBottom:16}}>Assessment complete</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left",marginBottom:20}}>
            {gResults.map(function(r,i){var colors=["#534AB7","#D85A30","#1D9E75","#D4537E"];var traits=["Verbal fluency","Resilience","Processing speed","Quick thinking"];var pct2=r.total>0?Math.round((r.score/r.total)*100):0;return(
              <div key={i} style={{padding:12,borderRadius:12,background:"#f8f7f4",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:8,background:GAMES[i].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{GAMES[i].icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:colors[i]}}>{traits[i]}</div>
                  <div style={{height:5,borderRadius:3,background:"#e5e5e0",marginTop:3}}><div style={{width:pct2+"%",height:"100%",borderRadius:3,background:colors[i]}} /></div>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:colors[i]}}>{pct2+"%"}</div>
              </div>
            );})}
          </div>
          {submitStatus==="sending"&&(<p style={{fontSize:13,color:"#888",marginBottom:12}}>Submitting results...</p>)}
          {submitStatus==="sent"&&(<p style={{fontSize:13,color:"#1D9E75",fontWeight:600,marginBottom:12}}>Results submitted successfully!</p>)}
          {submitStatus==="error"&&(<div style={{marginBottom:12}}><p style={{fontSize:13,color:"#E24B4A",fontWeight:600,marginBottom:6}}>Submission failed. Please check your connection.</p><button onClick={function(){submitResults(gResults);}} style={{padding:"6px 16px",borderRadius:8,background:"#fff",border:"1.5px solid #E24B4A",color:"#E24B4A",fontSize:12,fontWeight:500,cursor:"pointer"}}>Retry</button></div>)}
          <button onClick={function(){setScreen("intro");setGi(0);setGResults([]);setSubmitStatus("idle");}} style={{padding:"10px 24px",borderRadius:10,background:"#fff",border:"2px solid #eee",fontWeight:600,fontSize:13,cursor:"pointer"}}>Retake</button>
        </div>
      )}
    </div>
  );
}