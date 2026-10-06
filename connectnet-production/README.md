# ConnectNet production backend

This project turns the supplied ConnectNet frontend into a real Node.js/SQLite application.

## Main flow
1. Customer signs up. Password is bcrypt-hashed and the account is stored in SQLite.
2. Customer is redirected to login and must authenticate before purchasing.
3. Customer selects a server-side package and hotspot. The browser cannot set the price.
4. Backend creates a Paystack transaction. Customer completes Mobile Money/card/bank checkout.
5. Paystack webhook/verification marks the order paid.
6. Backend generates a unique voucher, provisions it on MikroTik when configured, and emails the voucher.
7. The voucher has the exact package data limit. MikroTik enforces `limit-bytes-total`; the backend also polls usage and marks the voucher exhausted/disabled.
8. Once the voucher is exhausted/expired/disabled, the customer can purchase another package.
9. Admin dashboard exposes customers, orders, vouchers, packages, hotspots, support and activity logs.

## Install
```bash
cp .env.example .env
npm install
npm run seed
npm start
```
Open http://localhost:3000/connectnet-homepage.html

## Production configuration
Set a long random `JWT_SECRET`, real admin credentials, `APP_URL`, Paystack secret, SMTP settings and MikroTik settings.

`PAYMENT_PROVIDER=paystack`
`HOTSPOT_PROVIDER=mikrotik`

Paystack webhook:
`https://YOUR-DOMAIN/api/payments/webhook`

## Important
- Never expose PAYSTACK_SECRET_KEY, JWT_SECRET or MikroTik passwords to browser JavaScript.
- Use HTTPS in production.
- Test MikroTik provisioning with a non-production router/profile first.
- SQLite is suitable for a small deployment. Move to PostgreSQL when traffic/transaction volume grows.
- Direct MTN/Vodafone/AirtelTigo USSD/prompt flows can be added through a Ghana-specific payment adapter if you prefer Hubtel or another provider instead of Paystack hosted checkout.
