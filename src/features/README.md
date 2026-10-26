# Indeks Modul Frontend

Seluruh modul aplikasi berada di folder `src/features/`. Komponen UI yang dipakai bersama berada di `src/components/ui/`, data dummy di `src/data/`, dan utilitas di `src/lib/`.

| Folder | Modul | File utama |
| --- | --- | --- |
| `dashboard/` | Dashboard operasional | `DashboardPage.tsx` |
| `pos/` | Kasir/POS dan riwayat penjualan | `PosPage.tsx` |
| `inventory/` | Inventaris dan stok | `InventoryPage.tsx` |
| `service/` | Penerimaan, daftar, dan status servis | `ServicePage.tsx` |
| `finance/` | Keuangan PPOB dan HP bekas | `FinancePage.tsx` |
| `smartphone-spk/` | Rekomendasi smartphone menggunakan SAW | `SpkPage.tsx` |
| `design-system/` | Halaman contoh komponen visual internal | `DesignSystemPage.tsx` |

## Struktur tiap modul

Modul yang memiliki file tambahan memakai pola berikut:

```text
nama-modul/
├── NamaModulPage.tsx     # halaman/rute utama
├── components/           # komponen yang hanya dipakai modul tersebut
├── hooks/                # state dan aturan interaksi modul
└── data/                 # data dummy khusus modul, bila diperlukan
```

Route seluruh halaman terdaftar pada `src/app/router/index.tsx`.
