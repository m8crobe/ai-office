import {useEffect,useRef,useState} from 'react';
import type {Employee} from './simulation';
import {noahSprite} from './noahSprite';

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
 const x=working?(reduced?290:lerp(522,290,t)):522;const y=working?(reduced?392:lerp(410,392,t)):410;
 const frame=walking?(step%6<3?1:2):working&&running&&(phase>=24&&phase<62||reduced)?3:0;
 const activity=working&&!running?'일시정지':walking?'이동 중':working?'책상에서 작업 중':'대기 중';
 return <div className="floor-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="floor-dialog" role="dialog" aria-modal="true" aria-labelledby="floor-heading">
   <div className="floor-dialog-header"><div><span>AI OFFICE · SIMULATION</span><h2 id="floor-heading">2F 개발팀 · 공간 확대</h2><p>마름모꼴 바닥을 따라 노아가 자동으로 이동합니다. 업무와 이동은 시뮬레이션입니다.</p></div><button ref={close} className="floor-close" onClick={onClose} aria-label="2층 확대 화면 닫기">×</button></div>
   <div ref={scroll} className="floor-detail-scroll"><svg className="floor-scene" viewBox="0 0 1000 660" role="img" aria-label={`2층 단면도: 노아 ${activity}. 책상 두 개, 책장과 화분, 유리 회의실이 있는 마름모꼴 공간`}>
    <defs><clipPath id="floor-diamond"><polygon points="500,205 950,382 500,625 50,382"/></clipPath><linearGradient id="window-blue" x2="0" y2="1"><stop stopColor="#b2d4eb"/><stop offset="1" stopColor="#e2f3ec"/></linearGradient></defs>
    <rect width="1000" height="660" fill="#edf2ee"/>
    <polygon points="60,192 500,52 500,205 60,382" fill="#f4dfe7" stroke="#94799d" strokeWidth="5"/>
    <polygon points="500,52 940,192 940,382 500,205" fill="#eadde9" stroke="#94799d" strokeWidth="5"/>
    <path d="M60 192 500 52 940 192" fill="none" stroke="#fff1e9" strokeWidth="11"/>
    <polygon points="96,211 247,162 247,290 96,348" fill="url(#window-blue)" stroke="#a884a5" strokeWidth="8"/>
    <path d="M170 187V319 M96 279 247 224" stroke="#f9f2e7" strokeWidth="7"/>
    <polygon points="291,144 439,96 439,215 291,267" fill="url(#window-blue)" stroke="#a884a5" strokeWidth="8"/>
    <path d="M364 120V242 M291 206 439 157" stroke="#f9f2e7" strokeWidth="7"/>
    <polygon points="500,205 950,382 500,625 50,382" fill="#f5dce0" stroke="#9b7fa2" strokeWidth="8"/>
    <g clipPath="url(#floor-diamond)" stroke="#e6c3cf" strokeWidth="2" opacity=".8">{Array.from({length:13},(_,i)=><g key={i}><path d={`M${-140+i*95} 185 ${550+i*95} 675`}/><path d={`M${1140-i*95} 185 ${450-i*95} 675`}/></g>)}</g>
    <path d="M50 382 500 625 950 382" fill="none" stroke="#b695aa" strokeWidth="13"/>
    <path d="M50 377 500 615 950 377" fill="none" stroke="#fff0e5" strokeWidth="5"/>
    {/* Simple furniture, separate from the floor and employee layers. */}
    <g stroke="#9d839d" strokeWidth="4" strokeLinejoin="round"><path d="M163 315 281 360 235 383 116 337Z" fill="#ffe9ca"/><path d="M116 337v51m119-5v48m46-71v45" fill="none"/><path d="M370 235 484 279 439 304 326 259Z" fill="#ffe9ca"/><path d="M326 259v63m113-18v52m45-77v42" fill="none"/>
    <path d="M175 270 218 283v43l-43-14Z" fill="#5c6781"/><path d="M182 276 211 285v30l-29-9Z" fill="#bad6e1" stroke="none"/><path d="M187 318 225 331" fill="none"/>
    <path d="M386 190 427 204v44l-41-14Z" fill="#5c6781"/><path d="M392 197 421 207v30l-29-10Z" fill="#bad6e1" stroke="none"/>
    <path d="M280 355 318 368v40l-38-13Z" fill="#a1bfae"/><path d="M464 288 502 301v40l-38-13Z" fill="#a1bfae"/></g>
    <g stroke="#a48299" strokeWidth="4"><path d="M535 167 607 187v107l-72-20Z" fill="#d9b5a9"/><path d="M541 176 600 193v25l-59-17Z" fill="#ffe5c6"/><path d="M541 215 600 232v25l-59-17Z" fill="#ffe5c6"/><path d="M550 180v20m12-17v20m15-16v19m15-16v19M550 218v20m14-16v20m15-15v20m12-16v20" stroke="#9fb5af" strokeWidth="6"/></g>
    <g><path d="M616 181 634 156 652 181Z" fill="#81a991"/><path d="M619 185h30v25h-30Z" fill="#fff1dc" stroke="#b596a4" strokeWidth="3"/></g>
    {/* A light glass meeting nook; the near edge stays transparent. */}
    <g stroke="#a790b0" strokeWidth="5" fill="none"><path d="M677 208 843 257 905 231 742 181Z" fill="#e1edf0" fillOpacity=".55"/><path d="M677 208v178l166 70V257M905 231v174l-62 51M742 181v174"/><path d="M677 386 843 456 905 405"/></g>
    <path d="M684 217v164l157 66V265Z" fill="#d6e8ea" opacity=".36"/>
    <g stroke="#9d839d" strokeWidth="4"><path d="M750 337 805 352 784 363 729 348Z" fill="#fff1d8"/><path d="M740 360v27m55-25v30"/><path d="M705 326 729 333v28l-24-8Z" fill="#e7bbca"/><path d="M817 358 841 365v28l-24-8Z" fill="#e7bbca"/></g>
    <path d="M408 430 Q355 410 320 402" fill="none" stroke="#a6a0c6" strokeWidth="6" strokeDasharray="5 13" opacity={working?.8:0}/>
    <ellipse cx={x+26} cy={y+73} rx="23" ry="7" fill="#987a93" opacity=".25"/>
    <svg x={x} y={y} width="56" height="84" viewBox="0 0 32 48" overflow="hidden" style={{imageRendering:'pixelated'}}><image href={noahSprite.url} x={-32*frame} width="128" height="48"/></svg>
    <g transform={`translate(${x+49} ${y-23})`}><rect x="0" y="0" width="112" height="29" rx="8" fill="#fff9ef" stroke="#b295b4" strokeWidth="3"/><circle cx="14" cy="14" r="5" fill={walking?'#e2bc85':working?'#82b99b':'#c5b8c8'}/><text x="26" y="19" fill="#645570" fontSize="14" fontWeight="bold">{activity}</text></g>
   </svg></div>
   <div className="floor-detail-footer"><div><strong>노아 · 개발 직원</strong><span>{activity} · {employee.task}</span></div><div><span>현재 업무 진행률</span><strong>{employee.progress}%</strong><div className="floor-meter"><i style={{width:`${employee.progress}%`}}/></div></div><span className="floor-mode">{running?'시뮬레이션 실행 중':'시뮬레이션 정지'}</span></div>
  </section>
 </div>
}
