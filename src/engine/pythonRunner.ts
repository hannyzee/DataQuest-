/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * In-browser 100% Offline Python Execution Engine for Teen Data Analysis.
 * Translates and executes Python data science syntax (pandas, matplotlib, statistics, builtins)
 * directly in client memory without network access or backend servers.
 */

import { DataFrame, Series, parseCSV } from './dataframe';
import { TEEN_DATASETS } from '../data/teenDatasets';

export interface ChartData {
  type: 'bar' | 'line' | 'scatter' | 'hist' | 'pie';
  title?: string;
  xlabel?: string;
  ylabel?: string;
  labels?: string[];
  data: any[];
  xData?: any[];
  yData?: any[];
  colors?: string[];
}

export interface ExecutionResult {
  success: boolean;
  stdout: string[];
  tables: DataFrame[];
  charts: ChartData[];
  variables: Record<string, any>;
  executionTimeMs: number;
  error?: {
    type: string;
    message: string;
    line?: number;
    tip: string;
  };
}

export class PythonRuntime {
  private datasets: Map<string, DataFrame> = new Map();

  constructor() {
    // Pre-populate with our datasets
    for (const d of TEEN_DATASETS) {
      this.datasets.set(d.filename, new DataFrame(d.records));
      this.datasets.set(d.id, new DataFrame(d.records));
    }
  }

  getDataset(key: string): DataFrame | undefined {
    return this.datasets.get(key) || this.datasets.get(key.replace('.csv', ''));
  }

  /**
   * Translates Python 3 code into safe, executable JavaScript that preserves
   * Python semantics for teen data science scripts.
   */
  private preprocessPython(pythonCode: string): { jsCode: string; originalLines: string[] } {
    const rawLines = pythonCode.split('\n');
    let jsCode = '';
    
    // We maintain an indentation stack to handle Python's block structure
    const indentStack: number[] = [0];

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      const trimmed = line.trim();

      // Check for comments
      if (trimmed.startsWith('#')) {
        jsCode += `// ${trimmed.slice(1)}\n`;
        continue;
      }
      if (trimmed === '') {
        jsCode += '\n';
        continue;
      }

      // Compute indentation level
      const currentIndent = line.search(/\S|$/);
      while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsCode += `${' '.repeat(indentStack[indentStack.length - 1])}}\n`;
      }

      let content = trimmed;

      // Handle imports
      if (/^import\s+pandas\s+as\s+pd/i.test(content) || /^import\s+pandas/i.test(content)) {
        jsCode += `/* import pandas as pd */\n`;
        continue;
      }
      if (/^import\s+matplotlib\.pyplot\s+as\s+plt/i.test(content) || /^import\s+matplotlib/i.test(content)) {
        jsCode += `/* import matplotlib.pyplot as plt */\n`;
        continue;
      }
      if (/^import\s+math/i.test(content) || /^import\s+statistics\s+as\s+stats/i.test(content) || /^import\s+statistics/i.test(content)) {
        jsCode += `/* import standard library */\n`;
        continue;
      }
      if (/^from\s+\w+\s+import/i.test(content)) {
        jsCode += `/* from import */\n`;
        continue;
      }

      // Handle Python f-strings: f"hello {name}!" -> `hello ${name}!`
      content = content.replace(/f"([^"]*)"/g, (_, p1) => {
        const transformed = p1.replace(/{([^}]+)}/g, '${$1}');
        return `\`${transformed}\``;
      });
      content = content.replace(/f'([^']*)'/g, (_, p1) => {
        const transformed = p1.replace(/{([^}]+)}/g, '${$1}');
        return `\`${transformed}\``;
      });

      // Handle boolean True/False/None
      content = content.replace(/\bTrue\b/g, 'true')
                       .replace(/\bFalse\b/g, 'false')
                       .replace(/\bNone\b/g, 'null');

      // Handle len() -> py_len()
      content = content.replace(/\blen\(([^)]+)\)/g, 'py_len($1)');

      // Handle print()
      // e.g. print(...) -> py_print(...)
      if (/^print\s*\(/.test(content)) {
        content = content.replace(/^print\s*\(/, 'py_print(');
      }

      // Handle pd.read_csv('filename')
      content = content.replace(/pd\.read_csv\((['"][^'"]+['"])\)/g, 'pd_read_csv($1)');

      // Handle .iterrows() in for loops: for i, row in df.iterrows(): -> for (const [i, row] of df_iterrows(df)) {
      const iterrowsMatch = content.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)\.iterrows\(\)\s*:/);
      if (iterrowsMatch) {
        const [, idxVar, rowVar, dfVar] = iterrowsMatch;
        jsCode += `${' '.repeat(currentIndent)}for (const [${idxVar}, ${rowVar}] of py_iterrows(${dfVar})) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      // Handle for x in range(n): or for x in list:
      const forRangeMatch = content.match(/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+range\(([^)]+)\)\s*:/);
      if (forRangeMatch) {
        const varName = forRangeMatch[1].trim();
        const rangeArg = forRangeMatch[2].trim();
        jsCode += `${' '.repeat(currentIndent)}for (const ${varName} of py_range(${rangeArg})) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      const forInMatch = content.match(/^for\s+([a-zA-Z0-9_,\s()]+)\s+in\s+(.+)\s*:/);
      if (forInMatch) {
        const varName = forInMatch[1].trim();
        const iterExpr = forInMatch[2].trim();
        jsCode += `${' '.repeat(currentIndent)}for (const ${varName} of py_iter(${iterExpr})) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      // Handle while condition:
      const whileMatch = content.match(/^while\s+(.+)\s*:/);
      if (whileMatch) {
        const cond = this.translateConditions(whileMatch[1].trim());
        jsCode += `${' '.repeat(currentIndent)}while (${cond}) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      // Handle if condition:
      const ifMatch = content.match(/^if\s+(.+)\s*:/);
      if (ifMatch) {
        const cond = this.translateConditions(ifMatch[1].trim());
        jsCode += `${' '.repeat(currentIndent)}if (${cond}) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      // Handle elif condition:
      const elifMatch = content.match(/^elif\s+(.+)\s*:/);
      if (elifMatch) {
        const cond = this.translateConditions(elifMatch[1].trim());
        jsCode += `${' '.repeat(currentIndent)}} else if (${cond}) {\n`;
        continue;
      }

      // Handle else:
      if (/^else\s*:/.test(content)) {
        jsCode += `${' '.repeat(currentIndent)}} else {\n`;
        continue;
      }

      // Handle def function_name(args):
      const defMatch = content.match(/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:/);
      if (defMatch) {
        const fnName = defMatch[1];
        const args = defMatch[2];
        jsCode += `${' '.repeat(currentIndent)}function ${fnName}(${args}) {\n`;
        indentStack.push(currentIndent + 4);
        continue;
      }

      // Handle return statement
      if (/^return\b/.test(content)) {
        jsCode += `${' '.repeat(currentIndent)}${content};\n`;
        continue;
      }

      // Handle Python list comprehensions: [x for x in items if cond]
      content = this.translateListComprehensions(content);

      // Handle Python boolean operators: ' and ' -> ' && ', ' or ' -> ' || ', ' not ' -> ' !'
      // Only outside strings
      content = this.translateOperators(content);

      // Handle DataFrame boolean indexing: df[df['col'] > 50]
      content = this.translateDfIndexing(content);

      // Handle assignments vs bare expressions
      if (/^[a-zA-Z0-9_]+\s*(\+=|-=|\*=|\/=|%=|=)\s*/.test(content)) {
        const firstToken = content.split(/[\s=+\-*/%]/)[0];
        // If not already in scope, declare with var so it's globally accessible in script
        jsCode += `${' '.repeat(currentIndent)}scope['${firstToken}'] = (function() { try { return ${content}; } catch(e) { throw e; } })();\n`;
      } else {
        jsCode += `${' '.repeat(currentIndent)}${content};\n`;
      }
    }

    // Close remaining open indentations
    while (indentStack.length > 1) {
      indentStack.pop();
      jsCode += '}\n';
    }

    return { jsCode, originalLines: rawLines };
  }

  private translateConditions(cond: string): string {
    return cond
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b\s+/g, '!')
      .replace(/\bin\b/g, ' in ');
  }

  private translateOperators(code: string): string {
    return code
      .replace(/(\s+)and(\s+)/g, '$1&&$2')
      .replace(/(\s+)or(\s+)/g, '$1||$2')
      .replace(/(\s+)not(\s+)/g, '$1!$2');
  }

  private translateListComprehensions(expr: string): string {
    // Basic match: [expr for item in iter if cond] or [expr for item in iter]
    return expr.replace(/\[\s*([^\]]+?)\s+for\s+([a-zA-Z0-9_]+)\s+in\s+([^\]]+?)(?:\s+if\s+([^\]]+?))?\s*\]/g, 
      (match, mapExpr, itemVar, iterExpr, ifCond) => {
        if (ifCond) {
          const jsIf = this.translateConditions(ifCond);
          return `(py_iter(${iterExpr}).filter(${itemVar} => ${jsIf}).map(${itemVar} => ${mapExpr}))`;
        }
        return `(py_iter(${iterExpr}).map(${itemVar} => ${mapExpr}))`;
      }
    );
  }

  private translateDfIndexing(line: string): string {
    // df[df['col'] > 50]
    const match = line.match(/([a-zA-Z0-9_]+)\[([a-zA-Z0-9_]+)\[['"]([^'"]+)['"]\]\s*(==|!=|>=|<=|>|<)\s*([^\]]+)\]/);
    if (match) {
      const [, outerDf, innerDf, colName, op, compVal] = match;
      if (outerDf === innerDf) {
        return line.replace(match[0], `${outerDf}.filter(row => row['${colName}'] ${op} ${compVal.trim()})`);
      }
    }
    return line;
  }

  /**
   * Explains common Python errors in clear, friendly language for teenagers.
   */
  private generateFriendlyErrorTip(errType: string, msg: string, lineCode: string = ''): string {
    if (errType === 'IndentationError') {
      return "Indentation matters in Python! Lines inside a function, loop, or if-statement must be indented with 4 spaces.";
    }
    if (errType === 'SyntaxError') {
      if (msg.includes('colon') || lineCode.includes('if') || lineCode.includes('for') || lineCode.includes('def')) {
        return "Check the end of your if/for/def line. Did you forget to add a colon ':' at the end?";
      }
      if (lineCode.includes('=')) {
        return "Are you checking if two values are equal? Use '==' to compare, and '=' to assign variables.";
      }
      return "Check for unclosed quotes \" \", missing parentheses ( ), or extra commas.";
    }
    if (errType === 'NameError') {
      return "This variable isn't defined yet. Did you spell it correctly or forget to assign it earlier?";
    }
    if (errType === 'KeyError') {
      return "That column or key doesn't exist in the data. Check your spelling against df.columns or the dataset viewer!";
    }
    if (errType === 'TypeError') {
      return "You might be trying to mix incompatible types (e.g. adding a word to a number). Try using int() or str().";
    }
    if (errType === 'ZeroDivisionError') {
      return "Math alert! Division by zero isn't possible. Check your denominator.";
    }
    return "Read the error message above carefully. Double-check variable names, spellings, and quotes!";
  }

  /**
   * Run the Python script and collect all stdout, plots, tables, and variables.
   */
  async execute(pythonCode: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    const stdout: string[] = [];
    const tables: DataFrame[] = [];
    const charts: ChartData[] = [];
    const scope: Record<string, any> = {};

    // Standard print function
    const py_print = (...args: any[]) => {
      const text = args.map(arg => {
        if (arg instanceof DataFrame) {
          tables.push(arg);
          return formatDataFrameTable(arg);
        }
        if (arg instanceof Series) {
          return arg.values.join(', ');
        }
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      stdout.push(text);
    };

    const py_len = (obj: any): number => {
      if (obj === null || obj === undefined) return 0;
      if (obj instanceof DataFrame) return obj.records.length;
      if (obj instanceof Series) return obj.length;
      if (typeof obj.length === 'number') return obj.length;
      if (typeof obj === 'object') return Object.keys(obj).length;
      return 0;
    };

    const py_range = (startOrStop: number, stop?: number, step: number = 1): number[] => {
      const start = stop === undefined ? 0 : startOrStop;
      const end = stop === undefined ? startOrStop : stop;
      const result: number[] = [];
      for (let i = start; step > 0 ? i < end : i > end; i += step) {
        result.push(i);
      }
      return result;
    };

    const py_iter = (obj: any): any[] => {
      if (obj instanceof DataFrame) return obj.records;
      if (obj instanceof Series) return obj.values;
      if (Array.isArray(obj)) return obj;
      if (typeof obj === 'string') return obj.split('');
      if (typeof obj === 'object' && obj !== null) return Object.values(obj);
      return [];
    };

    const py_iterrows = (df: DataFrame): [number, Record<string, any>][] => {
      if (!(df instanceof DataFrame)) return [];
      return df.records.map((r, i) => [i, r]);
    };

    const pd_read_csv = (filename: string): DataFrame => {
      const cleanName = filename.replace(/['"]/g, '');
      const df = this.getDataset(cleanName);
      if (df) {
        return new DataFrame(df.records);
      }
      // If not found in preloaded, search by fuzzy name
      for (const [key, loadedDf] of this.datasets.entries()) {
        if (cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
          return new DataFrame(loadedDf.records);
        }
      }
      throw new Error(`FileNotFoundError: No such file or dataset '${cleanName}'. Available datasets: 'spotify_hits.csv', 'gaming_weapons.csv', 'creator_virality.csv', 'pokemon_stats.csv', 'space_missions.csv'`);
    };

    // Matplotlib simulation state
    let curChart: ChartData = { type: 'bar', data: [] };

    const plt = {
      figure: () => {
        curChart = { type: 'bar', data: [] };
      },
      title: (t: string) => { curChart.title = String(t); },
      xlabel: (x: string) => { curChart.xlabel = String(x); },
      ylabel: (y: string) => { curChart.ylabel = String(y); },
      bar: (x: any, height: any, color?: any) => {
        const xArr = x instanceof Series ? x.values : Array.isArray(x) ? x : [x];
        const yArr = height instanceof Series ? height.values : Array.isArray(height) ? height : [height];
        curChart.type = 'bar';
        curChart.labels = xArr.map(String);
        curChart.data = yArr.map(Number);
        if (color) {
          curChart.colors = Array.isArray(color) ? color : [String(color)];
        }
      },
      plot: (x: any, y: any, color?: any) => {
        const xArr = x instanceof Series ? x.values : Array.isArray(x) ? x : [x];
        const yArr = y instanceof Series ? y.values : Array.isArray(y) ? y : [y];
        curChart.type = 'line';
        curChart.xData = xArr;
        curChart.yData = yArr.map(Number);
        curChart.data = yArr.map(Number);
        if (color) curChart.colors = [String(color)];
      },
      scatter: (x: any, y: any, color?: any) => {
        const xArr = x instanceof Series ? x.values : Array.isArray(x) ? x : [x];
        const yArr = y instanceof Series ? y.values : Array.isArray(y) ? y : [y];
        curChart.type = 'scatter';
        curChart.xData = xArr.map(Number);
        curChart.yData = yArr.map(Number);
        curChart.data = xArr.map((vx, i) => ({ x: Number(vx), y: Number(yArr[i] ?? 0) }));
        if (color) curChart.colors = [String(color)];
      },
      hist: (data: any, bins: number = 8, color?: any) => {
        const vals = (data instanceof Series ? data.values : Array.isArray(data) ? data : [data]).map(Number).filter(v => !isNaN(v));
        curChart.type = 'hist';
        curChart.data = vals;
        if (color) curChart.colors = [String(color)];
      },
      pie: (sizes: any, labels?: any) => {
        const sArr = (sizes instanceof Series ? sizes.values : Array.isArray(sizes) ? sizes : [sizes]).map(Number);
        const lArr = labels ? (labels instanceof Series ? labels.values : Array.isArray(labels) ? labels : [labels]).map(String) : [];
        curChart.type = 'pie';
        curChart.data = sArr;
        curChart.labels = lArr;
      },
      show: () => {
        if (curChart.data && (curChart.data.length > 0 || (curChart.xData && curChart.xData.length > 0))) {
          charts.push({ ...curChart });
          curChart = { type: 'bar', data: [] };
        }
      }
    };

    // Math & stats tools
    const py_math = Math;
    const statistics = {
      mean: (arr: number[]) => {
        const s = new Series('val', arr);
        return s.mean();
      },
      median: (arr: number[]) => {
        const s = new Series('val', arr);
        return s.median();
      },
      stdev: (arr: number[]) => {
        const s = new Series('val', arr);
        return s.std();
      },
      sum: (arr: number[]) => {
        return arr.reduce((a, b) => a + b, 0);
      }
    };

    // Preload top level variables for easy access
    const spotify_df = this.datasets.get('spotify')!;
    const gaming_df = this.datasets.get('gaming')!;
    const creators_df = this.datasets.get('social')!;
    const pokemon_df = this.datasets.get('pokemon')!;
    const space_df = this.datasets.get('space')!;

    try {
      const { jsCode, originalLines } = this.preprocessPython(pythonCode);

      // Construct runner function with injected context
      const runnerFn = new Function(
        'scope',
        'py_print',
        'py_len',
        'py_range',
        'py_iter',
        'py_iterrows',
        'pd_read_csv',
        'DataFrame',
        'Series',
        'plt',
        'math',
        'statistics',
        'stats',
        'spotify_df',
        'gaming_df',
        'creators_df',
        'pokemon_df',
        'space_df',
        `
        const pd = {
          read_csv: pd_read_csv,
          DataFrame: (records) => new DataFrame(records),
          Series: (name, vals) => new Series(name, vals)
        };
        const sum = (arr) => arr.reduce((a, b) => a + Number(b), 0);
        const min = (...args) => {
          const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
          return Math.min(...list);
        };
        const max = (...args) => {
          const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
          return Math.max(...list);
        };
        const round = (num, decimals = 0) => Number(Math.round(Number(num + "e" + decimals)) + "e-" + decimals);
        const sorted = (iterable, reverse = false) => {
          const arr = [...iterable];
          arr.sort((a, b) => typeof a === 'number' ? (reverse ? b - a : a - b) : (reverse ? String(b).localeCompare(String(a)) : String(a).localeCompare(String(b))));
          return arr;
        };

        try {
          ${jsCode}
        } catch (err) {
          throw err;
        }
        `
      );

      runnerFn(
        scope,
        py_print,
        py_len,
        py_range,
        py_iter,
        py_iterrows,
        pd_read_csv,
        DataFrame,
        Series,
        plt,
        py_math,
        statistics,
        statistics,
        spotify_df,
        gaming_df,
        creators_df,
        pokemon_df,
        space_df
      );

      // Check if any lingering chart wasn't closed with plt.show()
      if (curChart.data && (curChart.data.length > 0 || (curChart.xData && curChart.xData.length > 0))) {
        charts.push({ ...curChart });
      }

      // If user assigned a DataFrame to scope or printed one, register for table tab
      for (const [k, v] of Object.entries(scope)) {
        if (v instanceof DataFrame && !tables.includes(v)) {
          tables.push(v);
        }
      }

      const executionTimeMs = Math.round(performance.now() - startTime);

      return {
        success: true,
        stdout,
        tables,
        charts,
        variables: scope,
        executionTimeMs
      };
    } catch (err: any) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      const errName = err.name || 'RuntimeError';
      const errMsg = err.message || 'Execution error';

      return {
        success: false,
        stdout,
        tables,
        charts,
        variables: scope,
        executionTimeMs,
        error: {
          type: errName,
          message: errMsg,
          tip: this.generateFriendlyErrorTip(errName, errMsg)
        }
      };
    }
  }
}

function formatDataFrameTable(df: DataFrame): string {
  const records = df.records.slice(0, 5);
  if (records.length === 0) return "[Empty DataFrame]";
  const cols = df.columns;
  const colWidths: Record<string, number> = {};

  cols.forEach(c => {
    colWidths[c] = Math.max(c.length, ...records.map(r => String(r[c] ?? '').length));
  });

  const headerRow = cols.map(c => c.padEnd(colWidths[c])).join('  |  ');
  const divider = cols.map(c => '-'.repeat(colWidths[c])).join('--+--');
  const rows = records.map((r, i) => {
    return cols.map(c => String(r[c] ?? '').padEnd(colWidths[c])).join('  |  ');
  });

  const [totalRows, totalCols] = df.shape;
  const footer = `\n[${totalRows} rows x ${totalCols} columns]`;
  return `${headerRow}\n${divider}\n${rows.join('\n')}${footer}`;
}
