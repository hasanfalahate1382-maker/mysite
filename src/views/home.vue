<script setup>
import { ref, reactive, computed } from 'vue'

const products = [
  { name: 'تخم نطفه‌دار بوقلمون', desc: 'تخم تازه و نطفه‌دار مناسب دستگاه جوجه‌کشی، با بسته‌بندی ضد ضربه.', c: 'bg-warning' },
  { name: 'جوجه یک‌روزه بوقلمون', desc: 'جوجه‌های سالم و فعال از مرغداری، آماده تحویل و ارسال.', c: 'bg-secondary' },
  { name: 'تخم نطفه‌دار مرغ', desc: 'نژادهای لاری، برهما و کوشین. نژاد را در فرم انتخاب کنید.', c: 'bg-accent' },
  { name: 'جوجه یک‌روزه مرغ', desc: 'جوجه یک‌روزه لاری، برهما و کوشین با مراقبت اولیه.', c: 'bg-primary' },
]
const breeds = [
  { n: 'لاری', d: 'نژادی مقاوم و سازگار با شرایط مختلف، مناسب پرورش خانگی و تولید تخم.' },
  { n: 'برهما', d: 'مرغ درشت با پاهای پردار، شناخته‌شده به‌خاطر جثه بزرگ و آرام بودن.' },
  { n: 'کوشین', d: 'نژاد زینتی و پرپشت با ظاهر پف‌دار و مزاج آرام.' },
]
const faq = [
  ['سفارش من چطور پیگیری می‌شود؟', 'بعد از ثبت فرم، کارشناس ما با شماره‌ای که وارد کرده‌اید تماس می‌گیرد و قیمت، موجودی و زمان ارسال را هماهنگ می‌کند.'],
  ['حداقل تعداد سفارش چقدر است؟', 'حداقل سفارش بسته به نوع محصول متفاوت است و هنگام تماس اعلام می‌شود.'],
  ['ارسال به شهرستان‌ها انجام می‌شود؟', 'بله، با بسته‌بندی مخصوص و هماهنگی روش ارسال هنگام تماس.'],
]

const API = '/api/order' // مسیر روت ورکر (فایل order.js)
const f = reactive({ first_name: '', last_name: '', phone: '', city: '', product: '', breed: '', quantity: '', note: '', website: '' })
const loading = ref(false)
const msg = ref({ t: '', ok: false })
const isHen = computed(() => f.product.includes('مرغ'))

const toEn = s => String(s).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
const say = (t, ok = false) => (msg.value = { t, ok })

function pick(name) {
  f.product = name
  if (!name.includes('مرغ')) f.breed = ''
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
}

async function submit() {
  const phone = toEn(f.phone).replace(/[\s-]/g, '')
  const qty = toEn(f.quantity)
  if (!f.first_name.trim() || !f.last_name.trim() || !f.product || !qty) return say('لطفاً همه فیلدهای ضروری را پر کنید.')
  if (!/^(\+98|0098|0)?9\d{9}$/.test(phone)) return say('شماره موبایل معتبر نیست (مثال: 09123456789).')
  if (isHen.value && !f.breed) return say('لطفاً نژاد مرغ را انتخاب کنید.')
  loading.value = true
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, phone, quantity: qty }),
    })
    const j = await r.json()
    if (j.ok) {
      say('درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.', true)
      Object.assign(f, { first_name: '', last_name: '', phone: '', city: '', product: '', breed: '', quantity: '', note: '' })
    } else say(j.error || 'ارسال انجام نشد، دوباره تلاش کنید.')
  } catch {
    say('خطا در ارتباط با سرور. دوباره تلاش کنید یا تماس بگیرید.')
  }
  loading.value = false
}
</script>

<template>
  <div dir="rtl" class="text-base-content">
    <!-- hero -->
    <section class="hero py-16 bg-base-200">
      <div class="max-w-5xl mx-auto px-5 grid md:grid-cols-5 gap-10 items-center">
        <div class="md:col-span-3">
          <h1 class="text-3xl md:text-5xl font-black leading-snug text-primary">تخم نطفه‌دار و جوجه یک‌روزه، مستقیم از مرغداری</h1>
          <p class="my-5 opacity-70 text-lg">تخم و جوجه یک‌روزه بوقلمون و مرغ نژادهای لاری، برهما و کوشین. سفارش را همین‌جا ثبت کنید تا کارشناس ما با شما تماس بگیرد.</p>
          <div class="flex gap-3 flex-wrap">
            <a href="#order" class="btn btn-primary rounded-full">ثبت سفارش</a>
            <a href="#products" class="btn btn-outline btn-primary rounded-full">مشاهده محصولات</a>
          </div>
          <div class="flex gap-2 flex-wrap mt-6">
            <span class="badge badge-outline">بسته‌بندی ایمن</span>
            <span class="badge badge-outline">ارسال به سراسر کشور</span>
            <span class="badge badge-outline">مشاوره جوجه‌کشی</span>
          </div>
        </div>
        <div class="md:col-span-2 hidden md:flex justify-center gap-3 items-end" aria-hidden="true">
          <div class="w-24 h-32 bg-warning rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"></div>
          <div class="w-32 h-44 bg-secondary rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"></div>
          <div class="w-20 h-28 bg-primary rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"></div>
        </div>
      </div>
    </section>

    <!-- products -->
    <section id="products" class="py-14 max-w-5xl mx-auto px-5">
      <h2 class="text-2xl md:text-3xl font-black text-primary">محصولات ما</h2>
      <p class="opacity-70 mb-8">روی «سفارش» بزنید تا محصول در فرم انتخاب شود.</p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="p in products" :key="p.name" class="card bg-base-100 border border-base-300 hover:-translate-y-1 transition">
          <div class="card-body gap-2">
            <div class="w-10 h-12 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]" :class="p.c"></div>
            <h3 class="font-bold text-lg">{{ p.name }}</h3>
            <p class="text-sm opacity-70 flex-1">{{ p.desc }}</p>
            <button class="btn btn-primary btn-sm rounded-full" @click="pick(p.name)">سفارش</button>
          </div>
        </div>
      </div>
    </section>

    <!-- breeds -->
    <section class="py-14 bg-primary text-primary-content">
      <div class="max-w-5xl mx-auto px-5">
        <h2 class="text-2xl md:text-3xl font-black">نژادهای مرغ</h2>
        <div class="grid md:grid-cols-3 gap-4 mt-6">
          <div v-for="b in breeds" :key="b.n" class="rounded-2xl border border-primary-content/20 p-6">
            <h3 class="text-xl font-bold mb-1">{{ b.n }}</h3>
            <p class="text-sm opacity-90">{{ b.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- order -->
    <section id="order" class="py-14 max-w-5xl mx-auto px-5 grid md:grid-cols-5 gap-8">
      <div class="md:col-span-2">
        <h2 class="text-2xl md:text-3xl font-black text-primary">ثبت سفارش</h2>
        <p class="opacity-70 mt-2">فرم را پر کنید؛ درخواست شما فوری برای ما ارسال می‌شود و با شما تماس می‌گیریم. قیمت و موجودی هنگام تماس اعلام می‌شود.</p>
      </div>
      <form class="md:col-span-3 card bg-base-100 border border-base-300 card-body grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="submit" novalidate>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">نام</span><input v-model="f.first_name" class="input input-bordered w-full" maxlength="40" autocomplete="given-name" /></label>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">نام خانوادگی</span><input v-model="f.last_name" class="input input-bordered w-full" maxlength="40" autocomplete="family-name" /></label>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">شماره تماس</span><input v-model="f.phone" type="tel" inputmode="tel" dir="ltr" class="input input-bordered w-full text-right" placeholder="09123456789" maxlength="15" autocomplete="tel" /></label>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">شهر (اختیاری)</span><input v-model="f.city" class="input input-bordered w-full" maxlength="40" /></label>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">نوع محصول</span>
          <select v-model="f.product" class="select select-bordered w-full">
            <option value="">انتخاب کنید</option>
            <option v-for="p in products" :key="p.name">{{ p.name }}</option>
          </select>
        </label>
        <label v-if="isHen" class="form-control"><span class="text-sm font-bold mb-1 block">نژاد مرغ</span>
          <select v-model="f.breed" class="select select-bordered w-full">
            <option value="">انتخاب کنید</option>
            <option v-for="b in breeds" :key="b.n">{{ b.n }}</option>
          </select>
        </label>
        <label class="form-control"><span class="text-sm font-bold mb-1 block">تعداد سفارش</span><input v-model="f.quantity" type="number" min="1" max="100000" class="input input-bordered w-full" /></label>
        <label class="form-control sm:col-span-2"><span class="text-sm font-bold mb-1 block">توضیحات (اختیاری)</span><textarea v-model="f.note" rows="3" maxlength="400" class="textarea textarea-bordered w-full"></textarea></label>
        <input v-model="f.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <div v-if="msg.t" class="sm:col-span-2 alert" :class="msg.ok ? 'alert-success' : 'alert-error'" role="status">{{ msg.t }}</div>
        <button class="btn btn-primary sm:col-span-2 text-lg" :disabled="loading">{{ loading ? 'در حال ارسال...' : 'ارسال درخواست' }}</button>
      </form>
    </section>

    <!-- faq -->
    <section class="pb-14 max-w-3xl mx-auto px-5">
      <h2 class="text-2xl font-black text-primary mb-5">سوالات متداول</h2>
      <div v-for="q in faq" :key="q[0]" class="collapse collapse-arrow bg-base-100 border border-base-300 mb-2">
        <input type="checkbox" />
        <div class="collapse-title font-bold">{{ q[0] }}</div>
        <div class="collapse-content text-sm opacity-80">{{ q[1] }}</div>
      </div>
    </section>

    <footer class="bg-base-300 py-8 text-sm">
      <div class="max-w-5xl mx-auto px-5 flex flex-wrap gap-6 justify-between">
        <div><b>نام فروشگاه شما</b><br />فروش تخم نطفه‌دار و جوجه یک‌روزه</div>
        <div><b>تماس</b><br /><a href="tel:09120000000" dir="ltr">0912 000 0000</a></div>
        <div><b>تلگرام</b><br /><a href="https://t.me/YOUR_ID" dir="ltr">@YOUR_ID</a></div>
      </div>
    </footer>
  </div>
</template>
