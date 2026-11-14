# Kiddoraa store

Single-product dropshipping store (TanStack Start + React 19 + Tailwind 4) selling the Kiddoraa Screaming Chicken squeeze keychain in INR.

## Source map

- `src/data/products.ts`: product, pack/colour options, prices (INR), shipping/COD rules. Server-authoritative for pricing.
- `src/data/content.ts`: reviews, FAQs, policy pages.
- `src/lib/cart.tsx`: cart context persisted to localStorage (read only after hydration).
- `src/lib/orders.ts`: server functions — placeOrder (re-prices from catalog, saves to DB, creates Stripe Checkout session), confirmCardPayment (verifies session with Stripe), lookupOrder (order number + email), completeDemoPayment (demo mode only).
- `db/schema.ts`: Drizzle `orders` table on Netlify Database. Migrations live in `netlify/database/migrations` (generate with `npx drizzle-kit generate --name <name>`; never apply manually).
- Routes: `/`, `/products/$slug`, `/checkout`, `/checkout/demo-pay`, `/checkout/success`, `/checkout/cancel`, `/order/$orderNumber`, `/track`, `/policies/$page`.

## Payments

- Cash on Delivery always available (+₹29 fee).
- `STRIPE_SECRET_KEY` set → real Stripe Checkout (INR, cards/UPI); return origin is derived from the request.
- `STRIPE_SECRET_KEY` unset → demo mode: online payments go to a clearly labelled mock page that marks the order paid without charging. Demo payments are refused once the key exists.
- No webhook yet: card orders are marked paid when the customer returns to the success page and Stripe confirms `payment_status === 'paid'`.

## Development

`netlify dev` (proxy 8888 → Vite 3000). `npm run typecheck` after routes are generated. Images are AI-generated originals in `public/img`, served via the Netlify Image CDN (`src/lib/img.ts`).
