import { execSync } from 'node:child_process';
export function getGitInfo(cwd = process.cwd()) {
    try {
        const statusOutput = execSync('git status --porcelain=v1 -b', {
            cwd,
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 1500
        }).toString();
        const lines = statusOutput.split('\n');
        if (lines.length === 0)
            return undefined;
        let branch = 'HEAD';
        let aheadCount = 0;
        let behindCount = 0;
        const branchLine = lines[0];
        if (branchLine.startsWith('## ')) {
            const rest = branchLine.slice(3).trim();
            const parts = rest.split('...');
            branch = parts[0];
            if (parts[1]) {
                const aheadMatch = parts[1].match(/ahead (\d+)/);
                if (aheadMatch)
                    aheadCount = parseInt(aheadMatch[1], 10);
                const behindMatch = parts[1].match(/behind (\d+)/);
                if (behindMatch)
                    behindCount = parseInt(behindMatch[1], 10);
            }
        }
        let stagedCount = 0;
        let unstagedCount = 0;
        let untrackedCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line || line.length < 2)
                continue;
            const x = line[0];
            const y = line[1];
            if (x === '?' && y === '?') {
                untrackedCount++;
            }
            else {
                if (x !== ' ' && x !== '?')
                    stagedCount++;
                if (y !== ' ' && y !== '?')
                    unstagedCount++;
            }
        }
        let sha;
        try {
            sha = execSync('git rev-parse --short HEAD', {
                cwd,
                stdio: ['ignore', 'pipe', 'ignore'],
                timeout: 800
            }).toString().trim();
        }
        catch {
            // Ignore SHA error
        }
        return {
            branch,
            sha,
            isDirty: stagedCount > 0 || unstagedCount > 0 || untrackedCount > 0,
            stagedCount,
            unstagedCount,
            untrackedCount,
            aheadCount,
            behindCount
        };
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=git.js.map