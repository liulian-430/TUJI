import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, Map, User, Menu, X } from 'lucide-react'
import CreateTripModal from './CreateTripModal'

const DesktopNavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: '首页', icon: Home, path: '/app/home' },
    { id: 'ai', label: 'AI规划', icon: Sparkles, path: '/app/ai' },
    { id: 'map', label: '地图', icon: Map, path: '/app/map' },
    { id: 'my', label: '我的', icon: User, path: '/app/my' },
  ]

  const isActive = (path) => location.pathname === path

  return (<>
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">旅</div>
            <span className="text-xl font-bold gradient-text">途迹</span>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (<button key={item.id} onClick={() => navigate(item.path)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path) ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={20}/>
                <span>{item.label}</span>
              </button>)
            })}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">新建行程</button>
          </div>
        </div>
      </div>
    </nav>

    <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app/home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow">旅</div>
          <span className="text-lg font-bold gradient-text">途迹</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>
      {mobileMenuOpen && (<div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon
          return (<button key={item.id} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}>
            <Icon size={20}/>
            <span>{item.label}</span>
          </button>)
        })}
        <div className="border-t border-gray-100 p-4">
          <button onClick={() => { setShowModal(true); setMobileMenuOpen(false); }} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium">新建行程</button>
        </div>
      </div>)}
    </nav>

    {showModal && <CreateTripModal onClose={() => setShowModal(false)}/>}
  </>)
}

export default DesktopNavBar
