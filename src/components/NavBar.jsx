import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, Map, User, Plus } from 'lucide-react'
import { useUIStore } from '../store'

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useUIStore(state => state.showToast)
  const setVoiceInputText = useUIStore(state => state.setVoiceInputText)
  
  const [isRecording, setIsRecording] = useState(false)
  const [floatParticles, setFloatParticles] = useState([])
  const pressTimer = useRef(null)
  const particleInterval = useRef(null)
  const particleIdRef = useRef(0)

  const tabs = [
    { id: 'home', label: '首页', path: '/app', icon: Home },
    { id: 'ai', label: 'AI规划', path: '/app/ai', icon: Sparkles },
    { id: 'plus', label: '', path: '', icon: Plus, isPlus: true },
    { id: 'map', label: '地图', path: '/app/map', icon: Map },
    { id: 'my', label: '我的', path: '/app/my', icon: User },
  ]

  const currentTab = tabs.find(tab => {
    if (tab.isPlus) return false
    return location.pathname.startsWith(tab.path)
  })?.id || 'home'

  const handleTabClick = (tab) => {
    if (tab.isPlus) return
    navigate(tab.path)
  }

  const addParticle = useCallback(() => {
    const id = particleIdRef.current++
    const left = 40 + Math.random() * 20
    const delay = Math.random() * 0.3
    const size = 6 + Math.random() * 8
    setFloatParticles(prev => [...prev, { id, left, delay, size }])
    setTimeout(() => {
      setFloatParticles(prev => prev.filter(p => p.id !== id))
    }, 2000)
  }, [])

  const handlePlusPressStart = () => {
    pressTimer.current = setTimeout(() => {
      setIsRecording(true)
      showToast('正在录制，请说话...', 'info')
      particleInterval.current = setInterval(() => {
        addParticle()
      }, 200)
    }, 500)
  }

  const handlePlusPressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    if (isRecording) {
      setIsRecording(false)
      if (particleInterval.current) {
        clearInterval(particleInterval.current)
        particleInterval.current = null
      }
      setFloatParticles([])
      const mockText = '我想去成都玩3天，想看熊猫，吃火锅'
      setVoiceInputText(mockText)
      navigate('/app/ai')
      showToast('录制完成，已转到AI规划', 'success')
    } else {
      navigate('/app/ai')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-white/85 backdrop-blur-xl border-t border-gray-100/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            if (tab.isPlus) {
              return (
                <div
                  key={tab.id}
                  className="relative flex flex-col items-center justify-center -mt-6 cursor-pointer no-select"
                  onMouseDown={handlePlusPressStart}
                  onMouseUp={handlePlusPressEnd}
                  onMouseLeave={handlePlusPressEnd}
                  onTouchStart={handlePlusPressStart}
                  onTouchEnd={handlePlusPressEnd}
                >
                  {floatParticles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute bottom-3 rounded-full bg-gradient-to-t from-indigo-400 to-purple-300 opacity-60 animate-float-up"
                      style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        animationDelay: `${p.delay}s`,
                        filter: 'blur(2px)',
                      }}
                    />
                  ))}
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                      text-white shadow-lg shadow-purple-300/50
                      transition-all duration-300
                      ${isRecording ? 'scale-110 shadow-xl shadow-purple-400/60' : 'hover:scale-105 active:scale-95'}
                    `}
                  >
                    <Plus size={28} strokeWidth={2.5} className={isRecording ? 'animate-pulse' : ''} />
                  </div>
                </div>
              )
            }
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all"
              >
                <div className={`transition-all duration-300 ${isActive ? 'text-indigo-500 scale-110' : 'text-gray-400'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-xs font-medium transition-all ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white/85" />
    </div>
  )
}

export default NavBar
