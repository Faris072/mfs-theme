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
  | 'liquid-glass'
  | 'material-you'
  | 'terminal'
  | 'hand-drawn'
  | 'y2k-chrome'
  | 'bauhaus'
  | 'pixel-art'
  | 'aurora-gradient'
  | 'vaporwave'
  | 'manga'

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
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    description: 'Translucent refractive glass, specular rim highlights, and deep backdrop blur.',
    icon: 'Droplets',
    previewBg: 'radial-gradient(circle at 18% 20%, #1e3a8a 0%, #0b1020 58%, #881337 100%)'
  },
  {
    id: 'material-you',
    name: 'Material You',
    description: 'Dynamic tonal pastel surfaces, expressive pill radii, and soft elevation.',
    icon: 'Palette',
    previewBg: 'linear-gradient(135deg, #f6f2fa 0%, #ede7f6 55%, #e8f0fe 100%)'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Phosphor green CRT aesthetic, monospace typography, and crisp sharp edges.',
    icon: 'Terminal',
    previewBg: 'radial-gradient(circle at 50% 30%, #09170d 0%, #040805 100%)'
  },
  {
    id: 'hand-drawn',
    name: 'Hand-Drawn',
    description: 'Warm sketchbook paper, charcoal ink strokes, and playful offset shadows.',
    icon: 'PenTool',
    previewBg: 'linear-gradient(180deg, #fdfbf7 0%, #f7f3e8 100%)'
  },
  {
    id: 'y2k-chrome',
    name: 'Y2K Chrome',
    description: 'Early-2000s metallic silver, glossy bevels, electric cobalt, and cyber lime.',
    icon: 'Disc',
    previewBg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #dbeafe 100%)'
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    description: 'Geometric modernism with primary red, blue, yellow, and stark black framing.',
    icon: 'Shapes',
    previewBg: 'linear-gradient(135deg, #f4f1ea 0%, #d92b2b 50%, #1d4ed8 100%)'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: '8-bit and 16-bit arcade UI with stepped pixel borders and retro palette.',
    icon: 'Gamepad2',
    previewBg: 'linear-gradient(135deg, #1a1c2c 0%, #29366f 100%)'
  },
  {
    id: 'aurora-gradient',
    name: 'Aurora',
    description: 'Northern lights dark glass with iridescent emerald, cyan, and violet glows.',
    icon: 'Sunrise',
    previewBg: 'radial-gradient(circle at 20% 20%, #10b981 0%, #070b19 60%, #8b5cf6 100%)'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Retro-futuristic synth aesthetic with hot magenta, cyan neon, and sunset purple.',
    icon: 'Radio',
    previewBg: 'linear-gradient(155deg, #1a0b2e 0%, #431259 60%, #ff4ecd 100%)'
  },
  {
    id: 'manga',
    name: 'Manga',
    description: 'High-contrast black and white ink panels with halftone depth and crimson accents.',
    icon: 'BookOpen',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 70%, #dc2626 100%)'
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
