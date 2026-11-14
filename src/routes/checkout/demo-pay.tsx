import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { CreditCard, FlaskConical } from 'lucide-react'
import { completeDemoPayment, lookupOrder } from '@/lib/orders'
import { formatINR } from '@/data/products'
import { useCart } from '@/lib/cart'

/**
 * Mock payment page used only while STRIPE_SECRET_KEY is not configured.
 * Once the key is set, checkout redirects to real Stripe Checkout instead.
 */
export const Route = createFileRoute('/checkout/demo-pay')({
  validateSearch: z.object({ order: z.string().default(''), email: z.string().default('') }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (!deps.order || !deps.email) return null
    try {
      return await lookupOrder({ data: { orderNumber: deps.order, email: deps.email } })
    } catch {
      return null
    }
  },
  head: () => ({ meta: [{ title: 'Payment | Kiddoraa' }] }),
  component: DemoPay,
})

function DemoPay() {
  const order = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const { clear } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-4xl font-extrabold">Order not found</h1>
        <Link to="/checkout" className="btn-primary mt-8">Back to checkout</Link>
      </div>
    )
  }

  const pay = async () => {
    setBusy(true)
    setError(null)
    try {
      await completeDemoPayment({ data: { orderNumber: search.order, email: search.email } })
      clear()
      navigate({ to: '/order/$orderNumber', params: { orderNumber: order.orderNumber }, search: { email: search.email, new: true } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="rounded-2xl bg-sun/40 border border-ink/20 px-4 py-3 text-sm flex gap-2">
        <FlaskConical size={18} className="shrink-0 mt-0.5" />
        <span><b>Demo payment mode.</b> Online payments are not connected yet, so no money is charged. Set a Stripe key to switch on real card and UPI payments.</span>
      </div>
      <div className="card p-6 mt-6">
        <p className="text-xs text-ink/60">Paying Kiddoraa for order</p>
        <p className="font-display text-2xl font-bold">{order.orderNumber}</p>
        <p className="font-display text-5xl font-extrabold mt-4">{formatINR(order.total)}</p>
        <div className="mt-6 space-y-3">
          <input className="field" defaultValue="4242 4242 4242 4242" aria-label="Card number (demo)" readOnly />
          <div className="grid grid-cols-2 gap-3">
            <input className="field" defaultValue="12 / 30" aria-label="Expiry (demo)" readOnly />
            <input className="field" defaultValue="123" aria-label="CVC (demo)" readOnly />
          </div>
        </div>
        {order.status !== 'pending_payment' ? (
          <Link to="/order/$orderNumber" params={{ orderNumber: order.orderNumber }} search={{ email: search.email }} className="btn-secondary w-full mt-6">
            Already paid · View order
          </Link>
        ) : (
          <button onClick={pay} disabled={busy} className="btn-primary w-full mt-6">
            <CreditCard size={18} /> {busy ? 'Processing…' : `Pay ${formatINR(order.total)} (demo)`}
          </button>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-coral">{error}</p>}
        <Link to="/checkout/cancel" className="block text-center text-sm text-ink/60 underline mt-4">Cancel payment</Link>
      </div>
    </div>
  )
}
