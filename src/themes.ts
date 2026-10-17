import type { ThemePalette } from './types.js';
import { hexToRgb } from './utils/ansi.js';

function makeColor(fgHex: string, bgHex: string) {
  return {
    fg: hexToRgb(fgHex),
    bg: hexToRgb(bgHex)
  };
}

export const THEMES: Record<string, ThemePalette> = {
  catppuccin: {
    name: 'Catppuccin Mocha',
    primary: makeColor('#11111b', '#cba6f7'),    // Mauve
    secondary: makeColor('#11111b', '#89b4fa'),  // Blue
    tertiary: makeColor('#11111b', '#a6e3a1'),   // Green
    quaternary: makeColor('#cdd6f4', '#313244'), // Surface0
    stats: makeColor('#11111b', '#fab387'),      // Peach
    success: makeColor('#11111b', '#a6e3a1'),    // Green
    warning: makeColor('#11111b', '#f9e2af'),    // Yellow
    error: makeColor('#11111b', '#f38ba8'),      // Red
    muted: makeColor('#a6adc8', '#181825')       // Mantle
  },
  tokyonight: {
    name: 'Tokyo Night',
    primary: makeColor('#1a1b26', '#bb9af7'),    // Purple
    secondary: makeColor('#1a1b26', '#7aa2f7'),  // Blue
    tertiary: makeColor('#1a1b26', '#7dcfff'),   // Cyan
    quaternary: makeColor('#c0caf5', '#24283b'), // Storm BG
    stats: makeColor('#1a1b26', '#ff9e64'),      // Orange
    success: makeColor('#1a1b26', '#9ece6a'),    // Green
    warning: makeColor('#1a1b26', '#e0af68'),    // Yellow
    error: makeColor('#1a1b26', '#f7768e'),      // Red
    muted: makeColor('#565f89', '#16161e')       // Dark Night
  },
  nord: {
    name: 'Nord',
    primary: makeColor('#2e3440', '#88c0d0'),    // Frost cyan
    secondary: makeColor('#2e3440', '#81a1c1'),  // Frost blue
    tertiary: makeColor('#2e3440', '#a3be8c'),   // Green
    quaternary: makeColor('#eceff4', '#3b4252'), // Polar Night
    stats: makeColor('#2e3440', '#ebcb8b'),      // Yellow
    success: makeColor('#2e3440', '#a3be8c'),    // Green
    warning: makeColor('#2e3440', '#d08770'),    // Orange
    error: makeColor('#2e3440', '#bf616a'),      // Red
    muted: makeColor('#d8dee9', '#2e3440')       // Night base
  },
  gruvbox: {
    name: 'Gruvbox Dark',
    primary: makeColor('#282828', '#d3869b'),    // Purple
    secondary: makeColor('#282828', '#83a598'),  // Blue
    tertiary: makeColor('#282828', '#b8bb26'),   // Green
    quaternary: makeColor('#ebdbb2', '#3c3836'), // Dark2
    stats: makeColor('#282828', '#fe8019'),      // Orange
    success: makeColor('#282828', '#b8bb26'),    // Green
    warning: makeColor('#282828', '#fabd2f'),    // Yellow
    error: makeColor('#282828', '#fb4934'),      // Red
    muted: makeColor('#a89984', '#1d2021')       // Dark0 hard
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    primary: makeColor('#050505', '#ff007f'),    // Neon Pink
    secondary: makeColor('#050505', '#00f0ff'),  // Neon Cyan
    tertiary: makeColor('#050505', '#ffe600'),   // Yellow
    quaternary: makeColor('#ffffff', '#1a0826'), // Deep Purple
    stats: makeColor('#050505', '#7122fa'),      // Electric Violet
    success: makeColor('#050505', '#00ff66'),    // Electric Green
    warning: makeColor('#050505', '#ffaa00'),    // Amber
    error: makeColor('#ffffff', '#ff003c'),      // Neon Red
    muted: makeColor('#808080', '#0a0a12')       // Void
  }
};

export const DEFAULT_THEME = THEMES.catppuccin;
