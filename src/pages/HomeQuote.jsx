import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ChevronRight, ChevronLeft, CheckCircle, Shield } from 'lucide-react'

const STEPS = ['Property', 'Details', 'Coverage', 'Contact']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all
            ${i < current ? 'bg-green-500 text-white' : i === current ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-gold-600' : 'text-gray-400'}`}>{s}</span>
          {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

export default function HomeQuote() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    address: '', city: '', state: 'Oklahoma', zip: '',
    homeType: '', yearBuilt: '', sqft: '', stories: '',
    roofAge: '', roofMaterial: '', foundation: '', garage: '',
    coverageAmount: '200000', deductible: '1000', personalProperty: true,
    liability: true, waterBackup: false, scheduledProperty: false,
    name: '', email: '', phone: '', notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else handleSubmit() }
  const back = () => setStep(s => s - 1)
  const handleSubmit = () => navigate('/thank-you?type=home')

  const canNext = () => {
    if (step === 0) return form.address && form.city && form.zip
    if (step === 1) return form.homeType && form.yearBuilt && form.sqft
    if (step === 2) return form.coverageAmount
    if (step === 3) return form.name && form.email && form.phone
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-500/10 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <Home className="w-4 h-4" /> Home Insurance Quote
          </div>
          <h1 className="text-2xl font-black text-gray-900">Get Your Free Home Quote</h1>
          <p className="text-gray-500 text-sm mt-1">We compare top carriers for your Oklahoma home</p>
        </div>

        <StepIndicator current={step} />

        <div className="card p-6 sm:p-8 shadow-lg">
          {/* Step 0: Property location */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-gold-500" /> Property Location
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
                <input className="input-field" placeholder="123 Main Street" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                  <input className="input-field" placeholder="Oklahoma City" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code *</label>
                  <input className="input-field" placeholder="73101" maxLength={5} value={form.zip} onChange={e => set('zip', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ownership Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Owner', 'Purchasing'].map(o => (
                    <button key={o} type="button"
                      className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${form.ownership === o ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('ownership', o)}
                    >{o}</button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                  Oklahoma experiences some of the highest tornado and hail risk in the nation. We'll make sure your coverage is built for Oklahoma weather.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Home details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Home Details</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Home Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Single Family', 'Condo', 'Townhouse', 'Mobile Home', 'Duplex', 'Other'].map(t => (
                    <button key={t} type="button"
                      className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${form.homeType === t ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('homeType', t)}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Year Built *</label>
                  <input className="input-field" placeholder="e.g. 2005" maxLength={4} value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Square Footage *</label>
                  <input className="input-field" placeholder="e.g. 1800" value={form.sqft} onChange={e => set('sqft', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stories</label>
                  <select className="select-field" value={form.stories} onChange={e => set('stories', e.target.value)}>
                    <option value="">Select</option>
                    <option>1</option>
                    <option>1.5</option>
                    <option>2</option>
                    <option>3+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Garage</label>
                  <select className="select-field" value={form.garage} onChange={e => set('garage', e.target.value)}>
                    <option value="">Select</option>
                    <option>None</option>
                    <option>1-car attached</option>
                    <option>2-car attached</option>
                    <option>Detached</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Age (approx.)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['< 5 yrs', '5–10 yrs', '10–15 yrs', '15+ yrs'].map(r => (
                    <button key={r} type="button"
                      className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${form.roofAge === r ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('roofAge', r)}
                    >{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Material</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Asphalt', 'Metal', 'Tile', 'Flat', 'Wood', 'Other'].map(r => (
                    <button key={r} type="button"
                      className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${form.roofMaterial === r ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('roofMaterial', r)}
                    >{r}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Coverage */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Coverage Preferences</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Dwelling Coverage</label>
                <select className="select-field" value={form.coverageAmount} onChange={e => set('coverageAmount', e.target.value)}>
                  <option value="100000">$100,000</option>
                  <option value="150000">$150,000</option>
                  <option value="200000">$200,000</option>
                  <option value="250000">$250,000</option>
                  <option value="300000">$300,000</option>
                  <option value="350000">$350,000</option>
                  <option value="400000">$400,000+</option>
                  <option value="unsure">Not sure — agent will advise</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">This is the cost to rebuild, not the market value of your home</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deductible Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {['$500', '$1,000', '$2,500'].map(d => (
                    <button key={d} type="button"
                      className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${form.deductible === d ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('deductible', d)}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Optional Add-Ons</label>
                <div className="space-y-2">
                  {[
                    { key: 'personalProperty', label: 'Enhanced Personal Property', desc: 'Covers belongings above standard limits' },
                    { key: 'waterBackup', label: 'Water Backup Coverage', desc: 'Sewer/drain backup damage — common in OKC' },
                    { key: 'scheduledProperty', label: 'Scheduled Personal Property', desc: 'Extra coverage for jewelry, art, electronics' },
                    { key: 'tornado', label: 'Extended Tornado Coverage', desc: 'Higher limits for tornado/wind damage' },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form[key] ? 'border-gold-400 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                      <input type="checkbox" className="mt-1 accent-gold-500" checked={!!form[key]} onChange={e => set(key, e.target.checked)} />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bundle with Auto Insurance?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Yes — I have a vehicle', 'No — home only'].map(b => (
                    <button key={b} type="button"
                      className={`py-2.5 rounded-lg border-2 text-xs font-medium transition-all ${form.bundle === b ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('bundle', b)}
                    >{b}</button>
                  ))}
                </div>
                {form.bundle === 'Yes — I have a vehicle' && (
                  <p className="text-xs text-green-600 mt-1 font-medium">Great — bundling typically saves 10–25%!</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Your Contact Info</h2>
              <p className="text-sm text-gray-500">A licensed agent will follow up with your home insurance options, usually the same business day.</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                <input type="tel" className="input-field" placeholder="(405) 555-0100" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Best time to reach you</label>
                <select className="select-field" value={form.callTime} onChange={e => set('callTime', e.target.value)}>
                  <option value="">Any time during business hours</option>
                  <option>Morning (8am–12pm CT)</option>
                  <option>Afternoon (12pm–4pm CT)</option>
                  <option>Evening (4pm–6pm CT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional notes</label>
                <textarea className="input-field resize-none" rows={3} placeholder="e.g. pool, home business, rental unit, recent renovation..." value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-xs text-brand-700">
                By submitting this form, you agree to be contacted by OKC Insurance Brokers. We never sell your information.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button onClick={back} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            <button
              onClick={next}
              disabled={!canNext()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${canNext() ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {step === STEPS.length - 1 ? 'Submit Quote Request' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Secure & confidential · Licensed Oklahoma insurance broker · OKCIB.com
        </p>
      </div>
    </div>
  )
}
