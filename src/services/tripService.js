import { POI_DATABASE } from '../data/pois'

export const parseTripRequest = (text) => {
  const result = {
    city: null,
    days: null,
    budget: null,
    style: 'balanced',
    interests: [],
  }

  const cities = ['成都', '杭州', '重庆', '西安', '北京', '上海', '南京', '苏州']
  for (const city of cities) {
    if (text.includes(city)) {
      result.city = city
      break
    }
  }

  const dayMatch = text.match(/(\d+)\s*天/)
  if (dayMatch) {
    result.days = parseInt(dayMatch[1])
  }

  const budgetMatch = text.match(/(\d+)\s*块|(\d+)\s*元|预算\s*(\d+)/)
  if (budgetMatch) {
    result.budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3])
  }

  const interestKeywords = ['熊猫', '火锅', '美食', '历史', '文化', '自然', '购物', '夜景']
  for (const keyword of interestKeywords) {
    if (text.includes(keyword)) {
      result.interests.push(keyword)
    }
  }

  if (text.includes('轻松') || text.includes('休闲')) {
    result.style = 'relaxed'
  } else if (text.includes('紧凑') || text.includes('充实')) {
    result.style = 'packed'
  }

  return result
}

export const generateAITrip = async ({ city, days = 3, style = 'balanced', interests = [], budget = 3000 }) => {
  await new Promise(resolve => setTimeout(resolve, 1500))

  let cityPOIs = POI_DATABASE.filter(poi => poi.city === city)
  
  if (cityPOIs.length === 0) {
    cityPOIs = POI_DATABASE.slice(0, 12)
  }

  if (interests.length > 0) {
    const matched = cityPOIs.filter(poi => 
      interests.some(interest => 
        poi.tags.some(tag => tag.includes(interest)) ||
        poi.name.includes(interest)
      )
    )
    if (matched.length >= days * 2) {
      cityPOIs = matched
    }
  }

  const poisPerDay = style === 'relaxed' ? 2 : style === 'packed' ? 5 : 3
  
  const selectedPOIs = cityPOIs
    .sort(() => Math.random() - 0.5)
    .slice(0, days * poisPerDay)

  const dayColors = [
    { dot: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.15)' },
    { dot: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.15)' },
    { dot: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.15)' },
    { dot: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.15)' },
    { dot: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.15)' },
  ]

  const daysPlan = []
  let poiIndex = 0

  for (let i = 0; i < days; i++) {
    const dayPOIs = []
    for (let j = 0; j < poisPerDay && poiIndex < selectedPOIs.length; j++, poiIndex++) {
      dayPOIs.push(selectedPOIs[poiIndex])
    }
    daysPlan.push({
      day: i + 1,
      pois: dayPOIs,
      color: dayColors[i % dayColors.length],
    })
  }

  const allPOIs = daysPlan.flatMap(d => d.pois)
  const totalPrice = allPOIs.reduce((sum, poi) => sum + poi.price, 0)
  const attractions = allPOIs.filter(p => p.type === 'attraction').length
  const food = allPOIs.filter(p => p.type === 'food').length
  const shopping = allPOIs.filter(p => p.type === 'shopping').length
  const avgRating = allPOIs.length > 0 
    ? (allPOIs.reduce((sum, p) => sum + p.rating, 0) / allPOIs.length).toFixed(1)
    : 0

  return {
    success: true,
    city: city || '成都',
    days,
    totalPrice,
    daysPlan,
    summary: {
      attractions,
      food,
      shopping,
      avgRating,
    },
  }
}

const tripService = {
  parseTripRequest,
  generateAITrip,
}

export default tripService
