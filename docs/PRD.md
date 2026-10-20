# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Proyek:** Sistem Pendukung Keputusan Pemilihan Smartphone Berdasarkan Kebutuhan Pelanggan Menggunakan Metode Simple Additive Weighting (SAW) Berbasis Web pada Bungsu Cell  
**Versi:** v0.1.0  
**Status:** APPROVED  
**Tanggal persetujuan:** 2026-10-20  
**Arsitektur:** Frontend-only, data dummy lokal

## 1. Ringkasan Produk

Bungsu Cell dirancang sebagai aplikasi web untuk membantu operasional konter smartphone sekaligus menyediakan Sistem Pendukung Keputusan (SPK) pemilihan smartphone menggunakan metode Simple Additive Weighting (SAW).

Sistem menyediakan empat domain utama:
1. Kasir dan manajemen stok.
2. Manajemen servis smartphone.
3. Akuntansi PPOB dan perdagangan HP bekas.
4. Rekomendasi smartphone berbasis SAW.

Versi awal berfokus pada antarmuka dan simulasi alur kerja menggunakan data dummy. Seluruh hasil transaksi, perubahan status, dan perhitungan berjalan di sisi frontend dan belum terhubung ke sistem produksi.

## 2. Tujuan Produk

- Mempermudah staf melakukan simulasi transaksi dan pengelolaan stok.
- Menyediakan informasi status servis smartphone secara terstruktur.
- Memisahkan pencatatan keuangan berdasarkan jenis aktivitas usaha.
- Membantu staf merekomendasikan smartphone sesuai kebutuhan pelanggan secara objektif dan terukur.
- Menyediakan dashboard ringkas untuk memantau operasional dan hasil perhitungan.

## 3. Aktor Sistem

| Aktor | Tanggung jawab |
|---|---|
| Admin/Pemilik | Mengelola katalog, stok, kriteria, laporan, dan data operasional. |
| Kasir | Melakukan transaksi, mencatat servis, dan mengisi preferensi pelanggan. |
| Teknisi | Memeriksa daftar servis dan memperbarui status pengerjaan. |
| Pelanggan | Mengisi preferensi smartphone atau mengecek status servis melalui nomor nota. |

Pada versi frontend-only, pergantian peran merupakan simulasi. Otorisasi dan autentikasi produksi belum termasuk.

## 4. Ruang Lingkup Fitur

### 4.1 Dashboard
- Ringkasan transaksi, jumlah servis, stok menipis, dan rekomendasi smartphone.
- Grafik tren penjualan aksesoris atau kartu perdana.
- Ringkasan keuangan berdasarkan data dummy.
- Navigasi ke seluruh modul utama.

### 4.2 Kasir dan Manajemen Stok
- Pencatatan penjualan aksesoris, casing, charger, tempered glass, kartu perdana, dan voucher fisik.
- Keranjang transaksi, kuantitas, subtotal, dan total pembayaran simulasi.
- Pemotongan stok lokal setelah transaksi berhasil.
- Peringatan stok di bawah atau sama dengan batas minimum.
- Riwayat transaksi dan grafik produk terlaris.

### 4.3 Manajemen Servis
- Form pelanggan, tipe smartphone, keluhan, estimasi biaya, dan tanggal masuk.
- Pembuatan nomor nota servis unik dalam lingkup aplikasi.
- Status: Pengecekan, Proses Perbaikan, dan Selesai.
- Riwayat pembaruan status dan estimasi biaya.
- Preview nota yang dapat dicetak melalui browser.
- Halaman tracking berdasarkan nomor nota.
- Simulasi tautan atau pesan WhatsApp; pengiriman aktual belum termasuk.

**Batasan keamanan:** PIN atau pola kunci layar tidak disimpan di localStorage, data dummy, maupun riwayat servis. Untuk pengujian pascaperbaikan, rancangan mengutamakan pelanggan membuka perangkat sendiri atau prosedur penyerahan akses sementara dengan persetujuan. Penyimpanan kredensial layar tidak menjadi fitur versi ini.

### 4.4 Akuntansi PPOB dan HP Bekas
- Pencatatan transaksi PPOB seperti transfer, tarik tunai, token listrik, dan BPJS.
- Pemisahan pencatatan kas konter dan kas operasional agen.
- Pencatatan harga beli HP bekas, biaya sparepart/perbaikan, dan harga jual.
- Perhitungan laba transaksi berdasarkan komponen biaya yang tercatat.
- Rekap harian, mingguan, dan bulanan.
- Filter periode dan kategori transaksi.

Laporan versi awal adalah simulasi pembukuan, bukan sistem akuntansi terintegrasi atau laporan pajak.

### 4.5 SPK Rekomendasi Smartphone
- Manajemen alternatif smartphone baru dan bekas.
- Pengelolaan spesifikasi dan nilai kriteria.
- Form kebutuhan pelanggan.
- Pengaturan bobot kriteria atau pemilihan profil prioritas.
- Normalisasi matriks dan perhitungan SAW.
- Ranking dari skor tertinggi ke terendah.
- Tampilan Top 3 dan penjelasan kontribusi setiap kriteria.

## 5. Kriteria dan Aturan SAW

| Kode | Kriteria | Atribut | Prinsip penilaian |
|---|---|---|---|
| C1 | Harga | Cost | Harga lebih rendah memperoleh nilai lebih tinggi. |
| C2 | RAM | Benefit | Kapasitas lebih besar memperoleh nilai lebih tinggi. |
| C3 | Penyimpanan internal | Benefit | Kapasitas lebih besar memperoleh nilai lebih tinggi. |
| C4 | Kualitas kamera | Benefit | Rating kualitas foto lebih tinggi memperoleh nilai lebih tinggi. |
| C5 | Desain modul kamera | Benefit | Desain lebih compact, tipis, dan subtle memperoleh nilai lebih tinggi. |
| C6 | Baterai | Benefit | Kapasitas mAh lebih besar memperoleh nilai lebih tinggi. |
| C7 | Kondisi unit | Benefit | Baru, bekas mulus, kemudian bekas dengan minus ringan. |

### Aturan perhitungan

Bobot preferensi pelanggan dinormalisasi sehingga totalnya 1 atau 100%.

Normalisasi cost:

`r_ij = min(x_j) / x_ij`

Normalisasi benefit:

`r_ij = x_ij / max(x_j)`

Nilai preferensi:

`V_i = Σ(w_j × r_ij)`

Keterangan:
- `x_ij` adalah nilai alternatif i pada kriteria j.
- `r_ij` adalah nilai hasil normalisasi.
- `w_j` adalah bobot kriteria j.
- `V_i` adalah skor akhir alternatif.

Nilai tertinggi menempati peringkat pertama. Sistem harus menangani bobot nol, data kosong, nilai tidak valid, serta nilai pembagi nol secara eksplisit.

Untuk C4, C5, dan C7, skala penilaian menggunakan 1–5. Pemetaan rinci nilai mentah ke skala harus konsisten dan tercatat dalam data/aturan aplikasi sebelum implementasi. Data mentah dibedakan dari nilai numerik yang digunakan oleh SAW.

## 6. Aturan Bisnis

- Transaksi hanya mengurangi stok setelah dinyatakan berhasil.
- Kuantitas transaksi tidak boleh melebihi stok tersedia.
- Peringatan stok mengikuti batas minimum setiap barang.
- Nomor nota harus unik dalam dataset lokal.
- Perubahan status servis mengikuti alur status yang ditentukan.
- Harga jual HP bekas, biaya perbaikan, dan harga beli tercatat terpisah.
- Kas operasional PPOB tidak otomatis dianggap sebagai pendapatan bersih.
- Rekomendasi SAW hanya menggunakan alternatif aktif dengan data kriteria valid.
- Hasil ranking dapat ditelusuri ke bobot, nilai normalisasi, dan kontribusi kriteria.

## 7. Kebutuhan Nonfungsional

- Antarmuka responsif untuk desktop, tablet, dan ponsel.
- Navigasi konsisten dan komponen dapat digunakan ulang.
- TypeScript strict untuk mengurangi kesalahan tipe data.
- Data dummy terpusat dan dipisahkan dari komponen UI.
- Validasi form, empty state, loading state, dan error state.
- Perhitungan SAW dapat diuji secara terpisah.
- Tidak mengklaim keamanan, persistensi, atau sinkronisasi server yang belum tersedia.

## 8. Batasan Versi Awal

**Termasuk:** frontend, navigasi, dashboard, form, tabel, grafik, simulasi CRUD, simulasi transaksi, tracking servis, dan perhitungan SAW dengan data dummy.

**Tidak termasuk:** backend, database server, login produksi, integrasi payment gateway, API WhatsApp, integrasi bank/PPOB, sinkronisasi multi-pengguna, serta deployment produksi.

Penyimpanan lokal hanya digunakan bila diperlukan untuk mempertahankan perubahan selama penggunaan browser; bukan pengganti database atau kontrol akses.

## 9. Kriteria Penerimaan

- Semua modul dapat diakses melalui navigasi.
- Form utama memiliki validasi dan feedback yang jelas.
- Transaksi simulasi memperbarui stok secara konsisten.
- Peringatan stok menipis mengikuti batas minimum.
- Nota dapat dipreview dan dicetak.
- Tracking menampilkan servis yang sesuai dengan nomor nota.
- Laporan memfilter periode dan memisahkan kategori kas dengan benar.
- Perhitungan SAW sesuai rumus dan menghasilkan ranking yang dapat diverifikasi.
- Top 3 dan kontribusi kriteria sesuai hasil perhitungan.
- Seluruh antarmuka utama responsif.
- Tidak ada kredensial kunci layar yang disimpan.

## 10. Keputusan Persetujuan

- Cakupan: seluruh empat modul.
- Penyimpanan: data dummy lokal; localStorage digunakan bila diperlukan.
- Skala kriteria subjektif: 1–5.
- Status: **APPROVED**.
