import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
const dbPath = path.resolve(process.env.DB_PATH || './data/connectnet.db');
fs.mkdirSync(path.dirname(dbPath), {recursive:true});
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE,
 email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer',
 status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 last_login_at TEXT, last_ip TEXT
);
CREATE TABLE IF NOT EXISTS packages (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, data_bytes INTEGER NOT NULL,
 duration_minutes INTEGER NOT NULL, price_pesewas INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS hotspots (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location TEXT NOT NULL,
 router_url TEXT, provider TEXT NOT NULL DEFAULT 'mock', profile TEXT NOT NULL DEFAULT 'default',
 active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
 id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL,
 package_id INTEGER NOT NULL, hotspot_id INTEGER NOT NULL, amount_pesewas INTEGER NOT NULL,
 payment_method TEXT NOT NULL, payment_status TEXT NOT NULL DEFAULT 'pending',
 provider TEXT NOT NULL, provider_reference TEXT, metadata_json TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 paid_at TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(package_id) REFERENCES packages(id), FOREIGN KEY(hotspot_id) REFERENCES hotspots(id)
);
CREATE TABLE IF NOT EXISTS vouchers (
 id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, order_id INTEGER NOT NULL UNIQUE,
 package_id INTEGER NOT NULL, hotspot_id INTEGER NOT NULL, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active', data_limit_bytes INTEGER NOT NULL, data_used_bytes INTEGER NOT NULL DEFAULT 0,
 expires_at TEXT, activated_at TEXT, exhausted_at TEXT, disabled_at TEXT, email_sent_at TEXT,
 router_sync_status TEXT NOT NULL DEFAULT 'pending', router_error TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(order_id) REFERENCES orders(id),
 FOREIGN KEY(package_id) REFERENCES packages(id), FOREIGN KEY(hotspot_id) REFERENCES hotspots(id)
);
CREATE TABLE IF NOT EXISTS support_tickets (
 id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT NOT NULL, phone TEXT, email TEXT,
 issue TEXT, location TEXT, reference TEXT, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 admin_note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS password_resets (
 id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT NOT NULL UNIQUE,
 expires_at TEXT NOT NULL, used_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS activity_logs (
 id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, actor_role TEXT, action TEXT NOT NULL,
 entity_type TEXT, entity_id INTEGER, ip TEXT, details_json TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id,created_at);
CREATE INDEX IF NOT EXISTS idx_vouchers_user ON vouchers(user_id,status);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
`);
export function logActivity({userId=null,actorRole=null,action,entityType=null,entityId=null,ip=null,details=null}) {
 db.prepare(`INSERT INTO activity_logs(user_id,actor_role,action,entity_type,entity_id,ip,details_json) VALUES(?,?,?,?,?,?,?)`)
 .run(userId,actorRole,action,entityType,entityId,ip,details?JSON.stringify(details):null);
}
