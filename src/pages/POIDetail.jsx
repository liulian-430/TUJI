import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, Star, Clock, Camera, Share2, Map, Phone, Globe, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import { useTripStore, useUIStore } from '../store'
import poiService from '../services/poiService'

const POIDetail = () => {
  const navigate = useNavigate()
  const { poiId } = useParams()
  const { addPOI, isPOIAdded, toggleFavorite, isPOIFavorite, trips } = useTripStore()
  const { showToast } = useUIStore()
  
  const [poi, setPoi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTripPicker, setShowTripPicker] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  useEffect(() => {
    const loadPOI = async () => {
      setLoading(true)
      try {
        const data = await poiService.getPOIById(poiId)
        setPoi(data)
      } finally {
        setLoading(false)
      }
    }
    loadPOI()
  }, [poiId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!poi) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">景点不存在</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-indigo-500">返回</button>
        </div>
      </div>
    )
  }

  const added = isPOIAdded(poi.id)
  const favorited = isPOIFavorite(poi.id)

  const handleAddToTrip = (dayIndex) => {
    addPOI(poi, dayIndex)
    setShowTripPicker(false)
    showToast(`已添加到第${dayIndex + 1}天`, 'success')
  }

  const handleFavorite = () => {
    toggleFavorite(poi.id)
    showToast(favorited ? '已取消收藏' : '已收藏', 'success')
  }

  const typeColors = {
    attraction: { bg: 'bg-indigo-100', text: 'text-indigo-600', label: '景点' },
    food: { bg: 'bg-pink-100', text: 'text-pink-600', label: '美食' },
    shopping: { bg: 'bg-amber-100', text: 'text-amber-600', label: '购物' },
  }

  const colors = typeColors[poi.type] || typeColors.attraction

  const images = [
    poi.image,
    `https://picsum.photos/seed/${poi.id}2/800/600`,
    `https://picsum.photos/seed/${poi.id}3/800/600`,
    `https://picsum.photos/seed/${poi.id}4/800/600`,
  ]

  const reviews = [
    { id: 1, user: '旅行达人小王', avatar: 'https://picsum.photos/seed/r1/100', rating: 5, content: '非常值得一去！景色很美，建议早上早点去人少。', date: '2024-01-15', likes: 32 },
    { id: 2, user: '背包客阿明', avatar: 'https://picsum.photos/seed/r2/100', rating: 4, content: '整体不错，就是节假日人太多了，建议避开高峰。', date: '2024-01-10', likes: 18 },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="relative h-72">
        <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button onClick={handleFavorite} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Heart size={20} className={favorited ? 'text-red-500 fill-red-500' : 'text-white'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={20} className="text-white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {colors.label}
            </span>
            {poi.tags?.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-white/20 backdrop-blur-sm text-white">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{poi.name}</h1>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <span className="text-xl font-bold text-gray-800">{poi.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{poi.reviewCount || 2341} 条评价</span>
          </div>
          {poi.price > 0 && (
            <div className="text-right">
              <span className="text-2xl font-bold text-orange-500">¥{poi.price}</span>
              <span className="text-sm text-gray-400">/人</span>
            </div>
          )}
        </div>
        <GlassCard className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Clock className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
              <p className="text-xs text-gray-500">建议游玩</p>
              <p className="font-semibold text-gray-800 text-sm">{poi.duration}小时</p>
            </div>
            <div>
              <MapPin className="w-6 h-6 mx-auto mb-1 text-pink-500" />
              <p className="text-xs text-gray-500">位置</p>
              <p className="font-semibold text-gray-800 text-sm">{poi.city}</p>
            </div>
            <div>
              <Camera className="w-6 h-6 mx-auto mb-1 text-amber-500" />
              <p className="text-xs text-gray-500">拍照点</p>
              <p className="font-semibold text-gray-800 text-sm">{poi.photoSpots || 5}个</p>
            </div>
          </div>
        </GlassCard>
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-2">景点介绍</h3>
          <div className="relative">
            <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`}>
              {poi.description || `这是${poi.city}著名的${colors.label}，非常值得一游。这里风景优美，历史文化底蕴深厚，是来到${poi.city}必打卡的地方。无论是自然风光还是人文景观，都能让人流连忘返。建议游玩时间约${poi.duration}小时，可以慢慢欣赏，感受独特的魅力。`}
            </p>
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-indigo-500 text-sm flex items-center gap-1 mt-2"
            >
              {showFullDesc ? '收起' : '展开全部'}
              {showFullDesc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">相册</h3>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-full aspect-square rounded-xl object-cover" />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 mb-3">实用信息</h3>
          <GlassCard className="overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <Map className="w-5 h-5 text-indigo-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">地址</p>
                <p className="text-gray-700">{poi.address || `${poi.city}市区`}</p>
              </div>
            </div>
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <Clock className="w-5 h-5 text-indigo-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">开放时间</p>
                <p className="text-gray-700">08:00 - 18:00</p>
              </div>
            </div>
            <div className="flex items-center px-4 py-3">
              <Phone className="w-5 h-5 text-indigo-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">电话</p>
                <p className="text-gray-700">400-000-0000</p>
              </div>
            </div>
          </GlassCard>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">用户评价</h3>
            <button className="text-sm text-indigo-500">查看全部</button>
          </div>
          <div className="space-y-3">
            {reviews.map((review) => (
              <GlassCard key={review.id} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={review.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{review.user}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <button>👍 {review.likes}</button>
                  <button>💬 回复</button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 py-3">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleFavorite}
            className="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center"
          >
            <Heart size={22} className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
            <span className="text-xs text-gray-500 mt-0.5">收藏</span>
          </button>
          {showTripPicker && trips.length > 0 && (
            <div className="absolute bottom-20 left-4 right-4 max-w-md mx-auto">
              <GlassCard className="p-4">
                <p className="font-medium text-gray-800 mb-3">添加到行程</p>
                <div className="space-y-2">
                  {trips.map((trip) => (
                    <div key={trip.id}>
                      <p className="text-sm text-gray-600 mb-2">{trip.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {[...Array(trip.days)].map((_, di) => (
                          <button
                            key={di}
                            onClick={() => handleAddToTrip(di)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                          >
                            第{di + 1}天
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowTripPicker(false)}
                  className="w-full mt-3 py-2 text-gray-500 text-sm"
                >
                  取消
                </button>
              </GlassCard>
            </div>
          )}
          <button
            onClick={() => {
              if (trips.length === 0) {
                showToast('请先创建行程', 'warning')
                return
              }
              setShowTripPicker(!showTripPicker)
            }}
            className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
              added
                ? 'bg-green-50 text-green-600 border-2 border-green-200'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
            }`}
          >
            {added ? <Check size={20} /> : <Plus size={20} />}
            {added ? '已添加到行程' : '添加到行程'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default POIDetail
