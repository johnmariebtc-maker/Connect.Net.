export async function paystackInitialize({email,amount,reference,metadata}){
 const key=process.env.PAYSTACK_SECRET_KEY;if(!key)throw new Error('PAYSTACK_SECRET_KEY is not configured');
 const r=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({email,amount,reference,callback_url:process.env.PAYSTACK_CALLBACK_URL,metadata,channels:['mobile_money','card','bank']})});
 const d=await r.json();if(!r.ok||!d.status)throw new Error(d.message||'Payment initialization failed');return d.data;
}
export async function paystackVerify(reference){const key=process.env.PAYSTACK_SECRET_KEY;if(!key)throw new Error('PAYSTACK_SECRET_KEY is not configured');const r=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${key}`}});const d=await r.json();if(!r.ok||!d.status)throw new Error(d.message||'Payment verification failed');return d.data;}
export function verifyWebhook(raw,signature){const key=process.env.PAYSTACK_SECRET_KEY;if(!key)return false;return crypto.createHmac('sha512',key).update(raw).digest('hex')===signature}
import crypto from 'node:crypto';
