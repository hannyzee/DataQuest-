/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Output Stage for Python Execution:
 * Displays Terminal Console, DataFrame Table Viewer, Matplotlib Charts, and Summary Stats.
 */

import React, { useState } from 'react';
import { ExecutionResult } from '../engine/pythonRunner';
import { ChartRenderer } from './ChartRenderer';
import { DataFrame } from '../engine/dataframe';
import { Terminal, Table as TableIcon, BarChart2, Calculator, AlertCircle, CheckCircle2, Search, ArrowUpDown } from 'lucide-react';

interface OutputStageProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  activeDatasetName?: string;
}

export const OutputStage: React.FC<OutputStageProps> = ({
  result,
  isRunning,
  activeDatasetName = 'Active Session'
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'table' | 'charts' | 'stats'>('console');
  const [tableSearch, setTableSearch] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  // Auto-switch tab to charts if user rendered a chart
  React.useEffect(() => {
    if (result && result.charts.length > 0) {
      setActiveTab('charts');
    } else if (result && result.tables.length > 0 && result.stdout.length === 0) {
      setActiveTab('table');
    }
  }, [result]);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-slate-200 bg-white p-8 text-center min-h-[360px]">
        <div className="h-10 w-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h4 className="text-base font-semibold text-slate-800">Executing Python in Browser...</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Processing data analysis, computing summary statistics, and rendering charts.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center min-h-[360px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-3">
          <Terminal className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">Python Results Workspace</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          Hit <span className="font-semibold text-slate-700">Run (Ctrl+Enter)</span> to see console output, data table inspector, and matplotlib charts here.
        </p>
      </div>
    );
  }

  // Active DataFrame for table viewer (either explicit DataFrame or first generated)
  const activeDf: DataFrame | undefined = result.tables[0];
  const chartCount = result.charts.length;

  // Compute table data with search and sorting
  let filteredRecords = activeDf ? activeDf.records : [];
  if (tableSearch.trim()) {
    const q = tableSearch.toLowerCase();
    filteredRecords = filteredRecords.filter(r => 
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }

  if (sortCol && activeDf) {
    filteredRecords = [...filteredRecords].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA === valB) return 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const stats = activeDf ? activeDf.describe() : {};

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'console' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
            {result.stdout.length > 0 && (
              <span className="text-[10px] text-slate-400 tabular-nums">({result.stdout.length})</span>
            )}
          </button>

          {activeDf && (
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
              <span className="text-[10px] text-slate-400 tabular-nums">({activeDf.records.length})</span>
            </button>
          )}

          {chartCount > 0 && (
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'charts' ? 'bg-white text-sky-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Plots</span>
              <span className="text-[10px] text-sky-600 font-semibold tabular-nums">({chartCount})</span>
            </button>
          )}

          {activeDf && Object.keys(stats).length > 0 && (
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'stats' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Statistics</span>
            </button>
          )}
        </div>

        {/* Status / Timing */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="font-mono tabular-nums">{result.executionTimeMs}ms</span>
          <span aria-hidden="true">·</span>
          {result.success ? (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Error</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Error Callout for Beginners */}
        {result.error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-800 text-sm">{result.error.type}</span>
                  <span aria-hidden="true" className="text-rose-300">·</span>
                  <span className="text-rose-700 font-mono">{result.error.message}</span>
                </div>
                <div className="rounded-lg bg-white/80 p-2.5 border border-rose-100 text-slate-700">
                  <div className="font-semibold text-rose-900 mb-0.5">Quick Fix Tip for Coders:</div>
                  <p>{result.error.tip}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Terminal Console */}
        {activeTab === 'console' && (
          <div className="flex flex-col h-full">
            {result.stdout.length === 0 && !result.error ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Code executed with no output. Did you forget to call <code className="text-sky-600 bg-slate-100 px-1 py-0.5 rounded font-mono">print()</code>?
              </div>
            ) : (
              <div className="font-mono text-xs rounded-lg bg-[#0F172A] p-4 text-slate-200 space-y-2 overflow-x-auto min-h-[220px]">
                {result.stdout.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    <span className="select-none text-slate-600 mr-2">&gt;&gt;&gt;</span>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive Data Table */}
        {activeTab === 'table' && activeDf && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Filter rows..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:outline-sky-600"
                />
              </div>

              <div className="text-xs text-slate-500 tabular-nums">
                Showing {filteredRecords.length} of {activeDf.records.length} rows
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-slate-400">#</th>
                    {activeDf.columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => {
                          if (sortCol === col) {
                            setSortAsc(!sortAsc);
                          } else {
                            setSortCol(col);
                            setSortAsc(true);
                          }
                        }}
                        className="py-2.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col}</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRecords.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-400 tabular-nums">
                        {(page - 1) * rowsPerPage + rIdx + 1}
                      </td>
                      {activeDf.columns.map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className="py-2 px-3 whitespace-nowrap text-slate-700">
                            {typeof val === 'number' ? (
                              <span className="font-mono tabular-nums">{val}</span>
                            ) : typeof val === 'boolean' ? (
                              <span className={val ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                                {String(val)}
                              </span>
                            ) : (
                              <span>{String(val ?? '')}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Page {page} of {totalPages}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Matplotlib Charts */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {result.charts.map((chart, idx) => (
              <ChartRenderer key={idx} chart={chart} />
            ))}
          </div>
        )}

        {/* Tab 4: Summary Statistics */}
        {activeTab === 'stats' && activeDf && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              Descriptive summary math for numerical columns (equivalent to <code className="font-mono text-sky-600">df.describe()</code>):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(stats).map(([col, s]) => (
                <div key={col} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                    <span>{col}</span>
                    <span className="text-[11px] font-mono text-slate-400">n={s.count}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs">
                    <div className="text-slate-500">Mean:</div>
                    <div className="font-mono text-right font-medium text-slate-800 tabular-nums">{s.mean}</div>
                    <div className="text-slate-500">Median:</div>
                    <div className="font-mono text-right font-medium text-slate-800 tabular-nums">{s.p50}</div>
                    <div className="text-slate-500">Min:</div>
                    <div className="font-mono text-right text-slate-600 tabular-nums">{s.min}</div>
                    <div className="text-slate-500">Max:</div>
                    <div className="font-mono text-right text-slate-600 tabular-nums">{s.max}</div>
                    <div className="text-slate-500">Std Dev:</div>
                    <div className="font-mono text-right text-slate-600 tabular-nums">{s.std}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
