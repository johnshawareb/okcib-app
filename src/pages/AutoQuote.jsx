import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, ChevronRight, ChevronLeft, CheckCircle, Shield } from 'lucide-react'

const STEPS = ['Vehicle', 'Driver', 'Coverage', 'Contact']

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))
const MAKES = ['Acura','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other']
const COVERAGE_TYPES = [
  { id: 'liability', label: 'Liability Only', desc: 'Covers damage/injury you cause to others', badge: 'Most Affordable' },
  { id: 'full', label: 'Full Coverage', desc: 'Liability + collision + comprehensive', badge: 'Most Popular' },
  { id: 'sr22', label: 'SR-22 / High Risk', desc: 'Required coverage filing for certain drivers', badge: '' },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all
            ${i < current ? 'bg-green-500 text-white' : i === current ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-brand-600' : 'text-gray-400'}`}>{s}</span>
          {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

export default function AutoQuote() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    year: '', make: '', model: '', vin: '',
    firstName: '', lastName: '', dob: '', gender: '', maritalStatus: '', license: '',
    coverageType: 'full', deductible: '500', additionalDrivers: false,
    name: '', email: '', phone: '', zip: '', notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else handleSubmit() }
  const back = () => setStep(s => s - 1)

  const handleSubmit = () => navigate('/thank-you?type=auto')

  const canNext = () => {
    if (step === 0) return form.year && form.make && form.model
    if (step === 1) return form.firstName && form.lastName && form.dob
    if (step === 2) return form.coverageType
    if (step === 3) return form.name && form.email && form.phone && form.zip
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <Car className="w-4 h-4" /> Auto Insurance Quote
          </div>
          <h1 className="text-2xl font-black text-gray-900">Get Your Free Auto Quote</h1>
          <p className="text-gray-500 text-sm mt-1">We'll compare Progressive, GEICO, Mercury & Root for you</p>
        </div>

        <StepIndicator current={step} />

        <div className="card p-6 sm:p-8 shadow-lg">
          {/* Step 0: Vehicle */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-500" /> Your Vehicle
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Year *</label>
                  <select className="select-field" value={form.year} onChange={e => set('year', e.target.value)}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Make *</label>
                  <select className="select-field" value={form.make} onChange={e => set('make', e.target.value)}>
                    <option value="">Select make</option>
                    {MAKES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Model *</label>
                <input className="input-field" placeholder="e.g. Camry, F-150, Civic" value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">VIN (optional)</label>
                <input className="input-field" placeholder="17-character VIN" value={form.vin} onChange={e => set('vin', e.target.value.toUpperCase())} maxLength={17} />
                <p className="text-xs text-gray-400 mt-1">Providing the VIN helps us get the most accurate quote</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Primary use</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Commute', 'Pleasure', 'Business'].map(u => (
                    <button
                      key={u}
                      type="button"
                      className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.vehicleUse === u ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
                      onClick={() => set('vehicleUse', u)}
                    >{u}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Driver */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Primary Driver</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input className="input-field" placeholder="First name" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input className="input-field" placeholder="Last name" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" className="input-field" value={form.dob} onChange={e => set('dob', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select className="select-field" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Status</label>
                  <select className="select-field" value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Driver's License State</label>
                <select className="select-field" value={form.license} onChange={e => set('license', e.target.value)}>
                  <option value="">Select state</option>
                  <option>Oklahoma</option>
                  <option>Texas</option>
                  <option>Kansas</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Any tickets or accidents in the last 3 years?</label>
                <div className="flex gap-3">
                  {['None', '1', '2+'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.incidents === v ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
                      onClick={() => set('incidents', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-brand-600" checked={form.additionalDrivers} onChange={e => set('additionalDrivers', e.target.checked)} />
                <span className="text-sm text-gray-700">I have additional drivers to add</span>
              </label>
            </div>
          )}

          {/* Step 2: Coverage */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Coverage Preferences</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Coverage Type *</label>
                <div className="space-y-3">
                  {COVERAGE_TYPES.map(c => (
                    <label key={c.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.coverageType === c.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}>
                      <input type="radio" name="coverage" className="mt-1 accent-brand-600" checked={form.coverageType === c.id} onChange={() => set('coverageType', c.id)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">{c.label}</span>
                          {c.badge && <span className="text-xs bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">{c.badge}</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {form.coverageType === 'full' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Deductible</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['250', '500', '1000', '2000'].map(d => (
                      <button key={d} type="button"
                        className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.deductible === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
                        onClick={() => set('deductible', d)}
                      >${d}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current carrier (if any)</label>
                <select className="select-field" value={form.currentCarrier} onChange={e => set('currentCarrier', e.target.value)}>
                  <option value="">No current insurance / Not sure</option>
                  <option>Progressive</option>
                  <option>GEICO</option>
                  <option>Mercury</option>
                  <option>Root</option>
                  <option>State Farm</option>
                  <option>Allstate</option>
                  <option>Farmers</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700">
                    <strong>Bundle & Save:</strong> Adding home insurance to your auto policy typically saves 10–25%. We'll check bundle pricing from all carriers automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Your Contact Info</h2>
              <p className="text-sm text-gray-500">One of our licensed agents will reach out with your personalized quote — usually within the same business day.</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code *</label>
                <input className="input-field" placeholder="73101" maxLength={5} value={form.zip} onChange={e => set('zip', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Best time to call</label>
                <select className="select-field" value={form.callTime} onChange={e => set('callTime', e.target.value)}>
                  <option value="">Any time during business hours</option>
                  <option>Morning (8am–12pm)</option>
                  <option>Afternoon (12pm–4pm)</option>
                  <option>Evening (4pm–6pm)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Anything else we should know?</label>
                <textarea className="input-field resize-none" rows={3} placeholder="e.g. I need SR-22, I have a teen driver, I want to bundle with home..." value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-xs text-brand-700">
                By submitting this form, you agree to be contacted by OKC Insurance Brokers. We never sell your information to third parties.
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${canNext() ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
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
