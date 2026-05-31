import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Shield } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Auto Quote', to: '/auto-quote' },
    { label: 'Home Quote', to: '/home-quote' },
    { label: 'About Us', to: '/about' },
  ]

  const active = (to) =>
    location.pathname === to
      ? 'text-brand-600 font-semibold'
      : 'text-gray-600 hover:text-brand-600'

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-600 rounded-lg p-1.5">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-black text-brand-800 text-lg tracking-tight">OKCIB</div>
              <div className="text-xs text-gray-500 -mt-1 font-medium">Insurance Brokers</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors ${active(l.to)}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+14055550100" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">(405) 555-0100</span>
            </a>
            <Link to="/auto-quote" className="btn-primary text-sm py-2 px-4">
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block text-sm font-medium py-1 ${active(l.to)}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+14055550100" className="flex items-center gap-2 text-sm text-gray-600 py-1">
            <Phone className="w-4 h-4" />
            (405) 555-0100
          </a>
          <Link to="/auto-quote" className="btn-primary text-sm py-2 px-4 inline-block" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </div>
      )}
    </nav>
  )
}
