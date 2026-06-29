import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import { Toast, ErrorBoundary } from './components/common'
import Home from './pages/Home'
import AI from './pages/AI'
import MapPage from './pages/Map'
import MyPage from './pages/My'
import SearchPage from './pages/Search'
import POIDetail from './pages/POIDetail'
import TripDetail from './pages/TripDetail'
import Budget from './pages/Budget'

function AppContent() {
  const location = useLocation()
  const isAppPage = location.pathname.startsWith('/app')
  const isDetailPage = ['/app/poi/', '/app/trip/', '/app/budget'].some(p => location.pathname.startsWith(p))
  const isSearchPage = location.pathname === '/app/search'

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/app/home" replace />} />
          <Route path="/app/home" element={<Home />} />
          <Route path="/app/ai" element={<AI />} />
          <Route path="/app/map" element={<MapPage />} />
          <Route path="/app/my" element={<MyPage />} />
          <Route path="/app/search" element={<SearchPage />} />
          <Route path="/app/poi/:poiId" element={<POIDetail />} />
          <Route path="/app/trip/:tripId" element={<TripDetail />} />
          <Route path="/app/budget" element={<Budget />} />
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Routes>
        {isAppPage && !isDetailPage && !isSearchPage && <NavBar />}
        <Toast />
      </ErrorBoundary>
    </div>
  )
}

export default AppContent
