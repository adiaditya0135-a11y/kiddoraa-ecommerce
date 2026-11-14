import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PackageSearch } from 'lucide-react'

export const Route = createFileRoute('/track')({
  head: () => ({ meta: [{ title: 'Track your order | Kiddoraa' }] }),
  component: Track,
})

function Track() {
  const navigate = useNavigate()
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center">
        <PackageSearch size={52} className="mx-auto text-coral" />
        <h1 className="font-display text-4xl font-extrabold mt-4">Track your order</h1>
        <p className="mt-2 text-ink/70">Enter the order number from your confirmation and the email you used at checkout.</p>
      </div>
      <form
        className="card p-6 mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const f = new FormData(e.currentTarget)
          navigate({
            to: '/order/$orderNumber',
            params: { orderNumber: String(f.get('orderNumber')).trim().toUpperCase() },
            search: { email: String(f.get('email')).trim().toLowerCase() },
          })
        }}
      >
        <label className="block">
          <span className="block text-xs font-semibold mb-1.5 text-ink/70">Order number</span>
          <input name="orderNumber" required placeholder="KDR-XXXXXXXX" className="field uppercase" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold mb-1.5 text-ink/70">Email</span>
          <input name="email" type="email" required placeholder="you@example.com" className="field" />
        </label>
        <button className="btn-primary w-full">Find my order</button>
      </form>
    </div>
  )
}
