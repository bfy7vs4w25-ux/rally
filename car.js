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
const ze=d.body[0][0];for(const s of[-1,1]){if(d.ex!=='muscle')M(GEO.pipe,CM.chrome,s*0.42,0.3,ze-0.02,1.4,1.4,0.35);}
const fl=[];for(const s of(d.ex==='muscle'?[]:[-1,1])){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*0.42,0.3,ze-0.12);f2.position.copy(f.position);f.visible=f2.visible=false;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='muscle')for(const s of[-1,1]){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*(d.w/2+0.05),0.32,-1.05);f2.position.copy(f.position);f.visible=f2.visible=false;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='rally'||d.ex==='muscle'){const pp=M(PLATE,PLM,0,d.tl[1]-0.2,d.tl[0]-0.06);pp.castShadow=false;}
const wh=[],fr=[],Wd=d.wh;
for(const q of[[-1,Wd.f,1],[1,Wd.f,1],[-1,Wd.b,0],[1,Wd.b,0]]){const s=q[0],r=q[2]?Wd.r:Wd.rr,pv=new THREE.Group();pv.position.set(s*Wd.x,r,q[1]);const w=wheel(s,d.rim);w.scale.setScalar(r);pv.add(w);{const fe=new THREE.Mesh(FEND,paint);fe.rotation.y=Math.PI/2;fe.scale.set(r*1.18,r*1.18,r*0.9);fe.position.set(q[0]*Wd.x+s*0.04,r,q[1]);fe.castShadow=true;inn.add(fe);}
const cl=new THREE.Mesh(WG.cal,CM.cal);cl.scale.setScalar(r);cl.position.set(s*0.05*r,r*0.4,r*0.25);pv.add(cl);g.add(pv);wh.push(w);if(q[2])fr.push(pv);}
const bl=new THREE.Mesh(GEO.plane,CM.blob);bl.scale.set(d.w+0.5,1,z1-z0+0.5);bl.position.y=0.17;g.add(bl);
return{g,inn,wh,fr,tail,paint,fl,dis(){[paint,acc,tail,hm].forEach(m=>m.dispose());nm.map.dispose();nm.dispose();}};}

const PN=1400,pPos=new Float32Array(PN*3).fill(-9999),pCol=new Float32Array(PN*3),pSz=new Float32Array(PN),pAl=new Float32Array(PN),pVel=new Float32Array(PN*3),pLife=new Float32Array(PN),pMax=new Float32Array(PN),pS0=new Float32Array(PN),pG=new Float32Array(PN),pA0=new Float32Array(PN);let pI=0;
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3));pGeo.setAttribute('size',new THREE.BufferAttribute(pSz,1));pGeo.setAttribute('alpha',new THREE.BufferAttribute(pAl,1));
const pMat=new THREE.ShaderMaterial({uniforms:{map:{value:smokeT},sc:{value:500}},vertexColors:true,transparent:true,depthWrite:false,
vertexShader:'attribute float size;\nattribute float alpha;\nuniform float sc;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main(){vC=color;vA=alpha;vR=fract(sin(position.x*12.9+position.z*7.3)*437.5)*6.28;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*sc/max(0.5,-mv.z);gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'uniform sampler2D map;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_fragment>\nvoid main(){\n#include <logdepthbuf_fragment>\nvec2 p=gl_PointCoord-0.5;float c=cos(vR),s=sin(vR);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+0.5;vec4 t=texture2D(map,p);float a=t.a*vA;if(a<0.003)discard;gl_FragColor=vec4(vC*(0.85+0.15*t.r),a);}'});
const parts=new THREE.Points(pGeo,pMat);parts.frustumCulled=false;parts.renderOrder=5;scene.add(parts);
function emit(x,z,c,vy,big){const i=pI;pI=(pI+1)%PN;pPos[i*3]=x+(Math.random()-0.5)*0.7;pPos[i*3+1]=0.35;pPos[i*3+2]=z+(Math.random()-0.5)*0.7;
pVel[i*3]=(Math.random()-0.5)*0.05;pVel[i*3+1]=vy+Math.random()*0.025;pVel[i*3+2]=(Math.random()-0.5)*0.05;pCol[i*3]=c[0];pCol[i*3+1]=c[1];pCol[i*3+2]=c[2];
pMax[i]=pLife[i]=(big?90:70)+Math.random()*50;pS0[i]=big?1.2:0.8;pG[i]=big?6:4.2;pA0[i]=big?0.42:0.5;}
function dustStep(d){for(let i=0;i<PN;i++){if(pLife[i]<=0)continue;pLife[i]-=d;if(pLife[i]<=0){pPos[i*3+1]=-9999;pAl[i]=0;continue;}const t=1-pLife[i]/pMax[i];
pPos[i*3]+=(pVel[i*3]+0.012)*d;pPos[i*3+1]+=pVel[i*3+1]*d;pPos[i*3+2]+=(pVel[i*3+2]+0.006)*d;pVel[i*3]*=Math.pow(0.985,d);pVel[i*3+2]*=Math.pow(0.985,d);pVel[i*3+1]*=Math.pow(0.975,d);
pSz[i]=pS0[i]+pG[i]*Math.sqrt(t);pAl[i]=pA0[i]*Math.pow(1-t,1.6)*Math.min(1,t*10);}
pGeo.attributes.position.needsUpdate=true;pGeo.attributes.color.needsUpdate=true;pGeo.attributes.size.needsUpdate=true;pGeo.attributes.alpha.needsUpdate=true;}
function partsReset(){pLife.fill(0);pPos.fill(-9999);pAl.fill(0);}
const FLG=K(new THREE.ConeGeometry(0.13,1,12,1,true).translate(0,0.5,0).rotateX(-Math.PI/2)),FLG2=K(new THREE.ConeGeometry(0.07,0.6,10,1,true).translate(0,0.3,0).rotateX(-Math.PI/2));
const FLM=new THREE.MeshBasicMaterial({color:0x4d8dff,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),FLM2=new THREE.MeshBasicMaterial({color:0xd9ecff,transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const FEND=K(new THREE.TorusGeometry(1,0.17,10,24,Math.PI)),PLATE=K(new THREE.BoxGeometry(0.52,0.13,0.03));
const plT=ctex(128,32,x=>{x.fillStyle='#f4f4f4';x.fillRect(0,0,128,32);x.fillStyle='#1b4fd8';x.fillRect(0,0,14,32);x.fillStyle='#111';x.font='bold 20px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('RLY-026',71,17);x.strokeStyle='#222';x.lineWidth=2;x.strokeRect(1,1,126,30);});
const PLM=L(0xffffff,{map:plT});
const SKN=2600,skid=new THREE.InstancedMesh(K(new THREE.PlaneGeometry(0.3,0.75).rotateX(-Math.PI/2)),new THREE.MeshBasicMaterial({color:0x0d0d0d,transparent:true,opacity:0.36,depthWrite:false}),SKN);skid.count=0;skid.frustumCulled=false;scene.add(skid);let skidI=0;
function addSkid(x,z,a){DO.position.set(x,0.125,z);DO.rotation.set(0,a,0);DO.scale.set(1,1,1);DO.updateMatrix();skid.setMatrixAt(skidI,DO.matrix);skidI=(skidI+1)%SKN;skid.count=Math.min(SKN,skid.count+1);skid.instanceMatrix.needsUpdate=true;}

let AC=null,eo1,eo2,ef,eg,sqG,snd=true,lastThud=0;
function ain(){if(AC){if(AC.resume)AC.resume();return;}try{AC=new(window.AudioContext||window.webkitAudioContext)();eo1=AC.createOscillator();eo1.type='sawtooth';eo2=AC.createOscillator();eo2.type='square';ef=AC.createBiquadFilter();ef.type='lowpass';ef.frequency.value=500;ef.Q.value=3;eg=AC.createGain();eg.gain.value=0;const g2=AC.createGain();g2.gain.value=0.4;eo1.connect(ef);eo2.connect(g2);g2.connect(ef);ef.connect(eg);eg.connect(AC.destination);eo1.start();eo2.start();
const nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),dd=nb.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=5;sqG=AC.createGain();sqG.gain.value=0;ns.connect(bp);bp.connect(sqG);sqG.connect(AC.destination);ns.start();}catch(e){AC=null;}}
function engine(on,rpm,slip){if(!AC)return;const t=AC.currentTime,f=50+rpm*125;eo1.frequency.setTargetAtTime(f,t,0.04);eo2.frequency.setTargetAtTime(f*0.5,t,0.04);ef.frequency.setTargetAtTime(380+rpm*1400,t,0.05);const V=[0,0.45,1,1.6][SET.vol];eg.gain.setTargetAtTime(on&&snd?(0.028+rpm*0.022)*V:0,t,0.08);sqG.gain.setTargetAtTime(on&&snd?Math.min(0.06,Math.max(0,slip-0.03)*0.8)*V:0,t,0.05);}
function beep(f,du,v){if(!AC||!snd)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime((v||0.05)*[0,0.45,1,1.6][SET.vol]+0.0001,t);g.gain.exponentialRampToValueAtTime(0.0001,t+du);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+du+0.02);}
function thud(s){const n=performance.now();if(n-lastThud<300)return;lastThud=n;beep(85,0.2,Math.min(0.12,0.04+(s||0.1)*0.2));}

function whoosh(){if(!AC||!snd)return;const t=AC.currentTime,n=AC.createBufferSource(),b=AC.createBuffer(1,AC.sampleRate*0.7,AC.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;n.buffer=b;
const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2600,t+0.5);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.09*[0,0.45,1,1.6][SET.vol]+0.0001,t+0.08);g.gain.exponentialRampToValueAtTime(0.0001,t+0.65);n.connect(f);f.connect(g);g.connect(AC.destination);n.start(t);n.stop(t+0.7);}
