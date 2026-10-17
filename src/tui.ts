import * as readline from 'node:readline';
import { loadUserConfig, saveUserConfig, type UserConfig } from './config.js';
import { THEMES } from './themes.js';
import { POWERLINE_STYLES } from './glyphs.js';
import type { AgentStatusData, PowerlineStyle } from './types.js';
import { renderStatusLine } from './renderer.js';
import { installForAntigravity, installForClaude, installForCodex } from './installer.js';

export async function runInteractiveTui(sampleData: AgentStatusData): Promise<void> {
  const config = loadUserConfig();
  const themeList = Object.keys(THEMES);
  const styleList = Object.keys(POWERLINE_STYLES) as PowerlineStyle[];

  let themeIndex = Math.max(0, themeList.indexOf(config.theme));
  let styleIndex = Math.max(0, styleList.indexOf(config.style));
  let nerdFonts = config.nerdFonts;
  let showMemory = config.showMemory;
  let statusMessage = '';

  const stdin = process.stdin;
  const stdout = process.stdout;

  if (!stdin.isTTY) {
    console.log('Interactive configuration requires a TTY terminal.');
    return;
  }

  readline.emitKeypressEvents(stdin);
  stdin.setRawMode(true);

  function renderScreen() {
    const currentTheme = themeList[themeIndex];
    const currentStyle = styleList[styleIndex];

    const preview = renderStatusLine(sampleData, {
      theme: currentTheme,
      style: currentStyle,
      nerdFonts,
      showMemory
    });

    stdout.write('\x1b[2J\x1b[H'); // Clear screen & move to top
    stdout.write('\x1b[1m🚀 agent-statusline Interactive Configurator\x1b[0m\n');
    stdout.write('──────────────────────────────────────────────────────────────────\n\n');
    stdout.write('\x1b[36mLive Preview:\x1b[0m\n\n');
    stdout.write(`  ${preview}\n\n`);
    stdout.write('──────────────────────────────────────────────────────────────────\n\n');
    stdout.write('\x1b[1mControls:\x1b[0m\n');
    stdout.write(`  \x1b[33m[t]\x1b[0m Cycle Theme:       \x1b[1m${THEMES[currentTheme].name}\x1b[0m\n`);
    stdout.write(`  \x1b[33m[s]\x1b[0m Cycle Style:       \x1b[1m${currentStyle}\x1b[0m\n`);
    stdout.write(`  \x1b[33m[n]\x1b[0m Toggle Nerd Fonts: \x1b[1m${nerdFonts ? 'Enabled (✔)' : 'Disabled (✖)'}\x1b[0m\n`);
    stdout.write(`  \x1b[33m[m]\x1b[0m Toggle Memory:     \x1b[1m${showMemory ? 'Enabled (✔)' : 'Disabled (✖)'}\x1b[0m\n`);
    stdout.write(`  \x1b[33m[i]\x1b[0m Install Hooks:     Configure Antigravity, Codex & Claude\n`);
    stdout.write(`  \x1b[32m[Enter / q]\x1b[0m Save & Exit\n\n`);

    if (statusMessage) {
      stdout.write(`\x1b[32m✔ ${statusMessage}\x1b[0m\n\n`);
    }
  }

  renderScreen();

  return new Promise((resolve) => {
    function onKeypress(_str: string, key: readline.Key) {
      if (!key) return;

      if (key.name === 'q' || key.name === 'return' || (key.ctrl && key.name === 'c')) {
        saveUserConfig({
          theme: themeList[themeIndex],
          style: styleList[styleIndex],
          nerdFonts,
          showMemory
        });
        stdin.setRawMode(false);
        stdin.removeListener('keypress', onKeypress);
        stdout.write('\n\x1b[32mSettings saved to ~/.config/agent-statusline/config.json!\x1b[0m\n\n');
        resolve();
        return;
      }

      if (key.name === 't') {
        themeIndex = (themeIndex + 1) % themeList.length;
        statusMessage = `Theme set to ${THEMES[themeList[themeIndex]].name}`;
        renderScreen();
      } else if (key.name === 's') {
        styleIndex = (styleIndex + 1) % styleList.length;
        statusMessage = `Style set to ${styleList[styleIndex]}`;
        renderScreen();
      } else if (key.name === 'n') {
        nerdFonts = !nerdFonts;
        statusMessage = `Nerd Fonts ${nerdFonts ? 'enabled' : 'disabled'}`;
        renderScreen();
      } else if (key.name === 'm') {
        showMemory = !showMemory;
        statusMessage = `Memory widget ${showMemory ? 'enabled' : 'disabled'}`;
        renderScreen();
      } else if (key.name === 'i') {
        installForAntigravity();
        installForCodex();
        installForClaude();
        statusMessage = 'Installed hooks for Antigravity, Codex, and Claude Code!';
        renderScreen();
      }
    }

    stdin.on('keypress', onKeypress);
  });
}
