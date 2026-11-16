import {useEffect,useRef,useState} from 'react';
import type {Employee} from './simulation';
const assets=['planning-floor.png','development-floor.png','research-floor.png'];
const titles=['기획 · 검토팀','개발팀','연구 · 자동화팀'];
const spriteUrl=(id:string)=>`${import.meta.env.BASE_URL}sprites/${id==='dev'?'noah':id}.svg`;
const starts:Record<string,[number,number]>={lead:[1190,610],dev:[780,620],review:[440,610],research:[975,685]};
const targets:Record<string,[number,number]>={lead:[880,505],dev:[520,510],review:[360,525],research:[700,495]};
const movingStatus=(e:Employee)=>['작업 중','검토 중','회의 중'].includes(e.status);

/** Read-only isometric room; animation runs only while the simulation is active. */
export function FloorDetail({floor,employees,projects,running,onSelect,onClose}:{floor:number;employees:Employee[];projects:string[];running:boolean;onSelect:(id:string)=>void;onClose:()=>void}){
 const [step,setStep]=useState(0);const [reduced,setReduced]=useState(false);
 const close=useRef<HTMLButtonElement>(null);const scroll=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{if(scroll.current)scroll.current.scrollLeft=(scroll.current.scrollWidth-scroll.current.clientWidth)/2;close.current?.focus();const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[onClose]);
 useEffect(()=>{if(!running||reduced||!employees.some(movingStatus))return;const timer=window.setInterval(()=>setStep(s=>(s+1)%90),120);return()=>clearInterval(timer)},[running,reduced,employees]);
 const phase=step%90;const travel=phase<24?phase/24:phase<62?1:phase<86?1-(phase-62)/24:0;
 const room=assets[Math.min(floor,3)-1];const title=titles[floor-1]??'프로젝트 공간';
 return <div className="floor-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="floor-dialog" role="dialog" aria-modal="true" aria-labelledby="floor-heading">
  <div className="floor-dialog-header"><div><span>AI OFFICE · SIMULATION</span><h2 id="floor-heading">{floor}F {title} · 공간 확대</h2><p>직원이 업무 공간 사이를 자동으로 이동합니다. 표시된 이동과 업무는 시뮬레이션입니다.</p></div><button ref={close} className="floor-close" onClick={onClose} aria-label={`${floor}층 확대 화면 닫기`}>×</button></div>
  <div ref={scroll} className="floor-detail-scroll"><svg className="floor-scene" viewBox="0 0 1672 941" role="img" aria-label={`${floor}층 마름모꼴 단면 공간. 직원 ${employees.map(e=>e.name).join(', ')||'없음'}`}>
   <image href={`${import.meta.env.BASE_URL}rooms/${room}`} width="1672" height="941"/>
   {employees.map((e,i)=>{const active=movingStatus(e);const walk=running&&active&&!reduced&&(phase<24||phase>=62&&phase<86);const start=starts[e.id]??[830+i*90,620] as [number,number];const target=targets[e.id]??[520+i*90,510] as [number,number];const t=reduced&&running&&active?1:active?travel:0;const x=start[0]+(target[0]-start[0])*t;const y=start[1]+(target[1]-start[1])*t;const frame=walk?(step%6<3?1:2):active&&running&&(phase>=24&&phase<62||reduced)?3:0;const activity=!running?'일시정지':walk?'이동 중':active?e.status:'대기 중';return <g key={e.id}>
    <ellipse cx={x+54} cy={y+154} rx="41" ry="12" fill="#715b87" opacity=".22"/>
    <svg x={x} y={y} width="108" height="162" viewBox="0 0 32 48" overflow="hidden" style={{imageRendering:'pixelated'}}><image href={spriteUrl(e.id)} x={-32*frame} width="128" height="48"/></svg>
    <g transform={`translate(${x+73} ${y-23})`}><rect width={employees.length>2?72:126} height="37" rx="10" fill="#fff9ef" stroke="#8e78a6" strokeWidth="3"/><text x="10" y="25" fill="#645570" fontSize="18" fontWeight="bold">{employees.length>2?e.name:`${e.name} · ${activity}`}</text></g>
   </g>})}
  </svg></div>
  <div className="floor-detail-footer"><div><strong>{floor}층 프로젝트</strong><span>{projects.length?projects.join(' · '):'배정된 프로젝트 없음'}</span></div><div className="floor-staff-list">{employees.map(e=><button key={e.id} onClick={()=>onSelect(e.id)}>{e.name} · {e.status} · {e.task}</button>)}</div><span className="floor-mode">{running?'시뮬레이션 실행 중':'시뮬레이션 정지'}</span></div>
 </section></div>
}
