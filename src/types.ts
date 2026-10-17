export type AgentType = 'antigravity' | 'codex' | 'claude' | 'shell';

export interface AgentStatusData {
  agent: AgentType;
  agentLabel: string;
  model?: string;
  effort?: string;
  mode?: string;
  stepIndex?: number;
  totalSteps?: number;
  toolCallCount?: number;
  tokensIn?: number;
  tokensOut?: number;
  tokensCached?: number;
  contextWindow?: number;
  contextPercent?: number;
  durationMs?: number;
  costUsd?: number;
  sandboxMode?: string;
  conversationId?: string;
  cwd?: string;
  git?: GitInfo;
}

export interface GitInfo {
  branch?: string;
  sha?: string;
  isDirty: boolean;
  stagedCount: number;
  unstagedCount: number;
  untrackedCount: number;
  aheadCount?: number;
  behindCount?: number;
}

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorDef {
  fg: ColorRGB;
  bg: ColorRGB;
}

export interface ThemePalette {
  name: string;
  primary: ColorDef;    // e.g. Agent badge
  secondary: ColorDef;  // e.g. Model / mode
  tertiary: ColorDef;   // e.g. Git info
  quaternary: ColorDef; // e.g. Directory / Path
  stats: ColorDef;      // e.g. Steps / Tokens / Time
  success: ColorDef;    // e.g. Clean git, passing checks
  warning: ColorDef;    // e.g. Dirty git, moderate tokens
  error: ColorDef;      // e.g. Conflicts, quota high
  muted: ColorDef;      // e.g. Separator, inactive
}

export type PowerlineStyle = 'arrow' | 'rounded' | 'slanted' | 'block' | 'ascii';

export interface PowerlineGlyphs {
  leftSeparator: string;
  leftSubSeparator: string;
  rightSeparator: string;
  rightSubSeparator: string;
  leftCap: string;
  rightCap: string;
}

export interface StatusSegment {
  id: string;
  text: string;
  color: ColorDef;
  align?: 'left' | 'right';
  priority?: number; // Lower number = higher priority to keep when terminal shrinks
}

export interface RenderOptions {
  theme?: string;
  style?: PowerlineStyle;
  nerdFonts?: boolean;
  maxWidth?: number;
}
