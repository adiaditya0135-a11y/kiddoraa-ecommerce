import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export type OrderItem = {
  packId: string
  colorId: string
  name: string
  variant: string
  unitPrice: number
  quantity: number
}

/** Customer orders. Money columns are whole INR. */
export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  // pending_payment | paid | cod_confirmed | cancelled
  status: text().notNull(),
  // card | cod
  paymentMethod: text('payment_method').notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  fullName: text('full_name').notNull(),
  address1: text().notNull(),
  address2: text().notNull().default(''),
  city: text().notNull(),
  state: text().notNull(),
  pincode: text().notNull(),
  items: jsonb().$type<Array<OrderItem>>().notNull(),
  subtotal: integer().notNull(),
  shipping: integer().notNull(),
  codFee: integer('cod_fee').notNull().default(0),
  total: integer().notNull(),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  paidAt: timestamp('paid_at'),
})

export type Order = typeof orders.$inferSelect
