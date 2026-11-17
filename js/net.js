const NOPP=[0,2,4];
let NET={on:false,host:false,peer:null,conn:null,code:'',status:'',err:false,remote:null,sendT:0,aiT:0};
function netAvail(){return typeof Peer!=='undefined';}
function genCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=a[Math.floor(Math.random()*a.length)];return s;}
function netReset(){try{if(NET.conn)NET.conn.close();}catch(e){}try{if(NET.peer)NET.peer.destroy();}catch(e){}NET={on:false,host:false,peer:null,conn:null,code:'',status:'',err:false,remote:null,sendT:0,aiT:0};}
function netStatus(s,err){NET.status=s;NET.err=!!err;const e=$('nst');if(e){e.innerHTML='<span class="dot'+(err?' bad':NET.conn&&NET.conn.open?' ok':'')+'"></span>'+s;}}
function netErr(e){const t=e&&e.type;return t==='peer-unavailable'?'Nincs ilyen szoba. Ellenőrizd a kódot.':(t==='network'||t==='server-error'||t==='socket-error'||t==='socket-closed')?'Nem sikerült kapcsolódni a szerverhez.':t==='browser-incompatible'?'Ez a böngésző nem támogatja az online módot.':'Kapcsolódási hiba'+(t?' ('+t+')':'')+'.';}
const NOTE='Az online mód a feltöltött (GitHub Pages) változatban működik.';
function netTimeout(){const p=NET.peer;setTimeout(()=>{if(NET.peer===p&&p&&!p.open&&!p.destroyed)netStatus('Nem sikerült kapcsolódni. '+NOTE,1);},9000);}
function hostRoom(){netReset();NET.on=true;NET.host=true;NET.code=genCode();stepI=6;menuRender();
if(!netAvail()){netStatus('Az online kapcsolat itt nem érhető el. '+NOTE,1);return;}
let p;try{p=new Peer('rally3d-'+NET.code);}catch(e){netStatus('Az online kapcsolat itt nem érhető el. '+NOTE,1);return;}NET.peer=p;netStatus('Szoba létrehozása…');
p.on('open',()=>netStatus('Várakozás a barátodra…'));
p.on('connection',c=>{if(NET.conn&&NET.conn.open){c.close();return;}setupConn(c);});
p.on('error',e=>{if(e.type==='unavailable-id'){hostRoom();return;}netStatus(netErr(e),1);});netTimeout();}
function joinRoom(code){code=(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<5){netStatus('Írd be az ötjegyű kódot.',1);return;}
netReset();NET.on=true;NET.host=false;NET.code=code;
if(!netAvail()){netStatus('Az online kapcsolat itt nem érhető el. '+NOTE,1);return;}
let p;try{p=new Peer();}catch(e){netStatus('Az online kapcsolat itt nem érhető el. '+NOTE,1);return;}NET.peer=p;netStatus('Kapcsolódás…');
p.on('open',()=>setupConn(p.connect('rally3d-'+code,{reliable:true,serialization:'json'})));
p.on('error',e=>netStatus(netErr(e),1));netTimeout();}
function setupConn(c){NET.conn=c;
c.on('open',()=>{sendHello();if(NET.host)sendCfg();else{stepI=6;menuRender();}netStatus(NET.host?'A barátod csatlakozott!':'Csatlakoztál a szobához.');lobbyUpd();});
c.on('data',onMsg);c.on('close',netLost);c.on('error',netLost);}
function send(m){try{if(NET.conn&&NET.conn.open)NET.conn.send(m);}catch(e){}}
function sendHello(){send({t:'hello',car:cfg.c,col:cfg.k});}
function sendCfg(){if(NET.host)send({t:'cfg',c:{t:cfg.t,l:cfg.l,o:cfg.no,d:cfg.d}});}
function lobbyUpd(){if(mode==='menu'&&stepI===6)menuRender(true);}
function onMsg(m){if(!m||!m.t)return;
if(m.t==='hello'){NET.remote={car:m.car,col:m.col};lobbyUpd();}
else if(m.t==='cfg'&&!NET.host){const ch=m.c.t!==builtT;cfg.t=m.c.t;cfg.l=m.c.l;cfg.no=m.c.o;cfg.d=m.c.d;if(ch&&mode==='menu')rebuild();lobbyUpd();}
else if(m.t==='start'&&!NET.host){cfg.t=m.s.t;cfg.l=m.s.l;cfg.d=m.s.d;if(builtT!==m.s.t)buildTrack(m.s.t);startRace(m.s);}
else if(m.t==='st'){const c=cars.find(c=>c.nid===m.id);if(c&&c.net)netApply(c,m);}
else if(m.t==='ai'&&!NET.host){for(const s of m.l){const c=cars.find(c=>c.nid===s.id);if(c&&c.net)netApply(c,s);}}
else if(m.t==='lobby'&&!NET.host){if(mode!=='menu')toLobby(true);}}
function netLost(){if(!NET.on||!NET.conn)return;NET.conn=null;NET.remote=null;
if(mode!=='menu'){toast('A barátod kilépett','#ff8a6b');const r=cars.find(c=>c.net&&c.human);if(r){scene.remove(r.v3.g);r.v3.dis();cars.splice(cars.indexOf(r),1);}}
if(NET.host)netStatus('A barátod kilépett. Várakozás új játékosra…',1);else netStatus('Megszakadt a kapcsolat a szobával.',1);lobbyUpd();}
function netApply(c,m){c.tx=m.x;c.tz=m.z;c.ta=m.a;c.vx=m.vx;c.vz=m.vz;c.v=m.v;c.sv=m.sv;c.brk=!!m.b;c.hb=!!m.h;c.slip=m.sl||0;c.prog=m.p;c.ld=m.ld;c.boost=!!m.n;
if(m.f&&!c.fin){c.fin=1;c.ft=m.ft;}if(!c.hasNet){c.hasNet=true;c.x=c.tx;c.z=c.tz;c.a=c.ta;}}
function netStep(c,d){if(!c.hasNet)return;c.tx+=c.vx*d;c.tz+=c.vz*d;c.x+=c.vx*d;c.z+=c.vz*d;const k=Math.min(1,0.12*d);c.x+=(c.tx-c.x)*k;c.z+=(c.tz-c.z)*k;c.a+=wrap(c.ta-c.a)*k;
if(Math.hypot(c.tx-c.x,c.tz-c.z)>15){c.x=c.tx;c.z=c.tz;}const pg=c.prog;near(c);c.prog=pg;c.on=c.dist<HW+0.4;c.kerb=!c.on&&c.dist<HW+2.3&&CUR[c.idx];}
const pk=c=>({id:c.nid,x:+c.x.toFixed(2),z:+c.z.toFixed(2),a:+c.a.toFixed(3),vx:+c.vx.toFixed(3),vz:+c.vz.toFixed(3),v:+c.v.toFixed(3),sv:+c.sv.toFixed(2),b:c.brk?1:0,h:c.hb?1:0,sl:+c.slip.toFixed(3),p:c.prog,ld:c.ld,f:c.fin?1:0,ft:c.ft,n:c.boost?1:0});
function netTick(dt){if(!NET.on||!NET.conn||!NET.conn.open||mode==='menu'||!pl)return;NET.sendT+=dt;NET.aiT+=dt;
if(NET.sendT>=50){NET.sendT=0;const m=pk(pl);m.t='st';send(m);}
if(NET.host&&NET.aiT>=80){NET.aiT=0;send({t:'ai',l:cars.filter(c=>c.ai&&!c.human).map(pk)});}}
function makeSpec(){const n=2+NOPP[cfg.no],rc=NET.remote||{car:0,col:1},hc=[COLS[cfg.k][1],COLS[rc.col][1]],ac=COLS.map(c=>c[1]).filter(c=>hc.indexOf(c)<0),list=[],mid=Math.max(0,Math.floor((n-2)/2));
let ai=0;for(let k=0;k<n;k++){if(k===mid)list.push({id:'h',ty:cfg.c,col:hc[0],num:7,role:'h'});else if(k===mid+1)list.push({id:'g',ty:rc.car,col:hc[1],num:3,role:'g'});
else{list.push({id:'a'+ai,ty:(ai*3+1)%4,col:ac[(ai*5+2)%ac.length],num:[11,23,4,88][ai%4],name:DRV[ai],role:'ai'});ai++;}}
return{t:cfg.t,l:cfg.l,d:cfg.d,cars:list};}
function hostStart(){if(!NET.host)return;if(!NET.conn||!NET.conn.open){toast('Várd meg, amíg a barátod csatlakozik');return;}const s=makeSpec();send({t:'start',s});startRace(s);}
function toLobby(remoteAsked){if(NET.host&&!remoteAsked)send({t:'lobby'});mode='menu';stepI=6;newRace();show('menu');setHud(false);lamps(0);menuRender();}
