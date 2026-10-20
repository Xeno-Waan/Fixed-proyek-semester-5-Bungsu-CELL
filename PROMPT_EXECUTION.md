# PROMPT EXECUTION — BUNGSU CELL

## Cara menggunakan
Gunakan prompt ini setelah mengekstrak paket SOT ke root proyek. Pastikan `AGENTS.md` dan ketiga dokumen di `docs/` tersedia. Prompt ini mengatur eksekusi berurutan; bukan izin untuk menyelesaikan semua fase sekaligus.

## Prompt fase awal (Phase A)

Bertindak sebagai senior frontend engineer yang mengimplementasikan proyek Bungsu Cell berdasarkan SOT yang telah disetujui.

### Referensi wajib
- `AGENTS.md`
- `docs/PRD.md`
- `docs/UI-GUIDELINE.md`
- `docs/IMPLEMENTATION_PLAN.md`

### Target fase
Implementasikan hanya Phase A:
- Konfigurasi React + Vite + TypeScript strict.
- Konfigurasi Tailwind CSS sesuai versi yang dipilih dan dikunci.
- Routing dan layout aplikasi.
- Sidebar desktop dan navigasi responsif.
- Design tokens, tipografi, tombol, input, card, badge, dialog, dan feedback dasar.
- Struktur folder serta tipe data dasar yang diperlukan.

### Batasan
- Jangan mengimplementasikan modul B–F pada fase ini.
- Jangan menambahkan backend atau integrasi eksternal.
- Jangan mengarang aturan bisnis yang belum ditentukan.
- Jangan mengganti palet warna atau struktur navigasi yang disetujui.
- Jangan menyimpan data sensitif pelanggan.
- Jangan mengubah SOT tanpa persetujuan.

### Prosedur
1. Baca seluruh dokumen SOT dan `AGENTS.md`.
2. Periksa kondisi dan struktur proyek yang tersedia.
3. Identifikasi konflik atau dependensi yang belum ditentukan.
4. Implementasikan target Phase A saja.
5. Jalankan typecheck, lint bila tersedia, tes yang relevan, dan build.
6. Laporkan file yang dibuat/diubah, perintah yang dijalankan, hasil aktual, serta masalah yang belum terselesaikan.
7. Berhenti setelah Phase A dan tunggu persetujuan eksplisit sebelum Phase B.

Jangan mengklaim pekerjaan selesai tanpa bukti pemeriksaan yang sesuai.

## Prompt untuk setiap fase berikutnya

Setelah pengguna menyetujui fase sebelumnya, baca kembali SOT dan implementasikan hanya fase berikutnya sesuai `docs/IMPLEMENTATION_PLAN.md`. Penuhi seluruh exit gate fase tersebut, jalankan pengujian expanded yang relevan, laporkan hasil aktual, lalu berhenti untuk meminta persetujuan. Jangan melewati fase, jangan melakukan deployment, dan jangan memperluas ruang lingkup tanpa persetujuan.
