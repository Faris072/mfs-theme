import type { ThemeType } from '../lib/composables/useTheme'

export type { ThemeType }

export interface DesignToken {
  name: string
  value: string
  description: string
}

export interface UtilityClass {
  className: string
  description: string
  example: string
}

export interface ThemeDetailInfo {
  id: ThemeType
  name: string
  tagline: string
  description: string
  icon: string
  badge: string
  accentColor: string
  previewBg: string
  keyFeatures: string[]
  designTokens: DesignToken[]
  utilityClasses: UtilityClass[]
}

export const THEMES_DATA: Record<ThemeType, ThemeDetailInfo> = {
  clay: {
    id: 'clay',
    name: 'Claymorphism',
    tagline: '3D Inflated Soft Touch and Tactile Volume',
    badge: 'Tactile Volume',
    icon: 'Layers',
    accentColor: '#7c3aed',
    previewBg: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 50%, #fce7f3 100%)',
    description:
      'Gaya visual claymorphism mengadopsi ilusi permukaan tanah liat 3D yang mengembang dan empuk. Menggunakan kombinasi multi-layer inner shadow putih dan diffuse outer drop shadow lembut dengan sudut sangat membulat (pill/curved edges).',
    keyFeatures: [
      'Dual shadow layering (inner highlight + soft outer shadow)',
      'Border-radius besar yang menghasilkan kesan empuk/inflated',
      'Warna latar pastel cerah dengan saturasi yang ramah mata',
      'Tactile press feedback pada interaksi tombol & input'
    ],
    designTokens: [
      { name: '--surface', value: '#f5f3ff', description: 'Warna dasar permukaan kartu dan komponen' },
      { name: '--clay-shadow', value: '8px 12px 20px rgba(76, 29, 149, 0.12), inset -4px -4px 8px rgba(109, 40, 217, 0.25), inset 4px 4px 8px rgba(255, 255, 255, 0.85)', description: 'Shadow khas 3D clay' },
      { name: '--radius-lg', value: '24px', description: 'Kelengkungan sudut utama komponen clay' },
      { name: '--primary', value: '#8b5cf6', description: 'Warna aksen interaktif (Violet Clay)' }
    ],
    utilityClasses: [
      { className: '.clay-card', description: 'Kontainer clay dengan efek 3D empuk dan shadow lembut', example: '<div class="clay-card">...</div>' },
      { className: '.clay-btn', description: 'Tombol clay dengan interaksi click pressed 3D', example: '<button class="clay-btn">Action</button>' },
      { className: '.clay-inset', description: 'Permukaan cekung masuk untuk field teks/form', example: '<input class="clay-inset" />' },
      { className: '.clay-pill', description: 'Badge/tag dengan kelengkungan bulat sempurna', example: '<span class="clay-pill">Label</span>' }
    ]
  },
  glass: {
    id: 'glass',
    name: 'Glassmorphism',
    tagline: 'Translucent Glass and Modern Contrast',
    badge: 'Translucent Glass',
    icon: 'Sparkles',
    accentColor: '#38bdf8',
    previewBg: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    description:
      'Gaya modern berbasis transparansi multi-layer, blur latar belakang (backdrop-filter), border tipis semi-transparan yang membiaskan cahaya, dan aksen neon glow berpadu dengan dark theme elegan.',
    keyFeatures: [
      'Backdrop filter blur intensif (16px - 24px)',
      'Border highlight translusen 1px yang menyerupai pantulan tepi kaca',
      'Aksen warna neon bercahaya (cyan, magenta, amber)',
      'Sangat optimal untuk UI berkonsep dark mode dan dashboard modern'
    ],
    designTokens: [
      { name: '--surface', value: 'rgba(255, 255, 255, 0.08)', description: 'Permukaan kaca semi-transparan' },
      { name: '--backdrop-blur', value: 'blur(16px)', description: 'Efek pembiasan kabut kaca di belakang elemen' },
      { name: '--border', value: 'rgba(255, 255, 255, 0.18)', description: 'Tepi pantulan kaca semi-bening' },
      { name: '--primary', value: '#38bdf8', description: 'Aksen neon glow (Sky Cyan)' }
    ],
    utilityClasses: [
      { className: '.glass-card', description: 'Permukaan panel kaca transparan dengan backdrop blur', example: '<div class="glass-card">...</div>' },
      { className: '.glass-glow', description: 'Aksen cahaya neon menyala di sekitar batas komponen', example: '<div class="glass-glow">...</div>' },
      { className: '.glass-border', description: 'Border gradien halus yang mensimulasikan bias cahaya', example: '<div class="glass-border">...</div>' },
      { className: '.glass-dock', description: 'Bar dock navigasi mengambang ala macOS', example: '<nav class="glass-dock">...</nav>' }
    ]
  },
  neo: {
    id: 'neo',
    name: 'Neumorphism',
    tagline: 'Minimalist Soft Surface and Relief',
    badge: 'Soft Surface',
    icon: 'Circle',
    accentColor: '#4f46e5',
    previewBg: 'linear-gradient(135deg, #e6ecf5 0%, #e2e8f0 100%)',
    description:
      'Gaya soft UI yang menyatu sempurna dengan background monokromatik. Elemen tidak mengambang, melainkan tampak diembos (extruded) atau ditekan (sunken) langsung dari material latar yang sama menggunakan dual shadows (bayangan terang dan bayangan gelap yang berlawanan).',
    keyFeatures: [
      'Warna latar belakang dan elemen yang identik/senada',
      'Dual shadow bertolak belakang (sisi atas kiri terang, bawah kanan gelap)',
      'Dua state fisik: Extruded (terangkat) dan Inset (tertekan ke dalam)',
      'Estetika minimalis, bersih, dan berfokus pada relief permukaan fisik'
    ],
    designTokens: [
      { name: '--bg', value: '#e6ecf5', description: 'Warna kanvas dasar dan material neumorphic' },
      { name: '--surface', value: '#e6ecf5', description: 'Permukaan elemen yang sama persis dengan latar' },
      { name: '--card-shadow', value: '10px 10px 20px #c4cad3, -10px -10px 20px #ffffff', description: 'Shadow timbul (extruded)' },
      { name: '--input-shadow', value: 'inset 4px 4px 8px #c4cad3, inset -4px -4px 8px #ffffff', description: 'Shadow cekung (sunken)' }
    ],
    utilityClasses: [
      { className: '.neo-box', description: 'Panel datar yang terangkat halus dari latar belakang', example: '<div class="neo-box">...</div>' },
      { className: '.neo-sunken', description: 'Permukaan yang masuk ke dalam permukaan latar', example: '<div class="neo-sunken">...</div>' },
      { className: '.neo-button', description: 'Tombol yang beralih dari timbul menjadi cekung saat diklik', example: '<button class="neo-button">Press</button>' },
      { className: '.neo-circle', description: 'Tombol aksi lingkaran timbul untuk kontrol audio/media', example: '<button class="neo-circle">▶</button>' }
    ]
  },

  minimalism: {
    id: 'minimalism',
    name: 'Minimalism',
    tagline: 'Pure Monochrome Clarity and Hairline Precision',
    badge: 'Ultra Clean',
    icon: 'Minus',
    accentColor: '#18181b',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)',
    description:
      'Gaya visual minimalis menyingkirkan ornamen berlebih untuk menonjolkan tipografi, spasi lega, dan garis batas tipis berpresisi tinggi.',
    keyFeatures: [
      'Palet monokrom netral dengan kontras teks tajam',
      'Border hairline 1px dan elevasi bayangan minimal',
      'Fokus penuh pada keterbacaan dan hierarki konten',
      'Transisi halus tanpa efek distorsi visual'
    ],
    designTokens: [
      { name: '--surface', value: '#ffffff', description: 'Permukaan putih bersih' },
      { name: '--border', value: '#e4e4e7', description: 'Garis batas hairline netral' },
      { name: '--radius', value: '8px', description: 'Kelengkungan sudut halus' },
      { name: '--primary', value: '#18181b', description: 'Aksen utama zinc gelap' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kartu bersih dengan border hairline', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-surface-subtle', description: 'Permukaan sekunder abu-abu sangat muda', example: '<div class="mfs-surface-subtle">...</div>' }
    ]
  },

  brutalism: {
    id: 'brutalism',
    name: 'Neubrutalism',
    tagline: 'Bold Outlines, Hard Offset Shadows, and Raw Contrast',
    badge: 'High Contrast',
    icon: 'Square',
    accentColor: '#dc2626',
    previewBg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
    description:
      'Neubrutalism memadukan garis batas hitam tebal, bayangan offset solid tanpa blur, dan blok warna cerah berenergi tinggi.',
    keyFeatures: [
      'Border solid tebal 2px–3px dengan kontras maksimal',
      'Hard offset shadow tanpa blur yang tegas',
      'Sudut tajam atau radius kecil yang geometris',
      'Efek tekan fisik menggeser posisi elemen ke arah bayangan'
    ],
    designTokens: [
      { name: '--surface', value: '#ffffff', description: 'Permukaan kontras tinggi' },
      { name: '--border', value: '#09090b', description: 'Garis batas hitam pekat' },
      { name: '--radius', value: '4px', description: 'Sudut tegas bergaya cetak' },
      { name: '--primary', value: '#facc15', description: 'Aksen kuning elektrik brutalist' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kartu dengan outline tebal dan hard shadow', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-interactive', description: 'Interaksi tekan menggeser offset shadow', example: '<button class="mfs-interactive">Click</button>' }
    ]
  },

  bento: {
    id: 'bento',
    name: 'Bento Grid',
    tagline: 'Modular Rounded Tiles and Balanced Spatial Rhythm',
    badge: 'Modular UI',
    icon: 'LayoutGrid',
    accentColor: '#2563eb',
    previewBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    description:
      'Terinspirasi dari kotak bento modular, gaya ini mengutamakan kartu seragam bersudut membulat halus, jarak konsisten, dan aksen biru modern.',
    keyFeatures: [
      'Sistem tile modular dengan proporsi rapi',
      'Bayangan sangat halus dengan border tipis',
      'Permukaan terang yang nyaman untuk dashboard padat data',
      'Tipografi modern dengan bobot seimbang'
    ],
    designTokens: [
      { name: '--surface', value: '#ffffff', description: 'Tile putih bersih' },
      { name: '--surface-subtle', value: '#f8fafc', description: 'Latar kanvas bento' },
      { name: '--radius', value: '16px', description: 'Kelengkungan tile khas bento' },
      { name: '--primary', value: '#2563eb', description: 'Biru modern berenergi' }
    ],
    utilityClasses: [
      { className: '.mfs-grid', description: 'Grid responsif otomatis untuk tile bento', example: '<div class="mfs-grid">...</div>' },
      { className: '.mfs-card', description: 'Tile bento dengan padding proporsional', example: '<div class="mfs-card">...</div>' }
    ]
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    tagline: 'Neon HUD Glows and Futuristic Dark Surfaces',
    badge: 'Neon HUD',
    icon: 'Zap',
    accentColor: '#ec4899',
    previewBg: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #3b0764 100%)',
    description:
      'Tema futuristik gelap dengan garis batas neon cyan/magenta, efek pendar cahaya elektrik, dan kontras tinggi bergaya antarmuka HUD.',
    keyFeatures: [
      'Latar gelap pekat dengan aksen neon cyan & magenta',
      'Glow shadow elektrik pada status aktif dan hover',
      'Sudut tajam berpresisi teknis',
      'Tipografi monospace untuk elemen data & kode'
    ],
    designTokens: [
      { name: '--surface', value: '#111827', description: 'Panel HUD gelap' },
      { name: '--border', value: 'rgba(34, 211, 238, 0.35)', description: 'Garis neon cyan' },
      { name: '--radius', value: '4px', description: 'Sudut tajam futuristik' },
      { name: '--primary', value: '#ec4899', description: 'Magenta neon elektrik' }
    ],
    utilityClasses: [
      { className: '.mfs-surface', description: 'Permukaan HUD gelap dengan border neon', example: '<div class="mfs-surface">...</div>' },
      { className: '.mfs-shadow', description: 'Efek pendar neon pada elemen interaktif', example: '<div class="mfs-shadow">...</div>' }
    ]
  },

  retro: {
    id: 'retro',
    name: 'Retro 90s',
    tagline: 'Classic Desktop Bevels and Pixel-Sharp Nostalgia',
    badge: 'Classic OS',
    icon: 'Monitor',
    accentColor: '#000080',
    previewBg: 'linear-gradient(135deg, #d4d0c8 0%, #c0c0c0 100%)',
    description:
      'Menghadirkan kembali estetika desktop klasik era 90-an dengan permukaan abu-abu sistem, bevel 3D tajam 2-warna, dan sudut 0px.',
    keyFeatures: [
      'Bevel 3D klasik (highlight putih kiri-atas, shadow gelap kanan-bawah)',
      'Sudut tajam 0px–2px yang autentik',
      'Palet abu-abu sistem #c0c0c0 dengan aksen biru klasik',
      'Efek tekan cekung klasik pada tombol dan tab'
    ],
    designTokens: [
      { name: '--surface', value: '#d4d0c8', description: 'Permukaan sistem klasik' },
      { name: '--border', value: '#808080', description: 'Garis tepi bevel gelap' },
      { name: '--radius', value: '0px', description: 'Sudut kotak murni era 90-an' },
      { name: '--primary', value: '#000080', description: 'Biru klasik titlebar' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel dialog klasik berbingkai bevel', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-inset', description: 'Field cekung bevel terbalik untuk input', example: '<input class="mfs-inset" />' }
    ]
  },

  swiss: {
    id: 'swiss',
    name: 'Swiss Style',
    tagline: 'International Typographic Grid and Bold Red Accents',
    badge: 'Grid Discipline',
    icon: 'Grid',
    accentColor: '#dc2626',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
    description:
      'Mengikuti tradisi desain grafis Swiss International: grid ketat, bidang putih bersih, garis pemisah tegas, dan aksen merah ikonik.',
    keyFeatures: [
      'Disiplin grid asimetris dan tipografi sans-serif kuat',
      'Sudut siku 0px dengan garis batas tegas',
      'Kontras hitam-putih murni dipadu merah sinyal',
      'Hierarki informasi editorial yang sangat terstruktur'
    ],
    designTokens: [
      { name: '--surface', value: '#ffffff', description: 'Bidang kertas putih bersih' },
      { name: '--border', value: '#171717', description: 'Garis grid tegas' },
      { name: '--radius', value: '0px', description: 'Geometri siku tanpa radius' },
      { name: '--primary', value: '#dc2626', description: 'Merah sinyal Swiss' }
    ],
    utilityClasses: [
      { className: '.mfs-grid', description: 'Tata letak grid terstruktur', example: '<div class="mfs-grid">...</div>' },
      { className: '.mfs-border', description: 'Garis pemisah grid presisi', example: '<div class="mfs-border">...</div>' }
    ]
  },

  skeuomorphism: {
    id: 'skeuomorphism',
    name: 'Skeuomorphism',
    tagline: 'Rich Physical Textures and Specular Depth',
    badge: 'Physical Depth',
    icon: 'Box',
    accentColor: '#0284c7',
    previewBg: 'linear-gradient(135deg, #e5e7eb 0%, #cbd5e1 100%)',
    description:
      'Skeuomorphism meniru material fisik nyata melalui gradasi permukaan halus, kilau spekular di tepi atas, dan bayangan realistis.',
    keyFeatures: [
      'Gradasi linear halus meniru logam brushed & plastik glossy',
      'Highlight spekular 1px di tepi atas komponen',
      'Shadow multi-layer untuk kedalaman fisik realistis',
      'Kontrol input cekung dengan kedalaman terukur'
    ],
    designTokens: [
      { name: '--surface', value: '#f1f5f9', description: 'Permukaan metalik halus' },
      { name: '--border', value: '#cbd5e1', description: 'Bingkai bezel tipis' },
      { name: '--radius', value: '10px', description: 'Kelengkungan perangkat fisik' },
      { name: '--primary', value: '#0284c7', description: 'Biru glossy klasik' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel fisik dengan kilau tepi atas', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-interactive', description: 'Tombol fisik dengan feedback tekan', example: '<button class="mfs-interactive">Press</button>' }
    ]
  },

  'liquid-glass': {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    tagline: 'Fluid Specular Refractions and Translucent Depth',
    badge: 'Liquid Optics',
    icon: 'Droplets',
    accentColor: '#38bdf8',
    previewBg: 'radial-gradient(circle at 18% 20%, #1e3a8a 0%, #0b1020 58%, #881337 100%)',
    description:
      'Terinspirasi oleh optik kaca cair modern dengan pembiasan spekular lembut, saturasi latar belakang tinggi, dan sudut kapsul yang mengalir organik.',
    keyFeatures: [
      'Backdrop blur intensif dengan saturasi warna latar tinggi',
      'Highlight tepi spekular putih lembut menyerupai kaca cair',
      'Sudut membulat besar dengan transisi elastis halus',
      'Kontras teks tajam di atas permukaan semi-transparan'
    ],
    designTokens: [
      { name: '--surface', value: 'rgba(255, 255, 255, 0.08)', description: 'Lapisan kaca cair bening ultra-translusen' },
      { name: '--backdrop-blur', value: 'blur(14px) saturate(210%) contrast(1.08) brightness(1.08)', description: 'Pembiasan optik lensa cair berintensitas tinggi' },
      { name: '--radius', value: '24px', description: 'Kelengkungan organik kaca cair' },
      { name: '--primary', value: '#2563eb', description: 'Biru kobalt spekular' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel kaca cair dengan highlight spekular', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-surface', description: 'Permukaan translusen adaptif', example: '<div class="mfs-surface">...</div>' }
    ]
  },

  'material-you': {
    id: 'material-you',
    name: 'Material You',
    tagline: 'Dynamic Tonal Palettes and Expressive Pill Shapes',
    badge: 'Adaptive Tonal',
    icon: 'Palette',
    accentColor: '#6750a4',
    previewBg: 'linear-gradient(135deg, #f3edf7 0%, #eaddff 55%, #d0bcff 100%)',
    description:
      'Mengadopsi sistem warna tonal dinamis Material Design 3 dengan kontainer kapsul ekspresif, elevasi tonal lembut, dan aksen ungu lavender yang harmonis.',
    keyFeatures: [
      'Palet tonal harmonis antara permukaan utama dan kontainer',
      'Bentuk pil dan sudut membulat besar khas Material 3',
      'Elevasi permukaan berbasis warna tonal, bukan bayangan berat',
      'State layer halus pada interaksi hover dan tekan'
    ],
    designTokens: [
      { name: '--surface', value: '#fef7ff', description: 'Permukaan tonal dasar' },
      { name: '--surface-subtle', value: '#f3edf7', description: 'Kontainer tonal sekunder' },
      { name: '--radius', value: '16px', description: 'Kelengkungan kontainer ekspresif' },
      { name: '--primary', value: '#6750a4', description: 'Aksen primer Material You' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kontainer tonal dengan elevasi lembut', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-pill', description: 'Bentuk kapsul khas komponen aksi Material 3', example: '<button class="mfs-pill">Action</button>' }
    ]
  },

  terminal: {
    id: 'terminal',
    name: 'Terminal CLI',
    tagline: 'Monospace Phosphor Glow and Raw Console Precision',
    badge: 'CRT Console',
    icon: 'Terminal',
    accentColor: '#22c55e',
    previewBg: 'linear-gradient(135deg, #020617 0%, #052e16 60%, #0a0a0a 100%)',
    description:
      'Antarmuka bergaya konsol UNIX dan monitor fosfor hijau klasik dengan tipografi monospace penuh, sudut tajam 0px, dan garis batas matriks tegas.',
    keyFeatures: [
      'Tipografi monospace menyeluruh untuk kesan CLI autentik',
      'Latar hitam pekat dengan aksen hijau fosfor terang',
      'Sudut tajam 0px tanpa radius',
      'Glow tipis pada status aktif dan fokus keyboard'
    ],
    designTokens: [
      { name: '--surface', value: '#090d0b', description: 'Layar konsol gelap' },
      { name: '--border', value: 'rgba(34, 197, 94, 0.35)', description: 'Garis batas matriks hijau' },
      { name: '--radius', value: '0px', description: 'Geometri kotak murni terminal' },
      { name: '--primary', value: '#22c55e', description: 'Hijau fosfor klasik' }
    ],
    utilityClasses: [
      { className: '.mfs-surface', description: 'Panel konsol gelap berbingkai matriks', example: '<div class="mfs-surface">...</div>' },
      { className: '.mfs-font-mono', description: 'Tipografi monospace bergaya terminal', example: '<code class="mfs-font-mono">$ mfs</code>' }
    ]
  },

  'hand-drawn': {
    id: 'hand-drawn',
    name: 'Hand-Drawn',
    tagline: 'Organic Sketch Borders and Playful Paper Charm',
    badge: 'Sketchbook UI',
    icon: 'PenTool',
    accentColor: '#ea580c',
    previewBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 55%, #fde68a 100%)',
    description:
      'Menghadirkan nuansa buku sketsa dan gambar tangan di atas kertas hangat dengan garis tepi tinta organik, bayangan arsiran solid, dan aksen oranye hangat.',
    keyFeatures: [
      'Garis batas tinta gelap bergaya sketsa tangan',
      'Latar kertas krem hangat yang ramah mata',
      'Bayangan offset solid ringan seperti coretan pena',
      'Bentuk sudut asimetris yang terasa natural'
    ],
    designTokens: [
      { name: '--surface', value: '#fffdf7', description: 'Kertas sketsa krem hangat' },
      { name: '--border', value: '#292524', description: 'Garis tinta sketsa gelap' },
      { name: '--radius', value: '12px', description: 'Kelengkungan organik sketsa' },
      { name: '--primary', value: '#ea580c', description: 'Aksen tinta oranye hangat' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kartu bergaya kotak sketsa tangan', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-border', description: 'Garis tepi tinta ekspresif', example: '<div class="mfs-border">...</div>' }
    ]
  },

  'y2k-chrome': {
    id: 'y2k-chrome',
    name: 'Y2K Chrome',
    tagline: 'Metallic Iridescence and Early-2000s Gloss',
    badge: 'Millennium Gloss',
    icon: 'Disc',
    accentColor: '#3b82f6',
    previewBg: 'linear-gradient(135deg, #e2e8f0 0%, #bfdbfe 45%, #f5d0fe 100%)',
    description:
      'Estetika milenium awal tahun 2000-an yang memadukan permukaan metalik krom perak, kilau spekular biru elektrik, dan gradasi plastik glossy futuristik.',
    keyFeatures: [
      'Gradasi metalik krom perak dengan kilau tepi tajam',
      'Aksen biru elektrik dan sentuhan iridescent pastel',
      'Bevel glossy modern yang memantulkan cahaya',
      'Sudut kapsul dan kontainer bergaya pemutar media 2000-an'
    ],
    designTokens: [
      { name: '--surface', value: '#f1f5f9', description: 'Permukaan krom perak terang' },
      { name: '--border', value: '#94a3b8', description: 'Bingkai metalik mengilap' },
      { name: '--radius', value: '14px', description: 'Kelengkungan perangkat era Y2K' },
      { name: '--primary', value: '#3b82f6', description: 'Biru hiperlink milenium' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel krom metalik dengan kilau tepi', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-interactive', description: 'Tombol glossy dengan feedback pantulan', example: '<button class="mfs-interactive">Play</button>' }
    ]
  },

  bauhaus: {
    id: 'bauhaus',
    name: 'Bauhaus',
    tagline: 'Primary Color Geometry and Modernist Balance',
    badge: 'Geometric Art',
    icon: 'Shapes',
    accentColor: '#dc2626',
    previewBg: 'linear-gradient(135deg, #fefce8 0%, #fee2e2 50%, #dbeafe 100%)',
    description:
      'Terinspirasi oleh aliran desain Bauhaus Jerman: bentuk geometris murni, garis hitam tegas, sudut tajam 0px, dan kombinasi warna primer merah, biru, kuning.',
    keyFeatures: [
      'Disiplin geometri murni dengan sudut siku 0px',
      'Garis batas hitam tebal berstruktur arsitektural',
      'Palet warna primer klasik di atas latar kanvas hangat',
      'Bayangan blok geometris tanpa blur'
    ],
    designTokens: [
      { name: '--surface', value: '#fffef9', description: 'Kanvas kertas arsitektural' },
      { name: '--border', value: '#18181b', description: 'Garis struktur hitam tegas' },
      { name: '--radius', value: '0px', description: 'Sudut geometris murni' },
      { name: '--primary', value: '#dc2626', description: 'Merah primer Bauhaus' }
    ],
    utilityClasses: [
      { className: '.mfs-grid', description: 'Grid geometris proporsional', example: '<div class="mfs-grid">...</div>' },
      { className: '.mfs-card', description: 'Blok konten berbingkai arsitektural', example: '<div class="mfs-card">...</div>' }
    ]
  },

  'pixel-art': {
    id: 'pixel-art',
    name: 'Pixel Art',
    tagline: '8-Bit Arcade Crispness and Stepped Retro Blocks',
    badge: '8-Bit Arcade',
    icon: 'Gamepad2',
    accentColor: '#ff9e64',
    previewBg: 'linear-gradient(135deg, #1a1c2c 0%, #29366f 100%)',
    description:
      'Menghidupkan pesona gim arkade 8-bit dengan latar malam biru gelap, sudut 0px tajam, bayangan blok tanpa blur, dan aksen oranye piksel retro.',
    keyFeatures: [
      'Sudut 0px murni tanpa anti-aliasing lengkung',
      'Latar biru malam #1a1c2c dengan permukaan #29366f',
      'Tipografi monospace berkarakter konsol retro',
      'Efek tekan instan ala tombol arkade klasik'
    ],
    designTokens: [
      { name: '--bg', value: '#1a1c2c', description: 'Latar belakang malam arkade 8-bit' },
      { name: '--surface', value: '#29366f', description: 'Panel dialog 8-bit biru gelap' },
      { name: '--radius', value: '0px', description: 'Sudut kotak piksel murni' },
      { name: '--primary', value: '#ff9e64', description: 'Oranye arkade klasik' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kotak dialog 8-bit berbingkai piksel', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-interactive', description: 'Tombol arkade dengan offset tekan', example: '<button class="mfs-interactive">Start</button>' }
    ]
  },

  'aurora-gradient': {
    id: 'aurora-gradient',
    name: 'Aurora Gradient',
    tagline: 'Northern Lights Glow and Velvet Dark Glass',
    badge: 'Aurora Mesh',
    icon: 'Waves',
    accentColor: '#2dd4bf',
    previewBg: 'radial-gradient(circle at 15% 20%, #0f766e 0%, #1e1b4b 50%, #090d16 100%)',
    description:
      'Tema gelap atmosferik yang memadukan pendar warna aurora borealis (teal, emerald, indigo) di atas panel kaca gelap beludru dengan kedalaman lembut.',
    keyFeatures: [
      'Latar gelap malam dipadu pendar gradasi aurora teal-indigo',
      'Permukaan kaca gelap dengan backdrop blur halus',
      'Aksen bercahaya teal-emerald yang menenangkan mata',
      'Border tipis bercahaya untuk pemisahan hierarki'
    ],
    designTokens: [
      { name: '--surface', value: 'rgba(15, 23, 42, 0.72)', description: 'Panel kaca gelap aurora' },
      { name: '--border', value: 'rgba(45, 212, 191, 0.25)', description: 'Garis cahaya teal tipis' },
      { name: '--radius', value: '16px', description: 'Sudut lembut mengalir' },
      { name: '--primary', value: '#2dd4bf', description: 'Teal aurora bercahaya' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Kartu kaca gelap dengan aksen aurora', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-surface', description: 'Permukaan translusen malam', example: '<div class="mfs-surface">...</div>' }
    ]
  },

  vaporwave: {
    id: 'vaporwave',
    name: 'Vaporwave',
    tagline: 'Synthwave Neon Grids and Sunset Retrowave Vibes',
    badge: 'Synthwave 84',
    icon: 'Sunset',
    accentColor: '#f472b6',
    previewBg: 'linear-gradient(135deg, #2e1065 0%, #701a75 50%, #be185d 100%)',
    description:
      'Estetika synthwave dan vaporwave era 80-an dengan langit ungu tua, neon pink-cyan elektrik, dan nuansa retro-futuristik yang penuh gaya.',
    keyFeatures: [
      'Palet ungu gelap dipadu neon pink magenta dan cyan',
      'Pendar cahaya neon lembut pada border dan elemen aktif',
      'Kontras dramatis untuk dashboard kreatif dan media player',
      'Nuansa nostalgia kaset VHS dan matahari terbenam digital'
    ],
    designTokens: [
      { name: '--surface', value: 'rgba(30, 11, 54, 0.85)', description: 'Panel ungu synthwave gelap' },
      { name: '--border', value: 'rgba(244, 114, 182, 0.4)', description: 'Garis neon pink elektrik' },
      { name: '--radius', value: '6px', description: 'Sudut retro-futuristik' },
      { name: '--primary', value: '#f472b6', description: 'Neon pink vaporwave' }
    ],
    utilityClasses: [
      { className: '.mfs-surface', description: 'Permukaan gelap berbingkai neon pink', example: '<div class="mfs-surface">...</div>' },
      { className: '.mfs-shadow', description: 'Efek pendar cahaya synthwave', example: '<div class="mfs-shadow">...</div>' }
    ]
  },

  manga: {
    id: 'manga',
    name: 'Manga',
    tagline: 'Stark Ink Panels, Screentone Contrast, and Comic Punch',
    badge: 'Ink & Panel',
    icon: 'BookOpen',
    accentColor: '#e11d48',
    previewBg: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 60%, #e4e4e7 100%)',
    description:
      'Terinspirasi oleh panel komik manga Jepang: tinta hitam pekat di atas kertas putih murni, bayangan offset tegas tanpa blur, dan aksen merah crimson dramatis.',
    keyFeatures: [
      'Kontras hitam-putih murni bergaya tinta komik',
      'Border panel tebal 2px dengan sudut siku 0px–2px',
      'Hard offset shadow dramatis khas panel aksi',
      'Aksen merah crimson untuk penekanan elemen interaktif'
    ],
    designTokens: [
      { name: '--surface', value: '#ffffff', description: 'Kertas halaman manga putih' },
      { name: '--border', value: '#09090b', description: 'Garis tinta panel hitam pekat' },
      { name: '--radius', value: '2px', description: 'Sudut panel komik tajam' },
      { name: '--primary', value: '#e11d48', description: 'Merah crimson dramatis' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel komik berbingkai tinta tebal', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-interactive', description: 'Tombol panel aksi dengan hard shadow', example: '<button class="mfs-interactive">Read</button>' }
    ]
  },

  '3d-glassmorphism': {
    id: '3d-glassmorphism',
    name: '3D Glassmorphism',
    tagline: '3D Extruded Glass Slabs with Iridescent Edges over Glassmorphism',
    badge: '3D Glass Slab',
    icon: 'Box',
    accentColor: '#38bdf8',
    previewBg: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    description:
      'Evolusi Glassmorphism dengan slab kaca 3D terekstrusi, bevel tepi iridesen cyan-violet, dan efek tekan kedalaman interaktif.',
    keyFeatures: [
      'Basis backdrop Glassmorphism gelap dengan saturasi kaca lebih tajam',
      'Slab kaca 3D terekstrusi dengan ketebalan tepi bawah & kanan terlihat',
      'Bevel iridesen cyan-violet dan kilau spekular putih tajam',
      'Feedback hover angkat & tekan 3D yang responsif'
    ],
    designTokens: [
      { name: '--surface', value: 'rgba(255, 255, 255, 0.10)', description: 'Lapisan slab kaca 3D translusen' },
      { name: '--backdrop-blur', value: 'blur(24px) saturate(165%)', description: 'Blur kaca 3D berintensitas tinggi' },
      { name: '--radius', value: '20px', description: 'Kelengkungan sudut slab kaca 3D' },
      { name: '--primary', value: '#38bdf8', description: 'Biru cyan spekular' }
    ],
    utilityClasses: [
      { className: '.mfs-card', description: 'Panel kaca 3D dengan bevel iridesen', example: '<div class="mfs-card">...</div>' },
      { className: '.mfs-surface', description: 'Permukaan kaca kosmik dengan inner glow', example: '<div class="mfs-surface">...</div>' }
    ]
  }
}

export const DARK_THEMES = new Set<ThemeType>([
  'glass',
  'cyberpunk',
  'liquid-glass',
  '3d-glassmorphism',
  'terminal',
  'pixel-art',
  'aurora-gradient',
  'vaporwave'
])

export const isDarkTheme = (id: ThemeType): boolean => DARK_THEMES.has(id)
