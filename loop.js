const tmp=new THREE.Vector3(),look=new THREE.Vector3(),camLook=new THREE.Vector3();let last=performance.now(),TT=0,orb=0,first=true,acc=0,camYaw=0,camDist=11,shakeT=0;
const STEP=1000/120,INTRO_D=6800;let introE=0;
function introCam(dt){introE+=dt;const t=introE,f=Math.sin(pl.a),g=Math.cos(pl.a),rx=g,rz=-f,sm=u=>u*u*(3-2*u);let gx=0,gz=0;for(const c of cars){gx+=c.x;gz+=c.z;}gx/=cars.length;gz/=cars.length;
let lead=pl,best=-1e9;for(const c of cars){const p=(c.x-gx)*f+(c.z-gz)*g;if(p>best){best=p;lead=c;}}let px,py,pz,lx,ly,lz,fv;
if(t<2400){const e=sm(t/2400),ax=lead.x+f*8,az=lead.z+g*8,s=-7+14*e;px=ax+rx*s;pz=az+rz*s;py=0.85+e*0.5;lx=gx+rx*s*0.3;ly=0.9;lz=gz+rz*s*0.3;fv=44;}
else if(t<4800){const u=(t-2400)/2400,an=pl.a+0.5+sm(u)*2.1,r=6.2-u;px=pl.x+Math.sin(an)*r;pz=pl.z+Math.cos(an)*r;py=1.5+u*0.4;lx=pl.x;ly=0.7;lz=pl.z;fv=40;}
else{const e=sm(Math.min(1,(t-4800)/(INTRO_D-4800))),dd=19-8.2*e;px=pl.x-f*dd;pz=pl.z-g*dd;py=10-5.3*e;lx=pl.x+f*5;ly=1.25;lz=pl.z+g*5;fv=58+(1-e)*8;}
if(t<120||Math.abs(t-2400)<dt||Math.abs(t-4800)<dt){cam.position.set(px,py,pz);camLook.set(lx,ly,lz);}else{const k=ex(0.02,dt);cam.position.lerp(tmp.set(px,py,pz),k);camLook.lerp(look.set(lx,ly,lz),k);}
cam.lookAt(camLook);cam.fov+=(fv-cam.fov)*ex(0.01,dt);cam.near=0.3;cam.updateProjectionMatrix();shadowAt(gx,gz,60);if(introE>=INTRO_D)beginCount();}
function ex(k,dt){return 1-Math.exp(-k*dt);}
let ftAvg=16.7,drT=0,drS=1;
function loop(t){const dt=Math.min(100,t-last);last=t;ftAvg=ftAvg*0.94+dt*0.06;drT+=dt;if(drT>1200){drT=0;const base=cfg.q?DPR:Math.min(1,DPR);let ns=drS;if(ftAvg>20.5)ns=Math.max(0.5,drS-0.12);else if(ftAvg<15.5)ns=Math.min(1,drS+0.06);if(ns!==drS){drS=ns;ren.setPixelRatio(base*drS);rs();}}TT+=dt;const d=dt/16.67;
if(mode==='count'){cdE+=dt;const n=Math.min(5,Math.floor(cdE/600));if(n!==lastLit&&cdE<3600){lastLit=n;lamps(n);if(n>0)beep(440,0.18);}
if(cdE>=3600){mode='race';acc=0;lamps(0,true);beep(880,0.4,0.06);toast(T('go'),'#2ee66b');setTimeout(()=>{if(mode!=='menu')$('lt').style.display='none';},900);setTimeout(()=>{if(mode!=='count')lamps(0);},2500);}}
if(mode==='race'||mode==='done'||(mode==='pause'&&NET.on)){acc+=dt;let n=0;while(acc>=STEP&&n<12){gt+=STEP;step(STEP/16.67,STEP);acc-=STEP;n++;}if(n>=12)acc=0;}
const al=(mode==='race'||mode==='done'||(mode==='pause'&&NET.on))?acc/STEP:1;netTick(dt);visuals(al,d,TT);
dustStep(d);wxStep(dt,d,TT);if(CLOUD)CLOUD.rotation.y+=dt*0.000005;
FLAGS.forEach(f=>f.m.rotation.y=f.b+Math.sin(TT*0.004+f.p)*0.35);
CUN.t.value=TT*0.001;CUN.ex.value+=((mode==='race'||mode==='done'||mode==='count'||mode==='intro'?1:0.35)-CUN.ex.value)*ex(0.002,dt);pMat.uniforms.sc.value=G.clientHeight*ren.getPixelRatio()*0.5/Math.tan(cam.fov*Math.PI/360);if(WATER)WATER.material.normalMap.offset.set(TT*0.000012,TT*0.000007);
if(mode==='menu'){orb+=dt*0.00008;let lk,fv;
if((stepI===2||stepI===9)&&pl){tmp.set(pl.x+Math.sin(orb*4)*9.5,2.6,pl.z+Math.cos(orb*4)*9.5);lk=look.set(pl.x,0.7,pl.z);fv=38;shadowAt(pl.x,pl.z,40);}
else{tmp.set(CX+Math.sin(orb)*RAD*1.05,RAD*0.5,CZ+Math.cos(orb)*RAD*1.05);lk=look.set(CX,0,CZ);fv=50;shadowAt(CX,CZ,RAD*1.4);}
if(first){cam.position.copy(tmp);camLook.copy(lk);first=false;}const e=ex(0.0035,dt);cam.position.lerp(tmp,e);camLook.lerp(lk,e);cam.lookAt(camLook);cam.fov+=(fv-cam.fov)*e;cam.updateProjectionMatrix();}
else if(mode==='intro')introCam(dt);
else{const fx=Math.sin(pl.ra),fz=Math.cos(pl.ra),sp=Math.hypot(pl.vx,pl.vz);
if(camMode===2||camMode===3){const v=pl.v3,ck=camMode===3,lx=ck?v.hx:0,lz=ck?v.hz+0.07:2.1,ly=ck?v.hy+0.09+v.inn.rotation.x*0.4:0.95,rx=Math.cos(pl.ra),rz=-Math.sin(pl.ra);cam.position.set(pl.rx+fx*lz+rx*lx,ly,pl.rz+fz*lz+rz*lx);cam.lookAt(pl.rx+fx*40+rx*lx,ck?ly-2.4:0.85,pl.rz+fz*40+rz*lx);if(ck)cam.rotateZ(-v.inn.rotation.z*0.6);camYaw=pl.ra;}
else{const tgt=pl.ra+(pl.v>0.2?wrap(Math.atan2(pl.vx,pl.vz)-pl.ra)*0.35:0);camYaw+=wrap(tgt-camYaw)*ex(0.006,dt);
const tdist=(camMode===0?10.8+sp*2:6.8+sp*1.2)+(pl.boost?1.1:0);camDist+=(tdist-camDist)*ex(0.003,dt);const h=camMode===0?3.9+camDist*0.07:2.3+camDist*0.05;
const cf=Math.sin(camYaw),cz=Math.cos(camYaw);let sx=0,sy=0;
if(mode==='race'&&(!pl.on&&!pl.kerb)&&sp>0.2){shakeT+=dt;const a=Math.min(1,sp)*0.06;sx=Math.sin(shakeT*0.031)*a;sy=Math.sin(shakeT*0.047+1)*a;}
cam.position.set(pl.rx-cf*camDist+sx,h+sy,pl.rz-cz*camDist);cam.lookAt(pl.rx+cf*5,1.25,pl.rz+cz*5);}
if(HIT>0.002){const k=camMode===3?0.35:1;cam.position.x+=(Math.random()-0.5)*HIT*k;cam.position.y+=(Math.random()-0.5)*HIT*k;cam.position.z+=(Math.random()-0.5)*HIT*k;HIT*=Math.pow(0.88,d);}const tf=(camMode===3?70:58)+Math.min(1,sp/1.25)*14+(pl.boost?7:0);cam.fov+=(tf-cam.fov)*ex(0.004,dt);cam.near=camMode===3?0.04:0.3;cam.updateProjectionMatrix();shadowAt(pl.rx+fx*18,pl.rz+fz*18,62);}
if(SNOW){const a=SNOW.geometry.attributes.position,ar=a.array,cx=cam.position.x,cz=cam.position.z;for(let i=0;i<ar.length;i+=3){ar[i+1]-=0.12*d;ar[i]+=Math.sin(TT*0.001+i)*0.02*d;if(ar[i+1]<cam.position.y-20)ar[i+1]+=50;if(ar[i]-cx>70)ar[i]-=140;else if(cx-ar[i]>70)ar[i]+=140;if(ar[i+2]-cz>70)ar[i+2]-=140;else if(cz-ar[i+2]>70)ar[i+2]+=140;}a.needsUpdate=true;}
sky.position.copy(cam.position);sunS.position.copy(cam.position).addScaledVector(SUND,1500);
let ge={rpm:0.15};if(mode!=='menu')ge=hud(TT);
const sl=pl?pl.slip+(pl.hb&&Math.abs(pl.v)>0.3?0.06:0):0;
if(mode==='race'||mode==='count'||mode==='intro')engine(true,mode!=='race'?(keys.up?0.75:0.15):ge.rpm,mode==='race'?sl:0);else if(mode==='done')engine(true,ge.rpm*0.7,0);else engine(false,0,0);
if(mode==='done'&&$('done').classList.contains('on')){doneT+=dt;if(doneT>600){doneT=0;results();}}
ren.render(scene,cam);requestAnimationFrame(loop);}
function applyQ(){drS=1;ren.setPixelRatio(cfg.q?DPR:Math.min(1,DPR));const ms=Math.min(cfg.q?4096:2048,ren.capabilities.maxTextureSize);sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}rs();}
function rebuild(){$('load').style.display='flex';$('load').style.opacity=1;setTimeout(()=>{buildTrack(cfg.t);newRace();prev();if(stepI===6)menuRender(true);},40);}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!NET.on)pause();});
let fsExit=0;document.addEventListener('fullscreenchange',()=>{if(!isFS()){fsExit=performance.now();pause();}});
applyLang();setSnd(true);fsIcons();applyQ();
const SP=$('splash');let spP=0;const spBar=p=>{spP=Math.max(spP,p);$('spB').style.width=(spP*100)+'%';};spBar(0.08);const spTk=setInterval(()=>spBar(Math.min(0.85,spP+0.04)),120);
function spReady(){clearInterval(spTk);spBar(1);setTimeout(()=>SP.classList.add('ready'),450);}
function spGo(){if(!SP.classList.contains('ready')||SP.classList.contains('out'))return;ain();SP.classList.add('out');setTimeout(()=>SP.style.display='none',900);}
SP.addEventListener('pointerdown',e=>{e.preventDefault();spGo();});addEventListener('keydown',e=>{if(SP.style.display!=='none'&&(e.code==='Enter'||e.code==='Space'))spGo();});
setTimeout(()=>{buildTrack(0);newRace();show('menu');menuRender();rs();requestAnimationFrame(t=>{loop(t);setTimeout(spReady,700);});},350);
