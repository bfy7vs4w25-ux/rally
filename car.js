function shapeG(pts,w,bev,smooth){const s=new THREE.Shape();if(smooth){s.moveTo(pts[0][0],pts[0][1]);s.lineTo(pts[1][0],pts[1][1]);s.splineThru(pts.slice(2).concat([pts[0]]).map(p=>new THREE.Vector2(p[0],p[1])));}else pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();const d=Math.max(0.01,w-2*bev);
const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bev,bevelSegments:4,curveSegments:24});g.translate(0,0,-d/2);g.rotateY(-Math.PI/2);return K(g);}
const CGC=[];
function bodyOutline(d){const s=new THREE.Shape(),p=d.body;s.moveTo(p[0][0],p[0][1]);s.lineTo(p[1][0],p[1][1]);s.splineThru(p.slice(2).concat([p[0]]).map(q=>new THREE.Vector2(q[0],q[1])));return s.getPoints(30);}
function extrudePts(pts,depth,bev,bs){const s=new THREE.Shape(pts),dd=Math.max(0.01,depth-2*bev),g=new THREE.ExtrudeGeometry(s,{depth:dd,bevelEnabled:bev>0,bevelThickness:bev,bevelSize:bs===undefined?bev:bs,bevelSegments:3,curveSegments:2});g.translate(0,0,-dd/2);g.rotateY(-Math.PI/2);return K(g);}
function cgeo(ty){if(CGC[ty])return CGC[ty];const d=CARS[ty],ol=bodyOutline(d),yb=d.body[0][1],fl=yb+0.06,za=d.cab[3][0]+0.04,zb=d.cab[0][0]-0.03;
const notch=ol.map(v=>(v.y>yb+0.03&&v.x>za&&v.x<zb)?new THREE.Vector2(v.x,fl):v),sd=(d.w-d.cw)/2+0.035;
return CGC[ty]={core:extrudePts(notch,d.cw-0.04,0.07,0.064),side:extrudePts(ol,sd,0.07),sx:d.w/2-sd/2,cab:shapeG(d.cab,d.cw,0.05),fin:d.ex==='proto'?shapeG([[-0.7,0.98],[-2.35,1.2],[-2.38,0.8],[-1.4,0.7]],0.08,0):null};}
const SWG={ring:K(new THREE.TorusGeometry(0.16,0.022,8,26))};
const WG={bdisc:K(new THREE.CylinderGeometry(0.52,0.52,0.05,22)),tire:K(new THREE.TorusGeometry(0.8,0.24,14,32)),barrel:K(new THREE.CylinderGeometry(0.62,0.62,0.7,20,1,true)),disc:K(new THREE.CylinderGeometry(0.6,0.6,0.04,16)),spk:K(new THREE.BoxGeometry(0.07,1.2,0.14)),hub:K(new THREE.CylinderGeometry(0.15,0.15,0.12,10)),cal:K(new THREE.BoxGeometry(0.2,0.45,0.6))};
const DS=THREE.DoubleSide;
const CM={rimG:S(0xd2a54a,0.95,0.22,{side:THREE.DoubleSide}),glassL:S(0x3a4e60,0.35,0.03,{transparent:true,opacity:0.24,depthWrite:false}),visor:S(0x0d1218,0.95,0.04),int:S(0x2c2f35,0.2,0.65),seat:S(0x1c1d21,0.05,0.85),glove:S(0x111111,0.1,0.7),cage:S(0xb8bec6,0.85,0.3),carpet:S(0x141518,0,1),discM:S(0x8d9299,0.9,0.32),grille:S(0x0b0b0d,0.4,0.55),drl:new THREE.MeshBasicMaterial({color:0xeaf4ff}),tire:S(0x141414,0,0.85),rim:S(0xc4cad2,0.9,0.22,{side:DS}),rimD:S(0x24272c,0.7,0.3,{side:DS}),rimW:S(0xf2f2f2,0.3,0.35,{side:DS}),glass:S(0x0a0f15,0.9,0.05,{transparent:true,opacity:0.8}),
trim:S(0x15171b,0.3,0.55),chrome:S(0xeeeeee,1,0.1),head:new THREE.MeshBasicMaterial({color:0xfff7df}),lens:S(0xfff4cc,0.1,0.1,{emissive:0x9a8030}),cal:S(0xd62828,0.3,0.4),scr:new THREE.MeshBasicMaterial({color:0x2a6fd6}),scr2:new THREE.MeshBasicMaterial({color:0x37e07a}),belt:S(0xd8261f,0.05,0.7),alu:S(0x9ea4ac,0.95,0.25),
blob:new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:0.25,depthWrite:false})};
function numTex(n){return ctex(128,128,x=>{x.fillStyle='#fff';x.beginPath();x.arc(64,64,58,0,7);x.fill();x.fillStyle='#111';x.font='bold 74px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),64,70);});}
const WVC={};['def','white','dark','gold','chrome'].forEach(k=>WVC[k]=new THREE.MeshStandardMaterial({vertexColors:true,metalness:k==='white'?0.35:0.6,roughness:0.36}));
function mergeVC(gr,mat){const pos=[],nor=[],col=[],idx=[];let off=0;gr.children.slice().forEach(m=>{if(!m.isMesh)return;m.updateMatrix();const g=m.geometry.clone().applyMatrix4(m.matrix),p=g.attributes.position,n=g.attributes.normal,cl=m.material.color||new THREE.Color(1,1,1);
for(let i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));nor.push(n.getX(i),n.getY(i),n.getZ(i));col.push(cl.r,cl.g,cl.b);}if(g.index){const ix=g.index.array;for(let i=0;i<ix.length;i++)idx.push(ix[i]+off);}else for(let i=0;i<p.count;i++)idx.push(i+off);off+=p.count;g.dispose();gr.remove(m);});
const r=new THREE.BufferGeometry();r.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));r.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));r.setAttribute('color',new THREE.Float32BufferAttribute(col,3));r.setIndex(idx);const mm=new THREE.Mesh(r,mat);mm.castShadow=true;gr.add(mm);return[r];}
function wheel(s,st){const w=new THREE.Group(),rm=st==='white'?CM.rimW:st==='dark'?CM.rimD:st==='gold'?CM.rimG:CM.rim;
const t=new THREE.Mesh(WG.tire,CM.tire);t.rotation.y=Math.PI/2;t.scale.set(1,1,1.5);w.add(t);
const b=new THREE.Mesh(WG.barrel,rm);b.rotation.z=Math.PI/2;w.add(b);
const bk=new THREE.Mesh(WG.disc,CM.trim);bk.rotation.z=Math.PI/2;bk.position.x=-s*0.1;w.add(bk);
for(let j=0;j<5;j++){const k=new THREE.Mesh(WG.spk,rm);k.position.x=s*0.3;k.rotation.x=j*Math.PI/5;w.add(k);}
const h=new THREE.Mesh(WG.hub,CM.chrome);h.rotation.z=Math.PI/2;h.position.x=s*0.33;w.add(h);for(let j=0;j<5;j++){const a=j*1.2566,n=new THREE.Mesh(WG.hub,CM.chrome);n.scale.set(0.24,0.5,0.24);n.rotation.z=Math.PI/2;n.position.set(s*0.37,Math.cos(a)*0.2,Math.sin(a)*0.2);w.add(n);}
const dk=new THREE.Mesh(WG.bdisc,CM.discM);dk.rotation.z=Math.PI/2;dk.position.x=s*0.1;w.add(dk);
w.userData.geos=mergeVC(w,WVC[st]||WVC.def);return w;}
let WSCR=null;const DASHC=document.createElement('canvas');DASHC.width=256;DASHC.height=96;const DASHT=new THREE.CanvasTexture(DASHC),DASHM=new THREE.MeshBasicMaterial({map:DASHT});
function drawDash(c){const x=DASHC.getContext('2d'),w=256,h=96;x.fillStyle='#07090c';x.fillRect(0,0,w,h);const n=12,lit=Math.round(Math.max(0,Math.min(1,(c.rpm-0.35)/0.6))*n);
for(let i=0;i<n;i++){x.fillStyle=i<lit?(i<5?'#2ee66b':i<9?'#ffcf33':i<11?'#ff3b30':'#3a8bff'):'#1a1d22';x.beginPath();x.arc(20+i*19.6,12,6.5,0,7);x.fill();}
x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.font='800 50px Inter,Arial,sans-serif';x.fillText(c.v<-0.02?'R':String(c.gear||1),128,56);
x.font='700 26px Inter,Arial,sans-serif';x.textAlign='left';x.fillText(String(Math.round(SPD(Math.abs(c.v)*180))),12,56);x.font='600 11px Inter,Arial,sans-serif';x.fillStyle='#8a93a0';x.fillText(UN(),12,78);
x.textAlign='right';x.fillStyle='#8a93a0';x.fillText('NOS',244,40);x.fillStyle='#1a1d22';x.fillRect(196,50,48,10);x.fillStyle=c.boost?'#ff7a1a':'#3ad1ff';x.fillRect(196,50,48*c.nit/100,10);
x.fillStyle='#8a93a0';x.fillText('TYRE',244,74);x.fillStyle=c.tt<0.55?'#3a8bff':c.tt>1?'#ff3b30':'#2ee66b';x.fillRect(214,80,30,6);DASHT.needsUpdate=true;}
function makeCar(ty,col,num,helm,opt){WSCR=null;opt=opt||{};const d=CARS[ty],cg=cgeo(ty),g=new THREE.Group(),inn=new THREE.Group(),ins=new THREE.Group();g.add(inn);inn.add(ins);let tgt=null;const ZS=d.wh.f-d.wh.r-0.47,ZN=Math.min(-0.15,ZS-0.43-d.ns/2);const topY=(()=>{const ol=bodyOutline(d),yb=d.body[0][1];return z=>{let b=null,bd=1e9;for(const v of ol)if(v.y>yb+0.05&&Math.abs(v.x-z)<bd){bd=Math.abs(v.x-z);b=v.y;}return b===null?0.8:b;};})();
const paint=new THREE.MeshPhysicalMaterial({color:col,metalness:0.45,roughness:0.28,clearcoat:1,clearcoatRoughness:0.05});
const hs={};new THREE.Color(col).getHSL(hs);const acc=S(hs.l>0.6?0x17191d:0xf4f4f4,0.2,0.35);
const tail=new THREE.MeshBasicMaterial({color:0x5a0a0a}),nm=new THREE.MeshStandardMaterial({map:numTex(num),alphaTest:0.5,roughness:0.35,metalness:0.1}),hm=S(helm,0.3,0.25);
const M=(geo,mat,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=!tgt;(tgt||inn).add(m);return m;};
const B=(mat,sx,sy,sz,x,y,z,rx)=>M(GEO.box,mat,x,y,z,sx,sy,sz,rx);
const seg=(mat,p1,p2,x,w,th,lift)=>{const dz=p2[0]-p1[0],dy=p2[1]-p1[1];return B(mat,w,th,Math.hypot(dz,dy),x,(p1[1]+p2[1])/2+lift,(p1[0]+p2[0])/2,-Math.atan2(dy,dz));};
M(cg.core,paint,0,0,0);M(cg.side,paint,cg.sx,0,0);M(cg.side,paint,-cg.sx,0,0);M(cg.cab,opt.tint?CM.glass:CM.glassL,0,0,0);if(cg.fin)M(cg.fin,paint,0,0,0);
const z0=d.body[0][0],z1=d.body[1][0];B(CM.trim,d.w-0.14,0.1,z1-z0-0.3,0,d.body[0][1]+0.02,(z0+z1)/2);

const liv=(opt.liv===undefined||opt.liv<0)?(d.ex==='gt'||d.ex==='muscle'||d.ex==='touring'?1:d.ex==='rally'||d.ex==='baja'?2:0):opt.liv;
if(liv===1)for(const x of[-0.24,0.24]){seg(acc,d.cab[1],d.cab[2],x,0.22,0.02,0.074);seg(acc,d.body[3],d.cab[0],x,0.22,0.02,0.085);seg(acc,d.cab[3],d.body[d.rt],x,0.22,0.02,0.085);seg(acc,d.body[2],d.body[3],x,0.22,0.02,0.08);}
if(liv===2)for(const s of[-1,1]){B(acc,0.02,0.16,(d.body[1][0]-d.body[0][0])*0.82,s*(d.w/2+0.006),d.body[0][1]+0.2,0);B(acc,0.02,0.05,(d.body[1][0]-d.body[0][0])*0.82,s*(d.w/2+0.006),d.body[0][1]+0.32,0);}
tgt=ins;const yb0=d.body[0][1],flY=yb0+0.13,roofY=Math.min(d.cab[1][1],d.cab[2][1])-0.03,sc=Math.max(0.6,Math.min(1,(roofY-0.06-flY)/0.86)),hx=d.ex==='proto'?0:0.3,dz0=d.cab[0][0]-0.24,hipZ=Math.min(dz0-0.37-0.43*sc,d.cab[1][0]-0.25+0.1*sc),hy=flY+0.06+0.7*sc,hz=hipZ-0.12*sc,belt=(d.cab[0][1]+d.cab[3][1])/2;
const suit=S(helm===0xffffff?0xe8e8e8:helm,0.05,0.55),bol=S(col,0.3,0.45),shoe=S(0x101113,0.2,0.6);
B(CM.carpet,d.cw-0.1,0.03,d.cab[0][0]-d.cab[3][0]-0.1,0,flY+0.015,(d.cab[0][0]+d.cab[3][0])/2);
for(const s of[-1,1])B(CM.int,0.03,Math.max(0.1,belt-flY-0.02),d.cab[0][0]-d.cab[3][0]-0.15,s*(d.cw/2-0.035),(belt+flY)/2,(d.cab[0][0]+d.cab[3][0])/2);
const dz=d.cab[0][0]-0.24,dTop=d.cab[0][1]-0.02;B(CM.int,d.cw-0.08,0.18,0.34,0,dTop-0.09,dz);B(CM.trim,d.cw-0.1,0.03,0.36,0,dTop+0.005,dz);
for(const s of[-1,1])M(GEO.vplane,CM.grille,s*0.42,dTop-0.08,dz-0.175,0.14,0.06,1,0,Math.PI,0);
B(CM.int,0.2,0.24,Math.max(0.3,dz-0.17-hipZ),0,flY+0.12,(dz-0.17+hipZ)/2);M(GEO.cyl,CM.chrome,0,flY+0.3,hipZ+0.25,0.012,0.16,0.012,0.25,0,0);M(GEO.ball,CM.trim,0,flY+0.38,hipZ+0.27,0.035,0.035,0.035);
if(d.ex!=='proto')B(CM.trim,0.22,0.06,0.03,0,roofY-0.06,d.cab[1][0]-0.12);
const seat=x=>{const y0=flY+0.06;B(CM.seat,0.44*sc,0.08,0.48*sc,x,y0,hipZ+0.06*sc);B(CM.seat,0.44*sc,0.64*sc,0.09,x,y0+0.32*sc,hipZ-0.2*sc,-0.22);
for(const s of[-1,1]){B(bol,0.07,0.16*sc,0.46*sc,x+s*0.22*sc,y0+0.08*sc,hipZ+0.06*sc);B(bol,0.07,0.52*sc,0.1,x+s*0.22*sc,y0+0.36*sc,hipZ-0.18*sc,-0.22);}B(CM.seat,0.22*sc,0.16*sc,0.08,x,y0+0.7*sc,hipZ-0.34*sc,-0.22);};
seat(hx);if(d.ex!=='proto')seat(-hx);
if(d.ex!=='proto'){const cg_=CM.cage,yt=roofY-0.02,zr=hipZ-0.42*sc;for(const s of[-1,1]){seg(cg_,[zr,flY+0.03],[zr,yt],s*(d.cw/2-0.1),0.035,0.035,0);seg(cg_,[zr,yt],[d.cab[0][0]-0.3,dTop+0.04],s*(d.cw/2-0.1),0.035,0.035,0);}B(cg_,d.cw-0.2,0.035,0.035,0,yt,zr);seg(cg_,[zr,yt],[zr-0.55,flY+0.1],0,0.035,0.035,0);}
{B(CM.scr,0.22,0.12,0.012,0,dTop-0.06,dz-0.176);for(let i=0;i<6;i++)B(i%3===0?CM.cal:i%3===1?CM.scr2:CM.alu,0.026,0.014,0.03,-0.065+i*0.026,flY+0.245,hipZ+0.46);
for(let i=0;i<3;i++)B(CM.alu,0.06,0.1,0.02,hx-0.11+i*0.11,flY+0.11,hipZ+0.8*sc,-0.5);
if(d.ex!=='proto'){M(GEO.cyl,CM.cal,-hx,flY+0.13,hipZ+0.58*sc,0.065,0.36,0.065,0,0,Math.PI/2);B(CM.alu,0.04,0.05,0.06,-hx+0.2,flY+0.13,hipZ+0.58*sc);}
if(d.ex==='rally'){const hb_=B(CM.trim,0.035,0.36,0.035,hx-0.27,flY+0.3,hipZ+0.2,-0.35);M(GEO.ball,CM.cal,hx-0.27,flY+0.47,hipZ+0.27,0.04,0.04,0.04);}
if(d.ex!=='proto'){const zr2=hipZ-0.42*sc;for(const s of[-1,1]){const xx=s*(d.cw/2-0.1);seg(CM.cage,[zr2,flY+0.1],[d.cab[0][0]-0.35,belt-0.04],xx,0.03,0.03,0);seg(CM.cage,[zr2,belt-0.04],[d.cab[0][0]-0.35,flY+0.1],xx,0.03,0.03,0);}}}
if(d.ex!=='proto'){const rl=d.cab[1][0]-d.cab[2][0];B(CM.int,d.cw-0.12,0.02,rl,0,Math.min(d.cab[1][1],d.cab[2][1])-0.012,(d.cab[1][0]+d.cab[2][0])/2);for(const s of[-1,1])B(CM.int,0.34,0.014,0.17,s*0.34,Math.min(d.cab[1][1],d.cab[2][1])-0.03,d.cab[1][0]-0.1,0.12);for(const s of[-1,1])B(CM.trim,0.04,0.04,Math.max(0.3,d.cab[0][0]-d.cab[3][0]-0.3),s*(d.cw/2-0.06),(d.cab[0][1]+d.cab[3][1])/2-0.02,(d.cab[0][0]+d.cab[3][0])/2);}
const dr=new THREE.Group();dr.position.set(hx,flY+0.06,hipZ);dr.scale.setScalar(sc);ins.add(dr);
const UPV=new THREE.Vector3(0,1,0),limb=(mat,p1,p2,r,rz)=>{const a=new THREE.Vector3(...p1),b=new THREE.Vector3(...p2),dv=b.clone().sub(a),m=new THREE.Mesh(GEO.cyl,mat);m.scale.set(r,dv.length(),rz||r);m.position.copy(a).add(b).multiplyScalar(0.5);m.quaternion.setFromUnitVectors(UPV,dv.normalize());m.castShadow=true;dr.add(m);return m;};
const ball=(mat,p,sx,sy,sz)=>{const m=new THREE.Mesh(GEO.ball,mat);m.position.set(...p);m.scale.set(sx,sy||sx,sz||sx);m.castShadow=true;dr.add(m);return m;};
for(const s of[-1,1]){limb(suit,[s*0.1,0.08,0],[s*0.1,0.17,0.42],0.078);limb(suit,[s*0.1,0.17,0.42],[s*0.1,-0.03,0.62],0.062);ball(suit,[s*0.1,0.17,0.42],0.075);const sh=new THREE.Mesh(GEO.box,shoe);sh.scale.set(0.1,0.08,0.22);sh.position.set(s*0.1,-0.06,0.69);dr.add(sh);
limb(suit,[s*0.2,0.48,-0.1],[s*0.22,0.34,0.17],0.056);limb(suit,[s*0.22,0.34,0.17],[s*0.16,0.45,0.37],0.047);ball(suit,[s*0.22,0.34,0.17],0.052);ball(CM.glove,[s*0.16,0.46,0.39],0.05);}
limb(suit,[0,0.06,-0.02],[0,0.5,-0.13],0.17,0.12);ball(suit,[0,0.5,-0.12],0.22,0.1,0.13);ball(suit,[0,0.08,-0.02],0.17,0.08,0.13);limb(suit,[0,0.52,-0.12],[0,0.6,-0.13],0.055);
for(const s of[-1,1]){limb(CM.belt,[s*0.1,0.52,0.0],[s*0.06,0.14,0.1],0.032,0.01);}limb(CM.belt,[-0.16,0.13,0.1],[0.16,0.13,0.1],0.03,0.01);ball(CM.alu,[0,0.2,0.12],0.05,0.05,0.02);ball(CM.trim,[0,0.57,-0.21],0.14,0.05,0.08);
const HEAD=[ball(hm,[0,0.7,-0.12],0.138,0.15,0.145),(()=>{const v=new THREE.Mesh(GEO.box,CM.visor);v.scale.set(0.2,0.06,0.05);v.position.set(0,0.715,0.0);dr.add(v);return v;})()];HEAD.forEach(m=>m.userData.dyn=1);
const sgp=new THREE.Group();sgp.position.set(0,0.45,0.43);sgp.rotation.x=-0.5;sgp.userData.dyn=1;dr.add(sgp);const ring=new THREE.Group();sgp.add(ring);ring.add(new THREE.Mesh(SWG.ring,CM.int));
for(const a of[Math.PI/2,-Math.PI/2,Math.PI]){const sp=new THREE.Mesh(GEO.box,CM.trim);sp.scale.set(0.02,0.16,0.025);sp.position.set(Math.cos(a)*0.08,Math.sin(a)*0.08,0);sp.rotation.z=a+Math.PI/2;ring.add(sp);}
const hb=new THREE.Mesh(GEO.cyl,CM.trim);hb.scale.set(0.05,0.04,0.05);hb.rotation.x=Math.PI/2;ring.add(hb);{const sc_=new THREE.Mesh(GEO.box,CM.scr);sc_.userData.dyn=1;WSCR=sc_;sc_.scale.set(0.085,0.04,0.006);sc_.position.set(0,0.02,-0.024);ring.add(sc_);for(const bx of[-0.07,0.07])for(const by of[-0.02,0.02]){const bt=new THREE.Mesh(GEO.box,by>0?CM.cal:CM.scr2);bt.scale.set(0.014,0.014,0.006);bt.position.set(bx,by,-0.022);ring.add(bt);}}const col_=new THREE.Mesh(GEO.cyl,CM.trim);col_.scale.set(0.03,0.3,0.03);col_.rotation.x=Math.PI/2;col_.position.z=0.17;sgp.add(col_);
ring.userData.geos=mergeGroup(ring);dr.userData.geos=mergeGroup(dr).concat(ring.userData.geos);
const gp=M(GEO.vplane,GAUGEM,hx,dTop+0.02,dz-0.18,0.34,0.12,1,0,0,0);gp.userData.dyn=1;gp.castShadow=false;gp.rotation.order='YXZ';gp.rotation.set(-0.45,Math.PI,0);tgt=null;
const SW=ring;
for(const s of[-1,1]){B(CM.head,0.42,0.13,0.1,s*(d.w/2-0.36),d.hl[1],d.hl[0]+0.04);B(tail,0.46,0.12,0.1,s*(d.w/2-0.34),d.tl[1],d.tl[0]-0.04);
if(d.ex!=='proto')B(paint,0.2,0.12,0.13,s*(d.cw/2+0.13),d.cab[0][1]+0.14,d.cab[0][0]-0.25);
const dc=M(GEO.vplane,nm,s*(d.w/2+0.024),d.ny,ZN,d.ns,d.ns,1,0,s*Math.PI/2,0);dc.castShadow=false;}
const T=CM.trim;
if(d.ex==='touring'){const ty_=topY(-1.95)+0.07;for(const s of[-1,1]){B(T,0.06,0.32,0.14,s*0.6,ty_+0.16,-1.95);B(T,0.04,0.3,0.55,s*(d.w/2-0.05),ty_+0.36,-2.0);
for(const zz of[d.wh.f,d.wh.b]){B(paint,0.09,0.2,1.05,s*(d.w/2+0.03),d.wh.r+0.32,zz);B(T,0.1,0.03,1.05,s*(d.w/2+0.035),d.wh.r+0.2,zz);}B(T,0.05,0.12,2.0,s*(d.w/2+0.02),0.3,0);}
B(T,d.w-0.16,0.045,0.42,0,ty_+0.32,-2.0,-0.06);B(T,d.w+0.04,0.03,0.36,0,0.25,2.2);B(T,d.w-0.4,0.16,0.3,0,0.31,-2.2);B(CM.grille,0.9,0.18,0.03,0,0.5,2.36);}
if(d.ex==='baja'){const rt_=Math.max(d.cab[1][1],d.cab[2][1])+0.1;B(T,1.4,0.12,0.14,0,rt_+0.14,d.cab[1][0]-0.08);for(let i=0;i<6;i++)B(CM.head,0.16,0.09,0.03,-0.55+i*0.22,rt_+0.14,d.cab[1][0]+0.0);
for(const s of[-1,1]){B(T,0.05,0.18,0.05,s*0.6,rt_+0.04,d.cab[1][0]-0.08);seg(CM.trim,[2.3,0.7],[2.48,0.95],s*0.55,0.07,0.07,0);seg(CM.trim,[2.48,0.95],[2.2,1.15],s*0.55,0.07,0.07,0);
for(const zz of[d.wh.f,d.wh.b]){B(T,0.14,0.08,1.3,s*(d.w/2+0.05),d.wh.r+0.62,zz);B(T,0.12,0.4,0.03,s*(d.w/2-0.15),d.wh.r*0.75,zz-(zz>0?-0.62:0.62));}
seg(CM.cage,[-1.35,1.2],[-1.45,1.75],s*0.72,0.07,0.07,0);seg(CM.cage,[-1.45,1.75],[-2.1,1.2],s*0.72,0.06,0.06,0);}
B(CM.cage,1.5,0.07,0.07,0,1.75,-1.45);B(T,1.15,0.07,0.07,0,0.95,2.48);B(T,d.w-0.2,0.06,0.5,0,0.58,2.0,0.25);
const sp=new THREE.Mesh(WG.tire,CM.tire);sp.scale.setScalar(0.55);sp.rotation.x=Math.PI/2;sp.position.set(0,1.32,-1.75);sp.castShadow=true;inn.add(sp);M(GEO.cyl,T,0.62,1.42,d.cab[0][0]-0.15,0.05,0.5,0.05);}
if(d.ex==='gt'){for(const s of[-1,1]){B(T,0.06,0.3,0.14,s*0.55,1.04,-1.95);B(T,0.04,0.3,0.6,s*(d.w/2-0.06),1.13,-1.98);B(T,0.03,0.2,0.7,s*(d.w/2+0.004),0.5,-0.85);}B(T,d.w-0.1,0.05,0.5,0,1.2,-1.98,-0.08);B(T,d.w,0.03,0.32,0,0.27,2.15);B(T,d.w-0.4,0.14,0.3,0,0.32,-2.18);}
if(d.ex==='rally'){B(T,1.5,0.05,0.06,0,0.6,2.02);for(const x of[-0.6,-0.2,0.2,0.6])M(GEO.lamp,CM.lens,x,0.72,2.04);
for(const s of[-1,1]){for(const zz of[d.wh.f,d.wh.b])B(T,0.42,0.32,0.03,s*d.wh.x,0.27,zz-0.55);B(acc,0.02,0.18,3.3,s*(d.w/2+0.008),0.46,-0.1);}
B(paint,0.42,0.1,0.38,0,d.cab[1][1]+0.1,d.cab[1][0]-0.4);B(paint,d.cw-0.05,0.05,0.42,0,d.cab[2][1]+0.07,d.cab[2][0]-0.12,0.18);}
if(d.ex==='muscle'){B(T,0.56,0.13,0.8,0,0.95,1.35);B(CM.chrome,d.w-0.06,0.13,0.12,0,0.44,2.37);B(CM.chrome,d.w-0.06,0.13,0.12,0,0.47,-2.38);for(const s of[-1,1])M(GEO.pipe,CM.chrome,s*(d.w/2+0.05),0.32,-0.3,1,1,1.5);B(paint,d.w-0.15,0.05,0.3,0,1.02,-2.24,-0.25);}
if(d.ex==='proto'){for(const s of[-1,1]){B(T,0.06,0.42,0.16,s*0.5,0.95,-2.15);B(paint,0.04,0.5,0.9,s*(d.w/2+0.03),1.0,-2.15);}B(T,d.w+0.1,0.05,0.56,0,1.18,-2.2,-0.06);B(T,d.w,0.03,0.34,0,0.2,2.3);}
const ze=d.body[0][0];for(const s of[-1,1]){if(d.ex!=='muscle')M(GEO.pipe,CM.chrome,s*0.42,0.3,ze-0.02,1.4,1.4,0.35);}
const fl=[];for(const s of(d.ex==='muscle'?[]:[-1,1])){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*0.42,0.3,ze-0.12);f2.position.copy(f.position);f.visible=f2.visible=false;f.userData.dyn=f2.userData.dyn=1;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='muscle')for(const s of[-1,1]){const f=new THREE.Mesh(FLG,FLM),f2=new THREE.Mesh(FLG2,FLM2);f.position.set(s*(d.w/2+0.05),0.32,-1.05);f2.position.copy(f.position);f.visible=f2.visible=false;f.userData.dyn=f2.userData.dyn=1;inn.add(f,f2);fl.push(f,f2);}
if(d.ex==='rally'||d.ex==='muscle'){const pp=M(PLATE,PLM,0,d.tl[1]-0.2,d.tl[0]-0.06);pp.castShadow=false;}
{const cw2=d.cw/2,bl=(d.cab[0][1]+d.cab[3][1])/2;
if(d.ex!=='proto'){const r1=[d.cab[1][0]-0.04,d.cab[1][1]],r2=[d.cab[2][0]+0.04,d.cab[2][1]];seg(paint,r1,r2,0,d.cw+0.04,0.05,0.045);}if(d.ex!=='proto')for(const s of[-1,1]){const x=s*(cw2+0.025);seg(T,d.cab[0],d.cab[1],x,0.05,0.06,0);seg(T,d.cab[1],d.cab[2],x,0.05,0.06,0);seg(T,d.cab[2],d.cab[3],x,0.05,0.06,0);seg(T,d.cab[0],d.cab[3],s*(cw2+0.035),0.05,0.05,0);
const bz=(d.cab[1][0]+d.cab[2][0])/2-0.1,bh=Math.max(0.2,d.cab[1][1]-bl);B(T,0.05,bh,0.09,x,bl+bh/2,bz);}
const zs1=d.cab[0][0]-0.05,zs2=(d.cab[2][0]+d.cab[3][0])/2,yb=d.body[0][1];
for(const s of[-1,1]){const xs=s*(d.w/2+0.005);if(d.ex!=='proto'){B(T,0.008,0.42,0.025,xs,yb+0.34,zs1);B(T,0.008,0.42,0.025,xs,yb+0.34,zs2);B(CM.chrome,0.02,0.035,0.16,s*(d.w/2+0.012),bl-0.14,zs2+0.25);
B(T,0.06,0.08,(z1-z0)*0.55,s*(d.w/2+0.01),yb+0.06,(z0+z1)/2);}B(CM.drl,0.36,0.025,0.05,s*(d.w/2-0.36),d.hl[1]-0.085,d.hl[0]+0.06);
{const spk=opt.spn===undefined?(num+(s>0?0:1))%SPM.length:opt.spn-1;if(spk>=0){const sp=M(GEO.vplane,SPM[spk],s*(d.w/2+0.024),d.ny+(d.ex==='proto'?0.02:-0.08),ZS,0.7,0.19,1,0,s*Math.PI/2,0);sp.castShadow=false;}}}
B(CM.grille,d.w*0.48,0.13,0.05,0,d.hl[1]-0.1,d.hl[0]+0.02);B(CM.grille,d.w*0.6,0.09,0.05,0,d.body[0][1]+0.12,d.body[1][0]+0.05);
if(d.ex!=='proto')for(const x of[-0.3,0.3]){const wp=B(T,0.5,0.015,0.03,x,d.cab[0][1]+0.05,d.cab[0][0]-0.1);wp.rotation.y=x>0?0.12:-0.12;}
if(d.ex==='rally')M(GEO.cyl,T,0.42,d.cab[2][1]+0.3,d.cab[2][0]+0.25,0.012,0.6,0.012);}
{const ol=bodyOutline(d),yb=d.body[0][1],topY=z=>{let b=null,bd=1e9;for(const v of ol)if(v.y>yb+0.05&&Math.abs(v.x-z)<bd){bd=Math.abs(v.x-z);b=v.y;}return b===null?0.8:b;};
for(const s of[-1,1]){const mx=s*(d.cw/2+0.13),my=d.cab[0][1]+0.14,mz=d.cab[0][0]-0.25;if(d.ex!=='proto'){B(CM.chrome,0.15,0.085,0.01,mx,my,mz-0.07);B(CM.trim,0.12,0.03,0.05,s*(d.cw/2+0.04),my-0.05,mz);}
for(const o of[-0.1,0.1])M(GEO.ball,CM.chrome,s*(d.w/2-0.36)+o,d.hl[1],d.hl[0]+0.09,0.055,0.055,0.03);B(CM.drl,0.36,0.02,0.02,s*(d.w/2-0.34),d.tl[1]+0.07,d.tl[0]-0.08);
B(CM.cal,0.07,0.05,0.12,s*0.48,0.33,d.hl[0]+0.0);}
if(d.ex!=='muscle')for(const x of[-0.6,-0.3,0,0.3,0.6])B(T,0.02,0.12,0.42,x,yb-0.01,z0+0.25);
if(d.ex==='gt'||d.ex==='proto'||d.ex==='touring')for(const s of[-1,1]){const cn=B(T,0.2,0.02,0.24,s*(d.w/2-0.02),0.44,d.hl[0]-0.12);cn.rotation.z=s*0.25;}
if(d.ex==='gt'||d.ex==='rally'||d.ex==='touring')for(const s of[-1,1])B(CM.grille,0.42,0.012,0.22,s*0.34,topY(1.2)+0.078,1.2);
if(d.ex==='gt'||d.ex==='muscle')B(T,0.06,0.07,0.2,0,Math.max(d.cab[1][1],d.cab[2][1])+0.05,d.cab[2][0]+0.1);
if(d.ex!=='proto'){const a=[d.cab[0][0]+(d.cab[1][0]-d.cab[0][0])*0.87,d.cab[0][1]+(d.cab[1][1]-d.cab[0][1])*0.87];const ss_=seg(T,a,d.cab[1],0,d.cw*0.9,0.01,0.03);ss_.userData.dyn=1;HEAD.push(ss_);
M(GEO.cyl,CM.chrome,-(d.w/2+0.004),(d.cab[0][1]+d.cab[3][1])/2-0.16,d.cab[3][0]-0.15,0.085,0.012,0.085,0,0,Math.PI/2);}}
const wh=[],fr=[],Wd=d.wh;
for(const q of[[-1,Wd.f,1],[1,Wd.f,1],[-1,Wd.b,0],[1,Wd.b,0]]){const s=q[0],r=q[2]?Wd.r:Wd.rr,pv=new THREE.Group();pv.position.set(s*Wd.x,r,q[1]);const w=wheel(s,opt.rim===undefined||opt.rim<0?d.rim:['chrome','dark','white','gold'][opt.rim]);w.scale.setScalar(r);pv.add(w);{const fe=new THREE.Mesh(FEND,paint);fe.rotation.y=Math.PI/2;fe.scale.set(r*1.18,r*1.18,r*0.9);fe.position.set(q[0]*Wd.x+s*0.04,r,q[1]);fe.castShadow=true;inn.add(fe);}
const cl=new THREE.Mesh(WG.cal,CM.cal);cl.scale.setScalar(r);cl.position.set(s*0.05*r,r*0.4,r*0.25);pv.add(cl);g.add(pv);wh.push(w);if(q[2])fr.push(pv);}
const bl=new THREE.Mesh(GEO.plane,CM.blob);bl.scale.set(d.w+0.5,1,z1-z0+0.5);bl.position.y=0.17;g.add(bl);
{const spk=opt.spn===undefined?num%SPM.length:opt.spn-1;if(spk>=0){const top=d.ex==='proto'?[ -2.2,1.21]:[(d.cab[1][0]+d.cab[2][0])/2,Math.max(d.cab[1][1],d.cab[2][1])+0.096];const sw_=d.ex==='proto'?d.w*0.62:d.cw*0.66;const rp=M(GEO.plane,SPM[spk],0,top[1],top[0],sw_,1,sw_/3.4,0,Math.PI,0);rp.castShadow=false;}}
const LG=[];for(const s of[-1,1]){const h=new THREE.Sprite(GLOWH);h.scale.set(1.6,1.6,1);h.position.set(s*(d.w/2-0.36),d.hl[1],d.hl[0]+0.18);h.visible=false;g.add(h);LG.push(h);
const t=new THREE.Sprite(GLOWT);t.scale.set(0.9,0.9,1);t.position.set(s*(d.w/2-0.34),d.tl[1],d.tl[0]-0.18);t.visible=false;g.add(t);LG.push(t);}
const pool=new THREE.Mesh(GEO.plane,POOLM);pool.scale.set(5,1,11);pool.position.set(0,0.16,d.hl[0]+6.5);pool.visible=false;pool.renderOrder=2;g.add(pool);
const mg=mergeGroup(inn).concat(mergeGroup(ins));inn.children.forEach(o=>{if(o.isMesh&&!o.userData.dyn)o.castShadow=o.material===paint||o.material===CM.trim||o.material===CM.glass||o.material===CM.glassL;});ins.traverse(o=>{if(o.isMesh)o.castShadow=false;});
return{gauge:gp,wscr:WSCR,g,inn,ins,wh,fr,tail,paint,fl,sw:SW,hx,hy,hz,head:HEAD,lg:LG,pool,dis(){[paint,acc,tail,hm,suit,bol,shoe].forEach(m=>m.dispose());nm.map.dispose();nm.dispose();mg.forEach(x=>x.dispose());(dr.userData.geos||[]).forEach(x=>x.dispose());wh.forEach(w=>(w.userData.geos||[]).forEach(x=>x.dispose()));}};}

const PN=1400,pPos=new Float32Array(PN*3).fill(-9999),pCol=new Float32Array(PN*3),pSz=new Float32Array(PN),pAl=new Float32Array(PN),pVel=new Float32Array(PN*3),pLife=new Float32Array(PN),pMax=new Float32Array(PN),pS0=new Float32Array(PN),pG=new Float32Array(PN),pA0=new Float32Array(PN);let pI=0;
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3));pGeo.setAttribute('size',new THREE.BufferAttribute(pSz,1));pGeo.setAttribute('alpha',new THREE.BufferAttribute(pAl,1));
const pMat=new THREE.ShaderMaterial({uniforms:{map:{value:smokeT},sc:{value:500}},vertexColors:true,transparent:true,depthWrite:false,
vertexShader:'attribute float size;\nattribute float alpha;\nuniform float sc;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_vertex>\nvoid main(){vC=color;vA=alpha;vR=fract(sin(position.x*12.9+position.z*7.3)*437.5)*6.28;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=min(180.0,size*sc/max(0.5,-mv.z));gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'uniform sampler2D map;\nvarying vec3 vC;\nvarying float vA;\nvarying float vR;\n#include <common>\n#include <logdepthbuf_pars_fragment>\nvoid main(){\n#include <logdepthbuf_fragment>\nvec2 p=gl_PointCoord-0.5;float c=cos(vR),s=sin(vR);p=vec2(c*p.x-s*p.y,s*p.x+c*p.y)+0.5;vec4 t=texture2D(map,p);float a=t.a*vA;if(a<0.003)discard;gl_FragColor=vec4(vC*(0.85+0.15*t.r),a);}'});
const parts=new THREE.Points(pGeo,pMat);parts.frustumCulled=false;parts.renderOrder=5;scene.add(parts);
function emit(x,z,c,vy,big){const i=pI;pI=(pI+1)%PN;pPos[i*3]=x+(Math.random()-0.5)*0.7;pPos[i*3+1]=0.35;pPos[i*3+2]=z+(Math.random()-0.5)*0.7;
pVel[i*3]=(Math.random()-0.5)*0.05;pVel[i*3+1]=vy+Math.random()*0.025;pVel[i*3+2]=(Math.random()-0.5)*0.05;pCol[i*3]=c[0];pCol[i*3+1]=c[1];pCol[i*3+2]=c[2];
if(big===3){pVel[i*3]=(Math.random()-0.5)*0.32;pVel[i*3+1]=0.05+Math.random()*0.09;pVel[i*3+2]=(Math.random()-0.5)*0.32;pPos[i*3+1]=0.5;pMax[i]=pLife[i]=14+Math.random()*14;pS0[i]=0.22;pG[i]=0;pA0[i]=1;return;}if(big===2){pMax[i]=pLife[i]=30+Math.random()*20;pS0[i]=0.5;pG[i]=1.8;pA0[i]=0.28;return;}pMax[i]=pLife[i]=(big?90:70)+Math.random()*50;pS0[i]=big?1.2:0.8;pG[i]=big?6:4.2;pA0[i]=big?0.42:0.5;}
function dustStep(d){for(let i=0;i<PN;i++){if(pLife[i]<=0)continue;pLife[i]-=d;if(pLife[i]<=0){pPos[i*3+1]=-9999;pAl[i]=0;continue;}const t=1-pLife[i]/pMax[i];
pPos[i*3]+=(pVel[i*3]+0.012)*d;pPos[i*3+1]+=pVel[i*3+1]*d;pPos[i*3+2]+=(pVel[i*3+2]+0.006)*d;pVel[i*3]*=Math.pow(0.985,d);pVel[i*3+2]*=Math.pow(0.985,d);pVel[i*3+1]*=Math.pow(0.975,d);if(pG[i]===0){pVel[i*3+1]-=0.009*d;if(pPos[i*3+1]<0.05){pPos[i*3+1]=0.05;pVel[i*3+1]*=-0.35;}}
pSz[i]=pS0[i]+pG[i]*Math.sqrt(t);pAl[i]=pA0[i]*Math.pow(1-t,1.6)*Math.min(1,t*10);}
pGeo.attributes.position.needsUpdate=true;pGeo.attributes.color.needsUpdate=true;pGeo.attributes.size.needsUpdate=true;pGeo.attributes.alpha.needsUpdate=true;}
function partsReset(){pLife.fill(0);pPos.fill(-9999);pAl.fill(0);}
const FLG=K(new THREE.ConeGeometry(0.13,1,12,1,true).translate(0,0.5,0).rotateX(-Math.PI/2)),FLG2=K(new THREE.ConeGeometry(0.07,0.6,10,1,true).translate(0,0.3,0).rotateX(-Math.PI/2));
const FLM=new THREE.MeshBasicMaterial({color:0x4d8dff,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),FLM2=new THREE.MeshBasicMaterial({color:0xd9ecff,transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const FEND=K(new THREE.TorusGeometry(1,0.17,10,24,Math.PI)),PLATE=K(new THREE.BoxGeometry(0.52,0.13,0.03));
const plT=ctex(128,32,x=>{x.fillStyle='#f4f4f4';x.fillRect(0,0,128,32);x.fillStyle='#1b4fd8';x.fillRect(0,0,14,32);x.fillStyle='#111';x.font='bold 20px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('RLY-026',71,17);x.strokeStyle='#222';x.lineWidth=2;x.strokeRect(1,1,126,30);});
const PLM=L(0xffffff,{map:plT});
const GLOWH=new THREE.SpriteMaterial({map:glowT,color:0xfff1cf,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.9}),GLOWT=new THREE.SpriteMaterial({map:glowT,color:0xff2a1a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.7});
const poolT=ctex(128,256,x=>{x.save();x.scale(1,2);const g=x.createRadialGradient(64,118,2,64,70,62);g.addColorStop(0,'rgba(255,240,210,0.9)');g.addColorStop(0.45,'rgba(255,240,210,0.32)');g.addColorStop(1,'rgba(255,240,210,0)');x.fillStyle=g;x.fillRect(0,0,128,128);x.restore();});
const POOLM=new THREE.MeshBasicMaterial({map:poolT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.42});
const GAUGEM=new THREE.MeshBasicMaterial({map:ctex(256,96,x=>{x.fillStyle='#0b0d10';x.fillRect(0,0,256,96);for(const cx of[64,192]){x.strokeStyle='#2a2f38';x.lineWidth=6;x.beginPath();x.arc(cx,52,36,Math.PI*0.75,Math.PI*2.25);x.stroke();x.strokeStyle='#ff5a36';x.lineWidth=4;x.beginPath();x.arc(cx,52,36,Math.PI*0.75,Math.PI*1.6);x.stroke();x.strokeStyle='#e8eef5';x.lineWidth=2;for(let i=0;i<=10;i++){const a=Math.PI*0.75+i*Math.PI*0.15;x.beginPath();x.moveTo(cx+Math.cos(a)*28,52+Math.sin(a)*28);x.lineTo(cx+Math.cos(a)*34,52+Math.sin(a)*34);x.stroke();}}x.fillStyle='#3ddc97';x.fillRect(118,30,20,8);x.fillStyle='#9aa1ad';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('RALLY',128,80);})});
const SPM=[['TURBO GUMI','#c81d25'],['NITRO+','#1f6feb'],['ÁSZ MOTOR','#ff7a00'],['RALLY 26','#111']].map(a=>new THREE.MeshStandardMaterial({map:ctex(256,64,x=>{x.fillStyle=a[1];x.beginPath();x.roundRect?x.roundRect(2,6,252,52,10):x.rect(2,6,252,52);x.fill();x.fillStyle='#fff';x.font='800 34px Inter,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(a[0],128,33);}),alphaTest:0.5,roughness:0.35,metalness:0.1}));
const SKN=2600,skid=new THREE.InstancedMesh(K(new THREE.PlaneGeometry(0.3,0.75).rotateX(-Math.PI/2)),new THREE.MeshBasicMaterial({color:0x0d0d0d,transparent:true,opacity:0.36,depthWrite:false}),SKN);skid.count=0;skid.frustumCulled=false;scene.add(skid);let skidI=0;
function addSkid(x,z,a){DO.position.set(x,0.125,z);DO.rotation.set(0,a,0);DO.scale.set(1,1,1);DO.updateMatrix();skid.setMatrixAt(skidI,DO.matrix);skidI=(skidI+1)%SKN;skid.count=Math.min(SKN,skid.count+1);skid.instanceMatrix.needsUpdate=true;}

let AC=null,eo1,eo2,ef,eg,sqG,crG=null,CHEER=0,snd=true,lastThud=0;
function ain(){if(AC){if(AC.resume)AC.resume();return;}try{AC=new(window.AudioContext||window.webkitAudioContext)();eo1=AC.createOscillator();eo1.type='sawtooth';eo2=AC.createOscillator();eo2.type='square';ef=AC.createBiquadFilter();ef.type='lowpass';ef.frequency.value=500;ef.Q.value=3;eg=AC.createGain();eg.gain.value=0;const g2=AC.createGain();g2.gain.value=0.4;eo1.connect(ef);eo2.connect(g2);g2.connect(ef);ef.connect(eg);eg.connect(AC.destination);eo1.start();eo2.start();
const nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate),dd=nb.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=5;sqG=AC.createGain();sqG.gain.value=0;ns.connect(bp);bp.connect(sqG);sqG.connect(AC.destination);ns.start();{const n2=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d2=n2.getChannelData(0);let lp=0;for(let i=0;i<d2.length;i++){lp=lp*0.6+(Math.random()*2-1)*0.4;d2[i]=lp*(0.7+0.3*Math.sin(i/AC.sampleRate*7.3)*Math.sin(i/AC.sampleRate*2.1));}const cs=AC.createBufferSource();cs.buffer=n2;cs.loop=true;const cb=AC.createBiquadFilter();cb.type='bandpass';cb.frequency.value=700;cb.Q.value=0.6;const cl=AC.createBiquadFilter();cl.type='lowpass';cl.frequency.value=2200;crG=AC.createGain();crG.gain.value=0;cs.connect(cb);cb.connect(cl);cl.connect(crG);crG.connect(AC.destination);cs.start();}}catch(e){AC=null;}}
function engine(on,rpm,slip){if(!AC)return;const t=AC.currentTime,f=50+rpm*125;eo1.frequency.setTargetAtTime(f,t,0.04);eo2.frequency.setTargetAtTime(f*0.5,t,0.04);ef.frequency.setTargetAtTime(380+rpm*1400,t,0.05);const V=[0,0.45,1,1.6][SET.vol];eg.gain.setTargetAtTime(on&&snd?(0.028+rpm*0.022)*V:0,t,0.08);sqG.gain.setTargetAtTime(on&&snd?Math.min(0.06,Math.max(0,slip-0.03)*0.8)*V:0,t,0.05);}
function crowdSnd(lv,on){if(!AC||!crG)return;const V=[0,0.45,1,1.6][SET.vol];crG.gain.setTargetAtTime(on&&snd?(0.006+lv*0.07+CHEER*0.09)*V:0,AC.currentTime,0.25);}
function cheer(v){CHEER=Math.max(CHEER,v);}
function beep(f,du,v){if(!AC||!snd)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime((v||0.05)*[0,0.45,1,1.6][SET.vol]+0.0001,t);g.gain.exponentialRampToValueAtTime(0.0001,t+du);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+du+0.02);}
let HIT=0;function sparks(x,z,n){for(let k=0;k<n;k++)emit(x,z,[1,0.62+Math.random()*0.25,0.22],0,3);}
function thud(s){HIT=Math.max(HIT,Math.min(0.5,(s||0.1)*0.9));const n=performance.now();if(n-lastThud<300)return;lastThud=n;beep(70+Math.random()*30,0.12+Math.min(0.25,(s||0)*0.4),Math.min(0.2,0.05+(s||0.1)*0.35));if(s>0.25)setTimeout(()=>beep(140,0.06,0.04),40);}

function whoosh(){if(!AC||!snd)return;const t=AC.currentTime,n=AC.createBufferSource(),b=AC.createBuffer(1,AC.sampleRate*0.7,AC.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;n.buffer=b;
const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2600,t+0.5);const g=AC.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.09*[0,0.45,1,1.6][SET.vol]+0.0001,t+0.08);g.gain.exponentialRampToValueAtTime(0.0001,t+0.65);n.connect(f);f.connect(g);g.connect(AC.destination);n.start(t);n.stop(t+0.7);}
