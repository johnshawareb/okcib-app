import { Link } from 'react-router-dom'
import { Shield, Phone, Mail, Award, Users, Heart, Car, Home, CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-950 to-brand-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <Shield className="w-4 h-4" /> Licensed Oklahoma Insurance Broker
          </div>
          <h1 className="text-4xl font-black mb-4">About OKC Insurance Brokers</h1>
          <p className="text-brand-200 text-lg max-w-2xl mx-auto leading-relaxed">
            We're Oklahoma City's independent insurance broker. That means we work <em>for you</em> — not for any one insurance company — to find you the best coverage at the best price.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Insurance shopping is confusing, time-consuming, and frankly — most people end up overpaying. We started OKCIB to fix that for Oklahoma families.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              As an independent broker, we have access to multiple carriers — Progressive, GEICO, Mercury, and Root — so we can shop on your behalf and present you real options, not a single company's pitch.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We're Oklahomans serving Oklahomans. We know the weather risk, the roads, the neighborhoods — and we know what coverage you actually need.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: '5,000+', sub: 'Families Covered' },
              { icon: Award, label: '4 Carriers', sub: 'to Compare' },
              { icon: Heart, label: '4.9 Stars', sub: 'Google Rating' },
              { icon: Shield, label: 'Licensed', sub: 'in Oklahoma' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={sub} className="card p-5 text-center">
                <Icon className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                <div className="font-black text-xl text-brand-800">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-2">The Carriers We Work With</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Each carrier has strengths — we match you to the right one</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Progressive', color: '#0066CC', who: 'Best for: Multi-vehicle households, drivers who want usage-based discounts via Snapshot®', autos: true, home: true },
              { name: 'GEICO', color: '#00843D', who: 'Best for: Drivers looking for the lowest base rate, military families, federal employees', autos: true, home: true },
              { name: 'Mercury Insurance', color: '#C8202F', who: 'Best for: Homeowners wanting auto+home bundle savings, Oklahoma-focused coverage', autos: true, home: true },
              { name: 'Root Insurance', color: '#FF5733', who: 'Best for: Safe drivers who want to ditch credit-score rating, tech-savvy customers', autos: true, home: false },
            ].map(c => (
              <div key={c.name} className="card p-5">
                <div className="font-black text-lg mb-2" style={{ color: c.color }}>{c.name}</div>
                <p className="text-sm text-gray-600 mb-3">{c.who}</p>
                <div className="flex gap-2">
                  {c.autos && <span className="flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full font-medium"><Car className="w-3 h-3" /> Auto</span>}
                  {c.home && <span className="flex items-center gap-1 text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded-full font-medium"><Home className="w-3 h-3" /> Home</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why independent broker */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Why Use an Independent Broker?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'We Work For You', desc: 'Independent brokers are legally obligated to act in your best interest — not to push one company\'s products.' },
            { icon: Users, title: 'Multiple Quotes, One Call', desc: 'Instead of calling 4 carriers separately, you tell us once and we present all your options side-by-side.' },
            { icon: Award, title: 'Expert Oklahoma Guidance', desc: 'We know Oklahoma insurance requirements, tornado and hail risks, and state-specific discounts most customers miss.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="bg-brand-50 rounded-2xl p-4 w-fit mx-auto mb-3">
                <Icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-brand-950 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-3">Get in Touch</h2>
          <p className="text-brand-300 mb-8">Questions? Ready to get a quote? Give us a call or send a message — real agents, no bots.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="tel:+14055550100" className="flex items-center justify-center gap-2 bg-white text-brand-800 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5" /> (405) 555-0100
            </a>
            <a href="mailto:info@okcib.com" className="flex items-center justify-center gap-2 bg-brand-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
              <Mail className="w-5 h-5" /> info@okcib.com
            </a>
          </div>
          <div className="text-brand-400 text-sm">
            <div className="font-semibold text-brand-200 mb-1">Business Hours (Central Time)</div>
            Monday–Friday: 8:00 AM – 6:00 PM<br />
            Saturday: 9:00 AM – 3:00 PM<br />
            Sunday: Closed
          </div>
          <div className="mt-8">
            <Link to="/auto-quote" className="btn-gold inline-flex items-center gap-2">
              <Car className="w-5 h-5" /> Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
