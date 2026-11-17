const touch='ontouchstart'in window||navigator.maxTouchPoints>0;
cfg.no=1;
function setHud(on){$('tp').style.display=on&&touch?'flex':'none';['hTL','tower','mm','sp','nit'].forEach(k=>$(k).style.display=on?'block':'none');$('hBtns').style.display=on?'flex':'none';if(touch){const sp=$('sp'),nt=$('nit');sp.style.right='auto';sp.style.left='50%';sp.style.transform='translateX(-50%)';sp.style.bottom='6px';nt.style.right='auto';nt.style.left='50%';nt.style.transform='translateX(-50%)';nt.style.bottom='192px';nt.style.width='170px';}
if(on&&touch&&G.clientHeight<600)$('tower').style.display='none';if(!on)['ww','msg','lt','pDraft'].forEach(k=>$(k).style.display='none');}
function show(id){['menu','pause','done'].forEach(k=>$(k).classList.toggle('on',k===id));$('vig').classList.toggle('on',id==='menu');if(id==='pause')pauseBtns();if(id==='done')doneBtns();}
function startRace(spec){if(!spec||!spec.cars)spec=null;if(NET.on&&!spec)return;ain();newRace(spec);camYaw=pl.a;camDist=11;acc=0;mode='count';cdE=0;lastLit=-1;lamps(0);show(null);setHud(true);$('lt').style.display='flex';cv.focus();}
function toMenu(){if(NET.on)netReset();mode='menu';stepI=0;newRace();show('menu');setHud(false);lamps(0);menuRender();}
function pause(){if(mode==='race'){mode='pause';show('pause');}}
function resume(){if(mode==='pause'){mode='race';show(null);cv.focus();}}
function pauseBtns(){const on=NET.on;$('pA').style.display=on&&!NET.host?'none':'flex';$('pM').lastChild.textContent=on?(NET.host?'Vissza a szobába':'Kilépés a szobából'):'Főmenü';}
function doneBtns(){const on=NET.on;$('dA').style.display=on&&!NET.host?'none':'flex';$('dM').lastChild.textContent=on?(NET.host?'Vissza a szobába':'Kilépés a szobából'):'Főmenü';$('dW').style.display=on&&!NET.host?'block':'none';}
function again(){if(NET.on){if(NET.host)hostStart();}else startRace();}
function leave(){if(NET.on&&NET.host)toLobby();else toMenu();}
function setSnd(v){snd=v;['sb','msb'].forEach(id=>$(id).innerHTML=svg(snd?'vol':'mute'));}
function isFS(){return!!(document.fullscreenElement||document.webkitFullscreenElement);}
function toggleFS(){try{if(isFS())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=(G.requestFullscreen||G.webkitRequestFullscreen);if(r){const p=r.call(G);if(p&&p.catch)p.catch(()=>toast('A teljes képernyőt a böngésző nem engedte'));}else toast('A teljes képernyő itt nem érhető el');}}catch(e){toast('A teljes képernyő itt nem érhető el');}}
function fsIcons(){['eb','mex'].forEach(id=>$(id).innerHTML=svg(isFS()?'min':'max'));}
document.addEventListener('fullscreenchange',fsIcons);document.addEventListener('webkitfullscreenchange',fsIcons);
const CAMN=['Hátsó kamera','Közeli kamera','Lökhárító kamera'];
function nextCam(){camMode=(camMode+1)%3;toast(CAMN[camMode]);}

let stepI=0,prevStep=0,carBack=1;
function stepper(){const lb=['Pálya','Autó','Verseny'];return'<div class="stp">'+lb.map((l,i)=>{const n=i+1,cl=n===stepI?'on':n<stepI?'ok':'';return(i?'<span class="sl'+(n<=stepI?' done':'')+'"></span>':'')+'<span class="sd '+cl+'"><b>'+(n<stepI?svg('check'):n)+'</b><span>'+l+'</span></span>';}).join('')+'</div>';}
function go(n){stepI=n;menuRender();}
function foot(bl,bs,gl,gs,gid){$('mf').innerHTML='<button class="gh" id="fb">'+svg('arrL')+'<span>'+bl+'</span></button>'+(gl?'<button class="go" id="'+(gid||'fg')+'" style="flex:1">'+gl+'</button>':'');
$('fb').onclick=typeof bs==='function'?bs:()=>go(bs);if(gl&&typeof gs!=='undefined')$(gid||'fg').onclick=typeof gs==='function'?gs:()=>go(gs);}
function cards(el,items,key,cb){el.innerHTML='';items.forEach((it,i)=>{const b=document.createElement('button');b.className='co'+(cfg[key]===i?' sel':'');b.innerHTML=it.h;b.setAttribute('aria-label',it.a);
b.onclick=()=>{if(cfg[key]===i)return;cfg[key]=i;[...el.children].forEach((c,j)=>c.classList.toggle('sel',j===i));cb&&cb(i);};el.appendChild(b);});
requestAnimationFrame(()=>items.forEach((it,i)=>it.d&&el.children[i]&&it.d(el.children[i].querySelector('canvas'),i)));}
function seg(el,items,key,cb){el.innerHTML='<span class="ind"></span>';items.forEach((it,i)=>{const b=document.createElement('button');b.className='sg'+(cfg[key]===i?' sel':'');b.textContent=it;
b.onclick=()=>{if(cfg[key]===i)return;cfg[key]=i;[...el.querySelectorAll('.sg')].forEach((c,j)=>c.classList.toggle('sel',j===i));segInd(el,true);cb&&cb(i);};el.appendChild(b);});
requestAnimationFrame(()=>segInd(el,false));}
function segInd(el,anim){const s=el.querySelector('.sg.sel'),ind=el.querySelector('.ind');if(!s||!ind)return;ind.style.transition=anim?'':'none';ind.style.width=s.offsetWidth+'px';ind.style.transform='translateX('+(s.offsetLeft-3)+'px)';if(!anim){void ind.offsetWidth;ind.style.transition='';}}
const bar=(lb,v)=>'<div class="st"><span>'+lb+'</span><b><i style="width:'+Math.round(Math.max(0.12,Math.min(1,v))*100)+'%"></i></b></div>';
function drawTrack(c,i){if(!c)return;const w=c.clientWidth||150,h=74,x=hc(c,w,h),t=TR[i];x.fillStyle=TH[t.th].card;x.fillRect(0,0,w,h);
const ps=new THREE.CatmullRomCurve3(t.p.map(q=>new THREE.Vector3(q[0],0,q[1])),true,'centripetal').getSpacedPoints(160);
let a=1e9,b=-1e9,c0=1e9,d=-1e9;ps.forEach(p=>{a=Math.min(a,p.x);b=Math.max(b,p.x);c0=Math.min(c0,p.z);d=Math.max(d,p.z);});
const sc=Math.min((w-24)/(b-a),(h-18)/(d-c0)),ox=(w-(b-a)*sc)/2,oz=(h-(d-c0)*sc)/2,X=v=>ox+(v.x-a)*sc,Z=v=>oz+(v.z-c0)*sc;
x.lineJoin='round';x.beginPath();ps.forEach((p,k)=>k?x.lineTo(X(p),Z(p)):x.moveTo(X(p),Z(p)));x.closePath();x.strokeStyle='rgba(0,0,0,0.35)';x.lineWidth=7;x.stroke();x.strokeStyle='#fff';x.lineWidth=2.5;x.stroke();
x.fillStyle='#ff5a36';x.beginPath();x.arc(X(ps[0]),Z(ps[0]),4,0,7);x.fill();}
function drawCar(c,i){if(!c)return;const d=CARS[i],w=c.clientWidth||150,h=50,x=hc(c,w,h),col='#'+new THREE.Color(COLS[cfg.k][1]).getHexString(),sc=Math.min((w-14)/5,(h-6)/1.6),X=z=>w/2+z*sc,Y=y=>h-4-y*sc;
const poly=(pts,f)=>{x.beginPath();pts.forEach((p,k)=>k?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1])));x.closePath();x.fillStyle=f;x.fill();};
x.fillStyle='rgba(0,0,0,0.3)';x.beginPath();x.ellipse(w/2,h-3,2.4*sc,3,0,0,7);x.fill();
poly(d.cab,'#2b3a4a');poly(d.body,col);
for(const q of[[d.wh.f,d.wh.r],[d.wh.b,d.wh.rr]]){x.fillStyle='#151515';x.beginPath();x.arc(X(q[0]),Y(q[1]),q[1]*sc,0,7);x.fill();x.fillStyle=d.rim==='white'?'#f2f2f2':d.rim==='dark'?'#4a4f57':'#c9ced6';x.beginPath();x.arc(X(q[0]),Y(q[1]),q[1]*sc*0.58,0,7);x.fill();}}
const nv=(v,a,b)=>0.25+0.75*(v-a)/(b-a);
function prev(){const e=$('prev'),sh=mode==='menu'&&stepI>0&&stepI!==4&&stepI!==5&&stepI!==7&&G.clientWidth>=760;e.classList.toggle('on',sh);if(!sh)return;
if(stepI===2){const d=CARS[cfg.c];e.innerHTML='<div class="pt">'+d.name+'</div><div class="sub">'+d.tag+' · '+COLS[cfg.k][0]+'</div><div class="sub" style="margin-top:4px">Végsebesség '+Math.round(d.max*180)+' km/h</div>';}
else{const t=TR[cfg.t],rc=REC[cfg.t];e.innerHTML='<div class="pt">'+t.name+'</div><div class="sub" style="margin-top:2px"><span style="color:'+t.dc+'">'+t.d+'</span> · '+kmS(t.len)+' km</div><div class="sub">Pályacsúcs: '+(rc===undefined?'még nincs':fmt(rc))+'</div>';}}
const dotC=c=>'<span class="cdot" style="background:#'+new THREE.Color(c).getHexString()+'"></span>';
function sumHTML(){const t=TR[cfg.t],d=CARS[cfg.c],row=(k,v)=>'<div class="kr"><span class="sub" style="font-size:12px">'+k+'</span><span class="kv">'+v+'</span></div>';
return row('Pálya',t.name)+row('Autó',dotC(COLS[cfg.k][1])+d.name)+row('Mezőny',(OPP[cfg.o]+1)+' autó · '+LAPS[cfg.l]+' kör');}
const HM=(id,ic,t,s,pri)=>'<button class="hm'+(pri?' pri':'')+'" id="'+id+'"><span class="ic">'+svg(ic)+'</span><span class="hmt"><span class="nm" style="font-size:14px">'+t+'</span><span class="sub">'+s+'</span></span>'+svg('arrR')+'</button>';
const TSH=['Erdő','Tenger','Sivatag','Hó'];
function menuRender(quiet){const mb=$('mb'),fw=stepI>=prevStep;prevStep=stepI;
const flow=stepI>=1&&stepI<=3&&carBack!==6;$('mst').innerHTML=flow?stepper():'';$('mst').style.display=flow?'block':'none';

if(stepI===0){carBack=1;mb.innerHTML='<div style="margin:2px 0 4px"><div class="hero">Készen állsz<br>a rajtra?</div><div class="sub" style="font-size:13px;margin-top:8px">Négy pálya, négy autó, okos ellenfelek és nitró.</div></div>'+
HM('h1','flag','Verseny','Pálya, autó és beállítások',1)+HM('h4','users','Online játék','Verseny egy barátod ellen')+HM('h2','bolt','Gyors verseny',TR[cfg.t].name+' · '+CARS[cfg.c].name)+HM('h3','key','Irányítás','Billentyűk és vezetési tippek');
$('mf').innerHTML='';$('h1').onclick=()=>go(1);$('h2').onclick=()=>startRace();$('h3').onclick=()=>go(4);$('h4').onclick=()=>go(5);}
else if(stepI===1){mb.innerHTML='<div class="mt">Válassz pályát</div><div class="g2" id="oT"></div>';
cards($('oT'),TR.map(t=>({a:t.name,h:'<canvas class="cv1"></canvas><div class="nm">'+t.name+'</div><div class="sub"><span class="tag" style="color:'+t.dc+';border-color:'+t.dc+'55">'+t.d+'</span>'+kmS(t.len)+' km</div>',d:drawTrack})),'t',()=>rebuild());
foot('Vissza',0,'<span>Tovább</span>'+svg('arrR'),2);}
else if(stepI===2){mb.innerHTML='<div class="mt">Válassz autót</div><div class="g2" id="oC"></div><div><div class="sec">Fényezés · <span id="cnm" style="color:#e8eaee;text-transform:none;letter-spacing:0">'+COLS[cfg.k][0]+'</span></div><div id="oK" class="sws"></div></div>';
cards($('oC'),CARS.map(c=>({a:c.name,h:'<canvas class="cv2"></canvas><div><div class="nm">'+c.name+'</div><div class="sub">'+c.tag+'</div></div>'+bar('Végseb.',nv(c.max,1.1,1.38))+bar('Gyorsulás',nv(c.acc,0.014,0.021))+bar('Tapadás',nv(c.grip,0.0145,0.019))+bar('Terep',nv(c.off,0.4,0.78)),d:drawCar})),'c',()=>{carChanged();});
const ok=$('oK');COLS.forEach((cc,i)=>{const b=document.createElement('button');b.className='sw'+(cfg.k===i?' sel':'');b.style.background='#'+new THREE.Color(cc[1]).getHexString();b.setAttribute('aria-label',cc[0]);
b.onclick=()=>{cfg.k=i;[...ok.children].forEach((e,j)=>e.classList.toggle('sel',j===i));$('cnm').textContent=cc[0];[...$('oC').children].forEach((e,j)=>drawCar(e.querySelector('canvas'),j));carChanged();};ok.appendChild(b);});
if(carBack===6)foot('Vissza',6,'<span>Kész</span>'+svg('check'),6);else foot('Vissza',1,'<span>Tovább</span>'+svg('arrR'),3);}
else if(stepI===3){mb.innerHTML='<div class="mt">Verseny beállítások</div><div><div class="sec">Ellenfelek száma</div><div class="seg" id="oO"></div></div><div><div class="sec">Körök száma</div><div class="seg" id="oL"></div></div><div><div class="sec">Ellenfelek tudása</div><div class="seg" id="oD"></div></div><div><div class="sec">Grafika</div><div class="seg" id="oQ"></div></div><div id="sum" class="box"></div>';
const up=()=>{$('sum').innerHTML=sumHTML();};seg($('oO'),OPP.map(String),'o',()=>{newRace();up();});seg($('oL'),LAPS.map(String),'l',up);seg($('oD'),DIF,'d');seg($('oQ'),QL,'q',()=>{applyQ();rebuild();});up();
foot('Vissza',2,svg('flag')+'<span>Rajt</span>',()=>startRace());}
else if(stepI===4){const K2=(a,t)=>'<div class="kr"><span>'+t+'</span><span style="display:flex;gap:4px">'+a.map(k=>'<span class="kc">'+k+'</span>').join('')+'</span></div>';
mb.innerHTML='<div class="mt">Irányítás</div><div>'+K2(['W','↑'],'Gáz')+K2(['S','↓'],'Fék, tolatás')+K2(['A','D'],'Kormányzás')+K2(['Space'],'Kézifék, driftelés')+K2(['Shift','N'],'Nitró')+K2(['C'],'Kameranézet')+K2(['F'],'Teljes képernyő')+K2(['R'],'Vissza a pályára')+K2(['P','Esc'],'Szünet')+K2(['M'],'Hang')+'</div><div class="sub" style="font-size:12px">A nitró driftből, szélárnyékból és előzésből töltődik, legalább 12% kell az indításához. Kanyarban kevésbé tapad, egyenesben használd.</div>';
foot('Vissza',0);}
else if(stepI===5){mb.innerHTML='<div class="mt">Online játék</div><div class="sub" style="font-size:13px">Egyikőtök létrehoz egy szobát, a másik a kapott kóddal csatlakozik.</div>'+HM('o1','plus','Szoba létrehozása','Te leszel a házigazda',1)+HM('o2','login','Csatlakozás kóddal','A barátod szobájához')+
'<div class="box sub" style="font-size:12px">A kapcsolat közvetlenül a két böngésző között jön létre. '+NOTE+'</div>';
$('o1').onclick=hostRoom;$('o2').onclick=()=>go(7);foot('Vissza',0);}
else if(stepI===7){mb.innerHTML='<div class="mt">Csatlakozás</div><div class="sub" style="font-size:13px">Írd be a kódot, amit a barátod küldött.</div><input id="jc" class="inp" maxlength="5" placeholder="ABCDE" autocomplete="off" spellcheck="false"><div id="nst" class="nst"></div>';
const jc=$('jc');jc.oninput=()=>{jc.value=jc.value.toUpperCase().replace(/[^A-Z0-9]/g,'');};jc.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')joinRoom(jc.value);};setTimeout(()=>jc.focus(),50);
foot('Vissza',()=>{netReset();go(5);},svg('login')+'<span>Csatlakozás</span>',()=>joinRoom(jc.value));}
else if(stepI===6){lobbyHTML();}
if(!quiet){mb.classList.remove('sf','sb');void mb.offsetWidth;mb.classList.add(fw?'sf':'sb');[...mb.children].forEach((e,i)=>{e.classList.remove('it');void e.offsetWidth;e.classList.add('it');e.style.animationDelay=(60+i*50)+'ms';});[...$('mf').children].forEach(e=>{e.classList.remove('it');void e.offsetWidth;e.classList.add('it');e.style.animationDelay='200ms';});}
prev();fitMenu();}
function lobbyHTML(){const mb=$('mb'),con=NET.conn&&NET.conn.open,r=NET.remote,me=CARS[cfg.c];
const pr=(nm,car,col,tag,btn)=>'<div class="prow">'+(car!==null?dotC(col):'<span class="cdot wait"></span>')+'<span class="pn"><span class="nm">'+nm+'</span><span class="sub">'+tag+'</span></span>'+(btn||'')+'</div>';
let h='<div class="mt">Online szoba</div><div class="code"><span class="sub">Szobakód</span><b id="ccode">'+(NET.code||'-----')+'</b>'+(NET.host?'<button class="ib sm" id="cpy" aria-label="Kód másolása">'+svg('copy')+'</button>':'')+'</div><div id="nst" class="nst"></div>';
h+='<div class="box" style="padding:4px 12px">'+pr('Te',cfg.c,COLS[cfg.k][1],me.name+(NET.host?' · házigazda':''),'<button class="gh sm" id="lcar">Autó</button>')+pr('Barátod',r?r.car:null,r?COLS[r.col][1]:0,r?CARS[r.car].name+(NET.host?'':' · házigazda'):'Várakozás…')+'</div>';
if(NET.host)h+='<div><div class="sec">Pálya</div><div class="seg" id="lT"></div></div><div class="g2" style="gap:10px"><div><div class="sec">Körök</div><div class="seg" id="lL"></div></div><div><div class="sec">Gépi autók</div><div class="seg" id="lO"></div></div></div><div><div class="sec">Gépi autók tudása</div><div class="seg" id="lD"></div></div>';
else h+='<div class="box">'+'<div class="kr"><span class="sub" style="font-size:12px">Pálya</span><span class="kv">'+TR[cfg.t].name+'</span></div><div class="kr"><span class="sub" style="font-size:12px">Körök</span><span class="kv">'+LAPS[cfg.l]+'</span></div><div class="kr"><span class="sub" style="font-size:12px">Gépi autók</span><span class="kv">'+NOPP[cfg.no]+' · '+DIF[cfg.d]+'</span></div></div>';
mb.innerHTML=h;netStatus(NET.status||'',NET.err);
if(NET.host){seg($('lT'),TSH,'t',()=>{rebuild();sendCfg();});seg($('lL'),LAPS.map(String),'l',sendCfg);seg($('lO'),NOPP.map(String),'no',sendCfg);seg($('lD'),DIF,'d',sendCfg);
$('cpy').onclick=()=>{try{navigator.clipboard.writeText(NET.code).then(()=>toast('Kód másolva'),()=>toast('Másold ki kézzel: '+NET.code));}catch(e){toast('Másold ki kézzel: '+NET.code);}};}
$('lcar').onclick=()=>{carBack=6;go(2);};
foot('Kilépés',()=>{netReset();carBack=1;go(5);},NET.host?svg('flag')+'<span>Rajt</span>':'<span>A házigazda indítja</span>',NET.host?hostStart:undefined,'lgo');
const g=$('lgo');if(g){g.classList.toggle('dis',NET.host?!con:true);}}
function carChanged(){newRace();prev();if(NET.on)sendHello();}
function fitMenu(){const mp=$('mp');if(!mp)return;mp.style.height='auto';mp.style.transform='translateY(-50%)';const nat=mp.scrollHeight,av=G.clientHeight-32,H=Math.max(nat,Math.min(600,av));mp.style.height=H+'px';const s=Math.min(1,av/H);mp.style.transform='translateY(-50%) scale('+s+')';}

const KM={ShiftLeft:'n',ShiftRight:'n',KeyN:'n',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'hb'};
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;const k=KM[e.code];if(k){keys[k]=1;e.preventDefault();}
if(e.code==='Escape'||e.code==='KeyP'){if(mode==='race')pause();else if(mode==='pause'&&performance.now()-fsExit>400)resume();}
if(e.code==='KeyR'&&mode==='race')respawn(pl);if(e.code==='KeyM')setSnd(!snd);if(e.code==='KeyC'&&mode!=='menu')nextCam();if(e.code==='KeyF')toggleFS();
if(e.code==='Enter'&&mode==='menu'){e.preventDefault();if(stepI===3)startRace();else if((stepI===1||stepI===2)&&carBack!==6)go(stepI+1);}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)keys[k]=0;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;});
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=1;b.classList.add('on');});['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,()=>{keys[k]=0;b.classList.remove('on');}));});
$('pR').onclick=resume;$('pA').onclick=again;$('pM').onclick=leave;$('dA').onclick=again;$('dM').onclick=leave;$('pb').onclick=pause;$('cb').onclick=nextCam;
$('eb').onclick=$('mex').onclick=toggleFS;$('sb').onclick=$('msb').onclick=()=>setSnd(!snd);
['pR','pA','pM','dA','dM'].forEach(id=>{const b=$(id),t=b.textContent;b.innerHTML=svg({pR:'play',pA:'redo',pM:'home',dA:'redo',dM:'home'}[id])+'<span>'+t+'</span>';});
function rs(){const w=G.clientWidth,h=G.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(mode==='menu'){prev();fitMenu();document.querySelectorAll('.seg').forEach(s=>segInd(s,false));}}
new ResizeObserver(rs).observe(G);addEventListener('resize',rs);

let nitLow=0;
function nitroHud(){const n=pl.nit,e=$('nit');$('nitF').style.width=n.toFixed(1)+'%';$('nitV').textContent=Math.floor(n)+'%';e.classList.toggle('act',pl.boost);e.classList.toggle('rdy',!pl.boost&&n>=12);e.classList.toggle('low',n<12);
if(keys.n&&!pl.boost&&n<12&&mode==='race'&&performance.now()-nitLow>1800){nitLow=performance.now();toast('Kevés a nitró','#ff8a6b');}}
function flashPos(){const e=$('hP');e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash');}
