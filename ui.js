const touch='ontouchstart'in window||navigator.maxTouchPoints>0;document.body.classList.toggle('touch',touch);
cfg.no=1;cfg.q=SET.q;cfg.rimI=0;cfg.livI=0;cfg.spnI=0;cfg.num=0;cfg.tint=0;
function setHud(on){$('tp').style.display=on&&touch?'flex':'none';['hTL','tower','mm','sp','nit'].forEach(k=>$(k).style.display=on?'block':'none');$('hBtns').style.display=on?'flex':'none';if(touch){const sp=$('sp'),nt=$('nit');sp.style.right='auto';sp.style.left='50%';sp.style.transform='translateX(-50%)';sp.style.bottom='6px';nt.style.right='auto';nt.style.left='50%';nt.style.transform='translateX(-50%)';nt.style.bottom='192px';nt.style.width='170px';}
if(on&&touch&&G.clientHeight<600)$('tower').style.display='none';if(!on)['ww','msg','lt','pDraft'].forEach(k=>$(k).style.display='none');}
function show(id){$('g').classList.toggle('dn',id==='done'||id==='pause');['menu','pause','done'].forEach(k=>$(k).classList.toggle('on',k===id));$('vig').classList.toggle('on',id==='menu');if(id==='pause')pauseBtns();if(id==='done')doneBtns();}
function startRace(spec){if(!spec||!spec.cars)spec=null;if(NET.on&&!spec)return;ain();camMode=SET.cam;applyWeather(spec&&spec.w?spec.w:pickWeather(TR[cfg.t].th));newRace(spec);wxToast();camYaw=pl.a;camDist=11;acc=0;mode='intro';introE=0;lamps(0);show(null);setHud(false);$('lt').style.display='none';introUI(true);cv.focus();}
function introUI(on){const el=$('intro');if(on){const ty={clear:0,rain:1,storm:2,snow:3,wind:4}[WX.type]||0;$('inT').textContent=trN(cfg.t);$('inS').textContent=T('carsLaps',{n:cars.length,l:LAPS[cfg.l]})+' · '+TA_('wxN')[ty];$('inK').style.display=NET.on?'none':'block';}el.classList.toggle('on',on);}
function beginCount(){if(mode!=='intro')return;introUI(false);mode='count';cdE=0;lastLit=-1;lamps(0);setHud(true);$('lt').style.display='flex';camYaw=pl.a;camDist=11;}
function skipIntro(){if(mode==='intro'&&!NET.on)beginCount();}
function toMenu(){introUI(false);if(NET.on)netReset();mode='menu';stepI=0;applyWeather(TR[builtT].th===2?'snow':'clear');newRace();show('menu');setHud(false);lamps(0);menuRender();}
function pause(){if(mode==='race'){mode='pause';show('pause');}}
function resume(){if(mode==='pause'){mode='race';show(null);cv.focus();}}
function pauseBtns(){const on=NET.on;$('pA').style.display=on&&!NET.host?'none':'flex';$('pM').lastChild.textContent=on?(NET.host?T('backRoom'):T('leaveRoom')):T('mainMenu');}
function doneBtns(){const on=NET.on;$('dA').style.display=on&&!NET.host?'none':'flex';$('dM').lastChild.textContent=on?(NET.host?T('backRoom'):T('leaveRoom')):T('mainMenu');$('dW').style.display=on&&!NET.host?'block':'none';}
function again(){if(NET.on){if(NET.host)hostStart();}else startRace();}
function leave(){if(NET.on&&NET.host)toLobby();else toMenu();}
function setSnd(v){snd=v&&SET.vol>0;['sb','msb'].forEach(id=>$(id).innerHTML=svg(snd?'vol':'mute'));}
function isFS(){return!!(document.fullscreenElement||document.webkitFullscreenElement);}
function toggleFS(){try{if(isFS())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=(G.requestFullscreen||G.webkitRequestFullscreen);if(r){const p=r.call(G);if(p&&p.catch)p.catch(()=>toast(T('fsDen')));}else toast(T('fsNo'));}}catch(e){toast(T('fsNo'));}}
function fsIcons(){['eb','mex'].forEach(id=>$(id).innerHTML=svg(isFS()?'min':'max'));G.classList.toggle('fsm',isFS()&&touch);}
document.addEventListener('fullscreenchange',fsIcons);document.addEventListener('webkitfullscreenchange',fsIcons);
function nextCam(){camMode=(camMode+1)%4;toast(TA_('camN')[camMode]);}

let stepI=0,prevStep=0,carBack=1;
function stepper(){const lb=[T('sTrack'),T('sCar'),T('sCustom'),T('sRace')],ord=[1,2,9,3],cur=ord.indexOf(stepI);return'<div class="stp">'+lb.map((l,i)=>{const n=i+1,cl=i===cur?'on':i<cur?'ok':'';return(i?'<span class="sl'+(i<=cur?' done':'')+'"></span>':'')+'<span class="sd '+cl+'"><b>'+(i<cur?svg('check'):n)+'</b><span>'+l+'</span></span>';}).join('')+'</div>';}
function go(n){stepI=n;menuRender();}
function foot(bl,bs,gl,gs,gid){$('mf').innerHTML='<button class="gh" id="fb">'+svg('arrL')+'<span>'+bl+'</span></button>'+(gl?'<button class="go" id="'+(gid||'fg')+'" style="flex:1">'+gl+'</button>':'');
$('fb').onclick=typeof bs==='function'?bs:()=>go(bs);if(gl&&typeof gs!=='undefined')$(gid||'fg').onclick=typeof gs==='function'?gs:()=>go(gs);}
function cards(el,items,key,cb){el.innerHTML='';items.forEach((it,i)=>{const b=document.createElement('button');b.className='co'+(cfg[key]===i?' sel':'');b.innerHTML=it.h+'<span class="ck">'+svg('check')+'</span>';b.setAttribute('aria-label',it.a);
b.onclick=()=>{if(cfg[key]===i)return;cfg[key]=i;[...el.children].forEach((c,j)=>c.classList.toggle('sel',j===i));cb&&cb(i);};el.appendChild(b);});
requestAnimationFrame(()=>items.forEach((it,i)=>it.d&&el.children[i]&&it.d(el.children[i].querySelector('canvas'),i)));}
function seg(el,items,key,cb,ob){ob=ob||cfg;el.innerHTML='<span class="ind"></span>';items.forEach((it,i)=>{const b=document.createElement('button');b.className='sg'+(ob[key]===i?' sel':'');b.textContent=it;
b.onclick=()=>{if(ob[key]===i)return;ob[key]=i;[...el.querySelectorAll('.sg')].forEach((c,j)=>c.classList.toggle('sel',j===i));segInd(el,true);cb&&cb(i);};el.appendChild(b);});
requestAnimationFrame(()=>segInd(el,false));}
function segInd(el,anim){const s=el.querySelector('.sg.sel'),ind=el.querySelector('.ind');if(!s||!ind)return;ind.style.transition=anim?'':'none';ind.style.width=s.offsetWidth+'px';ind.style.transform='translateX('+(s.offsetLeft-3)+'px)';if(!anim){void ind.offsetWidth;ind.style.transition='';}}
const bar=(lb,v)=>'<div class="st"><span>'+lb+'</span><b><i style="width:'+Math.round(Math.max(0.12,Math.min(1,v))*100)+'%"></i></b></div>';
function drawTrack(c,i){if(!c)return;const w=c.clientWidth||150,h=c.clientHeight||74,x=hc(c,w,h),t=TR[i];x.fillStyle=TH[t.th].card;x.fillRect(0,0,w,h);
const ps=new THREE.CatmullRomCurve3(t.p.map(q=>new THREE.Vector3(q[0],0,q[1])),true,'centripetal').getSpacedPoints(160);
let a=1e9,b=-1e9,c0=1e9,d=-1e9;ps.forEach(p=>{a=Math.min(a,p.x);b=Math.max(b,p.x);c0=Math.min(c0,p.z);d=Math.max(d,p.z);});
const sc=Math.min((w-24)/(b-a),(h-18)/(d-c0)),ox=(w-(b-a)*sc)/2,oz=(h-(d-c0)*sc)/2,X=v=>ox+(v.x-a)*sc,Z=v=>oz+(v.z-c0)*sc;
x.lineJoin='round';x.beginPath();ps.forEach((p,k)=>k?x.lineTo(X(p),Z(p)):x.moveTo(X(p),Z(p)));x.closePath();x.strokeStyle='rgba(0,0,0,0.35)';x.lineWidth=7;x.stroke();x.strokeStyle='#fff';x.lineWidth=2.5;x.stroke();
x.fillStyle='#ff5a36';x.beginPath();x.arc(X(ps[0]),Z(ps[0]),4,0,7);x.fill();}
function specR(){const el=$('cSpec');if(!el)return;const d=CARS[cfg.c],st=[[T('stTop'),nv(d.max,1.08,1.38)],[T('stAcc'),nv(d.acc,0.014,0.021)],[T('stBrk'),nv(d.brk,0.026,0.034)],[T('stGrip'),nv(d.grip,0.0145,0.019)],[T('stOff'),nv(d.off,0.4,0.95)]];
if(!el.firstChild)el.innerHTML='<div class="sh"><div style="min-width:0"><div class="sn" id="sN"></div><div class="sub" id="sT"></div></div><div class="chips" id="sC"></div></div><div class="bars">'+st.map((s,i)=>'<div class="br"><span>'+s[0]+'</span><i><b id="sb'+i+'"></b></i></div>').join('')+'</div>';
const ch=t=>'<span class="chip">'+t+'</span>';$('sN').textContent=carN(cfg.c);$('sT').textContent=TA_('tags')[cfg.c];$('sC').innerHTML=ch(Math.round(SPD(d.max*180))+' '+UN())+ch(d.awd?T('drvA'):T('drvR'))+ch(d.m<0.95?T('wL'):d.m<1.25?T('wM'):T('wH'));
requestAnimationFrame(()=>st.forEach((s,i)=>{const b=$('sb'+i);if(b)b.style.width=Math.round(Math.max(0.08,Math.min(1,s[1]))*100)+'%';}));}
function drawCar(c,i){if(!c)return;const d=CARS[i],w=c.clientWidth||110,h=c.clientHeight||46,x=hc(c,w,h),cc=new THREE.Color(COLS[cfg.k][1]),col='#'+cc.getHexString(),dk='#'+cc.clone().multiplyScalar(0.55).getHexString(),lt='#'+cc.clone().lerp(new THREE.Color(1,1,1),0.35).getHexString();
const top=Math.max(...d.body.map(q=>q[1]),...d.cab.map(q=>q[1])),sc=Math.min((w-10)/5.0,(h-6)/(top+0.15)),X=z=>w/2+z*sc,Y=y=>h-3-y*sc;
const path=pts=>{x.beginPath();pts.forEach((p,k)=>k?x.lineTo(X(p[0]),Y(p[1])):x.moveTo(X(p[0]),Y(p[1])));x.closePath();};
x.fillStyle='rgba(0,0,0,0.35)';x.beginPath();x.ellipse(w/2,h-3,2.5*sc,2.6,0,0,7);x.fill();
path(d.cab);x.fillStyle='#22303f';x.fill();x.strokeStyle=dk;x.lineWidth=Math.max(1.2,sc*0.06);x.stroke();
path(d.body);const g=x.createLinearGradient(0,Y(top),0,Y(d.body[0][1]));g.addColorStop(0,lt);g.addColorStop(0.55,col);g.addColorStop(1,dk);x.fillStyle=g;x.fill();
x.strokeStyle='rgba(255,255,255,0.35)';x.lineWidth=1;x.beginPath();x.moveTo(X(d.body[0][0]+0.3),Y(d.body[0][1]+0.18));x.lineTo(X(d.body[1][0]-0.3),Y(d.body[1][1]+0.18));x.stroke();
x.fillStyle='#fff6d8';x.fillRect(X(d.hl[0])-2,Y(d.hl[1])-1.5,3,3);x.fillStyle='#ff3b30';x.fillRect(X(d.tl[0])-1,Y(d.tl[1])-1.5,3,3);
for(const q of[[d.wh.f,d.wh.r],[d.wh.b,d.wh.rr]]){x.fillStyle='#0d0e10';x.beginPath();x.arc(X(q[0]),Y(q[1]),q[1]*sc,0,7);x.fill();x.fillStyle=d.rim==='white'?'#f2f2f2':d.rim==='dark'?'#5a606a':d.rim==='gold'?'#d4a83a':'#c9ced6';x.beginPath();x.arc(X(q[0]),Y(q[1]),q[1]*sc*0.6,0,7);x.fill();x.fillStyle='#1a1c20';x.beginPath();x.arc(X(q[0]),Y(q[1]),q[1]*sc*0.18,0,7);x.fill();}}
const nv=(v,a,b)=>0.25+0.75*(v-a)/(b-a);
function prev(){const e=$('prev'),sh=mode==='menu'&&stepI>0&&stepI!==4&&stepI!==5&&stepI!==7&&stepI!==8&&G.clientWidth>=760;e.classList.toggle('on',sh);if(!sh)return;
if(stepI===2||stepI===9){const d=CARS[cfg.c];e.innerHTML='<div class="pt">'+carN(cfg.c)+'</div><div class="sub">'+TA_('tags')[cfg.c]+' · '+colN(cfg.k)+'</div><div class="sub" style="margin-top:4px">'+T('topSpeed')+' '+Math.round(SPD(d.max*180))+' '+UN()+'</div>';}
else{const t=TR[cfg.t],rc=REC[cfg.t];e.innerHTML='<div class="pt">'+trN(cfg.t)+'</div><div class="sub" style="margin-top:2px"><span style="color:'+t.dc+'">'+TA_('tDif')[cfg.t]+'</span> · '+LEN(t.len)+'</div><div class="sub">'+TA_('tNote')[cfg.t]+'</div><div class="sub">'+T('record')+': '+(rc===undefined?T('none'):fmt(rc))+'</div>';}}
const dotC=c=>'<span class="cdot" style="background:#'+new THREE.Color(c).getHexString()+'"></span>';
function sumHTML(){const t=TR[cfg.t],d=CARS[cfg.c],row=(k,v)=>'<div class="kr"><span class="sub" style="font-size:12px">'+k+'</span><span class="kv">'+v+'</span></div>';
return row(T('sTrack'),trN(cfg.t))+row(T('sCar'),dotC(COLS[cfg.k][1])+carN(cfg.c))+row(T('field'),T('carsLaps',{n:OPP[cfg.o]+1,l:LAPS[cfg.l]}));}
const HM=(id,ic,t,s,pri)=>'<button class="hm'+(pri?' pri':'')+'" id="'+id+'"><span class="ic">'+svg(ic)+'</span><span class="hmt"><span class="nm" style="font-size:14px">'+t+'</span><span class="sub">'+s+'</span></span>'+svg('arrR')+'</button>';

function menuRender(quiet){const mb=$('mb'),fw=stepI>=prevStep;prevStep=stepI;
const flow=(stepI>=1&&stepI<=3||stepI===9)&&carBack!==6;$('mst').innerHTML=flow?stepper():'';$('mst').style.display=flow?'block':'none';

if(stepI===0){carBack=1;mb.innerHTML='<div style="margin:2px 0 4px"><div class="hero">'+T('hero')+'</div><div class="sub" style="font-size:13px;margin-top:8px">'+T('heroSub')+'</div></div>'+'<label class="nmBox"><span class="nmI">'+svg('flag')+'</span><span class="nmL">'+T('pName')+'</span><input id="pnm" maxlength="16" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="'+T('namePh')+'"></label>'+
HM('h1','flag',T('race'),T('raceSub'),1)+HM('h4','users',T('online'),T('onlineSub'))+HM('h2','bolt',T('quick'),trN(cfg.t)+' · '+carN(cfg.c))+HM('h5','gear',T('settings'),T('settingsSub'))+HM('h3','key',T('controls'),T('controlsSub'));
{const ni=$('pnm');ni.value=SET.name||'';ni.oninput=()=>{const v=ni.value.replace(/[<>&"'`]/g,'');if(v!==ni.value)ni.value=v;SET.name=v.trim().slice(0,16);saveSet();};ni.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')ni.blur();};ni.onchange=()=>{if(NET.on&&NET.conn)sendHello();};}$('mf').innerHTML='';$('h1').onclick=()=>go(1);$('h2').onclick=()=>startRace();$('h3').onclick=()=>go(4);$('h4').onclick=()=>go(5);$('h5').onclick=()=>go(8);}
else if(stepI===1){mb.innerHTML='<div class="mt">'+T('pickTrack')+'</div><div class="g3" id="oT"></div>';
cards($('oT'),TR.map((t,i)=>({a:trN(i),h:'<canvas class="cv3"></canvas><div class="nm">'+trN(i)+'</div><div class="sub"><i class="dd" style="background:'+t.dc+'"></i>'+TA_('tShort')[i]+'</div>',d:drawTrack})),'t',()=>rebuild());
foot(T('back'),0,'<span>'+T('next')+'</span>'+svg('arrR'),2);}
else if(stepI===2){mb.innerHTML='<div class="mt">'+T('pickCar')+'</div><div class="g3 cg" id="oC"></div><div class="spec" id="cSpec"></div><div><div class="sec">'+T('paint')+' · <span id="cnm" style="color:#e8eaee;text-transform:none;letter-spacing:0">'+colN(cfg.k)+'</span></div><div id="oK" class="sws"></div></div>';
cards($('oC'),CARS.map((c,i)=>({a:carN(i),h:'<canvas class="cv4"></canvas><div class="nm">'+carN(i)+'</div>',d:drawCar})),'c',()=>{carChanged();});specR();
const ok=$('oK');COLS.forEach((cc,i)=>{const b=document.createElement('button');b.className='sw'+(cfg.k===i?' sel':'');b.style.background='#'+new THREE.Color(cc[1]).getHexString();b.setAttribute('aria-label',colN(i));
b.onclick=()=>{if(cfg.k===i)return;cfg.k=i;[...ok.children].forEach((e,j)=>e.classList.toggle('sel',j===i));$('cnm').textContent=colN(i);[...$('oC').children].forEach((e,j)=>drawCar(e.querySelector('canvas'),j));carChanged();};ok.appendChild(b);});
foot(T('back'),carBack===6?6:1,'<span>'+T('next')+'</span>'+svg('arrR'),9);}
else if(stepI===9){const S2=(k,id,wr)=>'<div><div class="sec">'+T(k)+'</div><div class="seg'+(wr?' wrap':'')+'" id="'+id+'"></div></div>';
mb.innerHTML='<div class="mt">'+T('custom')+'</div>'+S2('rimL','cR',1)+S2('livL','cL')+S2('spnL','cS',1)+S2('numL','cN')+S2('tintL','cT');const ch=()=>carChanged();
seg($('cR'),TA_('rimO'),'rimI',ch);seg($('cL'),TA_('livO'),'livI',ch);seg($('cS'),TA_('spnO'),'spnI',ch);seg($('cN'),NUMS.map(String),'num',ch);seg($('cT'),TA_('tintO'),'tint',ch);
if(carBack===6)foot(T('back'),2,'<span>'+T('done')+'</span>'+svg('check'),6);else foot(T('back'),2,'<span>'+T('next')+'</span>'+svg('arrR'),3);}
else if(stepI===3){const S2=(k,id)=>'<div><div class="sec">'+T(k)+'</div><div class="seg" id="'+id+'"></div></div>';mb.innerHTML='<div class="mt">'+T('raceSet')+'</div>'+S2('opp','oO')+S2('laps','oL')+S2('skill','oD')+S2('weather','oW')+'<div id="sum" class="box"></div>';
const up=()=>{$('sum').innerHTML=sumHTML();};seg($('oO'),OPP.map(String),'o',()=>{newRace();up();});seg($('oL'),LAPS.map(String),'l',up);seg($('oD'),TA_('dif'),'d');seg($('oW'),TA_('wOpts'),'w',saveSet,SET);up();
foot(T('back'),9,svg('flag')+'<span>'+T('start')+'</span>',()=>startRace());}
else if(stepI===4){const K2=(a,t)=>'<div class="kr"><span>'+t+'</span><span style="display:flex;gap:4px">'+a.map(k=>'<span class="kc">'+k+'</span>').join('')+'</span></div>';
mb.innerHTML='<div class="mt">'+T('controls')+'</div><div>'+K2(['W','↑'],T('gas'))+K2(['S','↓'],T('brake'))+K2(['A','D'],T('steer'))+K2(['Space'],T('hb'))+K2(['Shift','N'],T('nitro'))+K2(['C'],T('cam'))+K2(['F'],T('fs'))+K2(['R'],T('reset'))+K2(['P','Esc'],T('pause'))+K2(['M'],T('sound'))+'</div><div class="sub" style="font-size:12px">'+T('helpTip')+'</div>';
foot(T('back'),0);}
else if(stepI===8){const S2=(k,id)=>'<div><div class="sec">'+T(k)+'</div><div class="seg" id="'+id+'"></div></div>';const LG={i:SET.lang==='en'?1:0};
mb.innerHTML='<div class="mt">'+T('settings')+'</div>'+S2('lang','sL')+S2('units','sU')+S2('volume','sV')+S2('defCam','sC')+S2('steerS','sS')+S2('graphics','sQ');
seg($('sL'),['Magyar','English'],'i',()=>{SET.lang=LG.i?'en':'hu';saveSet();applyLang();menuRender(true);},LG);seg($('sU'),['km/h','mph'],'unit',saveSet,SET);
seg($('sV'),TA_('volOpts'),'vol',()=>{saveSet();setSnd(SET.vol>0);},SET);seg($('sC'),TA_('camS'),'cam',saveSet,SET);seg($('sS'),TA_('steerOpts'),'steer',saveSet,SET);
seg($('sQ'),TA_('ql'),'q',()=>{cfg.q=SET.q;saveSet();applyQ();rebuild();},SET);
foot(T('back'),0,svg('check')+'<span>'+T('done')+'</span>',()=>{saveSet();toast(T('saved'),'#3ddc97');go(0);});}
else if(stepI===5){mb.innerHTML='<div class="mt">'+T('onlineT')+'</div><div class="sub" style="font-size:13px">'+T('onlineSub2')+'</div>'+HM('o1','plus',T('create'),T('createSub'),1)+HM('o2','login',T('join'),T('joinSub'))+
'<div class="box sub" style="font-size:12px">'+T('p2p')+' '+T('note')+'</div>';
$('o1').onclick=hostRoom;$('o2').onclick=()=>go(7);foot(T('back'),0);}
else if(stepI===7){mb.innerHTML='<div class="mt">'+T('joinT')+'</div><div class="sub" style="font-size:13px">'+T('joinSub2')+'</div><input id="jc" class="inp" maxlength="5" placeholder="ABCDE" autocomplete="off" spellcheck="false"><div id="nst" class="nst"></div>';
const jc=$('jc');jc.oninput=()=>{jc.value=jc.value.toUpperCase().replace(/[^A-Z0-9]/g,'');};jc.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')joinRoom(jc.value);};setTimeout(()=>jc.focus(),50);
foot(T('back'),()=>{netReset();go(5);},svg('login')+'<span>'+T('joinBtn')+'</span>',()=>joinRoom(jc.value));}
else if(stepI===6){lobbyHTML();}
if(!quiet){mb.classList.remove('sf','sb');void mb.offsetWidth;mb.classList.add(fw?'sf':'sb');[...mb.children].forEach((e,i)=>{e.classList.remove('it');void e.offsetWidth;e.classList.add('it');e.style.animationDelay=(60+i*50)+'ms';});[...$('mf').children].forEach(e=>{e.classList.remove('it');void e.offsetWidth;e.classList.add('it');e.style.animationDelay='200ms';});}
prev();fitMenu();}
function lobbyHTML(){const mb=$('mb'),con=NET.conn&&NET.conn.open,r=NET.remote;
const pr=(nm,car,col,tag,btn)=>'<div class="prow">'+(car!==null?dotC(col):'<span class="cdot wait"></span>')+'<span class="pn"><span class="nm">'+nm+'</span><span class="sub">'+tag+'</span></span>'+(btn||'')+'</div>';
const kr=(k,v)=>'<div class="kr"><span class="sub" style="font-size:12px">'+k+'</span><span class="kv">'+v+'</span></div>';
let h='<div class="mt">'+T('room')+'</div><div class="code"><span class="sub">'+T('roomCode')+'</span><b id="ccode">'+(NET.code||'-----')+'</b>'+(NET.host?'<button class="ib sm" id="cpy" aria-label="Copy">'+svg('copy')+'</button>':'')+'</div><div id="nst" class="nst"></div>';
h+='<div class="box" style="padding:4px 12px">'+pr(T('you'),cfg.c,COLS[cfg.k][1],carN(cfg.c)+(NET.host?' · '+T('host'):''),'<button class="gh sm" id="lcar">'+T('carBtn')+'</button>')+pr(T('friend'),r?r.car:null,r?COLS[r.col][1]:0,r?carN(r.car)+(NET.host?'':' · '+T('host')):T('waiting'))+'</div>';
const S2=(k,id)=>'<div><div class="sec">'+T(k)+'</div><div class="seg" id="'+id+'"></div></div>';
if(NET.host)h+=S2('sTrack','lT')+'<div class="g2" style="gap:10px">'+S2('lapsS','lL')+S2('aiCars','lO')+'</div>'+S2('aiSkill','lD');
else h+='<div class="box">'+kr(T('sTrack'),trN(cfg.t))+kr(T('lapsS'),LAPS[cfg.l])+kr(T('aiCars'),NOPP[cfg.no]+' · '+TA_('dif')[cfg.d])+'</div>';
mb.innerHTML=h;netStatus(NET.status||'',NET.err);
if(NET.host){seg($('lT'),TA_('tShort'),'t',()=>{rebuild();sendCfg();});seg($('lL'),LAPS.map(String),'l',sendCfg);seg($('lO'),NOPP.map(String),'no',sendCfg);seg($('lD'),TA_('dif'),'d',sendCfg);
$('cpy').onclick=()=>{try{navigator.clipboard.writeText(NET.code).then(()=>toast(T('copied')),()=>toast(T('copyMan')+NET.code));}catch(e){toast(T('copyMan')+NET.code);}};}
$('lcar').onclick=()=>{carBack=6;go(2);};
foot(T('leave'),()=>{netReset();carBack=1;go(5);},NET.host?svg('flag')+'<span>'+T('start')+'</span>':'<span>'+T('hostStarts')+'</span>',NET.host?hostStart:undefined,'lgo');
const g=$('lgo');if(g){g.classList.toggle('dis',NET.host?!con:true);}}
function carChanged(){swapPlayer();prev();specR();if(NET.on)sendHello();}
function fitMenu(){const mp=$('mp');if(!mp)return;mp.style.height='auto';mp.style.transform='translateY(-50%)';const nat=mp.scrollHeight,av=G.clientHeight-32,H=Math.max(nat,Math.min(600,av));mp.style.height=H+'px';const s=Math.min(1,av/H);mp.style.transform='translateY(-50%) scale('+s+')';}

const KM={ShiftLeft:'n',ShiftRight:'n',KeyN:'n',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'hb'};
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;if(mode==='intro'&&(e.code==='Space'||e.code==='Enter'||e.code==='Escape')){skipIntro();e.preventDefault();return;}const k=KM[e.code];if(k){keys[k]=1;e.preventDefault();}
if(e.code==='Escape'||e.code==='KeyP'){if(mode==='race')pause();else if(mode==='pause'&&performance.now()-fsExit>400)resume();}
if(e.code==='KeyR'&&mode==='race')respawn(pl);if(e.code==='KeyM')setSnd(!snd);if(e.code==='KeyC'&&mode!=='menu')nextCam();if(e.code==='KeyF')toggleFS();
if(e.code==='Enter'&&mode==='menu'){e.preventDefault();if(stepI===3)startRace();else if(stepI===1)go(2);else if(stepI===2)go(9);else if(stepI===9&&carBack!==6)go(3);}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)keys[k]=0;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;});
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=1;b.classList.add('on');});['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,()=>{keys[k]=0;b.classList.remove('on');}));});
$('pR').onclick=resume;$('pA').onclick=again;$('pM').onclick=leave;$('dA').onclick=again;$('dM').onclick=leave;$('pb').onclick=pause;$('cb').onclick=nextCam;
$('eb').onclick=$('mex').onclick=toggleFS;$('sb').onclick=$('msb').onclick=()=>setSnd(!snd);
['pR','pA','pM','dA','dM'].forEach(id=>{const b=$(id),t=b.textContent;b.innerHTML=svg({pR:'play',pA:'redo',pM:'home',dA:'redo',dM:'home'}[id])+'<span class="tx">'+t+'</span>';});
function rs(){const w=G.clientWidth,h=G.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(mode==='menu'){prev();fitMenu();document.querySelectorAll('.seg').forEach(s=>segInd(s,false));}}
new ResizeObserver(rs).observe(G);addEventListener('resize',rs);

let nitLow=0;
function nitroHud(){const n=pl.nit,e=$('nit');$('nitF').style.width=n.toFixed(1)+'%';$('nitV').textContent=Math.floor(n)+'%';e.classList.toggle('act',pl.boost);e.classList.toggle('rdy',!pl.boost&&n>=12);e.classList.toggle('low',n<12);
if(keys.n&&!pl.boost&&n<12&&mode==='race'&&performance.now()-nitLow>1800){nitLow=performance.now();toast(T('lowN'),'#ff8a6b');}}
function flashPos(){const e=$('hP');e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash');}

$('intro').addEventListener('pointerdown',e=>{e.preventDefault();skipIntro();});
