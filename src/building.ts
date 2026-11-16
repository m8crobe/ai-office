/** Two simulated projects share one floor. The ground floor remains available when empty. */
export function floorCountForProjects(projectCount:number){return Math.max(1,Math.ceil(projectCount/2))}
