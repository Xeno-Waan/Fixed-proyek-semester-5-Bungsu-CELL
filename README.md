# Bungsu Cell — Paket SOT Final

Status dokumen: disetujui pengguna pada 2026-10-20.

## Isi paket

- `docs/PRD.md` — kebutuhan produk dan ruang lingkup.
- `docs/UI-GUIDELINE.md` — token visual, layout, komponen, dan aturan UI.
- `docs/IMPLEMENTATION_PLAN.md` — arsitektur, fase, kontrak data, serta strategi pengujian.
- `AGENTS.md` — kontrak untuk agen coding.
- `PROMPT_EXECUTION.md` — prompt awal untuk mengeksekusi Phase A dan aturan fase berikutnya.

## Keputusan yang dikunci

- Cakupan: POS & stok, servis, keuangan PPOB/HP bekas, dan SPK smartphone.
- Stack: React + Vite + TypeScript strict + Tailwind CSS.
- Data: dummy lokal; localStorage bila diperlukan.
- UI: hijau muda dan kuning muda, sidebar desktop.
- Pengujian: expanded.
- Eksekusi: sequential dengan persetujuan eksplisit setelah setiap fase.

## Batasan

Paket ini berisi dokumen SOT dan kontrak eksekusi, bukan kode aplikasi. Tidak termasuk backend, database server, autentikasi produksi, API WhatsApp, integrasi PPOB/bank, atau deployment. Jangan menyimpan PIN/pola kunci layar pelanggan.

## Langkah penggunaan

1. Ekstrak ZIP ke folder proyek.
2. Tinjau ketiga dokumen di `docs/`.
3. Buka `AGENTS.md` dan `PROMPT_EXECUTION.md` pada coding agent.
4. Jalankan hanya Phase A.
5. Setelah exit gate Phase A dipenuhi, minta persetujuan sebelum fase B.
