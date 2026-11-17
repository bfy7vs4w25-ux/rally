const SET={lang:'hu',unit:0,vol:2,cam:0,steer:1,q:('ontouchstart'in window||navigator.maxTouchPoints>0)?0:1,w:0};
try{const s=JSON.parse(localStorage.getItem('rally3d_set')||'null');if(s)Object.assign(SET,s);}catch(e){}
function saveSet(){try{localStorage.setItem('rally3d_set',JSON.stringify(SET));}catch(e){}}
const DICT={
hero:['Készen állsz<br>a rajtra?','Ready for<br>the start?'],heroSub:['Négy pálya, négy autó, okos ellenfelek, időjárás és nitró.','Four tracks, four cars, smart rivals, weather and nitro.'],
race:['Verseny','Race'],raceSub:['Pálya, autó és beállítások','Track, car and settings'],online:['Online játék','Online play'],onlineSub:['Verseny egy barátod ellen','Race against a friend'],
quick:['Gyors verseny','Quick race'],controls:['Irányítás','Controls'],controlsSub:['Billentyűk és vezetési tippek','Keys and driving tips'],settings:['Beállítások','Settings'],settingsSub:['Nyelv, mértékegység, grafika, hang','Language, units, graphics, sound'],
sTrack:['Pálya','Track'],sCar:['Autó','Car'],sRace:['Verseny','Race'],back:['Vissza','Back'],next:['Tovább','Next'],done:['Kész','Done'],start:['Rajt','Start'],
pickTrack:['Válassz pályát','Choose a track'],pickCar:['Válassz autót','Choose a car'],paint:['Fényezés','Paint'],raceSet:['Verseny beállítások','Race settings'],
opp:['Ellenfelek száma','Opponents'],laps:['Körök száma','Laps'],skill:['Ellenfelek tudása','Opponent skill'],weather:['Időjárás','Weather'],
wOpts:[['Véletlen','Napos','Rossz idő'],['Random','Clear','Bad weather']],dif:[['Könnyű','Közepes','Nehéz'],['Easy','Medium','Hard']],ql:[['Közepes','Magas'],['Medium','High']],graphics:['Grafika','Graphics'],
field:['Mezőny','Field'],carsLaps:['{n} autó · {l} kör','{n} cars · {l} laps'],record:['Pályacsúcs','Track record'],none:['még nincs','none yet'],topSpeed:['Végsebesség','Top speed'],
stTop:['Végseb.','Top speed'],stAcc:['Gyorsulás','Accel.'],stGrip:['Tapadás','Grip'],stOff:['Terep','Off-road'],
tracks:[['Erdei kör','Tengerparti gyors','Sivatagi kanyargó','Havas hajtűk'],['Forest Loop','Coastal Sprint','Desert Twister','Snowy Hairpins']],
tShort:[['Erdő','Tenger','Sivatag','Hó'],['Forest','Coast','Desert','Snow']],tDif:[['Könnyű','Közepes','Technikás','Nehéz'],['Easy','Medium','Technical','Hard']],
tNote:[['Száraz aszfalt, néha eső','Gyors ívek, tengeri szél, néha eső','Homokos szélek, homokvihar','Havas, csúszós aszfalt'],['Dry tarmac, sometimes rain','Fast curves, sea breeze, sometimes rain','Sandy edges, sandstorms','Snowy, slippery tarmac']],
cars:[['Villám GT','Fürge','Bivaly','Prototípus'],['Lightning GT','Swift','Buffalo','Prototype']],tags:[['Szuperautó · hátsókerék','Ralikocsi · összkerék','Izomautó · hátsókerék','Versenyprototípus · leszorítóerő'],['Supercar · RWD','Rally car · AWD','Muscle car · RWD','Race prototype · downforce']],
cols:[['Piros','Kék','Sárga','Zöld','Fehér','Fekete','Narancs','Lila'],['Red','Blue','Yellow','Green','White','Black','Orange','Purple']],
gas:['Gáz','Throttle'],brake:['Fék, tolatás','Brake, reverse'],steer:['Kormányzás','Steering'],hb:['Kézifék, driftelés','Handbrake, drift'],nitro:['Nitró','Nitro'],cam:['Kameranézet','Camera'],fs:['Teljes képernyő','Fullscreen'],reset:['Vissza a pályára','Back on track'],pause:['Szünet','Pause'],sound:['Hang','Sound'],
helpTip:['Kanyar előtt fékezz egyenesen, a kanyarban adagold a gázt. A hátsókerekes autók erős gázra kitörhetnek. A nitró driftből, szélárnyékból és előzésből töltődik.','Brake in a straight line before corners and feed the throttle through them. RWD cars can step out under power. Nitro charges from drifting, slipstream and overtakes.'],
onlineT:['Online játék','Online play'],onlineSub2:['Egyikőtök létrehoz egy szobát, a másik a kapott kóddal csatlakozik.','One of you creates a room, the other joins with the code.'],
create:['Szoba létrehozása','Create room'],createSub:['Te leszel a házigazda','You will host'],join:['Csatlakozás kóddal','Join with code'],joinSub:['A barátod szobájához','To your friend\'s room'],
p2p:['A kapcsolat közvetlenül a két böngésző között jön létre.','The connection is made directly between the two browsers.'],note:['Az online mód a feltöltött (GitHub Pages) változatban működik.','Online mode works in the uploaded (GitHub Pages) version.'],
joinT:['Csatlakozás','Join'],joinSub2:['Írd be a kódot, amit a barátod küldött.','Enter the code your friend sent.'],joinBtn:['Csatlakozás','Join'],
room:['Online szoba','Online room'],roomCode:['Szobakód','Room code'],you:['Te','You'],friend:['Barátod','Your friend'],host:['házigazda','host'],waiting:['Várakozás…','Waiting…'],carBtn:['Autó','Car'],
lapsS:['Körök','Laps'],aiCars:['Gépi autók','AI cars'],aiSkill:['Gépi autók tudása','AI skill'],leave:['Kilépés','Leave'],hostStarts:['A házigazda indítja','Host starts the race'],copied:['Kód másolva','Code copied'],copyMan:['Másold ki kézzel: ','Copy manually: '],
nWait:['Várakozás a barátodra…','Waiting for your friend…'],nCreating:['Szoba létrehozása…','Creating room…'],nJoining:['Kapcsolódás…','Connecting…'],nJoined:['Csatlakoztál a szobához.','You joined the room.'],nHostOk:['A barátod csatlakozott!','Your friend joined!'],
nNoRoom:['Nincs ilyen szoba. Ellenőrizd a kódot.','No such room. Check the code.'],nServer:['Nem sikerült kapcsolódni a szerverhez.','Could not reach the server.'],nBrowser:['Ez a böngésző nem támogatja az online módot.','This browser does not support online mode.'],
nErr:['Kapcsolódási hiba','Connection error'],nFail:['Nem sikerült kapcsolódni.','Could not connect.'],nNA:['Az online kapcsolat itt nem érhető el.','Online connection is not available here.'],nCode:['Írd be az ötjegyű kódot.','Enter the 5-character code.'],
nLeft:['A barátod kilépett. Várakozás új játékosra…','Your friend left. Waiting for a new player…'],nLost:['Megszakadt a kapcsolat a szobával.','Lost connection to the room.'],friendLeft:['A barátod kilépett','Your friend left'],waitFriend:['Várd meg, amíg a barátod csatlakozik','Wait for your friend to join'],
pos:['Hely','Pos'],lap:['Kör','Lap'],lapTime:['Köridő','Lap time'],best:['Legjobb','Best'],total:['Összidő','Total'],draft:['Szélárnyék','Slipstream'],wrong:['Rossz irány!','Wrong way!'],
backTrack:['Vissza a pályára: R','Back on track: R'],stuck:['Elakadtál? Nyomd meg az R gombot','Stuck? Press R'],leader:['Vezet','Leader'],racing:['versenyben','racing'],bestTag:['Legjobb','Best'],
overtake:['Előzés! {p}. hely · +8% nitró','Overtake! P{p} · +8% nitro'],newBest:['Új legjobb kör · ','New best lap · '],lastLap:['Utolsó kör!','Final lap!'],go:['Rajt!','Go!'],finish:['Cél! {p}. hely','Finish! P{p}'],lowN:['Kevés a nitró','Low nitro'],
camN:[['Hátsó kamera','Közeli kamera','Lökhárító kamera','Pilóta kamera'],['Chase camera','Close camera','Bumper camera','Cockpit camera']],camS:[['Hátsó','Közeli','Lökhárító','Pilóta'],['Chase','Close','Bumper','Cockpit']],
fsNo:['A teljes képernyő itt nem érhető el','Fullscreen is not available here'],fsDen:['A teljes képernyőt a böngésző nem engedte','The browser blocked fullscreen'],
paused:['Szünet','Paused'],resume:['Folytatás','Resume'],restart:['Újrakezdés','Restart'],mainMenu:['Főmenü','Main menu'],backRoom:['Vissza a szobába','Back to room'],leaveRoom:['Kilépés a szobából','Leave room'],
win:['Győzelem!','Victory!'],podium:['Dobogós helyezés!','Podium finish!'],good:['Szép futam!','Nice race!'],bestLap:['Legjobb kör','Best lap'],recordNew:['Pályacsúcs!','Track record!'],again:['Újra','Again'],hostCan:['A házigazda indíthat új futamot.','The host can start a new race.'],
loading:['Pálya betöltése…','Loading track…'],wRain:['Esik az eső – csúszik az aszfalt','Rain – the tarmac is slippery'],wStorm:['Homokvihar – erős oldalszél','Sandstorm – strong crosswind'],wSnow:['Havas, csúszós pálya','Snowy, slippery track'],wWind:['Erős tengeri szél','Strong sea breeze'],
lang:['Nyelv','Language'],units:['Mértékegység','Units'],volume:['Hangerő','Volume'],volOpts:[['Ki','Halk','Normál','Hangos'],['Off','Low','Normal','Loud']],defCam:['Alap kamera','Default camera'],
steerS:['Kormányzás érzékenysége','Steering sensitivity'],steerOpts:[['Lágy','Normál','Gyors'],['Soft','Normal','Quick']],saved:['Beállítások mentve','Settings saved'],hostBadge:['házigazda','host'],
paintL:['Fényezés','Paint'],hbShort:['Kézifék','Brake'],sCustom:['Egyedi','Custom'],custom:['Testreszabás','Customize'],rimL:['Felni','Rims'],rimO:[['Alap','Króm','Fekete','Fehér','Arany'],['Default','Chrome','Black','White','Gold']],
livL:['Csíkozás','Stripes'],livO:[['Alap','Nincs','Középcsík','Oldalcsík'],['Default','None','Center','Side']],spnL:['Szponzor matrica','Sponsor decal'],spnO:[['Alap','Nincs','Turbo','Nitro+','Ász','Rally 26'],['Default','None','Turbo','Nitro+','Ace','Rally 26']],
numL:['Rajtszám','Race number'],tintL:['Ablakok','Windows'],tintO:[['Világos','Sötétített'],['Clear','Tinted']],customSub:['Felni, csíkok, szponzorok, rajtszám','Rims, stripes, sponsors, number']};
function T(k,v){const e=DICT[k];if(!e)return k;let s=e[SET.lang==='en'?1:0];if(v)for(const q in v)s=s.replace('{'+q+'}',v[q]);return s;}
const TA_=k=>DICT[k][SET.lang==='en'?1:0];
const UN=()=>SET.unit?'mph':'km/h',SPD=kmh=>SET.unit?kmh*0.6214:kmh,LEN=u=>{const km=u*0.83/1000,v=SET.unit?km*0.6214:km;return(SET.lang==='en'?v.toFixed(1):v.toFixed(1).replace('.',','))+(SET.unit?' mi':' km');};
const trN=i=>TA_('tracks')[i],carN=i=>TA_('cars')[i],colN=i=>TA_('cols')[i];
function applyLang(){document.documentElement.lang=SET.lang;document.querySelectorAll('[data-t]').forEach(e=>{const k=e.dataset.t,sp=e.querySelector('.tx');(sp||e).textContent=T(k);});
document.querySelectorAll('[data-ta]').forEach(e=>e.setAttribute('aria-label',T(e.dataset.ta)));}
