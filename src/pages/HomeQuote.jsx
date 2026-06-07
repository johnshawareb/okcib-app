import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ChevronRight, ChevronLeft, CheckCircle, Shield, Upload } from 'lucide-react'

const STEPS = ['Owner', 'Address', 'Property', 'Coverage', 'Contact']

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

const HEARING_SOURCES = ['Google Search', 'Facebook', 'Referral', 'Previous Customer', 'Other'];
const CONTACT_PREFS = ['Call', 'Email', 'Text', 'No preference'];

export default function HomeQuote() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    // Owner info
    firstName: '', lastName: '', dob: '',
    secondOwnerFirst: '', secondOwnerLast: '', secondOwnerDob: '', secondOwnerLicense: '',
    // Address
    address: '', address2: '', city: '', state: 'Oklahoma', zip: '',
    prevAddress: '', prevAddress2: '', prevCity: '', prevState: '', prevZip: '',
    // Property
    homeType: '', yearBuilt: '', stories: '',
    roofAge: '', roofMaterial: '', hailResistant: '',
    occupationOne: '', occupationTwo: '',
    hasPool: '', hasDogs: '', hasLosses: '', lossTypes: [],
    propertyOwnership: '', hasMortgage: '', shortTermRental: '', rentalDuration: '',
    // Coverage
    discounts: [], insuranceProducts: [], currentCoverage: '', policyStartDate: '', windHailDeductible: '',
    // Contact
    email: '', confirmEmail: '', phone: '',
    heardAboutUs: '', contactPreference: '', textOptIn: '', policyUpload: null,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleArray = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
  const toggleLoss = (val) => set('lossTypes', toggleArray(form.lossTypes, val))
  const toggleDiscount = (val) => set('discounts', toggleArray(form.discounts, val))
  const toggleProduct = (val) => set('insuranceProducts', toggleArray(form.insuranceProducts, val))

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else handleSubmit() }
  const back = () => setStep(s => s - 1)
  const handleSubmit = () => navigate('/thank-you?type=home')

  const canNext = () => {
    if (step === 0) return form.firstName && form.lastName && form.dob
    if (step === 1) return form.address && form.city && form.zip
    if (step === 2) return form.homeType && form.yearBuilt && form.occupationOne
    if (step === 3) return form.currentCoverage && form.policyStartDate
    if (step === 4) return form.email && form.confirmEmail && form.phone && form.heardAboutUs && form.contactPreference
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
          {/* Step 0: Owner Information */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Primary Owner Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input className="input-field" placeholder="First" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input className="input-field" placeholder="Last" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" className="input-field" value={form.dob} onChange={e => set('dob', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation (Primary) *</label>
                <input className="input-field" placeholder="e.g. Teacher, Nurse, Retired" value={form.occupationOne} onChange={e => set('occupationOne', e.target.value)} />
              </div>

              <hr className="my-6" />
              <h3 className="text-md font-bold text-gray-900">Second Owner (if applicable)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input className="input-field" placeholder="First" value={form.secondOwnerFirst} onChange={e => set('secondOwnerFirst', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input className="input-field" placeholder="Last" value={form.secondOwnerLast} onChange={e => set('secondOwnerLast', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                <input type="date" className="input-field" value={form.secondOwnerDob} onChange={e => set('secondOwnerDob', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                <input className="input-field" placeholder="e.g. Teacher, Nurse, Retired" value={form.occupationTwo} onChange={e => set('occupationTwo', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Driver's License #</label>
                <input className="input-field" placeholder="License number" value={form.secondOwnerLicense} onChange={e => set('secondOwnerLicense', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Property Address</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
                <input className="input-field" placeholder="123 Main Street" value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address Line 2</label>
                <input className="input-field" placeholder="Apt, Suite, etc. (optional)" value={form.address2} onChange={e => set('address2', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                  <input className="input-field" placeholder="Oklahoma City" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                  <input className="input-field" value={form.state} onChange={e => set('state', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code *</label>
                  <input className="input-field" placeholder="73101" maxLength={5} value={form.zip} onChange={e => set('zip', e.target.value)} />
                </div>
              </div>

              <hr className="my-6" />
              <h3 className="text-md font-bold text-gray-900">Previous/Mailing Address (optional)</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                <input className="input-field" placeholder="Previous address" value={form.prevAddress} onChange={e => set('prevAddress', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address Line 2</label>
                <input className="input-field" placeholder="Apt, Suite, etc. (optional)" value={form.prevAddress2} onChange={e => set('prevAddress2', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input className="input-field" placeholder="City" value={form.prevCity} onChange={e => set('prevCity', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input className="input-field" placeholder="State" value={form.prevState} onChange={e => set('prevState', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code</label>
                  <input className="input-field" placeholder="ZIP" maxLength={5} value={form.prevZip} onChange={e => set('prevZip', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Property Details</h2>

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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year Built *</label>
                <input className="input-field" placeholder="e.g. 2005" maxLength={4} value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} />
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Age</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hail-Resistant Roof</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Class 3/4', 'Metal', 'None'].map(h => (
                    <button key={h} type="button"
                      className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${form.hailResistant === h ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('hailResistant', h)}
                    >{h}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dogs? *</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.hasDogs === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('hasDogs', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pool? *</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.hasPool === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('hasPool', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Ownership *</label>
                <div className="space-y-2">
                  {['Renewal', 'New Purchase', 'Pending'].map(v => (
                    <button key={v} type="button"
                      className={`w-full py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.propertyOwnership === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('propertyOwnership', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mortgage? *</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.hasMortgage === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('hasMortgage', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Losses in Past 3 Years? *</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.hasLosses === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('hasLosses', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              {form.hasLosses === 'Yes' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Loss Types</label>
                  <div className="space-y-2">
                    {['Roof', 'Theft', 'Water', 'Other'].map(type => (
                      <label key={type} className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${form.lossTypes.includes(type) ? 'border-gold-400 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                        <input type="checkbox" className="accent-gold-500" checked={form.lossTypes.includes(type)} onChange={() => toggleLoss(type)} />
                        <span className="text-sm font-medium text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Short-Term Rental?</label>
                <div className="space-y-2">
                  {['Yes — in part', 'Yes — whole property', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`w-full py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.shortTermRental === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('shortTermRental', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Coverage & Products */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Coverage & Products</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Discounts</label>
                <div className="space-y-2">
                  {['Multi-policy', 'Security System', 'Smoke Detectors', 'New Home', 'Alarm', 'Other'].map(disc => (
                    <label key={disc} className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${form.discounts.includes(disc) ? 'border-gold-400 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                      <input type="checkbox" className="accent-gold-500" checked={form.discounts.includes(disc)} onChange={() => toggleDiscount(disc)} />
                      <span className="text-sm font-medium text-gray-900">{disc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Insurance Products</label>
                <div className="space-y-2">
                  {['Umbrella/Excess Liability', 'Jewelry Coverage', 'Pet Insurance', 'Life Insurance', 'Cyber Insurance', 'Dental Insurance'].map(prod => (
                    <label key={prod} className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${form.insuranceProducts.includes(prod) ? 'border-gold-400 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                      <input type="checkbox" className="accent-gold-500" checked={form.insuranceProducts.includes(prod)} onChange={() => toggleProduct(prod)} />
                      <span className="text-sm font-medium text-gray-900">{prod}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Do you have current homeowners coverage? *</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.currentCoverage === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('currentCoverage', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Desired Policy Start Date *</label>
                <input type="date" className="input-field" value={form.policyStartDate} onChange={e => set('policyStartDate', e.target.value)} />
              </div>

              <hr className="my-4" />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Wind/Hail Deductible</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1%', '2%', '3%', '5%'].map(d => (
                    <button key={d} type="button"
                      className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.windHailDeductible === d ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('windHailDeductible', d)}
                    >{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact & Submission */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
              <p className="text-sm text-gray-500">A licensed agent will follow up with your home insurance options, usually the same business day.</p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Email *</label>
                <input type="email" className="input-field" placeholder="Confirm email" value={form.confirmEmail} onChange={e => set('confirmEmail', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" className="input-field" placeholder="(405) 555-0100" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How did you hear about us? *</label>
                <select className="select-field" value={form.heardAboutUs} onChange={e => set('heardAboutUs', e.target.value)}>
                  <option value="">Select</option>
                  {HEARING_SOURCES.map(source => <option key={source}>{source}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Contact Method *</label>
                <select className="select-field" value={form.contactPreference} onChange={e => set('contactPreference', e.target.value)}>
                  <option value="">Select</option>
                  {CONTACT_PREFS.map(pref => <option key={pref}>{pref}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Message Opt-In?</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} type="button"
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.textOptIn === v ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}
                      onClick={() => set('textOptIn', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Old Policy (optional)</label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gold-400 transition-colors">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <input type="file" className="hidden" onChange={e => set('policyUpload', e.target.files?.[0] || null)} accept=".pdf,.jpg,.jpeg,.png" />
                </label>
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
