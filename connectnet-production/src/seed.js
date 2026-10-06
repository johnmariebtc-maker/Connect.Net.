import dotenv from 'dotenv';dotenv.config();
import bcrypt from 'bcryptjs';import {db} from './db.js';
const plans=[['2GB',2,8],['4GB',4,20],['5GB',5,24],['6GB',6,29],['8GB',8,38],['10GB',10,44],['15GB',15,69],['20GB',20,88],['25GB',25,110],['30GB',30,130],['40GB',40,170],['50GB',50,220]];
for(const [name,gb,price] of plans)db.prepare('INSERT OR IGNORE INTO packages(name,data_bytes,duration_minutes,price_pesewas,active) VALUES(?,?,?,?,1)').run(name,gb*1024**3,0,price*100);
for(const h of [['Hostel A','Accra','mock'],['Hostel B','Accra','mock'],['School Block','Accra','mock']])db.prepare('INSERT INTO hotspots(name,location,provider) SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM hotspots WHERE name=?)').run(h[0],h[1],h[2],h[0]);
const email=process.env.ADMIN_EMAIL||'admin@connectnet.local',pass=process.env.ADMIN_PASSWORD||'ChangeMeNow!123';const exists=db.prepare('SELECT id FROM users WHERE email=?').get(email);if(!exists)db.prepare('INSERT INTO users(name,email,phone,password_hash,role) VALUES(?,?,?,?,"admin")').run('ConnectNet Administrator',email,'0000000000',await bcrypt.hash(pass,12));
console.log('Database seeded. Admin:',email);console.log('Change ADMIN_PASSWORD before production.');
