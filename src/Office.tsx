import {useEffect,useRef} from 'react';
import type {Employee} from './simulation';
export function Office({team,selected,onSelect,running}:{team:Employee[];selected:string;onSelect:(id:string)=>void;running:boolean}){
const ref=useRef<HTMLCanvasElement>(null);
const hits=useRef<{id:string;x:number;y:number}[]>([]);
useEffect(()=>{const canvas=ref.current!;const c=canvas.getContext('2d')!;let frame=0;let timer:ReturnType<typeof setTimeout>;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){hits.current=[];c.imageSmoothingEnabled=false;c.clearRect(0,0,720,650);
const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
const line=(x:number,y:number,w:number,h:number,color='#b7a6b3')=>rect(x,y,w,h,color);
function plant(x:number,y:number){rect(x-8,y,16,17,'#d8b6a0');rect(x-10,y,20,4,'#efcfb5');rect(x-2,y-28,4,28,'#73927c');for(let i=0;i<4;i++){rect(x-(i%2?0:14),y-26+i*5,15,8,i%2?'#91b294':'#afc39a')}}
function window(x:number,y:number){rect(x-4,y-4,112,97,'#e0d4ca');rect(x,y,104,89,'#c8e1e5');rect(x+5,y+5,94,40,'#dcecf0');for(let i=0;i<4;i++){rect(x+7+i*24,y+58-(i%2)*14,18,31+(i%2)*14,'#b5cdd8');rect(x+11+i*24,y+64-(i%2)*14,3,4,'#e3eef2')}line(x+50,y,4,89,'#f7eee3');line(x,y+43,104,4,'#f7eee3')}
function desk(x:number,y:number){rect(x,y,100,9,'#b58e7b');rect(x+3,y+9,94,5,'#e0bba0');rect(x+7,y+14,5,29,'#a58c80');rect(x+88,y+14,5,29,'#a58c80');rect(x+40,y-31,41,28,'#6a687c');rect(x+43,y-28,35,21,'#a9bdc7');rect(x+57,y-3,7,4,'#777286');rect(x+49,y+1,24,3,'#eadac8');rect(x+9,y-10,11,10,'#f6ede0');rect(x+20,y-8,4,5,'#bda8a2')}
function person(e:Employee,x:number,y:number){const bob=running&&!reduced&&e.status==='작업 중'?Math.floor(frame/2)%2:0;y+=bob;
rect(x+3,y+35,7,13,'#555569');rect(x+15,y+35,7,13,'#555569');rect(x+1,y+47,10,4,'#615d6c');rect(x+15,y+47,10,4,'#615d6c');rect(x,y+21,25,18,e.color);rect(x-4,y+24,5,15,'#ecc3a6');rect(x+24,y+24,5,15,'#ecc3a6');rect(x+3,y+3,19,19,'#edc9ac');rect(x,y,25,8,e.id==='research'?'#b9836f':'#655967');rect(x,y+5,5,9,'#655967');rect(x+19,y+5,6,8,'#655967');rect(x+8,y+12,2,3,'#504b5a');rect(x+17,y+12,2,3,'#504b5a');rect(x+11,y+19,5,2,'#bd887c');
rect(x+8,y-16,9,8,e.status==='오류'?'#ce8079':e.status==='완료'?'#83aa8a':'#f7f2df');if(e.id===selected){rect(x-8,y+53,41,3,e.color)}
}
// sky and building roof
rect(0,0,720,650,'#e7eeea');rect(0,0,720,65,'#d8e8e8');for(let i=0;i<9;i++)rect(i*92,32+(i%3)*8,64,40,'#c8d9dc');
rect(22,59,676,19,'#af9cae');rect(17,54,686,13,'#e7dce5');rect(245,16,237,39,'#b29dbf');rect(252,21,223,28,'#d6c5dd');c.fillStyle='#665773';c.font='bold 16px monospace';c.fillText('✦  AI OFFICE  ✦',278,41);plant(84,39);plant(620,39);
for(let f=3;f>=1;f--){const y=78+(3-f)*181;const colors=['#f5e8db','#e9e9f1','#f0e4e7'];rect(31,y,659,164,colors[f-1]);rect(32,y+128,657,36,'#e4cdb9');for(let i=0;i<12;i++)line(35+i*58,y+129,1,35,'#cfb7a7');line(31,y+151,659,1,'#d2baaa');
// elevator shaft
rect(42,y+7,65,150,'#b8acbb');rect(48,y+13,53,138,'#dce2e5');rect(73,y+13,3,138,'#ada4b4');rect(53,y+24,16,99,'#c4d4db');rect(81,y+24,14,99,'#c4d4db');rect(111,y+60,8,18,'#c0aebb');rect(113,y+64,4,4,'#f8eee0');
window(150,y+24);window(346,y+24);window(532,y+24);
// shelves, lamps and wall art
rect(277,y+34,45,79,'#b99886');for(let s=0;s<3;s++){rect(281,y+39+s*25,37,20,'#ddc9b5');for(let b=0;b<5;b++)rect(284+b*6,y+42+s*25,4,16,['#b4a0bc','#a2b7b7','#e3b4a4'][b%3])}
line(463,y,2,30,'#9b8b91');rect(450,y+29,28,6,'#af9c9d');rect(455,y+35,18,4,'#f8d7a0');
desk(158,y+127);desk(354,y+127);plant(129,y+137);plant(478,y+133);plant(657,y+134);
if(f===1){rect(540,y+106,99,29,'#b1bda1');rect(536,y+101,12,40,'#9faa91');rect(632,y+101,12,40,'#9faa91');rect(548,y+99,34,20,'#dbe0bd');rect(589,y+99,35,20,'#c6d2b7');rect(562,y+143,60,6,'#b99581');rect(570,y+149,4,10,'#a78e7e');rect(610,y+149,4,10,'#a78e7e')}
else {rect(554,y+106,70,7,'#c29d84');rect(561,y+113,5,35,'#b39a8a');rect(614,y+113,5,35,'#b39a8a');rect(575,y+82,28,24,'#f6eee1');plant(590,y+86)}
const members=team.filter(e=>e.floor===f);members.forEach((e,i)=>{let x=190+i*196;if(e.status==='회의 중')x=565; if(e.status==='대기')x=547;if(e.status==='완료')x=490;if(e.status==='오류')x=120;if(e.status==='검토 중')x=390;const walk=running&&!reduced&&e.status==='회의 중'?Math.round(Math.sin(frame/4)*15):0;hits.current.push({id:e.id,x:x+walk,y:y+82});person(e,x+walk,y+82)});
rect(23,y+164,676,13,'#b7a2b1');rect(19,y+160,684,7,'#f4e7e4');}
rect(16,621,689,10,'#c1b2b8');rect(4,631,713,12,'#d4c8c7');frame++;if(running&&!reduced)timer=setTimeout(draw,450);}
draw();return()=>clearTimeout(timer);},[team,selected,running]);
return <div className="office-art"><canvas ref={ref} onClick={event=>{const box=event.currentTarget.getBoundingClientRect();const x=(event.clientX-box.left)*720/box.width;const y=(event.clientY-box.top)*650/box.height;const hit=hits.current.find(h=>x>=h.x-10&&x<=h.x+35&&y>=h.y-20&&y<=h.y+55);if(hit)onSelect(hit.id)}} width={720} height={650} aria-label="3층 픽셀 사무실. 아래 직원 버튼을 눌러 상세 정보를 확인하세요."/><div className="floor-labels">{[3,2,1].map(f=><span key={f}><b>{f}F</b> {['기획 · 검토팀','개발팀','연구 · 자동화팀'][f-1]}</span>)}</div><div className="staff-selector">{team.map(e=><button key={e.id} onClick={()=>onSelect(e.id)} className={selected===e.id?'selected':''}><i style={{background:e.color}}/>{e.name}<small>{e.status}</small></button>)}</div></div>
}
