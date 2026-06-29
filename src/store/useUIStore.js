import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      isFirstLaunch: true,
      searchHistory: [],
      toast: null,
      loading: false,
      voiceInputText: '',

      setFirstLaunch: (value) => set({ isFirstLaunch: value }),
      
      addSearchHistory: (keyword) => set((state) => {
        const history = [keyword, ...state.searchHistory.filter(k => k !== keyword)].slice(0, 10)
        return { searchHistory: history }
      }),
      
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      showToast: (message, type = 'info') => {
        set({ toast: { message, type } })
        setTimeout(() => set({ toast: null }), 3000)
      },
      
      setLoading: (value) => set({ loading: value }),
      
      setVoiceInputText: (text) => set({ voiceInputText: text }),
      clearVoiceInputText: () => set({ voiceInputText: '' }),
    }),
    {
      name: 'tuji-ui-storage',
      version: 1,
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
)
