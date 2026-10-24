/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header component adhering strictly to the 3-Zone Top Bar Contract:
 * [Zone 1: Brand wordmark] - [Zone 2: 4-5 single-line nav links] - [Zone 3: 1 primary action]
 */

import React from 'react';
import { Play, Sparkles, Database, BookOpen, Terminal, Trophy } from 'lucide-react';

export type ActiveTab = 'learn' | 'playground' | 'datasets' | 'missions' | 'cheatsheet';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRunCode: () => void;
  isRunning: boolean;
  totalXp: number;
  completedLessonsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunCode,
  isRunning,
  totalXp,
  completedLessonsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-8 px-6 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('learn')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-600 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white font-mono text-sm font-bold shadow-xs">
            Py
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">DataQuest Python</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('learn')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              activeTab === 'learn' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              activeTab === 'playground' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              activeTab === 'datasets' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              activeTab === 'missions' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              activeTab === 'cheatsheet' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Cheat Sheet
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-amber-600 tabular-nums">{totalXp} XP</span>
            <span aria-hidden="true">·</span>
            <span>{completedLessonsCount} Done</span>
          </div>

          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run (Ctrl+Enter)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
