import type { PowerlineStyle } from './types.js';
export interface UserConfig {
    theme: string;
    style: PowerlineStyle;
    nerdFonts: boolean;
    defaultAgent?: 'auto' | 'antigravity' | 'codex' | 'claude' | 'shell';
    showCwd: boolean;
    showGit: boolean;
    showTokens: boolean;
    showTime: boolean;
    showMemory: boolean;
    showCost: boolean;
}
export declare const DEFAULT_CONFIG: UserConfig;
export declare function getConfigDir(): string;
export declare function getConfigPath(): string;
export declare function loadUserConfig(): UserConfig;
export declare function saveUserConfig(config: Partial<UserConfig>): boolean;
//# sourceMappingURL=config.d.ts.map