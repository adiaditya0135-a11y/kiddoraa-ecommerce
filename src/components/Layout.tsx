import { Link } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, Star, Trash2, Truck, X } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart'
import { FREE_SHIPPING_THRESHOLD, findColor, findPack, formatINR, product } from '@/data/products'
import { img } from '@/lib/img'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight leading-none ${className}`}>
      kiddor<span className="text-coral">aa</span>
      <span className="inline-block w-2 h-2 rounded-full bg-sun ml-0.5 align-top mt-1" />
    </span>
  )
}

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-sun text-sun' : 'fill-ink/10 text-ink/10'}
        />
      ))}
    </span>
  )
}

export function Header() {
  const cart = useCart()
  return (
    <>
      <div className="bg-ink text-cream text-center text-xs sm:text-sm py-2 px-4 font-medium">
        <Truck size={14} className="inline -mt-0.5 mr-1.5" />
        Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)} · Cash on Delivery available
      </div>
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Kiddoraa home">
            <Logo className="text-3xl text-ink" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink/80">
            <Link to="/" className="hover:text-coral">Home</Link>
            <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-coral">
              Shop
            </Link>
            <Link to="/" hash="reviews" className="hover:text-coral">Reviews</Link>
            <Link to="/track" className="hover:text-coral">Track order</Link>
          </nav>
          <button
            onClick={cart.open}
            className="relative flex items-center gap-2 rounded-full bg-white border border-ink/10 pl-3 pr-4 py-2 font-semibold text-sm text-ink shadow-sm hover:shadow transition"
          >
            <ShoppingBag size={18} />
            Cart
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-coral text-white text-xs grid place-items-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}

function CartDrawer() {
  const cart = useCart()
  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal

  useEffect(() => {
    if (!cart.isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cart.isOpen, cart.close])

  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cart.isOpen}>
      <div
        onClick={cart.close}
        className={`absolute inset-0 bg-ink/40 transition-opacity ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${
          cart.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h2 className="font-display text-2xl font-bold">Your cart ({cart.count})</h2>
          <button onClick={cart.close} aria-label="Close cart" className="p-2 rounded-full hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>

        {cart.lines.length > 0 && (
          <div className="px-6 py-3 bg-mint/50 text-sm">
            {remaining > 0 ? (
              <>Add <b>{formatINR(remaining)}</b> more for <b>FREE shipping</b> 🚚</>
            ) : (
              <>🎉 You’ve unlocked <b>FREE shipping</b>!</>
            )}
            <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
              <div
                className="h-full bg-ink rounded-full transition-all"
                style={{ width: `${Math.min(100, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <img src={img('/img/product-main.png', 240)} alt="" className="w-32 h-32 rounded-3xl object-cover opacity-90" />
              <p className="font-display text-xl font-bold">Your cart is feeling lonely</p>
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                onClick={cart.close}
                className="btn-primary"
              >
                Shop the chicken
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {cart.lines.map((line) => {
                const pack = findPack(line.packId)!
                const color = findColor(line.colorId)!
                return (
                  <li key={`${line.packId}-${line.colorId}`} className="py-4 flex gap-4">
                    <img src={img(product.images[0].src, 160)} alt="" className="w-20 h-20 rounded-2xl object-cover bg-peach" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-snug text-sm">{product.name}</p>
                      <p className="text-xs text-ink/60 mt-0.5">{pack.label} · {color.label}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <QtyStepper
                          value={line.quantity}
                          onChange={(q) => cart.setQuantity(line.packId, line.colorId, q)}
                        />
                        <span className="font-bold">{formatINR(pack.price * line.quantity)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => cart.remove(line.packId, line.colorId)}
                      aria-label="Remove item"
                      className="self-start p-1 text-ink/40 hover:text-coral"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {cart.lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5 space-y-3 bg-white">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatINR(cart.subtotal)}</span>
            </div>
            <p className="text-xs text-ink/60">Shipping and COD fee (if any) calculated at checkout.</p>
            <Link to="/checkout" onClick={cart.close} className="btn-primary w-full">
              Checkout · {formatINR(cart.subtotal)}
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

export function QtyStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
      <button type="button" onClick={() => onChange(value - 1)} className="p-2 hover:text-coral" aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className="p-2 hover:text-coral" aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  )
}

export function Footer() {
  const policyLinks: Array<[string, string]> = [
    ['shipping', 'Shipping Policy'],
    ['returns', 'Refunds & Returns'],
    ['privacy', 'Privacy Policy'],
    ['terms', 'Terms of Service'],
    ['contact', 'Contact Us'],
  ]
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo className="text-4xl" />
          <p className="mt-4 text-cream/70 max-w-sm text-sm leading-relaxed">
            Silly, squishy, screamingly fun toys that turn every day into a giggle. Shipped with love across India.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-sun">Screaming Chicken Keychain</Link></li>
            <li><Link to="/track" className="hover:text-sun">Track your order</Link></li>
            <li><Link to="/checkout" className="hover:text-sun">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold mb-3">Help</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            {policyLinks.map(([page, label]) => (
              <li key={page}>
                <Link to="/policies/$page" params={{ page }} className="hover:text-sun">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Kiddoraa. All rights reserved. · Secure payments by Stripe
      </div>
    </footer>
  )
}
