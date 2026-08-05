# SiHEDAF — Web Platform Pemantau Sinyal PPG & Deteksi Dini Risiko Stroke

![SiHEDAF Logo](public/logo.png)

**SiHEDAF** (Sistem Pemantauan PPG & Deteksi Dini Atrial Fibrillation) adalah antarmuka web modern yang terhubung dengan perangkat *wearable* (smartwatch) pemantau sinyal Photoplethysmogram (PPG). Platform ini dirancang untuk membantu pengguna melakukan pemantauan kesehatan jantung secara mandiri dan mendeteksi dini risiko **Atrial Fibrillation (AF)** serta potensi risiko stroke.

---

## 📌 Garis Besar Proyek

Penyakit kardiovaskular dan stroke sering kali terjadi tanpa gejala awal yang disadari. SiHEDAF hadir sebagai solusi berbasis teknologi terpadu yang memadukan perangkat pemantau sinyal PPG dengan dasbor antarmuka web intuitif. 

Aplikasi ini menyajikan visualisasi data PPG secara *real-time*, mendeteksi anomali ritme jantung, serta memberikan riwayat analisis kesehatan yang dapat diakses pengguna maupun tenaga medis secara cepat dan akurat.

---

## ✨ Fitur Utama

### 1. 🌐 Landing Page & Edukasi Kesehatan (`/`)
* **Hero Section Interactive**: Tampilan visual smartwatch dengan grafik sinyal jantung responsif.
* **Edukasi & Kesadaran Stroke**: Informasi ancaman stroke, faktor risiko, dan pentingnya pemantauan sinyal PPG.
* **Penjelasan Fitur & Cara Kerja**: Alur kerja pemantauan dari sensor *wearable* hingga analisis dashboard.
* **Navigasi Lengkap**: Akses cepat menuju halaman Tentang, Fitur, Cara Kerja, Tim Kami, serta Autentikasi.

### 2. 👥 Halaman Tim Pengembang (`/tim-kami`)
* Kartu profil tim pengembang dan peneliti di balik proyek SiHEDAF.

### 3. 🔐 Autentikasi & Penyambungan Perangkat
* **Masuk & Daftar (`/login`, `/register`)**: Halaman autentikasi dengan tata letak *split-screen* yang elegan, validasi formulir (Zod + React Hook Form), dan proteksi tombol kata sandi.
* **Penyambungan Perangkat (`/hubungkan-perangkat`)**: Alur penyambungan *smartwatch* via input **Device ID**.

### 4. 📊 Dasbor Pemantauan Real-time (`/dashboard`)
* **Visualisasi Sinyal PPG Live**: Grafik gelombang PPG animasi dinamis berbasis SVG lokal tanpa dependensi *chart library* eksternal.
* **Kontrol Monitoring**: Tombol **Play / Pause** untuk memulai atau menjeda tampilan grafik secara *live*.
* **Rentang Waktu Monitoring**: Pilihan durasi analisis (3 menit, 6 menit, 12 menit, dan 30 menit).
* **Indikator Status Kesehatan**: Penanda status hasil analisis terakhir (misal: *Normal* atau *Risiko AF*) lengkap dengan skor indikator.
* **Status Perangkat Wearable**: Informasi konektivitas *wearable*, persentase baterai, dan waktu sinkronisasi terakhir.
* **Notification Rail (Side Drawer)**: Panel notifikasi samping yang dapat dibuka dan ditutup fleksibel.
* **Sidebar Responsif**: Sidebar desktop yang dapat diciutkan (*collapsible*) serta *off-canvas drawer* untuk perangkat *mobile*.

### 5. 📜 Riwayat Analisis PPG (`/riwayat`)
* **Filter Tanggal Interaktif**: *Calendar range picker* berbasis `@daypicker/react` bertema SiHEDAF untuk menyaring riwayat berdasarkan rentang waktu.
* **Pagination & Item Limit**: Pengaturan jumlah baris per halaman (6, 10, 20 item) dan navigasi halaman.

### 6. 👤 Pengaturan Profil & Akun (`/profil`, `/profil/ubah`)
* **Informasi Akun**: Tampilan identitas pengguna dan status perangkat terhubung.
* **Ubah Profil**: Pembaruan nama, email, dan unggah foto profil (dengan pratinjau foto).
* **Modal Keamanan & Akun**: Modal ubah kata sandi dengan validasi serta modal konfirmasi *logout*.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

* **Framework Utama**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Library UI & Logika**: [React 19](https://react.dev/), [React DOM 19](https://react.dev/)
* **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/postcss`
* **Tipografi**: Font *Switzer Variable* (Self-hosted lokal)
* **Ikon**: [Lucide React](https://lucide.dev/)
* **Form & Validasi**: React Hook Form & Zod
* **Komponen Penunjang**: `@daypicker/react` (Calendar Range Picker), `sonner` (Toast Notifications)
* **Testing**: Node.js Native Test Runner (`npm test`)

---

## 🚀 Panduan Instalasi & Penggunaan

### 📋 Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terpasang:
* **Node.js**: versi `20.x` atau yang lebih baru
* **npm**: versi `10.x` atau yang lebih baru (bisa juga menggunakan `pnpm`, `yarn`, atau `bun`)

### 1. Clone Repository
```bash
git clone https://github.com/hauzanrafiattallah/SiHEDAF-FE.git
cd sihedaf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env` (atau `.env.local`):
```bash
cp .env.example .env
```
Sesuaikan konfigurasi URL API backend jika diperlukan:
```env
SIHEDAF_API_BASE_URL=http://localhost:8000/api
```

### 4. Jalankan Server Pengembangan (Development)
```bash
npm run dev
```
Buka peramban (browser) dan akses **`http://localhost:3000`**.

---

## 📜 Perintah yang Tersedia (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Next.js dengan Turbopack |
| `npm run build` | Membuat *production build* aplikasi |
| `npm start` | Menjalankan server produksi dari hasil build |
| `npm run lint` | Menjalankan ESLint untuk mengecek kualitas dan format kode |
| `npm test` | Menjalankan pengujian otomatis (*unit & contract tests*) |

---

## 📁 Struktur Direktori Utama

```text
sihedaf/
├── public/                # Asset statis (logo, gambar smartwatch, icon)
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (dashboard)/   # Route group untuk halaman aplikasi/dashboard
│   │   ├── login/         # Halaman masuk
│   │   ├── register/      # Halaman pendaftaran
│   │   ├── hubungkan-perangkat/
│   │   ├── tim-kami/      # Halaman profil tim
│   │   └── fonts/         # Self-hosted Switzer Variable font
│   ├── components/        # Komponen React reusable
│   │   ├── auth/          # Komponen formulir & layout autentikasi
│   │   ├── dashboard/     # Shell dashboard, grafik PPG, modal & navbar
│   │   ├── sections/      # Komponen section landing page
│   │   └── ui/            # UI Primitives
│   ├── features/          # Service layer & domain logic (Device, User, dsb.)
│   └── tests/             # Source-contract & unit tests
├── package.json           # File konfigurasi dependensi & npm scripts
└── README.md              # Dokumentasi proyek
```

---

## 🧪 Pengujian (Testing)

Proyek ini dilengkapi dengan pengujian otomatis berbasis Node.js native test runner untuk memastikan stabilitas komponen, alur navigasi, dan desain sistem:

```bash
npm test
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk pengembangan sistem **SiHEDAF**. Seluruh hak cipta dilindungi.
