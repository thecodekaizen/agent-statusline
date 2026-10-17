import type { PowerlineGlyphs, PowerlineStyle } from './types.js';
export declare const POWERLINE_STYLES: Record<PowerlineStyle, PowerlineGlyphs>;
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
export declare const NERD_FONT_ICONS: AgentIcons;
export declare const UNICODE_ICONS: AgentIcons;
export declare function getAgentIcon(agent: 'antigravity' | 'codex' | 'claude' | 'shell', nerdFonts?: boolean): string;
//# sourceMappingURL=glyphs.d.ts.map