import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Phone, Mail, Car, Home, Clock } from 'lucide-react'

export default function ThankYou() {
  const [params] = useSearchParams()
  const type = params.get('type') === 'home' ? 'home' : 'auto'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Quote Request Received!</h1>
        <p className="text-gray-600 mb-2 text-lg">
          Thanks for choosing OKC Insurance Brokers.
        </p>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          One of our licensed {type === 'home' ? 'home' : 'auto'} insurance agents will reach out to you with personalized quotes from our carriers — typically <strong>within the same business day</strong>.
        </p>

        {/* What happens next */}
        <div className="card p-6 mb-6 text-left">
          <h3 className="font-bold text-gray-900 mb-4">What Happens Next</h3>
          <ol className="space-y-3">
            {[
              { icon: Clock, text: 'Our agent reviews your information (usually within a few hours)' },
              { icon: Phone, text: 'We contact you at your preferred time with quote options' },
              { icon: CheckCircle, text: 'You pick the policy that\'s right for you — no pressure, no obligation' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="bg-brand-50 rounded-full p-1.5 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm text-gray-600">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Need it sooner */}
        <div className="card p-5 mb-8 bg-brand-50 border border-brand-100">
          <p className="text-sm text-brand-700 font-medium mb-2">Need a quote right away?</p>
          <a href="tel:+14055550100" className="flex items-center justify-center gap-2 text-brand-800 font-bold hover:text-brand-900 transition-colors">
            <Phone className="w-4 h-4" /> Call us at (405) 555-0100
          </a>
          <p className="text-xs text-brand-500 mt-1">Mon–Fri 8am–6pm · Sat 9am–3pm CT</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-secondary inline-flex items-center gap-2 justify-center">
            Back to Home
          </Link>
          {type === 'auto' ? (
            <Link to="/home-quote" className="btn-gold inline-flex items-center gap-2 justify-center text-sm py-3">
              <Home className="w-4 h-4" /> Also Get a Home Quote
            </Link>
          ) : (
            <Link to="/auto-quote" className="btn-primary inline-flex items-center gap-2 justify-center text-sm">
              <Car className="w-4 h-4" /> Also Get an Auto Quote
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
