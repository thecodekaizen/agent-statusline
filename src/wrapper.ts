import { spawn, type ChildProcess } from 'node:child_process';
import type { AgentStatusData, RenderOptions } from './types.js';
import { getAntigravityStatus } from './adapters/antigravity.js';
import { getCodexStatus } from './adapters/codex.js';
import { getGitInfo } from './adapters/git.js';
import { renderStatusLine } from './renderer.js';

export function runWithStatusline(command: string, args: string[], options: RenderOptions): void {
  const stdout = process.stdout;
  let rows = stdout.rows || 24;
  let cols = stdout.columns || 80;

  // Detect which agent we are wrapping based on command name
  const cmdLower = command.toLowerCase();
  let explicitAgent: string | undefined;
  if (cmdLower.includes('agy') || cmdLower.includes('antigravity')) {
    explicitAgent = 'antigravity';
  } else if (cmdLower.includes('codex')) {
    explicitAgent = 'codex';
  } else if (cmdLower.includes('claude')) {
    explicitAgent = 'claude';
  }

  // Setup terminal scrolling region: lines 1 to rows - 1
  function setupScrollRegion() {
    rows = stdout.rows || 24;
    cols = stdout.columns || 80;
    if (rows > 2) {
      // Set scrolling margin from row 1 to rows - 1
      stdout.write(`\x1b[1;${rows - 1}r`);
    }
  }

  // Draw statusline on the reserved bottom row
  let lastLine = '';
  function drawStatusLine() {
    rows = stdout.rows || 24;
    cols = stdout.columns || 80;

    let data: AgentStatusData | undefined;

    if (explicitAgent === 'antigravity') {
      data = getAntigravityStatus();
    } else if (explicitAgent === 'codex') {
      data = getCodexStatus();
    } else {
      data = getAntigravityStatus() || getCodexStatus();
    }

    if (!data) {
      const cwd = process.cwd();
      data = {
        agent: 'shell',
        agentLabel: 'Terminal',
        cwd,
        git: getGitInfo(cwd)
      };
    }

    const line = renderStatusLine(data, { ...options, maxWidth: cols });
    if (line !== lastLine) {
      lastLine = line;
      // Save cursor position, hide cursor, jump to bottom line, print statusline, restore cursor
      stdout.write(`\x1b7\x1b[?25l\x1b[${rows};1H\x1b[2K${line}\x1b8\x1b[?25h`);
    }
  }

  function resetTerminal() {
    // Reset scrolling region to full screen
    stdout.write('\x1b[r');
    // Move to bottom line
    stdout.write(`\x1b[${rows};1H\n`);
    stdout.write('\x1b[?25h'); // Ensure cursor is visible
  }

  setupScrollRegion();
  drawStatusLine();

  // Background ticker to update statusline as agent works
  const ticker = setInterval(drawStatusLine, 600);

  // Handle window resizing
  stdout.on('resize', () => {
    setupScrollRegion();
    drawStatusLine();
  });

  // Spawn child process with inherited stdio
  const env = {
    ...process.env,
    LINES: String(Math.max(1, rows - 1)),
    COLUMNS: String(cols)
  };

  const child: ChildProcess = spawn(command, args, {
    stdio: 'inherit',
    env
  });

  child.on('error', (err) => {
    clearInterval(ticker);
    resetTerminal();
    console.error(`Failed to start command '${command}':`, err.message);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    clearInterval(ticker);
    resetTerminal();
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });

  // Forward termination signals to cleanup
  process.on('SIGINT', () => {
    // Let child handle SIGINT if running, else cleanup
    if (!child.killed) {
      child.kill('SIGINT');
    }
  });

  process.on('SIGTERM', () => {
    clearInterval(ticker);
    resetTerminal();
    child.kill('SIGTERM');
  });
}
