import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { lookupOrder } from '@/lib/orders'
import { OrderReceipt } from '@/components/OrderReceipt'

export const Route = createFileRoute('/order/$orderNumber')({
  validateSearch: z.object({ email: z.string().default(''), new: z.boolean().optional() }),
  loaderDeps: ({ search }) => ({ email: search.email }),
  loader: async ({ params, deps }) => {
    if (!deps.email) return null
    try {
      return await lookupOrder({ data: { orderNumber: params.orderNumber, email: deps.email } })
    } catch {
      return null
    }
  },
  head: () => ({ meta: [{ title: 'Your order | Kiddoraa' }] }),
  component: OrderPage,
})

function OrderPage() {
  const order = Route.useLoaderData()
  const { new: isNew } = Route.useSearch()

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <h1 className="font-display text-4xl font-extrabold">Order not found</h1>
        <p className="mt-3 text-ink/70">Check the order number and the email you used at checkout.</p>
        <Link to="/track" className="btn-primary mt-8">Try again</Link>
      </div>
    )
  }
  return <OrderReceipt order={order} heading={isNew ? undefined : 'Your order'} />
}
