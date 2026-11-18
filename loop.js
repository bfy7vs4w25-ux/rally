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
let FRN=0,ftAvg=16.7,drT=0,drS=1;

const HELI=(()=>{const g=new THREE.Group(),bm=S(0xf2f3f5,0.45,0.3),rm=S(0xd7263d,0.3,0.4),dk=S(0x1a1d22,0.4,0.5),gl=S(0x1d2a38,0.9,0.05),add=(geo,m,sx,sy,sz,x,y,z,p)=>{const o=new THREE.Mesh(geo,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);(p||g).add(o);return o;};
add(GEO.ball,bm,1.25,1.15,2.4,0,0,0);add(GEO.ball,rm,1.27,0.35,2.25,0,-0.25,0);add(GEO.ball,gl,1.0,0.75,1.15,0,0.3,1.35);add(GEO.box,bm,0.34,0.34,4.6,0,0.3,-3.4);add(GEO.box,rm,0.08,1.3,0.8,0,0.95,-5.6);add(GEO.box,bm,1.6,0.08,0.5,0,0.4,-5.2);
for(const s of[-1,1]){add(GEO.box,dk,0.08,0.08,3.4,s*0.95,-1.4,0.1);add(GEO.box,dk,0.06,0.5,0.06,s*0.85,-1.15,0.9);add(GEO.box,dk,0.06,0.5,0.06,s*0.85,-1.15,-0.8);}add(GEO.ball,dk,0.32,0.32,0.32,0,-0.95,1.9);add(GEO.cyl,dk,0.12,0.5,0.12,0,1.3,0);
const rot=new THREE.Group();rot.position.y=1.55;g.add(rot);add(GEO.box,dk,11,0.04,0.3,0,0,0,rot);add(GEO.box,dk,0.3,0.04,11,0,0,0,rot);const tr=new THREE.Group();tr.position.set(0.24,0.95,-5.6);g.add(tr);add(GEO.box,dk,0.04,1.5,0.14,0,0,0,tr);
g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.visible=false;scene.add(g);return{g,rot,tr,yaw:0,init:false};})();
function heliStep(dt){const on=mode==='race'||mode==='count'||mode==='intro'||mode==='done'||mode==='pause';HELI.g.visible=on&&!!pl;if(!HELI.g.visible){HELI.init=false;return;}
const o=mode==='race'||mode==='done'?standings():[pl],ld=o[0]||pl,f=Math.sin(ld.ra),g=Math.cos(ld.ra),side=Math.sin(TT*0.00021)*42,tx=ld.rx-f*26+g*side,tz=ld.rz-g*26-f*side,ty=46+Math.sin(TT*0.0007)*4,G=HELI.g;
if(!HELI.init){G.position.set(tx,ty+30,tz-80);HELI.init=true;}const k=ex(0.0012,dt),px=G.position.x,pz=G.position.z;G.position.x+=(tx-px)*k;G.position.z+=(tz-pz)*k;G.position.y+=(ty-G.position.y)*k;
const vx=G.position.x-px,vz=G.position.z-pz,sp=Math.hypot(vx,vz)/Math.max(1,dt);if(sp>0.002)HELI.yaw+=wrap(Math.atan2(vx,vz)-HELI.yaw)*ex(0.002,dt);G.rotation.set(Math.min(0.25,sp*1.6),HELI.yaw,0,'YXZ');HELI.rot.rotation.y+=dt*0.05;HELI.tr.rotation.x+=dt*0.09;}
function loop(t){const dt=Math.min(100,t-last);last=t;ftAvg=ftAvg*0.94+dt*0.06;drT+=dt;if(drT>1200){drT=0;const base=cfg.q?DPR:Math.min(1,DPR);let ns=drS;if(ftAvg>20.5)ns=Math.max(0.5,drS-0.12);else if(ftAvg<15.5)ns=Math.min(1,drS+0.06);if(ns!==drS){drS=ns;ren.setPixelRatio(base*drS);rs();}}TT+=dt;const d=dt/16.67;
if(mode==='count'){cdE+=dt;const n=Math.min(5,Math.floor(cdE/600));if(n!==lastLit&&cdE<3600){lastLit=n;lamps(n);if(n>0)beep(440,0.18);}
if(cdE>=3600){mode='race';acc=0;lamps(0,true);beep(880,0.4,0.06);toast(T('go'),'#2ee66b');cheer(0.8);setTimeout(()=>{if(mode!=='menu')$('lt').style.display='none';},900);setTimeout(()=>{if(mode!=='count')lamps(0);},2500);}}
if(mode==='race'||mode==='done'||(mode==='pause'&&NET.on)){acc+=dt;let n=0;while(acc>=STEP&&n<12){gt+=STEP;step(STEP/16.67,STEP);acc-=STEP;n++;}if(n>=12)acc=0;}
const al=(mode==='race'||mode==='done'||(mode==='pause'&&NET.on))?acc/STEP:1;netTick(dt);visuals(al,d,TT);
dustStep(d);heliStep(dt);if(pl&&mode!=='menu'){let lv=0;for(const s of STP){const dd=Math.hypot(s[0]-pl.rx,s[1]-pl.rz);if(dd<160)lv+=s[2]*(1-dd/160);}crowdSnd(Math.min(1,lv),mode!=='pause');}else crowdSnd(0,false);CHEER*=Math.pow(0.9985,dt);wxStep(dt,d,TT);if(CLOUD)CLOUD.rotation.y+=dt*0.000005;
FLAGS.forEach(f=>f.m.rotation.y=f.b+Math.sin(TT*0.004+f.p)*0.35);
CUN.t.value=TT*0.001;CUN.ex.value+=((mode==='race'||mode==='done'||mode==='count'||mode==='intro'?1:0.35)-CUN.ex.value)*ex(0.002,dt);pMat.uniforms.sc.value=G.clientHeight*ren.getPixelRatio()*0.5/Math.tan(cam.fov*Math.PI/360);for(const w of WATS)w.material.normalMap.offset.set(TT*0.000012,TT*0.000007);if(FERRIS){FERRIS.w.rotation.z=TT*0.00004;for(const g of FERRIS.g)g.rotation.z=-FERRIS.w.rotation.z;}
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
cullStep();FRN++;if(cfg.q){ren.shadowMap.autoUpdate=true;}else{ren.shadowMap.autoUpdate=false;if(FRN%2===0||mode==='menu')ren.shadowMap.needsUpdate=true;}ren.render(scene,cam);requestAnimationFrame(loop);}
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
