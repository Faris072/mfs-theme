import { ref } from 'vue'

export type ThemeType =
  | 'clay'
  | 'glass'
  | 'neo'
  | 'minimalism'
  | 'brutalism'
  | 'bento'
  | 'cyberpunk'
  | 'retro'
  | 'swiss'
  | 'skeuomorphism'

export interface ThemeOption {
  id: ThemeType
  name: string
  description: string
  icon: string
  previewBg: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'clay',
    name: 'Claymorphism',
    description: '3D inflated soft surfaces, playful pastel aesthetics, and tactile curves.',
    icon: 'Layers',
    previewBg: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 50%, #fce7f3 100%)'
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Frosted translucent glass, backdrop blurs, glow accents, and dark sleek UI.',
    icon: 'Sparkles',
    previewBg: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)'
  },
  {
    id: 'neo',
    name: 'Neumorphism',
    description: 'Minimalist soft UI with extruded tactile elevations and dual directional lights.',
    icon: 'Circle',
    previewBg: 'linear-gradient(135deg, #e6ecf5 0%, #e2e8f0 100%)'
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    description: 'Ultra-clean monochrome surfaces, hairline borders, and generous whitespace.',
    icon: 'Minus',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)'
  },
  {
    id: 'brutalism',
    name: 'Neubrutalism',
    description: 'High-contrast bold borders, hard offset shadows, and vivid flat colors.',
    icon: 'Square',
    previewBg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    description: 'Modular Apple-inspired rounded tiles with crisp spacing and subtle depth.',
    icon: 'LayoutGrid',
    previewBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-lit dark HUD surfaces, sharp chamfered edges, and electric glows.',
    icon: 'Zap',
    previewBg: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #3b0764 100%)'
  },
  {
    id: 'retro',
    name: 'Retro 90s',
    description: 'Classic desktop bevels, pixel-sharp borders, and nostalgic system grays.',
    icon: 'Monitor',
    previewBg: 'linear-gradient(135deg, #d4d0c8 0%, #c0c0c0 100%)'
  },
  {
    id: 'swiss',
    name: 'Swiss Style',
    description: 'Grid-disciplined typography, stark white planes, and bold red accents.',
    icon: 'Grid',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
  },
  {
    id: 'skeuomorphism',
    name: 'Skeuomorphism',
    description: 'Rich physical textures, brushed gradients, and realistic specular highlights.',
    icon: 'Box',
    previewBg: 'linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 100%)'
  }
]

const VALID_THEMES: ThemeType[] = THEME_OPTIONS.map((t) => t.id)
const THEME_CLASSES = VALID_THEMES.map((id) => `theme-${id}`)

const currentTheme = ref<ThemeType>('clay')

export function useTheme() {
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      const body = document.body

      root.setAttribute('data-theme', theme)
      body.classList.remove(...THEME_CLASSES)
      body.classList.add(`theme-${theme}`)

      localStorage.setItem('active-theme', theme)
    }
  }

  const initTheme = (defaultTheme: ThemeType = 'clay') => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active-theme') as ThemeType | null
      if (saved && VALID_THEMES.includes(saved)) {
        setTheme(saved)
      } else {
        setTheme(defaultTheme)
      }
    }
  }

  return {
    currentTheme,
    themeOptions: THEME_OPTIONS,
    setTheme,
    initTheme
  }
}
