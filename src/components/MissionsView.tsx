/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Missions View component: High-stakes Teen Boss Missions with scenario briefs,
 * target goals, rewards, and one-click launch into the playground.
 */

import React from 'react';
import { MODULES, Lesson } from '../data/curriculum';
import { Trophy, Target, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface MissionsViewProps {
  onStartMission: (lesson: Lesson) => void;
  completedLessonIds: string[];
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  onStartMission,
  completedLessonIds
}) => {
  const bossModule = MODULES.find(m => m.id === 'boss-missions');
  const missions = bossModule ? bossModule.lessons : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Real-World Data Investigations</span>
          <span aria-hidden="true">·</span>
          <span>Boss Level Challenges</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Teen Data Science Boss Missions
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Put your Python skills to the test with real-world case studies: resolve competitive esports loadout debates, crack creator algorithm upload timing, and uncover viral hitmaker formulas.
        </p>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission, idx) => {
          const isDone = completedLessonIds.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 bg-white shadow-xs transition-all hover:shadow-md ${
                isDone ? 'border-emerald-200 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-sky-600">Mission 0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-600 font-semibold tabular-nums">+{mission.xpReward} XP</span>
                  </div>
                  {isDone && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {mission.title}
                </h3>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {mission.shortDesc}
                </p>

                {/* Briefing Box */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-700 mb-4 space-y-1.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-sky-600" />
                    <span>Objective:</span>
                  </div>
                  <p className="leading-relaxed">{mission.taskPrompt}</p>
                </div>
              </div>

              <button
                onClick={() => onStartMission(mission)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                  isDone
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                <span>{isDone ? 'Replay Mission' : 'Accept Mission & Launch Lab'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
