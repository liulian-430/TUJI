import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Layers, Navigation, Star, ChevronDown, Search } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import { useTripStore } from '../store'
import poiService from '../services/poiService'

const MapPage = () => {
  const navigate = useNavigate()
  const { getAllPOIs, currentTrip } = useTripStore()
  const [cityPOIs, setCityPOIs] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPOI, setSelectedPOI] = useState(null)

  const tripPOIs = getAllPOIs()

  useEffect(() => {
    const loadPOIs = async () => {
      const pois = await poiService.getPOIs({ city: currentTrip?.city || '成都' })
      setCityPOIs(pois)
    }
    loadPOIs()
  }, [currentTrip?.city])

  const types = [
    { id: 'all', label: '全部', icon: MapPin },
    { id: 'attraction', label: '景点', icon: Star },
    { id: 'food', label: '美食', icon: Star },
    { id: 'shopping', label: '购物', icon: Star },
  ]

  const filteredPOIs = selectedType === 'all'
    ? cityPOIs
    : cityPOIs.filter(p => p.type === selectedType)

  const typeColors = {
    attraction: 'bg-indigo-500',
    food: 'bg-pink-500',
    shopping: 'bg-amber-500',
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="h-64 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-2 animate-bounce" />
            <p className="text-gray-500">地图视图</p>
          </div>
        </div>
        <div className="absolute top-4 left-4 right-4">
          <button
            onClick={() => navigate('/app/search')}
            className="w-full bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 flex items-center gap-3 shadow-lg"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">搜索地点</span>
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {types.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white/90 text-gray-600'
                }`}
              >
                <Icon size={16} />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative">
          {filteredPOIs.slice(0, 8).map((poi, i) => {
            const angle = (i / filteredPOIs.length) * 360
            const radius = 80 + Math.random() * 40
            const x = Math.cos(angle * Math.PI / 180) * radius
            const y = Math.sin(angle * Math.PI / 180) * radius
            return (
              <button
                key={poi.id}
                onClick={() => setSelectedPOI(poi)}
                className={`absolute w-10 h-10 rounded-full ${typeColors[poi.type] || 'bg-indigo-500'} text-white flex items-center justify-center shadow-lg transition-all hover:scale-125 pointer-events-auto`}
                style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
              >
                <MapPin size={18} />
              </button>
            )
          })}
        </div>
      </div>
      <div className="fixed top-20 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Layers size={20} className="text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Navigation size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto">
        {selectedPOI ? (
          <GlassCard hover className="p-4 cursor-pointer" onClick={() => navigate(`/app/poi/${selectedPOI.id}`)}>
            <div className="flex items-center gap-3">
              <img src={selectedPOI.image} alt={selectedPOI.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{selectedPOI.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>{selectedPOI.rating}</span>
                  <span>·</span>
                  <span>{selectedPOI.city}</span>
                </div>
              </div>
              <button className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <ChevronDown size={20} />
              </button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">附近景点</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {filteredPOIs.slice(0, 5).map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => setSelectedPOI(poi)}
                  className="flex-shrink-0 w-24"
                >
                  <img src={poi.image} alt={poi.name} className="w-24 h-20 rounded-xl object-cover mb-1" />
                  <p className="text-xs text-gray-600 font-medium truncate">{poi.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span>{poi.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
      {tripPOIs.length > 0 && (
        <div className="fixed bottom-44 right-4">
          <div className="bg-white rounded-2xl shadow-lg px-4 py-3">
            <p className="text-xs text-gray-500">我的行程</p>
            <p className="font-bold text-indigo-500">{tripPOIs.length} 个景点</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapPage
