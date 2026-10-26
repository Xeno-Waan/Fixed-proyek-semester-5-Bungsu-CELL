# UI-GUIDELINE — BUNGSU CELL

**Versi:** v0.1.0  
**Status:** APPROVED  
**Tanggal persetujuan:** 2026-10-20  
**Referensi:** PRD Bungsu Cell v0.1.0

## 1. Prinsip Desain

- Modern futuristic SaaS dengan estetika retail technology.
- Mengutamakan keterbacaan dan efisiensi kerja kasir.
- Hijau muda dan kuning muda menjadi identitas visual.
- Warna gelap membentuk kontras dan hierarki.
- Semua halaman konsisten, responsif, dan dapat digunakan tanpa backend.

## 2. Design Tokens

### Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| brand-green | #E1F5D1 | Warna dominan navigasi dan panel identitas |
| brand-yellow | #FFF2B8 | Aksen dan aksi utama |
| deep-green | #183D2A | Teks utama, fokus, dan kontras |
| page-bg | #FBFCF8 | Latar halaman terang |
| surface | #FFFFFF | Kartu dan panel |
| text-muted | #647566 | Teks sekunder |
| success | #287A45 | Keberhasilan |
| warning | #A66B00 | Peringatan |
| danger | #B42318 | Kesalahan dan tindakan berisiko |
| border | #E1E8DE | Garis pembatas |

Warna status tidak boleh dibedakan melalui warna saja; gunakan teks atau ikon sebagai penanda tambahan.

### Tipografi
- Font utama: Inter atau sans-serif modern yang setara.
- Heading halaman: 24–30 px.
- Heading panel: 16–20 px.
- Body text: 14–16 px.
- Label dan metadata: 12–13 px.
- Angka finansial memakai format Rupiah dan perataan konsisten.

### Bentuk dan Spasi
- Radius kartu: 12–16 px.
- Radius kontrol: 8–10 px.
- Spasi berbasis kelipatan 4 px.
- Bayangan lembut dan border tipis.
- Hindari efek glow berlebihan, gradient dekoratif, dan animasi yang mengganggu.

## 3. Layout dan Navigasi

### Desktop
- Sidebar tetap di kiri dengan identitas Bungsu Cell.
- Header di atas berisi breadcrumb, judul halaman, notifikasi, dan profil simulasi.
- Area konten menggunakan grid responsif.
- Tabel dan grafik mendapat ruang utama yang memadai.

### Tablet
- Sidebar dapat dipersempit.
- Tabel mempertahankan kolom penting dan menyediakan scroll horizontal bila diperlukan.
- Form menggunakan dua kolom hanya jika ruang mencukupi.

### Mobile
- Navigasi diubah menjadi drawer atau menu ringkas.
- Form menggunakan satu kolom.
- Kartu statistik disusun bertumpuk atau dua kolom sesuai lebar layar.
- Aksi utama mudah dijangkau.
- Tidak boleh ada overflow horizontal pada seluruh halaman.

## 4. Komponen Standar

- Button: primary, secondary, outline, ghost, dan destructive.
- Input: text, number, currency, search, select, dan textarea.
- Select dan checkbox dengan label jelas.
- Card statistik dengan label, nilai, dan indikator perubahan bila tersedia.
- Data table dengan pencarian, filter, pagination, dan empty state.
- Badge untuk status servis, stok, dan transaksi.
- Modal atau drawer untuk detail dan konfirmasi tindakan.
- Toast untuk hasil aksi.
- Skeleton atau loading indicator jika diperlukan.
- Dialog konfirmasi untuk tindakan destruktif.

Semua komponen menggunakan token desain yang sama, bukan nilai ad hoc di setiap halaman.

## 5. Aturan per Modul

### Dashboard
- Kartu statistik di bagian atas.
- Grafik tren penjualan dan ringkasan aktivitas.
- Peringatan stok dan servis aktif.
- Angka hanya menggunakan data dummy yang tersedia.

### Kasir dan Inventaris
- Pencarian barang mudah dijangkau.
- Keranjang menampilkan nama, harga, kuantitas, dan subtotal.
- Total pembayaran dibuat menonjol.
- Stok tersedia dan stok menipis memiliki status yang jelas.

### Manajemen Servis
- Form penerimaan unit dipisahkan dari daftar servis.
- Status servis menggunakan badge dan riwayat kronologis.
- Nomor nota mudah ditemukan dan disalin.
- Halaman tracking pelanggan sederhana dan mobile-first.
- PIN/pola kunci layar tidak boleh disimpan atau ditampilkan.

### Keuangan
- Filter periode dan kategori berada dekat ringkasan laporan.
- Kas konter dan kas PPOB memiliki label dan subtotal terpisah.
- Harga beli, biaya perbaikan, harga jual, dan laba ditampilkan sebagai nilai berbeda.
- Format Rupiah konsisten.

### SPK Smartphone
- Katalog menggunakan tabel atau kartu sesuai konteks.
- Form preferensi menggunakan kontrol yang sesuai, bukan meminta angka mentah tanpa penjelasan.
- Bobot dapat diatur melalui input numerik tervalidasi atau slider dengan nilai terlihat.
- Total bobot ditampilkan sebelum perhitungan.
- Hasil ranking menampilkan peringkat, nama unit, kondisi, harga, skor SAW, dan kontribusi kriteria.
- Top 3 mendapat penekanan visual tanpa menyembunyikan alternatif lainnya.

## 6. Aturan Interaksi

- Setiap tombol menjalankan aksi sesuai label.
- Aksi berhasil menampilkan feedback yang jelas.
- Form invalid menampilkan pesan dekat field terkait.
- Modal dapat ditutup melalui tombol terlihat dan mekanisme keyboard yang sesuai.
- Tabel memiliki empty state informatif.
- Status loading, error, dan data kosong dibedakan.
- Transaksi gagal tidak boleh mengubah stok.
- Perubahan data lokal harus konsisten dengan tampilan terkait.

## 7. Aksesibilitas

- Gunakan elemen semantik dan label input.
- Sediakan fokus keyboard yang terlihat.
- Pastikan kontras teks dan kontrol memadai.
- Jangan menjadikan warna sebagai satu-satunya indikator status.
- Gunakan target interaksi yang nyaman pada perangkat sentuh.
- Ikon tanpa teks memiliki nama aksesibel.

## 8. Motion dan Responsivitas

- Transisi singkat dan fungsional.
- Animasi hanya untuk perubahan panel, drawer, dan feedback.
- Hormati preferensi reduced motion.
- Grafik menyesuaikan lebar kontainer.
- Konten utama tetap dapat diakses di desktop, tablet, dan mobile.

## 9. Batasan

- Dokumen ini menetapkan sistem visual dan perilaku UI.
- Tidak menetapkan backend, autentikasi produksi, atau integrasi eksternal.
- Seluruh data preview adalah simulasi.
- Tidak boleh ada penyimpanan kredensial perangkat pelanggan.
- Struktur kode dan urutan pengerjaan mengikuti IMPLEMENTATION_PLAN.

## 10. Kriteria Penerimaan

- Seluruh modul memakai warna dan tipografi konsisten.
- Navigasi memiliki hierarki jelas.
- Form, tabel, badge, dialog, dan tombol mengikuti aturan komponen.
- Halaman dapat digunakan pada desktop dan mobile.
- Status sukses, gagal, kosong, dan loading direpresentasikan jelas.
- Antarmuka SPK menjelaskan skor dan hasil ranking.
- Tidak ada elemen interaktif dekoratif yang tidak berfungsi.
- Tidak ada kredensial kunci layar pada tampilan atau penyimpanan lokal.

## 11. Keputusan Persetujuan

- Palet: disetujui.
- Navigasi desktop: sidebar di kiri dan header di atas.
- Status: **APPROVED**.
