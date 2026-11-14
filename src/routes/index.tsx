import { Link, createFileRoute } from '@tanstack/react-router'
import { BatteryCharging, Gift, HeartHandshake, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { product, formatINR } from '@/data/products'
import { faqs, reviews } from '@/data/content'
import { Stars } from '@/components/Layout'
import { useCart } from '@/lib/cart'
import { img } from '@/lib/img'

export const Route = createFileRoute('/')({
  component: Home,
})

const perks = [
  'No batteries needed',
  'Non-toxic soft rubber',
  'Cash on Delivery',
  'Ships in 24–48 hrs',
  'Perfect return gift',
  'Loved by 10,000+ kids',
]

function Home() {
  const cart = useCart()
  const from = product.packs[0]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 md:pt-16 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-ink/10 px-3 py-1 text-xs font-semibold">
              <Sparkles size={14} className="text-coral" /> India’s funniest bag charm
            </span>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mt-5">
              The keychain that <span className="text-coral">screams</span> back.
            </h1>
            <p className="mt-6 text-lg text-ink/75 max-w-md leading-relaxed">
              One squeeze and our chubby chicken lets out a hilarious <i>“chu-chu!”</i> Stress buster for grown-ups, giggle machine for kids.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <Stars rating={product.rating} />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-ink/60">· {product.reviewCount.toLocaleString('en-IN')} happy reviews</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/products/$slug" params={{ slug: product.slug }} className="btn-primary text-lg">
                Shop now · {formatINR(from.price)}
              </Link>
              <span className="text-sm">
                <s className="text-ink/50">{formatINR(from.compareAt)}</s>{' '}
                <b className="text-coral">50% OFF today</b>
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-[3rem] bg-sun rotate-3" />
            <img
              src={img('/img/product-main.png', 900)}
              alt={product.images[0].alt}
              width={900}
              height={900}
              className="relative rounded-[3rem] w-full aspect-square object-cover -rotate-2 shadow-xl"
            />
            <div className="absolute -left-3 top-10 animate-wobble rounded-2xl bg-white px-4 py-3 shadow-lg font-display font-bold text-lg rotate-[-6deg]">
              CHU-CHU! 🐔
            </div>
            <div className="absolute -right-2 bottom-10 rounded-full bg-ink text-cream w-28 h-28 grid place-items-center text-center font-display font-bold leading-tight shadow-lg rotate-12">
              No<br />batteries!
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-coral text-white py-3 overflow-hidden border-y-2 border-ink">
        <div className="flex w-max animate-marquee gap-10 font-display font-bold text-lg whitespace-nowrap">
          {[...perks, ...perks].map((p, i) => (
            <span key={i} className="flex items-center gap-10">
              {p} <span className="text-sun">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center">Squeeze. Scream. Smile.</h2>
        <p className="text-center text-ink/70 mt-3 max-w-xl mx-auto">Three seconds to the best laugh of your day.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { src: '/img/product-squeeze.png', title: 'Give it a squeeze', body: 'Its beak pops open and the eyes bulge — pure comedy.', bg: 'bg-mint' },
            { src: '/img/product-bag.png', title: 'Clip it anywhere', body: 'School bags, keys, bottles, pencil pouches. Sturdy metal ring.', bg: 'bg-sky' },
            { src: '/img/product-pack.png', title: 'Share the giggles', body: 'Grab a party pack — the perfect return gift for birthdays.', bg: 'bg-lilac' },
          ].map((s, i) => (
            <div key={s.title} className={`rounded-3xl ${s.bg} p-4 pb-6`}>
              <img src={img(s.src, 600)} alt="" loading="lazy" className="rounded-2xl w-full aspect-square object-cover" />
              <div className="px-2 mt-5">
                <span className="font-display text-sm font-bold text-ink/50">STEP {i + 1}</span>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="text-ink/70 mt-1 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden">
          <img src={img('/img/hero-kids.png', 1400)} alt="Two kids laughing with the chicken keychain" loading="lazy" className="w-full h-[420px] md:h-[480px] object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 md:p-14 max-w-lg text-cream">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">Screen-free fun that actually gets them laughing.</h2>
              <p className="mt-4 text-cream/80">No apps, no charging, no fuss. Just a squishy little friend that makes the whole family crack up.</p>
              <Link to="/products/$slug" params={{ slug: product.slug }} className="btn-primary mt-7">Get yours</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-center">Pick your pack</h2>
        <p className="text-center text-ink/70 mt-3">More chickens, more savings. Free shipping above ₹399.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {product.packs.map((pack) => {
            const featured = pack.id === 'duo'
            const colorId = pack.quantity >= 4 ? 'mixed' : 'yellow'
            return (
              <div key={pack.id} className={`relative card p-7 flex flex-col ${featured ? 'border-2 border-ink shadow-[6px_6px_0_0_#2A1A3B]' : ''}`}>
                {pack.badge && (
                  <span className="absolute -top-3 left-7 rounded-full bg-sun px-3 py-1 text-xs font-bold border border-ink">{pack.badge}</span>
                )}
                <h3 className="font-display text-2xl font-bold">{pack.label}</h3>
                <p className="text-sm text-ink/60">{formatINR(Math.round(pack.price / pack.quantity))} per keychain</p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold">{formatINR(pack.price)}</span>
                  <s className="text-ink/40">{formatINR(pack.compareAt)}</s>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-ink/75 flex-1">
                  <li>✓ {pack.quantity} screaming chicken{pack.quantity > 1 ? 's' : ''}</li>
                  <li>✓ {pack.quantity >= 4 ? 'Assorted colours' : 'Choose your colour'}</li>
                  <li>✓ {pack.price >= 399 ? 'FREE shipping' : 'Ships in 24–48 hrs'}</li>
                </ul>
                <button
                  onClick={() => {
                    cart.add({ packId: pack.id, colorId, quantity: 1 })
                    cart.open()
                  }}
                  className={`${featured ? 'btn-primary' : 'btn-secondary'} mt-7 w-full`}
                >
                  Add to cart
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-sm font-semibold">
          {[
            [ShieldCheck, 'Non-toxic & BPA-free'],
            [BatteryCharging, 'No batteries ever'],
            [Truck, 'Pan-India delivery'],
            [HeartHandshake, '7-day replacement'],
            [Gift, 'Gift-ready packaging'],
          ].map(([Icon, label]) => {
            const I = Icon as typeof ShieldCheck
            return (
              <div key={label as string} className="flex flex-col items-center gap-2">
                <span className="w-12 h-12 rounded-2xl bg-peach grid place-items-center"><I size={22} /></span>
                {label as string}
              </div>
            )
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 scroll-mt-24">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold">Parents can’t stop laughing</h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Stars rating={product.rating} size={20} />
            <span className="font-semibold">{product.rating} / 5 from {product.reviewCount.toLocaleString('en-IN')} reviews</span>
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <figure key={r.name} className="card p-6">
              <Stars rating={r.rating} />
              <h3 className="font-display text-xl font-bold mt-3">{r.title}</h3>
              <blockquote className="text-sm text-ink/75 mt-2 leading-relaxed">“{r.body}”</blockquote>
              <figcaption className="mt-4 text-xs font-semibold text-ink/60">
                {r.name} · {r.city} · <span className="text-emerald-700">Verified buyer</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-4xl font-extrabold text-center mb-8">Questions? We’ve got answers.</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group px-6 py-4 open:shadow-sm">
              <summary className="cursor-pointer list-none flex justify-between items-center font-semibold">
                {f.q}
                <span className="text-2xl leading-none transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <div className="rounded-[2.5rem] bg-sun border-2 border-ink p-10 md:p-14 text-center shadow-[8px_8px_0_0_#2A1A3B]">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold">Ready for the loudest laugh in the house?</h2>
          <p className="mt-3 text-ink/75">Starting at just {formatINR(from.price)} · Cash on Delivery available</p>
          <Link to="/products/$slug" params={{ slug: product.slug }} className="btn-primary mt-8 text-lg">
            Shop the Screaming Chicken
          </Link>
        </div>
      </section>
    </>
  )
}
