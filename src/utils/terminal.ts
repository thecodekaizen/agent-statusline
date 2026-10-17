import { execSync } from 'node:child_process';
import * as os from 'node:os';
import * as path from 'node:path';

export function getTerminalWidth(): number {
  if (process.stdout && process.stdout.columns) {
    return process.stdout.columns;
  }
  if (process.env.COLUMNS) {
    const cols = parseInt(process.env.COLUMNS, 10);
    if (!isNaN(cols) && cols > 0) return cols;
  }
  try {
    const output = execSync('stty size', { stdio: ['inherit', 'pipe', 'ignore'], timeout: 500 }).toString();
    const parts = output.trim().split(/\s+/);
    if (parts.length === 2) {
      const cols = parseInt(parts[1], 10);
      if (!isNaN(cols) && cols > 0) return cols;
    }
  } catch {
    // Ignore stty errors
  }
  return 80;
}

export function contractPath(fullPath: string): string {
  const home = os.homedir();
  if (fullPath === home) return '~';
  if (fullPath.startsWith(home + path.sep)) {
    return '~' + fullPath.slice(home.length);
  }
  return fullPath;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }
  return num.toString();
}
