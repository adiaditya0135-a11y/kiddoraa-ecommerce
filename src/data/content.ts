/** Static marketing content: reviews, FAQs and store policies. */
export const reviews = [
  { name: 'Priya S.', city: 'Pune', rating: 5, title: 'My son hasn’t stopped laughing', body: 'Bought the pack of 2 for my kids. The scream sound is SO funny. Good quality rubber, keyring is strong too.' },
  { name: 'Rahul M.', city: 'Bengaluru', rating: 5, title: 'Best desk stress buster', body: 'Keep one at my work desk. Every meeting gets better after a squeeze. Colleagues keep stealing it.' },
  { name: 'Ananya K.', city: 'Delhi', rating: 4, title: 'Perfect return gift', body: 'Ordered the pack of 4 for a birthday party. Kids loved it. Delivery took 5 days, packaging was neat.' },
  { name: 'Faizan A.', city: 'Hyderabad', rating: 5, title: 'Cute and loud!', body: 'Looks exactly like the photos. Bright colour, super squishy and it bounces back every time.' },
  { name: 'Meera J.', city: 'Jaipur', rating: 5, title: 'Daughter’s favourite bag charm', body: 'She clipped it on her school bag on day one. All her friends want one now. Ordering more!' },
  { name: 'Vikram R.', city: 'Chennai', rating: 4, title: 'Value for money', body: 'COD was smooth. The pack of 2 is great value. Would love more colours.' },
]

export const faqs = [
  { q: 'Does it need batteries?', a: 'No. The scream comes from a built-in mechanical squeaker, so it works every time you squeeze — no batteries or charging, ever.' },
  { q: 'Is it safe for kids?', a: 'Yes. It is made of soft, non-toxic, BPA-free rubber. We recommend it for ages 3 and up because of the small metal keyring.' },
  { q: 'How long does delivery take?', a: 'Orders are dispatched within 24–48 hours and usually arrive in 5–8 business days anywhere in India. You get tracking details once shipped.' },
  { q: 'Is Cash on Delivery available?', a: 'Yes! Choose Cash on Delivery at checkout. A small ₹29 COD handling fee applies. Prepaid orders skip the fee.' },
  { q: 'Can I return it?', a: 'If your keychain arrives damaged or not working, contact us within 7 days of delivery with a photo and we will send a free replacement or refund.' },
]

export const policies: Record<string, { title: string; body: Array<string> }> = {
  shipping: {
    title: 'Shipping Policy',
    body: [
      'We ship across India. Orders are processed and dispatched within 24–48 business hours of being placed.',
      'Standard delivery takes 5–8 business days depending on your pincode. Remote areas may take a little longer.',
      'Shipping is free on orders of ₹399 and above. A flat ₹49 shipping fee applies to smaller orders.',
      'Once your order is shipped you will receive tracking details on your email and phone.',
    ],
  },
  returns: {
    title: 'Refund & Return Policy',
    body: [
      'Your happiness matters to us. If your product arrives damaged, defective or incorrect, contact us within 7 days of delivery.',
      'Please share your order number and a clear photo or video of the issue. Once verified, we will send a free replacement or issue a full refund.',
      'Refunds for prepaid orders are made to the original payment method within 5–7 business days. COD refunds are made via UPI or bank transfer.',
      'For hygiene reasons, used products without a defect are not eligible for return.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only the information needed to process and deliver your order: name, email, phone number and shipping address.',
      'Card payments are processed securely by Stripe. Kiddoraa never sees or stores your card details.',
      'We never sell your personal information. We share it only with our delivery partners to fulfil your order.',
      'To request deletion of your data, email us at hello@kiddoraa.com.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'By placing an order on Kiddoraa you agree to provide accurate contact and shipping information.',
      'Prices are listed in Indian Rupees (INR) and include all applicable taxes. We reserve the right to change prices at any time.',
      'Product colours may vary slightly from images due to screen settings. Products are intended for ages 3 and up.',
      'Kiddoraa reserves the right to cancel any order suspected of fraud or abuse.',
    ],
  },
  contact: {
    title: 'Contact Us',
    body: [
      'We are a small team that loves making kids laugh. Reach out any time!',
      'Email: hello@kiddoraa.com',
      'Support hours: Monday to Saturday, 10 AM – 7 PM IST.',
      'For order questions, please include your order number (it starts with KDR-).',
    ],
  },
}
