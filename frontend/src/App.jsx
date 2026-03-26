import { useRef } from 'react'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Community from './pages/Community'
import Games from './pages/Games'
import Home from './pages/Home'
import Universities from './pages/Universities'
import Wiki from './pages/Wiki'

export default function App() {
  const tawkMessengerRef = useRef(null)
  const tawkPropertyId = import.meta.env.VITE_TAWK_PROPERTY_ID
  const tawkWidgetId = import.meta.env.VITE_TAWK_WIDGET_ID
  const isTawkConfigured = Boolean(tawkPropertyId && tawkWidgetId)

  const handleTawkLoad = () => {
    console.log('Tawk.to Chat Widget da san sang!')
  }

  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto w-[min(1180px,95vw)] py-4 lg:py-6">
        <Navbar />
        <div className="mt-4">
          <Routes location={location} key={location.pathname}>
            <Route path="wiki" element={<Wiki />} />
            <Route path="games" element={<Games />} />
            <Route path="education" element={<Universities />} />
            <Route path="university" element={<Navigate to="/education" replace />} />
            <Route path="community" element={<Community />} />
            <Route path="career" element={<Navigate to="/community" replace />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </main>
      {isTawkConfigured ? (
        <TawkMessengerReact
          propertyId={tawkPropertyId}
          widgetId={tawkWidgetId}
          ref={tawkMessengerRef}
          onLoad={handleTawkLoad}
        />
      ) : null}
    </div>
  )
}
