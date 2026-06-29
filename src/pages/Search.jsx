import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, ArrowLeft, Clock, TrendingUp, X, MapPin, Star } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import { useUIStore } from '../store'
import poiService from '../services/poiService'

const SearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchHistory, addSearchHistory, clearSearchHistory, showToast } = useUIStore()
  
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [hotPOIs, setHotPOIs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadHot = async () => {
      const pois = await poiService.getHotPOIs(null, 10)
      setHotPOIs(pois)
    }
    loadHot()
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setKeyword(q)
      handleSearch(q)
    }
  }, [searchParams])

  const handleSearch = async (text) => {
    if (!text.trim()) {
      setResults([])
      setShowResults(false)
      return
    }
    setLoading(true)
    try {
      const data = await poiService.searchPOIs(text)
      setResults(data)
      setShowResults(true)
      addSearchHistory(text)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(keyword)
  }

  const handleClear = () => {
    setKeyword('')
    setResults([])
    setShowResults(false)
    navigate('/app/search', { replace: true })
  }

  const handlePOIClick = (poiId) => {
    navigate(`/app/poi/${poiId}`)
  }

  const hotKeywords = ['熊猫', '火锅', '西湖', '兵马俑', '故宫', '夜景', '古镇', '小吃']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索目的地、景点、美食..."
              autoFocus
              className="w-full pl-12 pr-10 py-3 bg-gray-100 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {keyword && (
              <button type="button" onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="p-4">
        {!showResults ? (
          <div className="space-y-6">
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-700">搜索历史</span>
                  </div>
                  <button onClick={clearSearchHistory} className="text-sm text-gray-400">清空</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setKeyword(item); handleSearch(item) }}
                      className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 border border-gray-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-indigo-500" />
                <span className="font-medium text-gray-700">热门搜索</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((keyword, i) => (
                  <button
                    key={i}
                    onClick={() => { setKeyword(keyword); handleSearch(keyword) }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full text-sm text-indigo-600 border border-indigo-100"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-pink-500" />
                <span className="font-medium text-gray-700">热门推荐</span>
              </div>
              <div className="space-y-3">
                {hotPOIs.map((poi) => (
                  <GlassCard
                    key={poi.id}
                    hover
                    onClick={() => handlePOIClick(poi.id)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <img src={poi.image} alt={poi.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{poi.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span>{poi.rating}</span>
                        <span>·</span>
                        <span>{poi.city}</span>
                        <span>·</span>
                        <span>{poi.tags[0]}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              找到 <span className="font-semibold text-indigo-500">{results.length}</span> 个结果
            </p>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500">搜索中...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((poi) => (
                  <GlassCard
                    key={poi.id}
                    hover
                    onClick={() => handlePOIClick(poi.id)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <img src={poi.image} alt={poi.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{poi.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span>{poi.rating}</span>
                        <span>·</span>
                        <span>{poi.city}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {poi.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{tag}</span>
                        ))}
                      </div>
                    </div>
                    {poi.price > 0 && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-500">¥{poi.price}</span>
                        <p className="text-xs text-gray-400">起</p>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500">没有找到相关结果</p>
                <p className="text-sm text-gray-400 mt-1">试试其他关键词吧</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
