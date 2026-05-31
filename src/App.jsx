import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AutoQuote from './pages/AutoQuote'
import HomeQuote from './pages/HomeQuote'
import About from './pages/About'
import ThankYou from './pages/ThankYou'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auto-quote" element={<AutoQuote />} />
          <Route path="/home-quote" element={<HomeQuote />} />
          <Route path="/about" element={<About />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
