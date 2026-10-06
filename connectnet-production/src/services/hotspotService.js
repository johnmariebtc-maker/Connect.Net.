import https from 'node:https';
const base=()=>String(process.env.MIKROTIK_URL||'').replace(/\/$/,'');
function req(path,method='GET',body){return new Promise((resolve,reject)=>{const url=new URL(base()+path);const r=https.request(url,{method,headers:{'Content-Type':'application/json',Authorization:'Basic '+Buffer.from(`${process.env.MIKROTIK_USERNAME}:${process.env.MIKROTIK_PASSWORD}`).toString('base64')},rejectUnauthorized:String(process.env.MIKROTIK_VERIFY_TLS)==='true'},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{if(res.statusCode>=200&&res.statusCode<300)resolve(d?JSON.parse(d):{});else reject(new Error(`MikroTik ${res.statusCode}: ${d}`))})});r.on('error',reject);if(body)r.write(JSON.stringify(body));r.end()})}
export async function provisionVoucher(v){
 if((process.env.HOTSPOT_PROVIDER||'mock')==='mock')return {ok:true,mock:true};
 const limitUptime=v.duration_minutes?`${v.duration_minutes}m`:undefined;
 const payload={name:v.username,password:v.password,profile:v.profile||process.env.MIKROTIK_PROFILE||'default',comment:`ConnectNet order ${v.reference}`, 'limit-bytes-total':String(v.data_limit_bytes),...(limitUptime?{'limit-uptime':limitUptime}:{})};
 await req('/rest/ip/hotspot/user','PUT',payload); return {ok:true,mock:false};
}
export async function disableVoucher(username){if((process.env.HOTSPOT_PROVIDER||'mock')==='mock')return {ok:true,mock:true};const users=await req('/rest/ip/hotspot/user');const u=(Array.isArray(users)?users:[]).find(x=>x.name===username);if(!u)return {ok:true,notFound:true};await req('/rest/ip/hotspot/user/'+encodeURIComponent(u['.id']),'PATCH',{disabled:'yes'});return {ok:true};}
export async function getUsage(username){if((process.env.HOTSPOT_PROVIDER||'mock')==='mock')return null;const users=await req('/rest/ip/hotspot/user');const u=(Array.isArray(users)?users:[]).find(x=>x.name===username);if(!u)return null;return {bytes:u['bytes-in']+u['bytes-out']};}
