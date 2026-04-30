# NutriBlocks PWA

NutriBlocks adalah aplikasi Progressive Web App (PWA) berbasis React untuk melacak nutrisi dan kesehatan. Proyek ini dibangun menggunakan Vite, React, dan Tailwind CSS.

## Persyaratan (Prerequisites)

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru direkomendasikan)
- `npm` (biasanya sudah terinstal bersama Node.js)

## Cara Setup dan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda:

1. **Buka Terminal / Command Prompt** dan pastikan Anda berada di direktori proyek (`Nutribloks_kasar-1`).
2. **Instal dependensi** dengan menjalankan perintah berikut:
   ```bash
   npm install
   ```
   *Perintah ini akan mengunduh semua library yang dibutuhkan (seperti React, Vite, Tailwind CSS, dll) yang tercantum di `package.json`.*

## Menjalankan Aplikasi Secara Lokal (Development)

Setelah proses instalasi selesai, Anda dapat menjalankan aplikasi dalam mode pengembangan (development mode) dengan perintah:

```bash
npm run dev
```

Jika berhasil, terminal akan menampilkan output seperti ini:
```
  VITE v7.3.1  ready in 443 ms

  ➜  Local:   http://localhost:5173/
```

**Buka browser Anda** dan kunjungi alamat `http://localhost:5173/` untuk melihat aplikasinya.

> **Catatan:** Jika Anda sebelumnya melihat `exit code: 1`, itu biasanya karena terminal ditutup (dihentikan paksa). Anda dapat menjalankan ulang perintah `npm run dev` kapan saja.

## Membangun untuk Produksi (Build)

Jika Anda ingin membangun aplikasi untuk keperluan produksi (deploy ke server), jalankan perintah:

```bash
npm run build
```
Perintah ini akan melakukan pengecekan tipe data TypeScript dan menghasilkan file statis yang siap dideploy di dalam folder `dist/`.

## Teknologi Utama
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Ikon:** Lucide React
- **Komponen UI:** Shadcn UI (Radix UI)
