import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { BadgeCheck, BatteryCharging, Clock, RotateCcw, ShieldCheck, Truck, Zap } from 'lucide-react'
import { formatINR, product } from '@/data/products'
import { reviews } from '@/data/content'
import { QtyStepper, Stars } from '@/components/Layout'
import { useCart } from '@/lib/cart'
import { img } from '@/lib/img'

export const Route = createFileRoute('/products/$slug')({
  loader: ({ params }) => {
    if (params.slug !== product.slug) throw notFound()
    return product
  },
  head: () => ({
    meta: [
      { title: `${product.name} | Kiddoraa` },
      { name: 'description', content: product.shortDescription },
    ],
  }),
  component: ProductPage,
})

function ProductPage() {
  const p = Route.useLoaderData()
  const cart = useCart()
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)
  const [packId, setPackId] = useState(p.packs[1].id)
  const [colorId, setColorId] = useState(p.colors[0].id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const pack = p.packs.find((x) => x.id === packId)!
  const color = p.colors.find((c) => c.id === colorId)!
  const discount = Math.round((1 - pack.price / pack.compareAt) * 100)

  const addToCart = () => {
    cart.add({ packId, colorId, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
    cart.open()
  }

  const buyNow = () => {
    cart.add({ packId, colorId, quantity: qty })
    navigate({ to: '/checkout' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="md:sticky md:top-24 self-start">
          <div className="rounded-[2rem] overflow-hidden bg-peach aspect-square">
            <img
              src={img(p.images[imageIndex].src, 1000)}
              alt={p.images[imageIndex].alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {p.images.map((im, i) => (
              <button
                key={im.src}
                onClick={() => setImageIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`rounded-2xl overflow-hidden aspect-square border-2 transition ${
                  i === imageIndex ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img(im.src, 240)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <div className="flex items-center gap-2 text-sm">
            <Stars rating={p.rating} />
            <a href="#product-reviews" className="underline underline-offset-2 text-ink/70">
              {p.rating} · {p.reviewCount.toLocaleString('en-IN')} reviews
            </a>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold leading-[1.05] mt-3">{p.name}</h1>
          <p className="mt-3 text-ink/70">{p.tagline}</p>

          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="font-display text-4xl font-extrabold">{formatINR(pack.price)}</span>
            <s className="text-lg text-ink/40">{formatINR(pack.compareAt)}</s>
            <span className="rounded-full bg-coral text-white text-xs font-bold px-2.5 py-1">{discount}% OFF</span>
          </div>
          <p className="text-xs text-ink/60 mt-1">Inclusive of all taxes · {formatINR(Math.round(pack.price / pack.quantity))} per keychain</p>

          {/* Pack */}
          <fieldset className="mt-8">
            <legend className="font-semibold text-sm mb-3">Choose your pack</legend>
            <div className="grid grid-cols-3 gap-3">
              {p.packs.map((opt) => (
                <label
                  key={opt.id}
                  className={`relative cursor-pointer rounded-2xl border-2 p-3 text-center transition ${
                    opt.id === packId ? 'border-ink bg-sun/30' : 'border-ink/10 bg-white hover:border-ink/40'
                  }`}
                >
                  <input type="radio" name="pack" value={opt.id} checked={opt.id === packId} onChange={() => setPackId(opt.id)} className="sr-only" />
                  {opt.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink text-cream text-[10px] font-bold px-2 py-0.5">
                      {opt.badge}
                    </span>
                  )}
                  <span className="block font-display font-bold text-lg">{opt.label}</span>
                  <span className="block text-sm font-semibold">{formatINR(opt.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Colour */}
          <fieldset className="mt-6">
            <legend className="font-semibold text-sm mb-3">
              Colour: <span className="font-normal text-ink/70">{color.label}</span>
            </legend>
            <div className="flex gap-3">
              {p.colors.map((c) => (
                <label key={c.id} title={c.label} className="cursor-pointer">
                  <input type="radio" name="color" value={c.id} checked={c.id === colorId} onChange={() => setColorId(c.id)} className="sr-only" />
                  <span
                    className={`block w-11 h-11 rounded-full border-4 transition ${c.id === colorId ? 'border-ink scale-110' : 'border-white shadow'}`}
                    style={{ background: c.swatch }}
                  />
                  <span className="sr-only">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Actions */}
          <div className="mt-8 flex items-center gap-3">
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(20, v)))} />
            <button onClick={addToCart} className="btn-secondary flex-1">
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
          <button onClick={buyNow} className="btn-primary w-full mt-3 text-lg">
            <Zap size={18} /> Buy it now · {formatINR(pack.price * qty)}
          </button>

          <div className="mt-5 rounded-2xl bg-mint/60 px-4 py-3 text-sm flex items-center gap-2">
            <Clock size={16} /> Order in the next few hours for <b>dispatch within 24–48 hrs</b>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold">
            {[
              [Truck, 'Free shipping above ₹399'],
              [BadgeCheck, 'Cash on Delivery'],
              [RotateCcw, '7-day replacement'],
              [ShieldCheck, 'Secure checkout'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Truck
              return (
                <div key={label as string} className="flex items-center gap-2 rounded-xl bg-white border border-ink/10 px-3 py-2.5">
                  <I size={16} className="text-coral shrink-0" /> {label as string}
                </div>
              )
            })}
          </div>

          {/* Details */}
          <div className="mt-10 space-y-3">
            <details open className="card px-6 py-4 group">
              <summary className="cursor-pointer list-none flex justify-between font-display text-xl font-bold">
                Description <span className="transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-3 space-y-3 text-sm text-ink/75 leading-relaxed">
                {p.description.map((d) => <p key={d}>{d}</p>)}
                <ul className="space-y-1.5 pt-1">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2"><BatteryCharging size={16} className="text-coral shrink-0 mt-0.5" /> {h}</li>
                  ))}
                </ul>
              </div>
            </details>
            <details className="card px-6 py-4 group">
              <summary className="cursor-pointer list-none flex justify-between font-display text-xl font-bold">
                Specifications <span className="transition group-open:rotate-45">+</span>
              </summary>
              <dl className="mt-3 divide-y divide-ink/10 text-sm">
                {p.specs.map((s) => (
                  <div key={s.label} className="flex justify-between py-2">
                    <dt className="text-ink/60">{s.label}</dt>
                    <dd className="font-semibold text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <details className="card px-6 py-4 group">
              <summary className="cursor-pointer list-none flex justify-between font-display text-xl font-bold">
                Shipping & Returns <span className="transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink/75 leading-relaxed">
                Dispatched within 24–48 hours, delivered in 5–8 business days across India. Free shipping above ₹399, otherwise ₹49. Damaged or faulty? Message us within 7 days of delivery for a free replacement.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="product-reviews" className="mt-20 scroll-mt-24">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Customer reviews</h2>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars rating={p.rating} size={18} /> <b>{p.rating} out of 5</b> · {p.reviewCount.toLocaleString('en-IN')} ratings
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <figure key={r.name} className="card p-6">
              <Stars rating={r.rating} />
              <h3 className="font-semibold mt-2">{r.title}</h3>
              <blockquote className="text-sm text-ink/75 mt-1.5 leading-relaxed">{r.body}</blockquote>
              <figcaption className="mt-3 text-xs text-ink/50">{r.name}, {r.city}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
