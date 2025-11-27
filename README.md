Post Analytics Dashboard
Aplikasi dashboard analitik berbasis React untuk menganalisis dan memvisualisasikan data post dari JSONPlaceholder API.

## Teknologi yang Digunakan
- Framework Frontend: React 18
- Styling: Tailwind CSS
- Chart: Chart.js dengan react-chartjs-2
- Peta: Leaflet dengan react-leaflet
- Ekspor Data: SheetJS (xlsx)
- Ikon: Heroicons
- API: JSONPlaceholder

## Instalasi & Setup
Prasyarat :
Node.js (v14 atau lebih tinggi)
`npm atau yarn`

Langkah Instalasi :

1. Clone repository

`git clone <repository-url>`
`cd post-analytics-dashboard`
`Install dependencies`
`npm install`

2. Jalankan server development
`npm start`

## Struktur Proyek

src/
├── components/
│   ├── Chart1Widget.js      # Chart bar - Distribusi post
│   ├── Chart2Widget.js      # Chart line - Aktivitas user
│   ├── DataTableWidget.js   # Tabel data dengan pencarian & ekspor
│   ├── MapWidget.js         # Komponen peta interaktif
│   └── Sidebar.js          # Sidebar navigasi
├── App.js                  # Komponen aplikasi utama
└── assets/
    └── logopa.png          # Logo aplikasi

## Fitur
1. Komponen Chart

a. Chart1Widget (Post Distribution)

- Chart bar menunjukkan jumlah post per user
- Desain responsif dengan styling custom
- Loading state dan error handling

b. Chart2Widget (Aktivitas User)

- Chart line perbandingan aktivitas User 1 vs User 2
- Visualisasi post kumulatif over time
- Tooltip

2. Komponen Tabel Data

Fitur Lanjutan:

- Pencarian real-time di semua kolom
- Pagination dengan item per halaman yang bisa disesuaikan

Fungsi ekspor Excel:

- Ekspor semua data yang difilter
- Ekspor halaman saat ini saja
- Desain tabel responsif
- Loading state

3. Komponen Peta

Fitur Interaktif:

- Multiple base layer (Street Map, Satellite)
- Marker pin custom dengan popup
- Fungsi pencarian lokasi
- Display koordinat saat klik
- Kontrol zoom custom
- Fitur reset view

4. Navigasi

Fitur Sidebar:

- Section menu yang bisa collapse
- Indikator state aktif
- Desain responsif
- Branding Logo 

## Styling & Desain

- Framework: Tailwind CSS untuk utility-first styling
- Design System: Palette warna dan spacing yang konsisten
- Components: Chart dan widget dengan styling custom
- Responsive: Layout mobile-friendly

Selengkapnya di Figma..

## Integrasi API

- Aplikasi menggunakan JSONPlaceholder API:
- Endpoint: https://jsonplaceholder.typicode.com/posts
- Data: Sample data post untuk demonstrasi
- Fitur: Real HTTP requests dengan error handling

## Library yang harus di install

React & Core
`npm install react react-dom react-scripts`

Chart & Visualisasi
`npm install chart.js react-chartjs-2`

Peta & Geolokasi
`npm install leaflet react-leaflet`

Tabel & Data
`npm install xlsx sheetjs-style`

Icons
`npm install @heroicons/react`

Dev Dependencies (jika diperlukan)
`npm install --save-dev tailwindcss postcss autoprefixer`

Berikut adalah contoh package.json yang lengkap:

json
{
  "name": "post-analytics-dashboard",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "xlsx": "^0.18.5",
    "sheetjs-style": "^0.0.2",
    "@heroicons/react": "^2.0.18"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14"
  }
}

Setelah instalasi selesai, jalankan:
`npm start`

Aplikasi akan berjalan di http://localhost:3000