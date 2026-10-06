(async()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];CN.theme();const menu=$('#menu'),burger=$('#burger');if(burger)burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
let packages=[];try{packages=await CN.api('/api/packages')}catch{}
$$('.buy').forEach(btn=>{btn.onclick=async()=>{if(!CN.token()){location.href='/login.htm?next=/payment.htm';return}const raw=btn.dataset.price;const found=packages.find(p=>Math.abs(Number(p.price_pesewas)/100-Number(raw))<.01||p.name===btn.dataset.plan);if(found)sessionStorage.setItem('cn_selected_package',String(found.id));location.href='/payment.htm'}});
})();
