import jwt from 'jsonwebtoken';
import {db,logActivity} from '../db.js';
const secret=process.env.JWT_SECRET;
export function auth(req,res,next){
 const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):null;
 if(!t)return res.status(401).json({error:'Authentication required'});
 try{const p=jwt.verify(t,secret); const u=db.prepare('SELECT id,name,email,phone,role,status FROM users WHERE id=?').get(p.sub); if(!u||u.status!=='active')return res.status(401).json({error:'Account unavailable'}); req.user=u; next();}
 catch{return res.status(401).json({error:'Invalid or expired session'});}
}
export const admin=(req,res,next)=>{if(req.user?.role!=='admin')return res.status(403).json({error:'Admin access required'});next()};
export const optionalAuth=(req,res,next)=>{const h=req.headers.authorization||''; if(!h.startsWith('Bearer '))return next(); try{const p=jwt.verify(h.slice(7),secret); req.user=db.prepare('SELECT id,name,email,phone,role,status FROM users WHERE id=?').get(p.sub)}catch{} next()};
export function audit(req,action,entityType=null,entityId=null,details=null){logActivity({userId:req.user?.id||null,actorRole:req.user?.role||'guest',action,entityType,entityId,ip:req.ip,details});}
