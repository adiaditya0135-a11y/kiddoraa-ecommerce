/**
 * Kiddoraa catalog. This file is the single source of truth for prices —
 * the server recomputes every order total from here, never from the browser.
 * All money values are in whole Indian Rupees.
 */
export interface PackOption {
  id: string
  label: string
  quantity: number
  price: number
  compareAt: number
  badge?: string
}

export interface ColorOption {
  id: string
  label: string
  swatch: string
}

export interface Product {
  slug: string
  name: string
  tagline: string
  shortDescription: string
  description: Array<string>
  highlights: Array<string>
  specs: Array<{ label: string; value: string }>
  images: Array<{ src: string; alt: string }>
  packs: Array<PackOption>
  colors: Array<ColorOption>
  rating: number
  reviewCount: number
}

export const product: Product = {
  slug: 'screaming-chicken-squeeze-keychain',
  name: 'Chu-Chu Screaming Chicken Squeeze Keychain',
  tagline: 'Squeeze it. Hear it scream. Laugh till your tummy hurts.',
  shortDescription:
    'A squishy cartoon chicken keychain that lets out a hilarious "chu-chu" scream every time you squeeze it. Stress buster, bag charm and instant giggle machine.',
  description: [
    'Meet the chubbiest, loudest little friend in your bag. Give our cartoon chicken a squeeze and its beak pops open with a funny "chu-chu" scream — guaranteed to crack up kids, friends and even the grumpiest uncle.',
    'Made from soft, non-toxic, BPA-free rubber that springs back to shape every single time. No batteries, no charging — the sound comes from a built-in squeaker, so it works forever.',
    'Clip it to a school bag, pencil pouch, water bottle or car keys. It makes a perfect return gift, birthday party favour or desk stress-reliever for grown-ups.',
  ],
  highlights: [
    'Funny squeeze-to-scream sound — no batteries needed',
    'Soft, non-toxic, BPA-free rubber',
    'Sturdy metal keyring + lobster clasp',
    'Stress relief for kids and adults',
    'Ideal return gift and party favour',
  ],
  specs: [
    { label: 'Material', value: 'Soft PVC rubber, metal keyring' },
    { label: 'Size', value: 'Approx. 7 cm × 5 cm' },
    { label: 'Weight', value: 'Approx. 35 g' },
    { label: 'Age', value: '3 years and up' },
    { label: 'Power', value: 'None — mechanical squeaker' },
    { label: 'In the box', value: 'Keychain(s) as per pack selected' },
  ],
  images: [
    { src: '/img/product-main.png', alt: 'Yellow screaming chicken squeeze keychain' },
    { src: '/img/product-squeeze.png', alt: 'Hand squeezing the chicken keychain so it screams' },
    { src: '/img/product-bag.png', alt: 'Chicken keychain clipped to a kids school bag' },
    { src: '/img/product-pack.png', alt: 'Four colourful chicken keychains in a row' },
  ],
  packs: [
    { id: 'single', label: 'Pack of 1', quantity: 1, price: 249, compareAt: 499 },
    { id: 'duo', label: 'Pack of 2', quantity: 2, price: 449, compareAt: 998, badge: 'Save 55%' },
    { id: 'party', label: 'Pack of 4', quantity: 4, price: 799, compareAt: 1996, badge: 'Best value' },
  ],
  colors: [
    { id: 'yellow', label: 'Sunny Yellow', swatch: '#FFD23F' },
    { id: 'pink', label: 'Bubble Pink', swatch: '#FF8FB1' },
    { id: 'blue', label: 'Sky Blue', swatch: '#7CC6FE' },
    { id: 'mixed', label: 'Assorted Mix', swatch: 'conic-gradient(#FFD23F 0 25%, #FF8FB1 0 50%, #7CC6FE 0 75%, #8EE3C8 0)' },
  ],
  rating: 4.6,
  reviewCount: 1284,
}

/** Store-wide pricing rules (INR). */
export const FREE_SHIPPING_THRESHOLD = 399
export const SHIPPING_FEE = 49
export const COD_FEE = 29

export function findPack(packId: string) {
  return product.packs.find((p) => p.id === packId)
}

export function findColor(colorId: string) {
  return product.colors.find((c) => c.id === colorId)
}

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default product
