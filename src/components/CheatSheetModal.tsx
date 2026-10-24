/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Comprehensive Python Data Analysis Cheat Sheet for Teens.
 * Features searchable code recipes, syntax tips, and copy-pasteable snippets.
 */

import React, { useState } from 'react';
import { Search, Copy, Check, BookOpen, Terminal, Sparkles, Filter, BarChart } from 'lucide-react';

interface CheatSheetProps {
  onInsertCode?: (snippet: string) => void;
}

interface Snippet {
  category: 'pandas' | 'matplotlib' | 'basics' | 'stats' | 'errors';
  title: string;
  description: string;
  code: string;
}

const SNIPPETS: Snippet[] = [
  {
    category: 'pandas',
    title: 'Load CSV Dataset',
    description: 'Read a CSV file into a Pandas DataFrame table.',
    code: `import pandas as pd\ndf = pd.read_csv('spotify_hits.csv')`
  },
  {
    category: 'pandas',
    title: 'Peek at First 5 Rows',
    description: 'Quickly inspect the top 5 records.',
    code: `print(df.head())`
  },
  {
    category: 'pandas',
    title: 'Filter Rows by Number',
    description: 'Keep only rows that satisfy a condition.',
    code: `high_dps = df[df['dps'] >= 350]\nprint(high_dps)`
  },
  {
    category: 'pandas',
    title: 'Multi-Condition Search',
    description: 'Match two criteria at the same time.',
    code: `party_bangers = df[(df['danceability'] >= 80) and (df['energy'] >= 75)]`
  },
  {
    category: 'pandas',
    title: 'Sort Leaderboard',
    description: 'Sort highest to lowest (descending) or lowest to highest.',
    code: `top_streamers = df.sort_values(by='streams_millions', ascending=False)\nprint(top_streamers.head(5))`
  },
  {
    category: 'pandas',
    title: 'Group By & Average',
    description: 'Group rows by a category and compute group averages.',
    code: `genre_averages = df.groupby('genre').mean('streams_millions')\nprint(genre_averages)`
  },
  {
    category: 'matplotlib',
    title: 'Create a Bar Chart',
    description: 'Compare values across categories.',
    code: `import matplotlib.pyplot as plt\nplt.bar(df['track_name'].head(5), df['streams_millions'].head(5), color='#0284C7')\nplt.title('Top 5 Songs')\nplt.ylabel('Streams (M)')\nplt.show()`
  },
  {
    category: 'matplotlib',
    title: 'Scatter Plot (Correlation)',
    description: 'Plot two variables against each other to find patterns.',
    code: `import matplotlib.pyplot as plt\nplt.scatter(df['range_meters'], df['damage_per_shot'], color='#10B981')\nplt.title('Range vs Damage')\nplt.xlabel('Range (m)')\nplt.ylabel('Hit Damage')\nplt.show()`
  },
  {
    category: 'matplotlib',
    title: 'Histogram (Distribution)',
    description: 'Visualize frequency distributions across number bins.',
    code: `import matplotlib.pyplot as plt\nplt.hist(df['best_post_hour'], bins=8, color='#EC4899')\nplt.title('Best Posting Hours')\nplt.xlabel('Hour of Day')\nplt.show()`
  },
  {
    category: 'basics',
    title: 'Lists & Slices',
    description: 'Store and slice sequences of items.',
    code: `weapons = ["Vandal", "Phantom", "Operator", "Sheriff"]\nprint(weapons[0])    # First item\nprint(weapons[-1])   # Last item\nprint(weapons[:2])   # First two items`
  },
  {
    category: 'basics',
    title: 'Dictionaries',
    description: 'Store player stats as key-value pairs.',
    code: `player = {\n    "tag": "NinjaAce",\n    "rank": "Ascendant",\n    "win_rate": 64.2\n}\nprint(player["rank"])`
  },
  {
    category: 'stats',
    title: 'Summary Statistics',
    description: 'Calculate mean, median, min, max on columns.',
    code: `avg_val = df['streams_millions'].mean()\nmax_val = df['streams_millions'].max()\nmedian_val = df['streams_millions'].median()\nprint(f"Mean: {avg_val}, Max: {max_val}, Median: {median_val}")`
  },
  {
    category: 'errors',
    title: 'IndentationError Fix',
    description: 'Lines inside if, for, or def blocks MUST be indented 4 spaces.',
    code: `# ❌ WRONG:\n# if xp > 100:\n# print("Level Up!")\n\n# ✅ CORRECT:\nif xp > 100:\n    print("Level Up!")`
  },
  {
    category: 'errors',
    title: 'SyntaxError (Missing Colon)',
    description: 'Every if, elif, else, for, while, and def statement requires a colon.',
    code: `# ✅ Always end block headers with a colon:\nfor song in playlist:\n    print(song)`
  }
];

export const CheatSheet: React.FC<CheatSheetProps> = ({ onInsertCode }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filtered = SNIPPETS.filter((s) => {
    const matchCat = selectedCat === 'all' || s.category === selectedCat;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const copySnippet = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>Quick Reference Manual</span>
          <span aria-hidden="true">·</span>
          <span>Offline Python Syntax</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Python Data Science Cheat Sheet
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Searchable, copy-pasteable Python recipes for data filtering, sorting, plotting, statistics, and fixing common beginner bugs.
        </p>

        {/* Search Bar & Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search functions, errors, methods (e.g. groupby, scatter, slice)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs placeholder:text-slate-400 focus:outline-sky-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Snippets
            </button>
            <button
              onClick={() => setSelectedCat('pandas')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === 'pandas' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pandas
            </button>
            <button
              onClick={() => setSelectedCat('matplotlib')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === 'matplotlib' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matplotlib Charts
            </button>
            <button
              onClick={() => setSelectedCat('basics')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === 'basics' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Python Basics
            </button>
            <button
              onClick={() => setSelectedCat('errors')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === 'errors' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bug Fixes
            </button>
          </div>
        </div>
      </div>

      {/* Snippet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((snippet, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                  <span className="capitalize font-medium text-sky-600">{snippet.category}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{snippet.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copySnippet(snippet.code, idx)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Copy snippet"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {snippet.description}
            </p>

            <pre className="mt-auto rounded-lg bg-[#0F172A] p-3 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed border border-slate-800">
              {snippet.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
