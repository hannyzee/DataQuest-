/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DataQuest Python: Teen Data Science Lab
 * An offline, in-browser educational web app teaching Python data analysis
 * through music, gaming, and creator datasets with interactive code execution,
 * visual charts, and auto-graded missions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputStage } from './components/OutputStage';
import { LessonDeck } from './components/LessonDeck';
import { DatasetExplorer } from './components/DatasetExplorer';
import { VisualQueryBuilder } from './components/VisualQueryBuilder';
import { CheatSheet } from './components/CheatSheetModal';
import { MissionsView } from './components/MissionsView';
import { MODULES, Lesson, Module, getLessonById } from './data/curriculum';
import { TEEN_DATASETS, DatasetMeta } from './data/teenDatasets';
import { PythonRuntime, ExecutionResult } from './engine/pythonRunner';
import { Sparkles, Terminal, BookOpen, Layers, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [activeModuleId, setActiveModuleId] = useState<string>(MODULES[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(MODULES[0].lessons[0].id);

  // Storage-backed user progress
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dq_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dq_total_xp');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Current Lesson & Module
  const currentModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];
  const currentLesson = currentModule.lessons.find(l => l.id === activeLessonId) || currentModule.lessons[0];

  // Code state
  const [editorCode, setEditorCode] = useState<string>(currentLesson.starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Runtime instance
  const runtimeRef = useRef<PythonRuntime>(new PythonRuntime());

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('dq_completed_lessons', JSON.stringify(completedLessons));
      localStorage.setItem('dq_total_xp', String(totalXp));
    } catch {
      // Storage unavailable
    }
  }, [completedLessons, totalXp]);

  // When switching lessons in Learn mode, update editor code
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveModuleId(lesson.moduleId);
    setActiveLessonId(lesson.id);
    setEditorCode(lesson.starterCode);
    setExecutionResult(null);
  };

  const handleNextLesson = () => {
    // Find next lesson in current module or move to next module
    const currentLessonIdx = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentLessonIdx < currentModule.lessons.length - 1) {
      handleSelectLesson(currentModule.lessons[currentLessonIdx + 1]);
    } else {
      const currentModuleIdx = MODULES.findIndex(m => m.id === currentModule.id);
      if (currentModuleIdx < MODULES.length - 1) {
        const nextModule = MODULES[currentModuleIdx + 1];
        handleSelectLesson(nextModule.lessons[0]);
      }
    }
  };

  const handleMarkPassed = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      setTotalXp(prev => prev + currentLesson.xpReward);
    }
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const res = await runtimeRef.current.execute(editorCode);
      setExecutionResult(res);
    } catch (e: any) {
      setExecutionResult({
        success: false,
        stdout: [],
        tables: [],
        charts: [],
        variables: {},
        executionTimeMs: 0,
        error: {
          type: 'RuntimeError',
          message: e.message || 'Execution failed',
          tip: 'Check your syntax and variable names.'
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadDatasetIntoPlayground = (dataset: DatasetMeta) => {
    setEditorCode(dataset.sampleCode);
    setExecutionResult(null);
    setActiveTab('playground');
  };

  const handleStartMission = (mission: Lesson) => {
    setActiveModuleId(mission.moduleId);
    setActiveLessonId(mission.id);
    setEditorCode(mission.starterCode);
    setExecutionResult(null);
    setActiveTab('learn');
  };

  const handleRunGeneratedCode = (code: string) => {
    setEditorCode(code);
    setActiveTab('playground');
    // Run after state settles
    setTimeout(() => {
      handleRunCode();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* 3-Zone Top Bar Contract Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        totalXp={totalXp}
        completedLessonsCount={completedLessons.length}
      />

      {/* Main App Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        {/* VIEW 1: LEARN MODE (Interactive Two-Zone Sandbox) */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Quick Curriculum Module Pill Track */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {MODULES.map((mod) => {
                const isCurMod = mod.id === activeModuleId;
                const modCompletedCount = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectLesson(mod.lessons[0])}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                      isCurMod
                        ? 'border-sky-600 bg-sky-50/70 text-slate-900 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-mono text-slate-400">0{mod.number}</span>
                    <span>{mod.title}</span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      ({modCompletedCount}/{mod.lessons.length})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Split Two-Zone Sandbox Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Zone: Concept & Lesson Deck (5 Cols) */}
              <div className="lg:col-span-5 h-[680px]">
                <LessonDeck
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                  onSelectLesson={handleSelectLesson}
                  onNextLesson={handleNextLesson}
                  lastResult={executionResult}
                  onLoadSolution={() => setEditorCode(currentLesson.solutionCode)}
                  isPassed={completedLessons.includes(currentLesson.id)}
                  onMarkPassed={handleMarkPassed}
                />
              </div>

              {/* Right Zone: Interactive Code & Output Workspace (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4 h-[680px]">
                {/* Upper: Code Editor */}
                <div className="h-[340px]">
                  <CodeEditor
                    code={editorCode}
                    onChange={setEditorCode}
                    onRun={handleRunCode}
                    onReset={() => setEditorCode(currentLesson.starterCode)}
                  />
                </div>

                {/* Lower: Output Stage */}
                <div className="flex-1 min-h-[320px]">
                  <OutputStage
                    result={executionResult}
                    isRunning={isRunning}
                    activeDatasetName={currentLesson.datasetId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PLAYGROUND & VISUAL QUERY BUILDER */}
        {activeTab === 'playground' && (
          <div className="space-y-6">
            {/* Visual Query Builder */}
            <VisualQueryBuilder onRunGeneratedCode={handleRunGeneratedCode} />

            {/* Free-form Coding Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[720px]">
              <div className="lg:col-span-6 h-full">
                <CodeEditor
                  code={editorCode}
                  onChange={setEditorCode}
                  onRun={handleRunCode}
                />
              </div>
              <div className="lg:col-span-6 h-full">
                <OutputStage
                  result={executionResult}
                  isRunning={isRunning}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DATASETS BROWSER */}
        {activeTab === 'datasets' && (
          <DatasetExplorer onLoadDatasetIntoPlayground={handleLoadDatasetIntoPlayground} />
        )}

        {/* VIEW 4: BOSS MISSIONS */}
        {activeTab === 'missions' && (
          <MissionsView
            onStartMission={handleStartMission}
            completedLessonIds={completedLessons}
          />
        )}

        {/* VIEW 5: CHEAT SHEET */}
        {activeTab === 'cheatsheet' && (
          <CheatSheet
            onInsertCode={(code) => {
              setEditorCode(prev => prev + '\n' + code);
              setActiveTab('playground');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">DataQuest Python</span>
            <span aria-hidden="true">·</span>
            <span>Client-side 100% Offline Python Execution</span>
            <span aria-hidden="true">·</span>
            <span>No backend server needed</span>
          </div>
          <div>
            Built for young programmers to explore data science, analytics, and visualization.
          </div>
        </div>
      </footer>
    </div>
  );
}
