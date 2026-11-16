import {expect,it} from 'vitest';
import {floorCountForProjects} from './building';
it('grows and shrinks the building at each second project boundary',()=>{
 expect([0,1,2,3,4,5,6].map(floorCountForProjects)).toEqual([1,1,1,2,2,3,3]);
});
