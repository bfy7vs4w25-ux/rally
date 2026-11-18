let cars=[],pl=null,mode='menu',gt=0,lapStart=0,best=null,finN=0,cdE=0,lastPos=9,lastLit=-1,doneT=0,camMode=0,towerT=0;
const keys={up:0,down:0,left:0,right:0,hb:0,n:0};
function place(c){c.px=c.x;c.pz=c.z;c.pa=c.a;c.rx=c.x;c.rz=c.z;c.ra=c.a;c.v3.g.position.set(c.x,0,c.z);c.v3.g.rotation.y=c.a;}
function near(c){let b=1e9,bi=c.idx;for(let o=-24;o<=24;o++){const k=(c.idx+o+NP)%NP,p=P[k],d=(p.x-c.x)**2+(p.z-c.z)**2;if(d<b){b=d;bi=k;}}
let dl=bi-c.idx;if(dl>NP/2)dl-=NP;if(dl<-NP/2)dl+=NP;c.prog+=dl;c.idx=bi;c.dist=Math.sqrt(b);const t=TA[bi];c.lat=(c.x-P[bi].x)*t.z-(c.z-P[bi].z)*t.x;}
function newRace(spec){
cars.forEach(c=>{scene.remove(c.v3.g);c.v3.dis();});cars=[];finN=0;best=null;lapStart=0;gt=0;lastPos=9;skid.count=0;skidI=0;partsReset();
let list;if(spec)list=spec.cars;else{const n=OPP[cfg.o]+1,ps=Math.min(n-1,Math.floor(n/2)),pc=COLS[cfg.k][1],ac=COLS.map(c=>c[1]).filter(c=>c!==pc);list=[];
for(let k=0;k<n;k++)list.push(k===ps?{id:'p',ty:cfg.c,col:pc,num:NUMS[cfg.num],role:'p',opt:myOpt()}:{id:'a'+k,ty:(k*3+cfg.c+1)%4,col:ac[(k*5+2)%ac.length],num:[11,23,4,88,16,31,9,55][k],name:DRV[k],role:'ai',opt:aiOpt(k)});}
const me=spec?(NET.host?'h':'g'):'p';
list.forEach((e,k)=>{const isP=e.role===me,human=e.role!=='ai',net=!!spec&&!isP&&(human||!NET.host),side=k%2?-1:1,idx=gridIdx(k),p=P[idx],t=TA[idx];
const v3=makeCar(e.ty,e.col,e.num,HELM[k%8],e.opt);scene.add(v3.g);
const c={v3,st:CARS[e.ty],ty:e.ty,nid:e.id,human,net,ai:!isP&&!net,pl:isP,x:p.x+t.z*side*4.5,z:p.z-t.x*side*4.5,a:Math.atan2(t.x,t.z),vx:0,vz:0,v:0,sv:0,slip:0,brk:false,hb:false,on:true,kerb:false,draft:0,
idx,prog:idx-NP,ld:-1,dist:0,lat:0,lost:0,avoid:0,skill:[0.86,0.93,0.99][cfg.d]-Math.random()*0.03,react:200+Math.random()*450,err:Math.random()*6,fin:0,ft:0,
name:isP?(SET.name||T('you')):human?((NET.remote&&NET.remote.name)||T('friend')):e.name,hex:'#'+new THREE.Color(e.col).getHexString(),skx:0,skz:0,stuck:0,px:0,pz:0,pa:0,rx:0,rz:0,ra:0,tx:0,tz:0,ta:0,hasNet:false,av:0,nit:50,boost:false,yr:0,wt:0,gear:1,shiftT:0,rpm:0.2,spin:0};
if(human&&!isP)addTag(c);cars.push(c);if(isP)pl=c;});
cars.forEach(c=>{near(c);place(c);c.tx=c.x;c.tz=c.z;c.ta=c.a;});}
const GR=[0,0.2,0.36,0.52,0.68,0.84,9],GTQ=[1.5,1.28,1.1,0.97,0.87,0.79];
function phys(c,i,d){const st=c.st,on=c.dist<HW+0.4,kerb=!on&&c.dist<HW+2.3&&CUR[c.idx],offr=!on&&!kerb,sf=offr?st.off*WX.off:WX.road*(kerb?0.96:1);
let pud=0;if(WX.wet>0.15&&on){const pl_=PUDI.get(c.idx);if(pl_)for(const q of pl_){const p=PUD[q];if((c.x-p[0])**2+(c.z-p[1])**2<p[2]*p[2]){pud=1;break;}}}c.pud=pud;
const sf2=pud?sf*(1-0.42*WX.wet):sf;
const fx=Math.sin(c.a),fz=Math.cos(c.a);let vf=c.vx*fx+c.vz*fz,vl=c.vx*fz-c.vz*fx;
const sens=c.pl?[0.72,1,1.3][SET.steer]:1,ts=Math.max(-1,Math.min(1,i.s));c.sv+=(ts-c.sv)*Math.min(1,(Math.abs(ts)<Math.abs(c.sv)?0.32:0.12*sens)*d);
const wantB=!!i.n&&!offr&&vf>0.15&&c.nit>(c.boost?0.5:12);if(wantB&&!c.boost&&c.pl)whoosh();c.boost=wantB;
if(c.boost)c.nit=Math.max(0,c.nit-0.42*d);else c.nit=Math.min(100,c.nit+(0.02+(c.slip>0.05&&on&&vf>0.5?Math.min(0.22,c.slip*2.4):0)+(c.draft?0.05:0))*d);
const spd=Math.abs(vf),mx=(offr?st.offMax:st.max*(c.draft?1.05:1))*(c.boost?1.09:1);
const fr=Math.max(0,vf)/st.max;let g=c.gear||1;while(g<6&&fr>GR[g])g++;while(g>1&&fr<GR[g-1]-0.05)g--;if(g>c.gear&&vf>0.05)c.shiftT=120;c.gear=g;
c.rpm=0.2+0.8*Math.max(0,Math.min(1,(fr-GR[g-1])/((g<6?GR[g]:1.1)-GR[g-1])));c.shiftT=Math.max(0,c.shiftT-d*16.67);
let wt=0;c.spin=0;
if(i.up>0){if(vf<-0.01)vf+=st.brk*i.up*d;else{let a=st.acc*(c.boost?1.75:i.up)*GTQ[g-1]*(c.shiftT>0?0.3:1)*Math.max(0,1-Math.pow(Math.max(0,vf)/mx,2.2))*(c.draft?1.12:1);
if(st.rwd&&vf<0.35&&i.up>0.9&&!c.ai){a*=0.88;c.spin=1;}vf+=a*d;wt=-0.7*i.up*(g<=2?1:0.55);}}
if(i.down>0){if(vf>0.02){const b=st.brk*(0.78+0.35*Math.min(1,vf))*i.down*(offr?0.62:1)*(0.7+0.3*sf);vf=Math.max(0,vf-b*d);wt=i.down;}else vf=Math.max(-0.32,vf-0.01*i.down*d);}
if(i.up<=0&&i.down<=0){vf*=Math.pow(0.9935,d);wt=0.2;}
vf*=Math.pow(offr?1-0.018*WX.drag:0.9988,d);if(vf>mx)vf=Math.max(mx,vf-(offr?0.03:0.01)*d);
c.wt+=(wt-c.wt)*Math.min(1,0.12*d);
let grip=st.grip*sf2*(c.boost?0.94:1)*(1-0.2*Math.min(1,(i.down||0)*Math.max(0,vf-0.3)*2))*(1+(st.df||0)*vf*vf),rearK=1;
if(st.rwd&&i.up>0.6&&vf>0.1&&vf<st.max*0.75)rearK-=0.24*st.rwd*i.up*Math.abs(c.sv)*(1-vf/st.max)*(c.ai?0.45:1);
rearK*=1-0.1*Math.max(0,-c.wt);
let yawT=vf*c.sv*(0.5/(1+spd*4.2))/2.6*(1+0.3*c.wt);
if(i.hb){grip*=0.34;yawT*=1.5;rearK*=0.6;if(spd>0.02)vf-=Math.sign(vf)*Math.min(spd,0.008*d);}
const lim=grip*1.35/Math.max(0.06,spd);if(Math.abs(yawT)>lim)yawT=Math.sign(yawT)*lim;
yawT+=(1-rearK)*c.sv*0.014*Math.min(1,spd*2);
if(!i.hb&&spd>0.3&&c.slip>0.04){const va=Math.atan2(c.vx,c.vz);yawT+=wrap(va-c.a)*0.012;}
c.yr+=(yawT-c.yr)*Math.min(1,0.3*WX.resp*(st.resp||1)*d);c.a+=c.yr*d;if(c.av){c.a+=c.av*d;c.yr*=Math.pow(0.97,Math.abs(c.av)*40*d);c.av*=Math.pow(0.935,d);if(Math.abs(c.av)<2e-4)c.av=0;}
const gx=Math.sin(c.a),gz=Math.cos(c.a),wx=vf*fx+vl*fz,wz=vf*fz-vl*fx;vf=wx*gx+wz*gz;vl=wx*gz-wz*gx;
const rm=grip*(0.45+0.55*rearK)*d;vl=Math.abs(vl)<=rm?0:vl-Math.sign(vl)*rm;c.slip=Math.abs(vl);vf-=Math.sign(vf)*Math.min(Math.abs(vf),c.slip*0.05*d);
c.vx=vf*gx+vl*gz;c.vz=vf*gz-vl*gx;c.x+=c.vx*d;c.z+=c.vz*d;c.v=vf;c.brk=i.down>0.3&&vf>0.05;c.hb=!!i.hb;c.on=on;c.kerb=kerb;}
function aiInput(c){if(gt<c.react)return{up:0,down:0,s:0,hb:0};
const v=Math.max(0,c.v),lim=HW-1.8;let blk=null;
for(const o of cars){if(o===c)continue;const dp=o.prog-c.prog;if(dp>0&&dp<14&&Math.abs(o.lat-c.lat)<3.6&&(!blk||dp<blk.dp))blk={o,dp};}
let tA=0,cap=9;
if(blk){const o=blk.o,base=RL[c.idx],L1=o.lat+4.4,R1=o.lat-4.4,okL=L1<lim,okR=R1>-lim;let side=null;
if(okL&&okR)side=Math.abs(L1-base)<Math.abs(R1-base)?L1:R1;else if(okL)side=L1;else if(okR)side=R1;
if(side!==null)tA=side-base;if(o.v<c.v&&blk.dp<6)cap=o.v*(side===null?0.97:1.02);}
c.avoid+=(tA-c.avoid)*(blk?0.07:0.03);
const la=Math.round(6+v*9),k=(c.idx+la)%NP,t=TA[k],p=P[k],off=Math.max(-lim,Math.min(lim,RL[k]+c.avoid));
const da=wrap(Math.atan2(p.x+t.z*off-c.x,p.z-t.x*off-c.z)-c.a);
const vp=VP[c.ty];let tv=Math.min(vp[(c.idx+2)%NP],vp[(c.idx+5)%NP]);
let sk=c.skill*(1+0.025*Math.sin(gt*0.00045+c.err));
if(c!==pl&&!pl.fin){const gap=(c.prog-pl.prog)/NP;sk*=1-Math.max(-0.05,Math.min(0.05,gap*0.1));}
let n=0;if(c.on&&v>0.55&&c.nit>(c.boost?3:28+(1-c.skill)*60)&&!(blk&&blk.dp<5)){let mn=9;for(let j=4;j<50;j+=6)mn=Math.min(mn,vp[(c.idx+j)%NP]);if(mn>=c.st.max*0.96)n=1;}
tv=Math.min(tv*sk*(n?1.09:1),cap);if(!c.on)tv=Math.min(tv,c.st.offMax);const dv=tv-c.v;
return{up:dv>0?Math.min(1,dv*50):0,down:dv<-0.012?Math.min(1,-dv*30):0,s:Math.max(-1,Math.min(1,da*3)),hb:0,n};}
function respawn(c){const p=P[c.idx],t=TA[c.idx];let lat=0;for(const o of cars)if(o!==c&&Math.hypot(o.x-p.x,o.z-p.z)<5)lat=o.lat>0?-5:5;c.x=p.x+t.z*lat;c.z=p.z-t.x*lat;c.a=Math.atan2(t.x,t.z);c.vx=c.vz=c.v=0;c.av=0;c.yr=0;c.lost=0;c.stuck=0;c.dist=Math.abs(lat);place(c);}
function hitSpin(c,rx,rz,dvx,dvz,k){c.av=Math.max(-0.09,Math.min(0.09,(c.av||0)+(rz*dvx-rx*dvz)/2.3*(k||1)));const f=Math.sin(c.a),g=Math.cos(c.a),lat=dvx*g-dvz*f,lon=dvx*f+dvz*g;c.rv=(c.rv||0)-lat*0.05;c.pv=(c.pv||0)+lon*0.035;}
function circs(c){const f=Math.sin(c.a),g=Math.cos(c.a),o=c.st.ho,z=c.st.zc;return[[c.x+f*(z+o),c.z+g*(z+o)],[c.x+f*z,c.z+g*z],[c.x+f*(z-o),c.z+g*(z-o)]];}
function obCol(c){const cr=c.st.cr;for(let it=0;it<2;it++){const C=circs(c);let hit=null,best=0;
for(const q of C)obEach(q[0],q[1],o=>{const dx=q[0]-o[0],dz=q[1]-o[1],dd=Math.hypot(dx,dz),m=o[2]+cr;if(dd<m&&dd>1e-3&&m-dd>best){best=m-dd;hit=[dx/dd,dz/dd,q[0]-c.x-dx/dd*cr,q[1]-c.z-dz/dd*cr];}return false;});
if(!hit)return;const nx=hit[0],nz=hit[1];c.x+=nx*best;c.z+=nz*best;const vn=c.vx*nx+c.vz*nz;
if(vn<0){const ox=c.vx,oz=c.vz;c.vx-=1.3*vn*nx;c.vz-=1.3*vn*nz;c.vx*=0.86;c.vz*=0.86;hitSpin(c,hit[2],hit[3],c.vx-ox,c.vz-oz,1.1);if(vn<-0.1)sparks(c.x+hit[2],c.z+hit[3],Math.min(14,Math.round(-vn*30)));if(c.pl&&vn<-0.12)thud(-vn);}}}
function pairHit(a,b){const A=circs(a),B=circs(b),R=a.st.cr+b.st.cr;let best=0,h=null;
for(const p of A)for(const q of B){const dx=q[0]-p[0],dz=q[1]-p[1],dd=Math.hypot(dx,dz);if(dd<R&&R-dd>best){best=R-dd;const nx=dd>1e-4?dx/dd:Math.sin(a.a+1.57),nz=dd>1e-4?dz/dd:Math.cos(a.a+1.57);h={o:best,nx,nz,ax:p[0]+nx*a.st.cr-a.x,az:p[1]+nz*a.st.cr-a.z,bx:q[0]-nx*b.st.cr-b.x,bz:q[1]-nz*b.st.cr-b.z};}}return h;}
function collide(){for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++){const a=cars[i],b=cars[j];if(a.net&&b.net)continue;if(Math.abs(b.x-a.x)>7||Math.abs(b.z-a.z)>7)continue;
for(let it=0;it<2;it++){const h=pairHit(a,b);if(!h)break;const nx=h.nx,nz=h.nz;
if(a.net||b.net){const Lc=a.net?b:a,O=a.net?a:b,sg=Lc===a?-1:1,ux=nx*sg,uz=nz*sg;Lc.x+=ux*h.o;Lc.z+=uz*h.o;const vn=(Lc.vx-O.vx)*ux+(Lc.vz-O.vz)*uz;
if(vn<0&&it===0){const ox=Lc.vx,oz=Lc.vz;Lc.vx-=1.2*vn*ux;Lc.vz-=1.2*vn*uz;const px=Lc===a?h.ax:h.bx,pz=Lc===a?h.az:h.bz;hitSpin(Lc,px,pz,Lc.vx-ox,Lc.vz-oz);if(vn<-0.15)sparks(Lc.x+px,Lc.z+pz,Math.min(10,Math.round(-vn*20)));if(Lc.pl&&vn<-0.08)thud(-vn);}continue;}
const ma=a.st.m,mb=b.st.m,s=ma+mb;a.x-=nx*h.o*mb/s;a.z-=nz*h.o*mb/s;b.x+=nx*h.o*ma/s;b.z+=nz*h.o*ma/s;if(it)continue;
const rv=(b.vx-a.vx)*nx+(b.vz-a.vz)*nz;if(rv<0){const im=1/ma+1/mb,jj=-1.3*rv/im,tx=-nz,tz=nx,rt=(b.vx-a.vx)*tx+(b.vz-a.vz)*tz,jt=Math.max(-0.45*jj,Math.min(0.45*jj,-rt/im*0.5)),Jx=jj*nx+jt*tx,Jz=jj*nz+jt*tz;
a.vx-=Jx/ma;a.vz-=Jz/ma;b.vx+=Jx/mb;b.vz+=Jz/mb;hitSpin(a,h.ax,h.az,-Jx/ma,-Jz/ma);hitSpin(b,h.bx,h.bz,Jx/mb,Jz/mb);
if(rv<-0.15)sparks(a.x+h.ax,a.z+h.az,Math.min(12,Math.round(-rv*22)));if((a.pl||b.pl)&&rv<-0.08)thud(-rv);}}}}
function step(d,dt){
for(const c of cars){c.px=c.x;c.pz=c.z;c.pa=c.a;}
for(const c of cars){c.draft=0;if(c.v<0.5)continue;const fx=Math.sin(c.a),fz=Math.cos(c.a);for(const o of cars){if(o===c)continue;const dx=o.x-c.x,dz=o.z-c.z,dd=Math.hypot(dx,dz);if(dd>4&&dd<30&&(dx*fx+dz*fz)/dd>0.975&&o.v>0.5){c.draft=1;break;}}}
for(const c of cars){if(c.net){netStep(c,d);continue;}const inp=c.ai?aiInput(c):mode==='pause'?{up:0,down:0,s:0,hb:0,n:0}:{up:keys.up,down:keys.down,s:keys.left-keys.right,hb:keys.hb,n:keys.n};
phys(c,inp,d);wxForce(c,d);obCol(c);near(c);
if(c.dist>HW+16){c.lost+=dt;if(c.lost>1500)respawn(c);}else c.lost=0;
if(c.ai&&gt>c.react+2000&&Math.abs(c.v)<0.04){c.stuck+=dt;if(c.stuck>2500)respawn(c);}else c.stuck=0;
const ld=Math.floor(c.prog/NP);
if(ld>c.ld){if(c.pl&&!c.fin&&c.ld>=0){const lt=gt-lapStart;c.last=lt;if(best===null||lt<best){if(best!==null)toast(T('newBest')+fmt(lt),'#b18cff');best=lt;}lapStart=gt;}
c.ld=ld;if(c.pl&&!c.fin&&ld===LAPS[cfg.l]-1&&ld>0)setTimeout(()=>{if(mode==='race')toast(T('lastLap'),'#ffb020');},1500);
if(ld>=LAPS[cfg.l]&&!c.fin){c.fin=++finN;c.ft=gt;if(c.pl)finish();}}}
collide();
const cx=cam.position.x,cz=cam.position.z;
for(const c of cars){if((c.x-cx)**2+(c.z-cz)**2>130*130||Math.abs(c.v)<0.1)continue;const fx=Math.sin(c.a),fz=Math.cos(c.a),rx=c.x-fx*1.4,rz=c.z-fz*1.4;
if(WX.type==='rain'&&c.on&&Math.abs(c.v)>0.5&&Math.random()<(c.pud?0.9:0.22)*Math.min(1,c.v)*d)emit(rx-fx*0.5,rz-fz*0.5,[0.8,0.82,0.86],0.04,c.pud?1:2);
if(c.spin&&Math.random()<0.7*d)emit(rx,rz,[0.88,0.88,0.9],0.03,0);
if(!c.on&&!c.kerb){if(Math.random()<0.8*d)emit(rx,rz,TH0.dust,0.05,1);}
else{const sk=c.slip>0.05||(c.hb&&Math.abs(c.v)>0.25)||(c.brk&&c.v>0.95);
if(sk){if(Math.random()<Math.min(1,0.35+c.slip*6)*d)emit(rx,rz,[0.86,0.86,0.89],0.03,0);if(Math.hypot(c.x-c.skx,c.z-c.skz)>0.6){c.skx=c.x;c.skz=c.z;const va=Math.atan2(c.vx,c.vz);for(const s of[-1,1])addSkid(rx+fz*s*0.92,rz-fx*s*0.92,va);}}
else{c.skx=c.x;c.skz=c.z;}}}}
function addTag(c){const nm=(c.name||'').slice(0,16),hex=c.hex||'#fff',t=ctex(512,128,(x,w,h)=>{x.clearRect(0,0,w,h);x.font='700 50px Inter,system-ui,sans-serif';const tw=Math.min(w-20,x.measureText(nm).width+90),x0=(w-tw)/2,y0=8,hh=80,r=40;
x.fillStyle='rgba(10,12,18,0.84)';x.beginPath();x.moveTo(x0+r,y0);x.lineTo(x0+tw-r,y0);x.arc(x0+tw-r,y0+r,r,-Math.PI/2,Math.PI/2);x.lineTo(w/2+16,y0+hh);x.lineTo(w/2,y0+hh+22);x.lineTo(w/2-16,y0+hh);x.lineTo(x0+r,y0+hh);x.arc(x0+r,y0+r,r,Math.PI/2,Math.PI*1.5);x.closePath();x.fill();
x.strokeStyle=hex;x.lineWidth=4;x.stroke();x.fillStyle=hex;x.beginPath();x.arc(x0+40,y0+r,12,0,7);x.fill();x.fillStyle='#fff';x.textBaseline='middle';x.fillText(nm,x0+64,y0+r+2,tw-84);});
const m=new THREE.SpriteMaterial({map:t,depthTest:false,depthWrite:false,transparent:true,fog:false}),s=new THREE.Sprite(m);s.renderOrder=20;s.center.set(0.5,0);s.position.y=2.8;c.v3.g.add(s);c.tag=s;const od=c.v3.dis;c.v3.dis=function(){od.call(this);t.dispose();m.dispose();};}
function visuals(al,d,TM){for(const c of cars){c.rx=c.px+(c.x-c.px)*al;c.rz=c.pz+(c.z-c.pz)*al;c.ra=c.pa+wrap(c.a-c.pa)*al;const v=c.v3;v.g.position.set(c.rx,0,c.rz);v.g.rotation.y=c.ra;if(c.tag){const k=Math.max(1,Math.min(5,Math.hypot(cam.position.x-c.rx,cam.position.z-c.rz)/15));c.tag.scale.set(3.6*k,0.9*k,1);c.tag.position.y=2.5+0.55*k;c.tag.visible=mode!=='menu';}
const k=1-Math.exp(-d*0.25);v.fr.forEach(p=>p.rotation.y+=(c.sv*0.45/(1+Math.abs(c.v)*1.5)-p.rotation.y)*Math.min(1,k*2));const sp=c.v*d/c.st.wh.r;v.wh.forEach(w=>w.rotation.x+=sp);
const roll=Math.max(-0.07,Math.min(0.07,c.yr*Math.abs(c.v)*1.7+c.slip*Math.sign(c.sv)*0.12)),pitch=c.wt*0.03,dd=Math.min(2,d);
c.rv=(c.rv||0)+((roll-v.inn.rotation.z)*0.16-(c.rv||0)*0.3)*dd;v.inn.rotation.z+=c.rv*dd;c.pv=(c.pv||0)+((pitch-v.inn.rotation.x)*0.16-(c.pv||0)*0.3)*dd;v.inn.rotation.x+=c.pv*dd;if(v.sw)v.sw.rotation.z+=(-c.sv*1.7-v.sw.rotation.z)*Math.min(1,0.4*dd);v.inn.position.y=c.kerb&&Math.abs(c.v)>0.2?0.02+Math.sin(TM*0.09+c.x)*0.018:0;
v.tail.color.setHex(c.brk||c.hb?0xff2020:0x5a0a0a);const dark=WX.type==='rain'||WX.type==='storm'||WX.type==='snow';for(let j=0;j<v.lg.length;j++){const s=v.lg[j];if(j%2===0)s.visible=dark;else{s.visible=dark||c.brk||c.hb;const k2=(c.brk||c.hb)?1.25:0.75;s.scale.set(k2,k2,1);}}v.pool.visible=dark&&c.on;if(c.pl){const hv=camMode!==3;for(const m of v.head)m.visible=hv;}for(let j=0;j<v.fl.length;j++){const f=v.fl[j];f.visible=c.boost;if(c.boost){const k2=0.75+Math.random()*0.5;f.scale.set(1,1,j%2?k2*0.9:k2*1.2);}}}}
const rk=c=>c.fin?1e12-c.ft:c.prog;
const standings=()=>[...cars].sort((a,b)=>rk(b)-rk(a));
let tT=0;function toast(txt,col){const e=$('toast');e.textContent=txt;e.style.borderColor=col||'rgba(255,255,255,0.12)';e.style.color=col||'#fff';e.style.opacity=1;e.style.transform='translate(-50%,-50%) scale(1)';clearTimeout(tT);tT=setTimeout(()=>{e.style.opacity=0;e.style.transform='translate(-50%,-50%) scale(.85)';},1700);}
function lamps(n,green){[...$('lt').children].forEach((e,i)=>e.className='lamp'+(green?' g':i<n?' r':''));GL.forEach((m,i)=>m.color.setHex(green?0x2ee66b:i<n?0xff2d2d:0x2a2d35));}
function finish(){mode='done';cheer(1);pl.ai=true;pl.skill=0.86;doneT=0;pl.pos=standings().indexOf(pl)+1;const rec=REC[cfg.t],nr=best!==null&&(rec===undefined||best<rec);if(nr)REC[cfg.t]=best;
toast(T('finish',{p:pl.pos}),pl.pos===1?'#f5c542':'#fff');const md=['#f5c542','#c9d1d9','#d08a4f'];
$('dMd').style.background=md[pl.pos-1]||'#4a4f5a';$('dMd').style.color=pl.pos<=3?'#1a1a1a':'#fff';$('dMd').textContent=pl.pos;
$('dH').textContent=T(pl.pos===1?'win':pl.pos<=3?'podium':'good');
$('dI').textContent=T('total')+' '+fmt(pl.ft)+' · '+T('bestLap')+' '+(best===null?'–':fmt(best))+(nr?' · '+T('recordNew'):'');
setTimeout(()=>{if(mode==='done'){show('done');results(true);}},1300);}
function results(first){$('dL').innerHTML=standings().map((c,i)=>'<div class="rw'+(first?' it':'')+'" style="'+(first?'animation-delay:'+(150+i*60)+'ms;':'')+''+(c.pl?'background:rgba(255,90,54,0.16)':c.human?'background:rgba(80,140,255,0.14)':'')+'"><span style="width:18px;color:#9aa1ad">'+(i+1)+'.</span><span style="width:10px;height:10px;border-radius:50%;background:'+c.hex+';flex:none;border:1px solid rgba(255,255,255,0.3)"></span><span style="flex:1;'+(c.pl?'font-weight:500':'')+'">'+c.name+' <span class="sub">'+carN(c.ty)+'</span></span><span style="color:'+(c.fin?'#e8eaee':'#8b93a1')+';font-variant-numeric:tabular-nums;font-size:12px">'+(c.fin?fmt(c.ft):T('racing'))+'</span></div>').join('');}
const GEARS=[0,55,95,135,175,215,999];
function gearOf(kmh){let g=1;while(g<6&&kmh>GEARS[g])g++;const lo=GEARS[g-1],hi=Math.min(GEARS[g],260);return{g,rpm:0.15+0.85*Math.min(1,(kmh-lo)/(hi-lo))};}
function speedo(kmh,gr,rpm){const c=spx,cx=90,cy=93,a0=Math.PI*0.75,a1=Math.PI*2.25;c.clearRect(0,0,180,180);
c.beginPath();c.arc(cx,cy,80,0,7);c.fillStyle='rgba(12,14,20,0.72)';c.fill();c.strokeStyle=rpm>0.93?'#ff3b30':'rgba(255,255,255,0.12)';c.lineWidth=rpm>0.93?2.5:1;c.stroke();
for(let i=0;i<28;i++){const f0=i/28;c.beginPath();c.arc(cx,cy,70,a0+(a1-a0)*(i+0.15)/28,a0+(a1-a0)*(i+0.85)/28);c.lineWidth=8;c.strokeStyle=f0<rpm?(f0>0.84?'#ff3b30':f0>0.66?'#ffb020':'#3ddc97'):'rgba(255,255,255,0.09)';c.stroke();}
const f=Math.min(1,kmh/260);c.lineCap='round';c.lineWidth=3;c.strokeStyle='rgba(255,255,255,0.1)';c.beginPath();c.arc(cx,cy,57,a0,a1);c.stroke();if(f>0.004){c.strokeStyle='#fff';c.beginPath();c.arc(cx,cy,57,a0,a0+(a1-a0)*f);c.stroke();const ea=a0+(a1-a0)*f;c.fillStyle='#fff';c.beginPath();c.arc(cx+Math.cos(ea)*57,cy+Math.sin(ea)*57,4,0,7);c.fill();}c.lineCap='butt';
c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.font='600 38px Inter,sans-serif';c.fillText(Math.round(SPD(kmh)),cx,cy-4);
c.fillStyle='#9aa1ad';c.font='500 11px Inter,sans-serif';c.fillText(UN(),cx,cy+20);c.fillStyle='#ff6a45';c.font='600 20px Inter,sans-serif';c.fillText(gr,cx,cy+53);}
function mini(){const w=136,sc=114/Math.max(MB.x1-MB.x0,MB.z1-MB.z0),ox=(w-(MB.x1-MB.x0)*sc)/2,oz=(w-(MB.z1-MB.z0)*sc)/2,X=x=>ox+(x-MB.x0)*sc,Z=z=>oz+(z-MB.z0)*sc;
mx.clearRect(0,0,w,w);mx.lineJoin='round';mx.beginPath();P.forEach((p,k)=>k?mx.lineTo(X(p.x),Z(p.z)):mx.moveTo(X(p.x),Z(p.z)));mx.closePath();
mx.strokeStyle='rgba(255,255,255,0.18)';mx.lineWidth=7;mx.stroke();mx.strokeStyle='rgba(255,255,255,0.85)';mx.lineWidth=2;mx.stroke();mx.fillStyle='#fff';mx.fillRect(X(P[0].x)-3,Z(P[0].z)-3,6,6);
cars.forEach(c=>{if(c.pl)return;mx.beginPath();mx.arc(X(c.x),Z(c.z),3.2,0,7);mx.fillStyle=c.hex;mx.fill();mx.strokeStyle='rgba(0,0,0,0.6)';mx.lineWidth=1;mx.stroke();});
const px=X(pl.x),pz=Z(pl.z),fx=Math.sin(pl.a),fz=Math.cos(pl.a);mx.beginPath();mx.moveTo(px+fx*7,pz+fz*7);mx.lineTo(px-fx*4+fz*4.5,pz-fz*4-fx*4.5);mx.lineTo(px-fx*4-fz*4.5,pz-fz*4+fx*4.5);mx.closePath();mx.fillStyle='#ff5a36';mx.fill();mx.strokeStyle='#fff';mx.lineWidth=1.5;mx.stroke();}
function tower(o){const lead=o[0];$('tower').innerHTML=o.map((c,i)=>{const gap=i===0?T('leader'):c.fin?fmt(c.ft):lead.fin?'–':'+'+((lead.prog-c.prog)*1.5/(Math.max(0.5,Math.abs(c.v))*60)).toFixed(1).replace('.',',');
return'<div class="tw" style="'+(c.pl?'background:rgba(255,90,54,0.22)':'')+'"><span style="width:14px;color:#9aa1ad">'+(i+1)+'</span><span style="width:4px;height:12px;border-radius:2px;background:'+c.hex+';flex:none"></span><span style="flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'+(c.pl?'font-weight:500':'')+'">'+c.name+'</span><span style="color:#c7ccd4;font-size:11px">'+gap+'</span></div>';}).join('');}
function hud(TM){const o=standings(),pos=o.indexOf(pl)+1,laps=LAPS[cfg.l];
if(mode==='race'&&pos<lastPos&&gt>3000&&!pl.fin&&lastPos<9){toast(T('overtake',{p:pos}),'#3ddc97');cheer(0.55);pl.nit=Math.min(100,pl.nit+8);flashPos();}if(mode==='race')lastPos=pos;
$('hP').textContent=pos;$('hN').textContent='/'+cars.length;$('hL').textContent=Math.min(laps,Math.max(1,pl.ld+1))+'/'+laps;
$('hT').textContent=fmt(pl.fin?pl.ft:gt);$('hB').textContent=best===null?'–':fmt(best);$('hC').textContent=pl.ld<0||pl.fin?'–':fmt(gt-lapStart);
const dl=$('dlt');if(pl.last!==undefined&&best!==null&&gt-lapStart<4000&&!pl.fin){const df=(pl.last-best)/1000;dl.style.display='inline-block';dl.textContent=df<=0.001?T('bestTag'):'+'+df.toFixed(2).replace('.',',');dl.style.background=df<=0.001?'rgba(61,220,151,0.2)':'rgba(255,90,54,0.2)';dl.style.color=df<=0.001?'#3ddc97':'#ff8a6b';}else dl.style.display='none';
$('hBar').style.width=(pl.ld<0?0:pl.fin?100:Math.max(0,Math.min(1,pl.prog/NP-pl.ld))*100)+'%';
if(TM-towerT>300){towerT=TM;tower(o);}
const wrong=mode==='race'&&Math.abs(pl.v)>0.12&&(Math.sin(pl.a)*TA[pl.idx].x+Math.cos(pl.a)*TA[pl.idx].z)<-0.35;
$('ww').style.display=wrong?'flex':'none';const off=mode==='race'&&!wrong&&pl.dist>HW+11,stk=mode==='race'&&gt>6000&&Math.abs(pl.v)<0.03&&keys.up;$('msg').style.display=off||stk?'flex':'none';if(off||stk)$('msg').textContent=off?T('backTrack'):T('stuck');
$('pDraft').style.display=pl.draft&&mode==='race'?'flex':'none';nitroHud();
const kmh=Math.abs(pl.v)*180;speedo(kmh,pl.v<-0.02?'R':pl.gear,pl.rpm);mini();return{rpm:pl.rpm};}

const NUMS=[7,23,44,88,1,13];
function myOpt(){return{rim:cfg.rimI-1,liv:cfg.livI-1,spn:cfg.spnI?cfg.spnI-1:undefined,tint:cfg.tint};}
function aiOpt(k){return{rim:(k*7)%5-1,liv:k%3,spn:(k%4)+1,tint:k%2};}
