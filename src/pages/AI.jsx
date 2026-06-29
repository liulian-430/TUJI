import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Wand2, Calendar, Wallet, MapPin, Star, UtensilsCrossed, Landmark, ShoppingBag, ChevronRight, Zap, RefreshCw } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import Button from '../components/common/Button'
import { useUIStore, useTripStore } from '../store'
import tripService from '../services/tripService'

const AI = () => {
  const navigate = useNavigate()
  const { voiceInputText, clearVoiceInputText, showToast } = useUIStore()
  const { createTrip, addPOI } = useTripStore()
  
  const [activeTab, setActiveTab] = useState('smart')
  const [inputText, setInputText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTrip, setGeneratedTrip] = useState(null)
  
  const [form, setForm] = useState({
    city: '成都',
    attractions: '',
    days: 3,
    budget: 3000,
    style: 'balanced',
    hotelPreference: 'comfortable',
    foodPreference: 'local',
  })

  useEffect(() => {
    if (voiceInputText) {
      setInputText(voiceInputText)
      setActiveTab('smart')
      clearVoiceInputText()
    }
  }, [voiceInputText, clearVoiceInputText])

  const quickInputs = [
    '我想去成都玩3天，想看熊猫吃火锅',
    '杭州2日游，西湖和灵隐寺',
    '重庆4天3夜，美食和夜景',
    '西安3天，历史文化之旅',
  ]

  const handleQuickInput = (text) => {
    setInputText(text)
  }

  const handleSmartGenerate = async () => {
    if (!inputText.trim()) {
      showToast('请输入您的旅行需求', 'warning')
      return
    }
    setIsGenerating(true)
    try {
      const parsed = tripService.parseTripRequest(inputText)
      const result = await tripService.generateAITrip({
        city: parsed.city || '成都',
        days: parsed.days || 3,
        style: parsed.style,
        interests: parsed.interests,
        budget: parsed.budget || 3000,
      })
      setGeneratedTrip(result)
      showToast('行程生成成功！', 'success')
    } catch (error) {
      showToast('生成失败，请重试', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCustomGenerate = async () => {
    if (!form.city.trim()) {
      showToast('请输入想去的城市', 'warning')
      return
    }
    setIsGenerating(true)
    try {
      const interests = form.attractions.split(/[,，、\s]+/).filter(Boolean)
      const result = await tripService.generateAITrip({
        city: form.city,
        days: form.days,
        style: form.style,
        interests,
        budget: form.budget,
      })
      setGeneratedTrip(result)
      showToast('行程生成成功！', 'success')
    } catch (error) {
      showToast('生成失败，请重试', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTrip = () => {
    if (!generatedTrip) return
    const trip = createTrip({
      name: `${generatedTrip.city}${generatedTrip.days}日游`,
      city: generatedTrip.city,
      days: generatedTrip.days,
      budget: generatedTrip.totalPrice,
    })
    generatedTrip.daysPlan.forEach((day, dayIndex) => {
      day.pois.forEach(poi => {
        addPOI(poi, dayIndex)
      })
    })
    showToast('行程已保存！', 'success')
    navigate(`/app/trip/${trip.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-white">
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI 智能规划</h1>
            <p className="text-sm text-gray-500">一句话，生成专属行程</p>
          </div>
        </div>
        <div className="flex bg-white/60 backdrop-blur-sm rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab('smart')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'smart'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            智能规划
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            个性化规划
          </button>
        </div>
      </div>
      <div className="px-4 pb-24">
        {activeTab === 'smart' && (
          <div className="space-y-6">
            <GlassCard className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <Wand2 className="w-6 h-6 text-indigo-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">告诉我你的旅行想法</h3>
                  <p className="text-sm text-gray-500">越详细，规划越精准</p>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：我想去成都玩3天，想看熊猫，吃火锅，预算3000元..."
                className="w-full h-32 p-4 bg-white/50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-gray-700 placeholder-gray-400"
              />
            </GlassCard>
            <div>
              <p className="text-sm text-gray-500 mb-3">快捷输入</p>
              <div className="flex flex-wrap gap-2">
                {quickInputs.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickInput(text)}
                    className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <Button variant="primary" size="lg" onClick={handleSmartGenerate} loading={isGenerating} disabled={isGenerating} icon={Sparkles} className="w-full">
              {isGenerating ? '正在生成中...' : '生成智能行程'}
            </Button>
          </div>
        )}
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <GlassCard className="p-5 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={18} className="text-indigo-500" />
                  想去的城市
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="请输入目的地城市"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Landmark size={18} className="text-indigo-500" />
                  想去的景点
                </label>
                <input
                  type="text"
                  value={form.attractions}
                  onChange={(e) => setForm({ ...form, attractions: e.target.value })}
                  placeholder="用逗号分隔，如：熊猫基地,宽窄巷子,锦里"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={18} className="text-indigo-500" />
                    旅游天数
                  </label>
                  <input
                    type="number"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={30}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Wallet size={18} className="text-indigo-500" />
                    预算(元)
                  </label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) || 0 })}
                    min={0}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">旅行风格</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'relaxed', label: '休闲', desc: '轻松慢游' },
                    { value: 'balanced', label: '适中', desc: '张弛有度' },
                    { value: 'packed', label: '紧凑', desc: '充实高效' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setForm({ ...form, style: style.value })}
                      className={`p-3 rounded-xl border transition-all ${
                        form.style === style.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 bg-white/50 text-gray-600'
                      }`}
                    >
                      <p className="font-medium text-sm">{style.label}</p>
                      <p className="text-xs opacity-70">{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
            <Button variant="primary" size="lg" onClick={handleCustomGenerate} loading={isGenerating} disabled={!form.city.trim() || isGenerating} icon={Sparkles} className="w-full">
              {isGenerating ? '正在生成中...' : '生成个性化行程'}
            </Button>
          </div>
        )}
        {generatedTrip && !isGenerating && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">生成结果</h2>
              <button onClick={() => setGeneratedTrip(null)} className="text-sm text-gray-500 flex items-center gap-1">
                <RefreshCw size={14} />重新生成
              </button>
            </div>
            <GlassCard className="p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {generatedTrip.city} · {generatedTrip.days}日游
                  </h3>
                  <p className="text-sm text-gray-500">AI 为您智能规划</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <Landmark className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
                  <p className="font-bold text-gray-800">{generatedTrip.summary.attractions}</p>
                  <p className="text-xs text-gray-500">景点</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-xl">
                  <UtensilsCrossed className="w-6 h-6 mx-auto mb-1 text-pink-500" />
                  <p className="font-bold text-gray-800">{generatedTrip.summary.food}</p>
                  <p className="text-xs text-gray-500">美食</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                  <p className="font-bold text-gray-800">{generatedTrip.summary.shopping}</p>
                  <p className="text-xs text-gray-500">购物</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <Star className="w-6 h-6 mx-auto mb-1 text-green-500" />
                  <p className="font-bold text-gray-800">{generatedTrip.summary.avgRating}</p>
                  <p className="text-xs text-gray-500">评分</p>
                </div>
              </div>
            </GlassCard>
            <div className="space-y-4 mb-6">
              {generatedTrip.daysPlan.map((day) => (
                <GlassCard key={day.day} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: day.color.dot }}>
                      {day.day}
                    </div>
                    <h4 className="font-semibold text-gray-800">第 {day.day} 天</h4>
                  </div>
                  <div className="space-y-2">
                    {day.pois.map((poi) => (
                      <div
                        key={poi.id}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/app/poi/${poi.id}`)}
                      >
                        <img src={poi.image} alt={poi.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{poi.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-0.5">
                              <Star size={10} className="text-amber-400 fill-amber-400" />
                              {poi.rating}
                            </span>
                            <span>·</span>
                            <span>{poi.duration}小时</span>
                            {poi.price > 0 && <><span>·</span><span>¥{poi.price}</span></>}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
            <Button variant="primary" size="lg" onClick={handleUseTrip} icon={Zap} className="w-full">
              使用这个行程
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AI
