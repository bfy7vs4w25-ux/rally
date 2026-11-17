function shapeG(pts,w,bev,smooth){const s=new THREE.Shape();if(smooth){s.moveTo(pts[0][0],pts[0][1]);s.lineTo(pts[1][0],pts[1][1]);s.splineThru(pts.slice(2).concat([pts[0]]).map(p=>new THREE.Vector2(p[0],p[1])));}else pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();const d=Math.max(0.01,w-2*bev);
const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:4,curveSegments:24});g.translate(0,0,-d/2);g.rotateY(-Math.PI/2);return K(g);}
const CGC=[];
function cgeo(ty){if(CGC[ty])return CGC[ty];const d=CARS[ty];return CGC[ty]={body:shapeG(d.body,d.w,0.07,1),cab:shapeG(d.cab,d.cw,0.05),fin:d.ex==='proto'?shapeG([[-0.7,0.98],[-2.35,1.2],[-2.38,0.8],[-1.4,0.7]],0.08,0):null};}
const WG={tire:K(new THREE.TorusGeometry(0.8,0.24,14,32)),barrel:K(new THREE.CylinderGeometry(0.62,0.62,0.7,20,1,true)),disc:K(new THREE.CylinderGeometry(0.6,0.6,0.04,16)),spk:K(new THREE.BoxGeometry(0.07,1.2,0.14)),hub:K(new THREE.CylinderGeometry(0.15,0.15,0.12,10)),cal:K(new THREE.BoxGeometry(0.2,0.45,0.6))};
const DS=THREE.DoubleSide;
const CM={tire:S(0x141414,0,0.85),rim:S(0xc4cad2,0.9,0.22,{side:DS}),rimD:S(0x24272c,0.7,0.3,{side:DS}),rimW:S(0xf2f2f2,0.3,0.35,{side:DS}),glass:S(0x0a0f15,0.9,0.05,{transparent:true,opacity:0.8}),
trim:S(0x15171b,0.3,0.55),chrome:S(0xeeeeee,1,0.1),head:new THREE.MeshBasicMaterial({color:0xfff7df}),lens:S(0xfff4cc,0.1,0.1,{emissive:0x9a8030}),cal:S(0xd62828,0.3,0.4),
blob:new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:0.25,depthWrite:false})};
function numTex(n){return ctex(128,128,x=>{x.fillStyle='#fff';x.beginPath();x.arc(64,64,58,0,7);x.fill();x.fillStyle='#111';x.font='bold 74px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,70);});}
function wheel(s,st){const w=new THREE.Group(),rm=st==='white'?CM.rimW:st==='dark'?CM.rimD:CM.rim;
const t=new THREE.Mesh(WG.tire,CM.tire);t.rotation.y=Math.PI/2;t.scale.set(1,1,1.5);w.add(t);
const b=new THREE.Mesh(WG.barrel,rm);b.rotation.z=Math.PI/2;w.add(b);
const bk=new THREE.Mesh(WG.disc,CM.trim);bk.rotation.z=Math.PI/2;bk.position.x=-s*0.1;w.add(bk);
for(let j=0;j<5;j++){const k=new THREE.Mesh(WG.spk,rm);k.position.x=s*0.3;k.rotation.x=j*Math.PI/5;w.add(k);}
const h=new THREE.Mesh(WG.hub,CM.chrome);h.rotation.z=Math.PI/2;h.position.x=s*0.33;w.add(h);
w.traverse(o=>{if(o.isMesh)o.castShadow=true;});return w;}
function makeCar(ty,col,num,helm){const d=CARS[ty],cg=cgeo(ty),g=new THREE.Group(),inn=new THREE.Group();g.add(inn);
const paint=new THREE.MeshPhysicalMaterial({color:col,metalness:0.45,roughness:0.28,clearcoat:1,clearcoatRoughness:0.05});
const hs={};new THREE.Color(col).getHSL(hs);const acc=S(hs.l>0.6?0x17191d:0xf4f4f4,0.2,0.35);
const tail=new THREE.MeshBasicMaterial({color:0x5a0a0a}),nm=new THREE.MeshStandardMaterial({map:numTex(num),transparent:true,roughness:0.35,metalness:0.1}),hm=S(helm,0.3,0.25);
const M=(geo,mat,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;inn.add(m);return m;};
const B=(mat,sx,sy,sz,x,y,z,rx)=>M(GEO.box,mat,x,y,z,sx,sy,sz,rx);
const seg=(mat,p1,p2,x,w,th,lift)=>{const dz=p2[0]-p1[0],dy=p2[1]-p1[1];B(mat,w,th,Math.hypot(dz,dy),x,(p1[1]+p2[1])/2+lift,(p1[0]+p2[0])/2,-Math.atan2(dy,dz));};
M(cg.body,paint,0,0,0);M(cg.cab,CM.glass,0,0,0);if(cg.fin)M(cg.fin,paint,0,0,0);
const z0=d.body[0][0],z1=d.body[1][0];B(CM.trim,d.w-0.14,0.1,z1-z0-0.3,0,d.body[0][1]+0.02,(z0+z1)/2);
if(d.ex!=='proto')seg(paint,d.cab[1],d.cab[2],0,d.cw-0.16,0.05,0.07);
if(d.ex==='gt'||d.ex==='muscle')for(const x of[-0.24,0.24])seg(acc,d.cab[1],d.cab[2],x,0.22,0.02,0.11);
M(GEO.helm,hm,d.ex==='proto'?0:0.3,(d.cab[1][1]+d.cab[0][1])/2-0.12,(d.cab[1][0]+d.cab[2][0])/2-0.15);
for(const s of[-1,1]){B(CM.head,0.42,0.13,0.1,s*(d.w/2-0.36),d.hl[1],d.hl[0]+0.04);B(tail,0.46,0.12,0.1,s*(d.w/2-0.34),d.tl[1],d.tl[0]-0.04);
if(d.ex!=='proto')B(paint,0.2,0.12,0.13,s*(d.cw/2+0.13),d.cab[0][1]+0.14,d.cab[0][0]-0.25);
const dc=M(GEO.vplane,nm,s*(d.w/2+0.006),d.ny,-0.15,d.ns,d.ns,1,0,s*Math.PI/2,0);dc.castShadow=false;}
const T=CM.trim;
if(d.ex==='gt'){for(const s of[-1,1]){B(T,0.06,0.3,0.14,s*0.55,1.04,-1.95);B(T,0.04,0.3,0.6,s*(d.w/2-0.06),1.13,-1.98);B(T,0.03,0.2,0.7,s*(d.w/2+0.004),0.5,-0.85);}B(T,d.w-0.1,0.05,0.5,0,1.2,-1.98,-0.08);B(T,d.w,0.03,0.32,0,0.27,2.15);B(T,d.w-0.4,0.14,0.3,0,0.32,-2.18);}
if(d.ex==='rally'){B(T,1.5,0.05,0.06,0,0.6,2.02);for(const x of[-0.6,-0.2,0.2,0.6])M(GEO.lamp,CM.lens,x,0.72,2.04);
for(const s of[-1,1]){for(const zz of[d.wh.f,d.wh.b])B(T,0.42,0.32,0.03,s*d.wh.x,0.27,zz-0.55);B(acc,0.02,0.18,3.3,s*(d.w/2+0.008),0.46,-0.1);}
B(paint,0.42,0.1,0.38,0,d.cab[1][1]+0.1,d.cab[1][0]-0.4);B(paint,d.cw-0.05,0.05,0.42,0,d.cab[2][1]+0.07,d.cab[2][0]-0.12,0.18);}
if(d.ex==='muscle'){B(T,0.56,0.13,0.8,0,0.95,1.35);B(CM.chrome,d.w-0.06,0.13,0.12,0,0.44,2.37);B(CM.chrome,d.w-0.06,0.13,0.12,0,0.47,-2.38);for(const s of[-1,1])M(GEO.pipe,CM.chrome,s*(d.w/2+0.05),0.32,-0.3,1,1,1.5);B(paint,d.w-0.15,0.05,0.3,0,1.02,-2.24,-0.25);}
if(d.ex==='proto'){for(const s of[-1,1]){B(T,0.06,0.42,0.16,s*0.5,0.95,-2.15);B(paint,0.04,0.5,0.9,s*(d.w/2+0.03),1.0,-2.15);B(acc,0.02,0.1,3.8,s*(d.w/2+0.006),0.3,0);}B(T,d.w+0.1,0.05,0.56,0,1.18,-2.2,-0.06);B(T,d.w,0.03,0.34,0,0.2,2.3);}
const wh=[],fr=[],Wd=d.wh;
for(const q of[[-1,Wd.f,1],[1,Wd.f,1],[-1,Wd.b,0],[1,Wd.b,0]]){const s=q[0],r=q[2]?Wd.r:Wd.rr,pv=new THREE.Group();pv.position.set(s*Wd.x,r,q[1]);const w=wheel(s,d.rim);w.scale.setScalar(r);pv.add(w);
const cl=new THREE.Mesh(WG.cal,CM.cal);cl.scale.setScalar(r);cl.position.set(s*0.05*r,r*0.4,r*0.25);pv.add(cl);g.add(pv);wh.push(w);if(q[2])fr.push(pv);}
const bl=new THREE.Mesh(GEO.plane,CM.blob);bl.scale.set(d.w+0.5,1,z1-z0+0.5);bl.position.y=0.17;g.add(bl);
return{g,inn,wh,fr,tail,paint,dis(){[paint,acc,tail,hm].forEach(m=>m.dispose());nm.map.dispose();nm.dispose();}};}

const DN=600,dPos=new Float32Array(DN*3).fill(-999),dCol=new Float32Array(DN*3),dVel=new Float32Array(DN*3),dLife=new Float32Array(DN);let dI=0;
const dGeo=new THREE.BufferGeometry();dGeo.setAttribute('position',new THREE.BufferAttribute(dPos,3));dGeo.setAttribute('color',new THREE.BufferAttribute(dCol,3));
const dust=new THREE.Points(dGeo,new THREE.PointsMaterial({size:1.6,vertexColors:true,transparent:true,opacity:0.45,depthWrite:false}));dust.frustumCulled=false;scene.add(dust);
function emit(x,z,c,vy){const i=dI;dI=(dI+1)%DN;dPos[i*3]=x+(Math.random()-0.5)*0.9;dPos[i*3+1]=0.4;dPos[i*3+2]=z+(Math.random()-0.5)*0.9;dVel[i*3]=(Math.random()-0.5)*0.07;dVel[i*3+1]=vy+Math.random()*0.04;dVel[i*3+2]=(Math.random()-0.5)*0.07;dCol[i*3]=c[0];dCol[i*3+1]=c[1];dCol[i*3+2]=c[2];dLife[i]=40+Math.random()*30;}
function dustStep(d){for(let i=0;i<DN;i++){if(dLife[i]<=0)continue;dLife[i]-=d;if(dLife[i]<=0){dPos[i*3+1]=-999;continue;}dPos[i*3]+=dVel[i*3]*d;dPos[i*3+1]+=dVel[i*3+1]*d;dPos[i*3+2]+=dVel[i*3+2]*d;dVel[i*3+1]*=0.97;}dGeo.attributes.position.needsUpdate=true;dGeo.attributes.color.needsUpdate=true;}
const SKN=2600,skid=new THREE.InstancedMesh(K(new THREE.PlaneGeometry(0.3,0.75).rotateX(-Math.PI/2)),new THREE.MeshBasicMaterial({color:0x0d0d0d,transparent:true,opacity:0.36,depthWrite:false}),SKN);skid.count=0;skid.frustumCulled=false;scene.add(skid);let skidI=0;
function addSkid(x,z,a){DO.position.set(x,0.125,z);DO.rotation.set(0,a,0);DO.scale.set(1,1,1);DO.updateMatrix();skid.setMatrixAt(skidI,DO.matrix);skidI=(skidI+1)%SKN;skid.count=Math.min(SKN,skid.count+1);skid.instanceMatrix.needsUpdate=true;}

let AC=null,eo1,eo2,ef,eg,sqG,snd=true,lastThud=0;
function ain(){if(AC){if(AC.resume)AC.resume();return;}try{AC=new(window.AudioContext||window.webkitAudioContext)();eo1=AC.createOscillator();eo1.type='sawtooth';eo2=AC.createOscillator();eo2.type='square';ef=AC.createBiquadFilter();ef.type='lowpass';ef.frequency.value=500;ef.Q.value=3;eg=AC.createGain();eg.gain.value=0;const g2=AC.createGain();g2.gain.value=0.4;eo1.connect(ef);eo2.connect(g2);g2.connect(ef);ef.connect(eg);eg.connect(AC.destination);eo1.start();eo2.start();
const nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),dd=nb.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=5;sqG=AC.createGain();sqG.gain.value=0;ns.connect(bp);bp.connect(sqG);sqG.connect(AC.destination);ns.start();}catch(e){AC=null;}}
function engine(on,rpm,slip){if(!AC)return;const t=AC.currentTime,f=50+rpm*125;eo1.frequency.setTargetAtTime(f,t,0.04);eo2.frequency.setTargetAtTime(f*0.5,t,0.04);ef.frequency.setTargetAtTime(380+rpm*1400,t,0.05);eg.gain.setTargetAtTime(on&&snd?0.028+rpm*0.022:0,t,0.08);sqG.gain.setTargetAtTime(on&&snd?Math.min(0.06,Math.max(0,slip-0.03)*0.8):0,t,0.05);}
function beep(f,du,v){if(!AC||!snd)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(v||0.05,t);g.gain.exponentialRampToValueAtTime(0.0001,t+du);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+du+0.02);}
function thud(s){const n=performance.now();if(n-lastThud<300)return;lastThud=n;beep(85,0.2,Math.min(0.12,0.04+(s||0.1)*0.2));}
