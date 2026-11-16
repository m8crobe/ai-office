import type {Employee} from './simulation';
/** The original Canvas character. Kept for the other three employees and for visual comparison. */
export function drawLegacyPerson(c:CanvasRenderingContext2D,e:Employee,x:number,y:number,selected=false,bob=0){
 y+=bob;const rect=(a:number,b:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(a),Math.round(b),w,h)};
 rect(x+3,y+35,7,13,'#555569');rect(x+15,y+35,7,13,'#555569');rect(x+1,y+47,10,4,'#615d6c');rect(x+15,y+47,10,4,'#615d6c');rect(x,y+21,25,18,e.color);rect(x-4,y+24,5,15,'#ecc3a6');rect(x+24,y+24,5,15,'#ecc3a6');rect(x+3,y+3,19,19,'#edc9ac');rect(x,y,25,8,e.id==='research'?'#b9836f':'#655967');rect(x,y+5,5,9,'#655967');rect(x+19,y+5,6,8,'#655967');rect(x+8,y+12,2,3,'#504b5a');rect(x+17,y+12,2,3,'#504b5a');rect(x+11,y+19,5,2,'#bd887c');
 rect(x+6,y-21,14,13,'#fff9ef');rect(x+8,y-19,9,8,e.status==='오류'?'#ce8079':e.status==='완료'?'#83aa8a':'#f7f2df');if(selected){rect(x-8,y+53,41,3,e.color);rect(x-12,y+48,4,4,e.color);rect(x+34,y+48,4,4,e.color)}
}
