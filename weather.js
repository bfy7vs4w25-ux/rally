const SURF=[{road:1,off:1,drag:1,resp:1},{road:0.95,off:0.82,drag:1.35,resp:1},{road:0.8,off:0.92,drag:0.8,resp:0.65},{road:1,off:0.95,drag:1.05,resp:1}];
let WX={type:'clear',road:1,off:1,drag:1,resp:1,wind:0,wdir:0,gust:0,vis:1};
const RN=3200,rPos=new Float32Array(RN*6);
const rGeo=new THREE.BufferGeometry();rGeo.setAttribute('position',new THREE.BufferAttribute(rPos,3));
const rain=new THREE.LineSegments(rGeo,new THREE.LineBasicMaterial({color:0xb8c6d6,transparent:true,opacity:0.32,depthWrite:false}));rain.frustumCulled=false;rain.visible=false;scene.add(rain);
const SN=1600,sPos=new Float32Array(SN*3),sGeo=new THREE.BufferGeometry();sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));
const sand=new THREE.Points(sGeo,new THREE.PointsMaterial({color:0xd9b27a,size:0.9,map:softT,transparent:true,opacity:0.55,depthWrite:false}));sand.frustumCulled=false;sand.visible=false;scene.add(sand);
function wxSeed(){for(let i=0;i<RN;i++){const x=(Math.random()-0.5)*90,y=Math.random()*45,z=(Math.random()-0.5)*90;rPos.set([x,y,z,x,y-0.9,z],i*6);}for(let i=0;i<SN;i++)sPos.set([(Math.random()-0.5)*120,Math.random()*14,(Math.random()-0.5)*120],i*3);}
wxSeed();
function pickWeather(th,force){if(force)return force;const r=Math.random();if(th===2)return'snow';if(SET.w===1)return'clear';const bad=SET.w===2||r<0.32;if(!bad)return th===3&&Math.random()<0.4?'wind':'clear';return th===1?'storm':'rain';}
function applyWeather(type){const t=TR[builtT],th=TH[t.th],s=SURF[t.th];WX={type,road:s.road,off:s.off,drag:s.drag,resp:s.resp,wind:0,wdir:Math.random()*6.28,gust:0,vis:1};
let top=th.sky[0],hor=th.sky[1],gr=th.sky[2],fn=350,ff=1750,sunI=1.05,hemI=0.58;
if(type==='rain'){WX.road*=0.8;WX.off*=0.85;WX.resp*=0.85;top=0x56606c;hor=0x9aa3ad;fn=120;ff=900;sunI=0.35;hemI=0.62;WX.wind=0.25;}
if(type==='storm'){WX.road*=0.92;WX.off*=0.9;WX.wind=1;top=0xa37c4f;hor=0xd2a56c;fn=40;ff=320;sunI=0.5;hemI=0.7;}
if(type==='snow'){top=0x8396ad;hor=0xdde4ec;fn=160;ff=1000;sunI=0.6;hemI=0.7;WX.wind=0.2;}
if(type==='wind')WX.wind=0.45;
setSky(top,hor,gr);makeEnv();scene.background=new THREE.Color(hor);scene.fog.color.setHex(hor);scene.fog.near=fn;scene.fog.far=ff;sun.intensity=sunI;hemi.intensity=hemI;hemi.color.setHex(hor);
sunS.visible=type==='clear'||type==='wind';rain.visible=type==='rain';sand.visible=type==='storm';
if(ROADM){ROADM.roughness=type==='rain'?0.28:0.92;ROADM.metalness=type==='rain'?0.15:0;ROADM.color.setHex(type==='rain'?0x9a9a9a:0xffffff);}
if(CLOUD)CLOUD.children.forEach(g=>g.children.forEach(m=>{m.material.color.setHex(type==='rain'?0x8c939c:type==='storm'?0xc79a68:0xffffff);m.material.opacity=type==='rain'?0.95:0.8;}));
if(SNOW)SNOW.visible=true;VP=CARS.map(speedProfile);}
function wxStep(dt,d,TM){const cx=cam.position.x,cy=cam.position.y,cz=cam.position.z;
WX.gust=WX.wind*(0.55+0.45*Math.sin(TM*0.0011)+0.3*Math.sin(TM*0.0037+1.3));WX.wdir+=Math.sin(TM*0.0002)*0.0004*d;
if(rain.visible){const wx=Math.cos(WX.wdir)*WX.gust*0.25,wz=Math.sin(WX.wdir)*WX.gust*0.25;for(let i=0;i<RN;i++){const o=i*6;let x=rPos[o]+wx*d,y=rPos[o+1]-1.3*d,z=rPos[o+2]+wz*d;
if(y<cy-12)y+=45;if(x-cx>45)x-=90;else if(cx-x>45)x+=90;if(z-cz>45)z-=90;else if(cz-z>45)z+=90;rPos[o]=x;rPos[o+1]=y;rPos[o+2]=z;rPos[o+3]=x-wx*0.7;rPos[o+4]=y-0.9;rPos[o+5]=z-wz*0.7;}rGeo.attributes.position.needsUpdate=true;}
if(sand.visible){const wx=Math.cos(WX.wdir)*(0.6+WX.gust),wz=Math.sin(WX.wdir)*(0.6+WX.gust);for(let i=0;i<SN;i++){const o=i*3;let x=sPos[o]+wx*d,y=sPos[o+1]+Math.sin(TM*0.002+i)*0.03*d,z=sPos[o+2]+wz*d;
if(x-cx>60)x-=120;else if(cx-x>60)x+=120;if(z-cz>60)z-=120;else if(cz-z>60)z+=120;if(y<0)y+=14;if(y>14)y-=14;sPos[o]=x;sPos[o+1]=y;sPos[o+2]=z;}sGeo.attributes.position.needsUpdate=true;}}
function wxForce(c,d){if(!WX.wind||c.v<0.2)return;const f=WX.gust*0.0035*d*(WX.type==='storm'?1:0.45);c.vx+=Math.cos(WX.wdir)*f;c.vz+=Math.sin(WX.wdir)*f;}
function wxToast(){const m={rain:'wRain',storm:'wStorm',snow:'wSnow',wind:'wWind'}[WX.type];if(m)setTimeout(()=>toast(T(m),'#9fd0ff'),4300);}
