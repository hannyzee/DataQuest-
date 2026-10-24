/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive SVG Chart Renderer for Matplotlib Python output.
 * Supports bar charts, line plots, scatter plots, and histograms.
 */

import React, { useState } from 'react';
import { ChartData } from '../engine/pythonRunner';
import { Download, ZoomIn, Info } from 'lucide-react';

interface ChartRendererProps {
  chart: ChartData;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chart }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: string | number; x: number; y: number } | null>(null);

  const width = 640;
  const height = 360;
  const padding = { top: 50, right: 40, bottom: 65, left: 65 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Render Bar Chart
  const renderBarChart = () => {
    const labels = chart.labels || [];
    const values = (chart.data || []).map(Number);
    if (values.length === 0) return null;

    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(0, ...values);
    const range = maxVal - minVal;
    const barWidth = Math.min(48, Math.max(16, (plotWidth / values.length) * 0.7));
    const step = plotWidth / values.length;
    const defaultColor = chart.colors?.[0] || '#0284C7';

    return (
      <g>
        {/* Y Axis Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const val = minVal + range * pct;
          const y = padding.top + plotHeight - pct * plotHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + plotWidth}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] font-mono fill-slate-500"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(val % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {values.map((val, idx) => {
          const barHeight = Math.max(2, (val / range) * plotHeight);
          const x = padding.left + idx * step + (step - barWidth) / 2;
          const y = padding.top + plotHeight - barHeight;
          const label = labels[idx] || `Item ${idx + 1}`;
          const isHovered = hoveredPoint?.label === label;

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={chart.colors?.[idx % (chart.colors?.length || 1)] || defaultColor}
                opacity={isHovered ? 1 : 0.9}
                className="transition-all duration-150 cursor-pointer hover:opacity-100"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredPoint({
                    label,
                    value: val,
                    x: x + barWidth / 2,
                    y
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X Axis Labels */}
              <text
                x={x + barWidth / 2}
                y={padding.top + plotHeight + 18}
                textAnchor="end"
                transform={`rotate(-35, ${x + barWidth / 2}, ${padding.top + plotHeight + 18})`}
                className="text-[10px] font-medium fill-slate-600 truncate max-w-[80px]"
              >
                {label.length > 12 ? label.slice(0, 11) + '…' : label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // Render Scatter Plot
  const renderScatterPlot = () => {
    const xVals = (chart.xData || []).map(Number);
    const yVals = (chart.yData || []).map(Number);
    if (xVals.length === 0 || yVals.length === 0) return null;

    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals, minX + 1);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals, minY + 1);

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const pointColor = chart.colors?.[0] || '#0284C7';

    return (
      <g>
        {/* Grids */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padding.top + plotHeight - pct * plotHeight;
          const valY = minY + rangeY * pct;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + plotWidth} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[11px] font-mono fill-slate-500">
                {valY.toFixed(valY % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const x = padding.left + pct * plotWidth;
          const valX = minX + rangeX * pct;
          return (
            <g key={i}>
              <line x1={x} y1={padding.top} x2={x} y2={padding.top + plotHeight} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={x} y={padding.top + plotHeight + 20} textAnchor="middle" className="text-[11px] font-mono fill-slate-500">
                {valX.toFixed(valX % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {/* Scatter Points */}
        {xVals.map((vx, idx) => {
          const vy = yVals[idx] ?? 0;
          const cx = padding.left + ((vx - minX) / rangeX) * plotWidth;
          const cy = padding.top + plotHeight - ((vy - minY) / rangeY) * plotHeight;
          const isHovered = hoveredPoint?.label === `Point ${idx + 1}`;

          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={isHovered ? 7 : 5}
              fill={pointColor}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              className="cursor-pointer transition-all duration-150 hover:r-7"
              onMouseEnter={() => setHoveredPoint({
                label: `(${vx}, ${vy})`,
                value: `X: ${vx}, Y: ${vy}`,
                x: cx,
                y: cy
              })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
      </g>
    );
  };

  // Render Line Plot
  const renderLinePlot = () => {
    const xVals = (chart.xData || chart.labels || []).map(String);
    const yVals = (chart.yData || chart.data || []).map(Number);
    if (yVals.length === 0) return null;

    const minY = Math.min(0, ...yVals);
    const maxY = Math.max(...yVals, 1);
    const rangeY = maxY - minY;
    const stepX = plotWidth / Math.max(1, yVals.length - 1);
    const lineColor = chart.colors?.[0] || '#0284C7';

    const points = yVals.map((vy, i) => {
      const cx = padding.left + i * stepX;
      const cy = padding.top + plotHeight - ((vy - minY) / rangeY) * plotHeight;
      return { x: cx, y: cy, val: vy, label: xVals[i] || `${i}` };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <g>
        {/* Y Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padding.top + plotHeight - pct * plotHeight;
          const valY = minY + rangeY * pct;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + plotWidth} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[11px] font-mono fill-slate-500">
                {valY.toFixed(valY % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {/* Path line */}
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#FFFFFF"
            stroke={lineColor}
            strokeWidth={2}
            className="cursor-pointer hover:r-6 transition-all"
            onMouseEnter={() => setHoveredPoint({
              label: p.label,
              value: p.val,
              x: p.x,
              y: p.y
            })}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
      </g>
    );
  };

  // Render Histogram
  const renderHistogram = () => {
    const rawVals = (chart.data || []).map(Number).filter(v => !isNaN(v));
    if (rawVals.length === 0) return null;

    const min = Math.min(...rawVals);
    const max = Math.max(...rawVals);
    const numBins = 7;
    const binSize = (max - min) / numBins || 1;
    const bins: { count: number; min: number; max: number }[] = [];

    for (let i = 0; i < numBins; i++) {
      bins.push({ count: 0, min: min + i * binSize, max: min + (i + 1) * binSize });
    }

    rawVals.forEach(v => {
      const idx = Math.min(numBins - 1, Math.floor((v - min) / binSize));
      if (bins[idx]) bins[idx].count++;
    });

    const maxCount = Math.max(...bins.map(b => b.count), 1);
    const step = plotWidth / numBins;
    const barColor = chart.colors?.[0] || '#EC4899';

    return (
      <g>
        {/* Y Grid */}
        {[0, 0.5, 1].map((pct, i) => {
          const y = padding.top + plotHeight - pct * plotHeight;
          const valY = Math.round(maxCount * pct);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + plotWidth} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[11px] font-mono fill-slate-500">
                {valY}
              </text>
            </g>
          );
        })}

        {/* Bins */}
        {bins.map((bin, i) => {
          const h = (bin.count / maxCount) * plotHeight;
          const x = padding.left + i * step + 2;
          const y = padding.top + plotHeight - h;
          const w = step - 4;
          const label = `${bin.min.toFixed(0)}-${bin.max.toFixed(0)}`;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={3}
                fill={barColor}
                opacity={0.88}
                className="hover:opacity-100 transition-opacity cursor-pointer"
                onMouseEnter={() => setHoveredPoint({
                  label: `Range [${bin.min.toFixed(1)} - ${bin.max.toFixed(1)}]`,
                  value: `${bin.count} items`,
                  x: x + w / 2,
                  y
                })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={x + w / 2}
                y={padding.top + plotHeight + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const downloadSVG = () => {
    const svgElem = document.getElementById('python-chart-svg');
    if (!svgElem) return;
    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.title || 'python_chart'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-semibold text-slate-900">
            {chart.title || 'Python Matplotlib Plot'}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Type: {chart.type.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>Generated via client Python runtime</span>
          </div>
        </div>
        <button
          onClick={downloadSVG}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Download Vector SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export SVG</span>
        </button>
      </div>

      <div className="relative flex justify-center py-2 overflow-x-auto">
        <svg
          id="python-chart-svg"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[640px] h-auto select-none"
        >
          {/* Chart Title */}
          {chart.title && (
            <text
              x={width / 2}
              y={28}
              textAnchor="middle"
              className="text-[14px] font-semibold fill-slate-800"
            >
              {chart.title}
            </text>
          )}

          {/* Y Axis Label */}
          {chart.ylabel && (
            <text
              x={-(height / 2)}
              y={18}
              textAnchor="middle"
              transform="rotate(-90)"
              className="text-[12px] font-medium fill-slate-600"
            >
              {chart.ylabel}
            </text>
          )}

          {/* X Axis Label */}
          {chart.xlabel && (
            <text
              x={padding.left + plotWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="text-[12px] font-medium fill-slate-600"
            >
              {chart.xlabel}
            </text>
          )}

          {/* Render specific chart type */}
          {chart.type === 'bar' && renderBarChart()}
          {chart.type === 'scatter' && renderScatterPlot()}
          {chart.type === 'line' && renderLinePlot()}
          {chart.type === 'hist' && renderHistogram()}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-md transition-all duration-75"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="font-semibold">{hoveredPoint.label}</div>
            <div className="font-mono text-emerald-400">{hoveredPoint.value}</div>
          </div>
        )}
      </div>
    </div>
  );
};
