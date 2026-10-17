import type { PowerlineGlyphs, PowerlineStyle } from './types.js';

export const POWERLINE_STYLES: Record<PowerlineStyle, PowerlineGlyphs> = {
  arrow: {
    leftSeparator: '',
    leftSubSeparator: '',
    rightSeparator: '',
    rightSubSeparator: '',
    leftCap: '',
    rightCap: ''
  },
  rounded: {
    leftSeparator: '',
    leftSubSeparator: '',
    rightSeparator: '',
    rightSubSeparator: '',
    leftCap: '',
    rightCap: ''
  },
  slanted: {
    leftSeparator: '',
    leftSubSeparator: '',
    rightSeparator: '',
    rightSubSeparator: '',
    leftCap: '',
    rightCap: ''
  },
  block: {
    leftSeparator: ' ',
    leftSubSeparator: '│',
    rightSeparator: ' ',
    rightSubSeparator: '│',
    leftCap: '',
    rightCap: ''
  },
  ascii: {
    leftSeparator: '>',
    leftSubSeparator: '|',
    rightSeparator: '<',
    rightSubSeparator: '|',
    leftCap: '[',
    rightCap: ']'
  }
};

export interface AgentIcons {
  agent: string;
  git: string;
  clock: string;
  step: string;
  tools: string;
  sandbox: string;
  dirty: string;
  clean: string;
  token: string;
  folder: string;
}

export const NERD_FONT_ICONS: AgentIcons = {
  agent: '󰧑',
  git: '',
  clock: '󱑆',
  step: '󰘬',
  tools: '',
  sandbox: '󰒃',
  dirty: '●',
  clean: '✔',
  token: '󰅒',
  folder: ''
};

export const UNICODE_ICONS: AgentIcons = {
  agent: '▲',
  git: '⑂',
  clock: '⏱',
  step: '#',
  tools: '⚙',
  sandbox: '🛡',
  dirty: '*',
  clean: '✓',
  token: 'T',
  folder: '📁'
};

export function getAgentIcon(agent: 'antigravity' | 'codex' | 'claude' | 'shell', nerdFonts: boolean = true): string {
  if (!nerdFonts) {
    switch (agent) {
      case 'antigravity': return '✦';
      case 'codex': return '◈';
      case 'claude': return '✻';
      default: return '❯';
    }
  }
  switch (agent) {
    case 'antigravity': return '󰧑';
    case 'codex': return '󰚩';
    case 'claude': return '󰯉';
    default: return '󰞷';
  }
}

