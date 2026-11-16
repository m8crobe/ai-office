import {describe,it,expect} from 'vitest';
import {validateEvent,summarize} from './observer-core.mjs';
const start={employeeId:'dev',taskId:'task-1',summary:'Inspect ai-office',type:'start'};
const event={...start,source:'local-observation',timestamp:'2026-11-16T00:00:00.000Z'};
describe('local observation lifecycle',()=>{
it('starts all employees idle without fabricated progress',()=>{expect(summarize([]).every(e=>!e.active&&e.status==='대기'&&e.elapsedMs===0)).toBe(true);expect(summarize([])[0]).not.toHaveProperty('progress')});
it('requires a matching start and rejects overlapping or terminal task events',()=>{expect(()=>validateEvent({...start,type:'complete'},[])).toThrow();expect(()=>validateEvent(start,[event])).toThrow();expect(()=>validateEvent({...start,taskId:'other'},[event])).toThrow();expect(()=>validateEvent({...start,type:'progress',employeeId:'lead'},[event])).toThrow();expect(()=>validateEvent({...start,type:'progress'},[event,{...event,type:'complete'}])).toThrow()});
it('only changes activity from events and freezes elapsed time after termination',()=>{expect(validateEvent(start,[]).source).toBe('local-observation');const done={...event,type:'complete',timestamp:'2026-11-16T00:00:05.000Z'};const active=summarize([event],Date.parse(event.timestamp)+3000).find(e=>e.employeeId==='dev');expect(active.active).toBe(true);const ended=summarize([event,done],Date.parse(event.timestamp)+90000).find(e=>e.employeeId==='dev');expect(ended.status).toBe('대기');expect(ended.result).toBe('완료');expect(ended.elapsedMs).toBe(5000)});
it('retains failures as results but does not claim work continues',()=>{const e=summarize([event,{...event,type:'fail'}]).find(e=>e.employeeId==='dev');expect(e.result).toBe('실패');expect(e.active).toBe(false)});
});
