/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight, 100% offline DataFrame implementation for client-side Python data analysis.
 * Emulates key pandas DataFrame & Series operations for teen education.
 */

export interface DescribeStats {
  count: number;
  mean: number;
  std: number;
  min: number;
  p25: number;
  p50: number; // median
  p75: number;
  max: number;
}

export class Series {
  name: string;
  values: any[];

  constructor(name: string, values: any[]) {
    this.name = name;
    this.values = values;
  }

  get length(): number {
    return this.values.length;
  }

  mean(): number {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numVals.length === 0) return 0;
    const sum = numVals.reduce((acc, v) => acc + v, 0);
    return Number((sum / numVals.length).toFixed(4));
  }

  median(): number {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
    if (numVals.length === 0) return 0;
    const mid = Math.floor(numVals.length / 2);
    if (numVals.length % 2 === 0) {
      return Number(((numVals[mid - 1] + numVals[mid]) / 2).toFixed(4));
    }
    return numVals[mid];
  }

  min(): any {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numVals.length === 0) return 0;
    return Math.min(...numVals);
  }

  max(): any {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numVals.length === 0) return 0;
    return Math.max(...numVals);
  }

  sum(): number {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v));
    return Number(numVals.reduce((acc, v) => acc + v, 0).toFixed(4));
  }

  count(): number {
    return this.values.filter(v => v !== null && v !== undefined && v !== '').length;
  }

  std(): number {
    const numVals = this.values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numVals.length <= 1) return 0;
    const m = this.mean();
    const variance = numVals.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (numVals.length - 1);
    return Number(Math.sqrt(variance).toFixed(4));
  }

  unique(): any[] {
    return Array.from(new Set(this.values));
  }

  value_counts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const v of this.values) {
      const key = String(v);
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }

  toList(): any[] {
    return [...this.values];
  }

  toString(): string {
    return `Series(${this.name}, len=${this.values.length})`;
  }
}

export class DataFrame {
  columns: string[];
  records: Record<string, any>[];

  constructor(records: Record<string, any>[] = []) {
    this.records = records.map(r => ({ ...r }));
    if (records.length > 0) {
      this.columns = Object.keys(records[0]);
    } else {
      this.columns = [];
    }
  }

  get shape(): [number, number] {
    return [this.records.length, this.columns.length];
  }

  head(n: number = 5): DataFrame {
    return new DataFrame(this.records.slice(0, n));
  }

  tail(n: number = 5): DataFrame {
    return new DataFrame(this.records.slice(-n));
  }

  getColumn(colName: string): Series {
    return new Series(colName, this.records.map(r => r[colName]));
  }

  setColumn(colName: string, values: any[] | Series): DataFrame {
    const arr = values instanceof Series ? values.values : values;
    if (!this.columns.includes(colName)) {
      this.columns.push(colName);
    }
    for (let i = 0; i < this.records.length; i++) {
      this.records[i][colName] = arr[i] !== undefined ? arr[i] : null;
    }
    return this;
  }

  sort_values(by: string | string[], ascending: boolean = true): DataFrame {
    const keys = Array.isArray(by) ? by : [by];
    const sorted = [...this.records].sort((a, b) => {
      for (const k of keys) {
        const valA = a[k];
        const valB = b[k];
        if (valA === valB) continue;
        if (valA === null || valA === undefined) return ascending ? 1 : -1;
        if (valB === null || valB === undefined) return ascending ? -1 : 1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return ascending ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
      return 0;
    });
    return new DataFrame(sorted);
  }

  filter(predicate: (row: Record<string, any>, index: number) => boolean): DataFrame {
    return new DataFrame(this.records.filter(predicate));
  }

  query(expression: string): DataFrame {
    // Basic query evaluator: e.g. "streams_millions > 1000 and danceability > 70"
    return new DataFrame(this.records.filter(row => {
      try {
        const keys = Object.keys(row);
        let expr = expression;
        // Replace 'and' / 'or'
        expr = expr.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
        // Evaluate in scope
        const func = new Function(...keys, `return Boolean(${expr});`);
        const args = keys.map(k => row[k]);
        return func(...args);
      } catch {
        return false;
      }
    }));
  }

  describe(): Record<string, DescribeStats> {
    const result: Record<string, DescribeStats> = {};
    for (const col of this.columns) {
      const numVals = this.records
        .map(r => r[col])
        .filter(v => typeof v === 'number' && !isNaN(v))
        .sort((a, b) => a - b);

      if (numVals.length === 0) continue;

      const count = numVals.length;
      const sum = numVals.reduce((acc, v) => acc + v, 0);
      const mean = Number((sum / count).toFixed(2));
      const min = numVals[0];
      const max = numVals[count - 1];

      const p25 = numVals[Math.floor(count * 0.25)];
      const p50 = numVals[Math.floor(count * 0.5)];
      const p75 = numVals[Math.floor(count * 0.75)];

      const variance = numVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count > 1 ? count - 1 : 1);
      const std = Number(Math.sqrt(variance).toFixed(2));

      result[col] = {
        count,
        mean,
        std,
        min,
        p25,
        p50,
        p75,
        max
      };
    }
    return result;
  }

  groupby(columnName: string) {
    const groups: Record<string, Record<string, any>[]> = {};
    for (const row of this.records) {
      const key = String(row[columnName] ?? 'Unknown');
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }

    return {
      mean: (targetCol?: string) => {
        const rows: Record<string, any>[] = [];
        for (const [grpKey, grpRows] of Object.entries(groups)) {
          const rowOut: Record<string, any> = { [columnName]: grpKey, count: grpRows.length };
          const colsToMean = targetCol ? [targetCol] : this.columns.filter(c => c !== columnName);
          for (const col of colsToMean) {
            const numVals = grpRows.map(r => r[col]).filter(v => typeof v === 'number');
            if (numVals.length > 0) {
              rowOut[col] = Number((numVals.reduce((a, b) => a + b, 0) / numVals.length).toFixed(2));
            }
          }
          rows.push(rowOut);
        }
        return new DataFrame(rows);
      },
      sum: (targetCol?: string) => {
        const rows: Record<string, any>[] = [];
        for (const [grpKey, grpRows] of Object.entries(groups)) {
          const rowOut: Record<string, any> = { [columnName]: grpKey, count: grpRows.length };
          const colsToSum = targetCol ? [targetCol] : this.columns.filter(c => c !== columnName);
          for (const col of colsToSum) {
            const numVals = grpRows.map(r => r[col]).filter(v => typeof v === 'number');
            if (numVals.length > 0) {
              rowOut[col] = Number(numVals.reduce((a, b) => a + b, 0).toFixed(2));
            }
          }
          rows.push(rowOut);
        }
        return new DataFrame(rows);
      },
      count: () => {
        const rows = Object.entries(groups).map(([k, rows]) => ({
          [columnName]: k,
          count: rows.length
        }));
        return new DataFrame(rows);
      }
    };
  }

  toRecords(): Record<string, any>[] {
    return this.records.map(r => ({ ...r }));
  }

  toCSV(): string {
    if (this.records.length === 0) return '';
    const header = this.columns.join(',');
    const rows = this.records.map(r => 
      this.columns.map(c => {
        const val = r[c];
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? '';
      }).join(',')
    );
    return [header, ...rows].join('\n');
  }

  toString(): string {
    const [rows, cols] = this.shape;
    return `DataFrame(${rows} rows x ${cols} columns)`;
  }
}

export function parseCSV(csvText: string): DataFrame {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return new DataFrame([]);

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const records: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      const colName = headers[j];
      const valStr = values[j] ?? '';
      // Type coercion
      if (valStr.toLowerCase() === 'true') {
        row[colName] = true;
      } else if (valStr.toLowerCase() === 'false') {
        row[colName] = false;
      } else if (!isNaN(Number(valStr)) && valStr !== '') {
        row[colName] = Number(valStr);
      } else {
        row[colName] = valStr;
      }
    }
    records.push(row);
  }

  return new DataFrame(records);
}
