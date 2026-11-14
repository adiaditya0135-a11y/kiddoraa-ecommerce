import { CheckCircle2, Clock, Package } from 'lucide-react'
import { formatINR } from '@/data/products'
import type { PublicOrder } from '@/lib/orders'

const STATUS: Record<string, { label: string; tone: string }> = {
  paid: { label: 'Paid · Preparing to ship', tone: 'bg-mint' },
  cod_confirmed: { label: 'Confirmed · Pay on delivery', tone: 'bg-sky' },
  pending_payment: { label: 'Awaiting payment', tone: 'bg-sun/60' },
  cancelled: { label: 'Cancelled', tone: 'bg-coral/20' },
}

export function OrderReceipt({ order, heading }: { order: PublicOrder; heading?: string }) {
  const status = STATUS[order.status] ?? { label: order.status, tone: 'bg-white' }
  const confirmed = order.status === 'paid' || order.status === 'cod_confirmed'
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        {confirmed ? (
          <CheckCircle2 size={64} className="mx-auto text-emerald-600" />
        ) : (
          <Clock size={64} className="mx-auto text-ink/50" />
        )}
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-4">
          {heading ?? (confirmed ? 'Woohoo! Order confirmed 🐔' : 'Order details')}
        </h1>
        {confirmed && (
          <p className="mt-3 text-ink/70">
            Thanks, {order.fullName.split(' ')[0]}! We’ll email {order.email} when your chickens are on their way.
          </p>
        )}
      </div>

      <div className="card mt-10 p-6 sm:p-8">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div>
            <p className="text-xs text-ink/60">Order number</p>
            <p className="font-display text-2xl font-bold tracking-wide">{order.orderNumber}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.tone}`}>{status.label}</span>
        </div>

        <ul className="mt-6 divide-y divide-ink/10">
          {order.items.map((i, idx) => (
            <li key={idx} className="py-3 flex justify-between gap-4 text-sm">
              <span>
                <span className="font-semibold">{i.name}</span>
                <span className="block text-ink/60 text-xs">{i.variant} × {i.quantity}</span>
              </span>
              <span className="font-semibold">{formatINR(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 pt-4 border-t border-ink/10 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd>{order.shipping ? formatINR(order.shipping) : 'FREE'}</dd></div>
          {order.codFee > 0 && <div className="flex justify-between"><dt className="text-ink/60">COD handling</dt><dd>{formatINR(order.codFee)}</dd></div>}
          <div className="flex justify-between font-display text-xl font-bold pt-2"><dt>Total</dt><dd>{formatINR(order.total)}</dd></div>
        </dl>

        <div className="mt-6 rounded-2xl bg-cream p-4 text-sm flex gap-3">
          <Package size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Shipping to {order.fullName}</p>
            <p className="text-ink/70">{order.address}</p>
            <p className="text-ink/70">{order.phone}</p>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-ink/50 mt-6">Save your order number to track your order anytime.</p>
    </div>
  )
}
