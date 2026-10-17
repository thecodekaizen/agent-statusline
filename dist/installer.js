import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
export function installForAntigravity(projectRoot = process.cwd()) {
    try {
        const agentsDir = path.join(projectRoot, '.agents');
        if (!fs.existsSync(agentsDir)) {
            fs.mkdirSync(agentsDir, { recursive: true });
        }
        const hooksPath = path.join(agentsDir, 'hooks.json');
        let hooksData = {};
        if (fs.existsSync(hooksPath)) {
            try {
                hooksData = JSON.parse(fs.readFileSync(hooksPath, 'utf-8'));
            }
            catch {
                hooksData = {};
            }
        }
        // Add statusline hook
        hooksData['agent-statusline'] = {
            PostInvocation: [
                {
                    type: 'command',
                    command: 'agent-statusline --agy'
                }
            ]
        };
        fs.writeFileSync(hooksPath, JSON.stringify(hooksData, null, 2), 'utf-8');
        return true;
    }
    catch (err) {
        console.error('Failed to configure Antigravity hooks:', err);
        return false;
    }
}
export function installForCodex() {
    try {
        const home = os.homedir();
        const configPath = path.join(home, '.codex', 'config.toml');
        let content = '';
        if (fs.existsSync(configPath)) {
            content = fs.readFileSync(configPath, 'utf-8');
        }
        const notifyLine = 'notify = ["agent-statusline", "--codex"]\n';
        if (content.includes('notify =')) {
            content = content.replace(/^notify\s*=.*$/m, notifyLine.trim());
        }
        else {
            content = notifyLine + content;
        }
        fs.writeFileSync(configPath, content, 'utf-8');
        return true;
    }
    catch (err) {
        console.error('Failed to configure Codex config.toml:', err);
        return false;
    }
}
export function installForClaude() {
    try {
        const home = os.homedir();
        const claudeDir = path.join(home, '.claude');
        if (!fs.existsSync(claudeDir)) {
            fs.mkdirSync(claudeDir, { recursive: true });
        }
        const settingsPath = path.join(claudeDir, 'settings.json');
        let settings = {};
        if (fs.existsSync(settingsPath)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
            }
            catch {
                settings = {};
            }
        }
        settings.statusLine = {
            type: 'command',
            command: 'agent-statusline'
        };
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
        return true;
    }
    catch (err) {
        console.error('Failed to configure Claude Code settings.json:', err);
        return false;
    }
}
//# sourceMappingURL=installer.js.map