export const statuses = ['대기', '작업 중', '회의 중', '검토 중', '완료', '오류'] as const;
export type Status = typeof statuses[number];
export interface Employee {id:string;name:string;role:string;floor:number;status:Status;task:string;progress:number;color:string;history:string[]}
export const initialEmployees:Employee[] = [
{id:'lead',name:'루미',role:'팀장 · 기획',floor:1,status:'회의 중',task:'새로운 아이디어를 실행 계획으로 정리하기',progress:72,color:'#a68fc6',history:['요청을 분석하고 업무를 나누었어요.']},
{id:'dev',name:'노아',role:'개발자',floor:2,status:'작업 중',task:'사무실 대시보드 컴포넌트 구현',progress:46,color:'#769ec2',history:['대시보드 구현을 시작했어요.']},
{id:'review',name:'미오',role:'검토자',floor:1,status:'검토 중',task:'화면 접근성과 반응형 레이아웃 검토',progress:81,color:'#81a991',history:['체크리스트를 확인하고 있어요.']},
{id:'research',name:'아리',role:'연구 · 자동화',floor:3,status:'대기',task:'다음 자동화 아이디어 조사',progress:0,color:'#d59d89',history:['새로운 업무를 기다리고 있어요.']}
];
export function advance(team:Employee[], tick:number):Employee[]{return team.map((e,i)=>{
if(e.status==='오류'||e.status==='완료')return e;
if(e.status==='대기' && tick%3!==0)return e;
const progress=Math.min(100,e.progress+3+i);
const status:Status=progress===100?'완료':progress>85?'검토 중':tick%7===0?'회의 중':'작업 중';
return {...e,progress,status,history:status!==e.status?[`${status} 상태로 변경되었어요.`,...e.history].slice(0,8):e.history};});}
