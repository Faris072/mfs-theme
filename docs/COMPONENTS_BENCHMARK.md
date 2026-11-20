# Checklist & Benchmark Komponen UI (Referensi: OpenVue)

Dokumen ini berfungsi sebagai **benchmark acuan dan checklist pengayaan komponen** untuk library UI multi-tema (`mfs-theme`). 

---

## 📋 Pedoman & Standar Implementasi
1. **Target Minimal**: Kelengkapan variasi komponen minimal setara dengan katalog OpenVue (`openvue.dev`).
2. **Aturan Penamaan**: Nama komponen **seragam dan bersih tanpa prefix** (contoh: `<Button>`, `<Input>`, `<Card>`, `<Modal>`).
3. **Multi-Theme Adaptability**: Logika komponen (props, emits, accessibility) adalah satu sumber kode, sedangkan tampilan visual beradaptasi 100% mengikuti tema aktif (`Claymorphism`, `Glassmorphism`, `Neumorphism`).
4. **Responsif**: Setiap komponen wajib fleksibel dan berfungsi sempurna di layar mobile (touch friendly) hingga desktop.
5. **Prinsip Eksekusi**: Pengerjaan dilakukan bertahap berdasarkan prioritas fase. Selesaikan per fase secara terpadu.

---

## 🎯 Fase 1: Komponen Dasar (Core / In Progress)
Komponen pondasi utama yang sudah siap dan terintegrasi di sistem tema.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Button` | `Action` | Tombol aksi serbaguna dengan tactile feedback | Variants (`primary`, `secondary`, `surface`, `danger`), Sizes (`sm`, `md`, `lg`), state loading, disabled, & press ripple/glow |
| ✅ | `Input` | `Forms` | Field input teks standar dengan status interaktif | Floating label, hint text, validasi error state, clearable, & sunken/inset depth |
| ✅ | `Card` | `Surfaces` | Kontainer permukaan konten modular | Slot `header`, `body`, `footer`, opsi `hoverable`, tactile elevation & radius adaptif |
| ✅ | `Badge` | `Feedback` | Indikator status dan label informasi ringkas | Varian semantik (`success`, `warning`, `danger`), bentuk pill, & dot presence |
| ✅ | `Switch` | `Forms` | Toggle switch aktif/nonaktif bergaya fisik | Animasi sliding knob mulus, track timbul/cekung, label klik, dan v-model boolean |
| ✅ | `Modal` | `Overlays` | Dialog popup terisolasi dengan backdrop blur | Backdrop blur adaptif, animasi pop-in, tombol escape, dan responsive mobile sheet |

---

## 📌 Fase 2: Form & Input Lanjutan
Input kontrol untuk formulir kompleks dan manipulasi data interaktif.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Textarea` | `Forms` | Kolom input teks multibaris | Auto-resize vertikal, counter karakter, & inset border focus |
| ✅ | `InputNumber` | `Forms` | Input numerik presisi dengan stepper | Tombol spinner (+ / -), batas min-max, format desimal/mata uang |
| ✅ | `Password` | `Forms` | Input kata sandi dengan kontrol keamanan | Tombol toggle intip (eye icon) & bar visual meter kekuatan sandi |
| ✅ | `Checkbox` | `Forms` | Kotak pilihan ganda dengan status tri-state | Checked, unchecked, indeterminate, & transisi ceklis kenyal |
| ✅ | `RadioButton` | `Forms` | Pemilih opsi tunggal eksklusif | Lingkaran timbul dengan titik indikator timbul di tengah |
| ✅ | `Select` / `Dropdown` | `Forms` | Menu tarik-turun dengan opsi pencarian | Searchable filter, virtual scrolling untuk opsi banyak, & custom slot |
| ✅ | `MultiSelect` | `Forms` | Pilihan banyak nilai sekaligus | Chip tags tersemat di kolom input, batch selection, & select all |
| ✅ | `Slider` | `Forms` | Penggeser rentang nilai visual | Handle empuk 3D, dual handle untuk range (min-max), & tooltip nilai |
| ✅ | `Rating` | `Forms` | Penilaian bintang interaktif | Bintang 1-5, setengah bintang (fractional), & readonly state |
| ✅ | `ColorPicker` | `Forms` | Pemilih warna visual | Palet warna popover, hex/rgb input, & preset swatch |
| ✅ | `DatePicker` | `Forms` | Kalender pemilih tanggal & waktu | Kalender popover, range tanggal, transisi bulan, & mobile touch |

---

## 📌 Fase 3: Display & Permukaan Konten
Komponen untuk menyajikan struktur data dan aset media secara estetis.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Avatar` | `Surfaces` | Foto profil pengguna / avatar inisial | Gambar bundar/kurva 3D, inisial otomatis, & status badge kehadiran |
| ✅ | `Chip` / `Tag` | `Display` | Label kecil interaktif | Opsi tombol hapus (x), ikon prepend, dan status klik aktif |
| ✅ | `Divider` | `Layout` | Garis batas pemisah visual | Orientasi horizontal/vertikal dengan teks label di tengah |
| ✅ | `Accordion` | `Surfaces` | Panel lipat-buka (*collapse/expand*) | Transisi tinggi mulus, multiple open mode, & icon chevron rotasi |
| ✅ | `Timeline` | `Display` | Alur kronologis aktivitas atau status pengiriman | Garis vertikal bertekstur, dot penanda status, dan timestamp |
| ✅ | `Carousel` | `Media` | Slider penampil gambar dan kartu | Swipe sentuhan mobile, auto-play opsional, & indikator titik navigasi |
| ✅ | `Image` | `Media` | Penampil gambar dengan fitur pembesar | Placeholder loading blur, fallback error, dan modal preview fullscreen |

---

## 📌 Fase 4: Feedback, Notifikasi & Overlays
Komponen interaksi dinamis di atas kanvas antarmuka utama.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Toast` | `Feedback` | Notifikasi melayang mengambang (*snackbar*) | Auto-dismiss timer, stack list di pojok layar, suara/haptic ringan |
| ✅ | `Alert` / `Message` | `Feedback` | Banner pengumuman penting kontekstual | 4 status semantik (Info, Success, Warning, Danger) & close button |
| ✅ | `Tooltip` | `Feedback` | Balon info mikro saat kursor hover/fokus | Posisi dinamis (top, bottom, left, right) dengan arrow pembias |
| ✅ | `Drawer` / `Sidebar` | `Overlays` | Panel geser keluar dari sisi layar | Geser dari kiri/kanan, backdrop dismiss, cocok untuk menu mobile |
| ✅ | `Popover` | `Overlays` | Wadah konten mengambang fleksibel | Terkait pada elemen penekan (*anchor element*) tanpa modal blocking |
| ✅ | `Skeleton` | `Feedback` | Bayangan pemuatan (*placeholder shimmer*) | Pola teks, lingkaran, dan kotak dengan efek shimmer tema |
| ✅ | `ProgressBar` | `Feedback` | Bilah kemajuan proses | Persentase nilai, indikator animasi berdenyut, dan warna status |
| ✅ | `ProgressSpinner` | `Feedback` | Ikon putar pemuatan konten | Ring putar halus dengan aksen warna tema |
| ✅ | `ConfirmDialog` | `Overlays` | Dialog persetujuan cepat berantai | Berbasis fungsi promise `confirm({ title, message, onAccept })` |

---

## 📌 Fase 5: Navigasi
Komponen penunjuk arah dan struktur penjelajahan aplikasi.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Navbar` | `Navigation` | Bilah header atas aplikasi responsif | Brand area, menu link, tombol tema, & drawer toggle smartphone |
| ✅ | `Tabs` | `Navigation` | Bar perpindahan tab antar tampilan | Sliding highlight indicator yang mengikuti tab aktif secara mulus |
| ✅ | `Breadcrumb` | `Navigation` | Jejak hierarki navigasi halaman | Separator slash/chevron dengan link aktif dan leaf item statis |
| ✅ | `Pagination` | `Navigation` | Kontrol halaman data bernomor | Tombol prev/next, dropdown jumlah baris per halaman, jump to page |
| ✅ | `Steps` / `Stepper` | `Navigation` | Penunjuk langkah formulir bertahap | Indikator lingkaran bernomor (1 → 2 → 3) dengan status selesai/aktif |
| ✅ | `ContextMenu` | `Navigation` | Menu aksi klik kanan | Menyesuaikan koordinat klik mouse dengan tampilan popover |
| ✅ | `ScrollTop` | `Navigation` | Tombol lompat kembali ke atas halaman | Muncul otomatis setelah melewati scroll threshold tertentu |

---

## 📌 Fase 6: Data Grid & Kumpulan Data Masif
Tampilan dan manipulasi tabel data skala besar.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `DataTable` | `Data` | Tabel data komprehensif | Sorting kolom, filtering teks, seleksi baris, dan responsive card mode |
| ✅ | `DataView` | `Data` | Tampilan layout katalog (Grid ⇄ List) | Toggle tata letak kartu produk atau daftar baris horizontal |
| ✅ | `Tree` | `Data` | Struktur hirarki bercabang | Expand/collapse node bercabang, checkbox seleksi, dan custom slot |

---

## 📌 Fase 7: Input & Form Spesialis
Kontrol form lanjutan untuk skenario input terstruktur, label adaptif, dan editor teks.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `AutoComplete` | `Forms` | Input teks dengan saran pencarian dinamis | Filter async/sync, navigasi keyboard, & dukungan multiple chips |
| ✅ | `Cascader` | `Forms` | Pemilih opsi hierarkis bertingkat | Panel kolom bertingkat, jalur label penuh, & clearable |
| ✅ | `TreeSelect` | `Forms` | Dropdown pemilih node dari struktur pohon | Integrasi seleksi tunggal/banyak & expand node di popover |
| ✅ | `Knob` | `Forms` | Kontrol putar nilai numerik melingkar | Drag mouse/sentuhan, tombol +/- opsional, & skala min-max |
| ✅ | `SelectButton` | `Forms` | Kelompok tombol pemilih opsi tunggal/jamak | Segmented tactile buttons dengan state aktif adaptif tema |
| ✅ | `ToggleButton` | `Forms` | Tombol tekan dua keadaan (*on/off*) | Ikon & label dinamis berdasarkan status aktif |
| ✅ | `InputOtp` | `Forms` | Kolom input kode verifikasi OTP per digit | Auto-advance fokus, paste multi-digit, & mode masked |
| ✅ | `InputMask` | `Forms` | Input teks dengan pola format terstruktur | Masking karakter/angka (telepon, tanggal, kode) & slot karakter |
| ✅ | `InputGroup` | `Forms` | Wadah gabungan input dengan addon/tombol | Addon prefix/suffix teks, ikon, atau tombol aksi menyatu |
| ✅ | `IconField` | `Forms` | Pembungkus input dengan posisi ikon kiri/kanan | Slot `icon` & `default`, `iconPosition` (`left`/`right`), adaptif tema |
| ✅ | `Listbox` | `Forms` | Daftar pilihan langsung tanpa dropdown | Pencarian internal, seleksi tunggal/jamak, & keyboard nav |
| ✅ | `FloatLabel` | `Forms` | Pembungkus label mengambang adaptif | Transisi label naik saat fokus atau terisi nilai |
| ✅ | `IftaLabel` | `Forms` | Pembungkus label tersemat di atas nilai input | Label kompak di dalam kontainer border input |
| ✅ | `Editor` | `Forms` | Editor teks kaya (*rich text*) | Toolbar format (bold, italic, list, link) & output HTML |

---

## 📌 Fase 8: Tombol Aksi & Kontainer Tata Letak
Komponen tombol komposit dan panel pengatur ruang antarmuka.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `SplitButton` | `Action` | Tombol aksi utama dengan menu dropdown sekunder | Klik utama langsung jalan, panah membuka daftar aksi tambahan |
| ✅ | `SpeedDial` | `Action` | Tombol mengambang dengan menu radial/linear | Arah ekspansi (up, down, left, right, circle) & animasi stagger |
| ✅ | `Panel` | `Surfaces` | Kontainer konten dengan header & toggle lipat | Header aksi, mode toggleable (*collapse/expand*), & footer |
| ✅ | `Fieldset` | `Surfaces` | Pengelompokan form dengan legend terintegrasi | Legend timbul/border & opsi toggleable |
| ✅ | `Splitter` | `Layout` | Pembagi panel yang dapat diubah ukurannya | Drag gutter horizontal/vertikal, batas min-size, & layout persentase |
| ✅ | `Toolbar` | `Layout` | Bilah aksi horizontal tiga zona | Slot `start`, `center`, & `end` responsif |
| ✅ | `ScrollPanel` | `Layout` | Kontainer gulir dengan scrollbar kustom bertema | Scrollbar tipis adaptif tema & dukungan konten lebar/tinggi |
| ✅ | `Fluid` | `Layout` | Pembungkus agar komponen anak memenuhi lebar penuh | Menerapkan lebar `100%` secara konsisten ke komponen form |
| ✅ | `Deferred` | `Utilities` | Penunda render konten hingga masuk viewport | IntersectionObserver dengan placeholder slot sebelum tampil |

---

## 📌 Fase 9: Sistem Menu & Navigasi Lanjutan
Ragam menu hierarkis dan navigasi terstruktur untuk aplikasi kompleks.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `Menu` | `Navigation` | Daftar menu vertikal standar / popup | Submenu header, ikon item, shortcut badge, & mode popup |
| ✅ | `TieredMenu` | `Navigation` | Menu bertingkat dengan flyout submenu | Hover/klik membuka submenu bersarang ke samping |
| ✅ | `SlideMenu` | `Navigation` | Menu bertingkat dengan animasi geser horizontal | Navigasi maju/mundur antar level menu dengan tombol back |
| ✅ | `PanelMenu` | `Navigation` | Menu akordeon vertikal untuk sidebar | Ekspansi multi-level bertingkat dengan indikator panah |
| ✅ | `MegaMenu` | `Navigation` | Menu navigasi lebar penuh dengan grid kolom | Panel multi-kolom untuk kategori besar & mode responsif |
| ✅ | `Dock` | `Navigation` | Bilah ikon mengambang bergaya dock OS | Efek magnifikasi saat hover & posisi 4 sisi layar |
| ✅ | `TabMenu` | `Navigation` | Navigasi tab berbasis daftar rute/item | Indikator aktif, ikon, badge item, & dukungan keyboard |

---

## 📌 Fase 10: Data Lanjutan & Visualisasi Metrik
Manipulasi daftar interaktif, hierarki tabel, dan indikator kapasitas.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `OrderList` | `Data` | Daftar item yang dapat diurutkan ulang | Kontrol pindah atas/bawah/puncak/akhir & drag-drop |
| ✅ | `PickList` | `Data` | Pemindah item dua daftar (*source ↔ target*) | Transfer tunggal/semua, filter pencarian, & kontrol urutan |
| ✅ | `TreeTable` | `Data` | Tabel data dengan baris hierarki bercabang | Expand/collapse node, sorting kolom, & seleksi baris |
| ✅ | `OrganizationChart` | `Data` | Bagan struktur organisasi interaktif | Node bercabang, collapse subtree, & seleksi node |
| ✅ | `VirtualScroller` | `Data` | Daftar gulir virtual untuk ribuan baris data | Render hanya item terlihat (*windowing*) agar tetap ringan |
| ✅ | `MeterGroup` | `Data` | Bilah meter tersegmentasi multi-kategori | Label persentase, legenda warna, & orientasi horizontal/vertikal |
| ✅ | `Inplace` | `Display` | Tampilan teks statis yang berubah menjadi input saat klik | Mode edit inline dengan tombol simpan/batal atau auto-close |

---

## 📌 Fase 11: Media, Utilitas & Direktif
Komponen khusus, visualisasi grafik, unggah berkas, serta direktif inti Vue.

| Status | Nama Komponen | Kategori / Tag | Deskripsi Fungsional | Spesifikasi & Interaksi |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `ConfirmPopup` | `Overlays` | Popover konfirmasi ringkas tertaut ke target elemen | Terikat posisi pemicu dengan tombol terima/tolak |
| ✅ | `InlineMessage` | `Feedback` | Pesan status ringkas sebaris untuk validasi | 4 varian semantik (`info`, `success`, `warn`, `error`) dengan ikon |
| ✅ | `BlockUI` | `Overlays` | Penutup lapisan pemblokir interaksi area/halaman | Overlay blur/dimming dengan spinner/pesan saat proses |
| ✅ | `Galleria` | `Media` | Galeri foto dengan strip thumbnail & mode fullscreen | Navigasi panah, indikator titik, & auto-play opsional |
| ✅ | `FileUpload` | `Forms` | Pengunggah berkas drag-and-drop & daftar antrean | Validasi ukuran/ekstensi, preview gambar, & progress bar |
| ✅ | `Terminal` | `Utilities` | Konsol perintah interaktif bergaya terminal | Riwayat perintah, prompt kustom, & handler command |
| ✅ | `Chart` | `Data` | Visualisasi grafik SVG ringan multi-tipe | Dukungan `bar`, `line`, `pie`, `doughnut` dengan tooltip hover |
| ✅ | `vRipple` (`v-ripple`) | `Directives` | Efek riak sentuhan/klik pada elemen interaktif | Animasi gelombang radial adaptif tema saat pointerdown |
| ✅ | `vFocusTrap` (`v-focustrap`) | `Directives` | Pengunci fokus keyboard di dalam dialog/overlay | Menjaga Tab/Shift+Tab tetap berputar di dalam kontainer |
| ✅ | `vAnimateOnScroll` (`v-animateonscroll`) | `Directives` | Animasi masuk elemen saat terlihat di viewport | Menggunakan IntersectionObserver dengan kelas enter/leave |
| ✅ | `vStyleClass` (`v-styleclass`) | `Directives` | Pengalih kelas CSS elemen target saat klik | Toggle, add, atau remove class tanpa boilerplate JS |

---

## 📊 Ringkasan Metrik Benchmark
- **Total Item Acuan**: 91 Item (87 Komponen + 4 Direktif)
- **Fase 1 (Selesai)**: 6 Komponen (`Button`, `Input`, `Card`, `Badge`, `Switch`, `Modal`)
- **Fase 2 (Selesai)**: 11 Komponen (`Textarea`, `InputNumber`, `Password`, `Checkbox`, `RadioButton`, `Select`/`Dropdown`, `MultiSelect`, `Slider`, `Rating`, `ColorPicker`, `DatePicker`)
- **Fase 3 (Selesai)**: 7 Komponen (`Avatar`, `Chip`/`Tag`, `Divider`, `Accordion`, `Timeline`, `Carousel`, `Image`)
- **Fase 4 (Selesai)**: 9 Komponen (`Toast`, `Alert`/`Message`, `Tooltip`, `Drawer`/`Sidebar`, `Popover`, `Skeleton`, `ProgressBar`, `ProgressSpinner`, `ConfirmDialog`)
- **Fase 5 (Selesai)**: 7 Komponen (`Navbar`, `Tabs`, `Breadcrumb`, `Pagination`, `Steps`/`Stepper`, `ContextMenu`, `ScrollTop`)
- **Fase 6 (Selesai)**: 3 Komponen (`DataTable`, `DataView`, `Tree`)
- **Fase 7 (Selesai)**: 14 Komponen (`AutoComplete`, `Cascader`, `TreeSelect`, `Knob`, `SelectButton`, `ToggleButton`, `InputOtp`, `InputMask`, `InputGroup`, `IconField`, `Listbox`, `FloatLabel`, `IftaLabel`, `Editor`)
- **Fase 8 (Selesai)**: 9 Komponen (`SplitButton`, `SpeedDial`, `Panel`, `Fieldset`, `Splitter`, `Toolbar`, `ScrollPanel`, `Fluid`, `Deferred`)
- **Fase 9 (Selesai)**: 7 Komponen (`Menu`, `TieredMenu`, `SlideMenu`, `PanelMenu`, `MegaMenu`, `Dock`, `TabMenu`)
- **Fase 10 (Selesai)**: 7 Komponen (`OrderList`, `PickList`, `TreeTable`, `OrganizationChart`, `VirtualScroller`, `MeterGroup`, `Inplace`)
- **Fase 11 (Selesai)**: 11 Item (7 Komponen: `ConfirmPopup`, `InlineMessage`, `BlockUI`, `Galleria`, `FileUpload`, `Terminal`, `Chart`; 4 Direktif: `vRipple`, `vFocusTrap`, `vAnimateOnScroll`, `vStyleClass`)
- **Antrean**: 0 Item
