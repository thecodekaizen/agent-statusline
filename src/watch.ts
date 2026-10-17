import type { RenderOptions } from './types.js';
import { getAntigravityStatus } from './adapters/antigravity.js';
import { getCodexStatus } from './adapters/codex.js';
import { getGitInfo } from './adapters/git.js';
import { renderStatusLine } from './renderer.js';

export function runLiveWatch(options: RenderOptions, targetAgent?: string): void {
  const stdout = process.stdout;

  // Hide cursor during watch
  stdout.write('\x1b[?25l');

  function cleanup() {
    stdout.write('\x1b[?25h\n'); // Show cursor
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  let lastOutput = '';

  function tick() {
    let data;

    if (targetAgent === 'antigravity' || targetAgent === 'agy') {
      data = getAntigravityStatus();
    } else if (targetAgent === 'codex') {
      data = getCodexStatus();
    } else {
      // Auto-detect
      const agyData = getAntigravityStatus();
      if (agyData && agyData.stepIndex && agyData.stepIndex > 0) {
        data = agyData;
      } else {
        const codexData = getCodexStatus();
        if (codexData) {
          data = codexData;
        } else {
          const cwd = process.cwd();
          data = {
            agent: 'shell' as const,
            agentLabel: 'Terminal',
            cwd,
            git: getGitInfo(cwd)
          };
        }
      }
    }

    if (data) {
      const line = renderStatusLine(data, options);
      if (line !== lastOutput) {
        lastOutput = line;
        // Rewrite the current line in-place
        stdout.write(`\r\x1b[K${line}`);
      }
    }
  }

  // Initial render
  tick();

  // Tick every 800ms
  const interval = setInterval(tick, 800);

  // Keep process alive
  interval.unref();
  setInterval(() => {}, 10000);
}
