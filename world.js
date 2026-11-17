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
function H(x,z,dd){const n=sst(HW+34,HW+170,dd),dc=Math.hypot(x-CX,z-CZ),f=sst(RAD+180,RAD+700,dc);
let h=n*fbm(x*0.006+TS,z*0.006)*TP.hill+f*Math.pow(fbm(x*0.0022+TS+7,z*0.0022+3),1.7)*TP.mtn;
if(seaZ<1e8){const s=sst(seaZ-70,seaZ-15,z);h=h*(1-s)-s*4;}return h;}
function rdF(x,z){if(x<MB.x0-260||x>MB.x1+260||z<MB.z0-260||z>MB.z1+260)return 1e4;let b=1e9;for(let k=0;k<NP;k+=4){const d=(P[k].x-x)**2+(P[k].z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function buildTerrain(t,th){TP=TPR[t.th];TS=t.th*13.7;const N=cfg.q?200:130,SZ=3600,g=new THREE.PlaneGeometry(SZ,SZ,N,N);g.rotateX(-Math.PI/2);g.translate(CX,0,CZ);
const p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color(),c0=new THREE.Color(th.g[0]),c1=new THREE.Color(th.g[1]),c2=new THREE.Color(th.g[2]),rk=new THREE.Color(th.rock),sn=new THREE.Color(0xf4f7fa),hs=new Float32Array(p.count);
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=H(x,z,rdF(x,z));p.setY(i,h);hs[i]=h;}
g.computeVertexNormals();const nr=g.attributes.normal;
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),h=hs[i],v=fbm(x*0.02,z*0.02);c.copy(c1).lerp(v>0.5?c2:c0,Math.min(1,Math.abs(v-0.5)*1.6));
const sl=1-nr.getY(i);c.lerp(rk,Math.min(1,sst(TP.rock,TP.rock+80,h)+sst(0.18,0.4,sl)));c.lerp(sn,sst(TP.snow,TP.snow+50,h)*(1-sst(0.35,0.6,sl)*0.6));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
g.setAttribute('color',new THREE.BufferAttribute(col,3));
const dt=ctex(512,512,(x,w,h)=>{x.fillStyle='#d6d6d6';x.fillRect(0,0,w,h);blobs(x,w,h,['#ffffff','#b8b8b8'],70,10,46,0.08,0.2);
if(t.th===0||t.th===3){for(let i=0;i<30000;i++){const px=Math.random()*w,py=Math.random()*h,l=2+Math.random()*6,v=140+Math.random()*115|0;x.strokeStyle='rgb('+v+','+v+','+v+')';x.lineWidth=0.7+Math.random()*0.8;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-0.5)*3,py-l);x.stroke();}}
else if(t.th===1){for(let y=0;y<h;y+=2){x.strokeStyle='rgba('+(Math.random()<0.5?'255,255,255':'0,0,0')+','+(0.05+Math.random()*0.06)+')';x.lineWidth=1.5;x.beginPath();for(let xx=0;xx<=w;xx+=8)x.lineTo(xx,y+Math.sin(xx*0.05+y*0.13)*3);x.stroke();}}
else{blobs(x,w,h,['#ffffff','#c7d0dc'],120,6,28,0.1,0.25);for(let i=0;i<1500;i++){x.fillStyle='rgba(255,255,255,0.9)';x.fillRect(Math.random()*w,Math.random()*h,1,1);}}
noise(x,w,h,22000,0.1,1.5);},true);dt.repeat.set(SZ/22,SZ/22);
const m=new THREE.Mesh(g,TM(new THREE.MeshLambertMaterial({vertexColors:true,map:dt})));m.receiveShadow=true;trackG.add(m);}

let builtT=-1,P=[],TA=[],CU=[],CUR=[],INS=[],RL=[],VP=[],NP=0,MB,CX=0,CZ=0,RAD=200,TH0=TH[0],seaZ=1e9;
let GLOWS=[],GLOWO=null,LPOOL=null,PUD=[],PUDI=new Map(),PUDM=null,ROADM=null,WATER=null,trackG=new THREE.Group(),OB=new Map(),SL=[],CROWD=[],FLAGS=[],GL=[],CLOUD=null,SNOW=null;
const okey=(x,z)=>Math.floor(x/8)+','+Math.floor(z/8);
function addOb(x,z,r){const k=okey(x,z);let a=OB.get(k);if(!a)OB.set(k,a=[]);a.push([x,z,r]);}
function obEach(x,z,f){const cx=Math.floor(x/8),cz=Math.floor(z/8);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=OB.get((cx+i)+','+(cz+j));if(a)for(const o of a)if(f(o))return true;}return false;}
function rd(x,z){let b=1e9;for(let k=0;k<NP;k+=2){const d=(P[k].x-x)**2+(P[k].z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function W(k,lx,lz){const p=P[k],t=TA[k];return{x:p.x+t.z*lx+t.x*lz,z:p.z-t.x*lx+t.z*lz};}
function R(off,y,mat,o){o=o||{};const pos=[],uv=[],cl=[],nr=[],idx=[];let v=0,acc=0;const uu=o.uu||1;
for(let k=0;k<NP;k++){const k2=(k+1)%NP,sg=Math.hypot(P[k2].x-P[k].x,P[k2].z-P[k].z),A=off(k);let B=off(k2);
if(A&&(!B||Math.sign(B[0]+B[1])!==Math.sign(A[0]+A[1])))B=A;
if(A){const c=o.str?(Math.floor(k/2)%2?[0.84,0.1,0.08]:[0.97,0.97,0.97]):null;
for(const q of[[k,A[0],0,acc],[k,A[1],1,acc],[k2,B[0],0,acc+sg],[k2,B[1],1,acc+sg]]){const p=P[q[0]],t=TA[q[0]];pos.push(p.x+t.z*q[1],y,p.z-t.x*q[1]);uv.push(q[2]*uu,q[3]/(o.vs||16));nr.push(0,1,0);if(c)cl.push(c[0],c[1],c[2]);}
idx.push(v,v+2,v+1,v+1,v+2,v+3);v+=4;}acc+=sg;}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nr,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
if(o.str)g.setAttribute('color',new THREE.Float32BufferAttribute(cl,3));g.setIndex(idx);const m=new THREE.Mesh(g,mat);m.receiveShadow=true;trackG.add(m);return m;}
function inst(geo,mat,list,sh,cols,par){if(!list.length)return null;const m=new THREE.InstancedMesh(geo,mat,list.length);
list.forEach((q,i)=>{DO.position.set(q[0],q[1],q[2]);DO.rotation.set(q[3]||0,q[4]||0,q[5]||0);DO.scale.set(q[6]||1,q[7]||q[6]||1,q[8]||q[6]||1);DO.updateMatrix();m.setMatrixAt(i,DO.matrix);if(cols)m.setColorAt(i,cols[i]);});
if(cols)m.instanceColor.needsUpdate=true;m.castShadow=!!sh;m.receiveShadow=!!sh;(par||trackG).add(m);return m;}
function LB(g,mat,sx,sy,sz,x,y,z,ns){const m=new THREE.Mesh(GEO.box,mat);m.scale.set(sx,sy,sz);m.position.set(x,y,z);if(!ns){m.castShadow=true;m.receiveShadow=true;}g.add(m);return m;}
function LG(k){const g=new THREE.Group();g.position.set(P[k].x,0,P[k].z);g.rotation.y=Math.atan2(TA[k].x,TA[k].z);trackG.add(g);return g;}
function SIDE(k,s){const g=LG(k),sg=new THREE.Group();sg.rotation.y=s>0?0:Math.PI;g.add(sg);return sg;}
function clear(k,s,x0,x1,z0,z1){for(let lx=x0;lx<=x1;lx+=3)for(let lz=z0;lz<=z1;lz+=3){const w=W(k,s*lx,lz);if(rd(w.x,w.z)<HW+13)return false;for(const q of SL)if(Math.hypot(q[0]-w.x,q[1]-w.z)<q[2])return false;}return true;}
function reserve(k,s,x0,x1,z0,z1){const w=W(k,s*(x0+x1)/2,(z0+z1)/2);SL.push([w.x,w.z,Math.hypot(x1-x0,z1-z0)/2+3]);}
function gridIdx(k){return(NP*2-7-Math.floor(k/2)*8-(k%2?4:0))%NP;}
function speedProfile(d){const v=new Float32Array(NP);for(let k=0;k<NP;k++){const r=18/Math.max(0.002,CU[k])*1.15;v[k]=Math.min(d.max,Math.sqrt(d.grip*(WX?WX.road:1)*(1+(d.df||0)*0.6)*r));}
for(let it=0;it<2;it++)for(let k=NP-1;k>=0;k--){const n=v[(k+1)%NP];v[k]=Math.min(v[k],Math.sqrt(n*n+2*d.brk*0.8*1.5));}return v;}

const HCOL=[0x1d1712,0x2e2118,0x4a3322,0x6b4a2b,0xa87b44,0xd8b57a,0x8a8a8a,0x7a2e1a].map(c=>new THREE.Color(c)),PANT=[0x2b3550,0x333333,0x6b5a45,0x1e2a3a,0x5a6a7a,0x8a7a60,0x24262b].map(c=>new THREE.Color(c));
function addCrowd(par,list,standing){if(!list.length)return;const Qd=cfg.q?1:0.6,L2=list.filter(()=>Math.random()<Qd),rc=a=>a[Math.floor(Math.random()*a.length)];
const up=[],dn=[],upC=[],dnC=[],skU=[],skD=[],hr=[],hrC=[],hl=[],hlC=[],cp=[],cpC=[],lg=[],lgC=[];
for(const q of L2){const hs_=0.9+Math.random()*0.18,p=[q[0],q[1],q[2],0,q[3]||0,0,hs_,hs_,hs_],sh=Math.random()<0.15?rc(PAL):hsl(Math.random(),0.35+Math.random()*0.45,0.25+Math.random()*0.45),sk=rc(SKIN);
if(Math.random()<0.33){up.push(p);upC.push(sh);skU.push(sk);}else{dn.push(p);dnC.push(sh);skD.push(sk);}
if(Math.random()<0.2){cp.push(p);cpC.push(rc(PAL));}else if(Math.random()<0.38){hl.push(p);hlC.push(rc(HCOL));}else{hr.push(p);hrC.push(rc(HCOL));}lg.push(p);lgC.push(rc(PANT));}inst(PG.hairL,CMAT,hl,false,hlC,par);
inst(PG.shU,CMAT,up,false,upC,par);inst(PG.shD,CMAT,dn,false,dnC,par);inst(PG.skU,CMAT,up,false,skU,par);inst(PG.skD,CMAT,dn,false,skD,par);
inst(PG.hair,CMAT,hr,false,hrC,par);inst(PG.cap,CMAT,cp,false,cpC,par);inst(standing?PG.legs:PG.sleg,CMAT,lg,false,lgC,par);}
function billboard(k,s,ad){const g=SIDE(k,s),X=HW+22;for(const z of[-4.5,4.5])LB(g,MAT.post,0.35,7.5,0.35,X+0.3,3.75,z);
const m=new THREE.Mesh(GEO.box,[MAT.post,BILLM[ad],MAT.post,MAT.post,MAT.post,MAT.post]);m.scale.set(0.3,3.6,12);m.position.set(X,6.2,0);m.castShadow=true;g.add(m);
LB(g,MAT.white,0.4,0.18,12.4,X-0.05,8.1,0);LB(g,MAT.white,0.4,0.18,12.4,X-0.05,4.3,0);for(const z of[-3,0,3])LB(g,MAT.post,0.5,0.14,0.7,X-0.9,8.35,z,1);}
function puddles(){const r=Math.random,list=[];PUD=[];PUDI=new Map();
for(let n=0;n<Math.round(NP/9);n++){const k=Math.floor(r()*NP),lat=(r()<0.6?(r()<0.5?-1:1)*(HW-2-r()*3):(r()-0.5)*HW),p=P[k],t=TA[k],x=p.x+t.z*lat,z=p.z-t.x*lat,rad=1.2+r()*2.2;
list.push([x,0.118,z,0,Math.atan2(t.x,t.z)+(r()-0.5)*0.6,0,rad*(1.3+r()*0.8),1,rad]);PUD.push([x,z,rad*1.1]);const q=PUD.length-1;for(let o=-3;o<=3;o++){const kk=(k+o+NP)%NP;let a=PUDI.get(kk);if(!a)PUDI.set(kk,a=[]);a.push(q);}}
PUDM=inst(GEO.plane,PUDMAT,list,false);if(PUDM)PUDM.visible=false;}
function stand(k,s,len){const g=SIDE(k,s),X0=HW+15.5,fan=[],seatC=[0x1b6ee8,0xd7263d,0xf2b705][Math.floor(Math.random()*3)];
for(let i=0;i<7;i++){const x=X0+i*2.1,y=(i+1)*0.8;LB(g,MAT.conc,2.1,y,len,x,y/2,0);LB(g,TM(L(seatC)),0.5,0.36,len,x+0.55,y+0.18,0,1);
for(let z=-len/2+0.5;z<=len/2-0.5;z+=0.62)if(Math.random()<0.93)fan.push([x+0.35+(Math.random()-0.5)*0.15,y+0.18,z+(Math.random()-0.5)*0.12,(Math.random()-0.5)*0.4-Math.PI/2]);}
LB(g,MAT.post,0.4,10,len,X0+15.2,5,0);const rf=LB(g,MAT.roof,17,0.35,len+2,X0+7,10.4,0);rf.rotation.z=0.06;
for(const z of[-len/2,-len/6,len/6,len/2])LB(g,MAT.post,0.35,10.2,0.35,X0+14.8,5.1,z);
LB(g,MAT.red,0.25,1,len,X0-1.6,0.5,0);for(let z=-len/2;z<=len/2;z+=len/4)LB(g,ADS[Math.floor(Math.random()*6)],0.06,0.8,len/4-0.3,X0-1.75,0.55,z,1);
addCrowd(g,fan,false);
for(const z of[-len/2-2.5,len/2+2.5]){LB(g,MAT.post,0.6,24,0.6,X0+13,12,z);LB(g,MAT.post,0.5,2.0,3.6,X0+12.6,23.5,z,1);{const fp=new THREE.Mesh(GEO.box,[MAT.post,MAT.flood,MAT.post,MAT.post,MAT.post,MAT.post]);fp.scale.set(0.1,1.8,3.4);fp.position.set(X0+12.3,23.5,z);fp.rotation.z=-0.25;g.add(fp);}g.parent.updateMatrixWorld(true);const v=new THREE.Vector3(X0+12,23.5,z).applyMatrix4(g.matrixWorld);GLOWS.push([v.x,v.y,v.z,2.2]);}}
function zone(k,s,len){const g=SIDE(k,s),fan=[];
for(let r=0;r<5;r++){const x=HW+15.2+r*1.05;for(let z=-len/2;z<=len/2;z+=0.7)if(Math.random()<0.78-r*0.08)fan.push([x+(Math.random()-0.5)*0.4,0.82+r*0.18,z+(Math.random()-0.5)*0.3,-Math.PI/2+(Math.random()-0.5)*0.6]);}
for(let r=1;r<5;r++)LB(g,MAT.conc,1.05,r*0.18+0.02,len+1,HW+15.2+r*1.05,(r*0.18+0.02)/2,0,1);
for(let z=-len/2-0.5;z<=len/2+0.5;z+=3){LB(g,MAT.post,0.12,2.6,0.12,HW+14.2,1.3,z);}
for(const y of[1.1,2.5])LB(g,MAT.white,0.08,0.08,len+1,HW+14.2,y,0,1);
addCrowd(g,fan,true);}
function pits(k,s,len){const g=SIDE(k,s),X=HW+22;
const b=new THREE.Mesh(GEO.box,[MAT.conc2,MAT.gar,MAT.roof,MAT.conc2,MAT.conc2,MAT.conc2]);b.scale.set(12,6,len);b.position.set(X,3,0);b.castShadow=b.receiveShadow=true;g.add(b);
const up=new THREE.Mesh(GEO.box,[MAT.glassB,MAT.glassB,MAT.roof,MAT.conc2,MAT.conc2,MAT.conc2]);up.scale.set(10,2.8,len);up.position.set(X+1,7.4,0);up.castShadow=true;g.add(up);
LB(g,MAT.roof,15,0.4,len+3,X-0.5,9,0);}
function bridge(k){const g=LG(k),X=HW+15;for(const s of[-1,1]){LB(g,MAT.post,1.2,9.5,1.2,s*X,4.75,0);const w=W(k,s*X,0);addOb(w.x,w.z,1);}
const m=new THREE.Mesh(GEO.box,[MAT.post,MAT.post,MAT.post,MAT.post,MAT.big,MAT.big]);m.scale.set(2*X+1.2,2.2,1.1);m.position.y=9.3;m.castShadow=true;g.add(m);}

function buildTrack(ti){
scene.remove(trackG);trackG.traverse(o=>{if(o.geometry&&!o.geometry.userData.k)o.geometry.dispose();const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];ms.forEach(m=>{if(m.userData.tmp){if(m.map)m.map.dispose();m.dispose();}});});
WATER=null;GLOWS=[];GLOWO=null;LPOOL=null;trackG=new THREE.Group();scene.add(trackG);OB=new Map();SL=[];CROWD=[];FLAGS=[];GL=[];SNOW=null;CLOUD=null;
const t=TR[ti],th=TH[t.th];TH0=th;builtT=ti;
setSky(th.sky[0],th.sky[1],th.sky[2]);makeEnv();scene.background=new THREE.Color(th.sky[1]);scene.fog=new THREE.Fog(th.sky[1],350,1750);
sun.color.setHex(th.sun);hemi.color.setHex(th.sky[1]);hemi.groundColor.setHex(th.hg);
const curve=new THREE.CatmullRomCurve3(t.p.map(q=>new THREE.Vector3(q[0]*t.s,0,q[1]*t.s)),true,'centripetal');
NP=Math.round(curve.getLength()/1.5);const sp=curve.getSpacedPoints(NP);sp.pop();P=sp.map(v=>({x:v.x,z:v.z}));
TA=P.map((p,k)=>{const a=P[(k+1)%NP],b=P[(k-1+NP)%NP],dx=a.x-b.x,dz=a.z-b.z,l=Math.hypot(dx,dz);return{x:dx/l,z:dz/l};});
CU=P.map((p,k)=>ang(TA[(k-6+NP)%NP],TA[(k+6)%NP]));
CUR=P.map((p,k)=>{for(let o=-5;o<=5;o++)if(CU[(k+o+NP)%NP]>0.16)return true;return false;});
MB={x0:Math.min(...P.map(p=>p.x)),x1:Math.max(...P.map(p=>p.x)),z0:Math.min(...P.map(p=>p.z)),z1:Math.max(...P.map(p=>p.z))};
CX=(MB.x0+MB.x1)/2;CZ=(MB.z0+MB.z1)/2;RAD=Math.max(MB.x1-MB.x0,MB.z1-MB.z0)*0.6;seaZ=t.th===3?MB.z1+110:1e9;
INS=P.map((p,k)=>{const f=P[(k+10)%NP],b=P[(k-10+NP)%NP],mx_=(f.x+b.x)/2-p.x,mz=(f.z+b.z)/2-p.z;return Math.sign(mx_*TA[k].z-mz*TA[k].x)||1;});
let raw=new Float32Array(NP);const iv=j=>{j=(j+NP*2)%NP;return INS[j]*Math.min(1,CU[j]*2.5);};
for(let k=0;k<NP;k++)raw[k]=iv(k)-0.45*(iv(k+24)+iv(k-24));
for(let ps=0;ps<4;ps++){const o=new Float32Array(NP);for(let k=0;k<NP;k++){let s=0;for(let j=-8;j<=8;j++)s+=raw[(k+j+NP)%NP];o[k]=s/17;}raw=o;}
RL=Array.from(raw,v=>Math.max(-1,Math.min(1,v*1.6))*(HW-2.6));VP=CARS.map(speedProfile);
buildTerrain(t,th);
const vT=ctex(256,256,(x,w,h)=>{if(th.verge==='mow'){x.fillStyle=th.ru[0];x.fillRect(0,0,w,128);x.fillStyle=th.ru[1];x.fillRect(0,128,w,128);for(let i=0;i<9000;i++){const px=Math.random()*w,py=Math.random()*h,l=1.5+Math.random()*4,v=Math.random()<0.5;x.strokeStyle=v?'rgba(255,255,220,'+(0.06+Math.random()*0.12)+')':'rgba(0,30,0,'+(0.06+Math.random()*0.14)+')';x.lineWidth=0.8+Math.random()*0.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-0.5)*2,py-l);x.stroke();}}
else{x.fillStyle=th.ru[0];x.fillRect(0,0,w,h);blobs(x,w,h,[th.ru[1]],18,8,30,0.2,0.4);noise(x,w,h,9000,0.12,2);}},true);
R(()=>[-HW-12.5,HW+12.5],0.04,TM(L(0xffffff,{map:vT})),{vs:20,uu:4});
const gT=ctex(256,256,(x,w,h)=>{x.fillStyle=th.grav;x.fillRect(0,0,w,h);const b=new THREE.Color(th.grav);for(let i=0;i<4200;i++){const px=Math.random()*w,py=Math.random()*h,r=1.2+Math.random()*3.2,c=b.clone().offsetHSL((Math.random()-0.5)*0.05,(Math.random()-0.5)*0.15,(Math.random()-0.5)*0.28);
x.fillStyle='rgba(0,0,0,0.35)';x.beginPath();x.ellipse(px+0.8,py+0.9,r,r*0.75,0,0,7);x.fill();x.fillStyle='#'+c.getHexString();x.beginPath();x.ellipse(px,py,r,r*0.75,Math.random()*3,0,7);x.fill();x.fillStyle='rgba(255,255,255,0.25)';x.beginPath();x.ellipse(px-r*0.3,py-r*0.3,r*0.4,r*0.3,0,0,7);x.fill();}},true);
R(k=>{if(CU[k]<0.12)return null;return -INS[k]>0?[HW+2.3,HW+10.5]:[-HW-10.5,-HW-2.3];},0.07,TM(L(0xffffff,{map:gT})),{vs:4,uu:2});
const rT=ctex(256,512,(x,w,h)=>{x.fillStyle=th.road;x.fillRect(0,0,w,h);noise(x,w,h,30000,0.12,2);for(let i=0;i<7;i++){x.fillStyle='rgba(0,0,0,0.07)';x.fillRect(20+Math.random()*200,Math.random()*h,30+Math.random()*40,20+Math.random()*80);}
x.fillStyle='rgba(0,0,0,0.12)';x.fillRect(60,0,30,h);x.fillRect(166,0,30,h);x.fillStyle='#f0f0f0';x.fillRect(6,0,7,h);x.fillRect(w-13,0,7,h);},true);
ROADM=TM(S(0xffffff,0,0.92,{map:rT}));R(()=>[-HW,HW],0.1,ROADM,{vs:30});
const km=TM(new THREE.MeshLambertMaterial({vertexColors:true}));R(k=>CUR[k]?[HW,HW+2.3]:null,0.13,km,{str:1});R(k=>CUR[k]?[-HW-2.3,-HW]:null,0.13,km,{str:1});
const SG=LG(0);const ln=new THREE.Mesh(GEO.plane,MAT.chk);ln.scale.set(HW*2,1,2.6);ln.position.y=0.15;ln.receiveShadow=true;SG.add(ln);
for(const s of[-1,1]){LB(SG,MAT.post,0.8,8.2,0.8,s*(HW+3),4.1,0);const w=W(0,s*(HW+3),0);addOb(w.x,w.z,0.8);}
const bm=new THREE.Mesh(GEO.box,[MAT.post,MAT.post,MAT.post,MAT.post,MAT.ban,MAT.ban]);bm.scale.set(HW*2+6.8,1.7,0.7);bm.position.y=7.9;bm.castShadow=true;SG.add(bm);
for(let i=0;i<5;i++){const m=new THREE.Mesh(GEO.ball,TM(new THREE.MeshBasicMaterial({color:0x2a2d35})));m.scale.setScalar(0.34);m.position.set(-2.8+i*1.4,6.7,-0.42);SG.add(m);GL.push(m.material);}
for(let k=0;k<8;k++){const side=k%2?-1:1,g=LG(gridIdx(k));LB(g,MAT.white,3.6,0.02,0.3,side*4.5,0.12,2.6,1);LB(g,MAT.white,0.3,0.02,1.6,side*4.5-1.65,0.12,1.95,1);LB(g,MAT.white,0.3,0.02,1.6,side*4.5+1.65,0.12,1.95,1);}
const wl=[],wc=[],WALL=[new Uint8Array(NP),new Uint8Array(NP)],CW=new THREE.Color(0xf2f2f2),CR=new THREE.Color(0xd33b2f),CC=new THREE.Color(0xc9cdd2);
for(let k=0;k<NP;k+=2)for(const s of[-1,1]){const w=W(k,s*(HW+12.8),0);if(rd(w.x,w.z)<HW+11.8)continue;wl.push([w.x,0.6,w.z,0,Math.atan2(TA[k].x,TA[k].z),0,0.9,1.2,3.2]);wc.push(CUR[k]?((k>>1)%2?CR:CW):CC);WALL[s>0?0:1][k]=1;addOb(w.x,w.z,1.5);}
inst(GEO.box,MAT.inst,wl,true,wc);
const ti_=[],tc=[],TC=[new THREE.Color(0x1b1b1b),new THREE.Color(0xf2f2f2),new THREE.Color(0xd33b2f)];
for(let k=0;k<NP;k+=1){if(CU[k]<0.2)continue;const s=-INS[k];if(!WALL[s>0?0:1][k])continue;const w=W(k,s*(HW+11.3),0),c=TC[(k>>1)%3];ti_.push([w.x,0.17,w.z],[w.x,0.5,w.z],[w.x,0.83,w.z]);tc.push(c,c,c);}
inst(GEO.tire,MAT.inst,ti_,true,tc);
for(let k=10;k<NP;k+=10){if(CUR[k])continue;for(const s of[-1,1]){if(!WALL[s>0?0:1][k])continue;const w=W(k,s*(HW+12.3),0),b=new THREE.Mesh(GEO.box,[MAT.post,ADS[(k/10+(s>0?0:3))%6|0],MAT.post,MAT.post,MAT.post,MAT.post]);
b.scale.set(0.08,0.9,5.8);b.position.set(w.x,0.62,w.z);b.rotation.y=Math.atan2(TA[k].x,TA[k].z)+(s>0?0:Math.PI);trackG.add(b);}}
let ss=0;for(const s of[1,-1])if(clear(0,s,HW+14,HW+30,-22,22)){stand(0,s,40);reserve(0,s,HW+14,HW+30,-22,22);ss=s;break;}
if(ss&&clear(0,-ss,HW+14,HW+30,-38,38)){pits(0,-ss,70);reserve(0,-ss,HW+14,HW+30,-38,38);}
const cand=[...Array(NP).keys()].filter(k=>CU[k]>0.25&&Math.min(k,NP-k)>45).sort((a,b)=>CU[b]-CU[a]);const used=[];
for(const k of cand){if(used.length>=2)break;if(used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<NP/5))continue;const s=-INS[k];if(clear(k,s,HW+14,HW+30,-16,16)){stand(k,s,30);reserve(k,s,HW+14,HW+30,-16,16);used.push(k);}}
let bs=-1,bl=0,cs=-1;for(let k=0;k<NP*2;k++){const kk=k%NP;if(!CUR[kk]){if(cs<0)cs=k;const l=k-cs;if(l>bl&&l<NP){const mid=Math.floor((cs+k)/2)%NP;if(Math.min(mid,NP-mid)>50){bl=l;bs=mid;}}}else cs=-1;}
if(bs>=0&&clear(bs,1,HW+13.5,HW+16,-2,2)&&clear(bs,-1,HW+13.5,HW+16,-2,2)){bridge(bs);reserve(bs,1,0,1,-2,2);}
let zc=0;for(const k of cand){if(zc>=6)break;if(used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<NP/9))continue;const s=-INS[k];if(clear(k,s,HW+14,HW+21,-17,17)){zone(k,s,30);reserve(k,s,HW+14,HW+21,-17,17);used.push(k);zc++;}}
for(let k=30;k<NP-30;k+=20){if(CUR[k]||used.some(u=>Math.min(Math.abs(u-k),NP-Math.abs(u-k))<45))continue;for(const s of[1,-1])if(clear(k,s,HW+14,HW+32,-16,16)){stand(k,s,30);reserve(k,s,HW+14,HW+32,-16,16);used.push(k);break;}if(used.length>9)break;}
for(let k=NP/10|0;k<NP;k+=NP/7|0){const s=-INS[k];if(clear(k,s,HW+15,HW+18,-2,2)){const g=SIDE(k,s);LB(g,MAT.orange,1.8,2.4,1.8,HW+16.5,1.2,0);LB(g,MAT.roof,2.3,0.2,2.3,HW+16.5,2.5,0);reserve(k,s,HW+15,HW+18,-2,2);}}
{let bc=0;for(let k=Math.floor(NP*0.07);k<NP&&bc<8;k+=Math.floor(NP/11)){if(CUR[k])continue;const s=-INS[k]||1;for(const ss of[s,-s])if(clear(k,ss,HW+20,HW+24,-7,7)){billboard(k,ss,bc%6);reserve(k,ss,HW+20,HW+24,-7,7);bc++;break;}}}
trackside(WALL,ti);
puddles();
const fm=[MAT.chkD,TM(L(0xd7263d,{side:THREE.DoubleSide})),TM(L(0x1b6ee8,{side:THREE.DoubleSide})),TM(L(0xf2b705,{side:THREE.DoubleSide}))];
for(const s of[-1,1])for(const lz of[-26,-32,26,32]){const w=W(0,s*(HW+14.2),lz);if(rd(w.x,w.z)<HW+13)continue;const g=new THREE.Group();g.position.set(w.x,0,w.z);
const po=new THREE.Mesh(GEO.pole,MAT.white);po.scale.y=8;g.add(po);const fl=new THREE.Mesh(GEO.flag,fm[(FLAGS.length)%4]);fl.position.y=7.2;g.add(fl);trackG.add(g);FLAGS.push({m:fl,p:Math.random()*6,b:Math.atan2(TA[0].x,TA[0].z)+Math.PI/2});}
vegetation(ti,t,th,WALL);applyWeather(t.th===2?'snow':'clear');
const ld=$('load');ld.style.opacity=0;setTimeout(()=>{if(ld.style.opacity==='0')ld.style.display='none';},420);}

const waterN=(()=>{const N=128,h=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=0;for(let o=1;o<=4;o++){const f=o*2*Math.PI/N;v+=Math.sin(x*f*1.0+y*f*0.6+o)*Math.cos(y*f*1.3-x*f*0.4+o*2)/o;}h.push(v);}
return ctex(N,N,(c)=>{const id=c.createImageData(N,N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,dx=h[y*N+(x+1)%N]-h[y*N+(x-1+N)%N],dy=h[((y+1)%N)*N+x]-h[((y-1+N)%N)*N+x];const nx=-dx*2,ny=-dy*2,nz=1,l=Math.hypot(nx,ny,nz);id.data[i*4]=(nx/l*0.5+0.5)*255;id.data[i*4+1]=(ny/l*0.5+0.5)*255;id.data[i*4+2]=(nz/l*0.5+0.5)*255;id.data[i*4+3]=255;}c.putImageData(id,0,0);},true);})();
waterN.repeat.set(400,200);
function vegetation(ti,t,th,WALL){
let sd=ti*977+13;const r=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};const Q=cfg.q?1:0.55;
const okP=(x,z,m)=>{if(z>seaZ-m)return false;for(const q of SL)if(Math.hypot(q[0]-x,q[1]-z)<q[2])return false;return true;};
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
for(let n=0;n<1500*Q;n++){const x=A[0]+r()*(A[1]-A[0]),z=A[2]+r()*(A[3]-A[2]),dd=rd(x,z);if(dd<HW+17||!okP(x,z,35))continue;const b=H(x,z,dd);if(b>TP.tl)continue;const s=0.75+r()*0.7,q=r();
if(th.p==='forest'){if(q<0.58)decid(x,z,s,b);else if(q<0.8)pine(x,z,s,b,false);else if(q<0.88)birch(x,z,s,b);else bush(x,z,s,b,()=>hsl(0.27+r()*0.05,0.45,0.2+r()*0.08));}
else if(th.p==='desert'){if(dd>150&&r()<0.1){V.dune.push([x,b-2,z,0,r()*6,0,30+r()*30,5+r()*6,20+r()*25]);continue;}if(q<0.22)sag(x,z,s,b);else if(q<0.34)V.cacB.push([x,b+0.4*s,z,0,0,0,0.6*s,0.5*s,0.6*s]);else if(q<0.7)bush(x,z,s*0.8,b,()=>hsl(0.12+r()*0.04,0.28,0.3+r()*0.08));else rock(x,z,s*1.4,b,hsl(0.06,0.35,0.38+r()*0.12));}
else if(th.p==='snow'){if(q<0.82)pine(x,z,s,b,true);else if(q<0.92)rock(x,z,s*1.3,b,hsl(0.6,0.06,0.5+r()*0.15));else bush(x,z,s,b,()=>hsl(0.33,0.12,0.75+r()*0.1));}
else{if(q<0.42)palm(x,z,s,b);else if(q<0.6)decid(x,z,s,b);else bush(x,z,s,b,()=>hsl(0.27+r()*0.05,0.5,0.24+r()*0.08));}
addOb(x,z,0.9*s);}
if(th.p!=='snow')for(let n=0;n<13000*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+13.5+Math.pow(r(),1.6)*100),(r()-0.5)*3),dd=rd(w.x,w.z);if(dd<HW+13.5||!okP(w.x,w.z,25))continue;const sc=0.6+r()*0.9;
V.tuft.push([w.x,H(w.x,w.z,dd)-0.05,w.z,0,r()*6,0,sc,sc*(0.7+r()*0.6),sc]);V.tuftC.push(th.p==='desert'?hsl(0.12+r()*0.03,0.4,0.5+r()*0.12):hsl(0.22+r()*0.06,0.5,0.27+r()*0.13));}
if(th.p==='forest'||th.p==='coast')for(let n=0;n<5000*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,lat=HW+3+r()*8.5;if(CU[k]>0.12&&-INS[k]===s)continue;const w2=W(k,s*lat,(r()-0.5)*3);if(rd(w2.x,w2.z)<HW+2.8)continue;const sc=0.28+r()*0.25;V.tuft.push([w2.x,0.04,w2.z,0,r()*6,0,sc,sc*(0.6+r()*0.5),sc]);V.tuftC.push(hsl(0.24+r()*0.04,0.5,0.24+r()*0.1));}
if(th.p==='forest'||th.p==='coast')for(let n=0;n<1400*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+14+r()*70),0),dd=rd(w.x,w.z);if(dd<HW+14||!okP(w.x,w.z,25))continue;V.fl.push([w.x,H(w.x,w.z,dd)+0.35,w.z,0,0,0,0.13]);V.flC.push(new THREE.Color([0xffe14d,0xffffff,0xb47cff,0xff5d73][Math.floor(r()*4)]));}
for(let n=0;n<240*Q;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,w=W(k,s*(HW+15+r()*40),0),dd=rd(w.x,w.z);if(dd<HW+15||!okP(w.x,w.z,25))continue;const b=H(w.x,w.z,dd);
if(th.p==='desert')rock(w.x,w.z,0.5+r()*0.8,b,hsl(0.06,0.35,0.4+r()*0.12));else if(th.p==='snow')rock(w.x,w.z,0.5+r()*0.8,b,hsl(0.6,0.06,0.55+r()*0.12));else bush(w.x,w.z,0.6+r()*0.5,b,()=>hsl(0.27+r()*0.05,0.5,0.22+r()*0.08));}
if(th.p==='snow')for(let k=0;k<NP;k+=3)for(const s of[-1,1])if(WALL[s>0?0:1][k]){const w=W(k,s*(HW+11.2),0);V.bank.push([w.x,0.1,w.z,0,Math.atan2(TA[k].x,TA[k].z),0,1.6,0.55,2.4]);}
const cs=q=>[q[0],q[1],q[2],q[3],q[4],q[5],q[6]*0.82,q[7]*0.82,q[8]*0.82],cc=q=>[q[0],q[1]+0.15*q[7],q[2],q[3],q[4],q[5],q[6]*1.32,q[7]*1.3,q[8]*1.32],lt=c=>c.clone().lerp(new THREE.Color(0xffffff),0.08);
inst(GEO.trunk,MAT.inst,V.tr,true,V.trC);inst(GEO.blob,MAT.instS,V.can.map(cs),true,V.canC.map(c=>c.clone().multiplyScalar(0.75)));const cc2=q=>[q[0]+0.3*q[6],q[1]+0.35*q[7],q[2]-0.2*q[8],0.3,q[4]+0.9,0.2,q[6]*1.1,q[7]*1.05,q[8]*1.1];inst(CARD,MAT.leaf,V.can.map(cc).concat(V.can.map(cc2),V.bush.map(cc)),true,V.canC.map(lt).concat(V.canC.map(c=>c.clone().lerp(new THREE.Color(0xffffff),0.14)),V.bushC.map(lt)));inst(GEO.cone,MAT.needle,V.cone,true,V.coneC);inst(GEO.cone,MAT.snowF,V.cap,false);
inst(GEO.blob,MAT.instS,V.bush.map(cs),true,V.bushC.map(c=>c.clone().multiplyScalar(0.75)));inst(GEO.rock,MAT.instF,V.rock,true,V.rockC);inst(GEO.cyl,MAT.cac,V.cac,true);inst(GEO.ball,MAT.cac,V.cacB,true);
inst(GEO.cyl,MAT.palmT,V.palm,true);inst(GEO.leaf,MAT.instD,V.leaf,true,V.leafC);inst(GEO.tuft,MAT.tuft,V.tuft,false,V.tuftC);inst(GEO.blob,MAT.inst,V.fl,false,V.flC);
inst(GEO.blob,MAT.snow,V.bank,false);inst(GEO.ball,TM(L(new THREE.Color(th.g[2]).getHex())),V.dune,false);
CLOUD=new THREE.Group();CLOUD.position.set(CX,0,CZ);const cmT=TM(new THREE.SpriteMaterial({map:smokeT,color:0xffffff,transparent:true,opacity:0.85,fog:false,depthWrite:false})),cmB=TM(new THREE.SpriteMaterial({map:smokeT,color:0xb9c1cc,transparent:true,opacity:0.8,fog:false,depthWrite:false}));cmT.userData.base=0xffffff;cmB.userData.base=0xb9c1cc;
for(let n=0;n<26;n++){const g=new THREE.Group(),a=r()*6.28,d=300+r()*850,big=0.7+r()*0.8;g.position.set(Math.sin(a)*d,230+r()*160,Math.cos(a)*d);
for(let j=0;j<16;j++){const top=j<10,m=new THREE.Sprite(top?cmT:cmB),s=(top?50+r()*60:60+r()*50)*big;m.scale.set(s*1.5,s*0.85,1);m.position.set((r()-0.5)*130*big,top?(r()*22):(-10-r()*8),(r()-0.5)*70*big);m.renderOrder=top?-1:-1.1;g.add(m);}CLOUD.add(g);}
trackG.add(CLOUD);
if(t.th===3){const w=new THREE.Mesh(GEO.plane,TM(S(0x1a6d9e,0.35,0.07,{normalMap:waterN,normalScale:new THREE.Vector2(0.85,0.85)})));WATER=w;{const ft=ctex(256,64,(x,w_,h)=>{x.clearRect(0,0,w_,h);for(let i=0;i<900;i++){const px=Math.random()*w_,py=h*0.5+(Math.random()-0.5)*h*0.7*Math.random();x.fillStyle='rgba(255,255,255,'+(0.15+Math.random()*0.5)+')';x.beginPath();x.ellipse(px,py,2+Math.random()*6,1+Math.random()*2,0,0,7);x.fill();}},true);ft.repeat.set(160,1);const fm=new THREE.Mesh(GEO.plane,TM(new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false,opacity:0.7})));fm.scale.set(6000,1,10);fm.position.set(CX,0.1,seaZ-14);trackG.add(fm);}w.scale.set(6000,1,3000);w.position.set(CX,0.08,seaZ+1460);trackG.add(w);
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
inst(GEO.cyl,MAT.post,poles,true);inst(GEO.box,MAT.post,arms,false);inst(GEO.lhead,MAT.post,heads.map(q=>[q[0],q[1]+0.05,q[2],0,q[4],0,1,1,1]),false);inst(GEO.disc,MAT.lens,heads.map(q=>[q[0],q[1]-0.02,q[2],0,q[4],0,1,1,1.5]),false);LPOOL=inst(GEO.plane,LPOOLM,pools,false);if(LPOOL)LPOOL.visible=false;
const th=TR[ti].th,wallC=[],roofC=[],walls=[],roofs=[],tents=[],tentC=[],camp=[],cwin=[],pcar=[],pcarC=[];
const okp=(x,z,m)=>{if(z>seaZ-40)return false;for(const q of SL)if(Math.hypot(q[0]-x,q[1]-z)<q[2]+m)return false;return!obEach(x,z,o=>Math.hypot(o[0]-x,o[1]-z)<o[2]+m);};
for(let n=0;n<70;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,dl=HW+60+r()*140,a=W(k,s*dl,(r()-0.5)*20),dd=rd(a.x,a.z);if(dd<HW+50||!okp(a.x,a.z,8))continue;const b=H(a.x,a.z,dd);if(b>40)continue;
const ry=r()*6.28,wx=5+r()*4,wz=6+r()*5,wy=3.2+r()*2.5;walls.push([a.x,b+wy/2-0.3,a.z,0,ry,0,wx,wy,wz]);wallC.push(th===1?hsl(0.09,0.35,0.7+r()*0.1):hsl(0.1+r()*0.05,0.15+r()*0.2,0.72+r()*0.15));
roofs.push([a.x,b+wy-0.3+wx*0.28,a.z,0,ry,0,wx*0.6,wx*0.62,wz*1.08]);SL.push([a.x,a.z,Math.max(wx,wz)*0.75]);roofC.push(th===2?new THREE.Color(0xf4f7fa):th===1?hsl(0.07,0.4,0.55):hsl(0.02+r()*0.04,0.45,0.3+r()*0.12));addOb(a.x,a.z,Math.max(wx,wz)*0.6);}
for(let n=0;n<60;n++){const k=Math.floor(r()*NP),s=r()<0.5?1:-1,a=W(k,s*(HW+30+r()*30),(r()-0.5)*8),dd=rd(a.x,a.z);if(dd<HW+26||!okp(a.x,a.z,4))continue;const b=H(a.x,a.z,dd),ry=Math.atan2(TA[k].x,TA[k].z)+(r()-0.5)*0.4,q=r();
if(q<0.4){const sz=2.5+r()*2;tents.push([a.x,b,a.z,0,ry,0,sz,2.6+r(),sz]);tentC.push(r()<0.5?new THREE.Color(0xf4f4f4):PAL[Math.floor(r()*PAL.length)]);}
else if(q<0.65){camp.push([a.x,b+1.5,a.z,0,ry,0,2.4,2.7,6.2]);cwin.push([a.x,b+2,a.z,0,ry,0,2.45,0.7,5]);}
else{for(let j=0;j<3;j++){const o=(j-1)*3;pcar.push([a.x+Math.cos(ry)*o,b+0.65,a.z-Math.sin(ry)*o,0,ry,0,1.9,1.1,4.3]);pcarC.push(hsl(r(),0.3+r()*0.4,0.2+r()*0.5));}}addOb(a.x,a.z,3.5);SL.push([a.x,a.z,5]);}
inst(GEO.box,MAT.instS,walls,true,wallC);inst(GEO.prism,MAT.instF,roofs,true,roofC);inst(GEO.tent,MAT.instF,tents,true,tentC);inst(GEO.box,MAT.white,camp,true);inst(GEO.box,MAT.glassB,cwin,false);inst(GEO.box,TM(S(0xffffff,0.4,0.35)),pcar,true,pcarC);
if(GLOWS.length){GLOWO=new THREE.Group();GLOWS.forEach(q=>{const s=new THREE.Sprite(GLOWS_M),z=q[3]>1?9:4.5;s.scale.set(z,z,1);s.position.set(q[0],q[1]-0.2,q[2]);GLOWO.add(s);});GLOWO.visible=false;trackG.add(GLOWO);}}
