/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Visual Data Query Builder:
 * Bridges visual thinking and Python programming by generating clean, real Python code
 * based on visual selections, with instant execution in the playground.
 */

import React, { useState } from 'react';
import { TEEN_DATASETS, DatasetMeta } from '../data/teenDatasets';
import { Sliders, Play, Code2, Sparkles, Filter, ArrowDownUp } from 'lucide-react';

interface VisualQueryBuilderProps {
  onRunGeneratedCode: (code: string) => void;
}

export const VisualQueryBuilder: React.FC<VisualQueryBuilderProps> = ({
  onRunGeneratedCode
}) => {
  const [datasetId, setDatasetId] = useState<string>('spotify');
  const dataset = TEEN_DATASETS.find(d => d.id === datasetId) || TEEN_DATASETS[0];

  const numCols = dataset.columns.filter(c => c.type === 'number');
  const allCols = dataset.columns;

  const [filterCol, setFilterCol] = useState<string>(numCols[0]?.key || allCols[0].key);
  const [operator, setOperator] = useState<string>('>=');
  const [filterVal, setFilterVal] = useState<number>(1000);
  const [sortCol, setSortCol] = useState<string>(numCols[0]?.key || allCols[0].key);
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'bar' | 'scatter' | 'hist'>('bar');
  const [chartYCol, setChartYCol] = useState<string>(numCols[0]?.key || '');

  // Reset filter values when dataset changes
  React.useEffect(() => {
    const curNumCols = dataset.columns.filter(c => c.type === 'number');
    if (curNumCols.length > 0) {
      setFilterCol(curNumCols[0].key);
      setSortCol(curNumCols[0].key);
      setChartYCol(curNumCols[0].key);
      if (dataset.id === 'spotify') setFilterVal(1000);
      else if (dataset.id === 'gaming') setFilterVal(300);
      else if (dataset.id === 'social') setFilterVal(500);
      else setFilterVal(50);
    }
  }, [datasetId]);

  // Generate Python Code
  const generatedCode = `import pandas as pd
import matplotlib.pyplot as plt

# 1. Load the dataset
df = pd.read_csv('${dataset.filename}')

# 2. Filter rows where ${filterCol} ${operator} ${filterVal}
filtered_df = df[df['${filterCol}'] ${operator} ${filterVal}]
print(f"Matched {len(filtered_df)} records out of {len(df)} total.")

# 3. Sort by ${sortCol} (${sortAscending ? 'Lowest first' : 'Highest first'})
sorted_df = filtered_df.sort_values(by='${sortCol}', ascending=${sortAscending ? 'True' : 'False'})
print("\\nTop Results:")
print(sorted_df[['${dataset.columns[0].key}', '${sortCol}']].head(5))

# 4. Generate ${chartType.toUpperCase()} Chart
top5 = sorted_df.head(5)
${
  chartType === 'bar'
    ? `plt.bar(top5['${dataset.columns[0].key}'], top5['${chartYCol}'], color='#0284C7')
plt.title("Top ${dataset.name}: ${chartYCol}")
plt.ylabel("${chartYCol}")`
    : chartType === 'scatter'
    ? `plt.scatter(df['${filterCol}'], df['${chartYCol}'], color='#0284C7')
plt.title("${filterCol} vs ${chartYCol}")
plt.xlabel("${filterCol}")
plt.ylabel("${chartYCol}")`
    : `plt.hist(df['${chartYCol}'], bins=8, color='#0284C7')
plt.title("Distribution of ${chartYCol}")
plt.xlabel("${chartYCol}")
plt.ylabel("Frequency")`
}
plt.show()`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Visual-to-Code Bridge</span>
            <span aria-hidden="true">·</span>
            <span>Zero Coding Anxiety</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Visual Data Query Builder
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Tweak visual filters and see how clean Python Pandas and Matplotlib code is generated in real time.
          </p>
        </div>

        <button
          onClick={() => onRunGeneratedCode(generatedCode)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Generated Code in Lab</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dataset selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">1. Select Teen Dataset</label>
            <select
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-sky-600 cursor-pointer"
            >
              {TEEN_DATASETS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.records.length} rows)
                </option>
              ))}
            </select>
          </div>

          {/* Filter condition */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-1">
              <Filter className="w-3.5 h-3.5 text-sky-600" />
              <span>2. Filter Criterion</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={filterCol}
                onChange={(e) => setFilterCol(e.target.value)}
                className="col-span-1 rounded-md border border-slate-200 bg-white p-1.5 text-xs focus:outline-sky-600"
              >
                {numCols.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>

              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="col-span-1 rounded-md border border-slate-200 bg-white p-1.5 text-xs focus:outline-sky-600 font-mono text-center"
              >
                <option value=">=">&gt;= (At least)</option>
                <option value="<=">&lt;= (At most)</option>
                <option value=">">&gt; (Greater)</option>
                <option value="<">&lt; (Less)</option>
                <option value="==">== (Equals)</option>
              </select>

              <input
                type="number"
                value={filterVal}
                onChange={(e) => setFilterVal(Number(e.target.value))}
                className="col-span-1 rounded-md border border-slate-200 bg-white p-1.5 text-xs font-mono focus:outline-sky-600"
              />
            </div>
          </div>

          {/* Sort condition */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-1">
              <ArrowDownUp className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Sorting Leaderboard</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={sortCol}
                onChange={(e) => setSortCol(e.target.value)}
                className="rounded-md border border-slate-200 bg-white p-1.5 text-xs focus:outline-sky-600"
              >
                {numCols.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>

              <select
                value={sortAscending ? 'asc' : 'desc'}
                onChange={(e) => setSortAscending(e.target.value === 'asc')}
                className="rounded-md border border-slate-200 bg-white p-1.5 text-xs focus:outline-sky-600"
              >
                <option value="desc">Highest First (Descending)</option>
                <option value="asc">Lowest First (Ascending)</option>
              </select>
            </div>
          </div>

          {/* Chart visual type */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <label className="text-xs font-semibold text-slate-900">4. Visual Plot Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['bar', 'scatter', 'hist'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setChartType(type)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center capitalize transition-colors cursor-pointer ${
                    chartType === type
                      ? 'border-sky-600 bg-sky-50 text-sky-700 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type} Plot
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Generated Python Code View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-[#0F172A] p-4 text-xs font-mono text-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Generated Python Code (Live)</span>
            </div>
            <span className="text-[11px] text-slate-400">100% Valid Python 3</span>
          </div>

          <pre className="flex-1 overflow-x-auto text-[11px] leading-[1.6] text-slate-300 font-mono">
            {generatedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
