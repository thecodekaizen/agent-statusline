import type { ColorRGB } from '../types.js';
export declare function hexToRgb(hex: string): ColorRGB;
export declare function fgColor(rgb: ColorRGB): string;
export declare function bgColor(rgb: ColorRGB): string;
export declare const ANSI_RESET = "\u001B[0m";
export declare const ANSI_BOLD = "\u001B[1m";
export declare const ANSI_DIM = "\u001B[2m";
/**
 * Strips all ANSI escape sequences from a string.
 */
export declare function stripAnsi(str: string): string;
/**
 * Calculates the visible character width of a string in terminal cells,
 * taking into account ANSI codes, double-width characters (CJK, emojis), etc.
 */
export declare function getVisibleWidth(str: string): number;
//# sourceMappingURL=ansi.d.ts.map