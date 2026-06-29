import { POI_DATABASE, CITIES } from '../data/pois'

const poiService = {
  async getPOIs({ city, type, tags, limit = 20 } = {}) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    let result = [...POI_DATABASE]
    
    if (city) {
      result = result.filter(poi => poi.city === city)
    }
    if (type) {
      result = result.filter(poi => poi.type === type)
    }
    if (tags && tags.length > 0) {
      result = result.filter(poi => 
        tags.some(tag => poi.tags.includes(tag))
      )
    }
    
    return result.slice(0, limit)
  },

  async getPOIById(id) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return POI_DATABASE.find(poi => poi.id === id) || null
  },

  async searchPOIs(keyword) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!keyword.trim()) return []
    
    const lower = keyword.toLowerCase()
    return POI_DATABASE.filter(poi => 
      poi.name.toLowerCase().includes(lower) ||
      poi.city.toLowerCase().includes(lower) ||
      poi.tags.some(tag => tag.toLowerCase().includes(lower))
    )
  },

  async getHotPOIs(city, limit = 6) {
    await new Promise(resolve => setTimeout(resolve, 150))
    
    let result = [...POI_DATABASE]
    if (city) {
      result = result.filter(poi => poi.city === city)
    }
    return result.sort((a, b) => b.rating - a.rating).slice(0, limit)
  },

  getCities() {
    return CITIES
  },
}

export default poiService
