# AGENTS.md — BUNGSU CELL

## Project Authority

Dokumen Source of Truth resmi:
1. `docs/PRD.md`
2. `docs/UI-GUIDELINE.md`
3. `docs/IMPLEMENTATION_PLAN.md`

Baca ketiganya sebelum mengubah kode. Jika instruksi bertentangan dengan SOT, hentikan perubahan yang terdampak dan minta klarifikasi. Jangan mengubah keputusan yang disetujui secara diam-diam.

## Technology Constraints

- React + Vite.
- TypeScript strict.
- Tailwind CSS.
- Frontend-only dengan data dummy lokal.
- localStorage hanya untuk perubahan yang perlu bertahan setelah refresh.
- Jangan menambahkan backend, database server, autentikasi produksi, atau integrasi eksternal tanpa persetujuan.

## Implementation Rules

- Ikuti urutan fase dalam `docs/IMPLEMENTATION_PLAN.md`.
- Implementasikan hanya fase yang telah disetujui untuk dikerjakan.
- Gunakan komponen reusable dan tipe data yang jelas.
- Pisahkan data dummy, aturan bisnis, perhitungan, dan presentasi UI.
- Jangan menambahkan fitur di luar PRD.
- Jangan membuat tombol atau kontrol yang tidak berfungsi.
- Jaga konsistensi data pada seluruh alur transaksi.
- Jangan menyimpan PIN atau pola kunci layar pelanggan.
- Jangan mengklaim fitur selesai jika baru berupa mockup.

## SAW Integrity

- Terapkan rumus SAW sesuai PRD.
- Jangan mengubah atribut cost/benefit atau skala tanpa persetujuan.
- Validasi bobot dan data alternatif.
- Tangani data kosong, nilai maksimum nol, dan pembagian nol.
- Pastikan skor dan ranking dapat diverifikasi melalui tes.

## Quality Gate

Sebelum menyatakan fase selesai:
1. Jalankan pemeriksaan TypeScript.
2. Jalankan lint bila dikonfigurasi.
3. Jalankan tes yang relevan.
4. Jalankan production build.
5. Periksa alur interaksi, aksesibilitas, dan responsivitas.
6. Laporkan file yang berubah, perintah yang dijalankan, hasil aktual, dan keterbatasan.

Jangan mengklaim pemeriksaan berhasil jika belum dijalankan.

## Sequential Approval Gate

Fase harus dikerjakan berurutan: A, B, C, D, E, lalu F.
Setelah exit gate fase terpenuhi, laporkan hasil dan berhenti. Jangan memulai fase berikutnya sampai pengguna memberikan persetujuan eksplisit. Persetujuan satu fase tidak berarti persetujuan untuk fase berikutnya.

## Change Control

Perubahan ruang lingkup, desain, arsitektur, atau aturan SAW harus melalui revisi SOT dan persetujuan pengguna.
