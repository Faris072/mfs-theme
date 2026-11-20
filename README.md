# MFS Theme 🎨

> Dynamic Multi-Theme Vue 3 UI Library (Claymorphism, Glassmorphism, Neumorphism) with interactive documentation.

## ✨ Fitur Utama

- 🍭 **Multi-Theme Engine**: Claymorphism (3D inflated), Glassmorphism (Frosted glass blur), & Neumorphism (Soft UI).
- 🧩 **Vue 3 Components**: Button, Card, Input, Badge, Switch, Modal.
- 📱 **Fully Responsive**: Siap digunakan di desktop, tablet, maupun mobile.
- 📦 **NPM Ready**: Dikonfigurasi dengan Vite Library Mode & TypeScript declaration bundle (`dist/`).
- 📖 **Interactive Docs**: Demo website terintegrasi dengan pemilih tema langsung.

## 🚀 Instalasi & Setup Lokal

```bash
cd mfs-theme
npm install
npm run dev
```

Buka browser di URL lokal yang muncul (default: `http://localhost:5173`).

---

## 📦 Build untuk NPM

Untuk membangun bundle library yang siap didaftarkan ke npm:

```bash
npm run build:lib
```

Hasil build akan berada di folder `dist/`:
- `dist/mfs-theme.js` (ES Module)
- `dist/mfs-theme.umd.cjs` (UMD)
- `dist/index.d.ts` (TypeScript types)
- `dist/style.css` (CSS library)

### Cara Publikasi ke NPM:
1. Pastikan sudah login di npm:
   ```bash
   npm login
   ```
2. Jalankan publikasi:
   ```bash
   npm publish --access public
   ```

---

## 🛠 Penggunaan di Project Lain

Setelah terinstall dari npm:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import ThemePlugin from 'mfs-theme'
import 'mfs-theme/style.css'

const app = createApp(App)
app.use(ThemePlugin, { defaultTheme: 'clay' })
app.mount('#app')
```

### Di Template Vue:

```vue
<template>
  <Card title="Halo Dunia" subtitle="Contoh kartu Claymorphism">
    <Input v-model="name" label="Nama" placeholder="Ketik nama..." />
    <Button variant="primary" @click="greet">Klik Saya</Button>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('')
const greet = () => alert(`Halo ${name.value}!`)
</script>
```

---

## 🎨 Struktur Folder

```
mfs-theme/
├── src/
│   ├── lib/                  # SOURCE LIBRARY UI (yang dipublish ke NPM)
│   │   ├── components/       # Button, Card, Input, dll
│   │   ├── composables/      # useTheme.ts
│   │   ├── themes/           # clay.css, glass.css, neo.css, index.css
│   │   └── index.ts          # Entry point plugin Vue
│   ├── App.vue               # Dokumentasi interaktif & theme selector
│   └── main.ts               # Entry point website dokumentasi
├── vite.config.ts            # Config untuk dev & website dokumentasi
├── vite.lib.config.ts        # Config untuk build library NPM
└── package.json
```
