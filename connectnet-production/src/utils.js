import crypto from 'node:crypto';
export const ghc = p => (Number(p)/100).toFixed(2);
export const ref = () => `CN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
export const token = () => crypto.randomBytes(32).toString('hex');
export const hashToken = s => crypto.createHash('sha256').update(s).digest('hex');
export const voucherCredential = (n=8) => crypto.randomBytes(Math.ceil(n/2)).toString('hex').slice(0,n).toUpperCase();
export const normalizePhone = p => String(p||'').replace(/[\s()-]/g,'');
export const json = s => { try{return s?JSON.parse(s):null}catch{return null} };
