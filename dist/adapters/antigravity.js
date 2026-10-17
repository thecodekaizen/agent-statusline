import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { getGitInfo } from './git.js';
export function getAntigravityStatus(conversationId, cwd = process.cwd()) {
    try {
        const home = os.homedir();
        const brainDir = path.join(home, '.gemini', 'antigravity-cli', 'brain');
        if (!fs.existsSync(brainDir)) {
            return undefined;
        }
        let targetConvId = conversationId || process.env.ANTIGRAVITY_CONVERSATION_ID;
        if (!targetConvId) {
            // Find the most recently modified conversation in brainDir
            const entries = fs.readdirSync(brainDir, { withFileTypes: true });
            let latestMtime = 0;
            let latestId;
            for (const entry of entries) {
                if (!entry.isDirectory())
                    continue;
                const entryPath = path.join(brainDir, entry.name);
                try {
                    const stat = fs.statSync(entryPath);
                    if (stat.mtimeMs > latestMtime) {
                        latestMtime = stat.mtimeMs;
                        latestId = entry.name;
                    }
                }
                catch {
                    // Ignore stat errors
                }
            }
            targetConvId = latestId;
        }
        if (!targetConvId)
            return undefined;
        const transcriptPath = path.join(brainDir, targetConvId, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(transcriptPath)) {
            return undefined;
        }
        const content = fs.readFileSync(transcriptPath, 'utf-8');
        const lines = content.trim().split('\n');
        if (lines.length === 0)
            return undefined;
        let stepIndex = 0;
        let toolCallCount = 0;
        let tokensIn = 0;
        let tokensOut = 0;
        let tokensCached = 0;
        let model;
        let effort;
        let firstCreatedAt;
        let lastCreatedAt;
        for (const line of lines) {
            if (!line.trim())
                continue;
            try {
                const step = JSON.parse(line);
                if (typeof step.step_index === 'number') {
                    stepIndex = Math.max(stepIndex, step.step_index);
                }
                if (step.created_at) {
                    const ts = new Date(step.created_at).getTime();
                    if (!firstCreatedAt || ts < firstCreatedAt)
                        firstCreatedAt = ts;
                    if (!lastCreatedAt || ts > lastCreatedAt)
                        lastCreatedAt = ts;
                }
                if (typeof step.input_tokens === 'number')
                    tokensIn += step.input_tokens;
                if (typeof step.output_tokens === 'number')
                    tokensOut += step.output_tokens;
                if (typeof step.cache_read_tokens === 'number')
                    tokensCached += step.cache_read_tokens;
                if (Array.isArray(step.tool_calls)) {
                    toolCallCount += step.tool_calls.length;
                }
                // Check if user settings changed model in content
                if (typeof step.content === 'string') {
                    const modelMatch = step.content.match(/Model Selection` from \S+ to (.+?)\.\s*(?:No need|\n|$)/);
                    if (modelMatch) {
                        model = modelMatch[1].trim();
                    }
                    const effortMatch = step.content.match(/Reasoning Effort`.*?([a-zA-Z]+)/i);
                    if (effortMatch) {
                        effort = effortMatch[1].toLowerCase();
                    }
                }
            }
            catch {
                // Skip malformed line
            }
        }
        // Default model if none detected
        if (!model) {
            model = 'Gemini 3.8 Flash';
        }
        const durationMs = firstCreatedAt && lastCreatedAt ? Math.max(0, lastCreatedAt - firstCreatedAt) : undefined;
        const git = getGitInfo(cwd);
        return {
            agent: 'antigravity',
            agentLabel: 'Antigravity',
            model,
            effort,
            stepIndex,
            totalSteps: lines.length,
            toolCallCount,
            tokensIn: tokensIn > 0 ? tokensIn : undefined,
            tokensOut: tokensOut > 0 ? tokensOut : undefined,
            tokensCached: tokensCached > 0 ? tokensCached : undefined,
            durationMs,
            conversationId: targetConvId,
            cwd,
            git
        };
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=antigravity.js.map