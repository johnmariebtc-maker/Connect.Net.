const CN={
 token:()=>localStorage.getItem('cn_token'),
 setToken:t=>localStorage.setItem('cn_token',t),
 logout:()=>{localStorage.removeItem('cn_token');location.href='/login.htm'},
 async api(path,opt={}){const headers={'Content-Type':'application/json',...(opt.headers||{})};const t=CN.token();if(t)headers.Authorization=`Bearer ${t}`;const r=await fetch(path,{...opt,headers});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||'Request failed');return d},
 ghc:p=>`GH₵ ${(Number(p)/100).toFixed(2)}`,
 bytes:n=>n>=1024**3?`${(n/1024**3).toFixed(2)} GB`:n>=1024**2?`${Math.round(n/1024**2)} MB`: `${n} B`,
 theme(){const root=document.documentElement;let t=localStorage.getItem('cn-theme')||'light';root.setAttribute('data-theme',t);const b=document.querySelector('#theme');if(b)b.onclick=()=>{t=t==='dark'?'light':'dark';localStorage.setItem('cn-theme',t);root.setAttribute('data-theme',t)}}
};
CN.theme();
