import {useEffect,useRef,useState} from 'react';
import type {Employee} from './simulation';
import {noahSprite} from './noahSprite';
const roomImage=`${import.meta.env.BASE_URL}rooms/development-floor.png`;

/** A read-only, 2D cutaway of the development floor. Movement belongs to the demo clock. */
export function FloorDetail({employee,running,onClose}:{employee:Employee;running:boolean;onClose:()=>void}){
 const [step,setStep]=useState(0);
 const [reduced,setReduced]=useState(false);
 const close=useRef<HTMLButtonElement>(null);
 const scroll=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{if(scroll.current)scroll.current.scrollLeft=(scroll.current.scrollWidth-scroll.current.clientWidth)/2;close.current?.focus();const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[onClose]);
 const working=employee.status==='작업 중'||employee.status==='검토 중';
 useEffect(()=>{if(!running||!working||reduced)return;const timer=window.setInterval(()=>setStep(s=>(s+1)%90),120);return()=>clearInterval(timer)},[running,working,reduced]);
 const phase=step%90;const walking=running&&working&&!reduced&&(phase<24||phase>=62&&phase<86);
 const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
 const t=phase<24?phase/24:phase<62?1:phase<86?1-(phase-62)/24:0;
 const x=working?(reduced?520:lerp(785,520,t)):785;const y=working?(reduced?510:lerp(620,510,t)):620;
 const frame=walking?(step%6<3?1:2):working&&running&&(phase>=24&&phase<62||reduced)?3:0;
 const activity=working&&!running?'일시정지':walking?'이동 중':working?'책상에서 작업 중':'대기 중';
 return <div className="floor-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="floor-dialog" role="dialog" aria-modal="true" aria-labelledby="floor-heading">
   <div className="floor-dialog-header"><div><span>AI OFFICE · SIMULATION</span><h2 id="floor-heading">2F 개발팀 · 공간 확대</h2><p>마름모꼴 바닥을 따라 노아가 자동으로 이동합니다. 업무와 이동은 시뮬레이션입니다.</p></div><button ref={close} className="floor-close" onClick={onClose} aria-label="2층 확대 화면 닫기">×</button></div>
   <div ref={scroll} className="floor-detail-scroll"><svg className="floor-scene" viewBox="0 0 1672 941" role="img" aria-label={`2층 단면도: 노아 ${activity}. 책상 두 개, 책장과 화분, 유리 회의실이 있는 마름모꼴 공간`}>
    <image href={roomImage} x="0" y="0" width="1672" height="941"/>
    {running&&working&&<path d="M827 755 Q700 735 552 630" fill="none" stroke="#94b5cb" strokeWidth="8" strokeDasharray="4 21" opacity=".85"/>}
    <ellipse cx={x+54} cy={y+154} rx="41" ry="12" fill="#715b87" opacity=".22"/>
    <svg x={x} y={y} width="108" height="162" viewBox="0 0 32 48" overflow="hidden" style={{imageRendering:'pixelated'}}><image href={noahSprite.url} x={-32*frame} width="128" height="48"/></svg>
    <g transform={`translate(${x+99} ${y-41})`}><rect x="0" y="0" width="173" height="43" rx="12" fill="#fff9ef" stroke="#8e78a6" strokeWidth="4"/><circle cx="19" cy="21" r="7" fill={walking?'#e2bc85':working?'#82b99b':'#c5b8c8'}/><text x="38" y="28" fill="#645570" fontSize="20" fontWeight="bold">{activity}</text></g>
   </svg></div>
   <div className="floor-detail-footer"><div><strong>노아 · 개발 직원</strong><span>{activity} · {employee.task}</span></div><div><span>현재 업무 진행률</span><strong>{employee.progress}%</strong><div className="floor-meter"><i style={{width:`${employee.progress}%`}}/></div></div><span className="floor-mode">{running?'시뮬레이션 실행 중':'시뮬레이션 정지'}</span></div>
  </section>
 </div>
}
