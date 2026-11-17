const tmp=new THREE.Vector3(),look=new THREE.Vector3(),camLook=new THREE.Vector3();let last=performance.now(),TT=0,orb=0,first=true,acc=0,camYaw=0,camDist=11,shakeT=0;
const STEP=1000/120;
function ex(k,dt){return 1-Math.exp(-k*dt);}
let ftAvg=16.7,drT=0,drS=1;
function loop(t){const dt=Math.min(100,t-last);last=t;ftAvg=ftAvg*0.94+dt*0.06;drT+=dt;if(drT>1200){drT=0;const base=cfg.q?DPR:Math.min(1,DPR);let ns=drS;if(ftAvg>20.5)ns=Math.max(0.5,drS-0.12);else if(ftAvg<15.5)ns=Math.min(1,drS+0.06);if(ns!==drS){drS=ns;ren.setPixelRatio(base*drS);rs();}}TT+=dt;const d=dt/16.67;
if(mode==='count'){cdE+=dt;const n=Math.min(5,Math.floor(cdE/600));if(n!==lastLit&&cdE<3600){lastLit=n;lamps(n);if(n>0)beep(440,0.18);}
if(cdE>=3600){mode='race';acc=0;lamps(0,true);beep(880,0.4,0.06);toast(T('go'),'#2ee66b');setTimeout(()=>{if(mode!=='menu')$('lt').style.display='none';},900);setTimeout(()=>{if(mode!=='count')lamps(0);},2500);}}
if(mode==='race'||mode==='done'||(mode==='pause'&&NET.on)){acc+=dt;let n=0;while(acc>=STEP&&n<12){gt+=STEP;step(STEP/16.67,STEP);acc-=STEP;n++;}if(n>=12)acc=0;}
const al=(mode==='race'||mode==='done'||(mode==='pause'&&NET.on))?acc/STEP:1;netTick(dt);visuals(al,d,TT);
dustStep(d);wxStep(dt,d,TT);if(CLOUD)CLOUD.rotation.y+=dt*0.000005;
FLAGS.forEach(f=>f.m.rotation.y=f.b+Math.sin(TT*0.004+f.p)*0.35);
CUN.t.value=TT*0.001;CUN.ex.value+=((mode==='race'||mode==='done'||mode==='count'?1:0.35)-CUN.ex.value)*ex(0.002,dt);pMat.uniforms.sc.value=G.clientHeight*ren.getPixelRatio()*0.5/Math.tan(cam.fov*Math.PI/360);if(WATER)WATER.material.normalMap.offset.set(TT*0.000012,TT*0.000007);
if(mode==='menu'){orb+=dt*0.00008;let lk,fv;
if(stepI===2&&pl){tmp.set(pl.x+Math.sin(orb*4)*9.5,2.6,pl.z+Math.cos(orb*4)*9.5);lk=look.set(pl.x,0.7,pl.z);fv=38;shadowAt(pl.x,pl.z,40);}
else{tmp.set(CX+Math.sin(orb)*RAD*1.05,RAD*0.5,CZ+Math.cos(orb)*RAD*1.05);lk=look.set(CX,0,CZ);fv=50;shadowAt(CX,CZ,RAD*1.4);}
if(first){cam.position.copy(tmp);camLook.copy(lk);first=false;}const e=ex(0.0035,dt);cam.position.lerp(tmp,e);camLook.lerp(lk,e);cam.lookAt(camLook);cam.fov+=(fv-cam.fov)*e;cam.updateProjectionMatrix();}
else{const fx=Math.sin(pl.ra),fz=Math.cos(pl.ra),sp=Math.hypot(pl.vx,pl.vz);
if(camMode===2){cam.position.set(pl.rx+fx*2.1,0.95,pl.rz+fz*2.1);cam.lookAt(pl.rx+fx*30,0.85,pl.rz+fz*30);camYaw=pl.ra;}
else{const tgt=pl.ra+(pl.v>0.2?wrap(Math.atan2(pl.vx,pl.vz)-pl.ra)*0.35:0);camYaw+=wrap(tgt-camYaw)*ex(0.006,dt);
const tdist=(camMode===0?10.8+sp*2:6.8+sp*1.2)+(pl.boost?1.1:0);camDist+=(tdist-camDist)*ex(0.003,dt);const h=camMode===0?3.9+camDist*0.07:2.3+camDist*0.05;
const cf=Math.sin(camYaw),cz=Math.cos(camYaw);let sx=0,sy=0;
if(mode==='race'&&(!pl.on&&!pl.kerb)&&sp>0.2){shakeT+=dt;const a=Math.min(1,sp)*0.06;sx=Math.sin(shakeT*0.031)*a;sy=Math.sin(shakeT*0.047+1)*a;}
cam.position.set(pl.rx-cf*camDist+sx,h+sy,pl.rz-cz*camDist);cam.lookAt(pl.rx+cf*5,1.25,pl.rz+cz*5);}
const tf=58+Math.min(1,sp/1.25)*14+(pl.boost?7:0);cam.fov+=(tf-cam.fov)*ex(0.004,dt);cam.updateProjectionMatrix();shadowAt(pl.rx+fx*18,pl.rz+fz*18,62);}
if(SNOW){const a=SNOW.geometry.attributes.position,ar=a.array,cx=cam.position.x,cz=cam.position.z;for(let i=0;i<ar.length;i+=3){ar[i+1]-=0.12*d;ar[i]+=Math.sin(TT*0.001+i)*0.02*d;if(ar[i+1]<cam.position.y-20)ar[i+1]+=50;if(ar[i]-cx>70)ar[i]-=140;else if(cx-ar[i]>70)ar[i]+=140;if(ar[i+2]-cz>70)ar[i+2]-=140;else if(cz-ar[i+2]>70)ar[i+2]+=140;}a.needsUpdate=true;}
sky.position.copy(cam.position);sunS.position.copy(cam.position).addScaledVector(SUND,1500);
let ge={rpm:0.15};if(mode!=='menu')ge=hud(TT);
const sl=pl?pl.slip+(pl.hb&&Math.abs(pl.v)>0.3?0.06:0):0;
if(mode==='race'||mode==='count')engine(true,mode==='count'?(keys.up?0.75:0.15):ge.rpm,mode==='race'?sl:0);else if(mode==='done')engine(true,ge.rpm*0.7,0);else engine(false,0,0);
if(mode==='done'&&$('done').classList.contains('on')){doneT+=dt;if(doneT>600){doneT=0;results();}}
ren.render(scene,cam);requestAnimationFrame(loop);}
function applyQ(){drS=1;ren.setPixelRatio(cfg.q?DPR:Math.min(1,DPR));const ms=Math.min(cfg.q?4096:2048,ren.capabilities.maxTextureSize);sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}rs();}
function rebuild(){$('load').style.display='flex';$('load').style.opacity=1;setTimeout(()=>{buildTrack(cfg.t);newRace();prev();if(stepI===6)menuRender(true);},40);}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!NET.on)pause();});
let fsExit=0;document.addEventListener('fullscreenchange',()=>{if(!isFS()){fsExit=performance.now();pause();}});
applyLang();setSnd(true);fsIcons();applyQ();
setTimeout(()=>{buildTrack(0);newRace();show('menu');menuRender();rs();requestAnimationFrame(loop);},30);
