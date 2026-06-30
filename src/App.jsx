import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import DesktopNavBar from './components/DesktopNavBar'
import NavBar from './components/NavBar'
import { Toast, ErrorBoundary } from './components/common'
import Home from './pages/Home'
import AI from './pages/AI'
import MapPage from './pages/Map'
import MyPage from './pages/My'
import SearchPage from './pages/Search'
import TripDetail from './pages/TripDetail'
import POIDetail from './pages/POIDetail'
import Budget from './pages/Budget'
import { useTripStore, useUserStore } from './store'

function App() {
  const { initTrip } = useTripStore()
  const { initializeAuth } = useUserStore()
  const location = useLocation()

  useEffect(() => {
    initTrip()
    initializeAuth()
  }, [])

  const isAppRoute = location.pathname.startsWith('/app')
  const isDetailPage = ['/app/poi/', '/app/trip/', '/app/budget'].some(p => location.pathname.startsWith(p))
  const isSearchPage = location.pathname === '/app/search'
  const showMobileNav = isAppRoute && !isDetailPage && !isSearchPage

  return (<ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <DesktopNavBar />
      
      <main className="pt-16">
        <div className="hidden md:flex">
          <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white/80 backdrop-blur-xl border-r border-gray-100 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">快捷入口</h3>
                <div className="space-y-2">
                  <button onClick={() => window.location.hash = '/app/home'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium hover:from-indigo-100 hover:to-purple-100 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">🏠</span>
                    首页
                  </button>
                  <button onClick={() => window.location.hash = '/app/ai'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">✨</span>
                    AI规划
                  </button>
                  <button onClick={() => window.location.hash = '/app/map'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm">📍</span>
                    地图
                  </button>
                  <button onClick={() => window.location.hash = '/app/budget'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">💰</span>
                    预算
                  </button>
                  <button onClick={() => window.location.hash = '/app/my'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">👤</span>
                    我的
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">热门城市</h3>
                <div className="flex flex-wrap gap-2">
                  {['成都', '杭州', '重庆', '西安', '北京', '上海', '南京', '苏州'].map(city => (<button key={city} onClick={() => window.location.hash = `/app/search?city=${city}`} className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all">{city}</button>))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <p className="text-sm text-gray-500 mb-2">探索更多精彩旅程</p>
                  <button onClick={() => window.location.hash = '/app/ai'} className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">开始AI规划 →</button>
                </div>
              </div>
            </div>
          </aside>

          <div className="ml-64 flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/app/home" replace/>}/>
              <Route path="/app" element={<Navigate to="/app/home" replace/>}/>
              <Route path="/app/home" element={<Home />}/>
              <Route path="/app/ai" element={<AI />}/>
              <Route path="/app/map" element={<MapPage />}/>
              <Route path="/app/my" element={<MyPage />}/>
              <Route path="/app/search" element={<SearchPage />}/>
              <Route path="/app/poi/:poiId" element={<POIDetail />}/>
              <Route path="/app/trip/:tripId" element={<TripDetail />}/>
              <Route path="/app/budget" element={<Budget />}/>
              <Route path="*" element={<Navigate to="/app/home" replace/>}/>
            </Routes>
          </div>
        </div>

        <div className="md:hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/app/home" replace/>}/>
            <Route path="/app" element={<Navigate to="/app/home" replace/>}/>
            <Route path="/app/home" element={<Home />}/>
            <Route path="/app/ai" element={<AI />}/>
            <Route path="/app/map" element={<MapPage />}/>
            <Route path="/app/my" element={<MyPage />}/>
            <Route path="/app/search" element={<SearchPage />}/>
            <Route path="/app/poi/:poiId" element={<POIDetail />}/>
            <Route path="/app/trip/:tripId" element={<TripDetail />}/>
            <Route path="/app/budget" element={<Budget />}/>
            <Route path="*" element={<Navigate to="/app/home" replace/>}/>
          </Routes>
        </div>
      </main>

      {showMobileNav && <NavBar />}
      
      <Toast />
    </div>
  </ErrorBoundary>)
}

export default App
