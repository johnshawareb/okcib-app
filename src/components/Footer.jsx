import { Link } from 'react-router-dom'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-500 rounded-lg p-1.5">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-black text-white text-lg">OKCIB</div>
                <div className="text-xs text-brand-300 -mt-1">Insurance Brokers</div>
              </div>
            </div>
            <p className="text-brand-300 text-sm leading-relaxed">
              Oklahoma City's trusted independent insurance broker. We shop multiple carriers so you get the best coverage at the lowest price.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-brand-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/auto-quote" className="hover:text-white transition-colors">Auto Insurance</Link></li>
              <li><Link to="/home-quote" className="hover:text-white transition-colors">Home Insurance</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Carriers */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Carriers</h4>
            <ul className="space-y-2 text-sm text-brand-300">
              <li>Progressive</li>
              <li>GEICO</li>
              <li>Mercury Insurance</li>
              <li>Root Insurance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-brand-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+14055550100" className="hover:text-white transition-colors">(405) 555-0100</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:info@okcib.com" className="hover:text-white transition-colors">info@okcib.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Oklahoma City, OK</span>
              </li>
              <li className="text-xs text-brand-400 pt-1">
                Mon–Fri: 8am–6pm CT<br />
                Sat: 9am–3pm CT
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-brand-400">
          <p>© {new Date().getFullYear()} OKC Insurance Brokers · OKCIB.com · Licensed in Oklahoma</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
