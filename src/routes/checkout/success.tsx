import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'
import { confirmCardPayment } from '@/lib/orders'
import { OrderReceipt } from '@/components/OrderReceipt'
import { useCart } from '@/lib/cart'

export const Route = createFileRoute('/checkout/success')({
  validateSearch: z.object({ session_id: z.string().optional() }),
  loaderDeps: ({ search }) => ({ sessionId: search.session_id }),
  loader: async ({ deps }) => {
    if (!deps.sessionId) return null
    try {
      return await confirmCardPayment({ data: deps.sessionId })
    } catch {
      return null
    }
  },
  head: () => ({ meta: [{ title: 'Order confirmed | Kiddoraa' }] }),
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const order = Route.useLoaderData()
  const { clear } = useCart()
  const paid = order?.status === 'paid'

  useEffect(() => {
    if (paid) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid])

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-4xl font-extrabold">We couldn’t find that payment</h1>
        <p className="mt-3 text-ink/70">If you were charged, don’t worry — contact us with your email and we’ll sort it out right away.</p>
        <Link to="/policies/$page" params={{ page: 'contact' }} className="btn-primary mt-8">Contact support</Link>
      </div>
    )
  }

  return (
    <OrderReceipt
      order={order}
      heading={paid ? undefined : 'Payment is still processing'}
    />
  )
}
