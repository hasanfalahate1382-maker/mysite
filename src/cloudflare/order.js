import { Hono } from 'hono'

const order = new Hono()

const PRODUCTS = ['تخم نطفه‌دار بوقلمون', 'جوجه یک‌روزه بوقلمون', 'تخم نطفه‌دار مرغ', 'جوجه یک‌روزه مرغ']
const BREEDS = ['', 'لاری', 'برهما', 'کوشین']

const clean = (v, max = 60) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

order.post('/order', async c => {
  const d = await c.req.json().catch(() => null)
  if (!d) return c.json({ ok: false, error: 'داده نامعتبر' }, 400)
  if (d.website) return c.json({ ok: true }) // honeypot

  const first = clean(d.first_name, 40)
  const last = clean(d.last_name, 40)
  const phone = String(d.phone ?? '').replace(/[^0-9+]/g, '')
  const prod = clean(d.product)
  const breed = clean(d.breed, 20)
  const qty = parseInt(d.quantity, 10)
  const city = clean(d.city, 40)
  const note = clean(d.note, 400)

  if (!first || !last || !(qty >= 1 && qty <= 100000)) return c.json({ ok: false, error: 'اطلاعات ناقص است.' }, 400)
  if (!/^(\+98|0098|0)?9\d{9}$/.test(phone)) return c.json({ ok: false, error: 'شماره موبایل معتبر نیست.' }, 400)
  if (!PRODUCTS.includes(prod) || !BREEDS.includes(breed)) return c.json({ ok: false, error: 'محصول نامعتبر' }, 400)
  if (prod.includes('مرغ') && !breed) return c.json({ ok: false, error: 'نژاد را انتخاب کنید.' }, 400)

  const lines = [
    '🐣 <b>سفارش جدید</b>',
    '',
    `👤 نام: ${esc(first + ' ' + last)}`,
    `📞 تماس: ${esc(phone)}`,
    `📦 محصول: ${esc(prod)}`,
    breed ? `🐓 نژاد: ${esc(breed)}` : null,
    `🔢 تعداد: ${qty}`,
    city ? `📍 شهر: ${esc(city)}` : null,
    note ? `📝 توضیحات: ${esc(note)}` : null,
  ].filter(x => x !== null)

  const res = await fetch(`https://api.telegram.org/bot${c.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: c.env.CHAT_ID, text: lines.join('\n'), parse_mode: 'HTML' }),
  })
  if (!res.ok) return c.json({ ok: false, error: 'ارسال انجام نشد، لطفاً تماس بگیرید.' }, 502)
  return c.json({ ok: true })
})

export default order
