// src/features/finance/components/FinanceDashboard.tsx
import React, { useMemo, useState } from "react";
import { useFinanceStore } from "@/features/finance/hooks/useFinanceStore";
import { formatRupiah } from "@/lib/currency";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Table } from "@/components/ui/Table";
import { SimpleBarChart } from "@/components/ui/SimpleBarChart";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

/**
 * Finance dashboard – provides an overview of cash flow (counter vs PPOB),
 * profit from used‑phone sales, and allows period‑based filtering.
 * All UI follows the design tokens defined in UI‑GUIDELINE.md.
 */
export const FinanceDashboard: React.FC = () => {
  const {
    cashEntries,
    usedPhones,
    filterCashByPeriod,
    resetAll,
  } = useFinanceStore();

  // Period filter state (ISO date strings)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Compute filtered cash entries if a period is set
  const displayedCash = useMemo(() => {
    if (startDate && endDate) {
      return filterCashByPeriod(startDate, endDate);
    }
    return cashEntries;
  }, [cashEntries, filterCashByPeriod, startDate, endDate]);

  // Aggregate totals
  const totalIn = useMemo(
    () => displayedCash.filter((c) => c.flow === "in").reduce((s, c) => s + c.amount, 0),
    [displayedCash],
  );
  const totalOut = useMemo(
    () => displayedCash.filter((c) => c.flow === "out").reduce((s, c) => s + c.amount, 0),
    [displayedCash],
  );
  const netCash = totalIn - totalOut;

  const totalProfit = useMemo(
    () =>
      usedPhones
        .filter((p) => p.isSold && typeof p.netProfit === "number")
        .reduce((s, p) => s + (p.netProfit ?? 0), 0),
    [usedPhones],
  );

  // Table columns for cash entries
  const cashColumns = [
    { header: "Tanggal", accessor: "date", render: (v: string) => new Date(v).toLocaleDateString() },
    { header: "Tipe Kas", accessor: "cashType" },
    { header: "Arah", accessor: "flow" },
    { header: "Jumlah", accessor: "amount", render: (v: number) => formatRupiah(v) },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
  ];

  // Table columns for used‑phone records
  const phoneColumns = [
    { header: "Brand", accessor: "brand" },
    { header: "Model", accessor: "model" },
    { header: "Beli", accessor: "purchasePrice", render: (v: number) => formatRupiah(v) },
    { header: "Perbaikan", accessor: "repairSparepartCost", render: (v: number) => formatRupiah(v) },
    { header: "Target Jual", accessor: "targetSellingPrice", render: (v: number) => formatRupiah(v) },
    { header: "Terjual?", accessor: "isSold", render: (v: boolean) => (v ? "Ya" : "Tidak") },
    { header: "Profit", accessor: "netProfit", render: (v?: number) => (v !== undefined ? formatRupiah(v) : "-") },
  ];

  // Simple cash flow chart data (group by date)
  const cashChartData = useMemo(() => {
    const map: Record<string, number> = {};
    displayedCash.forEach((c) => {
      const d = new Date(c.date).toISOString().slice(0, 10);
      map[d] = (map[d] ?? 0) + (c.flow === "in" ? c.amount : -c.amount);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ label: date.slice(5), value }));
  }, [displayedCash]);

  return (
    <div className="space-y-6">
      {/* Header and quick actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard Keuangan</h1>
        <Button variant="danger" onClick={resetAll}>
          Reset Data
        </Button>
      </div>

      {/* Period filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Periode</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input
            type="date"
            label="Mulai"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="Selesai"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="brand"
            onClick={() => {
              if (!startDate || !endDate) {
                // clear filter if dates missing
                setStartDate("");
                setEndDate("");
              }
            }}
          >
            Terapkan
          </Button>
          <Button variant="secondary" onClick={() => {
            setStartDate("");
            setEndDate("");
          }}>Reset Filter</Button>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Kas Masuk"
          value={formatRupiah(totalIn)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Kas Keluar"
          value={formatRupiah(totalOut)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: `${((totalOut / (totalIn || 1)) * 100).toFixed(1)}%`, isPositive: false }}
        />
        <StatCard
          title="Net Cash"
          value={formatRupiah(netCash)}
          icon={<Calendar className="w-5 h-5" />}
          trend={{ value: netCash >= 0 ? "Positif" : "Negatif", isPositive: netCash >= 0 }}
        />
        <StatCard
          title="Profit HP Bekas"
          value={formatRupiah(totalProfit)}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Cash flow chart */}
      <Card>
        <CardHeader>
          <CardTitle>Alur Kas (Masuk‑Keluar) per Hari</CardTitle>
        </CardHeader>
        <CardContent>
          {cashChartData.length === 0 ? (
            <p className="text-sm text-text-muted">Tidak ada data kas untuk periode ini.</p>
          ) : (
            <SimpleBarChart data={cashChartData} height={140} color="#287A45" />
          )}
        </CardContent>
      </Card>

      {/* Cash entries table */}
      <Card>
        <CardHeader>
          <CardTitle>Entri Kas ({displayedCash.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={cashColumns} data={displayedCash} />
        </CardContent>
      </Card>

      {/* Used‑phone table */}
      <Card>
        <CardHeader>
          <CardTitle>HP Bekas ({usedPhones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table columns={phoneColumns} data={usedPhones} />
        </CardContent>
      </Card>
    </div>
  );
};
