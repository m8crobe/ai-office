import {describe,it,expect} from 'vitest';
import {advance,initialEmployees} from './simulation';
describe('simulation lifecycle',()=>{
it('advances active tasks without mutating original state',()=>{const copy=structuredClone(initialEmployees);const next=advance(copy,1);expect(next[1].progress).toBe(50);expect(copy).toEqual(initialEmployees);expect(next[3].status).toBe('대기')});
it('starts waiting staff on scheduled tick and eventually finishes',()=>{let team=structuredClone(initialEmployees);team=advance(team,3);expect(team[3].status).toBe('작업 중');for(let i=0;i<40;i++)team=advance(team,i);expect(team.every(e=>e.status==='완료'&&e.progress===100)).toBe(true)});
it('preserves errors and completed work',()=>{const team=structuredClone(initialEmployees);team[0].status='오류';team[1].status='완료';expect(advance(team,7).slice(0,2)).toEqual(team.slice(0,2))});
});
