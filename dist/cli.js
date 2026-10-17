import { getAntigravityStatus } from './adapters/antigravity.js';
import { getCodexStatus } from './adapters/codex.js';
import { parseClaudeStatusPayload } from './adapters/claude.js';
import { getGitInfo } from './adapters/git.js';
import { renderStatusLine } from './renderer.js';
import { installForAntigravity, installForCodex, installForClaude } from './installer.js';
async function readStdin() {
    if (process.stdin.isTTY) {
        return null;
    }
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        // Quick timeout if pipe is empty or hanging
        const timer = setTimeout(() => {
            resolve(data.trim() ? data : null);
        }, 500);
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => {
            clearTimeout(timer);
            resolve(data.trim() ? data : null);
        });
        process.stdin.on('error', () => {
            clearTimeout(timer);
            resolve(null);
        });
    });
}
export async function runCli(args) {
    const flags = parseArgs(args);
    if (flags.help) {
        printHelp();
        return;
    }
    if (flags.version) {
        console.log('agent-statusline v0.1.0');
        return;
    }
    if (flags.install) {
        handleInstall(flags.install);
        return;
    }
    const renderOptions = {
        theme: flags.theme || 'catppuccin',
        style: flags.style || 'arrow',
        nerdFonts: !flags.noNerdFonts
    };
    // 1. Check if piped data exists on stdin (Claude Code mode or piped JSON)
    const pipedInput = await readStdin();
    if (pipedInput) {
        const claudeData = parseClaudeStatusPayload(pipedInput);
        if (claudeData) {
            console.log(renderStatusLine(claudeData, renderOptions));
            return;
        }
    }
    // 2. Explicit adapter flags
    if (flags.agy) {
        const agyData = getAntigravityStatus(flags.conversation);
        if (agyData) {
            console.log(renderStatusLine(agyData, renderOptions));
            return;
        }
    }
    if (flags.codex) {
        const codexData = getCodexStatus();
        if (codexData) {
            console.log(renderStatusLine(codexData, renderOptions));
            return;
        }
    }
    // 3. Auto-detection mode
    // Try Antigravity first
    const agyData = getAntigravityStatus(flags.conversation);
    if (agyData && agyData.stepIndex && agyData.stepIndex > 0) {
        console.log(renderStatusLine(agyData, renderOptions));
        return;
    }
    // Try Codex next
    const codexData = getCodexStatus();
    if (codexData) {
        console.log(renderStatusLine(codexData, renderOptions));
        return;
    }
    // Fallback to Shell / Git statusline
    const cwd = process.cwd();
    const git = getGitInfo(cwd);
    const shellData = {
        agent: 'shell',
        agentLabel: 'Terminal',
        cwd,
        git
    };
    console.log(renderStatusLine(shellData, renderOptions));
}
function parseArgs(args) {
    const flags = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--help' || arg === '-h')
            flags.help = true;
        else if (arg === '--version' || arg === '-v')
            flags.version = true;
        else if (arg === '--agy' || arg === '--antigravity')
            flags.agy = true;
        else if (arg === '--codex')
            flags.codex = true;
        else if (arg === '--claude')
            flags.claude = true;
        else if (arg === '--shell')
            flags.shell = true;
        else if (arg === '--no-nerd-fonts')
            flags.noNerdFonts = true;
        else if (arg === '--theme' && args[i + 1])
            flags.theme = args[++i];
        else if (arg === '--style' && args[i + 1])
            flags.style = args[++i];
        else if (arg === '--conversation' && args[i + 1])
            flags.conversation = args[++i];
        else if (arg === '--install') {
            flags.install = args[i + 1] && !args[i + 1].startsWith('-') ? args[++i] : 'all';
        }
    }
    return flags;
}
function handleInstall(target) {
    const norm = target.toLowerCase();
    console.log(`\x1b[1mInstalling agent-statusline hooks...\x1b[0m\n`);
    if (norm === 'all' || norm === 'antigravity' || norm === 'agy') {
        const ok = installForAntigravity();
        console.log(`[Antigravity] ${ok ? '✔ Installed hook into .agents/hooks.json' : '✖ Failed to install'}`);
    }
    if (norm === 'all' || norm === 'codex') {
        const ok = installForCodex();
        console.log(`[Codex] ${ok ? '✔ Added notify hook to ~/.codex/config.toml' : '✖ Failed to install'}`);
    }
    if (norm === 'all' || norm === 'claude') {
        const ok = installForClaude();
        console.log(`[Claude Code] ${ok ? '✔ Configured statusLine in ~/.claude/settings.json' : '✖ Failed to install'}`);
    }
    console.log('\n\x1b[32mInstallation complete!\x1b[0m');
}
function printHelp() {
    console.log(`
\x1b[1magent-statusline\x1b[0m - Beautiful Powerline statusline for AI coding agents & terminal prompts

\x1b[1mUSAGE:\x1b[0m
  agent-statusline [OPTIONS]
  cat payload.json | agent-statusline

\x1b[1mOPTIONS:\x1b[0m
  --agy, --antigravity      Render Google Antigravity session status
  --codex                   Render OpenAI Codex CLI session status
  --claude                  Render Claude Code status
  --shell                   Render standalone Git / Terminal prompt
  --theme <name>            Color theme: catppuccin, tokyonight, nord, gruvbox, cyberpunk
  --style <name>            Powerline style: arrow, rounded, slanted, block, ascii
  --no-nerd-fonts           Use standard Unicode/ASCII fallback icons
  --conversation <id>       Target specific Antigravity conversation ID
  --install [agent]         Install statusline hook (antigravity, codex, claude, or all)
  -v, --version             Print package version
  -h, --help                Show help
`);
}
//# sourceMappingURL=cli.js.map