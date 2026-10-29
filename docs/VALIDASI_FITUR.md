# DOKUMEN VALIDASI FITUR DAN ALUR KERJA SISTEM BUNGSU CELL

## 1. Tujuan Sistem

Sistem Bungsu Cell merupakan aplikasi berbasis web yang dirancang untuk membantu kegiatan operasional toko, meliputi transaksi penjualan, pengelolaan inventaris, pencatatan servis perangkat, pencatatan keuangan, pengelolaan HP bekas, serta rekomendasi smartphone berdasarkan kebutuhan pelanggan menggunakan metode Simple Additive Weighting (SAW).

Sistem dirancang agar mudah digunakan oleh karyawan, mempercepat proses pelayanan, mengurangi kesalahan pencatatan, dan membantu pemilik toko memantau aktivitas operasional.

## 2. Daftar Modul Sistem

Sistem memiliki 10 modul navigasi atau kelompok fungsi:

1. Dashboard Operasional.
2. Kasir atau Point of Sale (POS).
3. Manajemen Stok.
4. Riwayat Penjualan.
5. Penerimaan Servis.
6. Daftar dan Status Servis.
7. Tracking Servis Pelanggan.
8. Keuangan PPOB dan Kas Konter.
9. HP Bekas dan Perhitungan Laba.
10. Sistem Pendukung Keputusan Smartphone menggunakan metode SAW.

Modul-modul tersebut dapat memiliki halaman tersendiri atau berbagi halaman yang sama. Contohnya, Riwayat Penjualan merupakan tab dalam halaman POS, sedangkan Keuangan PPOB dan HP Bekas dapat berada dalam halaman Keuangan.

---

## 3. Validasi Fungsi dan Alur Kerja Setiap Modul

### Modul 1 — Dashboard Operasional

**Tujuan:**
Memberikan ringkasan kondisi operasional toko dalam satu tampilan.

**Fitur:**
- Ringkasan pendapatan dan transaksi.
- Informasi stok yang menipis.
- Grafik tren pendapatan.
- Informasi produk terlaris.
- Ringkasan aktivitas servis jika integrasi telah diterapkan.

**Alur kerja:**
1. Pengguna membuka dashboard.
2. Sistem membaca data operasional yang tersedia.
3. Sistem menghitung ringkasan berdasarkan transaksi, stok, dan data lain yang relevan.
4. Sistem menampilkan statistik dalam bentuk kartu informasi dan grafik.
5. Ketika data operasional berubah, ringkasan diperbarui sesuai mekanisme aplikasi.

**Validasi keberhasilan:**
- Angka pada dashboard sesuai dengan data sumber.
- Transaksi yang dibatalkan tidak dihitung sebagai penjualan sah jika aturan sistem mengecualikannya.
- Grafik tidak menampilkan angka yang bertentangan dengan riwayat transaksi.
- Data yang belum tersedia ditampilkan dengan jelas, bukan digantikan angka yang menyesatkan.

### Modul 2 — Kasir atau Point of Sale (POS)

**Tujuan:**
Membantu kasir memilih barang, menghitung total belanja, memeriksa stok, menerima pembayaran, dan menghasilkan bukti transaksi.

**Fitur:**
- Pencarian produk.
- Pemilihan produk melalui katalog.
- Pemindaian barcode jika barcode dan dukungan perangkat telah tersedia.
- Keranjang belanja.
- Perhitungan jumlah barang, subtotal, dan total.
- Validasi stok.
- Pencatatan pembayaran dan kembalian.
- Pembuatan nomor transaksi.
- Pencetakan invoice atau nota.
- Pembaruan stok dan pencatatan riwayat penjualan.

**Alur kerja transaksi menggunakan barcode:**

1. Kasir membuka halaman POS.
2. Kasir memindai barcode produk menggunakan pemindai barcode yang kompatibel.
3. Sistem membaca kode produk dan mencari kecocokannya dalam katalog.
4. Jika produk ditemukan dan tersedia, sistem menambahkan produk ke keranjang.
5. Jika produk yang sama dipindai kembali, jumlahnya bertambah sesuai aturan transaksi.
6. Sistem menghitung subtotal setiap produk dan total belanja secara otomatis.
7. Kasir memeriksa barang dan jumlah yang dibeli pelanggan.
8. Kasir memasukkan nominal pembayaran.
9. Sistem memvalidasi nominal pembayaran dan menghitung kembalian jika diperlukan.
10. Setelah transaksi dikonfirmasi, sistem mencatat transaksi, menghasilkan nomor nota, dan memperbarui stok.
11. Kasir mencetak atau menampilkan nota untuk pelanggan.

**Jika barcode tidak digunakan:**

Kasir mencari produk berdasarkan nama atau kode produk, memilih barang dari katalog, lalu melanjutkan proses transaksi dengan alur yang sama.

**Validasi keberhasilan:**
- Barcode yang dikenal mengarah ke produk yang benar.
- Barcode yang tidak dikenal menghasilkan pesan yang jelas.
- Produk dengan stok tidak mencukupi tidak boleh dijual melebihi stok yang tersedia.
- Total belanja dan kembalian dihitung dengan benar.
- Transaksi tidak tercatat dua kali akibat klik berulang.
- Stok berkurang sesuai jumlah barang yang berhasil dijual.
- Transaksi yang gagal tidak boleh mengurangi stok secara tidak semestinya.

**Catatan implementasi:**
Pemindaian barcode belum boleh dianggap tersedia hanya karena ada kolom kode produk. Sistem harus benar-benar mampu menerima hasil pemindaian dan memprosesnya. Pemindai USB yang berfungsi seperti keyboard dapat digunakan jika implementasinya mendukung, sedangkan kamera memerlukan implementasi tambahan.

### Modul 3 — Manajemen Stok

**Tujuan:**
Memudahkan karyawan memantau jumlah barang dan mencatat perubahan persediaan.

**Fitur:**
- Daftar produk dan jumlah stok.
- Pencarian produk.
- Filter kategori.
- Informasi stok menipis.
- Pencatatan stok masuk.
- Penyesuaian stok jika diizinkan.
- Informasi kode produk atau barcode.

**Alur kerja:**
1. Karyawan membuka halaman inventaris.
2. Sistem menampilkan produk dan jumlah stok yang tercatat.
3. Karyawan mencari produk yang ingin diperiksa.
4. Untuk barang masuk, karyawan memilih produk dan memasukkan jumlah tambahan.
5. Sistem memvalidasi jumlah yang dimasukkan.
6. Setelah disimpan, jumlah stok diperbarui.
7. Sistem menampilkan stok terbaru dan memperbarui peringatan stok menipis jika diperlukan.

**Validasi keberhasilan:**
- Penambahan stok menghasilkan jumlah yang benar.
- Stok tidak berubah jika formulir gagal disimpan.
- Penyesuaian stok tidak dilakukan tanpa konfirmasi yang sesuai.
- Kode produk tidak menyebabkan dua produk berbeda dianggap sebagai produk yang sama.

### Modul 4 — Riwayat Penjualan

**Tujuan:**
Memudahkan karyawan menelusuri transaksi yang pernah dilakukan.

**Fitur:**
- Daftar transaksi.
- Pencarian nomor nota.
- Informasi waktu transaksi.
- Rincian barang yang dibeli.
- Total transaksi.
- Detail transaksi dan pencetakan ulang nota jika tersedia.

**Alur kerja:**
1. Karyawan membuka tab Riwayat Penjualan.
2. Sistem menampilkan transaksi yang tersimpan.
3. Karyawan mencari transaksi menggunakan nomor nota atau kriteria yang tersedia.
4. Karyawan membuka detail transaksi.
5. Sistem menampilkan produk, jumlah, total pembayaran, dan informasi transaksi yang tercatat.

**Validasi keberhasilan:**
- Setiap transaksi memiliki identitas yang dapat ditelusuri.
- Detail nota sesuai dengan transaksi sumber.
- Riwayat tidak menampilkan transaksi yang sebenarnya gagal disimpan.

---

### Modul 5 — Penerimaan Servis

**Tujuan:**
Mencatat perangkat pelanggan yang diterima untuk diperiksa atau diperbaiki.

**Fitur:**
- Identitas pelanggan.
- Informasi perangkat.
- Keluhan kerusakan.
- Estimasi biaya.
- Nomor nota servis.
- Status awal pengerjaan.
- Pencetakan nota penerimaan jika tersedia.

**Alur kerja:**
1. Karyawan membuka formulir penerimaan servis.
2. Karyawan memasukkan data pelanggan dan perangkat.
3. Karyawan mencatat keluhan serta estimasi biaya.
4. Sistem memvalidasi data wajib.
5. Sistem menghasilkan nomor nota yang unik.
6. Karyawan menyimpan data penerimaan.
7. Sistem menambahkan order ke daftar servis.
8. Karyawan menyerahkan bukti penerimaan kepada pelanggan jika fitur nota tersedia.

**Validasi keberhasilan:**
- Nomor nota tidak bertabrakan dengan order lain.
- Data wajib tidak boleh kosong.
- Data PIN atau pola kunci layar tidak disimpan, sesuai batasan yang tercantum dalam laporan proyek.
- Order yang gagal disimpan tidak boleh muncul sebagai order yang sah.

### Modul 6 — Daftar dan Status Servis

**Tujuan:**
Membantu karyawan memantau pekerjaan servis dari penerimaan hingga penyelesaian.

**Fitur:**
- Daftar order servis.
- Pencarian nomor nota.
- Filter status.
- Detail order.
- Perubahan status pengerjaan.
- Informasi estimasi biaya.
- Riwayat perubahan status jika diimplementasikan.

**Alur kerja:**
1. Karyawan membuka daftar servis.
2. Sistem menampilkan order yang telah dicatat.
3. Karyawan memilih order yang ingin diperiksa.
4. Sistem menampilkan keluhan, informasi perangkat, dan status saat ini.
5. Karyawan memperbarui status berdasarkan perkembangan pekerjaan.
6. Sistem menyimpan status terbaru.
7. Status terbaru dapat digunakan oleh fitur tracking pelanggan jika fitur tersebut telah tersedia.

**Validasi keberhasilan:**
- Perubahan status diterapkan pada order yang benar.
- Status yang ditampilkan sesuai dengan data tersimpan.
- Sistem tidak menampilkan status selesai jika order sebenarnya masih dalam pengerjaan.
- Perubahan status tidak menghapus informasi order sebelumnya.

### Modul 7 — Tracking Servis Pelanggan

**Tujuan:**
Memungkinkan pelanggan memeriksa perkembangan servis tanpa harus bertanya langsung kepada karyawan.

**Fitur yang direncanakan:**
- Form pencarian nomor nota.
- Informasi status servis.
- Ringkasan perangkat dan keluhan yang aman ditampilkan.
- Timeline pengerjaan jika riwayat status tersedia.
- Tampilan nota yang siap dicetak.
- Tombol simulasi pesan WhatsApp jika disetujui dalam ruang lingkup.

**Alur kerja:**
1. Pelanggan membuka halaman tracking.
2. Pelanggan memasukkan nomor nota.
3. Sistem mencari order yang sesuai.
4. Jika ditemukan, sistem menampilkan informasi status yang diizinkan untuk pelanggan.
5. Jika tidak ditemukan, sistem menampilkan pesan bahwa data servis tidak ditemukan.
6. Pelanggan dapat mencetak nota jika fitur cetak telah disediakan.

**Validasi keberhasilan:**
- Nomor nota yang valid menampilkan order yang benar.
- Nomor nota yang salah tidak menampilkan data milik order lain.
- Informasi pribadi yang tidak diperlukan tidak ditampilkan secara publik.
- Tracking menampilkan status terbaru yang tersimpan.

**Catatan keamanan:**
Nomor nota saja tidak selalu cukup untuk melindungi informasi pelanggan. Jika tracking dibuka secara publik, data yang ditampilkan harus dibatasi agar orang yang mengetahui nomor nota tidak otomatis mendapatkan seluruh informasi pelanggan.

---

### Modul 8 — Keuangan PPOB dan Kas Konter

**Tujuan:**
Membantu pencatatan arus kas operasional dan membedakan kas konter dari kas PPOB.

**Fitur:**
- Pencatatan kas masuk.
- Pencatatan kas keluar.
- Kategori transaksi.
- Pemisahan kas konter dan kas PPOB.
- Filter periode.
- Ringkasan saldo berdasarkan transaksi yang tercatat.
- Grafik atau laporan keuangan.

**Alur kerja:**
1. Karyawan membuka halaman Keuangan.
2. Karyawan memilih jenis kas yang akan dicatat.
3. Karyawan memasukkan tanggal, kategori, nominal, dan keterangan transaksi.
4. Sistem memvalidasi nominal dan informasi wajib.
5. Sistem menyimpan transaksi.
6. Sistem memperbarui ringkasan berdasarkan jenis kas dan periode yang dipilih.

**Validasi keberhasilan:**
- Transaksi masuk dan keluar dihitung dengan tanda yang benar.
- Kas konter tidak tercampur dengan kas PPOB.
- Filter periode menampilkan transaksi sesuai tanggal.
- Penghapusan atau koreksi transaksi tidak dilakukan tanpa konfirmasi.

**Catatan:**
Pencatatan kas PPOB tidak berarti aplikasi otomatis terhubung ke penyedia PPOB atau melakukan transaksi token listrik maupun pulsa. Integrasi tersebut membutuhkan implementasi terpisah.

### Modul 9 — HP Bekas dan Perhitungan Laba

**Tujuan:**
Membantu mencatat pembelian HP bekas dan menghitung laba berdasarkan harga beli, biaya perbaikan, dan harga jual.

**Fitur:**
- Identitas perangkat.
- Harga beli.
- Biaya servis atau perbaikan.
- Estimasi harga jual.
- Harga jual aktual.
- Status penjualan.
- Perhitungan laba.

**Alur kerja:**
1. Karyawan mencatat HP bekas yang dibeli.
2. Sistem menyimpan harga beli dan identitas perangkat.
3. Jika ada biaya perbaikan, karyawan mencatat biaya tersebut.
4. Sistem menghitung total modal.
5. Ketika perangkat dijual, karyawan memasukkan harga jual aktual.
6. Sistem menghitung laba atau rugi berdasarkan nilai yang tercatat.

**Rumus dasar:**

Total Modal = Harga Beli + Biaya Perbaikan

Laba/Rugi = Harga Jual Aktual − Total Modal

**Validasi keberhasilan:**
- Biaya perbaikan masuk ke perhitungan modal.
- Estimasi harga jual tidak dianggap sebagai pendapatan aktual sebelum transaksi terjadi.
- Sistem membedakan perangkat yang belum terjual dan sudah terjual.
- Laba dihitung berdasarkan harga jual aktual, bukan harga estimasi.

### Modul 10 — SPK Pemilihan Smartphone dengan Metode SAW

**Tujuan:**
Membantu pelanggan memilih smartphone yang paling sesuai dengan kebutuhan dan prioritas mereka.

**Kriteria yang disebutkan dalam rancangan awal proyek:**
- Harga.
- RAM.
- Memori internal.
- Kapasitas baterai.
- Kualitas kamera.

Jumlah dan definisi kriteria harus tetap mengikuti PRD dan aturan SAW yang telah disetujui. Jangan menambahkan kriteria baru tanpa validasi.

**Fitur:**
- Katalog smartphone.
- Pemilihan kebutuhan atau preferensi pelanggan.
- Pengaturan bobot kriteria.
- Normalisasi nilai.
- Perhitungan skor SAW.
- Pemeringkatan alternatif.
- Rekomendasi smartphone teratas.
- Penjelasan kontribusi kriteria terhadap hasil jika tersedia.

**Alur kerja:**
1. Karyawan atau pelanggan membuka halaman SPK.
2. Pengguna memilih atau memasukkan preferensi kebutuhan.
3. Sistem menentukan bobot kriteria sesuai mekanisme yang disediakan.
4. Sistem memvalidasi bobot agar memenuhi aturan perhitungan.
5. Sistem mengambil data smartphone yang memenuhi syarat untuk dipertimbangkan.
6. Sistem membentuk matriks keputusan dari nilai setiap smartphone.
7. Sistem menormalisasi nilai berdasarkan jenis kriteria cost atau benefit.
8. Sistem mengalikan nilai normalisasi dengan bobot masing-masing kriteria.
9. Sistem menjumlahkan kontribusi setiap kriteria untuk mendapatkan skor akhir.
10. Sistem mengurutkan smartphone berdasarkan skor akhir.
11. Sistem menampilkan rekomendasi teratas beserta informasi yang membantu pengguna memahami hasilnya.

**Prinsip perhitungan SAW:**

Untuk kriteria benefit:

rᵢⱼ = xᵢⱼ / max(xⱼ)

Untuk kriteria cost:

rᵢⱼ = min(xⱼ) / xᵢⱼ

Skor akhir:

Vᵢ = Σ(wⱼ × rᵢⱼ)

Keterangan:
- xᵢⱼ adalah nilai alternatif smartphone ke-i pada kriteria ke-j.
- rᵢⱼ adalah nilai hasil normalisasi.
- wⱼ adalah bobot kriteria.
- Vᵢ adalah skor akhir alternatif smartphone.

**Validasi keberhasilan:**
- Kriteria cost dan benefit diterapkan sesuai aturan yang disetujui.
- Bobot divalidasi sebelum perhitungan.
- Nilai kosong atau pembagi nol ditangani dengan aman.
- Smartphone yang tidak aktif tidak ditawarkan sebagai alternatif jika aturan katalog memang mengecualikannya.
- Urutan rekomendasi sesuai hasil perhitungan.
- Hasil peringkat tidak dibuat secara manual atau acak.
- Pengguna dapat melihat alasan rekomendasi melalui skor atau kontribusi kriteria jika fitur transparansi tersedia.

**Catatan:**
Rekomendasi SAW hanya seakurat data smartphone dan bobot yang digunakan. Sistem tidak boleh mengklaim smartphone terbaik secara mutlak; hasilnya adalah smartphone dengan skor tertinggi berdasarkan kriteria, data, dan bobot yang digunakan.

---

## 4. Validasi Hubungan Antarmodul

Selain memeriksa masing-masing modul, sistem perlu diuji sebagai satu alur operasional.

### Alur A — Penjualan barang

POS → Validasi stok → Konfirmasi transaksi → Pengurangan stok → Riwayat penjualan → Pembaruan ringkasan dashboard.

### Alur B — Penerimaan dan penyelesaian servis

Penerimaan servis → Nomor nota → Daftar servis → Pembaruan status → Tracking pelanggan jika tersedia → Penyelesaian order.

### Alur C — Pencatatan keuangan

Transaksi kas → Validasi kategori → Penyimpanan transaksi → Perhitungan saldo → Ringkasan keuangan.

### Alur D — Penjualan HP bekas

Pencatatan pembelian → Pencatatan biaya perbaikan → Pencatatan penjualan → Perhitungan laba/rugi → Pembaruan ringkasan jika diintegrasikan.

### Alur E — Rekomendasi smartphone

Data katalog → Preferensi pelanggan → Bobot kriteria → Normalisasi SAW → Perhitungan skor → Pemeringkatan → Rekomendasi.

---

## 5. Ketentuan Validasi Umum

Semua modul yang dinyatakan selesai harus memenuhi ketentuan berikut:

1. Formulir memiliki validasi input yang sesuai.
2. Data yang disimpan dapat ditampilkan kembali.
3. Pesan keberhasilan dan kegagalan ditampilkan secara jelas.
4. Tombol yang tersedia benar-benar menjalankan tindakan yang sesuai.
5. Data tidak berubah secara tidak semestinya ketika proses gagal.
6. Navigasi dan pencarian bekerja sesuai fungsi yang direncanakan.
7. Tampilan dapat digunakan pada ukuran layar yang didukung.
8. Tidak ada klaim integrasi eksternal jika integrasi tersebut belum diimplementasikan.
9. Perhitungan keuangan dan SAW diuji menggunakan data yang dapat diverifikasi.
10. Seluruh fitur diperiksa terhadap PRD, UI Guideline, dan Implementation Plan yang telah disetujui.

## 6. Batasan Sistem

Sistem dalam ruang lingkup saat ini menggunakan pendekatan frontend dengan data lokal. Karena itu:

- Data tidak otomatis tersinkronisasi antarkomputer.
- `localStorage` bukan pengganti database server.
- Login simulasi tidak memberikan keamanan autentikasi sungguhan.
- Pencatatan PPOB tidak berarti transaksi PPOB benar-benar dilakukan melalui aplikasi.
- Tombol WhatsApp simulasi tidak berarti aplikasi terhubung ke WhatsApp Business API.
- Hasil pengujian unit tidak otomatis membuktikan seluruh alur pengguna telah diuji.
- Fitur yang disebut dalam dokumen ini harus diperiksa terhadap source code sebelum dinyatakan selesai.

## 7. Kriteria Penerimaan Akhir

Sistem dapat dinyatakan memenuhi kebutuhan implementasi apabila:

1. Semua fitur dalam ruang lingkup yang disetujui telah tersedia.
2. Setiap fitur dapat digunakan sesuai alur kerja yang dirancang.
3. Data antarhalaman konsisten.
4. Perhitungan POS, stok, keuangan, laba, dan SAW benar.
5. Tidak ada error yang menghambat fungsi utama.
6. TypeScript, lint, unit test, dan production build berhasil jika seluruh pemeriksaan tersebut dikonfigurasi.
7. Alur lintas modul telah diuji, bukan hanya setiap komponen secara terpisah.
8. Seluruh pekerjaan sesuai dengan SOT yang telah disetujui.
