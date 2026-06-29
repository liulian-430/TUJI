import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_USER = {
  id: 'user_local',
  nickname: '旅行家',
  avatar: null,
  bio: '用脚步丈量世界',
  level: 1,
  exp: 0,
  followers: 0,
  following: 0,
  tripCount: 0,
  poiCount: 0,
  role: 'user',
  phone: null,
  email: null,
  createdAt: new Date().toISOString(),
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      isLoggedIn: false,
      isAuthenticated: false,
      loading: false,
      token: null,
      
      settings: {
        pushNotifications: true,
        darkMode: false,
        language: 'zh-CN',
        units: 'metric',
        autoSave: true,
        offlineMode: false,
      },
      
      preferences: {
        travelStyle: 'balanced',
        budgetLevel: 'medium',
        interests: [],
      },

      initializeAuth: () => {
        set({ loading: false })
      },

      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }))
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }))
      },

      toggleInterest: (tag) => {
        set((state) => {
          const has = state.preferences.interests.includes(tag)
          return {
            preferences: {
              ...state.preferences,
              interests: has
                ? state.preferences.interests.filter(t => t !== tag)
                : [...state.preferences.interests, tag],
            },
          }
        })
      },
    }),
    {
      name: 'tuji-user-storage',
      version: 1,
      partialize: (state) => ({
        settings: state.settings,
        preferences: state.preferences,
      }),
    }
  )
)
