import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
export const DEFAULT_CONFIG = {
    theme: 'catppuccin',
    style: 'arrow',
    nerdFonts: true,
    defaultAgent: 'auto',
    showCwd: true,
    showGit: true,
    showTokens: true,
    showTime: true,
    showMemory: false,
    showCost: true
};
export function getConfigDir() {
    const xdg = process.env.XDG_CONFIG_HOME;
    if (xdg && xdg.trim()) {
        return path.join(xdg, 'agent-statusline');
    }
    return path.join(os.homedir(), '.config', 'agent-statusline');
}
export function getConfigPath() {
    return path.join(getConfigDir(), 'config.json');
}
export function loadUserConfig() {
    try {
        const filePath = getConfigPath();
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_CONFIG, ...parsed };
        }
    }
    catch {
        // Fall back to default on error
    }
    return { ...DEFAULT_CONFIG };
}
export function saveUserConfig(config) {
    try {
        const dir = getConfigDir();
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const current = loadUserConfig();
        const updated = { ...current, ...config };
        fs.writeFileSync(getConfigPath(), JSON.stringify(updated, null, 2), 'utf-8');
        return true;
    }
    catch (err) {
        console.error('Failed to save config:', err);
        return false;
    }
}
//# sourceMappingURL=config.js.map