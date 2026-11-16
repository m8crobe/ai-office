import {useState} from 'react';
import {FloorDetail} from './FloorDetail';
import {drawLegacyPerson} from './legacyPerson';
import {drawNoah,noahSprite,type NoahFrame} from './noahSprite';
import {useEffect,useRef} from 'react';
import type {Employee} from './simulation';
export function Office({team,selected,onSelect,running}:{team:Employee[];selected:string;onSelect:(id:string)=>void;running:boolean}){
const ref=useRef<HTMLCanvasElement>(null);
const [floorOpen,setFloorOpen]=useState(false);
const hits=useRef<{id:string;x:number;y:number}[]>([]);
useEffect(()=>{const canvas=ref.current!;const c=canvas.getContext('2d')!;let frame=0;let timer:ReturnType<typeof setTimeout>;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const sprite=new Image();sprite.src=noahSprite.url;sprite.onload=()=>{clearTimeout(timer);draw()};
function draw(){hits.current=[];c.imageSmoothingEnabled=false;c.clearRect(0,0,720,650);
const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
const line=(x:number,y:number,w:number,h:number,color='#b7a6b3')=>rect(x,y,w,h,color);
function plant(x:number,y:number){
rect(x-10,y+16,23,3,'#c7b6ac');rect(x-8,y,17,17,'#fff4df');rect(x-6,y+3,4,12,'#ead7c0');rect(x-10,y,21,4,'#d7b59b');
rect(x-1,y-35,3,36,'#759276');for(let i=0;i<6;i++){const dx=i%2?-1:-15;rect(x+dx,y-36+i*5,16,7,i%2?'#7da879':'#a5bf85');rect(x+dx+2,y-38+i*5,10,3,'#bdcc92');rect(x+dx+5,y-35+i*5,8,2,'#91b17a')}}
function cloud(x:number,y:number){rect(x,y,32,6,'#f7fcf5');rect(x+6,y-5,19,5,'#f7fcf5');rect(x+11,y-9,10,4,'#f7fcf5')}
function window(x:number,y:number){rect(x-5,y-5,114,100,'#b8a6b7');rect(x-2,y-2,108,94,'#f9eee4');rect(x,y,104,89,'#b9dcee');rect(x+3,y+3,98,36,'#cbe6f3');cloud(x+10,y+24);cloud(x+66,y+15);for(let i=0;i<5;i++){const h=15+(i%3)*10;rect(x+3+i*21,y+87-h,18,h,'#a5bbd7');for(let j=0;j<3;j++){rect(x+7+i*21,y+91-h+j*9,3,4,'#d8e3f0');rect(x+14+i*21,y+91-h+j*9,3,4,'#d8e3f0')}}
line(x+50,y,4,89,'#fff4e6');line(x,y+43,104,4,'#fff4e6');rect(x+7,y+6,3,75,'#e9f5f1');rect(x+96,y+5,3,75,'#dff0ed');rect(x-5,y+89,114,5,'#e0bb9b');rect(x-7,y+94,118,3,'#b89a88');}
function desk(x:number,y:number){rect(x+4,y+36,97,4,'#ceb5aa');rect(x+9,y-15,24,33,'#a794ac');rect(x+13,y-11,16,27,'#c1b0ca');rect(x,y,100,6,'#f3d7ae');rect(x,y+6,100,4,'#b38e7c');rect(x+4,y+10,92,5,'#dbb69a');rect(x+7,y+15,5,28,'#977f81');rect(x+88,y+15,5,28,'#977f81');rect(x+40,y-32,42,29,'#57566c');rect(x+43,y-29,36,22,'#95b9c8');rect(x+46,y-25,19,2,'#d4edf0');rect(x+46,y-20,26,2,'#bbd7df');rect(x+46,y-15,12,2,'#d7e9e8');rect(x+57,y-3,7,4,'#777286');rect(x+48,y+1,26,3,'#eee4d4');rect(x+9,y-11,10,10,'#fff6e5');rect(x+19,y-9,4,5,'#bda8a2');rect(x+26,y-6,7,5,'#d9b2b8')}
function lamp(x:number,y:number){line(x,y,2,29,'#887585');rect(x-11,y+28,24,4,'#866e81');rect(x-15,y+32,32,5,'#b69cab');rect(x-11,y+37,24,3,'#ffe8b1');rect(x-7,y+40,16,3,'#fff0cd')}
function shelf(x:number,y:number){rect(x,y,45,79,'#b28d7d');rect(x+3,y+3,39,73,'#e5c5a4');for(let row=0;row<3;row++){for(let b=0;b<5;b++){const h=12+(b%3)*3;rect(x+6+b*7,y+22+row*25-h,5,h,['#b6a0c7','#9ebcb4','#edc2ac','#c3ccad','#a8b6cf'][b]);rect(x+7+b*7,y+25+row*25-h,2,2,'#eee4dc')}rect(x+2,y+23+row*25,41,3,'#b28d7d')}}
function cat(x:number,y:number){rect(x,y+7,31,12,'#f9f2e3');rect(x+3,y+3,21,8,'#f9f2e3');rect(x-3,y+4,13,14,'#fff6e7');rect(x-3,y,4,7,'#ba927a');rect(x+6,y,4,7,'#ba927a');rect(x+17,y+4,9,8,'#ccaa81');rect(x+28,y+10,9,5,'#ba927a');rect(x,y+10,2,2,'#73616a');rect(x+6,y+10,2,2,'#73616a')}
function vine(x:number,y:number){for(let i=0;i<7;i++){const yy=y+i*8;rect(x+(i%2)*3,yy,4,10,'#6f9a77');rect(x-7+(i%2)*3,yy+2,9,5,i%2?'#a3bd80':'#86ae78');rect(x+3+(i%2)*3,yy+5,9,4,'#a1bc83')}}
function wreath(x:number,y:number){for(let i=0;i<7;i++){rect(x+i*5,y+(i%2)*3,7,7,i%2?'#f6d5e2':'#f1bad1');rect(x+i*5+2,y+(i%2)*3+2,2,2,'#fff3e9')}}
function person(e:Employee,x:number,y:number){const bob=running&&!reduced&&e.status==='작업 중'?Math.floor(frame/2)%2:0;
if(e.id==='dev'&&sprite.complete&&sprite.naturalWidth){const pose:NoahFrame=e.status==='대기'?'idle':e.status==='작업 중'||e.status==='검토 중'?'work':running?(frame%4<2?'walkLeft':'walkRight'):'idle';drawNoah(c,sprite,pose,x-3,y+2+bob);if(e.id===selected)rect(x-8,y+53,41,3,e.color);return}
drawLegacyPerson(c,e,x,y,e.id===selected,bob)}
// Original pastel cutaway: layered skyline, garden roof and blossoms.
rect(0,0,720,650,'#e6edf1');rect(0,0,720,77,'#c8e2f1');cloud(32,26);cloud(149,19);cloud(530,26);cloud(659,18);
for(let i=0;i<12;i++){const h=18+(i%4)*9;rect(i*66,76-h,40,h,'#b4c6df');for(let j=0;j<3;j++)rect(i*66+8+j*9,81-h,3,5,'#e3eaf4')}
for(const x of [7,700]){rect(x,20,5,600,'#b69899');for(let i=0;i<15;i++){const yy=30+i*40;const dx=Math.round(Math.sin(i*3)*15);rect(x+dx-13,yy,28,9,'#edc6d9');rect(x+dx-8,yy-5,19,18,'#f5d4e2');rect(x+dx,yy,4,4,'#fff0ed')}}
rect(13,49,697,9,'#8e729d');rect(22,59,676,19,'#a58da9');rect(17,54,686,9,'#f8e5e8');rect(22,63,676,4,'#d3b9cf');
rect(244,9,239,45,'#9b82a9');rect(249,13,229,36,'#c6b0d6');rect(253,17,221,3,'#e9d7ec');c.fillStyle='#fff8ef';c.font='bold 17px monospace';c.fillText('✦ AI COMPANY ✦',286,37);
for(const x of [70,126,550,636])plant(x,36);vine(104,28);vine(672,31);wreath(163,42);wreath(487,46);rect(576,36,36,17,'#d8d0de');rect(580,39,27,9,'#aaa2b8');for(let i=0;i<5;i++)line(583+i*5,40,2,7,'#d5d3e0');
for(let f=3;f>=1;f--){const y=78+(3-f)*181;const colors=['#f8e9db','#eee8f3','#f5e4e9'];rect(31,y,659,164,colors[f-1]);rect(32,y+128,657,36,'#e9cfb7');rect(30,y+2,7,158,'#b99eb4');rect(685,y+2,7,158,'#b99eb4');rect(37,y+4,647,4,'#fff5ea');rect(123,y+7,560,5,'#fff4e7');rect(123,y+119,560,5,'#dfbdab');for(let i=0;i<12;i++)line(35+i*58,y+129,1,35,'#cfb7a7');line(31,y+151,659,1,'#d2baaa');
// elevator shaft
rect(42,y+7,65,150,'#b8acbb');rect(48,y+13,53,138,'#dce2e5');rect(46,y+7,57,5,'#f7ebf2');rect(73,y+13,3,138,'#ada4b4');rect(53,y+24,16,99,'#c4d4db');rect(81,y+24,14,99,'#c4d4db');rect(111,y+60,8,18,'#c0aebb');rect(113,y+64,4,4,'#f8eee0');
window(150,y+24);window(346,y+24);window(532,y+24);vine(143,y+15);vine(674,y+24);
// Distinct departments, practical furniture, plants and small original props.
shelf(277,y+34);lamp(203,y);lamp(409,y);lamp(594,y);
if(f!==2)desk(158,y+127);desk(354,y+127);plant(129,y+137);plant(478,y+133);plant(657,y+134);plant(322,y+103);
// Wall chart beside the central window.
rect(463,y+28,42,47,'#bca4af');rect(466,y+31,36,41,'#fff5e9');for(let r=0;r<4;r++){rect(471,y+38+r*7,5,4,['#a9bb9e','#b59bc6','#e2b19b'][r%3]);rect(480,y+39+r*7,16,2,'#cdc0d0')}
if(f===3){
rect(531,y+107,109,31,'#a1b18c');rect(536,y+98,99,20,'#c6d0ac');rect(528,y+108,11,34,'#b2c296');rect(633,y+108,11,34,'#b2c296');rect(542,y+101,20,20,'#e4ddb4');rect(606,y+101,20,20,'#d5c4d9');rect(549,y+143,75,7,'#dfb99b');rect(556,y+150,4,10,'#a88b80');rect(615,y+150,4,10,'#a88b80');cat(577,y+119);
}else if(f===2){
// Glass meeting room with framed door and pastel chairs.
rect(525,y+16,119,142,'#ac9ab5');rect(529,y+20,111,132,'#d9e4e9');rect(533,y+23,103,126,'#e2edf0');line(575,y+20,3,132,'#ae9db7');line(529,y+54,111,3,'#ae9db7');line(634,y+20,3,132,'#ae9db7');line(535,y+27,2,67,'#f9fbef');rect(555,y+31,58,18,'#fff0d9');c.fillStyle='#887288';c.font='10px sans-serif';c.fillText('회의실',568,y+44);
rect(548,y+107,78,9,'#dfbb9e');rect(553,y+103,68,4,'#efd6b4');rect(559,y+116,4,29,'#a48b82');rect(615,y+116,4,29,'#a48b82');for(const xx of [540,620]){rect(xx,y+115,13,22,'#c8b0c7');rect(xx+2,y+137,3,12,'#9c899e')}plant(587,y+88);
}else{
// Cream kitchenette and pink reading nook.
rect(533,y+81,107,49,'#d5ad95');rect(536,y+85,101,40,'#efc8a9');rect(533,y+78,107,6,'#fff0d7');for(let k=0;k<3;k++){line(567+k*32,y+85,2,40,'#c39e8b');rect(556+k*32,y+91,3,3,'#a68b81')}
rect(539,y+58,21,19,'#f6eee6');rect(542,y+62,15,10,'#b4a6b8');rect(579,y+47,22,31,'#897d8c');rect(582,y+50,16,9,'#c6c3cc');rect(583,y+64,14,8,'#e1d2c7');rect(608,y+64,10,13,'#edddb9');plant(628,y+61);
rect(531,y+140,26,16,'#d8adc5');rect(535,y+130,18,13,'#e9c4d5');rect(571,y+139,62,7,'#e4c19f');rect(580,y+146,4,13,'#b39482');rect(623,y+146,4,13,'#b39482');
}
const members=team.filter(e=>e.floor===f);members.forEach((e,i)=>{let x=e.id==='dev'?170:190+i*196;if(e.status==='회의 중')x=565; if(e.status==='대기')x=513;if(e.status==='완료')x=490;if(e.status==='오류')x=120;if(e.status==='검토 중')x=390;const walk=running&&!reduced&&e.status==='회의 중'?Math.round(Math.sin(frame/4)*15):0;hits.current.push({id:e.id,x:x+walk,y:y+82});person(e,x+walk,y+82)});if(f===2)desk(158,y+127);
rect(23,y+164,676,13,'#9d819e');rect(31,y+164,659,4,'#fff3eb');rect(19,y+160,684,7,'#f4e7e4');}
rect(16,621,689,10,'#c1b2b8');rect(4,631,713,12,'#d4c8c7');frame++;if(running&&!reduced)timer=setTimeout(draw,450);}
draw();return()=>clearTimeout(timer);},[team,selected,running]);
return <div className="office-art"><canvas ref={ref} onClick={event=>{const box=event.currentTarget.getBoundingClientRect();const x=(event.clientX-box.left)*720/box.width;const y=(event.clientY-box.top)*650/box.height;const hit=hits.current.find(h=>x>=h.x-10&&x<=h.x+35&&y>=h.y-20&&y<=h.y+55);if(hit){onSelect(hit.id);if(team.find(e=>e.id===hit.id)?.floor===2)setFloorOpen(true)}else if(y>=259&&y<436)setFloorOpen(true)}} width={720} height={650} aria-label="3층 픽셀 사무실. 아래 직원 버튼을 눌러 상세 정보를 확인하세요."/><div className="floor-labels">{[3,2,1].map(f=>f===2?<button type="button" className="floor-zoom-trigger" key={f} onClick={()=>setFloorOpen(true)} aria-label="2층 개발팀 확대하기"><b>2F</b> 개발팀 <span>↗</span></button>:<span key={f}><b>{f}F</b> {['기획 · 검토팀','개발팀','연구 · 자동화팀'][f-1]}</span>)}</div><div className="staff-selector">{team.map(e=><button key={e.id} onClick={()=>onSelect(e.id)} className={selected===e.id?'selected':''}><i style={{background:e.color}}/>{e.name}<small>{e.status}</small></button>)}</div>{floorOpen&&<FloorDetail employee={team.find(e=>e.id==='dev')!} running={running} onClose={()=>setFloorOpen(false)}/>}</div>
}
