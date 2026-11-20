import type { ThemeType } from '../lib/composables/useTheme'

export type { ThemeType }

export interface ComponentItem {
  id: string
  name: string
  category: 'Action' | 'Forms' | 'Surfaces' | 'Feedback' | 'Navigation'
  status: 'Ready' | 'Planned' | 'In Progress'
  description: string
  snippet: string
}

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
  components: ComponentItem[]
}

export const THEMES_DATA: Record<ThemeType, ThemeDetailInfo> = {
  clay: {
    id: 'clay',
    name: 'Claymorphism',
    tagline: '3D Inflated Soft Touch and Tactile Volume',
    badge: 'Tactile Volume',
    icon: 'Layers',
    accentColor: '#6366f1',
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol claymorphism dengan varian warna, tactile elevation, loading state, dan ripple.',
        snippet: '<Button variant="primary" size="md">Klik Saya</Button>'
      },
      {
        id: 'input',
        name: 'Input',
        category: 'Forms',
        status: 'Ready',
        description: 'Input text dengan permukaan inset sunken 3D, pesan validasi, dan label floating.',
        snippet: '<Input v-model="text" label="Nama Pengguna" placeholder="Masukkan nama..." />'
      },
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Wadah konten clay 3D dengan slot header, footer, dan opsi hover tactile.',
        snippet: '<Card title="Judul Kartu" subtitle="Deskripsi">\n  Konten di sini\n</Card>'
      },
      {
        id: 'badge',
        name: 'Badge',
        category: 'Feedback',
        status: 'Ready',
        description: 'Label status pill dengan warna pastel cerah dan aksen clay shadow mikro.',
        snippet: '<Badge variant="success" size="sm">Aktif</Badge>'
      },
      {
        id: 'switch',
        name: 'Switch',
        category: 'Forms',
        status: 'Ready',
        description: 'Toggle switch tactile seperti tuas empuk dengan animasi smooth sliding.',
        snippet: '<Switch v-model="enabled" label="Aktifkan Fitur" />'
      },
      {
        id: 'modal',
        name: 'Modal',
        category: 'Feedback',
        status: 'Ready',
        description: 'Dialog popup dengan backdrop blur dan kontainer clay melayang di atas viewport.',
        snippet: '<Modal v-model="showModal" title="Detail Konfirmasi">\n  Isi Modal\n</Modal>'
      },
      {
        id: 'avatar',
        name: 'Avatar',
        category: 'Surfaces',
        status: 'Planned',
        description: 'Foto profil berbentuk gelembung 3D dengan indikator status kehadiran.',
        snippet: '<Avatar src="/avatar.png" size="lg" status="online" />'
      },
      {
        id: 'tabs',
        name: 'Tabs',
        category: 'Navigation',
        status: 'Planned',
        description: 'Tab bar dengan sliding indicator bubble yang mengikuti tab aktif.',
        snippet: '<Tabs v-model="activeTab" :items="[\'Ikhtisar\', \'Pengaturan\']" />'
      },
      {
        id: 'dropdown',
        name: 'Dropdown',
        category: 'Action',
        status: 'Planned',
        description: 'Menu popover clay mengambang untuk daftar pilihan aksi lanjutan.',
        snippet: '<Dropdown :options="actions" @select="handleAction" />'
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        category: 'Forms',
        status: 'Planned',
        description: 'Kotak centang empuk 3D dengan icon ceklis dinamis.',
        snippet: '<Checkbox v-model="agree" label="Saya setuju dengan S&K" />'
      },
      {
        id: 'navbar',
        name: 'Navbar',
        category: 'Navigation',
        status: 'In Progress',
        description: 'Header navigasi responsif dengan integrasi theme switcher bawaan.',
        snippet: '<Navbar brand="My App" :sticky="true" />'
      },
      {
        id: 'toast',
        name: 'Toast',
        category: 'Feedback',
        status: 'In Progress',
        description: 'Notifikasi mengambang dengan animasi kenyal ala bubble clay.',
        snippet: '<Toast variant="success" message="Data berhasil disimpan!" />'
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        category: 'Feedback',
        status: 'Planned',
        description: 'Petunjuk hover bubble clay dengan sudut membulat dan elevasi lembut.',
        snippet: '<Tooltip text="Informasi tambahan">Hover saya</Tooltip>'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol kaca transparan dengan efek hover neon glow dan pantulan tepi.',
        snippet: '<Button variant="primary">Luncurkan</Button>'
      },
      {
        id: 'input',
        name: 'Input',
        category: 'Forms',
        status: 'Ready',
        description: 'Input form transparan dengan garis fokus neon cyber.',
        snippet: '<Input v-model="token" label="API Key" placeholder="sk-..." />'
      },
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Panel kartu kaca buram dengan pemisah konten bercahaya.',
        snippet: '<Card title="Metrik Server" subtitle="Status Realtime">\n  Data grafis\n</Card>'
      },
      {
        id: 'badge',
        name: 'Badge',
        category: 'Feedback',
        status: 'Ready',
        description: 'Tag translucent dengan border tipis dan teks glow kontras tinggi.',
        snippet: '<Badge variant="success">Online</Badge>'
      },
      {
        id: 'switch',
        name: 'Switch',
        category: 'Forms',
        status: 'Ready',
        description: 'Saklar toggle kaca dengan indikator lampu neon aktif.',
        snippet: '<Switch v-model="dark" label="Mode Malam" />'
      },
      {
        id: 'modal',
        name: 'Modal',
        category: 'Feedback',
        status: 'Ready',
        description: 'Popup kaca elegan dengan efek latar belakang blur pekat.',
        snippet: '<Modal v-model="open" title="Autentikasi Kaca">\n  Konten\n</Modal>'
      },
      {
        id: 'avatar',
        name: 'Avatar',
        category: 'Surfaces',
        status: 'Planned',
        description: 'Avatar dengan ring kaca neon yang berputar pelan.',
        snippet: '<Avatar src="/user.jpg" size="lg" status="online" />'
      },
      {
        id: 'tabs',
        name: 'Tabs',
        category: 'Navigation',
        status: 'Planned',
        description: 'Tab kaca dengan highlight border cahaya berjalan.',
        snippet: '<Tabs v-model="tab" :items="[\'Metrics\', \'Logs\']" />'
      },
      {
        id: 'dropdown',
        name: 'Dropdown',
        category: 'Action',
        status: 'Planned',
        description: 'Menu tarik-turun kaca berlapis dengan efek frost.',
        snippet: '<Dropdown :options="items" />'
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        category: 'Forms',
        status: 'Planned',
        description: 'Kotak pilihan kaca dengan centang neon menyala.',
        snippet: '<Checkbox v-model="check" label="Tetap Masuk" />'
      },
      {
        id: 'navbar',
        name: 'Navbar',
        category: 'Navigation',
        status: 'In Progress',
        description: 'Dock navigasi kaca mengambang dengan backdrop-filter ultra jernih.',
        snippet: '<Navbar brand="GlassUI" />'
      },
      {
        id: 'toast',
        name: 'Toast',
        category: 'Feedback',
        status: 'In Progress',
        description: 'Notifikasi kaca frost mengambang dengan aksen border neon.',
        snippet: '<Toast variant="success" message="Koneksi terenkripsi aktif!" />'
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        category: 'Feedback',
        status: 'Planned',
        description: 'Petunjuk hover kaca mini dengan font kontras tajam.',
        snippet: '<Tooltip text="Informasi rahasia">Hover saya</Tooltip>'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol terangkat (extruded) yang bertransisi menjadi inset saat ditekan.',
        snippet: '<Button variant="primary">Kirim Perintah</Button>'
      },
      {
        id: 'input',
        name: 'Input',
        category: 'Forms',
        status: 'Ready',
        description: 'Field teks yang terukir ke dalam permukaan kanvas dengan bayangan dalam presisi.',
        snippet: '<Input v-model="code" label="Kode Keamanan" />'
      },
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Kartu material monokromatik dengan relief timbul yang halus.',
        snippet: '<Card title="Panel Kontrol">\n  Pengaturan perangkat\n</Card>'
      },
      {
        id: 'badge',
        name: 'Badge',
        category: 'Feedback',
        status: 'Ready',
        description: 'Tag indikator timbul dengan cekungan lembut di sekelilingnya.',
        snippet: '<Badge variant="primary">Standby</Badge>'
      },
      {
        id: 'switch',
        name: 'Switch',
        category: 'Forms',
        status: 'Ready',
        description: 'Saklar toggle fisik dalam alur rel cekung dengan knob timbul licin.',
        snippet: '<Switch v-model="power" label="Daya Mesin" />'
      },
      {
        id: 'modal',
        name: 'Modal',
        category: 'Feedback',
        status: 'Ready',
        description: 'Dialog timbul tebal yang muncul mulus dari bidang layar.',
        snippet: '<Modal v-model="visible" title="Konfigurasi">\n  Formulir\n</Modal>'
      },
      {
        id: 'avatar',
        name: 'Avatar',
        category: 'Surfaces',
        status: 'Planned',
        description: 'Foto profil yang diletakkan dalam cincin cekung neumorphic.',
        snippet: '<Avatar src="/photo.jpg" />'
      },
      {
        id: 'tabs',
        name: 'Tabs',
        category: 'Navigation',
        status: 'Planned',
        description: 'Navigasi tab dengan status aktif berubah menjadi cekung.',
        snippet: '<Tabs v-model="selected" :items="[\'Suara\', \'Tampilan\']" />'
      },
      {
        id: 'dropdown',
        name: 'Dropdown',
        category: 'Action',
        status: 'Planned',
        description: 'Daftar pilihan timbul dengan pemisah elevasi halus.',
        snippet: '<Dropdown :options="options" />'
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        category: 'Forms',
        status: 'Planned',
        description: 'Kotak ceklis cekung dengan tanda aktif timbul.',
        snippet: '<Checkbox v-model="checked" label="Simpan Preferensi" />'
      },
      {
        id: 'navbar',
        name: 'Navbar',
        category: 'Navigation',
        status: 'In Progress',
        description: 'Bilah navigasi horizontal dengan tombol timbul terintegrasi.',
        snippet: '<Navbar brand="NeoUI" />'
      },
      {
        id: 'toast',
        name: 'Toast',
        category: 'Feedback',
        status: 'In Progress',
        description: 'Notifikasi soft UI timbul yang muncul halus dari tepi layar.',
        snippet: '<Toast variant="success" message="Pengaturan berhasil disimpan!" />'
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        category: 'Feedback',
        status: 'Planned',
        description: 'Balon info timbul yang muncul dengan elevasi lembut.',
        snippet: '<Tooltip text="Panduan instrumen">Hover</Tooltip>'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol monokrom tegas dengan feedback hover halus.',
        snippet: '<Button variant="primary">Simpan</Button>'
      },
      {
        id: 'input',
        name: 'Input',
        category: 'Forms',
        status: 'Ready',
        description: 'Field input datar dengan garis batas fokus presisi.',
        snippet: '<Input v-model="text" label="Email" />'
      }
    ]
  },

  brutalism: {
    id: 'brutalism',
    name: 'Neubrutalism',
    tagline: 'Bold Outlines, Hard Offset Shadows, and Raw Contrast',
    badge: 'High Contrast',
    icon: 'Square',
    accentColor: '#facc15',
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol bold dengan outline pekat dan hard drop shadow.',
        snippet: '<Button variant="primary">Execute</Button>'
      },
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Kontainer blok tegas untuk menonjolkan konten utama.',
        snippet: '<Card title="Alert">Konten</Card>'
      }
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
    ],
    components: [
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Tile modular untuk metrik, ringkasan, dan widget.',
        snippet: '<Card title="Analytics">...</Card>'
      },
      {
        id: 'data-view',
        name: 'DataView',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Penyaji koleksi dalam grid bento responsif.',
        snippet: '<DataView :value="items" layout="grid" />'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol neon dengan pendar glow saat hover.',
        snippet: '<Button variant="primary">Initialize</Button>'
      },
      {
        id: 'terminal',
        name: 'Terminal',
        category: 'Feedback',
        status: 'Ready',
        description: 'Konsol perintah interaktif bergaya cyber HUD.',
        snippet: '<Terminal prompt="sys@cyber:~$" />'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol bevel klasik dengan animasi tekan cekung.',
        snippet: '<Button variant="primary">OK</Button>'
      },
      {
        id: 'modal',
        name: 'Modal',
        category: 'Feedback',
        status: 'Ready',
        description: 'Jendela dialog desktop klasik.',
        snippet: '<Modal v-model="open" title="System">...</Modal>'
      }
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
    ],
    components: [
      {
        id: 'card',
        name: 'Card',
        category: 'Surfaces',
        status: 'Ready',
        description: 'Blok konten editorial dengan garis tegas.',
        snippet: '<Card title="01 / Index">...</Card>'
      },
      {
        id: 'tabs',
        name: 'Tabs',
        category: 'Navigation',
        status: 'Ready',
        description: 'Navigasi tab garis lurus bergaya indeks cetak.',
        snippet: '<Tabs v-model="tab" :items="items" />'
      }
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
    ],
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Action',
        status: 'Ready',
        description: 'Tombol glossy dengan kilau atas dan bayangan dasar.',
        snippet: '<Button variant="primary">Confirm</Button>'
      },
      {
        id: 'switch',
        name: 'Switch',
        category: 'Forms',
        status: 'Ready',
        description: 'Sakelar fisik dengan tuas menonjol realistis.',
        snippet: '<Switch v-model="on" label="Power" />'
      }
    ]
  }
}
