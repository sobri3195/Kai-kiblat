# Fitur yang Masih Kurang

Dokumen ini merangkum ide fitur yang belum tersedia atau masih bisa ditingkatkan pada aplikasi **kai-kiblat**. Versi ini tidak hanya menjadi roadmap, tetapi juga menjadi catatan implementasi untuk fitur akurasi yang mulai dibuat di aplikasi.

## Ringkasan kondisi saat ini

Aplikasi sudah memiliki fondasi utama penunjuk kiblat: GPS, input koordinat manual, pencarian lokasi, kompas perangkat, perhitungan arah dan jarak ke Ka'bah, peta OpenStreetMap, penyimpanan lokasi terakhir, serta dukungan PWA. Pengembangan berikutnya difokuskan pada peningkatan kepercayaan akurasi, pengalaman saat koneksi lemah, kemudahan berbagi hasil, dan bantuan saat sensor perangkat bermasalah.

## Fitur yang sudah mulai diimplementasikan

| Fitur | Status | Catatan |
| --- | --- | --- |
| Indikator tingkat kepercayaan arah kiblat | Selesai tahap awal | Aplikasi menghitung skor dari lokasi, akurasi GPS, sumber lokasi, heading, dan status kompas. |
| Checklist akurasi | Selesai tahap awal | Pengguna mendapat daftar kondisi yang perlu dipenuhi sebelum memakai hasil. |
| Panduan kalibrasi kompas | Selesai tahap awal | Aplikasi menampilkan langkah memegang HP mendatar, gerakan angka delapan, dan menjauhi benda magnet/logam. |
| Riwayat lokasi | Selesai tahap awal | Lokasi GPS, manual, dan pencarian disimpan terbatas di `localStorage` agar bisa dipilih ulang. |
| Bagikan hasil kiblat | Selesai tahap awal | Pengguna bisa memakai Web Share API atau menyalin hasil ke clipboard bila browser mendukung. |

## Prioritas fitur yang masih disarankan

| Prioritas | Fitur yang kurang | Alasan | Dampak untuk pengguna |
| --- | --- | --- | --- |
| Tinggi | Mode offline yang lebih lengkap | PWA sudah tersedia, tetapi pencarian lokasi dan tile peta tetap bergantung internet. | Aplikasi tetap berguna saat sinyal lemah, terutama dengan lokasi terakhir dan instruksi derajat kiblat. |
| Tinggi | Validasi sensor kompas lebih dalam | Indikator awal sudah ada, tetapi belum mendeteksi perubahan heading ekstrem dalam rentang waktu tertentu. | Pengguna lebih cepat tahu kapan kompas sedang terlalu liar untuk dipakai. |
| Sedang | Favorit lokasi bernama | Riwayat sudah ada, tetapi belum bisa memberi nama seperti Rumah, Kantor, Hotel, atau Masjid. | Lokasi penting lebih mudah dipilih tanpa melihat koordinat. |
| Sedang | Panduan troubleshooting izin browser | Pesan error sudah ada, tetapi belum ada halaman bantuan per browser/perangkat. | Pengguna lebih mudah mengaktifkan GPS/kompas di Android, iOS, Chrome, Safari, dan browser lain. |
| Sedang | Dukungan tema gelap | Antarmuka belum menyediakan pilihan tema gelap. | Lebih nyaman dipakai malam hari atau di dalam masjid. |
| Rendah | Multi-bahasa | Aplikasi saat ini berbahasa Indonesia. | Bisa menjangkau pengguna non-Indonesia. |
| Rendah | Widget/shortcut PWA | PWA sudah installable, tetapi belum ada shortcut cepat seperti “Gunakan lokasi saya”. | Aplikasi terasa lebih native ketika dipasang ke homescreen. |
| Rendah | Mode edukasi arah kiblat | Belum ada penjelasan visual lengkap tentang bearing, heading, dan arah relatif. | Pengguna baru lebih mudah memahami arti angka derajat. |

## Rekomendasi MVP berikutnya

Paket yang paling berdampak adalah **Paket Akurasi & Kepercayaan**. Tahap awal paket ini sudah dibuat melalui:

1. Indikator kualitas kompas: aktif, belum stabil, atau belum tersedia.
2. Indikator kualitas lokasi berdasarkan akurasi GPS dan sumber lokasi.
3. Label sederhana: `Siap dipakai`, `Perlu cek ulang`, atau `Gunakan derajat dari utara`.
4. Checklist singkat sebelum pengguna memakai hasil: lokasi tersedia, akurasi cukup, kompas terbaca, dan sensor stabil.

Tahap lanjutan yang disarankan adalah menambahkan deteksi stabilitas heading berbasis beberapa sampel sensor agar aplikasi bisa memberi peringatan ketika nilai kompas meloncat terlalu jauh.

## Catatan implementasi lanjutan

- **Mode offline** dapat dimulai dari fallback yang menampilkan lokasi terakhir, bearing terakhir, dan instruksi tanpa memuat pencarian/peta.
- **Favorit lokasi** dapat memperluas riwayat lokasi dengan field nama dan tombol pin/favorit.
- **Validasi kompas lanjutan** dapat menyimpan beberapa heading terakhir lalu menghitung variasi derajat.
- **Troubleshooting izin** dapat dibuat sebagai panel bantuan yang berubah sesuai status `GPS perlu HTTPS`, `Lokasi ditolak`, `Kompas tidak tersedia`, atau `Izin kompas ditolak`.

## Urutan pengerjaan yang disarankan

1. Mode offline fallback untuk PWA.
2. Favorit lokasi bernama.
3. Validasi stabilitas heading berbasis sampel sensor.
4. Halaman bantuan izin browser/perangkat.
5. Tema gelap dan peningkatan aksesibilitas.
6. Shortcut PWA dan mode edukasi arah kiblat.
