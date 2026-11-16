import {readdirSync,readFileSync,statSync} from 'node:fs';
const rules=[/gh[pousr]_[A-Za-z0-9]{30,}/,/github_pat_[A-Za-z0-9_]{40,}/,/sk-[A-Za-z0-9_-]{24,}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/AKIA[0-9A-Z]{16}/];
const excluded=new Set(['.git','node_modules']);let count=0;let failed=false;
function scan(dir){for(const name of readdirSync(dir)){if(excluded.has(name))continue;const path=dir+'/'+name;if(statSync(path).isDirectory())scan(path);else {if(/^\.env($|\.)/.test(name)&&name!=='.env.example'){console.error('Private environment file:',path);failed=true;continue}if(/\.(png|gif|jpg|woff2?)$/.test(name))continue;const data=readFileSync(path,'utf8');count++;if(rules.some(r=>r.test(data))){console.error('Potential secret:',path);failed=true}}}}
scan('.');console.log(`Scanned ${count} files including build outputs; ${failed?'FAILED':'no known credential patterns found'}.`);process.exitCode=failed?1:0;
