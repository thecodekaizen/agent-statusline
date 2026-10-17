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
    primary: ColorDef;
    secondary: ColorDef;
    tertiary: ColorDef;
    quaternary: ColorDef;
    stats: ColorDef;
    success: ColorDef;
    warning: ColorDef;
    error: ColorDef;
    muted: ColorDef;
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
    priority?: number;
}
export interface RenderOptions {
    theme?: string;
    style?: PowerlineStyle;
    nerdFonts?: boolean;
    maxWidth?: number;
    showCwd?: boolean;
    showGit?: boolean;
    showTokens?: boolean;
    showTime?: boolean;
    showMemory?: boolean;
    showCost?: boolean;
}
//# sourceMappingURL=types.d.ts.map