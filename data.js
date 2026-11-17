const $=id=>document.getElementById(id);
const ICO={cam:'<path d="M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/>',
max:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',min:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
vol:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',mute:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
pause:'<path d="M8 5v14M16 5v14"/>',wind:'<path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',back:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/>',
left:'<path d="M15 6l-6 6 6 6"/>',right:'<path d="M9 6l6 6-6 6"/>',up:'<path d="M6 15l6-6 6 6"/>',down:'<path d="M6 9l6 6 6-6"/>',
flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',key:'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
arrR:'<path d="M5 12h14M13 6l6 6-6 6"/>',arrL:'<path d="M19 12H5M11 6l-6 6 6 6"/>',check:'<path d="M5 12l5 5L20 7"/>',play:'<path d="M7 4l13 8-13 8z"/>',home:'<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',redo:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',plus:'<path d="M12 5v14M5 12h14"/>',login:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'};
ICO.gear='<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>';ICO.nitro='<path d="M12 2.5c1.2 3.2 5 5.2 5 10a5 5 0 0 1-10 0c0-2.6 1.3-4 2.6-5.2.1 2.3 1.2 3.4 2.4 3.4 0-3.3-1-5.6 0-8.2z"/>';const VERSION='1.1';
const svg=n=>'<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ICO[n]+'</svg>';
document.querySelectorAll('[data-i]').forEach(e=>e.innerHTML=svg(e.dataset.i)+e.innerHTML);
const G=$('g'),cv=$('cv');
const DPR=Math.min(window.devicePixelRatio||1,2);
function hc(c,w,h){c.width=Math.round(w*DPR);c.height=Math.round(h*DPR);const x=c.getContext('2d');x.setTransform(DPR,0,0,DPR,0,0);return x;}
const mx=hc($('mm'),136,136),spx=hc($('sp'),180,180);
const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,logarithmicDepthBuffer:true});
ren.setPixelRatio(DPR);ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
const ANI=Math.min(8,ren.capabilities.getMaxAnisotropy());
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,0.3,2600);
const hemi=new THREE.HemisphereLight(0xffffff,0x556655,0.58);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,1.05);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-0.0003;sun.shadow.normalBias=0.04;scene.add(sun);scene.add(sun.target);
const SUND=new THREE.Vector3(0.45,0.75,0.35).normalize();
let SHE=0;
function shadowAt(x,z,e){const s=sun.shadow.camera;if(SHE!==e){SHE=e;s.left=-e;s.right=e;s.top=e;s.bottom=-e;s.near=1;s.far=900;s.updateProjectionMatrix();}
const tx=2*e/2048;x=Math.round(x/tx)*tx;z=Math.round(z/tx)*tx;sun.target.position.set(x,0,z);sun.position.set(x+SUND.x*400,SUND.y*400,z+SUND.z*400);}
const L=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const S=(c,m,r,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,metalness:m,roughness:r},o||{}));
const K=g=>{g.userData.k=1;return g;};
const TM=m=>{m.userData.tmp=1;return m;};
function ctex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=ANI;if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function noise(x,w,h,n,a,sz){sz=sz||2;for(let i=0;i<n;i++){x.fillStyle=Math.random()<0.5?'rgba(255,255,255,'+Math.random()*a+')':'rgba(0,0,0,'+Math.random()*a+')';const s=1+Math.random()*sz;x.fillRect(Math.random()*w,Math.random()*h,s,s);}}
function blobs(x,w,h,cols,n,r0,r1,a0,a1){for(let i=0;i<n;i++){x.fillStyle=cols[Math.floor(Math.random()*cols.length)];x.globalAlpha=a0+Math.random()*(a1-a0);const cx=Math.random()*w,cy=Math.random()*h,r=r0+Math.random()*(r1-r0);for(const ox of[-w,0,w])for(const oy of[-h,0,h]){x.beginPath();x.arc(cx+ox,cy+oy,r,0,7);x.fill();}}x.globalAlpha=1;}
const hsl=(h,s,l)=>new THREE.Color().setHSL(h,s,l);
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const ang=(a,b)=>Math.acos(Math.max(-1,Math.min(1,a.x*b.x+a.z*b.z)));
const fmt=t=>{const s=t/1000,m=Math.floor(s/60);return m+':'+(s%60).toFixed(1).padStart(4,'0');};
const kmS=u=>(u*0.83/1000).toFixed(1).replace('.',',');

function tuftGeo(){const p=[],uv=[],n=[],ix=[];for(let i=0;i<3;i++){const a=i*Math.PI/3,c=Math.cos(a)*0.6,s=Math.sin(a)*0.6,b=p.length/3;p.push(-c,0,-s,c,0,s,c,1,s,-c,1,-s);uv.push(0,0,1,0,1,1,0,1);n.push(0,1,0,0,1,0,0,1,0,0,1,0);ix.push(b,b+1,b+2,b,b+2,b+3);}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setIndex(ix);return g;}
function smoothN(g){const p=g.attributes.position,n=g.attributes.normal,acc=new Map(),key=i=>p.getX(i).toFixed(3)+','+p.getY(i).toFixed(3)+','+p.getZ(i).toFixed(3);
g.computeVertexNormals();for(let i=0;i<p.count;i++){const k=key(i);let a=acc.get(k);if(!a)acc.set(k,a=[0,0,0]);a[0]+=n.getX(i);a[1]+=n.getY(i);a[2]+=n.getZ(i);}
for(let i=0;i<p.count;i++){const a=acc.get(key(i)),l=Math.hypot(a[0],a[1],a[2])||1;n.setXYZ(i,a[0]/l,a[1]/l,a[2]/l);}n.needsUpdate=true;return g;}
function lumpy(r,amt,det){const g=new THREE.IcosahedronGeometry(r,det+1),p=g.attributes.position,v=new THREE.Vector3();
for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const f=1+(Math.sin(v.x*5.1+v.y*3.7)*0.5+Math.sin(v.z*4.3-v.x*2.9)*0.35+Math.sin(v.y*6.7+v.z*1.3)*0.25)*amt;v.multiplyScalar(f);p.setXYZ(i,v.x,v.y,v.z);}
return smoothN(g);}
const GEO={box:K(new THREE.BoxGeometry(1,1,1)),trunk:K(new THREE.CylinderGeometry(0.2,0.34,1,9).translate(0,0.5,0)),cone:K(new THREE.ConeGeometry(1,1,16).translate(0,0.5,0)),
ball:K(new THREE.SphereGeometry(1,16,12)),blob:K(lumpy(1.0,0.2,0)),cyl:K(new THREE.CylinderGeometry(1,1,1,14)),rock:K(lumpy(1,0.32,1)),
tire:K(new THREE.TorusGeometry(0.36,0.17,8,16).rotateX(Math.PI/2)),leaf:K(new THREE.BoxGeometry(0.9,0.04,1).translate(0,0,0.5)),
body:K(new THREE.CylinderGeometry(0.2,0.25,0.75,8)),head:K(new THREE.SphereGeometry(0.17,10,8)),pole:K(new THREE.CylinderGeometry(0.08,0.08,1,6).translate(0,0.5,0)),
flag:K(new THREE.PlaneGeometry(2.2,1.4).translate(1.1,0,0)),lamp:K(new THREE.CylinderGeometry(0.12,0.12,0.08,14).rotateX(Math.PI/2)),pipe:K(new THREE.CylinderGeometry(0.06,0.06,1,8).rotateX(Math.PI/2)),
helm:K(new THREE.SphereGeometry(0.2,12,10)),tuft:K(tuftGeo()),plane:K(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2)),vplane:K(new THREE.PlaneGeometry(1,1))};

const tuftT=ctex(128,128,(x,w,h)=>{for(let i=0;i<46;i++){const bx=6+Math.random()*116,ln=(Math.random()-0.5)*44,g=x.createLinearGradient(0,h,0,0),v=Math.round(120+Math.random()*80);g.addColorStop(0,'rgb('+(v-40)+','+(v-40)+','+(v-40)+')');g.addColorStop(1,'rgb('+Math.min(255,v+60)+','+Math.min(255,v+60)+','+Math.min(255,v+40)+')');x.strokeStyle=g;x.lineWidth=1.2+Math.random()*2.4;x.lineCap='round';x.beginPath();x.moveTo(bx,h);x.quadraticCurveTo(bx+ln*0.15,h*0.55,bx+ln,6+Math.random()*50);x.stroke();}});
const tuftOld=ctex(8,8,(x,w,h)=>{for(let i=0;i<0;i++){const bx=6+Math.random()*52,ln=(Math.random()-0.5)*20,v=Math.round(170+Math.random()*85);x.strokeStyle='rgb('+v+','+v+','+v+')';x.lineWidth=1.5+Math.random()*2;x.lineCap='round';x.beginPath();x.moveTo(bx,h);x.quadraticCurveTo(bx+ln*0.2,h*0.5,bx+ln,4+Math.random()*24);x.stroke();}});
const chk=ctex(256,64,x=>{for(let a=0;a<16;a++)for(let b=0;b<4;b++){x.fillStyle=(a+b)%2?'#151515':'#f4f4f4';x.fillRect(a*16,b*16,16,16);}});
function txtTex(w,h,txt,bg,fg,fs){return ctex(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font='bold '+fs+'px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,w/2,h/2+3);x.fillStyle='rgba(255,255,255,0.18)';x.fillRect(0,0,w,5);x.fillRect(0,h-5,w,5);});}
const ADS=[['TURBO GUMI','#d62828','#fff'],['RALLY 26','#111','#ffcc00'],['NITRO+','#1f6feb','#fff'],['PIT STOP','#f5f5f5','#d62828'],['SZUPER OLAJ','#0b8457','#fff'],['ÁSZ MOTOR','#ff7a00','#111']].map(a=>L(0xffffff,{map:txtTex(512,96,a[0],a[1],a[2],58)}));
const garT=ctex(1024,128,(x)=>{x.fillStyle='#d9dde2';x.fillRect(0,0,1024,128);const tc=['#d7263d','#1b6ee8','#f2b705','#1f9d55','#7b3fe4','#ff6b1a','#222','#0bb'];for(let i=0;i<8;i++){const x0=i*128+10;x.fillStyle=tc[i];x.fillRect(x0,10,108,14);x.fillStyle='#3a3f47';x.fillRect(x0,30,108,98);x.fillStyle='rgba(255,255,255,0.08)';for(let j=0;j<8;j++)x.fillRect(x0,34+j*12,108,2);x.fillStyle='#fff';x.font='bold 11px sans-serif';x.fillText('BOX '+(i+1),x0+4,21);}});
const MAT={post:L(0x30343c),white:L(0xf4f4f4),red:L(0xd33b2f),conc:L(0xaeb4bc),conc2:L(0xd9dde2),roof:L(0xf2f2f2),orange:L(0xff7a1a),lampW:new THREE.MeshBasicMaterial({color:0xfffbe6}),
inst:L(0xffffff),instS:L(0xffffff),instF:L(0xffffff),instD:L(0xffffff,{side:THREE.DoubleSide}),snow:L(0xf6f9fc),snowF:L(0xf6f9fc),cac:L(0x4c7d3a),palmT:L(0x8a6a48),
tuft:L(0xffffff,{map:tuftT,alphaTest:0.4,side:THREE.DoubleSide,alphaToCoverage:true}),chk:L(0xffffff,{map:chk}),chkD:L(0xffffff,{map:chk,side:THREE.DoubleSide}),
ban:L(0xffffff,{map:txtTex(512,64,'RAJT · CÉL','#111','#fff',40)}),big:L(0xffffff,{map:txtTex(1024,96,'TURBO GUMI  ·  RALLY 26  ·  NITRO+','#c81d25','#fff',54)}),
gar:L(0xffffff,{map:garT}),glassB:S(0x1c2a38,0.9,0.1)};

function mergeGeo(list){const pos=[],nor=[],idx=[],uv=[];let off=0;const hasUV=list.every(g=>g.attributes.uv);for(const g of list){const p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv;for(let i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));nor.push(n.getX(i),n.getY(i),n.getZ(i));if(hasUV)uv.push(u.getX(i),u.getY(i));}
if(g.index){const ix=g.index.array;for(let i=0;i<ix.length;i++)idx.push(ix[i]+off);}else for(let i=0;i<p.count;i++)idx.push(i+off);off+=p.count;}
const r=new THREE.BufferGeometry();r.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));r.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));if(hasUV)r.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));r.setIndex(idx);return K(r);}
const PG={torso:mergeGeo([new THREE.CylinderGeometry(0.17,0.22,0.56,10).translate(0,0.28,0),new THREE.SphereGeometry(0.2,10,6).scale(1.15,0.55,0.75).translate(0,0.56,0)]),
head:K(new THREE.SphereGeometry(0.13,12,10).translate(0,0.8,0)),
arms:mergeGeo([new THREE.CylinderGeometry(0.045,0.05,0.56,6).translate(0,0.28,0).rotateZ(0.38).translate(0.22,0.58,0),new THREE.CylinderGeometry(0.045,0.05,0.56,6).translate(0,0.28,0).rotateZ(-0.38).translate(-0.22,0.58,0)]),
hair:K(new THREE.SphereGeometry(0.142,12,6,0,Math.PI*2,0,Math.PI*0.55).translate(0,0.815,-0.012)),
sleg:mergeGeo([new THREE.CylinderGeometry(0.08,0.075,0.46,6).rotateX(Math.PI/2).translate(0.1,0.04,0.21),new THREE.CylinderGeometry(0.08,0.075,0.46,6).rotateX(Math.PI/2).translate(-0.1,0.04,0.21),new THREE.CylinderGeometry(0.07,0.06,0.44,6).translate(0.1,-0.18,0.43),new THREE.CylinderGeometry(0.07,0.06,0.44,6).translate(-0.1,-0.18,0.43)]),
legs:mergeGeo([new THREE.CylinderGeometry(0.075,0.065,0.8,6).translate(0.09,-0.4,0),new THREE.CylinderGeometry(0.075,0.065,0.8,6).translate(-0.09,-0.4,0)])};
const CUN={t:{value:0},ex:{value:0.4}};
function crowdMat(){const m=new THREE.MeshLambertMaterial({color:0xffffff});m.onBeforeCompile=sh=>{sh.uniforms.cT=CUN.t;sh.uniforms.cE=CUN.ex;
sh.vertexShader='uniform float cT;\nuniform float cE;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=fract(sin(dot(instanceMatrix[3].xz,vec2(12.9898,78.233)))*43758.5453)*6.2831;\ntransformed.y+=max(0.0,sin(cT*(5.0+ph*0.5)+ph))*0.24*cE*step(0.25,fract(ph*3.7));\n#endif');};m.customProgramCacheKey=()=>'crowd';return m;}
const CMAT=crowdMat();
const softT=ctex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.35,'rgba(255,255,255,0.75)');g.addColorStop(0.7,'rgba(255,255,255,0.22)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);});
const smokeT=ctex(128,128,(x)=>{for(let i=0;i<22;i++){const cx=34+Math.random()*60,cy=34+Math.random()*60,r=14+Math.random()*26,g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba(255,255,255,0.32)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);}
const id=x.getImageData(0,0,128,128),d=id.data;for(let y=0;y<128;y++)for(let xx=0;xx<128;xx++){const r=Math.hypot(xx-64,y-64)/64,f=Math.max(0,1-r);d[(y*128+xx)*4+3]*=Math.min(1,f*1.6);}x.putImageData(id,0,0);});
const PAL=[0xe63946,0xf1fa8c,0x457b9d,0xffffff,0x2a9d8f,0xff9f1c,0x9b5de5,0x222222,0xf4a261,0x48cae4].map(c=>new THREE.Color(c));
const SKIN=[0xf1c27d,0xe0ac69,0xc68642,0x8d5524,0xffdbac].map(c=>new THREE.Color(c));

const TR=[
{name:'Erdei kör',d:'Könnyű',dc:'#3ddc97',th:0,s:3,p:[[0,-55],[80,-40],[100,0],[80,40],[30,45],[0,25],[-30,45],[-80,40],[-100,0],[-80,-40]]},
{name:'Tengerparti gyors',d:'Közepes',dc:'#ffb020',th:3,s:2.4,p:[[0,-60],[90,-70],[150,-30],[160,30],[110,70],[40,60],[-20,90],[-100,80],[-150,30],[-130,-30],[-70,-60]]},
{name:'Sivatagi kanyargó',d:'Technikás',dc:'#ff9f43',th:1,s:2.4,p:[[-40,-80],[40,-60],[110,-80],[140,-20],[100,20],[130,70],[60,90],[0,50],[-50,90],[-120,70],[-90,10],[-140,-20],[-120,-60]]},
{name:'Havas hajtűk',d:'Nehéz',dc:'#ff6b6b',th:2,s:2.4,p:[[0,-70],[130,-70],[150,-40],[130,-10],[-60,-10],[-80,10],[-60,30],[130,30],[150,60],[130,90],[-130,90],[-150,10],[-130,-70]]}];
TR.forEach(t=>{t.len=new THREE.CatmullRomCurve3(t.p.map(q=>new THREE.Vector3(q[0]*t.s,0,q[1]*t.s)),true,'centripetal').getLength();});
const TH=[
{g:['#4f8a34','#5f9a3f','#6aa548'],verge:'mow',ru:['#5c9a3e','#69a84b'],grav:'#b9a98a',road:'#3a3c41',sky:[0x3a7fd0,0xcfe5f5,0x4a6a3a],sun:0xfff1d6,hg:0x5c7a45,p:'forest',mtn:0x5a7a68,cap:1,dust:[0.5,0.42,0.28],card:'#2f5d2a'},
{g:['#c9a46a','#d4b178','#dcbd88'],verge:'sand',ru:['#c8a26b','#bf9862'],grav:'#cdb48a',road:'#4b4743',sky:[0x3f86cf,0xf5dcaf,0xc9a46a],sun:0xffe2b8,hg:0xb08a5a,p:'desert',mtn:0xb2744a,cap:0,dust:[0.86,0.72,0.5],card:'#7d5f33'},
{g:['#e4ebf1','#eef3f7','#f6f9fb'],verge:'snow',ru:['#e9eff4','#dfe7ee'],grav:'#c7d0d8',road:'#42454c',sky:[0x6a88b0,0xe0e8f0,0xdfe7ee],sun:0xeaf1ff,hg:0x8c9aa8,p:'snow',mtn:0x7d93ab,cap:1,dust:[0.96,0.97,1],card:'#4f6276'},
{g:['#6aa04a','#78ad55','#86b862'],verge:'mow',ru:['#74ab52','#80b65e'],grav:'#e2d2a6',road:'#3d3f44',sky:[0x2f8ae0,0xd8eefb,0x5a8a40],sun:0xfff4dc,hg:0x6a9a50,p:'coast',mtn:0x6f8f7a,cap:0,dust:[0.85,0.78,0.6],card:'#2b6d86'}];
const CARS=[
{name:'Villám GT',tag:'Szuperautó',max:1.32,acc:0.016,brk:0.03,grip:0.0165,off:0.5,offMax:0.45,m:1,col:0,rim:'dark',ex:'gt',rt:6,ny:0.55,ns:0.6,
body:[[-2.25,0.28],[2.2,0.28],[2.32,0.42],[2.1,0.62],[0.9,0.78],[-1.3,0.86],[-2.1,0.9],[-2.3,0.72]],w:1.98,cab:[[0.85,0.76],[0.05,1.12],[-0.9,1.14],[-1.6,0.86]],cw:1.48,
wh:{r:0.4,rr:0.42,f:1.45,b:-1.4,x:0.96},hl:[2.27,0.47],tl:[-2.32,0.66]},
{name:'Fürge',tag:'Ralikocsi',max:1.16,acc:0.019,brk:0.031,grip:0.019,off:0.78,offMax:0.72,m:0.9,col:1,rim:'white',ex:'rally',rt:5,ny:0.68,ns:0.6,
body:[[-1.95,0.34],[1.95,0.34],[2.05,0.55],[1.8,0.8],[0.9,0.92],[-1.95,0.98],[-2.02,0.7]],w:1.86,cab:[[0.9,0.9],[0.25,1.5],[-1.75,1.52],[-1.95,0.96]],cw:1.6,
wh:{r:0.42,rr:0.42,f:1.25,b:-1.25,x:0.92},hl:[2.0,0.62],tl:[-2.04,0.8]},
{name:'Bivaly',tag:'Izomautó',max:1.26,acc:0.021,brk:0.027,grip:0.0148,off:0.55,offMax:0.5,m:1.5,col:2,rim:'chrome',ex:'muscle',rt:6,ny:0.66,ns:0.6,
body:[[-2.35,0.34],[2.3,0.34],[2.38,0.6],[2.25,0.82],[0.6,0.92],[-1.6,0.94],[-2.35,0.98]],w:2.04,cab:[[0.55,0.9],[-0.2,1.4],[-1.0,1.42],[-2.0,0.97]],cw:1.56,
wh:{r:0.42,rr:0.46,f:1.5,b:-1.45,x:0.98},hl:[2.4,0.7],tl:[-2.37,0.84]},
{name:'Prototípus',tag:'Versenyprototípus',max:1.38,acc:0.015,brk:0.033,grip:0.0178,off:0.42,offMax:0.38,m:0.85,col:5,rim:'dark',ex:'proto',rt:6,ny:0.43,ns:0.4,
body:[[-2.4,0.22],[2.35,0.22],[2.45,0.32],[1.6,0.55],[0.9,0.62],[-1.6,0.7],[-2.4,0.8]],w:2.0,cab:[[0.9,0.6],[0.1,1.0],[-0.8,1.02],[-1.4,0.68]],cw:1.1,
wh:{r:0.4,rr:0.41,f:1.55,b:-1.5,x:0.95},hl:[2.38,0.38],tl:[-2.42,0.68]}];
const COLS=[['Piros',0xd7263d],['Kék',0x1b6ee8],['Sárga',0xf2b705],['Zöld',0x1f9d55],['Fehér',0xf1f1f1],['Fekete',0x1b1c20],['Narancs',0xff6b1a],['Lila',0x7b3fe4]];
const DRV=['Kovács','Szabó','Tóth','Nagy','Horváth','Varga','Kiss','Molnár'],HELM=[0xffffff,0xffcc00,0x1b6ee8,0xd7263d,0x222222,0x3ddc97,0xff7a1a,0x9b5de5];
const OPP=[3,5,7],DIF=['Könnyű','Közepes','Nehéz'],LAPS=[2,3,5];
const cfg={t:0,c:0,k:0,o:0,d:1,l:1,q:1},REC={};const QL=['Közepes','Magas'];
const HW=11;
const DO=new THREE.Object3D();DO.rotation.order='YXZ';

const leafT=ctex(256,256,(x)=>{for(let i=0;i<1100;i++){const r=Math.sqrt(Math.random())*116,a=Math.random()*6.28,px=128+Math.cos(a)*r,py=128+Math.sin(a)*r*0.92,v=105+Math.random()*150|0;x.fillStyle='rgb('+v+','+v+','+Math.max(0,v-10)+')';x.save();x.translate(px,py);x.rotate(Math.random()*6.28);x.beginPath();x.ellipse(0,0,5+Math.random()*4,2.2+Math.random()*1.6,0,0,7);x.fill();x.restore();}});
const needleT=ctex(128,128,(x,w,h)=>{x.fillStyle='#8a8a8a';x.fillRect(0,0,w,h);for(let i=0;i<1600;i++){const px=Math.random()*w,py=Math.random()*h,v=90+Math.random()*165|0;x.strokeStyle='rgb('+v+','+v+','+v+')';x.lineWidth=1;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-0.5)*3,py+5+Math.random()*6);x.stroke();}},true);needleT.repeat.set(5,2);
const CARD=(()=>{const gs=[];for(let i=0;i<3;i++){const g=new THREE.PlaneGeometry(2,2,2,2);if(i===1)g.rotateY(Math.PI/2);if(i===2)g.rotateX(Math.PI/2);gs.push(g);}const m=mergeGeo(gs),p=m.attributes.position,n=m.attributes.normal,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i)+0.4,p.getZ(i)).normalize();n.setXYZ(i,v.x,v.y,v.z);}return m;})();
MAT.leaf=L(0xffffff,{map:leafT,alphaTest:0.5,side:THREE.DoubleSide,alphaToCoverage:true});MAT.needle=L(0xffffff,{map:needleT});

CARS.forEach((c,i)=>Object.assign(c,[{rwd:1,df:0.22,resp:1},{rwd:0,df:0.04,resp:1.15},{rwd:1.3,df:0,resp:0.85},{rwd:0.8,df:0.42,resp:1.1}][i]));
