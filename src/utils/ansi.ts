import type { ColorRGB } from '../types.js';

export function hexToRgb(hex: string): ColorRGB {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function fgColor(rgb: ColorRGB): string {
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
}

export function bgColor(rgb: ColorRGB): string {
  return `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
}

export const ANSI_RESET = '\x1b[0m';
export const ANSI_BOLD = '\x1b[1m';
export const ANSI_DIM = '\x1b[2m';

// Regular expression to match ANSI escape codes
const ANSI_REGEX = new RegExp([
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%_~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%_~_]+)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|'), 'g');

/**
 * Strips all ANSI escape sequences from a string.
 */
export function stripAnsi(str: string): string {
  return str.replace(ANSI_REGEX, '');
}

/**
 * Calculates the visible character width of a string in terminal cells,
 * taking into account ANSI codes, double-width characters (CJK, emojis), etc.
 */
export function getVisibleWidth(str: string): number {
  const clean = stripAnsi(str);
  let width = 0;
  for (const char of clean) {
    const code = char.codePointAt(0) || 0;
    // Basic wide character heuristic (emojis, CJK ranges)
    if (
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe19) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f300 && code <= 0x1faff) // Full emoji spectrum, transport, symbols
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}
