function shapeG(pts,w,bev,smooth){const s=new THREE.Shape();if(smooth){s.moveTo(pts[0][0],pts[0][1]);s.lineTo(pts[1][0],pts[1][1]);s.splineThru(pts.slice(2).concat([pts[0]]).map(p=>new THREE.Vector2(p[0],p[1])));}else pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();const d=Math.max(0.01,w-2*bev);
const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:4,curveSegments:24});g.translate(0,0,-d/2);g.rotateY(-Math.PI/2);return K(g);}
const CGC=[];
function cgeo(ty){if(CGC[ty])return CGC[ty];const d=CARS[ty];return CGC[ty]={body:shapeG(d.body,d.w,0.07,1),cab:shapeG(d.cab,d.cw,0.05),fin:d.ex==='proto'?shapeG([[-0.7,0.98],[-2.35,1.2],[-2.38,0.8],[-1.4,0.7]],0.08,0):null};}
const SWG={ring:K(new THREE.TorusGeometry(0.16,0.022,8,26))};
const WG={bdisc:K(new THREE.CylinderGeometry(0.52,0.52,0.05,22)),tire:K(new THREE.TorusGeometry(0.8,0.24,14,32)),barrel:K(new THREE.CylinderGeometry(0.62,0.62,0.7,20,1,true)),disc:K(new THREE.CylinderGeometry(0.6,0.6,0.04,16)),spk:K(new THREE.BoxGeometry(0.07,1.2,0.14)),hub:K(new THREE.CylinderGeometry(0.15,0.15,0.12,10)),cal:K(new THREE.BoxGeometry(0.2,0.45,0.6))};
const DS=THREE.DoubleSide;
const CM={rimG:S(0xd2a54a,0.95,0.22,{side:THREE.DoubleSide}),glassL:S(0x1a2a38,0.6,0.04,{transparent:true,opacity:0.42}),visor:S(0x0d1218,0.95,0.04),int:S(0x1b1c20,0.15,0.75),seat:S(0x26282d,0.1,0.8),glove:S(0x222222,0.1,0.7),discM:S(0x8d9299,0.9,0.32),grille:S(0x0b0b0d,0.4,0.55),drl:new THREE.MeshBasicMaterial({color:0xeaf4ff}),tire:S(0x141414,0,0.85),rim:S(0xc4cad2,0.9,0.22,{side:DS}),rimD:S(0x24272c,0.7,0.3,{side:DS}),rimW:S(0xf2f2f2,0.3,0.35,{side:DS}),glass:S(0x0a0f15,0.9,0.05,{transparent:true,opacity:0.8}),
trim:S(0x15171b,0.3,0.55),chrome:S(0xeeeeee,1,0.1),head:new THREE.MeshBasicMaterial({color:0xfff7df}),lens:S(0xfff4cc,0.1,0.1,{emissive:0x9a8030}),cal:S(0xd62828,0.3,0.4),
blob:new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:0.25,depthWrite:false})};
function numTex(n){return ctex(128,128,x=>{x.fillStyle='#fff';x.beginPath();x.arc(64,64,58,0,7);x.fill();x.fillStyle='#111';x.font='bold 74px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,70);});}
function wheel(s,st){const w=new THREE.Group(),rm=st==='white'?CM.rimW:st==='dark'?CM.rimD:st==='gold'?CM.rimG:CM.rim;
const t=new THREE.Mesh(WG.tire,CM.tire);t.rotation.y=Math.PI/2;t.scale.set(1,1,1.5);w.add(t);
const b=new THREE.Mesh(WG.barrel,rm);b.rotation.z=Math.PI/2;w.add(b);
const bk=new THREE.Mesh(WG.disc,CM.trim);bk.rotation.z=Math.PI/2;bk.position.x=-s*0.1;w.add(bk);
for(let j=0;j<5;j++){const k=new THREE.Mesh(WG.spk,rm);k.position.x=s*0.3;k.rotation.x=j*Math.PI/5;w.add(k);}
const h=new THREE.Mesh(WG.hub,CM.chrome);h.rotation.z=Math.PI/2;h.position.x=s*0.33;w.add(h);
const dk=new THREE.Mesh(WG.bdisc,CM.discM);dk.rotation.z=Math.PI/2;dk.position.x=s*0.1;w.add(dk);
w.userData.geos=mergeGroup(w);return w;}
function makeCar(ty,col,num,helm,opt){opt=opt||{};const d=CARS[ty],cg=cgeo(ty),g=new THREE.Group(),inn=new THREE.Group();g.add(inn);
const paint=new THREE.MeshPhysicalMaterial({color:col,metalness:0.45,roughness:0.28,clearcoat:1,clearcoatRoughness:0.05});
const hs={};new THREE.Color(col).getHSL(hs);const acc=S(hs.l>0.6?0x17191d:0xf4f4f4,0.2,0.35);
const tail=new THREE.MeshBasicMaterial({color:0x5a0a0a}),nm=new THREE.MeshStandardMaterial({map:numTex(num),transparent:true,roughness:0.35,metalness:0.1}),hm=S(helm,0.3,0.25);
const M=(geo,mat,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;inn.add(m);return m;};
const B=(mat,sx,sy,sz,x,y,z,rx)=>M(GEO.box,mat,x,y,z,sx,sy,sz,rx);
const seg=(mat,p1,p2,x,w,th,lift)=>{const dz=p2[0]-p1[0],dy=p2[1]-p1[1];B(mat,w,th,Math.hypot(dz,dy),x,(p1[1]+p2[1])/2+lift,(p1[0]+p2[0])/2,-Math.atan2(dy,dz));};
M(cg.body,paint,0,0,0);M(cg.cab,opt.tint?CM.glass:CM.glassL,0,0,0);if(cg.fin)M(cg.fin,paint,0,0,0);
const z0=d.body[0][0],z1=d.body[1][0];B(CM.trim,d.w-0.14,0.1,z1-z0-0.3,0,d.body[0][1]+0.02,(z0+z1)/2);
if(d.ex!=='proto')seg(paint,d.cab[1],d.cab[2],0,d.cw-0.16,0.05,0.07);
const liv=(opt.liv===undefined||opt.liv<0)?(d.ex==='gt'||d.ex==='muscle'?1:d.ex==='rally'?2:0):opt.liv;
if(liv===1)for(const x of[-0.24,0.24]){seg(acc,d.cab[1],d.cab[2],x,0.22,0.02,0.11);seg(acc,d.body[3],d.cab[0],x,0.22,0.02,0.1);seg(acc,d.cab[3],d.body[d.rt],x,0.22,0.02,0.1);seg(acc,d.body[2],d.body[3],x,0.22,0.02,0.09);}
if(liv===2)for(const s of[-1,1]){B(acc,0.02,0.16,(d.body[1][0]-d.body[0][0])*0.82,s*(d.w/2+0.009),d.body[0][1]+0.2,0);B(acc,0.02,0.05,(d.body[1][0]-d.body[0][0])*0.82,s*(d.w/2+0.009),d.body[0][1]+0.32,0);}
const hx=d.ex==='proto'?0:0.3,hy=(d.cab[1][1]+d.cab[0][1])/2-0.12,hz=(d.cab[1][0]+d.cab[2][0])/2-0.15,yb0=d.body[0][1],ys=Math.max(yb0+0.1,hy-0.52),zs=hz-0.02;
M(GEO.helm,hm,hx,hy,hz);B(CM.visor,0.25,0.075,0.06,hx,hy+0.005,hz+0.16);
const suit=S(new THREE.Color(helm).lerp(new THREE.Color(0x222222),0.35).getHex(),0.1,0.6);
B(CM.int,d.cw-0.12,0.04,Math.max(0.6,d.cab[0][0]-d.cab[3][0]),0,yb0+0.1,(d.cab[0][0]+d.cab[3][0])/2);
B(CM.int,d.cw-0.08,0.14,0.32,0,d.cab[0][1]-0.03,d.cab[0][0]-0.26);
for(const sx of(d.ex==='proto'?[0]:[0.3,-0.3])){B(CM.seat,0.44,0.1,0.46,sx,ys,zs);B(CM.seat,0.44,0.6,0.09,sx,ys+0.33,zs-0.25,-0.16);B(CM.seat,0.08,0.22,0.42,sx+0.2,ys+0.14,zs);B(CM.seat,0.08,0.22,0.42,sx-0.2,ys+0.14,zs);}
M(GEO.cyl,suit,hx,ys+0.3,zs-0.04,0.17,0.42,0.13,-0.12,0,0);M(GEO.ball,suit,hx,ys+0.5,zs-0.06,0.22,0.09,0.13);
B(suit,0.3,0.13,0.5,hx,ys+0.1,zs+0.32);B(suit,0.28,0.38,0.12,hx,ys-0.06,zs+0.6,0.2);
const sy=ys+0.44,sz=zs+0.5,sgp=new THREE.Group();sgp.position.set(hx,sy,sz);sgp.rotation.x=-0.42;sgp.userData.dyn=1;inn.add(sgp);
const ring=new THREE.Group();sgp.add(ring);const rm_=new THREE.Mesh(SWG.ring,CM.int);ring.add(rm_);
for(const a of[0,2.1,-2.1]){const sp=new THREE.Mesh(GEO.box,CM.int);sp.scale.set(0.02,0.15,0.02);sp.position.set(Math.sin(a)*0.075,-Math.cos(a)*0.075,0);sp.rotation.z=a;ring.add(sp);}
const hb=new THREE.Mesh(GEO.cyl,CM.int);hb.scale.set(0.045,0.04,0.045);hb.rotation.x=Math.PI/2;ring.add(hb);
for(const s of[-1,1]){const gl=new THREE.Mesh(GEO.ball,CM.glove);gl.scale.setScalar(0.045);gl.position.set(s*0.15,0.02,0.02);ring.add(gl);
const fa=new THREE.Mesh(GEO.cyl,suit);fa.scale.set(0.045,0.26,0.045);fa.position.set(s*0.17,-0.04,-0.12);fa.rotation.x=1.25;ring.add(fa);}
for(const s of[-1,1])M(GEO.cyl,suit,hx+s*0.19,ys+0.42,zs+0.12,0.05,0.32,0.05,1.0,0,-s*0.15);
const SW=ring;
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
const fl=[];for(const s of(d.ex==='muscle'?[]:[-1,1])){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*0.42,0.3,ze-0.12);f2.position.copy(f.position);f.visible=f2.visible=false;f.userData.dyn=f2.userData.dyn=1;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='muscle')for(const s of[-1,1]){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*(d.w/2+0.05),0.32,-1.05);f2.position.copy(f.position);f.visible=f2.visible=false;f.userData.dyn=f2.userData.dyn=1;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='rally'||d.ex==='muscle'){const pp=M(PLATE,PLM,0,d.tl[1]-0.2,d.tl[0]-0.06);pp.castShadow=false;}
{const cw2=d.cw/2,bl=(d.cab[0][1]+d.cab[3][1])/2;
if(d.ex!=='proto')for(const s of[-1,1]){const x=s*(cw2+0.025);seg(T,d.cab[0],d.cab[1],x,0.05,0.06,0);seg(T,d.cab[1],d.cab[2],x,0.05,0.06,0);seg(T,d.cab[2],d.cab[3],x,0.05,0.06,0);seg(T,d.cab[0],d.cab[3],s*(cw2+0.035),0.05,0.05,0);
const bz=(d.cab[1][0]+d.cab[2][0])/2-0.1,bh=Math.max(0.2,d.cab[1][1]-bl);B(T,0.05,bh,0.09,x,bl+bh/2,bz);}
const zs1=d.cab[0][0]-0.05,zs2=(d.cab[2][0]+d.cab[3][0])/2,yb=d.body[0][1];
for(const s of[-1,1]){const xs=s*(d.w/2+0.005);B(T,0.008,0.42,0.025,xs,yb+0.34,zs1);B(T,0.008,0.42,0.025,xs,yb+0.34,zs2);B(CM.chrome,0.02,0.035,0.16,s*(d.w/2+0.012),bl-0.14,zs2+0.25);
B(T,0.06,0.08,(z1-z0)*0.55,s*(d.w/2+0.01),yb+0.06,(z0+z1)/2);B(CM.drl,0.36,0.025,0.05,s*(d.w/2-0.36),d.hl[1]-0.085,d.hl[0]+0.06);
if(d.ex!=='muscle'){const spk=opt.spn===undefined?(num+(s>0?0:1))%SPM.length:opt.spn-1;if(spk>=0){const sp=M(GEO.vplane,SPM[spk],s*(d.w/2+0.007),d.ny+(d.ex==='proto'?0.02:-0.06),z0+0.95,1.05,0.27,1,0,s*Math.PI/2,0);sp.castShadow=false;}}}
B(CM.grille,d.w*0.48,0.13,0.05,0,d.hl[1]-0.1,d.hl[0]+0.02);B(CM.grille,d.w*0.6,0.09,0.05,0,d.body[0][1]+0.12,d.body[1][0]+0.05);
if(d.ex!=='proto')for(const x of[-0.3,0.3]){const wp=B(T,0.5,0.015,0.03,x,d.cab[0][1]+0.05,d.cab[0][0]-0.1);wp.rotation.y=x>0?0.12:-0.12;}
if(d.ex==='rally')M(GEO.cyl,T,0.42,d.cab[2][1]+0.3,d.cab[2][0]+0.25,0.012,0.6,0.012);}
const wh=[],fr=[],Wd=d.wh;
for(const q of[[-1,Wd.f,1],[1,Wd.f,1],[-1,Wd.b,0],[1,Wd.b,0]]){const s=q[0],r=q[2]?Wd.r:Wd.rr,pv=new THREE.Group();pv.position.set(s*Wd.x,r,q[1]);const w=wheel(s,opt.rim===undefined||opt.rim<0?d.rim:['chrome','dark','white','gold'][opt.rim]);w.scale.setScalar(r);pv.add(w);{const fe=new THREE.Mesh(FEND,paint);fe.rotation.y=Math.PI/2;fe.scale.set(r*1.18,r*1.18,r*0.9);fe.position.set(q[0]*Wd.x+s*0.04,r,q[1]);fe.castShadow=true;inn.add(fe);}
const cl=new THREE.Mesh(WG.cal,CM.cal);cl.scale.setScalar(r);cl.position.set(s*0.05*r,r*0.4,r*0.25);pv.add(cl);g.add(pv);wh.push(w);if(q[2])fr.push(pv);}
const bl=new THREE.Mesh(GEO.plane,CM.blob);bl.scale.set(d.w+0.5,1,z1-z0+0.5);bl.position.y=0.17;g.add(bl);
const mg=mergeGroup(inn);
return{g,inn,wh,fr,tail,paint,fl,sw:SW,hx,hy,hz,dis(){[paint,acc,tail,hm,suit].forEach(m=>m.dispose());nm.map.dispose();nm.dispose();mg.forEach(x=>x.dispose());wh.forEach(w=>(w.userData.geos||[]).forEach(x=>x.dispose()));}};}

const PN=1400,pPos=new Float32Array(PN*3).fill(-9999),pCol=new Float32Array(PN*3),pSz=new Float32Array(PN),pAl=new Float32Array(PN),pVel=new Float32Array(PN*3),pLife=new Float32Array(PN),pMax=new Float32Array(PN),pS0=new Float32Array(PN),pG=new Float32Array(PN),pA0=new Float32Array(PN);let pI=0;
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3));pGeo.setAttribute('size',new THREE.BufferAttribute(pSz,1));pGeo.setAttribute('alpha',new THREE.BufferAttribute(pAl,1));
const pMat=new THREE.ShaderMaterial({uniforms:{map:{value:smokeT},sc:{value:500}},vertexColors:true,transparent:true,depthWrite:false,
vertexShader:'attribute float size;\nattribute float alpha;\nuniform float sc;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main(){vC=color;vA=alpha;vR=fract(sin(position.x*12.9+position.z*7.3)*437.5)*6.28;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=min(180.0,size*sc/max(0.5,-mv.z));gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'uniform sampler2D map;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_fragment>\nvoid main(){\n#include <logdepthbuf_fragment>\nvec2 p=gl_PointCoord-0.5;float c=cos(vR),s=sin(vR);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+0.5;vec4 t=texture2D(map,p);float a=t.a*vA;if(a<0.003)discard;gl_FragColor=vec4(vC*(0.85+0.15*t.r),a);}'});
const parts=new THREE.Points(pGeo,pMat);parts.frustumCulled=false;parts.renderOrder=5;scene.add(parts);
function emit(x,z,c,vy,big){const i=pI;pI=(pI+1)%PN;pPos[i*3]=x+(Math.random()-0.5)*0.7;pPos[i*3+1]=0.35;pPos[i*3+2]=z+(Math.random()-0.5)*0.7;
pVel[i*3]=(Math.random()-0.5)*0.05;pVel[i*3+1]=vy+Math.random()*0.025;pVel[i*3+2]=(Math.random()-0.5)*0.05;pCol[i*3]=c[0];pCol[i*3+1]=c[1];pCol[i*3+2]=c[2];
if(big===2){pMax[i]=pLife[i]=30+Math.random()*20;pS0[i]=0.5;pG[i]=1.8;pA0[i]=0.28;return;}pMax[i]=pLife[i]=(big?90:70)+Math.random()*50;pS0[i]=big?1.2:0.8;pG[i]=big?6:4.2;pA0[i]=big?0.42:0.5;}
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
const SPM=[['TURBO GUMI','#c81d25'],['NITRO+','#1f6feb'],['ÁSZ MOTOR','#ff7a00'],['RALLY 26','#111']].map(a=>new THREE.MeshStandardMaterial({map:ctex(256,64,x=>{x.fillStyle=a[1];x.beginPath();x.roundRect?x.roundRect(2,6,252,52,10):x.rect(2,6,252,52);x.fill();x.fillStyle='#fff';x.font='800 34px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(a[0],128,33);}),transparent:true,roughness:0.35,metalness:0.1}));
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
