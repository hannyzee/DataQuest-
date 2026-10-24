/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Python Code Editor with line numbers, shortcut execution,
 * snippet inserts, and copy/download controls.
 */

import React, { useRef, useEffect } from 'react';
import { Copy, RotateCcw, Download, Sparkles, Terminal } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onReset?: () => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  readOnly = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  // Handle keyboard shortcut Ctrl+Enter or Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Handle Tab key for Python 4-space indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';
      const updated = code.substring(0, start) + spaces + code.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadScript = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data_analysis.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(code + '\n' + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = code.substring(0, start) + snippet + code.substring(end);
    onChange(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 0);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-[#0F172A] text-slate-100 shadow-sm overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1E293B] border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">main.py</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">Python 3 (Offline Runtime)</span>
        </div>

        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors cursor-pointer"
              title="Reset starter code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors cursor-pointer"
            title="Copy code"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>

          <button
            onClick={downloadScript}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors cursor-pointer"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .py</span>
          </button>
        </div>
      </div>

      {/* Snippet Quick Bar */}
      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#141E33] border-b border-slate-800/80 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0 font-medium">Quick Snippets:</span>
        <button
          onClick={() => insertSnippet("print(df.head())\n")}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono shrink-0 cursor-pointer transition-colors"
        >
          df.head()
        </button>
        <button
          onClick={() => insertSnippet("print(df.describe())\n")}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono shrink-0 cursor-pointer transition-colors"
        >
          df.describe()
        </button>
        <button
          onClick={() => insertSnippet("df_sorted = df.sort_values(by='streams_millions', ascending=False)\n")}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono shrink-0 cursor-pointer transition-colors"
        >
          sort_values()
        </button>
        <button
          onClick={() => insertSnippet("plt.bar(x, y)\nplt.show()\n")}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono shrink-0 cursor-pointer transition-colors"
        >
          plt.bar()
        </button>
        <button
          onClick={() => insertSnippet("plt.scatter(x, y)\nplt.show()\n")}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono shrink-0 cursor-pointer transition-colors"
        >
          plt.scatter()
        </button>
      </div>

      {/* Textarea with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Column */}
        <div
          aria-hidden="true"
          className="w-12 select-none bg-[#0B1120] py-3 text-right pr-3 font-mono text-xs text-slate-600 leading-[1.625rem]"
        >
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="flex-1 w-full resize-none bg-transparent py-3 px-3 font-mono text-xs text-slate-100 leading-[1.625rem] focus:outline-hidden selection:bg-sky-700/50"
          placeholder="Write your Python data analysis code here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0B1120] border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>{lineNumbers.length} lines</span>
          <span aria-hidden="true">·</span>
          <span>UTF-8</span>
          <span aria-hidden="true">·</span>
          <span>Spaces: 4</span>
        </div>
        <div>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]">Ctrl+Enter</kbd> to run</span>
        </div>
      </div>
    </div>
  );
};
