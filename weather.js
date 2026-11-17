const SURF=[{road:1,off:1,drag:1,resp:1},{road:0.95,off:0.82,drag:1.35,resp:1},{road:0.8,off:0.92,drag:0.8,resp:0.65},{road:1,off:0.95,drag:1.05,resp:1}];
let WX={type:'clear',road:1,off:1,drag:1,resp:1,wind:0,wdir:0,gust:0,vis:1};
const RN=4200,RU={k:{value:1},t:{value:0},c:{value:new THREE.Vector3()},w:{value:new THREE.Vector2()},sc:{value:500}};
const rSeed=new Float32Array(RN*2*3),rEnd=new Float32Array(RN*2);for(let i=0;i<RN;i++){const a=Math.random(),b=Math.random(),c=Math.random();for(let j=0;j<2;j++){rSeed.set([a,b,c],(i*2+j)*3);rEnd[i*2+j]=j;}}
const rGeo=new THREE.BufferGeometry();rGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(RN*2*3),3));rGeo.setAttribute('seed',new THREE.BufferAttribute(rSeed,3));rGeo.setAttribute('endp',new THREE.BufferAttribute(rEnd,1));
const LDV='#include <common>\n#include <logdepthbuf_pars_vertex>\n',LDF='#include <common>\n#include <logdepthbuf_pars_fragment>\n';
const rain=new THREE.LineSegments(rGeo,new THREE.ShaderMaterial({uniforms:RU,transparent:true,depthWrite:false,
vertexShader:'attribute vec3 seed;attribute float endp;uniform float t;uniform float k;uniform vec3 c;uniform vec2 w;varying float vA;\n'+LDV+'void main(){float sp=26.0+seed.x*10.0;vec3 p;p.x=c.x+mod(seed.x*90.0-c.x,90.0)-45.0;p.z=c.z+mod(seed.z*90.0-c.z,90.0)-45.0;p.y=c.y-14.0+mod(seed.y*44.0-t*sp,44.0);float L=0.6+seed.y*0.6;p.y-=endp*L;p.xz-=w*endp*L*0.06;vA=(0.22+seed.z*0.25)*(1.0-endp*0.75)*step(seed.x,k);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'varying float vA;\n'+LDF+'void main(){\n#include <logdepthbuf_fragment>\ngl_FragColor=vec4(0.78,0.83,0.9,vA);}'}));
rain.frustumCulled=false;rain.visible=false;scene.add(rain);
const ringT=ctex(64,64,x=>{x.strokeStyle='rgba(255,255,255,0.9)';x.lineWidth=3;x.beginPath();x.arc(32,32,26,0,7);x.stroke();x.strokeStyle='rgba(255,255,255,0.35)';x.lineWidth=2;x.beginPath();x.arc(32,32,16,0,7);x.stroke();});
const PN2=1400,pSeed=new Float32Array(PN2*3);for(let i=0;i<PN2*3;i++)pSeed[i]=Math.random();const ripG=new THREE.BufferGeometry();ripG.setAttribute('position',new THREE.BufferAttribute(new Float32Array(PN2*3),3));ripG.setAttribute('seed',new THREE.BufferAttribute(pSeed,3));
const rip=new THREE.Points(ripG,new THREE.ShaderMaterial({uniforms:{t:RU.t,c:RU.c,sc:RU.sc,k:RU.k,map:{value:ringT}},transparent:true,depthWrite:false,
vertexShader:'attribute vec3 seed;uniform float t;uniform vec3 c;uniform float sc;uniform float k;varying float vA;\n'+LDV+'void main(){float ph=fract(t*1.3+seed.y*7.0);vec3 p=vec3(c.x+mod(seed.x*60.0-c.x,60.0)-30.0,0.135,c.z+mod(seed.z*60.0-c.z,60.0)-30.0);vA=(1.0-ph)*0.45*step(seed.x,k);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=min(80.0,(0.12+ph*0.55)*sc/max(0.5,-mv.z));gl_Position=projectionMatrix*mv;\n#include <logdepthbuf_vertex>\n}',
fragmentShader:'uniform sampler2D map;varying float vA;\n'+LDF+'void main(){\n#include <logdepthbuf_fragment>\nvec2 q=gl_PointCoord-0.5;q.y*=2.4;if(length(q)>0.5)discard;vec4 tx=texture2D(map,q+0.5);gl_FragColor=vec4(0.85,0.9,0.95,tx.a*vA);}'}));
rip.frustumCulled=false;rip.visible=false;scene.add(rip);
const SN=1600,sPos=new Float32Array(SN*3),sGeo=new THREE.BufferGeometry();sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));
const sand=new THREE.Points(sGeo,new THREE.PointsMaterial({color:0xd9b27a,size:0.9,map:softT,transparent:true,opacity:0.55,depthWrite:false}));sand.frustumCulled=false;sand.visible=false;scene.add(sand);
function wxSeed(){for(let i=0;i<SN;i++)sPos.set([(Math.random()-0.5)*120,Math.random()*14,(Math.random()-0.5)*120],i*3);}
wxSeed();
function pickWeather(th,force){if(force)return force;const r=Math.random();if(th===2)return'snow';if(SET.w===1)return'clear';const bad=SET.w===2||r<0.32;if(!bad)return th===3&&Math.random()<0.4?'wind':'clear';return th===1?'storm':'rain';}
function applyWeather(type){const t=TR[builtT],th=TH[t.th],s=SURF[t.th];WX={type,road:s.road,off:s.off,drag:s.drag,resp:s.resp,wind:0,wdir:Math.random()*6.28,gust:0,vis:1,wet:type==='rain'?0.25:0};
let top=th.sky[0],hor=th.sky[1],gr=th.sky[2],fn=350,ff=1750,sunI=1.05,hemI=0.58;
if(type==='rain'){WX.road*=0.8;WX.off*=0.85;WX.resp*=0.85;top=0x56606c;hor=0x9aa3ad;fn=120;ff=900;sunI=0.35;hemI=0.62;WX.wind=0.25;}
if(type==='storm'){WX.road*=0.92;WX.off*=0.9;WX.wind=1;top=0xa37c4f;hor=0xd2a56c;fn=40;ff=320;sunI=0.5;hemI=0.7;}
if(type==='snow'){top=0x8396ad;hor=0xdde4ec;fn=160;ff=1000;sunI=0.6;hemI=0.7;WX.wind=0.2;}
if(type==='wind')WX.wind=0.45;
WX.hemiB=hemI;WX.sunB=sunI;WX.fogF=ff;WX.flash=0;WX.ph=Math.random()*6;WX.nextL=8000+Math.random()*12000;WX.hor=hor;setSky(top,hor,gr);makeEnv();scene.background=new THREE.Color(hor);scene.fog.color.setHex(hor);scene.fog.near=fn;scene.fog.far=ff;sun.intensity=sunI;hemi.intensity=hemI;hemi.color.setHex(hor);
sunS.visible=type==='clear'||type==='wind';rain.visible=rip.visible=type==='rain';{const dk=type==='rain'||type==='storm'||type==='snow';if(GLOWO)GLOWO.visible=dk;if(LPOOL)LPOOL.visible=dk;}if(PUDM){PUDM.visible=type==='rain';PUDMAT.opacity=0;}sand.visible=type==='storm';
if(ROADM){ROADM.roughness=type==='rain'?0.28:0.92;ROADM.metalness=type==='rain'?0.15:0;ROADM.color.setHex(type==='rain'?0x9a9a9a:0xffffff);}
if(CLOUD){const ms=new Set();CLOUD.children.forEach(g=>g.children.forEach(m=>ms.add(m.material)));ms.forEach(mt=>{mt.color.setHex(mt.userData.base||0xffffff);if(type==='rain')mt.color.multiplyScalar(0.62);if(type==='storm')mt.color.lerp(new THREE.Color(0xc79a68),0.7);if(type==='snow')mt.color.multiplyScalar(0.88);mt.opacity=type==='rain'?0.96:0.85;});}
if(SNOW)SNOW.visible=true;VP=CARS.map(speedProfile);}
function wxStep(dt,d,TM){const cx=cam.position.x,cy=cam.position.y,cz=cam.position.z;
WX.gust=WX.wind*(0.55+0.45*Math.sin(TM*0.0011)+0.3*Math.sin(TM*0.0037+1.3));WX.wdir+=Math.sin(TM*0.0002)*0.0004*d;
const sev=0.55+0.45*Math.sin(TM*0.00011+WX.ph);WX.int=sev;
if(WX.type==='rain'){RU.k.value=0.35+0.65*sev;if(mode==='race'||mode==='count'){WX.nextL-=dt;if(WX.nextL<0&&sev>0.65){WX.flash=1;WX.nextL=9000+Math.random()*16000;setTimeout(thunder,500+Math.random()*1500);}}}
if(WX.flash>0){WX.flash=Math.max(0,WX.flash-dt/(WX.flash>0.6?60:260));const f=WX.flash>0.85||(WX.flash>0.4&&WX.flash<0.55)?WX.flash:WX.flash*0.4;hemi.intensity=WX.hemiB+f*1.6;scene.background.setHex(WX.hor).lerp(new THREE.Color(0xdfe6ff),f*0.7);}else if(WX.type==='rain'){hemi.intensity=WX.hemiB*(0.92+0.08*(1-sev));}
if(WX.type==='storm'){scene.fog.far=WX.fogF*(0.75+0.5*(1-WX.gust/1.8));scene.fog.near=Math.min(scene.fog.far*0.2,60);}
if(SNOW&&SNOW.material){SNOW.material.opacity=0.6+0.35*sev;}
ambient(WX.type==='rain'?0.02+0.035*sev:WX.type==='storm'?0.025+0.03*Math.min(1,WX.gust):WX.type==='wind'?0.012*WX.gust:0,WX.type==='storm'||WX.type==='wind'?500:2600);
if(rain.visible){RU.t.value=TM*0.001;RU.c.value.copy(cam.position);RU.w.value.set(Math.cos(WX.wdir)*WX.gust*6,Math.sin(WX.wdir)*WX.gust*6);RU.sc.value=G.clientHeight*ren.getPixelRatio()*0.5/Math.tan(cam.fov*Math.PI/360);
if(mode==='race')WX.wet=Math.min(1,WX.wet+dt/45000);PUDMAT.opacity=Math.min(0.88,WX.wet*1.1);if(ROADM)ROADM.roughness=0.5-WX.wet*0.3;}
if(sand.visible){const wx=Math.cos(WX.wdir)*(0.6+WX.gust),wz=Math.sin(WX.wdir)*(0.6+WX.gust);for(let i=0;i<SN;i++){const o=i*3;let x=sPos[o]+wx*d,y=sPos[o+1]+Math.sin(TM*0.002+i)*0.03*d,z=sPos[o+2]+wz*d;
if(x-cx>60)x-=120;else if(cx-x>60)x+=120;if(z-cz>60)z-=120;else if(cz-z>60)z+=120;if(y<0)y+=14;if(y>14)y-=14;sPos[o]=x;sPos[o+1]=y;sPos[o+2]=z;}sGeo.attributes.position.needsUpdate=true;}}
function wxForce(c,d){if(!WX.wind||c.v<0.2)return;const f=WX.gust*0.0035*d*(WX.type==='storm'?1:0.45);c.vx+=Math.cos(WX.wdir)*f;c.vz+=Math.sin(WX.wdir)*f;}
function wxToast(){const m={rain:'wRain',storm:'wStorm',snow:'wSnow',wind:'wWind'}[WX.type];if(m)setTimeout(()=>toast(T(m),'#9fd0ff'),4300);}

let ambG=null,ambF=null;
function ambient(v,fq){if(!AC)return;if(!ambG){try{const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),dd=b.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;const s=AC.createBufferSource();s.buffer=b;s.loop=true;ambF=AC.createBiquadFilter();ambF.type='lowpass';ambF.frequency.value=2600;ambG=AC.createGain();ambG.gain.value=0;s.connect(ambF);ambF.connect(ambG);ambG.connect(AC.destination);s.start();}catch(e){return;}}
const t=AC.currentTime,V=snd&&mode!=='menu'&&mode!=='pause'?[0,0.45,1,1.6][SET.vol]:0;ambG.gain.setTargetAtTime(v*V,t,0.4);ambF.frequency.setTargetAtTime(fq,t,0.4);}
function thunder(){if(!AC||!snd)return;const t=AC.currentTime,n=AC.createBufferSource(),b=AC.createBuffer(1,AC.sampleRate*3,AC.sampleRate),dd=b.getChannelData(0);let l=0;for(let i=0;i<dd.length;i++){l=l*0.97+(Math.random()*2-1)*0.03;dd[i]=l*8;}n.buffer=b;
const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=160;const g=AC.createGain(),V=[0,0.45,1,1.6][SET.vol];g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.35*V+0.0001,t+0.15);g.gain.exponentialRampToValueAtTime(0.0001,t+2.8);n.connect(f);f.connect(g);g.connect(AC.destination);n.start(t);n.stop(t+3);}
