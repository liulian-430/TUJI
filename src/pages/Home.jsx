import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Sparkles, TrendingUp, Camera, ChevronRight, Star } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import { useTripStore, useUIStore } from '../store'
import poiService from '../services/poiService'

const Home = () => {
  const navigate = useNavigate()
  const { currentTrip, getAllPOIs } = useTripStore()
  const { addSearchHistory } = useUIStore()
  
  const [hotCities, setHotCities] = useState([])
  const [hotPOIs, setHotPOIs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const cities = poiService.getCities()
        setHotCities(cities.slice(0, 8))
        const pois = await poiService.getHotPOIs('成都', 6)
        setHotPOIs(pois)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const allPOIs = getAllPOIs()

  const handleSearch = (keyword) => {
    if (keyword.trim()) {
      addSearchHistory(keyword)
      navigate(`/app/search?q=${encodeURIComponent(keyword)}`)
    } else {
      navigate('/app/search')
    }
  }

  const handleCityClick = (city) => {
    navigate(`/app/search?city=${encodeURIComponent(city)}`)
  }

  const handlePOIClick = (poiId) => {
    navigate(`/app/poi/${poiId}`)
  }

  const features = [
    { icon: Sparkles, title: 'AI智能规划', desc: '一键生成专属行程', color: 'from-indigo-500 to-purple-500' },
    { icon: MapPin, title: '海量目的地', desc: '覆盖全国热门城市', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, title: '预算管理', desc: '智能规划旅行花费', color: 'from-amber-500 to-orange-500' },
    { icon: Camera, title: '旅行足迹', desc: '记录每一段美好', color: 'from-emerald-500 to-teal-500' },
  ]

  const feedItems = [
    { id: 1, user: '旅行达人小王', avatar: 'https://picsum.photos/seed/user1/100', city: '成都', days: 5, likes: 328, cover: 'https://picsum.photos/seed/feed1/400/300' },
    { id: 2, user: '背包客阿明', avatar: 'https://picsum.photos/seed/user2/100', city: '杭州', days: 3, likes: 256, cover: 'https://picsum.photos/seed/feed2/400/300' },
    { id: 3, user: '美食探险家', avatar: 'https://picsum.photos/seed/user3/100', city: '重庆', days: 4, likes: 412, cover: 'https://picsum.photos/seed/feed3/400/300' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-white pb-4">
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">发现美好目的地</h1>
            <p className="text-sm text-gray-500">探索你的下一段旅程</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            旅
          </div>
        </div>
        <div
          onClick={() => navigate('/app/search')}
          className="bg-white/80 backdrop-blur-lg rounded-full px-5 py-3.5 flex items-center gap-3 shadow-lg border border-white/30 mb-6 cursor-pointer hover:shadow-xl transition-all"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">搜索目的地、景点、美食...</span>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs text-gray-600 font-medium">{feature.title}</span>
              </div>
            )
          })}
        </div>
      </div>
      {currentTrip && allPOIs.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">我的行程</h2>
            <button onClick={() => navigate(`/app/trip/${currentTrip.id}`)} className="text-sm text-indigo-500 flex items-center gap-1">
              查看详情 <ChevronRight size={16} />
            </button>
          </div>
          <GlassCard hover className="p-4 cursor-pointer" onClick={() => navigate(`/app/trip/${currentTrip.id}`)}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <span className="text-xl font-bold">{currentTrip.days}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{currentTrip.name}</h3>
                <p className="text-sm text-gray-500">{currentTrip.city} · {allPOIs.length} 个景点</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">热门目的地</h2>
          <button className="text-sm text-indigo-500 flex items-center gap-1">
            更多 <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {hotCities.map((city, i) => (
            <button key={city} onClick={() => handleCityClick(city)} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-md border border-gray-100 text-xl font-bold text-gray-700">
                {city[0]}
              </div>
              <span className="text-xs text-gray-600">{city}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">热门景点</h2>
          <button className="text-sm text-indigo-500 flex items-center gap-1">
            更多 <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {hotPOIs.map((poi) => (
            <GlassCard key={poi.id} hover onClick={() => handlePOIClick(poi.id)} className="w-40 flex-shrink-0 overflow-hidden cursor-pointer">
              <img src={poi.image} alt={poi.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{poi.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span>{poi.rating}</span>
                  <span>·</span>
                  <span>{poi.city}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">旅行动态</h2>
          <button className="text-sm text-indigo-500 flex items-center gap-1">
            更多 <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {feedItems.map((item) => (
            <GlassCard key={item.id} hover className="overflow-hidden">
              <img src={item.cover} alt="" className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.user}</p>
                    <p className="text-xs text-gray-500">{item.city} · {item.days}天行程</p>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500">
                    <span className="text-sm">❤</span>
                    <span className="text-sm">{item.likes}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
