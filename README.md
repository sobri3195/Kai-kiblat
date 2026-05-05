# kai-kiblat

Aplikasi web React + Vite untuk menentukan arah kiblat dari lokasi mana saja. Aplikasi ini menggabungkan GPS, input koordinat manual, pencarian lokasi, kompas perangkat, dan peta OpenStreetMap agar pengguna tetap bisa mendapat arah kiblat meski salah satu sensor tidak tersedia.

## Fitur utama

- Geolocation API untuk mengambil dan memantau lokasi GPS dengan status akurasi.
- Kompas DeviceOrientation API dengan dukungan izin iOS dan status sensor.
- Perhitungan bearing kiblat, arah relatif terhadap hadap perangkat, dan jarak ke Ka'bah.
- Peta OpenStreetMap (React Leaflet) berisi marker lokasi pengguna, marker Ka'bah, dan garis kiblat.
- Input manual koordinat dengan validasi latitude/longitude.
- Pencarian kota/alamat via Nominatim dengan debounce, loading state, dan pesan error.
- Penyimpanan lokasi terakhir di `localStorage` agar aplikasi tetap informatif saat GPS belum aktif.
- PWA installable dengan vite-plugin-pwa.
- Siap deploy ke Vercel (HTTPS).

## Menjalankan lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy Vercel

- Framework: Vite
- Build command: `npm run build`
- Output: `dist`

## Catatan

- Fitur lokasi/kompas butuh HTTPS atau localhost.
- Sensor kompas tiap HP bisa berbeda dan perlu kalibrasi angka delapan.
- Jika kompas tidak tersedia, gunakan derajat kiblat dari utara + peta.
- Untuk keputusan ibadah, cocokkan juga dengan penanda kiblat masjid setempat jika tersedia.
