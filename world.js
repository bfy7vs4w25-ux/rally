const skyG=K(new THREE.SphereGeometry(2000,40,20)),skyM=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false});
const sky=new THREE.Mesh(skyG,skyM);sky.renderOrder=-2;scene.add(sky);
function setSky(a,b,c){const p=skyG.attributes.position,o=[],A=new THREE.Color(a),B=new THREE.Color(b),C=new THREE.Color(c),t=new THREE.Color();
for(let i=0;i<p.count;i++){const y=p.getY(i)/2000;if(y>=0)t.copy(B).lerp(A,Math.pow(y,0.5));else t.copy(B).lerp(C,Math.min(1,Math.pow(-y,0.35)*1.2));o.push(t.r,t.g,t.b);}
skyG.setAttribute('color',new THREE.Float32BufferAttribute(o,3));}
const sunS=new THREE.Sprite(new THREE.SpriteMaterial({map:ctex(128,128,x=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,245,1)');g.addColorStop(0.18,'rgba(255,250,225,0.95)');g.addColorStop(0.42,'rgba(255,240,200,0.22)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,128,128);}),fog:false,depthWrite:false,transparent:true}));
sunS.scale.set(320,320,1);sunS.renderOrder=-1;scene.add(sunS);
const pmrem=new THREE.PMREMGenerator(ren);let envRT=null;
const envSun=new THREE.Mesh(new THREE.SphereGeometry(90,12,8),new THREE.MeshBasicMaterial({color:0xffffff}));
function makeEnv(){const s=new THREE.Scene();s.add(new THREE.Mesh(skyG,skyM));envSun.position.copy(SUND).multiplyScalar(1600);s.add(envSun);if(envRT)envRT.dispose();envRT=pmrem.fromScene(s,0.03,0.1,6000);scene.environment=envRT.texture;}
TH.forEach((t,i)=>t.rock=[0x77736a,0xa0654a,0x7e8a98,0x7a776e][i]);
function hash2(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);}
function vn(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf),a=hash2(xi,zi),b=hash2(xi+1,zi),c=hash2(xi,zi+1),d=hash2(xi+1,zi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,z){let s=0,a=0.5,f=1;for(let i=0;i<5;i++){s+=a*vn(x*f,z*f);f*=2.03;a*=0.5;}return s;}
const sst=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const TPR=[{hill:24,mtn:300,snow:210,rock:130,tl:170},{hill:12,mtn:200,snow:1e9,rock:55,tl:40},{hill:28,mtn:420,snow:55,rock:1e9,tl:260},{hill:16,mtn:170,snow:1e9,rock:90,tl:120}];
let TP=TPR[0],TS=0;
let TGR=null;
function H(x,z,dd){if(TGR){const t=TGR,fx=(x-t.x0)/t.st,fz=(z-t.z0)/t.st,ix=Math.floor(fx),iz=Math.floor(fz);if(ix>=0&&iz>=0&&ix<t.N&&iz<t.N){const u=fx-ix,v=fz-iz,W1=t.N+1,a=t.hs[iz*W1+ix],b=t.hs[(iz+1)*W1+ix],c=t.hs[(iz+1)*W1+ix+1],d=t.hs[iz*W1+ix+1];return u+v<1?a+(d-a)*u+(b-a)*v:c+(b-c)*(1-u)+(d-c)*(1-v);}}return Hraw(x,z,dd);}
function Hraw(x,z,dd){const n=sst(HW+46,HW+180,dd),dc=Math.hypot(x-CX,z-CZ),f=sst(RAD+180,RAD+700,dc);
let h=n*fbm(x*0.006+TS,z*0.006)*TP.hill+f*Math.pow(fbm(x*0.0022+TS+7,z*0.0022+3),1.7)*TP.mtn;
if(seaZ<1e8){const s=sst(seaZ-70,seaZ-15,z);h=h*(1-s)-s*4;}if(WC.length){const l=watL(x,z)*sst(HW+20,HW+42,dd);if(l>0)h=h*(1-l)-3.2*l;}return h;}
function rdF(x,z){if(x<MB.x0-260||x>MB.x1+260||z<MB.z0-260||z>MB.z1+260)return 1e4;let b=1e9;for(let k=0;k<NP;k+=4){const d=(P[k].x-x)**2+(P[k].z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function buildTerrain(t,th){TP=Object.assign({},TPR[t.th],t.tp||{});TS=t.th*13.7+TR.indexOf(t)*5.3;TGR=null;const N=cfg.q?240:170,SZ=3600,g=new THREE.PlaneGeometry(SZ,SZ,N,N);g.rotateX(-Math.PI/2);g.translate(CX,0,CZ);
const p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color(),c0=new THREE.Color(th.g[0]),c1=new THREE.Color(th.g[1]),c2=new THREE.Color(th.g[2]),rk=new THREE.Color(th.rock),sn=new THREE.Color(0xf4f7fa),hs=new Float32Array(p.count);
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=Hraw(x,z,rdF(x,z));p.setY(i,h);hs[i]=h;}
TGR={hs,N,st:SZ/N,x0:CX-SZ/2,z0:CZ-SZ/2};g.computeVertexNormals();const nr=g.attributes.normal;
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=hs[i],v=fbm(x*0.02,z*0.02);c.copy(c1).lerp(v>0.5?c2:c0,Math.min(1,Math.abs(v-0.5)*1.6));
const sl=1-nr.getY(i);c.lerp(rk,Math.min(1,sst(TP.rock,TP.rock+80,h)+sst(0.18,0.4,sl)));c.lerp(sn,sst(TP.snow,TP.snow+50,h)*(1-sst(0.35,0.6,sl)*0.6));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
g.setAttribute('color',new THREE.BufferAttribute(col,3));
const dt=ctex(512,512,(x,w,h)=>{x.fillStyle='#d6d6d6';x.fillRect(0,0,w,h);blobs(x,w,h,['#ffffff','#b8b8b8'],70,10,46,0.08,0.2);
if(t.th===0||t.th===3){for(let i=0;i<30000;i++){const px=Math.random()*w,py=Math.random()*h,l=2+Math.random()*6,v=140+Math.random()*115|0;x.strokeStyle='rgb('+v+','+v+','+v+')';x.lineWidth=0.7+Math.random()*0.8;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-0.5)*3,py-l);x.stroke();}}
else if(t.th===1){for(let y=0;y<h;y+=2){x.strokeStyle='rgba('+(Math.random()<0.5?'255,255,255':'0,0,0')+','+(0.05+Math.random()*0.06)+')';x.lineWidth=1.5;x.beginPath();for(let xx=0;xx<=w;xx+=8)x.lineTo(xx,y+Math.sin(xx*0.05+y*0.13)*3);x.stroke();}}
else{blobs(x,w,h,['#ffffff','#c7d0dc'],120,6,28,0.1,0.25);for(let i=0;i<1500;i++){x.fillStyle='rgba(255,255,255,0.9)';x.fillRect(Math.random()*w,Math.random()*h,1,1);}}
noise(x,w,h,22000,0.1,1.5);},true);dt.repeat.set(SZ/22,SZ/22);
const m=new THREE.Mesh(g,TM(new THREE.MeshLambertMaterial({vertexColors:true,map:dt})));m.receiveShadow=true;trackG.add(m);}

let CRS=[],CRZ=[],TUN=null,WC=[],WATS=[],FERRIS=null,STP=[];
function watL(x,z){let l=0;for(const c of WC){const dx=x-c[0],dz=z-c[1];if(Math.abs(dx)>c[2]||Math.abs(dz)>c[2])continue;const v=sst(c[2],c[2]*0.72,Math.hypot(dx,dz));if(v>l){l=v;if(l>=1)break;}}return l;}
function inWat(x,z,m){for(const c of WC)if(Math.hypot(x-c[0],z-c[1])<c[2]*0.9+(m||0))return true;return false;}
let builtT=-1,P=[],TA=[],CU=[],CUR=[],INS=[],RL=[],VP=[],NP=0,MB,CX=0,CZ=0,RAD=200,TH0=TH[0],seaZ=1e9;
let GLOWS=[],GLOWO=null,LPOOL=null,PUD=[],PUDI=new Map(),PUDM=null,ROADM=null,WATER=null,trackG=new THREE.Group(),OB=new Map(),SL=[],CROWD=[],FLAGS=[],GL=[],CLOUD=null,SNOW=null;
const okey=(x,z)=>Math.floor(x/8)+','+Math.floor(z/8);
function addOb(x,z,r){const k=okey(x,z);let a=OB.get(k);if(!a)OB.set(k,a=[]);a.push([x,z,r]);}
function obEach(x,z,f){const cx=Math.floor(x/8),cz=Math.floor(z/8);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=OB.get((cx+i)+','+(cz+j));if(a)for(const o of a)if(f(o))return true;}return false;}
function rd(x,z){let b=1e9;for(let k=0;k<NP;k+=2){const d=(P[k].x-x)**2+(P[k].z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function W(k,lx,lz){const p=P[k],t=TA[k];return{x:p.x+t.z*lx+t.x*lz,z:p.z-t.x*lx+t.z*lz};}
function R(off,y,mat,o){o=o||{};const pos=[],uv=[],cl=[],nr=[],idx=[];let v=0,acc=0;const uu=o.uu||1;
for(let k=0;k<NP;k++){const k2=(k+1)%NP,sg=Math.hypot(P[k2].x-P[k].x,P[k2].z-P[k].z),A=off(k);let B=off(k2);
if(A&&!o.free&&(!B||Math.sign(B[0]+B[1])!==Math.sign(A[0]+A[1])))B=A;if(A&&o.free&&!B)B=A;
if(A){const c=o.str?(Math.floor(k/2)%2?[0.84,0.1,0.08]:[0.97,0.97,0.97]):null;
for(const q of[[k,A[0],0,acc],[k,A[1],1,acc],[k2,B[0],0,acc+sg],[k2,B[1],1,acc+sg]]){const p=P[q[0]],t=TA[q[0]];pos.push(p.x+t.z*q[1],y,p.z-t.x*q[1]);uv.push(q[2]*uu,q[3]/(o.vs||16));nr.push(0,1,0);if(c)cl.push(c[0],c[1],c[2]);}
idx.push(v,v+2,v+1,v+1,v+2,v+3);v+=4;}acc+=sg;}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nr,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
if(o.str)g.setAttribute('color',new THREE.Float32BufferAttribute(cl,3));g.setIndex(idx);const m=new THREE.Mesh(g,mat);m.receiveShadow=true;trackG.add(m);return m;}
const _fs=new THREE.Sphere(),_fio=THREE.Frustum.prototype.intersectsObject;THREE.Frustum.prototype.intersectsObject=function(o){const s=o.userData.bsL;if(s){_fs.copy(s).applyMatrix4(o.matrixWorld);return this.intersectsSphere(_fs);}return _fio.call(this,o);};
let CULL=[];const CHS=340,CHB=520;
function inst1(geo,mat,list,sh,cols,par,maxD){const m=new THREE.InstancedMesh(geo,mat,list.length);if(!geo.boundingSphere)geo.computeBoundingSphere();const gs=geo.boundingSphere,gr=gs.radius+gs.center.length();let cx=0,cy=0,cz=0;
list.forEach((q,i)=>{DO.position.set(q[0],q[1],q[2]);DO.rotation.set(q[3]||0,q[4]||0,q[5]||0);DO.scale.set(q[6]||1,q[7]||q[6]||1,q[8]||q[6]||1);DO.updateMatrix();m.setMatrixAt(i,DO.matrix);if(cols)m.setColorAt(i,cols[i]);cx+=q[0];cy+=q[1];cz+=q[2];});
cx/=list.length;cy/=list.length;cz/=list.length;let R=0;for(const q of list){const s=Math.max(q[6]||1,q[7]||q[6]||1,q[8]||q[6]||1);R=Math.max(R,Math.hypot(q[0]-cx,q[1]-cy,q[2]-cz)+gr*s);}
m.userData.bsL=new THREE.Sphere(new THREE.Vector3(cx,cy,cz),R);if(cols)m.instanceColor.needsUpdate=true;m.castShadow=!!sh;m.receiveShadow=!!sh;(par||trackG).add(m);if(maxD&&(!par||par===trackG))CULL.push([m,cx,cz,R,maxD]);return m;}
function inst(geo,mat,list,sh,cols,par,maxD){if(!list.length)return null;if((par&&par!==trackG)||list.length<40)return inst1(geo,mat,list,sh,cols,par,maxD);
const C=new Map();list.forEach((q,i)=>{const k=Math.floor(q[0]/CHS)+','+Math.floor(q[2]/CHS);let a=C.get(k);if(!a)C.set(k,a=[]);a.push(i);});
if(C.size===1)return inst1(geo,mat,list,sh,cols,par,maxD);const g=new THREE.Group();trackG.add(g);C.forEach(ix=>{const m=inst1(geo,mat,ix.map(i=>list[i]),sh,cols?ix.map(i=>cols[i]):null,g,0);if(maxD)CULL.push([m,m.userData.bsL.center.x,m.userData.bsL.center.z,m.userData.bsL.radius,maxD]);});return g;}
function cullStep(){const x=cam.position.x,z=cam.position.z,k=cfg.q?1:0.75;for(const c of CULL){const d=Math.hypot(c[1]-x,c[2]-z)-c[3];c[0].visible=d<c[4]*k;}}
function bboard(items,mat){const n=items.length,pos=new Float32Array(n*12),cor=new Float32Array(n*8),sz=new Float32Array(n*8),ly=new Float32Array(n*4),idx=[];
items.forEach((q,i)=>{for(let j=0;j<4;j++){pos.set([q[0],q[1],q[2]],i*12+j*3);sz.set([q[3],q[4]],i*8+j*2);ly[i*4+j]=q[5]||0;}cor.set([-0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,0.5],i*8);idx.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3);});
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('corner',new THREE.BufferAttribute(cor,2));g.setAttribute('bsz',new THREE.BufferAttribute(sz,2));g.setAttribute('lay',new THREE.BufferAttribute(ly,1));g.setIndex(idx);
const m=new THREE.Mesh(g,mat);m.frustumCulled=false;return m;}
function bbMat(map,cT,cB,op,add){return TM(new THREE.ShaderMaterial({uniforms:{map:{value:map},cT:{value:new THREE.Color(cT)},cB:{value:new THREE.Color(cB)},op:{value:op}},transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,
vertexShader:'attribute vec2 corner;\nattribute vec2 bsz;\nattribute float lay;\nvarying vec2 vU;\nvarying float vL;\n#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main(){vU=corner+0.5;vL=lay;vec4 mv=modelViewMatrix*vec4(position,1.0);mv.xy+=corner*bsz;gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'uniform sampler2D map;\nuniform vec3 cT;\nuniform vec3 cB;\nuniform float op;\nvarying vec2 vU;\nvarying float vL;\n#include <common>\n#include <logdepthbuf_pars_fragment>\nvoid main(){\n#include <logdepthbuf_fragment>\nvec4 t=texture2D(map,vU);float a=t.a*op;if(a<0.004)discard;gl_FragColor=vec4(mix(cB,cT,vL)*t.rgb,a);}'}));}
function batchStatic(){const skip=new Set();FLAGS.forEach(f=>f.m.traverse(o=>skip.add(o)));if(FERRIS)FERRIS.w.parent.traverse(o=>skip.add(o));WATS.forEach(o=>skip.add(o));
trackG.updateMatrixWorld(true);const B=new Map(),rm=[];
trackG.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||skip.has(o)||o.userData.dyn||!o.visible||o.renderOrder)return;const g=o.geometry;if(!g.attributes.normal||g.attributes.position.count>3000)return;
for(let p=o.parent;p&&p!==trackG;p=p.parent)if(!p.visible)return;
const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.some(m=>m.isShaderMaterial||m.vertexColors||m.transparent&&m.blending===THREE.AdditiveBlending))return;
let ng=g.index?g.toNonIndexed():g.clone();ng.applyMatrix4(o.matrixWorld);ng.computeBoundingSphere();const c=ng.boundingSphere.center,ck=Math.floor(c.x/CHB)+','+Math.floor(c.z/CHB)+(o.castShadow?'s':'')+(o.receiveShadow?'r':'');
const grp=Array.isArray(o.material)&&g.groups.length?g.groups:[{start:0,count:ng.attributes.position.count,materialIndex:0}];
for(const gr of grp){const mt=mats[gr.materialIndex]||mats[0],key=mt.uuid+ck;let e=B.get(key);if(!e)B.set(key,e={m:mt,sh:o.castShadow,rc:o.receiveShadow,p:[],n:[],u:[]});
const P_=ng.attributes.position.array,N_=ng.attributes.normal.array,U_=ng.attributes.uv?ng.attributes.uv.array:null;const s0=g.index?gr.start:gr.start,s1=Math.min(ng.attributes.position.count,s0+gr.count);
for(let i=s0;i<s1;i++){e.p.push(P_[i*3],P_[i*3+1],P_[i*3+2]);e.n.push(N_[i*3],N_[i*3+1],N_[i*3+2]);if(U_)e.u.push(U_[i*2],U_[i*2+1]);else e.u.push(0,0);}}
ng.dispose();rm.push(o);});
rm.forEach(o=>{o.parent.remove(o);if(!o.geometry.userData.k)o.geometry.dispose();});
B.forEach(e=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(e.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(e.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(e.u,2));g.computeBoundingSphere();const m=new THREE.Mesh(g,e.m);m.castShadow=e.sh;m.receiveShadow=e.rc;trackG.add(m);});}
function LB(g,mat,sx,sy,sz,x,y,z,ns){const m=new THREE.Mesh(GEO.box,mat);m.scale.set(sx,sy,sz);m.position.set(x,y,z);if(!ns){m.castShadow=true;m.receiveShadow=true;}g.add(m);return m;}
function LG(k){const g=new THREE.Group();g.position.set(P[k].x,0,P[k].z);g.rotation.y=Math.atan2(TA[k].x,TA[k].z);trackG.add(g);return g;}
function SIDE(k,s){const g=LG(k),sg=new THREE.Group();sg.rotation.y=s>0?0:Math.PI;g.add(sg);return sg;}
function clear(k,s,x0,x1,z0,z1){for(let lx=x0;lx<=x1;lx+=3)for(let lz=z0;lz<=z1;lz+=3){const w=W(k,s*lx,lz);if(rd(w.x,w.z)<HW+13||inWat(w.x,w.z,4))return false;for(const q of SL)if(Math.hypot(q[0]-w.x,q[1]-w.z)<q[2])return false;}return true;}
function reserve(k,s,x0,x1,z0,z1){const w=W(k,s*(x0+x1)/2,(z0+z1)/2);SL.push([w.x,w.z,Math.hypot(x1-x0,z1-z0)/2+3]);}
function gridIdx(k){return(NP*2-7-Math.floor(k/2)*8-(k%2?4:0))%NP;}
function speedProfile(d){const v=new Float32Array(NP);for(let k=0;k<NP;k++){const r=18/Math.max(0.002,CU[k])*1.15;v[k]=Math.min(d.max,Math.sqrt(d.grip*(WX?WX.road:1)*(1+(d.df||0)*0.6)*r));}
for(let it=0;it<2;it++)for(let k=NP-1;k>=0;k--){const n=v[(k+1)%NP];v[k]=Math.min(v[k],Math.sqrt(n*n+2*d.brk*0.8*1.5));}return v;}

const HCOL=[0x1d1712,0x2e2118,0x4a3322,0x6b4a2b,0xa87b44,0xd8b57a,0x8a8a8a,0x7a2e1a].map(c=>new THREE.Color(c)),PANT=[0x2b3550,0x333333,0x6b5a45,0x1e2a3a,0x5a6a7a,0x8a7a60,0x24262b].map(c=>new THREE.Color(c));
const CLOTH=['#f2f2f2','#f2f2f2','#e6e6e6','#1c1c1f','#1c1c1f','#2b3a55','#2b3a55','#5b6370','#9aa1ab','#c9cdd3','#8b1e23','#c62828','#1e4fa3','#2e7d32','#d9b98c','#e0763a','#f5c518','#0f5f73','#6b3f2a','#3c4a2f'].map(c=>new THREE.Color(c)),FLC=[0xd7263d,0xffffff,0x1b6ee8,0x1f9d55,0xf2b705,0xff7a1a].map(c=>new THREE.Color(c));
function addCrowd(par,list,standing,maxD){if(!list.length)return;const Qd=cfg.q?0.8:0.45,L2=list.filter(()=>Math.random()<Qd),rc=a=>a[Math.floor(Math.random()*a.length)];
const up=[],dn=[],upC=[],dnC=[],skU=[],skD=[],hr=[],hrC=[],hl=[],hlC=[],cp=[],cpC=[],lg=[],lgC=[];
for(const q of L2){const hs_=0.9+Math.random()*0.18,p=[q[0],q[1],q[2],0,q[3]||0,0,hs_,hs_,hs_],sh=rc(CLOTH),sk=rc(SKIN);
if(Math.random()<0.33){up.push(p);upC.push(sh);skU.push(sk);}else{dn.push(p);dnC.push(sh);skD.push(sk);}
if(Math.random()<0.2){cp.push(p);cpC.push(rc(PAL));}else if(Math.random()<0.38){hl.push(p);hlC.push(rc(HCOL));}else{hr.push(p);hrC.push(rc(HCOL));}lg.push(p);lgC.push(rc(PANT));}inst(PG.hairL,CMAT,hl,false,hlC,par,maxD);
inst(PG.shU,CMAT,up,false,upC,par,maxD);inst(PG.shD,CMAT,dn,false,dnC,par,maxD);inst(PG.skU,CMAT,up,false,skU,par,maxD);inst(PG.skD,CMAT,dn,false,skD,par,maxD);
inst(PG.hair,CMAT,hr,false,hrC,par,maxD);inst(PG.cap,CMAT,cp,false,cpC,par,maxD);inst(standing?PG.legs:PG.sleg,CMAT,lg,false,lgC,par,maxD);{const fp=[],fc=[],fcl=[];for(const q of L2){if(Math.random()>0.05)continue;const a=(q[3]||0)+Math.PI/2+(Math.random()-0.5)*0.8;fp.push([q[0]+0.15,q[1]+0.45,q[2],0,0,0,0.22,1.5,0.22]);fc.push([q[0]+0.15,q[1]+1.75,q[2],0,a,(Math.random()-0.5)*0.3,0.34,0.34,0.34]);fcl.push(rc(FLC));}inst(GEO.pole,MAT.post,fp,false,null,par,maxD);inst(GEO.flag,MAT.instD,fc,false,fcl,par,maxD);}}
function billboard(k,s,ad){const g=SIDE(k,s),X=HW+22;for(const z of[-4.5,4.5])LB(g,MAT.post,0.35,7.5,0.35,X+0.3,3.75,z);
const m=new THREE.Mesh(GEO.box,[MAT.post,BILLM[ad],MAT.post,MAT.post,MAT.post,MAT.post]);m.scale.set(0.3,3.6,12);m.position.set(X,6.2,0);m.castShadow=true;g.add(m);
LB(g,MAT.white,0.4,0.18,12.4,X-0.05,8.1,0);LB(g,MAT.white,0.4,0.18,12.4,X-0.05,4.3,0);for(const z of[-3,0,3])LB(g,MAT.post,0.5,0.14,0.7,X-0.9,8.35,z,1);}
function puddles(){const r=Math.random,list=[];PUD=[];PUDI=new Map();
for(let n=0;n<Math.round(NP/9);n++){const k=Math.floor(r()*NP),lat=(r()<0.6?(r()<0.5?-1:1)*(HW-2-r()*3):(r()-0.5)*HW),p=P[k],t=TA[k],x=p.x+t.z*lat,z=p.z-t.x*lat,rad=1.2+r()*2.2;
list.push([x,0.118,z,0,Math.atan2(t.x,t.z)+(r()-0.5)*0.6,0,rad*(1.3+r()*0.8),1,rad]);PUD.push([x,z,rad*1.1]);const q=PUD.length-1;for(let o=-3;o<=3;o++){const kk=(k+o+NP)%NP;let a=PUDI.get(kk);if(!a)PUDI.set(kk,a=[]);a.push(q);}}
PUDM=inst(GEO.plane,PUDMAT,list,false,null,null,320);if(PUDM)PUDM.visible=false;}
function crowdPush(g,fan,dst){g.updateWorldMatrix(true,false);const e=new THREE.Euler().setFromRotationMatrix(g.matrixWorld,'YXZ'),v=new THREE.Vector3();for(const q of fan){v.set(q[0],q[1],q[2]).applyMatrix4(g.matrixWorld);dst.push([v.x,v.y,v.z,(q[3]||0)+e.y]);}}
const SEATM=[L(0x1b6ee8),L(0xd7263d),L(0xf2b705)];
function stand(k,s,len){{const w=W(k,s*(HW+22),0);STP.push([w.x,w.z,1]);}const g=SIDE(k,s),X0=HW+15.5,fan=[],seatC=SEATM[Math.floor(Math.random()*3)],NR=8,DP=1.7,RH=0.72,yT=NR*RH,xb=X0+NR*DP-DP/2+0.25;
const ai=[];for(let z=-len/2+4.5;z<len/2-3;z+=9)ai.push(z);const cuts=[-len/2+0.2].concat(...ai.map(z=>[z-0.6,z+0.6]),[len/2-0.2]);
for(let i=0;i<NR;i++){const x=X0+i*DP,y=(i+1)*RH;LB(g,MAT.conc,DP,y,len,x,y/2,0);
for(let j=0;j<cuts.length;j+=2){const z0=cuts[j],z1=cuts[j+1],L_=z1-z0,zc=(z0+z1)/2;if(L_<0.5)continue;LB(g,seatC,0.55,0.12,L_,x+0.15,y+0.2,zc,1);LB(g,seatC,0.09,0.45,L_,x+0.55,y+0.4,zc,1);}
for(const az of ai)LB(g,MAT.conc2,DP,0.05,1.1,x,y+0.025,az,1);
for(let z=-len/2+0.6;z<=len/2-0.6;z+=0.62){if(ai.some(a=>Math.abs(a-z)<0.85))continue;if(Math.random()<0.86)fan.push([x+0.25+(Math.random()-0.5)*0.08,y+0.16,z+(Math.random()-0.5)*0.1,(Math.random()-0.5)*0.35-Math.PI/2]);}}
for(const z of[-len/2-0.25,len/2+0.25])LB(g,MAT.conc2,NR*DP+0.5,yT+1.3,0.5,X0+NR*DP/2-DP/2+0.25,(yT+1.3)/2,z);
LB(g,MAT.conc2,0.5,yT+4.4,len+1,xb,(yT+4.4)/2,0);
const mkA=(sx,sy,sz,x,y,z,ad)=>{const m=new THREE.Mesh(GEO.box,[MAT.post,ADS[ad%6],MAT.post,MAT.post,MAT.post,MAT.post]);m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;g.add(m);};
const ad0=Math.floor(Math.random()*6);for(let z=-len/2+len/8,i=0;z<len/2;z+=len/4,i++)mkA(0.06,1.0,len/4-0.4,xb-0.28,yT+2.4,z,ad0+i);
const rx0=X0-2.2,ry0=yT+4.9,rL=xb-rx0+0.6,rf=LB(g,MAT.roof,rL,0.28,len+1.6,(xb+rx0)/2+0.3,(ry0+yT+4.4)/2,0);rf.rotation.z=-Math.atan2(ry0-(yT+4.4),rL);
for(let z=-len/2+len/8,i=0;z<len/2;z+=len/4,i++)mkA(0.12,0.75,len/4-0.2,rx0,ry0-0.4,z,ad0+i+2);LB(g,MAT.post,0.16,0.8,len+1.6,rx0+0.05,ry0-0.4,0);
for(const z of[-len/2,-len/6,len/6,len/2]){LB(g,MAT.post,0.32,4.2,0.32,xb+0.4,yT+6.5,z);const dx=xb+0.4-(rx0+1),dy=(yT+8.4)-(ry0+0.1),L2=Math.hypot(dx,dy),rd_=LB(g,MAT.post,L2,0.09,0.09,(xb+0.4+rx0+1)/2,(yT+8.4+ry0+0.1)/2,z);rd_.rotation.z=Math.atan2(dy,dx);}
LB(g,MAT.red,0.25,1,len,X0-1.6,0.5,0);for(let z=-len/2,i=0;z<len/2-0.1;z+=len/4,i++){const m=new THREE.Mesh(GEO.box,[MAT.post,ADS[(ad0+i+4)%6],MAT.post,MAT.post,MAT.post,MAT.post]);m.scale.set(0.06,0.8,len/4-0.3);m.position.set(X0-1.75,0.55,z+len/8);g.add(m);}
LB(g,MAT.white,0.08,0.08,len,X0-1.2,1.35,0,1);
crowdPush(g,fan,CRS);
for(const z of[-len/2-2.5,len/2+2.5]){LB(g,MAT.post,0.6,24,0.6,X0+13,12,z);LB(g,MAT.post,0.5,2.0,3.6,X0+12.6,23.5,z,1);{const fp=new THREE.Mesh(GEO.box,[MAT.post,MAT.flood,MAT.post,MAT.post,MAT.post,MAT.post]);fp.scale.set(0.1,1.8,3.4);fp.position.set(X0+12.3,23.5,z);fp.rotation.z=-0.25;g.add(fp);}g.parent.updateMatrixWorld(true);const v=new THREE.Vector3(X0+12,23.5,z).applyMatrix4(g.matrixWorld);GLOWS.push([v.x,v.y,v.z,2.2]);}}
function zone(k,s,len){{const w=W(k,s*(HW+17),0);STP.push([w.x,w.z,0.6]);}const g=SIDE(k,s),fan=[];
for(let r=0;r<5;r++){const x=HW+15.2+r*1.05;for(let z=-len/2;z<=len/2;z+=0.7)if(Math.random()<0.78-r*0.08)fan.push([x+(Math.random()-0.5)*0.4,0.82+r*0.18,z+(Math.random()-0.5)*0.3,-Math.PI/2+(Math.random()-0.5)*0.6]);}
for(let r=1;r<5;r++)LB(g,MAT.conc,1.05,r*0.18+0.02,len+1,HW+15.2+r*1.05,(r*0.18+0.02)/2,0,1);
for(let z=-len/2-0.5;z<=len/2+0.5;z+=3){LB(g,MAT.post,0.12,2.6,0.12,HW+14.2,1.3,z);}
for(const y of[1.1,2.5])LB(g,MAT.white,0.08,0.08,len+1,HW+14.2,y,0,1);
crowdPush(g,fan,CRZ);}
function pits(k,s,len){const g=SIDE(k,s),X=HW+22;
const b=new THREE.Mesh(GEO.box,[MAT.conc2,MAT.gar,MAT.roof,MAT.conc2,MAT.conc2,MAT.conc2]);b.scale.set(12,6,len);b.position.set(X,3,0);b.castShadow=b.receiveShadow=true;g.add(b);
const up=new THREE.Mesh(GEO.box,[MAT.glassB,MAT.glassB,MAT.roof,MAT.conc2,MAT.conc2,MAT.conc2]);up.scale.set(10,2.8,len);up.position.set(X+1,7.4,0);up.castShadow=true;g.add(up);
LB(g,MAT.roof,15,0.4,len+3,X-0.5,9,0);}
function bridge(k){const g=LG(k),X=HW+15;for(const s of[-1,1]){LB(g,MAT.post,1.2,9.5,1.2,s*X,4.75,0);const w=W(k,s*X,0);addOb(w.x,w.z,1);}
const m=new THREE.Mesh(GEO.box,[MAT.post,MAT.post,MAT.post,MAT.post,MAT.big,MAT.big]);m.scale.set(2*X+1.2,2.2,1.1);m.position.y=9.3;m.castShadow=true;g.add(m);}


function inTun(k){return!!TUN&&k>=TUN[0]-3&&k<=TUN[1]+3;}
function inPoly(x,z,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
function waterSetup(t){WC=[];if(t.water)t.water.forEach(w=>WC.push(w.slice()));
if(t.lake){for(let x=MB.x0;x<MB.x1;x+=26)for(let z=MB.z0;z<MB.z1;z+=26){if(!inPoly(x,z,t.p))continue;const d=rd(x,z);if(d>HW+48)WC.push([x,z,Math.min(d-HW-22,70)]);}}
if(!WC.length)return;let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;WC.forEach(c=>{x0=Math.min(x0,c[0]-c[2]);x1=Math.max(x1,c[0]+c[2]);z0=Math.min(z0,c[1]-c[2]);z1=Math.max(z1,c[1]+c[2]);});
const sx=x1-x0+40,sz=z1-z0+40,tx=waterN.clone();tx.needsUpdate=true;tx.repeat.set(sx/38,sz/38);
const m=new THREE.Mesh(GEO.plane,TM(S(0x1a5a78,0.3,0.08,{normalMap:tx,normalScale:new THREE.Vector2(0.45,0.45)})));m.material.userData.tmp=1;m.scale.set(sx,1,sz);m.position.set((x0+x1)/2,-0.45,(z0+z1)/2);m.receiveShadow=true;trackG.add(m);WATS.push(m);}
const FAC=(()=>{const mk=(rows)=>{const t=ctex(128,256,(x,w,h)=>{x.fillStyle='#e9e9e9';x.fillRect(0,0,w,h);const cw=w/6,rh=h/rows;for(let i=0;i<6;i++)for(let j=0;j<rows;j++){const v=Math.random();x.fillStyle=v<0.12?'#c9d6e2':v<0.2?'#8a99a8':'#56697c';x.fillRect(i*cw+2,j*rh+2,cw-4,rh-3);x.fillStyle='rgba(255,255,255,0.18)';x.fillRect(i*cw+2,j*rh+2,cw-4,2);}noise(x,w,h,3000,0.06,1);});return t;};
return{lo:mk(5),hi:mk(18)};})();
const ROOFB=L(0x9a9ea5),FACM={lo:(()=>{const m=L(0xffffff,{map:FAC.lo});return[m,m,ROOFB,ROOFB,m,m];})(),hi:(()=>{const m=L(0xffffff,{map:FAC.hi});return[m,m,ROOFB,ROOFB,m,m];})()};
function blds(list,cols,tall){if(!list.length)return;const a=[],ac=[],b=[],bc=[];list.forEach((q,i)=>{if(q[7]>tall){a.push(q);ac.push(cols[i]);}else{b.push(q);bc.push(cols[i]);}});inst(GEO.box,FACM.hi,a,true,ac);inst(GEO.box,FACM.lo,b,true,bc);}
function extras(t,ti){let sd=ti*331+77;const r=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
if(t.tunnel){const k0=Math.floor(t.tunnel[0]*NP),k1=Math.floor(t.tunnel[1]*NP),roof=[],wl=[],lt=[],top=[],topC=[];TUN=[k0,k1];
for(let k=k0;k<=k1;k+=2){const p=P[k],ry=Math.atan2(TA[k].x,TA[k].z);roof.push([p.x,8.4,p.z,0,ry,0,2*(HW+15),1.3,3.3]);
for(const s of[-1,1]){const w=W(k,s*(HW+15),0);wl.push([w.x,4.1,w.z,0,ry,0,1.4,8.4,3.3]);if((k-k0)%6===0){const l=W(k,s*(HW-2),0);lt.push([l.x,7.66,l.z,0,ry,0,1.4,0.16,2.6]);}}
if(k>k0+12&&k<k1-12&&(k>>1)%9<8){top.push([p.x,9.05+9,p.z,0,ry,0,2*(HW+13),18,3.4]);topC.push(new THREE.Color(0xf1e2c8));}
SL.push([p.x,p.z,HW+17]);}
const tc=TM(L(0x7d8186));inst(GEO.box,tc,roof,true);inst(GEO.box,tc,wl,true);inst(GEO.box,TM(new THREE.MeshBasicMaterial({color:0xfff1c8})),lt,false);blds(top,topC,1e9);}
if(t.city){const L1=[],C1=[];for(let k=0;k<NP;k+=4)for(const s of[-1,1]){if(r()<0.25||k<40||k>NP-60)continue;const row=r()<0.6?0:1,lat=HW+(row?62:27)+r()*(row?55:18),wd=10+r()*16,dp=10+r()*14,a=W(k,s*(lat+dp/2),0),d=rd(a.x,a.z);
if(d<HW+19+dp/2||inWat(a.x,a.z,dp)||SL.some(q=>Math.hypot(q[0]-a.x,q[1]-a.z)<q[2]+wd*0.4))continue;const b=H(a.x,a.z,d),h=8+r()*30+(row?r()*20:0);
L1.push([a.x,b+h/2-1,a.z,0,Math.atan2(TA[k].x,TA[k].z),0,dp,h,wd]);C1.push(r()<0.2?new THREE.Color(0xf6f3ec):hsl(0.04+r()*0.1,0.3+r()*0.3,0.68+r()*0.14));SL.push([a.x,a.z,Math.max(wd,dp)*0.62]);if(L1.length>(cfg.q?520:330))break;}
blds(L1,C1,30);}
if(t.sky){const sk=t.sky,L2=[],C2=[],n=Math.round(sk.n*(cfg.q?1:0.7));for(let i=0,tr=0;i<n&&tr<n*8;tr++){const a=sk.a!==undefined?sk.a+(r()-0.5)*2*sk.sp:r()*6.283,dd=sk.d[0]+r()*(sk.d[1]-sk.d[0]),x=CX+Math.sin(a)*dd,z=CZ+Math.cos(a)*dd;
if(rd(x,z)<HW+130||inWat(x,z,20)||z>seaZ-60)continue;const h=sk.h[0]+Math.pow(r(),2.2)*(sk.h[1]-sk.h[0]),w=16+r()*26;L2.push([x,h/2-2,z,0,r()*3.14,0,w,h,w*(0.7+r()*0.6)]);C2.push(hsl(0.55+r()*0.08,0.05+r()*0.12,0.55+r()*0.3));i++;}
blds(L2,C2,70);}
if(t.ferris){const x=t.ferris[0],z=t.ferris[1],b=H(x,z,rd(x,z)),g=new THREE.Group();g.position.set(x,b,z);g.rotation.y=Math.atan2(CX-x,CZ-z)+Math.PI/2;trackG.add(g);const R0=30,cy=R0+5;
for(const s of[-1,1])for(const f of[-1,1]){const m=new THREE.Mesh(GEO.box,MAT.white);const len=Math.hypot(14,cy);m.scale.set(1,len,1);m.position.set(f*7,cy/2,s*3.2);m.rotation.z=-f*Math.atan2(14,cy);m.castShadow=true;g.add(m);}
const wh=new THREE.Group();wh.position.y=cy;g.add(wh);const rimG=TM(new THREE.TorusGeometry(R0,0.45,6,72));for(const s of[-1,1]){const m=new THREE.Mesh(rimG,MAT.white);m.position.z=s*1.6;wh.add(m);}
const hub=new THREE.Mesh(GEO.cyl,MAT.post);hub.scale.set(2,4.5,2);hub.rotation.x=Math.PI/2;wh.add(hub);const gond=[];
for(let i=0;i<24;i++){const a=i/24*Math.PI*2,sp=new THREE.Mesh(GEO.box,MAT.white);sp.scale.set(0.25,R0,0.25);sp.position.set(Math.cos(a)*R0/2,Math.sin(a)*R0/2,0);sp.rotation.z=a-Math.PI/2;wh.add(sp);
const gd=new THREE.Mesh(GEO.box,TM(L([0xff4d4d,0xffd23f,0x3ddc97,0x4d9bff,0xff8ad8,0xffffff][i%6])));gd.scale.set(2.2,2.4,2.2);gd.position.set(Math.cos(a)*R0,Math.sin(a)*R0-1.6,0);wh.add(gd);gond.push(gd);}
FERRIS={w:wh,g:gond};SL.push([x,z,26]);}
if(t.stadium){const x=t.stadium[0],z=t.stadium[1],g=new THREE.Group();g.position.set(x,H(x,z,rd(x,z))-0.3,z);trackG.add(g);const ow=TM(new THREE.CylinderGeometry(1,1,1,56,1,true));
const wall=new THREE.Mesh(ow,TM(L(0xe9edf2,{side:THREE.DoubleSide})));wall.scale.set(72,22,56);wall.position.y=11;wall.castShadow=true;g.add(wall);
const bowl=new THREE.Mesh(TM(new THREE.CylinderGeometry(1,0.72,1,56,1,true)),TM(L(0x2f5d7c,{side:THREE.DoubleSide})));bowl.scale.set(70,20,54);bowl.position.y=11;g.add(bowl);
const field=new THREE.Mesh(TM(new THREE.CircleGeometry(1,40)),TM(L(0x3e8d3a)));field.rotation.x=-Math.PI/2;field.scale.set(49,37,1);field.position.y=1.2;g.add(field);
const can=new THREE.Mesh(TM(new THREE.RingGeometry(0.74,1.02,56)),TM(L(0xf6f6f6,{side:THREE.DoubleSide})));can.rotation.x=-Math.PI/2;can.scale.set(74,58,1);can.position.y=24;can.castShadow=true;g.add(can);
for(let i=0;i<8;i++){const a=i/8*Math.PI*2;LB(g,MAT.post,0.8,26,0.8,Math.cos(a)*74,13,Math.sin(a)*58);}SL.push([x,z,82]);}
if(t.wing){let k=-1;for(let q=Math.floor(NP*0.015);q<NP*0.6;q+=4){if(CU[q]>0.06||CU[(q+8)%NP]>0.06||CU[(q-8+NP)%NP]>0.06)continue;const a=W(q,HW+26,0),b=W(q,-HW-26,0);if(rd(a.x,a.z)>HW+18&&rd(b.x,b.z)>HW+18&&!inWat(a.x,a.z,8)&&!inWat(b.x,b.z,8)){k=q;break;}}if(k>=0){const g=LG(k),X=HW+26;for(const s of[-1,1]){LB(g,MAT.conc2,7,30,12,s*X,15,0);const w=W(k,s*X,0);addOb(w.x,w.z,5);}
const wg=LB(g,MAT.roof,2*X+22,2.4,30,0,31.5,0);for(const s of[-1,1]){const sl=LB(g,MAT.white,X+6,1.2,26,s*(X/2+6),35,0);sl.rotation.z=s*0.16;}reserve(k,1,HW+18,HW+34,-16,16);reserve(k,-1,HW+18,HW+34,-16,16);}}}

function buildTrack(ti){
scene.remove(trackG);trackG.traverse(o=>{if(o.geometry&&!o.geometry.userData.k)o.geometry.dispose();const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];ms.forEach(m=>{if(m.userData.tmp){if(m.map)m.map.dispose();m.dispose();}});});
CULL=[];CRS=[];CRZ=[];WATER=null;TUN=null;WATS=[];WC=[];FERRIS=null;STP=[];GLOWS=[];GLOWO=null;LPOOL=null;trackG=new THREE.Group();scene.add(trackG);OB=new Map();SL=[];CROWD=[];FLAGS=[];GL=[];SNOW=null;CLOUD=null;
const t=TR[ti],th=TH[t.th];TH0=th;builtT=ti;
setSky(th.sky[0],th.sky[1],th.sky[2]);makeEnv();scene.background=new THREE.Color(th.sky[1]);scene.fog=new THREE.Fog(th.sky[1],350,1750);
sun.color.setHex(th.sun);hemi.color.setHex(th.sky[1]);hemi.groundColor.setHex(th.hg);
const curve=new THREE.CatmullRomCurve3(t.p.map(q=>new THREE.Vector3(q[0]*t.s,0,q[1]*t.s)),true,'centripetal');
NP=Math.round(curve.getLength()/1.5);const sp=curve.getSpacedPoints(NP);sp.pop();P=sp.map(v=>({x:v.x,z:v.z}));
TA=P.map((p,k)=>{const a=P[(k+1)%NP],b=P[(k-1+NP)%NP],dx=a.x-b.x,dz=a.z-b.z,l=Math.hypot(dx,dz);return{x:dx/l,z:dz/l};});
CU=P.map((p,k)=>ang(TA[(k-6+NP)%NP],TA[(k+6)%NP]));
CUR=P.map((p,k)=>{for(let o=-5;o<=5;o++)if(CU[(k+o+NP)%NP]>0.16)return true;return false;});
MB={x0:Math.min(...P.map(p=>p.x)),x1:Math.max(...P.map(p=>p.x)),z0:Math.min(...P.map(p=>p.z)),z1:Math.max(...P.map(p=>p.z))};
CX=(MB.x0+MB.x1)/2;CZ=(MB.z0+MB.z1)/2;RAD=Math.max(MB.x1-MB.x0,MB.z1-MB.z0)*0.6;seaZ=t.th===3&&t.sea!==0?MB.z1+110:1e9;
INS=P.map((p,k)=>{const f=P[(k+10)%NP],b=P[(k-10+NP)%NP],mx_=(f.x+b.x)/2-p.x,mz=(f.z+b.z)/2-p.z;return Math.sign(mx_*TA[k].z-mz*TA[k].x)||1;});
let raw=new Float32Array(NP);const iv=j=>{j=(j+NP*2)%NP;return INS[j]*Math.min(1,CU[j]*2.5);};
for(let k=0;k<NP;k++)raw[k]=iv(k)-0.45*(iv(k+24)+iv(k-24));
for(let ps=0;ps<4;ps++){const o=new Float32Array(NP);for(let k=0;k<NP;k++){let s=0;for(let j=-8;j<=8;j++)s+=raw[(k+j+NP)%NP];o[k]=s/17;}raw=o;}
RL=Array.from(raw,v=>Math.max(-1,Math.min(1,v*1.6))*(HW-2.6));VP=CARS.map(speedProfile);
waterSetup(t);buildTerrain(t,th);
const vT=ctex(256,256,(x,w,h)=>{if(th.verge==='mow'){x.fillStyle=th.ru[0];x.fillRect(0,0,w,128);x.fillStyle=th.ru[1];x.fillRect(0,128,w,128);for(let i=0;i<9000;i++){const px=Math.random()*w,py=Math.random()*h,l=1.5+Math.random()*4,v=Math.random()<0.5;x.strokeStyle=v?'rgba(255,255,220,'+(0.06+Math.random()*0.12)+')':'rgba(0,30,0,'+(0.06+Math.random()*0.14)+')';x.lineWidth=0.8+Math.random()*0.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-0.5)*2,py-l);x.stroke();}}
else{x.fillStyle=th.ru[0];x.fillRect(0,0,w,h);blobs(x,w,h,[th.ru[1]],18,8,30,0.2,0.4);noise(x,w,h,9000,0.12,2);}},true);
R(()=>[-HW-12.5,HW+12.5],0.04,TM(L(0xffffff,{map:vT})),{vs:20,uu:4});
const gT=ctex(256,256,(x,w,h)=>{x.fillStyle=th.grav;x.fillRect(0,0,w,h);const b=new THREE.Color(th.grav);for(let i=0;i<4200;i++){const px=Math.random()*w,py=Math.random()*h,r=1.2+Math.random()*3.2,c=b.clone().offsetHSL((Math.random()-0.5)*0.05,(Math.random()-0.5)*0.15,(Math.random()-0.5)*0.28);
x.fillStyle='rgba(0,0,0,0.35)';x.beginPath();x.ellipse(px+0.8,py+0.9,r,r*0.75,0,0,7);x.fill();x.fillStyle='#'+c.getHexString();x.beginPath();x.ellipse(px,py,r,r*0.75,Math.random()*3,0,7);x.fill();x.fillStyle='rgba(255,255,255,0.25)';x.beginPath();x.ellipse(px-r*0.3,py-r*0.3,r*0.4,r*0.3,0,0,7);x.fill();}},true);
if(t.runoff!=='none'){const paint=t.runoff==='paint',pT=paint?ctex(256,256,(x,w_,h)=>{x.fillStyle='#55585e';x.fillRect(0,0,w_,h);noise(x,w_,h,9000,0.12,2);for(let i=-4;i<8;i++){x.fillStyle=i%2?'rgba(40,110,220,0.9)':'rgba(240,240,240,0.85)';x.beginPath();x.moveTo(i*40,0);x.lineTo(i*40+40,0);x.lineTo(i*40+40+h*0.6,h);x.lineTo(i*40+h*0.6,h);x.fill();}x.fillStyle='rgba(85,88,94,1)';x.fillRect(110,0,146,h);noise(x,w_,h,4000,0.08,2);},true):null;
R(k=>{if(CU[k]<0.12)return null;return -INS[k]>0?[HW+2.3,HW+10.5]:[-HW-10.5,-HW-2.3];},0.07,TM(L(0xffffff,{map:paint?pT:gT})),{vs:paint?8:4,uu:paint?1:2});}
const rT=ctex(256,512,(x,w,h)=>{x.fillStyle=th.road;x.fillRect(0,0,w,h);noise(x,w,h,30000,0.12,2);for(let i=0;i<7;i++){x.fillStyle='rgba(0,0,0,0.07)';x.fillRect(20+Math.random()*200,Math.random()*h,30+Math.random()*40,20+Math.random()*80);}
x.fillStyle='rgba(0,0,0,0.12)';x.fillRect(60,0,30,h);x.fillRect(166,0,30,h);x.fillStyle='#f0f0f0';x.fillRect(6,0,7,h);x.fillRect(w-13,0,7,h);},true);
ROADM=TM(S(0xffffff,0,0.92,{map:rT}));R(()=>[-HW,HW],0.1,ROADM,{vs:30});
{const rT=ctex(64,256,(x,w_,h)=>{x.clearRect(0,0,w_,h);for(let i=0;i<w_;i++){const v=Math.pow(Math.sin(i/w_*Math.PI),1.6);x.fillStyle='rgba(8,8,10,'+(v*0.3)+')';x.fillRect(i,0,1,h);}for(let i=0;i<260;i++){x.fillStyle='rgba(0,0,0,'+(Math.random()*0.18)+')';x.fillRect(8+Math.random()*48,Math.random()*h,1+Math.random()*2,8+Math.random()*40);}},true);
const rm=TM(new THREE.MeshBasicMaterial({map:rT,transparent:true,depthWrite:false,opacity:0.85}));R(k=>[RL[k]-1.7,RL[k]+1.7],0.104,rm,{vs:14,free:1}).renderOrder=1;}
const km=TM(new THREE.MeshLambertMaterial({vertexColors:true}));R(k=>CUR[k]?[HW,HW+2.3]:null,0.13,km,{str:1});R(k=>CUR[k]?[-HW-2.3,-HW]:null,0.13,km,{str:1});
const SG=LG(0);const ln=new THREE.Mesh(GEO.plane,MAT.chk);ln.scale.set(HW*2,1,2.6);ln.position.y=0.15;ln.receiveShadow=true;SG.add(ln);
for(const s of[-1,1]){LB(SG,MAT.post,0.8,8.2,0.8,s*(HW+3),4.1,0);const w=W(0,s*(HW+3),0);addOb(w.x,w.z,0.8);}
const bm=new THREE.Mesh(GEO.box,[MAT.post,MAT.post,MAT.post,MAT.post,MAT.ban,MAT.ban]);bm.scale.set(HW*2+6.8,1.7,0.7);bm.position.y=7.9;bm.castShadow=true;SG.add(bm);
LB(SG,MAT.post,7.8,2.0,0.55,0,6.5,-0.3);for(let i=0;i<5;i++){const mt=TM(new THREE.MeshBasicMaterial({color:0x2a2d35})),x=-2.8+i*1.4;for(const y of[6.95,6.05]){const m=new THREE.Mesh(GEO.cyl,mt);m.scale.set(0.3,0.08,0.3);m.rotation.x=Math.PI/2;m.position.set(x,y,-0.6);SG.add(m);LB(SG,MAT.post,0.78,0.06,0.32,x,y+0.36,-0.72,1);}GL.push(mt);}
for(let k=0;k<8;k++){const side=k%2?-1:1,g=LG(gridIdx(k));LB(g,MAT.white,3.6,0.02,0.3,side*4.5,0.12,2.6,1);LB(g,MAT.white,0.3,0.02,1.6,side*4.5-1.65,0.12,1.95,1);LB(g,MAT.white,0.3,0.02,1.6,side*4.5+1.65,0.12,1.95,1);}
const wl=[],wc=[],WALL=[new Uint8Array(NP),new Uint8Array(NP)],CW=new THREE.Color(0xf2f2f2),CR=new THREE.Color(0xd33b2f),CC=new THREE.Color(0xc9cdd2);
for(let k=0;k<NP;k+=2)for(const s of[-1,1]){const w=W(k,s*(HW+12.8),0);if(rd(w.x,w.z)<HW+11.8)continue;wl.push([w.x,0.6,w.z,0,Math.atan2(TA[k].x,TA[k].z),0,0.9,1.2,3.2]);wc.push(CUR[k]?((k>>1)%2?CR:CW):CC);WALL[s>0?0:1][k]=1;addOb(w.x,w.z,1.5);}
inst(GEO.box,MAT.inst,wl,true,wc);
const ti_=[],tc=[],TC=[new THREE.Color(0x1b1b1b),new THREE.Color(0xf2f2f2),new THREE.Color(0xd33b2f)];
for(let k=0;k<NP;k+=1){if(CU[k]<0.2)continue;const s=-INS[k];if(!WALL[s>0?0:1][k])continue;const w=W(k,s*(HW+11.3),0),c=TC[(k>>1)%3];ti_.push([w.x,0.17,w.z],[w.x,0.5,w.z],[w.x,0.83,w.z]);tc.push(c,c,c);}
inst(GEO.tire,MAT.inst,ti_,true,tc,null,420);
for(let k=10;k<NP;k+=10){if(CUR[k])continue;for(const s of[-1,1]){if(!WALL[s>0?0:1][k])continue;const w=W(k,s*(HW+12.3),0),b=new THREE.Mesh(GEO.box,[MAT.post,ADS[(k/10+(s>0?0:3))%6|0],MAT.post,MAT.post,MAT.post,MAT.post]);
b.scale.set(0.08,0.9,5.8);b.position.set(w.x,0.62,w.z);b.rotation.y=Math.atan2(TA[k].x,TA[k].z)+(s>0?0:Math.PI);trackG.add(b);}}
extras(t,ti);
let ss=0;for(const s of[1,-1])if(clear(0,s,HW+14,HW+30,-22,22)){stand(0,s,40);reserve(0,s,HW+14,HW+30,-22,22);ss=s;break;}
if(ss&&clear(0,-ss,HW+14,HW+30,-38,38)){pits(0,-ss,70);reserve(0,-ss,HW+14,HW+30,-38,38);}
const cand=[...Array(NP).keys()].filter(k=>CU[k]>0.25&&Math.min(k,NP-k)>45).sort((a,b)=>CU[b]-CU[a]);const used=[];
for(const k of cand){if(used.length>=2)break;if(used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<NP/5))continue;const s=-INS[k];if(clear(k,s,HW+14,HW+30,-16,16)){stand(k,s,30);reserve(k,s,HW+14,HW+30,-16,16);used.push(k);}}
let bs=-1,bl=0,cs=-1;for(let k=0;k<NP*2;k++){const kk=k%NP;if(!CUR[kk]){if(cs<0)cs=k;const l=k-cs;if(l>bl&&l<NP){const mid=Math.floor((cs+k)/2)%NP;if(Math.min(mid,NP-mid)>50){bl=l;bs=mid;}}}else cs=-1;}
if(bs>=0&&clear(bs,1,HW+13.5,HW+16,-2,2)&&clear(bs,-1,HW+13.5,HW+16,-2,2)){bridge(bs);reserve(bs,1,0,1,-2,2);}
let zc=0;for(const k of cand){if(zc>=Math.min(9,NP/280))break;if(used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<NP/9))continue;const s=-INS[k];if(clear(k,s,HW+14,HW+21,-17,17)){zone(k,s,30);reserve(k,s,HW+14,HW+21,-17,17);used.push(k);zc++;}}
for(let k=30;k<NP-30;k+=20){if(CUR[k]||used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<45))continue;for(const s of[1,-1])if(clear(k,s,HW+14,HW+32,-16,16)){stand(k,s,30);reserve(k,s,HW+14,HW+32,-16,16);used.push(k);break;}if(used.length>Math.min(cfg.q?14:9,NP/170))break;}
for(let k=NP/10|0;k<NP;k+=NP/7|0){const s=-INS[k];if(clear(k,s,HW+15,HW+18,-2,2)){const g=SIDE(k,s);LB(g,MAT.orange,1.8,2.4,1.8,HW+16.5,1.2,0);LB(g,MAT.roof,2.3,0.2,2.3,HW+16.5,2.5,0);reserve(k,s,HW+15,HW+18,-2,2);}}
{let bc=0;for(let k=Math.floor(NP*0.07);k<NP&&bc<8;k+=Math.floor(NP/11)){if(CUR[k])continue;const s=-INS[k]||1;for(const ss of[s,-s])if(clear(k,ss,HW+20,HW+24,-7,7)){billboard(k,ss,bc%6);reserve(k,ss,HW+20,HW+24,-7,7);bc++;break;}}}
trackside(WALL,ti);
puddles();
const fm=[MAT.chkD,TM(L(0xd7263d,{side:THREE.DoubleSide})),TM(L(0x1b6ee8,{side:THREE.DoubleSide})),TM(L(0xf2b705,{side:THREE.DoubleSide}))];
for(const s of[-1,1])for(const lz of[-26,-32,26,32]){const w=W(0,s*(HW+14.2),lz);if(rd(w.x,w.z)<HW+13)continue;const g=new THREE.Group();g.position.set(w.x,0,w.z);
const po=new THREE.Mesh(GEO.pole,MAT.white);po.scale.y=8;g.add(po);const fl=new THREE.Mesh(GEO.flag,fm[(FLAGS.length)%4]);fl.position.y=7.2;g.add(fl);trackG.add(g);FLAGS.push({m:fl,p:Math.random()*6,b:Math.atan2(TA[0].x,TA[0].z)+Math.PI/2});}
vegetation(ti,t,th,WALL);addCrowd(trackG,CRS,false,260);addCrowd(trackG,CRZ,true,260);batchStatic();applyWeather(t.th===2?'snow':'clear');
const ld=$('load');ld.style.opacity=0;setTimeout(()=>{if(ld.style.opacity==='0')ld.style.display='none';},420);}

const waterN=(()=>{const N=128,h=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=0;for(let o=1;o<=4;o++){const f=o*2*Math.PI/N;v+=Math.sin(x*f*1.0+y*f*0.6+o)*Math.cos(y*f*1.3-x*f*0.4+o*2)/o;}h.push(v);}
return ctex(N,N,(c)=>{const id=c.createImageData(N,N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,dx=h[y*N+(x+1)%N]-h[y*N+(x-1+N)%N],dy=h[((y+1)%N)*N+x]-h[((y-1+N)%N)*N+x];const nx=-dx*2,ny=-dy*2,nz=1,l=Math.hypot(nx,ny,nz);id.data[i*4]=(nx/l*0.5+0.5)*255;id.data[i*4+1]=(ny/l*0.5+0.5)*255;id.data[i*4+2]=(nz/l*0.5+0.5)*255;id.data[i*4+3]=255;}c.putImageData(id,0,0);},true);})();
waterN.repeat.set(400,200);
function vegetation(ti,t,th,WALL){
let sd=ti*977+13;const r=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};const Q=cfg.q?1:0.55;
const okP=(x,z,m)=>{if(z>seaZ-m||inWat(x,z,6))return false;for(const q of SL)if(Math.hypot(q[0]-x,q[1]-z)<q[2])return false;return true;};
const V={tr:[],trC:[],can:[],canC:[],cone:[],coneC:[],cap:[],bush:[],bushC:[],rock:[],rockC:[],cac:[],cacB:[],palm:[],leaf:[],leafC:[],tuft:[],tuftC:[],fl:[],flC:[],bank:[],dune:[]};
const pine=(x,z,s,b,snow)=>{V.tr.push([x,b-0.3,z,0,0,0,s*0.8,s*2.4,s*0.8]);V.trC.push(hsl(0.07,0.4,0.2));const n=4;for(let j=0;j<n;j++){const y=b+(1.2+j*1.45)*s,rr=(2.6-j*0.55)*s,hh=(3.0-j*0.4)*s;V.cone.push([x,y,z,0,r()*6,0,rr,hh,rr]);V.coneC.push(hsl(0.36+r()*0.04,0.4,0.13+r()*0.07+j*0.015));if(snow)V.cap.push([x,y+hh*0.4,z,0,r()*6,0,rr*0.72,hh*0.6,rr*0.72]);}};
const decid=(x,z,s,b)=>{const h=s*(0.9+r()*0.4);V.tr.push([x,b-0.3,z,0,0,0,s,h*3.6,s]);V.trC.push(hsl(0.07,0.3,0.18+r()*0.06));const nb=4+Math.floor(r()*3);
for(let j=0;j<nb;j++){const a=r()*6.28,rr=(0.4+r()*1.2)*s;V.can.push([x+Math.cos(a)*rr,b+(3.7+r()*1.8)*h,z+Math.sin(a)*rr,r(),r()*6,r(),s*(1.2+r()*0.6),s*(1.0+r()*0.5),s*(1.2+r()*0.6)]);V.canC.push(hsl(0.22+r()*0.08,0.42+r()*0.2,0.19+r()*0.13));}};
const birch=(x,z,s,b)=>{V.tr.push([x,b-0.3,z,0,0,0,s*0.6,s*5.4,s*0.6]);V.trC.push(hsl(0.1,0.06,0.86));for(let j=0;j<4;j++){V.can.push([x+(r()-0.5)*1.4*s,b+(4.4+r()*1.8)*s,z+(r()-0.5)*1.4*s,r(),r()*6,0,s*0.9,s*1.25,s*0.9]);V.canC.push(hsl(0.2+r()*0.05,0.5,0.36+r()*0.1));}};
const bush=(x,z,s,b,c)=>{const n=2+Math.floor(r()*3);for(let j=0;j<n;j++){V.bush.push([x+(r()-0.5)*1.8*s,b+0.45*s,z+(r()-0.5)*1.8*s,r(),r()*6,0,s*(0.9+r()*0.6),s*(0.7+r()*0.35),s*(0.9+r()*0.6)]);V.bushC.push(c());}};
const rock=(x,z,s,b,c)=>{V.rock.push([x,b+0.2*s,z,r(),r()*6,r(),s*(1+r()),s*(0.6+r()*0.7),s*(1+r())]);V.rockC.push(c);};
const palm=(x,z,s,b)=>{let cx=x,cy=b-0.2,cz=z;const th_=r()*6.28,t0=0.08+r()*0.22,hh=1.25*s;for(let j=0;j<6;j++){const tl=t0+j*0.05,ux=Math.sin(tl)*Math.sin(th_),uy=Math.cos(tl),uz=Math.sin(tl)*Math.cos(th_);V.palm.push([cx+ux*hh/2,cy+uy*hh/2,cz+uz*hh/2,tl,th_,0,0.3*s*(1-j*0.07),hh,0.3*s*(1-j*0.07)]);cx+=ux*hh;cy+=uy*hh;cz+=uz*hh;}
for(let j=0;j<10;j++){V.leaf.push([cx,cy,cz,0.25+r()*0.45,j*0.628+r()*0.3,0,s*(0.9+r()*0.3),s,s*(3+r()*0.8)]);V.leafC.push(hsl(0.25+r()*0.06,0.5,0.22+r()*0.1));}};
const sag=(x,z,s,b)=>{const h=(4.5+r()*2.5)*s;V.cac.push([x,b+h/2,z,0,0,0,0.42*s,h,0.42*s]);V.cacB.push([x,b+h,z,0,0,0,0.42*s]);const na=Math.floor(r()*3);
for(let j=0;j<na;j++){const f=r()*6.28,ay=b+h*(0.35+r()*0.25),dx=Math.cos(f),dz=-Math.sin(f);V.cac.push([x+dx*0.7*s,ay,z+dz*0.7*s,0,f,Math.PI/2,0.3*s,1.0*s,0.3*s],[x+dx*1.2*s,ay+0.9*s,z+dz*1.2*s,0,0,0,0.3*s,1.8*s,0.3*s]);V.cacB.push([x+dx*1.2*s,ay+1.8*s,z+dz*1.2*s,0,0,0,0.3*s]);}};
const A=[MB.x0-320,MB.x1+320,MB.z0-320,MB.z1+320];
const VN=Math.min(3600,1500*Math.max(1,Math.min(2.2,(A[1]-A[0])*(A[3]-A[2])/1.8e6))*(t.veg||1));for(let n=0;n<VN*Q;n++){const x=A[0]+r()*(A[1]-A[0]),z=A[2]+r()*(A[3]-A[2]),dd=rd(x,z);if(dd<HW+17||!okP(x,z,35))continue;const b=H(x,z,dd);if(b>TP.tl)continue;const s=0.75+r()*0.7,q=r();
if(th.p==='forest'){if(q<0.58)decid(x,z,s,b);else if(q<0.8)pine(x,z,s,b,false);else if(q<0.88)birch(x,z,s,b);else bush(x,z,s,b,()=>hsl(0.27+r()*0.05,0.45,0.2+r()*0.08));}
else if(th.p==='desert'){if(dd>150&&r()<0.1){V.dune.push([x,b-2,z,0,r()*6,0,30+r()*30,5+r()*6,20+r()*25]);continue;}if(q<0.22)sag(x,z,s,b);else if(q<0.34)V.cacB.push([x,b+0.4*s,z,0,0,0,0.6*s,0.5*s,0.6*s]);else if(q<0.7)bush(x,z,s*0.8,b,()=>hsl(0.12+r()*0.04,0.28,0.3+r()*0.08));else rock(x,z,s*1.4,b,hsl(0.06,0.35,0.38+r()*0.12));}
else if(th.p==='snow'){if(q<0.82)pine(x,z,s,b,true);else if(q<0.92)rock(x,z,s*1.3,b,hsl(0.6,0.06,0.5+r()*0.15));else bush(x,z,s,b,()=>hsl(0.33,0.12,0.75+r()*0.1));}
else{if(q<0.42)palm(x,z,s,b);else if(q<0.6)decid(x,z,s,b);else bush(x,z,s,b,()=>hsl(0.27+r()*0.05,0.5,0.24+r()*0.08));}
addOb(x,z,0.9*s);}
if(th.p!=='snow')for(let n=0;n<13000*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+13.5+Math.pow(r(),1.6)*100),(r()-0.5)*3),dd=rd(w.x,w.z);if(dd<HW+13.5||!okP(w.x,w.z,25))continue;const sc=0.6+r()*0.9;
V.tuft.push([w.x,H(w.x,w.z,dd)-0.05,w.z,0,r()*6,0,sc,sc*(0.7+r()*0.6),sc]);V.tuftC.push(th.p==='desert'?hsl(0.12+r()*0.03,0.4,0.5+r()*0.12):hsl(0.22+r()*0.06,0.5,0.27+r()*0.13));}
if(th.p==='forest'||th.p==='coast')for(let n=0;n<5000*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,lat=HW+3+r()*8.5;if((CU[k]>0.12&&-INS[k]===s)||inTun(k))continue;const w2=W(k,s*lat,(r()-0.5)*3);if(rd(w2.x,w2.z)<HW+2.8)continue;const sc=0.28+r()*0.25;V.tuft.push([w2.x,0.04,w2.z,0,r()*6,0,sc,sc*(0.6+r()*0.5),sc]);V.tuftC.push(hsl(0.24+r()*0.04,0.5,0.24+r()*0.1));}
if(th.p==='forest'||th.p==='coast')for(let n=0;n<1400*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+14+r()*70),0),dd=rd(w.x,w.z);if(dd<HW+14||!okP(w.x,w.z,25))continue;V.fl.push([w.x,H(w.x,w.z,dd)+0.35,w.z,0,0,0,0.13]);V.flC.push(new THREE.Color([0xffe14d,0xffffff,0xb47cff,0xff5d73][Math.floor(r()*4)]));}
for(let n=0;n<240*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+15+r()*40),0),dd=rd(w.x,w.z);if(dd<HW+15||!okP(w.x,w.z,25))continue;const b=H(w.x,w.z,dd);
if(th.p==='desert')rock(w.x,w.z,0.5+r()*0.8,b,hsl(0.06,0.35,0.4+r()*0.12));else if(th.p==='snow')rock(w.x,w.z,0.5+r()*0.8,b,hsl(0.6,0.06,0.55+r()*0.12));else bush(w.x,w.z,0.6+r()*0.5,b,()=>hsl(0.27+r()*0.05,0.5,0.22+r()*0.08));}
if(th.p==='snow')for(let k=0;k<NP;k+=3)for(const s of[-1,1])if(WALL[s>0?0:1][k]){const w=W(k,s*(HW+11.2),0);V.bank.push([w.x,0.1,w.z,0,Math.atan2(TA[k].x,TA[k].z),0,1.6,0.55,2.4]);}
const cs=q=>[q[0],q[1],q[2],q[3],q[4],q[5],q[6]*0.82,q[7]*0.82,q[8]*0.82],cc=q=>[q[0],q[1]+0.15*q[7],q[2],q[3],q[4],q[5],q[6]*1.32,q[7]*1.3,q[8]*1.32],lt=c=>c.clone().lerp(new THREE.Color(0xffffff),0.08);
inst(GEO.trunk,MAT.inst,V.tr,true,V.trC,null,1100);inst(GEO.blobL,MAT.instS,V.can.map(cs),true,V.canC.map(c=>c.clone().multiplyScalar(0.75)),null,1100);const cc2=q=>[q[0]+0.3*q[6],q[1]+0.35*q[7],q[2]-0.2*q[8],0.3,q[4]+0.9,0.2,q[6]*1.1,q[7]*1.05,q[8]*1.1];{const c2=cfg.q?V.can:V.can.filter((q,i)=>i%3===0),c2C=cfg.q?V.canC:V.canC.filter((q,i)=>i%3===0);inst(CARD,MAT.leaf,V.can.map(cc).concat(c2.map(cc2),V.bush.map(cc)),true,V.canC.map(lt).concat(c2C.map(c=>c.clone().lerp(new THREE.Color(0xffffff),0.14)),V.bushC.map(lt)),null,1100);}inst(GEO.cone,MAT.needle,V.cone,true,V.coneC,null,1100);inst(GEO.cone,MAT.snowF,V.cap,false,null,null,1100);
inst(GEO.blobL,MAT.instS,V.bush.map(cs),true,V.bushC.map(c=>c.clone().multiplyScalar(0.75)),null,520);inst(GEO.rock,MAT.instF,V.rock,true,V.rockC,null,520);inst(GEO.cyl,MAT.cac,V.cac,true);inst(GEO.ball,MAT.cac,V.cacB,true);
inst(GEO.cyl,MAT.palmT,V.palm,true,null,null,1100);inst(GEO.leaf,MAT.instD,V.leaf,true,V.leafC,null,1100);inst(GEO.tuft,MAT.tuft,V.tuft,false,V.tuftC,null,240);inst(GEO.blobL,MAT.inst,V.fl,false,V.flC,null,200);
inst(GEO.blob,MAT.snow,V.bank,false);inst(GEO.ball,TM(L(new THREE.Color(th.g[2]).getHex())),V.dune,false);
{const bot=[],top=[];for(let n=0;n<26;n++){const a=r()*6.28,d=300+r()*850,big=0.7+r()*0.8,gx=Math.sin(a)*d,gy=230+r()*160,gz=Math.cos(a)*d;
for(let j=0;j<16;j++){const tp=j<10,s=(tp?50+r()*60:60+r()*50)*big,it=[gx+(r()-0.5)*130*big,gy+(tp?r()*22:-10-r()*8),gz+(r()-0.5)*70*big,s*1.5,s*0.85,tp?1:0];(tp?top:bot).push(it);}}
const cm=bbMat(smokeT,0xffffff,0xb9c1cc,0.85,false);cm.fog=false;CLOUD=bboard(bot.concat(top),cm);CLOUD.position.set(CX,0,CZ);CLOUD.renderOrder=-1;trackG.add(CLOUD);}
if(seaZ<1e8){const w=new THREE.Mesh(GEO.plane,TM(S(0x1a6d9e,0.35,0.07,{normalMap:waterN,normalScale:new THREE.Vector2(0.85,0.85)})));WATER=w;WATS.push(w);{const ft=ctex(256,64,(x,w_,h)=>{x.clearRect(0,0,w_,h);for(let i=0;i<900;i++){const px=Math.random()*w_,py=h*0.5+(Math.random()-0.5)*h*0.7*Math.random();x.fillStyle='rgba(255,255,255,'+(0.15+Math.random()*0.5)+')';x.beginPath();x.ellipse(px,py,2+Math.random()*6,1+Math.random()*2,0,0,7);x.fill();}},true);ft.repeat.set(160,1);const fm=new THREE.Mesh(GEO.plane,TM(new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false,opacity:0.7})));fm.scale.set(6000,1,10);fm.position.set(CX,0.1,seaZ-14);trackG.add(fm);}w.scale.set(6000,1,3000);w.position.set(CX,0.08,seaZ+1460);trackG.add(w);
const st=ctex(128,64,(x,w_,h)=>{x.fillStyle='#e3d3a5';x.fillRect(0,0,w_,h);noise(x,w_,h,3000,0.15,2);},true);st.repeat.set(120,2);const b=new THREE.Mesh(GEO.plane,TM(L(0xffffff,{map:st})));b.scale.set(6000,1,80);b.position.set(CX,0.06,seaZ-30);b.receiveShadow=true;trackG.add(b);}
if(t.th===2){const n=cfg.q?4500:2500,ps=new Float32Array(n*3);for(let i=0;i<n;i++){ps[i*3]=(Math.random()-0.5)*140;ps[i*3+1]=Math.random()*50;ps[i*3+2]=(Math.random()-0.5)*140;}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(ps,3));
SNOW=new THREE.Points(g,TM(new THREE.PointsMaterial({color:0xffffff,size:0.32,map:softT,transparent:true,opacity:0.95,depthWrite:false})));SNOW.frustumCulled=false;trackG.add(SNOW);}}

function trackside(WALL,ti){let sd=ti*733+5;const r=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
for(const s of[-1,1]){const pos=[],uv=[],nr=[],idx=[];let v=0,acc=0;const off=s*(HW+12.8),Wa=WALL[s>0?0:1];
for(let k=0;k<NP;k+=2){const k2=(k+2)%NP;if(!Wa[k]||!Wa[k2])continue;const a=W(k,off,0),b=W(k2,off,0),l=Math.hypot(b.x-a.x,b.z-a.z);
pos.push(a.x,1.2,a.z,b.x,1.2,b.z,b.x,3.8,b.z,a.x,3.8,a.z);uv.push(acc/2.5,0,(acc+l)/2.5,0,(acc+l)/2.5,1,acc/2.5,1);for(let j=0;j<4;j++)nr.push(-s*TA[k].z,0,s*TA[k].x);idx.push(v,v+1,v+2,v,v+2,v+3);v+=4;acc+=l;}
if(v){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(nr,3));g.setIndex(idx);trackG.add(new THREE.Mesh(g,MAT.fence));}
const posts=[];for(let k=0;k<NP;k+=3)if(Wa[k]){const a=W(k,off,0);posts.push([a.x,2.5,a.z,0,0,0,0.06,2.6,0.06]);}inst(GEO.cyl,MAT.post,posts,false);}
const poles=[],arms=[],heads=[],pools=[];
for(let k=8;k<NP;k+=22){const s=(k/22|0)%2?1:-1,a=W(k,s*(HW+15),0);if(rd(a.x,a.z)<HW+13.5||SL.some(q=>Math.hypot(q[0]-a.x,q[1]-a.z)<q[2]))continue;
const h=W(k,s*(HW+11.5),0),ry=Math.atan2(TA[k].x,TA[k].z);poles.push([a.x,4.5,a.z,0,0,0,0.12,9,0.12]);arms.push([(a.x+h.x)/2,9,(a.z+h.z)/2,0,ry+Math.PI/2,0,3.5,0.12,0.12]);heads.push([h.x,8.85,h.z,0,ry,0,0.5,0.18,1]);
GLOWS.push([h.x,8.6,h.z,1]);const p2=W(k,s*(HW+6),0);pools.push([p2.x,0.125,p2.z,0,r()*6,0,13,1,13]);}
inst(GEO.cyl,MAT.post,poles,true);inst(GEO.box,MAT.post,arms,false);inst(GEO.lhead,MAT.post,heads.map(q=>[q[0],q[1]+0.05,q[2],0,q[4]+Math.PI/2,0,1,1,1]),false);inst(GEO.disc,MAT.lampW,heads.map(q=>[q[0],q[1]+0.05,q[2],0,q[4]+Math.PI/2,0,1,1,1]),false);inst(GEO.box,MAT.post,poles.map(q=>[q[0],0.35,q[2],0,0,0,0.42,0.7,0.42]),true);LPOOL=inst(GEO.plane,LPOOLM,pools,false);if(LPOOL)LPOOL.visible=false;
const th=TR[ti].th,wallC=[],roofC=[],walls=[],roofs=[],tents=[],tentC=[],camp=[],cwin=[],pcar=[],pcarC=[];
const okp=(x,z,m)=>{if(z>seaZ-40||inWat(x,z,m))return false;for(const q of SL)if(Math.hypot(q[0]-x,q[1]-z)<q[2]+m)return false;return!obEach(x,z,o=>Math.hypot(o[0]-x,o[1]-z)<o[2]+m);};
for(let n=0;n<70;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,dl=HW+60+r()*140,a=W(k,s*dl,(r()-0.5)*20),dd=rd(a.x,a.z);if(dd<HW+50||!okp(a.x,a.z,8))continue;const b=H(a.x,a.z,dd);if(b>40)continue;
const ry=r()*6.28,wx=5+r()*4,wz=6+r()*5,wy=3.2+r()*2.5;walls.push([a.x,b+wy/2-0.3,a.z,0,ry,0,wx,wy,wz]);wallC.push(th===1?hsl(0.09,0.35,0.7+r()*0.1):hsl(0.1+r()*0.05,0.15+r()*0.2,0.72+r()*0.15));
roofs.push([a.x,b+wy-0.3+wx*0.28,a.z,0,ry,0,wx*0.6,wx*0.62,wz*1.08]);SL.push([a.x,a.z,Math.max(wx,wz)*0.75]);roofC.push(th===2?new THREE.Color(0xf4f7fa):th===1?hsl(0.07,0.4,0.55):hsl(0.02+r()*0.04,0.45,0.3+r()*0.12));addOb(a.x,a.z,Math.max(wx,wz)*0.6);}
for(let n=0;n<60;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,a=W(k,s*(HW+30+r()*30),(r()-0.5)*8),dd=rd(a.x,a.z);if(dd<HW+26||!okp(a.x,a.z,4))continue;const b=H(a.x,a.z,dd),ry=Math.atan2(TA[k].x,TA[k].z)+(r()-0.5)*0.4,q=r();
if(q<0.4){const sz=2.5+r()*2;tents.push([a.x,b,a.z,0,ry,0,sz,2.6+r(),sz]);tentC.push(r()<0.5?new THREE.Color(0xf4f4f4):PAL[Math.floor(r()*PAL.length)]);}
else if(q<0.65){camp.push([a.x,b+1.5,a.z,0,ry,0,2.4,2.7,6.2]);cwin.push([a.x,b+2,a.z,0,ry,0,2.45,0.7,5]);}
else{for(let j=0;j<3;j++){const o=(j-1)*3;pcar.push([a.x+Math.cos(ry)*o,b+0.65,a.z-Math.sin(ry)*o,0,ry,0,1.9,1.1,4.3]);pcarC.push(hsl(r(),0.3+r()*0.4,0.2+r()*0.5));}}addOb(a.x,a.z,3.5);SL.push([a.x,a.z,5]);}
inst(GEO.box,MAT.instS,walls,true,wallC);inst(GEO.prism,MAT.instF,roofs,true,roofC);inst(GEO.tent,MAT.instF,tents,true,tentC,null,600);inst(GEO.box,MAT.white,camp,true,null,null,600);inst(GEO.box,MAT.glassB,cwin,false,null,null,600);inst(GEO.box,TM(S(0xffffff,0.4,0.35)),pcar,true,pcarC,null,600);
if(GLOWS.length){GLOWO=bboard(GLOWS.map(q=>{const z=q[3]>1?9:4.5;return[q[0],q[1]-0.2,q[2],z,z,1];}),bbMat(glowT,0xfff1d2,0xfff1d2,0.85,true));GLOWO.visible=false;GLOWO.renderOrder=3;trackG.add(GLOWO);}}
