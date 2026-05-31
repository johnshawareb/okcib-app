import { Link } from 'react-router-dom'
import {
  Car, Home, Shield, Star, CheckCircle, Phone,
  ArrowRight, Users, Award, Clock, ChevronDown
} from 'lucide-react'
import { useState } from 'react'

const CARRIERS = [
  {
    name: 'Progressive',
    color: '#0066CC',
    bg: '#e8f0fe',
    badge: 'Best for Drivers',
    features: ['Snapshot® usage-based savings', 'Name Your Price® tool', 'Bundling discounts', '24/7 claims support'],
  },
  {
    name: 'GEICO',
    color: '#00843D',
    bg: '#e6f4ea',
    badge: 'Best Value',
    features: ['15 minutes could save 15%+', 'Military & federal discounts', 'Multi-policy bundles', 'Mechanical breakdown coverage'],
  },
  {
    name: 'Mercury',
    color: '#C8202F',
    bg: '#fde8ea',
    badge: 'Best for Homeowners',
    features: ['Competitive home + auto bundle', 'RealDrive® pay-per-mile', 'Good driver discounts', 'Strong Oklahoma presence'],
  },
  {
    name: 'Root',
    color: '#FF5733',
    bg: '#fff0ed',
    badge: 'Best for Safe Drivers',
    features: ['Drive-to-qualify app', 'No credit score needed', 'Up to 52% savings', 'Fast mobile claims'],
  },
]

const FAQS = [
  {
    q: 'How does an insurance broker save me money?',
    a: 'As an independent broker, we shop your coverage across all our carriers — Progressive, GEICO, Mercury, and Root — and present you the best rate. You get expert advice without paying extra; the carriers pay our commission.',
  },
  {
    q: 'How fast can I get a quote?',
    a: 'Our online quote form takes under 5 minutes. One of our licensed agents will follow up within the same business day with your personalized options.',
  },
  {
    q: 'Do you serve all of Oklahoma?',
    a: 'We\'re based in Oklahoma City and licensed statewide. We serve OKC metro, Tulsa, Edmond, Norman, Moore, Midwest City, and everywhere in between.',
  },
  {
    q: 'Can I bundle auto and home insurance?',
    a: 'Absolutely — and you should. Bundling typically saves 10–25% on both policies. We\'ll show you bundle pricing alongside individual quotes.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-800">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 40%)'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Oklahoma's Trusted Independent Broker
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                Insurance That Fits
                <span className="block text-gold-400">Your Life & Budget</span>
              </h1>
              <p className="text-brand-200 text-lg mb-8 leading-relaxed max-w-lg">
                We compare Progressive, GEICO, Mercury &amp; Root side-by-side — so you get the <strong className="text-white">best coverage at the lowest price</strong>, without the hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auto-quote" className="btn-gold flex items-center justify-center gap-2 text-base">
                  <Car className="w-5 h-5" />
                  Get Auto Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/home-quote" className="btn-secondary flex items-center justify-center gap-2 text-base">
                  <Home className="w-5 h-5" />
                  Get Home Quote
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-brand-300">
                <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No spam calls</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free to compare</div>
                <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Licensed agents</div>
              </div>
            </div>

            {/* Quick quote card */}
            <div className="lg:justify-self-end w-full max-w-sm">
              <div className="card p-6 shadow-2xl">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Quote</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Insurance Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/auto-quote" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-brand-200 bg-brand-50 hover:border-brand-500 transition-colors text-brand-700">
                        <Car className="w-6 h-6" />
                        <span className="text-sm font-semibold">Auto</span>
                      </Link>
                      <Link to="/home-quote" className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 hover:border-brand-500 transition-colors text-gray-600">
                        <Home className="w-6 h-6" />
                        <span className="text-sm font-semibold">Home</span>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">ZIP Code</label>
                    <input className="input-field" placeholder="73101" maxLength={5} />
                  </div>
                  <Link to="/auto-quote" className="btn-primary w-full text-center block">
                    Start My Quote →
                  </Link>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">Takes less than 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: '5,000+', label: 'Oklahoma Families' },
              { icon: Award, value: '4 Carriers', label: 'to Compare' },
              { icon: Star, value: '4.9★', label: 'Google Rating' },
              { icon: Clock, value: '< 5 Min', label: 'Quote Process' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-brand-500 mb-1" />
                <div className="font-black text-xl text-brand-800">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">What We Cover</h2>
          <p className="text-gray-500 max-w-xl mx-auto">One broker, multiple options. We handle auto and home insurance for Oklahoma families.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-8 hover:shadow-lg transition-shadow group">
            <div className="bg-brand-50 rounded-2xl p-4 w-fit mb-5 group-hover:bg-brand-100 transition-colors">
              <Car className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Auto Insurance</h3>
            <p className="text-gray-500 mb-5 text-sm leading-relaxed">
              Liability, collision, comprehensive, uninsured motorist, roadside assistance, and more — at the best rate from our carrier network.
            </p>
            <ul className="space-y-2 mb-6">
              {['Liability & Full Coverage', 'SR-22 / High-Risk Drivers', 'Multi-Car Discounts', 'New & Classic Vehicles'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/auto-quote" className="btn-primary inline-flex items-center gap-2 text-sm">
              Get Auto Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card p-8 hover:shadow-lg transition-shadow group">
            <div className="bg-gold-500/10 rounded-2xl p-4 w-fit mb-5 group-hover:bg-gold-500/20 transition-colors">
              <Home className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Home Insurance</h3>
            <p className="text-gray-500 mb-5 text-sm leading-relaxed">
              Dwelling, personal property, liability, and loss-of-use coverage that protects your home from Oklahoma weather and beyond.
            </p>
            <ul className="space-y-2 mb-6">
              {['Dwelling & Structure', 'Tornado & Hail Coverage', 'Personal Property', 'Auto + Home Bundle Savings'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/home-quote" className="btn-gold inline-flex items-center gap-2 text-sm py-3">
              Get Home Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Our Carrier Partners</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We work with four top-rated carriers so you always get the best deal — we do the comparing, you get the savings.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CARRIERS.map((c) => (
              <div key={c.name} className="card p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="rounded-xl px-3 py-2 font-black text-lg"
                    style={{ backgroundColor: c.bg, color: c.color }}
                  >
                    {c.name}
                  </div>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                    {c.badge}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {c.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500">Simple, fast, and free</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Fill Out Your Info', desc: 'Tell us about your vehicle, home, or both in under 5 minutes. We keep your info private and secure.' },
            { step: '2', title: 'We Shop All 4 Carriers', desc: 'Our agents compare Progressive, GEICO, Mercury, and Root on your behalf to find the best coverage and price.' },
            { step: '3', title: 'Pick Your Policy', desc: 'We present your options clearly. No jargon, no pressure. Choose the policy that fits your life and budget.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                {step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">What Oklahoma Customers Say</h2>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />)}
              <span className="ml-2 text-brand-300 text-sm">4.9 average · 200+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Marcus T.', loc: 'Edmond, OK', stars: 5, text: 'OKCIB saved me $480 a year on my truck and home combined. They found me a Mercury bundle I never would\'ve found on my own.' },
              { name: 'Priya S.', loc: 'OKC', stars: 5, text: 'Switched to Root through OKCIB after my rate went up with my old company. New rate is 40% lower. The app quote process was so easy.' },
              { name: 'Dale W.', loc: 'Moore, OK', stars: 5, text: 'After the tornado last spring, OKCIB walked me through my entire Progressive home claim. Best decision to use a broker instead of going direct.' },
            ].map(({ name, loc, stars, text }) => (
              <div key={name} className="bg-brand-900 rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(stars)].map((_, i) => <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />)}
                </div>
                <p className="text-brand-200 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="font-semibold text-white">{name}</div>
                  <div className="text-brand-400 text-xs">{loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gold-500 to-gold-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to Save on Insurance?</h2>
        <p className="mb-6 text-white/90 max-w-md mx-auto">Compare all 4 carriers in minutes. Oklahoma-licensed agents. No obligation.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/auto-quote" className="bg-white text-gold-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
            <Car className="w-5 h-5" /> Auto Quote
          </Link>
          <Link to="/home-quote" className="bg-brand-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-900 transition-colors inline-flex items-center gap-2">
            <Home className="w-5 h-5" /> Home Quote
          </Link>
          <a href="tel:+14055550100" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center gap-2">
            <Phone className="w-5 h-5" /> Call Us
          </a>
        </div>
      </section>
    </div>
  )
}
