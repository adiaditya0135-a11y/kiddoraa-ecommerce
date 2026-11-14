import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/cancel')({
  head: () => ({ meta: [{ title: 'Payment cancelled | Kiddoraa' }] }),
  component: CheckoutCancel,
})

function CheckoutCancel() {
  return (
    <div className="max-w-lg mx-auto px-6 py-28 text-center">
      <p className="text-6xl">🐣</p>
      <h1 className="font-display text-4xl font-extrabold mt-4">Payment cancelled</h1>
      <p className="mt-3 text-ink/70">
        No money was taken. Your cart is still saved — pick up right where you left off, or choose Cash on Delivery instead.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/checkout" className="btn-primary">Return to checkout</Link>
        <Link to="/" className="btn-secondary">Keep browsing</Link>
      </div>
    </div>
  )
}
