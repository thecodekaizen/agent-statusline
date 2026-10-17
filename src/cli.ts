import * as fs from 'node:fs';
import type { AgentStatusData, PowerlineStyle, RenderOptions } from './types.js';
import { getAntigravityStatus } from './adapters/antigravity.js';
import { getCodexStatus } from './adapters/codex.js';
import { parseClaudeStatusPayload } from './adapters/claude.js';
import { getGitInfo } from './adapters/git.js';
import { renderStatusLine } from './renderer.js';
import { installForAntigravity, installForCodex, installForClaude } from './installer.js';
import { loadUserConfig } from './config.js';
import { runInteractiveTui } from './tui.js';
import { runLiveWatch } from './watch.js';

async function readStdin(): Promise<string | null> {
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

export async function runCli(args: string[]) {
  const flags = parseArgs(args);
  const userConfig = loadUserConfig();

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

  // Interactive config mode
  if (flags.config) {
    const sample = getAntigravityStatus() || getCodexStatus() || {
      agent: 'antigravity',
      agentLabel: 'Antigravity',
      model: 'Gemini 3.8 Flash (High)',
      stepIndex: 42,
      toolCallCount: 18,
      cwd: process.cwd(),
      git: getGitInfo(process.cwd())
    };
    await runInteractiveTui(sample);
    return;
  }

  const renderOptions: RenderOptions = {
    theme: flags.theme || userConfig.theme || 'catppuccin',
    style: (flags.style as PowerlineStyle) || userConfig.style || 'arrow',
    nerdFonts: flags.noNerdFonts ? false : userConfig.nerdFonts,
    showCwd: flags.noCwd ? false : userConfig.showCwd,
    showGit: flags.noGit ? false : userConfig.showGit,
    showTokens: flags.noTokens ? false : userConfig.showTokens,
    showTime: flags.noTime ? false : userConfig.showTime,
    showMemory: flags.memory !== undefined ? flags.memory : userConfig.showMemory,
    showCost: flags.cost !== undefined ? flags.cost : userConfig.showCost
  };

  // Watch mode for continuous live updates in terminal / split pane
  if (flags.watch) {
    runLiveWatch(renderOptions, flags.agy ? 'antigravity' : flags.codex ? 'codex' : undefined);
    return;
  }

  // 1. Check if piped data exists on stdin (Antigravity hook or Claude Code mode)
  const pipedInput = await readStdin();
  if (pipedInput) {
    try {
      const parsed = JSON.parse(pipedInput);
      // Antigravity hook contract: conversationId or transcriptPath
      if (parsed.conversationId || parsed.transcriptPath) {
        const agyData = getAntigravityStatus(parsed.conversationId, parsed.workspacePaths?.[0]);
        if (agyData) {
          const rendered = renderStatusLine(agyData, renderOptions);
          // Print directly to terminal for live visual statusline
          try {
            fs.appendFileSync('/dev/tty', '\n' + rendered + '\n');
          } catch {
            console.error('\n' + rendered + '\n');
          }
          // Satisfy Antigravity hook contract: empty JSON on stdout
          console.log(JSON.stringify({}));
          return;
        }
      }
    } catch {
      // Continue to Claude Code parser
    }

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

  // 3. User config defaultAgent override if not 'auto'
  if (userConfig.defaultAgent === 'antigravity') {
    const agyData = getAntigravityStatus(flags.conversation);
    if (agyData) {
      console.log(renderStatusLine(agyData, renderOptions));
      return;
    }
  } else if (userConfig.defaultAgent === 'codex') {
    const codexData = getCodexStatus();
    if (codexData) {
      console.log(renderStatusLine(codexData, renderOptions));
      return;
    }
  }

  // 4. Auto-detection mode
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
  const shellData: AgentStatusData = {
    agent: 'shell',
    agentLabel: 'Terminal',
    cwd,
    git
  };

  console.log(renderStatusLine(shellData, renderOptions));
}

function parseArgs(args: string[]) {
  const flags: Record<string, any> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') flags.help = true;
    else if (arg === '--version' || arg === '-v') flags.version = true;
    else if (arg === '--config' || arg === 'config') flags.config = true;
    else if (arg === '--agy' || arg === '--antigravity') flags.agy = true;
    else if (arg === '--codex') flags.codex = true;
    else if (arg === '--claude') flags.claude = true;
    else if (arg === '--shell') flags.shell = true;
    else if (arg === '--watch' || arg === '-w') flags.watch = true;
    else if (arg === '--no-nerd-fonts') flags.noNerdFonts = true;
    else if (arg === '--memory') flags.memory = true;
    else if (arg === '--no-memory') flags.memory = false;
    else if (arg === '--cost') flags.cost = true;
    else if (arg === '--no-cost') flags.cost = false;
    else if (arg === '--theme' && args[i + 1]) flags.theme = args[++i];
    else if (arg === '--style' && args[i + 1]) flags.style = args[++i];
    else if (arg === '--conversation' && args[i + 1]) flags.conversation = args[++i];
    else if (arg === '--install') {
      flags.install = args[i + 1] && !args[i + 1].startsWith('-') ? args[++i] : 'all';
    }
  }
  return flags;
}

function handleInstall(target: string) {
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
  agent-statusline config               Launch interactive TUI configurator
  cat payload.json | agent-statusline   Render Claude Code status JSON

\x1b[1mOPTIONS:\x1b[0m
  --config                  Launch interactive TUI configurator
  --agy, --antigravity      Render Google Antigravity session status
  --codex                   Render OpenAI Codex CLI session status
  --claude                  Render Claude Code status
  --shell                   Render standalone Git / Terminal prompt
  --theme <name>            Color theme: catppuccin, tokyonight, nord, gruvbox, cyberpunk
  --style <name>            Powerline style: arrow, rounded, slanted, block, ascii
  --memory / --no-memory    Toggle system memory usage display
  --cost / --no-cost        Toggle session API cost display
  --no-nerd-fonts           Use standard Unicode/ASCII fallback icons
  --conversation <id>       Target specific Antigravity conversation ID
  --install [agent]         Install statusline hook (antigravity, codex, claude, or all)
  -v, --version             Print package version
  -h, --help                Show help
`);
}
