import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { getGitInfo } from './git.js';
export function getCodexStatus(cwd = process.cwd()) {
    try {
        const home = os.homedir();
        const codexDir = path.join(home, '.codex');
        if (!fs.existsSync(codexDir)) {
            return undefined;
        }
        let model = 'o3';
        let sandboxMode = 'workspace-write';
        let sessionId;
        // Read config.toml if present
        const configPath = path.join(codexDir, 'config.toml');
        if (fs.existsSync(configPath)) {
            const configText = fs.readFileSync(configPath, 'utf-8');
            const modelMatch = configText.match(/model\s*=\s*["']([^"']+)["']/);
            if (modelMatch)
                model = modelMatch[1];
            const sandboxMatch = configText.match(/sandbox(?:_mode)?\s*=\s*["']([^"']+)["']/);
            if (sandboxMatch)
                sandboxMode = sandboxMatch[1];
        }
        // Read session index for the latest active thread
        const indexPath = path.join(codexDir, 'session_index.jsonl');
        if (fs.existsSync(indexPath)) {
            const lines = fs.readFileSync(indexPath, 'utf-8').trim().split('\n');
            if (lines.length > 0) {
                try {
                    const last = JSON.parse(lines[lines.length - 1]);
                    if (last.id)
                        sessionId = last.id;
                }
                catch {
                    // Ignore parse error
                }
            }
        }
        const git = getGitInfo(cwd);
        return {
            agent: 'codex',
            agentLabel: 'Codex',
            model,
            sandboxMode,
            conversationId: sessionId,
            cwd,
            git
        };
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=codex.js.map