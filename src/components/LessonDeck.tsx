/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lesson Deck component: Guides teens through bite-sized data analysis concepts,
 * analogies, tasks, automated validation, and hints.
 */

import React, { useState } from 'react';
import { Lesson, Module } from '../data/curriculum';
import { ExecutionResult } from '../engine/pythonRunner';
import confetti from 'canvas-confetti';
import { Lightbulb, CheckCircle2, ChevronRight, HelpCircle, Eye, ArrowRight, Award } from 'lucide-react';

interface LessonDeckProps {
  currentModule: Module;
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  onNextLesson: () => void;
  lastResult: ExecutionResult | null;
  onLoadSolution: () => void;
  isPassed: boolean;
  onMarkPassed: () => void;
}

export const LessonDeck: React.FC<LessonDeckProps> = ({
  currentModule,
  currentLesson,
  onSelectLesson,
  onNextLesson,
  lastResult,
  onLoadSolution,
  isPassed,
  onMarkPassed
}) => {
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<{ checked: boolean; passed: boolean; message: string }>({
    checked: false,
    passed: false,
    message: ''
  });

  // Re-run validation whenever lastResult changes
  React.useEffect(() => {
    if (lastResult) {
      const outcome = currentLesson.validate(lastResult);
      setValidationStatus({ checked: true, passed: outcome.passed, message: outcome.message });
      if (outcome.passed && !isPassed) {
        onMarkPassed();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [lastResult, currentLesson]);

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 bg-white p-5 shadow-xs overflow-y-auto">
      {/* Module Title & Breadcrumbs */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Module {currentModule.number}</span>
          <span aria-hidden="true">·</span>
          <span>{currentModule.title}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-amber-600 tabular-nums">+{currentLesson.xpReward} XP</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          {currentLesson.title}
        </h3>
        <p className="text-xs text-slate-600 mt-0.5">{currentLesson.shortDesc}</p>
      </div>

      {/* Real-World Teen Analogy Card */}
      <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-semibold text-sky-900 mb-1">
          <Lightbulb className="w-4 h-4 text-sky-600" />
          <span>Real-World Analogy</span>
        </div>
        <p className="leading-relaxed">{currentLesson.analogy}</p>
      </div>

      {/* Core Concepts */}
      <div className="mb-5 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          What You Need to Know
        </div>
        <div className="space-y-1.5 text-xs text-slate-700">
          {currentLesson.concept.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-sky-500 font-bold select-none">•</span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coding Task Prompt */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-900">Your Mission Task</span>
          <span className="text-[11px] font-mono text-slate-500">Practice Goal</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {currentLesson.taskPrompt}
        </p>
      </div>

      {/* Validation Banner */}
      {validationStatus.checked && (
        <div
          className={`mb-4 rounded-xl border p-3.5 text-xs transition-all ${
            validationStatus.passed
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold mb-1">
            {validationStatus.passed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Challenge Completed! (+{currentLesson.xpReward} XP)</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Almost There! Keep Experimenting</span>
              </>
            )}
          </div>
          <p className="leading-relaxed">{validationStatus.message}</p>
        </div>
      )}

      {/* Action Controls & Hints */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {/* Hint Trigger */}
          <button
            onClick={() => {
              if (showHintIndex < currentLesson.hints.length - 1) {
                setShowHintIndex(showHintIndex + 1);
              } else {
                setShowHintIndex(-1);
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHintIndex >= 0 ? `Hint ${showHintIndex + 1}/${currentLesson.hints.length} (Next)` : 'Need a Hint?'}</span>
          </button>

          {/* Reveal Solution */}
          <button
            onClick={() => setShowSolutionModal(true)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Peek Solution</span>
          </button>
        </div>

        {/* Display Active Hint */}
        {showHintIndex >= 0 && (
          <div className="rounded-lg bg-amber-50/80 border border-amber-200 p-2.5 text-xs text-amber-900">
            <span className="font-semibold">Hint {showHintIndex + 1}: </span>
            <span>{currentLesson.hints[showHintIndex]}</span>
          </div>
        )}

        {/* Next Lesson Button */}
        <button
          onClick={onNextLesson}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
        >
          <span>Next Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Solution Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Official Solution Code</h4>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Here is the standard Python approach for this lesson:
            </p>
            <pre className="rounded-xl bg-[#0F172A] p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
              {currentLesson.solutionCode}
            </pre>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSolutionModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLoadSolution();
                  setShowSolutionModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
              >
                Load Solution into Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
