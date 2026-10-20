Update the CashEntryForm to use proper event handling (e.target.value) for the Select components, eliminating the TS2352 conversion errors.# IMPLEMENTATION PLAN — BUNGSU CELL

**Versi:** v0.1.0  
**Status:** APPROVED  
**Tanggal persetujuan:** 2026-10-20  
**Referensi:** PRD v0.1.0 dan UI-GUIDELINE v0.1.0

## 1. Tujuan

Menerjemahkan SOT menjadi implementasi frontend yang dapat diuji dan konsisten. Paket ini hanya berisi rencana dan kontrak eksekusi; kode aplikasi belum dibuat.

## 2. Stack

- React + Vite.
- TypeScript strict.
- Tailwind CSS.
- Routing SPA.
- Data dummy lokal yang terpusat.
- localStorage untuk perubahan yang perlu bertahan setelah refresh, bila diperlukan.
- Pengujian unit, integrasi UI, dan lintas modul sesuai lingkup di bawah.

Versi paket dan dependensi harus dipilih serta dikunci saat fase fondasi. Jangan memasang library tambahan tanpa kebutuhan jelas atau persetujuan bila berdampak pada arsitektur.

## 3. Struktur Direktori Rencana

```text
src/
├── app/
│   ├── router/
│   └── layouts/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   └── feedback/
├── features/
│   ├── dashboard/
│   ├── pos/
│   ├── inventory/
│   ├── service/
│   ├── finance/
│   └── smartphone-spk/
├── data/
│   ├── products.ts
│   ├── services.ts
│   ├── finance.ts
│   └── smartphones.ts
├── lib/
│   ├── saw.ts
│   ├── currency.ts
│   └── validation.ts
├── types/
└── main.tsx
```

Struktur dapat dirinci selama fase fondasi, tetapi perubahan yang mengubah cakupan atau arsitektur harus ditinjau terhadap SOT.

## 4. Kontrak Domain dan Data

| Domain | Model data utama | Aturan implementasi |
|---|---|---|
| POS | `Product`, `Sale`, `SaleItem` | Stok diperbarui hanya setelah transaksi valid berhasil. |
| Inventaris | `Product`, `StockMovement` | Peringatan muncul ketika stok ≤ batas minimum. |
| Servis | `ServiceOrder`, `ServiceStatusHistory` | Nomor nota unik dalam lingkup penyimpanan lokal. |
| Keuangan | `CashEntry`, `UsedPhone`, `FinanceRecord` | Kas PPOB dipisahkan dari pendapatan dan laba. |
| SPK | `Smartphone`, `Criteria`, `Preference`, `SAWResult` | Bobot, normalisasi, skor, dan ranking dapat ditelusuri. |

## 5. Kontrak SAW

- Harga adalah cost; RAM, penyimpanan, kamera, desain modul kamera, baterai, dan kondisi unit adalah benefit.
- C4, C5, dan C7 memakai skala 1–5 dengan pemetaan eksplisit dan konsisten.
- Bobot harus nonnegatif dan memiliki total positif sebelum normalisasi.
- Alternatif dengan data kriteria wajib tidak valid dikeluarkan dari perhitungan dan diberi alasan.
- Bila nilai maksimum benefit nol, jangan menghasilkan `NaN` atau `Infinity`; terapkan penanganan yang terdokumentasi.
- Skor akhir diurutkan menurun; tie-break harus deterministik dan didokumentasikan.
- Hasil memperlihatkan skor akhir, nilai normalisasi, kontribusi kriteria, dan Top 3 bila setidaknya tiga alternatif valid.
- Uji perhitungan menggunakan dataset kecil dengan hasil yang dapat dihitung manual.

## 6. Kontrak Penyimpanan Lokal

- Data awal berasal dari file TypeScript terpusat.
- localStorage hanya menyimpan perubahan yang perlu dipertahankan setelah refresh.
- Sediakan reset ke data dummy awal.
- Validasi bentuk data saat dibaca; tangani data korup dengan fallback yang aman.
- Jangan menyimpan PIN atau pola kunci layar.
- Penyimpanan lokal bukan pengganti autentikasi, otorisasi, atau database produksi.
- Semua fitur tetap harus dapat didemonstrasikan tanpa layanan eksternal.

## 7. Fase Implementasi Berurutan

### Phase A — Fondasi
- Konfigurasi Vite, React, TypeScript strict, dan Tailwind CSS.
- Routing, layout sidebar desktop, header, navigasi responsif.
- Design tokens dan komponen dasar.
- Tipe data dasar dan pola penanganan error/empty state.

**Exit gate:** typecheck, lint (jika dikonfigurasi), build, uji navigasi dan responsivitas layout. Berhenti dan minta persetujuan.

### Phase B — Dashboard, POS, Inventaris
- Dashboard statistik dan grafik dummy.
- Daftar produk, pencarian/filter, stok minimum.
- Keranjang dan simulasi transaksi.
- Riwayat penjualan dan tren produk.

**Exit gate:** uji transaksi valid, stok tidak cukup, transaksi gagal, batas stok, reset data, dan konsistensi dashboard. Berhenti dan minta persetujuan.

### Phase C — Servis
- Form penerimaan unit dan keluhan.
- Nomor nota lokal, daftar/detail servis, histori status.
- Preview/cetak nota melalui browser.
- Tracking berdasarkan nomor nota.
- Simulasi tautan/pesan WhatsApp tanpa pengiriman aktual.

**Exit gate:** uji nomor nota unik, validasi form, alur status, tracking cocok/tidak cocok, print layout, dan tidak ada penyimpanan kredensial. Berhenti dan minta persetujuan.

### Phase D — Keuangan
- Pencatatan transaksi PPOB.
- Pemisahan kas konter dan kas PPOB.
- Catatan harga beli, biaya perbaikan, harga jual HP bekas.
- Laporan periode dan filter kategori.

**Exit gate:** uji pemisahan kas, kalkulasi laba, filter periode, nilai kosong, dan konsistensi agregasi. Berhenti dan minta persetujuan.

### Phase E — SPK Smartphone
- Katalog alternatif baru/bekas dan data kriteria.
- Form preferensi dan pengaturan bobot.
- Matriks normalisasi dan perhitungan SAW.
- Ranking, Top 3, serta kontribusi kriteria.

**Exit gate:** uji rumus cost/benefit, bobot invalid, pembagi nol, alternatif tidak valid, tie-break, ranking, dan verifikasi manual. Berhenti dan minta persetujuan.

### Phase F — Validasi menyeluruh
- Integrasi alur antar modul.
- Pemeriksaan aksesibilitas dan responsivitas.
- Pengujian regresi.
- Typecheck, lint, build, dan seluruh tes.
- Perbaikan defect yang ditemukan.

**Exit gate:** laporan pengujian dan daftar keterbatasan. Berhenti dan tunggu persetujuan sebelum deployment atau pekerjaan tambahan.

## 8. Strategi Pengujian Expanded

### Unit test
- Rumus SAW, normalisasi cost/benefit, bobot, skor, ranking, tie-break, data kosong, dan pembagi nol.
- Formatter Rupiah dan tanggal.
- Perhitungan laba transaksi HP bekas.
- Aturan batas minimum stok dan total transaksi.

### Integrasi UI
- Form dan validasi.
- Perubahan data yang tercermin pada tabel, kartu statistik, dan detail.
- Persistensi localStorage, pemulihan data, dan reset.
- Filter dan pencarian.
- Nota dan tampilan cetak.
- Tracking servis.

### Skenario lintas modul
- Transaksi POS memperbarui stok dan dashboard.
- Data servis baru muncul pada daftar dan dapat dilacak.
- Kas dan rekap laporan tetap terpisah berdasarkan kategori.
- Perubahan katalog smartphone tercermin pada form SPK.
- Hasil ranking tetap konsisten setelah bobot atau alternatif berubah.

### Quality gate
- TypeScript typecheck berhasil.
- Lint berhasil bila dikonfigurasi.
- Seluruh test relevan berhasil.
- Production build berhasil.
- Pemeriksaan manual desktop dan mobile.
- Tidak ada klaim pengujian berhasil tanpa menjalankannya.

## 9. Strategi UI dan Aksesibilitas

- Gunakan token UI-GUIDELINE, sidebar di desktop, dan navigasi ringkas pada layar kecil.
- Sediakan label form, fokus keyboard, kontras memadai, dan status yang tidak hanya mengandalkan warna.
- Setiap tombol memiliki aksi nyata.
- Bedakan loading, empty, success, dan error state.
- Hormati reduced-motion.
- Hindari overflow horizontal pada layout utama.

## 10. Batasan

Tidak termasuk backend, database server, autentikasi produksi, API WhatsApp, payment gateway, integrasi bank/PPOB, sinkronisasi multi-user, atau deployment produksi. Data dummy dan perubahan lokal hanya untuk demonstrasi frontend.

## 11. Gerbang Eksekusi

Eksekusi menggunakan mode **sequential dengan approval gate per fase**:
1. Fase berjalan sesuai urutan A → B → C → D → E → F.
2. Setelah exit gate fase terpenuhi, agen melaporkan file, pemeriksaan, hasil tes, dan keterbatasan.
3. Agen berhenti; fase berikutnya tidak boleh dimulai sampai pengguna memberikan persetujuan eksplisit.
4. Persetujuan satu fase bukan persetujuan otomatis untuk fase berikutnya.
5. Perubahan SOT memerlukan revisi dan persetujuan yang sesuai.

## 12. Keputusan Persetujuan

- Status: **APPROVED**.
- Pengujian: **expanded**.
- Eksekusi: **sequential dengan persetujuan per fase**.
- Tidak ada implementasi aplikasi yang termasuk dalam paket dokumen ini.
