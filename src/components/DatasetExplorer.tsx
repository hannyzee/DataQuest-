/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dataset Explorer component: Browse teen datasets, inspect columns & descriptions,
 * preview rows, and load directly into the Python code runner.
 */

import React, { useState } from 'react';
import { TEEN_DATASETS, DatasetMeta } from '../data/teenDatasets';
import { Database, Play, FileText, HelpCircle, ArrowRight, Music, Swords, Smartphone, Sparkles, Rocket } from 'lucide-react';

interface DatasetExplorerProps {
  onLoadDatasetIntoPlayground: (dataset: DatasetMeta) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  onLoadDatasetIntoPlayground
}) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(TEEN_DATASETS[0].id);
  const activeDataset = TEEN_DATASETS.find(d => d.id === selectedDatasetId) || TEEN_DATASETS[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'music': return <Music className="w-4 h-4 text-emerald-500" />;
      case 'gaming': return <Swords className="w-4 h-4 text-sky-500" />;
      case 'social': return <Smartphone className="w-4 h-4 text-pink-500" />;
      case 'anime': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'space': return <Rocket className="w-4 h-4 text-indigo-500" />;
      default: return <Database className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>5 Curated Offline Datasets</span>
            <span aria-hidden="true">·</span>
            <span>Real-World Analytics</span>
            <span aria-hidden="true">·</span>
            <span>CSV & JSON Ready</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Teen Data Science Repositories
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            High-interest, genuine telemetry datasets tailored for gaming weapon balance, streaming music virality, creator algorithm mechanics, and space probes.
          </p>
        </div>
      </div>

      {/* Dataset Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {TEEN_DATASETS.map((ds) => {
          const isSelected = ds.id === selectedDatasetId;
          return (
            <div
              key={ds.id}
              onClick={() => setSelectedDatasetId(ds.id)}
              className={`group flex flex-col rounded-xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-sky-600 bg-sky-50/40 shadow-xs ring-1 ring-sky-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 bg-slate-100">
                <img
                  src={ds.image}
                  alt={ds.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                {getCategoryIcon(ds.category)}
                <span className="capitalize">{ds.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{ds.records.length} rows</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {ds.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {ds.tagline}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Dataset Detailed Showcase */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono">{activeDataset.filename}</span>
              <span aria-hidden="true">·</span>
              <span>{activeDataset.records.length} records</span>
              <span aria-hidden="true">·</span>
              <span>{activeDataset.columns.length} features</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeDataset.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {activeDataset.description}
            </p>
          </div>

          <button
            onClick={() => onLoadDatasetIntoPlayground(activeDataset)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open in Python Playground</span>
          </button>
        </div>

        {/* Investigative Questions */}
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Questions Teen Data Analysts Can Answer With This Data:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
            {activeDataset.starterQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-600 tabular-nums">0{idx + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Dictionary / Features */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            Features & Data Dictionary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeDataset.columns.map((col) => (
              <div key={col.key} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-900">{col.key}</span>
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {col.type}{col.unit ? ` (${col.unit})` : ''}
                  </span>
                </div>
                <div className="text-slate-600 leading-normal">{col.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Table Preview (First 5 Rows) */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            Raw CSV Preview (Top 5 Rows)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  {activeDataset.columns.map((c) => (
                    <th key={c.key} className="py-2.5 px-3 whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeDataset.records.slice(0, 5).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70">
                    {activeDataset.columns.map((c) => (
                      <td key={c.key} className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {typeof row[c.key] === 'boolean' ? (
                          <span className={row[c.key] ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                            {String(row[c.key])}
                          </span>
                        ) : typeof row[c.key] === 'number' ? (
                          <span className="font-mono tabular-nums">{row[c.key]}</span>
                        ) : (
                          <span>{String(row[c.key] ?? '')}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
