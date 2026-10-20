import React from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
  title?: string;
}

/**
 * Simple SVG bar chart — no external dependency.
 * Adapts to container width, respects reduced-motion.
 */
export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  height = 140,
  color = '#183D2A',
  formatValue = (v) => String(v),
  title,
}) => {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-text-muted rounded-control border border-dashed border-border"
        style={{ height }}
      >
        Belum ada data
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.floor(100 / data.length);
  const gap = 4;
  const svgPaddingX = 4;
  const svgPaddingY = 24; // top for value labels
  const bottomPad = 24; // bottom for x labels
  const totalH = height + svgPaddingY + bottomPad;

  return (
    <div role="img" aria-label={title ?? 'Grafik batang'}>
      {title && <p className="text-xs text-text-muted mb-2 font-medium">{title}</p>}
      <svg
        viewBox={`0 0 ${100 * data.length + svgPaddingX * 2} ${totalH}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        aria-hidden="true"
      >
        {data.map((d, i) => {
          const barH = Math.max(2, (d.value / maxVal) * height);
          const x = svgPaddingX + i * (barWidth + gap) + gap / 2;
          const y = svgPaddingY + (height - barH);
          const w = barWidth - gap;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx={4}
                fill={color}
                opacity={0.85}
              />
              {/* Value label */}
              <text
                x={x + w / 2}
                y={svgPaddingY + height - barH - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#647566"
                fontFamily="Inter, sans-serif"
              >
                {formatValue(d.value)}
              </text>
              {/* X-axis label */}
              <text
                x={x + w / 2}
                y={svgPaddingY + height + 14}
                textAnchor="middle"
                fontSize="9"
                fill="#647566"
                fontFamily="Inter, sans-serif"
              >
                {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
              </text>
            </g>
          );
        })}
        {/* Baseline */}
        <line
          x1={svgPaddingX}
          y1={svgPaddingY + height}
          x2={100 * data.length + svgPaddingX}
          y2={svgPaddingY + height}
          stroke="#E1E8DE"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};
