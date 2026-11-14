import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import {
  COD_FEE,
  findColor,
  findPack,
  product,
  shippingFor,
} from '@/data/products'

/**
 * Server functions for checkout. Server-only modules (database, Stripe,
 * request helpers) are imported dynamically inside handlers so they never
 * end up in the browser bundle.
 */

const cartLineSchema = z.object({
  packId: z.string().min(1).max(40),
  colorId: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(20),
})

const checkoutSchema = z.object({
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  fullName: z.string().trim().min(2).max(120),
  address1: z.string().trim().min(3).max(200),
  address2: z.string().trim().max(200).default(''),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  paymentMethod: z.enum(['card', 'cod']),
  items: z.array(cartLineSchema).min(1).max(10),
})

export type CheckoutInput = z.input<typeof checkoutSchema>

export type PublicOrder = {
  orderNumber: string
  status: string
  paymentMethod: string
  fullName: string
  email: string
  phone: string
  address: string
  items: Array<{ name: string; variant: string; unitPrice: number; quantity: number }>
  subtotal: number
  shipping: number
  codFee: number
  total: number
  createdAt: string
}

function newOrderNumber() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return 'KDR-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

function toPublic(order: import('../../db/schema.js').Order): PublicOrder {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentMethod: order.paymentMethod,
    fullName: order.fullName,
    email: order.email,
    phone: order.phone,
    address: [order.address1, order.address2, `${order.city}, ${order.state} ${order.pincode}`]
      .filter(Boolean)
      .join(', '),
    items: order.items.map(({ name, variant, unitPrice, quantity }) => ({
      name,
      variant,
      unitPrice,
      quantity,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    codFee: order.codFee,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
  }
}

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Card payments are not configured yet')
  const { default: Stripe } = await import('stripe')
  return new Stripe(key)
}

/**
 * `stripe` is false when STRIPE_SECRET_KEY is not set. Online payment then
 * runs in demo mode: a labelled mock payment page instead of Stripe Checkout.
 */
export const getPaymentOptions = createServerFn({ method: 'GET' }).handler(() => ({
  card: true,
  stripe: !!process.env.STRIPE_SECRET_KEY,
  cod: true,
}))

export const placeOrder = createServerFn({ method: 'POST' })
  .validator(checkoutSchema)
  .handler(async ({ data }) => {
    // Re-price every line from the server catalog.
    const items = data.items.map((line) => {
      const pack = findPack(line.packId)
      const color = findColor(line.colorId)
      if (!pack || !color) throw new Error('One of the items in your cart is no longer available')
      return {
        packId: pack.id,
        colorId: color.id,
        name: product.name,
        variant: `${pack.label} · ${color.label}`,
        unitPrice: pack.price,
        quantity: line.quantity,
      }
    })
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const shipping = shippingFor(subtotal)
    const codFee = data.paymentMethod === 'cod' ? COD_FEE : 0
    const total = subtotal + shipping + codFee

    const { db } = await import('../../db/index.js')
    const { orders } = await import('../../db/schema.js')
    const { eq } = await import('drizzle-orm')

    const inserted = await db
      .insert(orders)
      .values({
        orderNumber: newOrderNumber(),
        status: data.paymentMethod === 'cod' ? 'cod_confirmed' : 'pending_payment',
        paymentMethod: data.paymentMethod,
        email: data.email.toLowerCase(),
        phone: data.phone,
        fullName: data.fullName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        items,
        subtotal,
        shipping,
        codFee,
        total,
      })
      .returning()
      .catch((err) => {
        console.error('Failed to save order', err)
        throw new Error('We couldn’t place your order right now. Please try again in a minute.')
      })
    const order = inserted[0]

    if (data.paymentMethod === 'cod') {
      return { orderNumber: order.orderNumber, email: order.email, checkoutUrl: null }
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Demo mode: no Stripe key configured, use the mock payment page.
      const qs = new URLSearchParams({ order: order.orderNumber, email: order.email })
      return { orderNumber: order.orderNumber, email: order.email, checkoutUrl: `/checkout/demo-pay?${qs}` }
    }

    const stripe = await getStripe()
    const { getRequest } = await import('@tanstack/react-start/server')
    const origin = new URL(getRequest().url).origin

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: order.email,
      client_reference_id: order.orderNumber,
      metadata: { orderNumber: order.orderNumber },
      line_items: [
        ...items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: 'inr',
            unit_amount: i.unitPrice * 100,
            product_data: {
              name: i.name,
              description: i.variant,
              images: [`${origin}${product.images[0].src}`],
            },
          },
        })),
        ...(shipping > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'inr',
                  unit_amount: shipping * 100,
                  product_data: { name: 'Shipping' },
                },
              },
            ]
          : []),
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?order=${order.orderNumber}`,
    })

    await db
      .update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, order.id))

    return { orderNumber: order.orderNumber, email: order.email, checkoutUrl: session.url }
  })

/** Called from the Stripe success page: verifies payment with Stripe and marks the order paid. */
export const confirmCardPayment = createServerFn({ method: 'POST' })
  .validator(z.string().min(5).max(255))
  .handler(async ({ data: sessionId }): Promise<PublicOrder | null> => {
    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const { db } = await import('../../db/index.js')
    const { orders } = await import('../../db/schema.js')
    const { and, eq } = await import('drizzle-orm')

    if (session.payment_status === 'paid') {
      await db
        .update(orders)
        .set({ status: 'paid', paidAt: new Date() })
        .where(and(eq(orders.stripeSessionId, session.id), eq(orders.status, 'pending_payment')))
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, session.id))
      .limit(1)
    return order ? toPublic(order) : null
  })

/** Look up an order by its number plus the email used at checkout. */
export const lookupOrder = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      orderNumber: z.string().trim().toUpperCase().min(4).max(20),
      email: z.string().trim().toLowerCase().email().max(200),
    }),
  )
  .handler(async ({ data }): Promise<PublicOrder | null> => {
    const { db } = await import('../../db/index.js')
    const { orders } = await import('../../db/schema.js')
    const { and, eq } = await import('drizzle-orm')
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.orderNumber, data.orderNumber), eq(orders.email, data.email)))
      .limit(1)
    return order ? toPublic(order) : null
  })

/**
 * Demo-mode only: marks a pending card order as paid without charging anyone.
 * Disabled automatically once STRIPE_SECRET_KEY is configured.
 */
export const completeDemoPayment = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      orderNumber: z.string().trim().toUpperCase().min(4).max(20),
      email: z.string().trim().toLowerCase().email().max(200),
    }),
  )
  .handler(async ({ data }): Promise<PublicOrder | null> => {
    if (process.env.STRIPE_SECRET_KEY) throw new Error('Demo payments are disabled')
    const { db } = await import('../../db/index.js')
    const { orders } = await import('../../db/schema.js')
    const { and, eq } = await import('drizzle-orm')
    const where = and(eq(orders.orderNumber, data.orderNumber), eq(orders.email, data.email))
    await db
      .update(orders)
      .set({ status: 'paid', paidAt: new Date() })
      .where(and(where, eq(orders.status, 'pending_payment'), eq(orders.paymentMethod, 'card')))
    const [order] = await db.select().from(orders).where(where).limit(1)
    return order ? toPublic(order) : null
  })
