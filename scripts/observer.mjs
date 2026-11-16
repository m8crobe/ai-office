import {createServer} from 'node:http';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync,appendFileSync,openSync,closeSync,unlinkSync,chmodSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validateEvent,gitEvidence,summarize} from './observer-core.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=join(root,'.local-observer');mkdirSync(dir,{recursive:true,mode:0o700});chmodSync(dir,0o700);
const journal=join(dir,'events.jsonl');
const load=()=>existsSync(journal)?readFileSync(journal,'utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)):[];
function record(input,extra={}){const lock=join(dir,'writer.lock');let fd;try{fd=openSync(lock,'wx',0o600);const event={...validateEvent(input,load()),id:randomBytes(12).toString('hex'),timestamp:new Date().toISOString(),evidence:[gitEvidence(root)],...extra};appendFileSync(journal,JSON.stringify(event)+'\n',{mode:0o600});console.log(`${event.type}: ${event.taskId}`);}finally{if(fd!==undefined){closeSync(fd);unlinkSync(lock)}}}
const [command,...args]=process.argv.slice(2);
if(command==='event'){
 const [type,employeeId,taskId,...summary]=args;record({type,employeeId,taskId,summary:summary.join(' ')});
}else if(command==='check'){
 const taskId='test-'+Date.now();record({type:'start',employeeId:'review',taskId,summary:'사용자가 명시적으로 요청한 npm test 검증'});
 const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['test'],{cwd:root,stdio:'inherit',shell:false});
 const exitCode=result.status;record({type:exitCode===0?'complete':'fail',employeeId:'review',taskId,summary:exitCode===0?'npm test 종료 코드 0':'npm test 실패 또는 실행 오류'},{evidence:[gitEvidence(root),{kind:'test-execution',command:'npm test',exitCode,signal:result.signal,verification:'Observer CLI ran fixed command; exit code only, not individual assertion count'}]});process.exitCode=exitCode??1;
}else if(command==='serve'){
 const secretPath=join(dir,'access-token');if(!existsSync(secretPath))writeFileSync(secretPath,randomBytes(32).toString('hex'),{mode:0o600});chmodSync(secretPath,0o600);
 const token=readFileSync(secretPath,'utf8').trim();const sessions=new Map();const port=4318;const origin=`http://127.0.0.1:${port}`;
 const server=createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 const send=(code,body,type='application/json')=>{res.writeHead(code,{'Content-Type':type});res.end(type==='application/json'?JSON.stringify(body):body)};
 if(req.headers.host!==`127.0.0.1:${port}`)return send(403,{error:'Invalid host'});
 if(req.headers.origin&&req.headers.origin!==origin)return send(403,{error:'Invalid origin'});
 if(req.method==='POST'&&req.url==='/login'){
 if(req.headers.origin!==origin||req.headers['content-type']!=='application/json')return send(403,{error:'Origin required'});
 let body='';for await(const chunk of req){body+=chunk;if(body.length>1024)return send(413,{error:'Too large'})}
 let value;try{value=JSON.parse(body).token}catch{return send(400,{error:'Invalid JSON'})}
 if(typeof value!=='string'||Buffer.byteLength(value)!==Buffer.byteLength(token)||!timingSafeEqual(Buffer.from(value),Buffer.from(token)))return send(401,{error:'Authentication failed'});
 const sid=randomBytes(32).toString('hex');sessions.set(sid,Date.now()+3600000);res.setHeader('Set-Cookie',`office_session=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`);return send(200,{ok:true});}
 const sid=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('office_session='))?.slice(15);
 if(req.url==='/api/state'){
 if(req.method!=='GET')return send(405,{error:'Read only'});
 if(!sid||!sessions.has(sid)||sessions.get(sid)<Date.now())return send(401,{error:'Authentication required'});
 try{return send(200,{source:'local-observation',repository:'ai-office',employees:summarize(load()),snapshot:gitEvidence(root),notice:'Explicit CLI observations. Codex process/session is not automatically detected.'})}catch{return send(500,{error:'Unable to read observation data'})}}
 const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};const file=files[req.url];if(req.method!=='GET'||!file)return send(404,{error:'Not found'});
 send(200,readFileSync(join(root,'local',file),'utf8'),file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
 });server.listen(port,'127.0.0.1',()=>console.log(`Local observer: ${origin}\nRead .local-observer/access-token locally to sign in. Never publish or share it.`));
}else{console.error('Usage: node scripts/observer.mjs serve | event <start|progress|complete|fail> <employeeId> <taskId> <summary> | check');process.exitCode=1}
