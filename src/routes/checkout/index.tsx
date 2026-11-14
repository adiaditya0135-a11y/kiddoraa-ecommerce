import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Banknote, CreditCard, Lock, ShieldCheck } from 'lucide-react'
import { COD_FEE, FREE_SHIPPING_THRESHOLD, findColor, findPack, formatINR, product } from '@/data/products'
import { getPaymentOptions, placeOrder } from '@/lib/orders'
import { useCart } from '@/lib/cart'
import { img } from '@/lib/img'

export const Route = createFileRoute('/checkout/')({
  loader: () => getPaymentOptions(),
  head: () => ({ meta: [{ title: 'Checkout | Kiddoraa' }] }),
  component: Checkout,
})

const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

function friendlyError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  try {
    const parsed = JSON.parse(msg)
    if (Array.isArray(parsed) && parsed[0]?.message) {
      return `${parsed[0].path?.join('.') ?? 'Field'}: ${parsed[0].message}`
    }
  } catch {
    /* not a validation payload */
  }
  return msg || 'Something went wrong. Please try again.'
}

function Checkout() {
  const options = Route.useLoaderData()
  const cart = useCart()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<'card' | 'cod'>(options.card ? 'card' : 'cod')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const codFee = payment === 'cod' ? COD_FEE : 0
  const total = cart.subtotal + cart.shipping + codFee

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '')
    try {
      const res = await placeOrder({
        data: {
          email: get('email'),
          phone: get('phone').replace(/\D/g, '').slice(-10),
          fullName: get('fullName'),
          address1: get('address1'),
          address2: get('address2'),
          city: get('city'),
          state: get('state'),
          pincode: get('pincode'),
          paymentMethod: payment,
          items: cart.lines,
        },
      })
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
        return
      }
      cart.clear()
      navigate({ to: '/order/$orderNumber', params: { orderNumber: res.orderNumber }, search: { email: res.email, new: true } })
    } catch (err) {
      setError(friendlyError(err))
      setSubmitting(false)
    }
  }

  if (hydrated && cart.lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-4xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-ink/70">Add a screaming chicken (or four) to get started.</p>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="btn-primary mt-8">Shop now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold">Checkout</h1>
      <p className="text-sm text-ink/60 mt-1 flex items-center gap-1.5"><Lock size={14} /> Secure checkout · Your details are safe with us</p>

      <form onSubmit={onSubmit} className="mt-8 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <div className="space-y-8">
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold mb-4">1. Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" placeholder="10-digit mobile" pattern="(\+?91)?[6-9][0-9]{9}" title="10-digit Indian mobile number" required />
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold mb-4">2. Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Field label="Full name" name="fullName" autoComplete="name" required minLength={2} /></div>
              <div className="sm:col-span-2"><Field label="House no., building, street" name="address1" autoComplete="address-line1" required minLength={3} /></div>
              <div className="sm:col-span-2"><Field label="Area, landmark (optional)" name="address2" autoComplete="address-line2" /></div>
              <Field label="City" name="city" autoComplete="address-level2" required />
              <Field label="Pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" title="6-digit pincode" maxLength={6} required />
              <label className="sm:col-span-2 block">
                <span className="block text-xs font-semibold mb-1.5 text-ink/70">State</span>
                <select name="state" required defaultValue="" className="field">
                  <option value="" disabled>Select state</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold mb-4">3. Payment</h2>
            <div className="space-y-3">
              <PaymentOption
                checked={payment === 'card'}
                disabled={!options.card}
                onSelect={() => setPayment('card')}
                icon={<CreditCard size={20} />}
                title="Pay online"
                subtitle={options.stripe ? 'Cards, UPI & more — secured by Stripe. No extra fee.' : 'Cards, UPI & more · Demo mode: no real charge yet.'}
              />
              <PaymentOption
                checked={payment === 'cod'}
                onSelect={() => setPayment('cod')}
                icon={<Banknote size={20} />}
                title="Cash on Delivery"
                subtitle={`Pay when your order arrives · +${formatINR(COD_FEE)} handling fee`}
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="card p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-bold">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {cart.lines.map((l) => {
              const pack = findPack(l.packId)!
              const color = findColor(l.colorId)!
              return (
                <li key={`${l.packId}-${l.colorId}`} className="flex gap-4 items-center">
                  <div className="relative">
                    <img src={img(product.images[0].src, 140)} alt="" className="w-16 h-16 rounded-xl object-cover bg-peach" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-cream text-xs grid place-items-center">{l.quantity}</span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold leading-snug">Screaming Chicken Keychain</p>
                    <p className="text-ink/60 text-xs">{pack.label} · {color.label}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatINR(pack.price * l.quantity)}</span>
                </li>
              )
            })}
          </ul>
          <dl className="mt-6 pt-5 border-t border-ink/10 space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(cart.subtotal)} />
            <Row label="Shipping" value={cart.shipping === 0 ? 'FREE' : formatINR(cart.shipping)} />
            {codFee > 0 && <Row label="COD handling" value={formatINR(codFee)} />}
            <div className="flex justify-between pt-3 border-t border-ink/10 font-display text-2xl font-extrabold">
              <dt>Total</dt><dd>{formatINR(total)}</dd>
            </div>
          </dl>
          {cart.shipping > 0 && (
            <p className="mt-3 text-xs text-ink/60">Add {formatINR(FREE_SHIPPING_THRESHOLD - cart.subtotal)} more for free shipping.</p>
          )}

          {error && (
            <p role="alert" className="mt-5 rounded-xl bg-coral/10 border border-coral/30 text-sm text-coral px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={submitting || !hydrated} className="btn-primary w-full mt-6 text-lg">
            {submitting ? 'Placing order…' : payment === 'card' ? `Pay ${formatINR(total)}` : `Place COD order · ${formatINR(total)}`}
          </button>
          <p className="mt-4 text-xs text-ink/50 flex items-center gap-1.5 justify-center">
            <ShieldCheck size={14} /> By placing your order you agree to our{' '}
            <Link to="/policies/$page" params={{ page: 'terms' }} className="underline">terms</Link>
          </p>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5 text-ink/70">{label}</span>
      <input {...props} className="field" />
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink/70">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

function PaymentOption(props: {
  checked: boolean
  disabled?: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <label
      className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition ${
        props.disabled ? 'opacity-50 cursor-not-allowed border-ink/10' : 'cursor-pointer'
      } ${props.checked ? 'border-ink bg-sun/25' : 'border-ink/10 hover:border-ink/30'}`}
    >
      <input
        type="radio"
        name="payment"
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onSelect}
        className="w-4 h-4 accent-[#2A1A3B]"
      />
      <span className="w-10 h-10 rounded-xl bg-white border border-ink/10 grid place-items-center">{props.icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{props.title}</span>
        <span className="block text-xs text-ink/60">{props.subtitle}</span>
      </span>
    </label>
  )
}
