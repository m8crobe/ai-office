import {execFileSync} from 'node:child_process';
import {realpathSync} from 'node:fs';
export const employeeIds=['lead','dev','review','research'];
export function validateEvent(input,events){
 if(!input||!employeeIds.includes(input.employeeId)||!['start','progress','complete','fail'].includes(input.type)||typeof input.taskId!=='string'||!/^[\w-]{1,80}$/.test(input.taskId)||typeof input.summary!=='string'||!input.summary.trim()||input.summary.length>500)throw Error('Invalid event');
 const previous=events.filter(e=>e.taskId===input.taskId);const last=previous.at(-1);
 if(input.type==='start'){if(last||events.some(e=>e.employeeId===input.employeeId&&['start','progress'].includes(e.type)&&!events.some(t=>t.taskId===e.taskId&&['complete','fail'].includes(t.type))))throw Error('Task or employee already active');}
 else if(!last||!['start','progress'].includes(last.type)||last.employeeId!==input.employeeId)throw Error('No matching active task');
 return {source:'local-observation',producer:'explicit-cli',employeeId:input.employeeId,taskId:input.taskId,type:input.type,summary:input.summary.trim()};
}
export function gitEvidence(root){
 const git=(args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:1024*1024}).trim();
 if(realpathSync(git(['rev-parse','--show-toplevel']))!==realpathSync(root))throw Error('Unexpected repository');
 return {kind:'git-snapshot',head:git(['rev-parse','HEAD']),changes:git(['status','--porcelain=v1','--untracked-files=no']).split('\n').filter(Boolean),verification:'Read directly from this checkout; does not prove Codex authorship or a GitHub push'};
}
export function summarize(events,now=Date.now()){
 return employeeIds.map(employeeId=>{const own=events.filter(e=>e.employeeId===employeeId);const last=own.at(-1);const start=own.find(e=>e.taskId===last?.taskId&&e.type==='start');const active=last&&['start','progress'].includes(last.type);return {employeeId,status:active?'작업 중':'대기',active:!!active,task:last?.summary??'실제 작업 없음',taskId:last?.taskId??null,lastActivity:last?.timestamp??null,elapsedMs:start?Math.max(0,(active?now:Date.parse(last.timestamp))-Date.parse(start.timestamp)):0,result:last?.type==='complete'?'완료':last?.type==='fail'?'실패':null,history:own.slice(-20).reverse()};});
}
