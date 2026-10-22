import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { SAWNormalizedItem, CriteriaCode } from '@/types';
import { sawCriteria } from '@/data/smartphones';
import { Trophy, Medal } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

interface SpkResultsProps {
  results: SAWNormalizedItem[];
}

const CRITERIA_CODES: CriteriaCode[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return null;
};

export const SpkResults: React.FC<SpkResultsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="py-8 text-center text-sm text-text-muted">
          Tidak ada alternatif aktif yang dapat dihitung.
        </CardContent>
      </Card>
    );
  }

  const topThree = results.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top 3 cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-deep-green" />
            <CardTitle className="text-deep-green">
              Top {Math.min(3, results.length)} Rekomendasi Smartphone
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {topThree.map((item) => (
              <div
                key={item.smartphoneId}
                className="rounded-card border border-border bg-page-bg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Peringkat #{item.rank}
                  </span>
                  {rankIcon(item.rank)}
                </div>
                <p className="text-sm font-bold text-deep-green leading-snug">{item.model}</p>
                <p className="text-xs text-text-muted capitalize">{item.condition.replace('_', ' ')} · {formatRupiah(item.price)}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/60">
                  <span className="text-xs text-text-muted">Skor SAW</span>
                  <Badge variant="brand">{item.finalScore.toFixed(4)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full ranking + normalized scores table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-deep-green">Ranking Lengkap &amp; Kontribusi Kriteria</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFCF9]">
                <TableHead className="text-xs font-semibold text-deep-green py-2.5 px-3">#</TableHead>
                <TableHead className="text-xs font-semibold text-deep-green py-2.5 px-3">Model</TableHead>
                <TableHead className="text-xs font-semibold text-deep-green py-2.5 px-3">Unit</TableHead>
                {CRITERIA_CODES.map((code) => {
                  const crit = sawCriteria.find((c) => c.code === code);
                  return (
                    <TableHead
                      key={code}
                      className="text-xs font-semibold text-deep-green py-2.5 px-3 whitespace-nowrap"
                      title={crit?.name}
                    >
                      <span className="font-mono">{code}</span>
                      <span className="ml-1 text-[10px] text-text-muted font-normal">
                        ({crit?.attribute === 'cost' ? 'Cost' : 'Ben.'})
                      </span>
                    </TableHead>
                  );
                })}
                <TableHead className="text-xs font-semibold text-deep-green py-2.5 px-3">
                  Skor Akhir
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((item) => (
                <TableRow key={item.smartphoneId} className="hover:bg-page-bg/60">
                  <TableCell className="py-2 px-3 font-semibold text-deep-green">
                    {item.rank}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-sm text-deep-green whitespace-nowrap">
                    {item.model}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-text-muted whitespace-nowrap">
                    <span className="capitalize">{item.condition.replace('_', ' ')}</span><br />{formatRupiah(item.price)}
                  </TableCell>
                  {CRITERIA_CODES.map((code) => (
                    <TableCell key={code} className="py-2 px-3 text-xs font-mono text-text-muted">
                      <span title={`r_ij: ${item.normalizedScores[code]?.toFixed(4)}`}>
                        {item.weightedScores[code]?.toFixed(4)}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="py-2 px-3">
                    <Badge variant={item.rank === 1 ? 'brand' : 'neutral'}>
                      {item.finalScore.toFixed(4)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-[10px] text-text-muted px-4 pb-3 pt-1">
            Nilai di kolom kriteria adalah skor terbobot (w_j × r_ij). Hover untuk melihat nilai normalisasi (r_ij).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
