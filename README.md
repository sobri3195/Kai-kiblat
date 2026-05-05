# kai-kiblat
Aplikasi web React + Vite untuk menentukan arah kiblat dari lokasi mana saja.

## Fitur utama
- Geolocation API: getCurrentPosition + watchPosition.
- Kompas DeviceOrientation API (iOS requestPermission didukung).
- Hitung bearing kiblat dan jarak ke Ka'bah.
- Peta OpenStreetMap (React Leaflet), marker lokasi user + Ka'bah + garis kiblat.
- Input manual koordinat + pencarian lokasi (Nominatim, debounce).
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
