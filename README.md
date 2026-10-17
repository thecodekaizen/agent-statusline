# 🚀 agent-statusline

**Beautiful, ultra-fast Powerline statusline for AI coding agents (Antigravity, Codex, Claude Code) and terminal prompts.**

```
 󰧑 Antigravity  Gemini 3.8 Flash (High)  󰘬 179  87   main [ef15119] ● ?6 
```

---

## 🌟 Features

- **Multi-Agent Adapters:**
  - 󰧑 **Google Antigravity (`agy`)**: Directly inspects session transcripts, active model (e.g. Gemini 3.8 Flash / Pro), reasoning effort (`low` to `max`), step counter, tool executions, and tokens.
  - 󰚩 **OpenAI Codex CLI (`codex`)**: Discovers active threads, models (`o3`, `gpt-4o`), and sandbox permissions.
  - 󰯉 **Claude Code CLI (`claude`)**: 100% drop-in compatible with Claude Code's piped stdin `StatusJSON` format.
  - 󰞷 **Terminal / Shell Mode**: Renders a standalone prompt bar with Git branch, dirty status, ahead/behind counters, and CWD.
- **Interactive TUI Configurator:**
  - Run `agent-statusline config` to cycle themes, switch Powerline styles, toggle Nerd Fonts, and install hooks with a live preview.
- **Powerline & Nerd Fonts Support:**
  - 5 Powerline styles: `arrow` (``), `rounded` (``/``), `slanted` (``), `block`, and `ascii`.
  - Full Nerd Font icons with automatic fallback for standard Unicode/ASCII terminals (`--no-nerd-fonts`).
- **24-bit TrueColor Palettes:**
  - `catppuccin` (Mocha default)
  - `tokyonight`
  - `nord`
  - `gruvbox`
  - `cyberpunk` (Neon)
- **Zero Runtime Dependencies:**
  - Native Node.js ESM implementation with instantaneous cold start (~50ms).
  - Terminal width detection with dynamic priority pruning (never breaks or wraps on narrow screens).
  - Built-in test suite running on Node.js native test runner.

---

## ⚡ Quick Start

### 1. Run Directly
```bash
# Auto-detects active agent or falls back to Git prompt
npx agent-statusline

# Force Antigravity mode
npx agent-statusline --agy

# Force Codex mode
npx agent-statusline --codex

# Change theme & style
npx agent-statusline --theme tokyonight --style rounded

# Launch the interactive configurator
npx agent-statusline config
```

### 2. Install Hooks

Configure `agent-statusline` to run automatically with your agents:

```bash
# Auto-configure hooks for all installed agents
npx agent-statusline --install all

# Or configure specific agents
npx agent-statusline --install antigravity
npx agent-statusline --install codex
npx agent-statusline --install claude
```

---

## 🖥️ Shell & Tmux Integrations

### ZSH Prompt
Add to `~/.zshrc`:
```zsh
source /path/to/agent-statusline/scripts/prompt.zsh
```

### Tmux Status Bar
Add to `~/.tmux.conf`:
```tmux
set -g status-interval 3
set -g status-right-length 140
set -g status-right "#(agent-statusline --theme catppuccin)"
```

---

## ⚙️ Host Integrations

### Google Antigravity (`agy`)
Added to `.agents/hooks.json` or `~/.gemini/config/hooks.json`:
```json
{
  "agent-statusline": {
    "PostInvocation": [
      {
        "type": "command",
        "command": "agent-statusline --agy"
      }
    ]
  }
}
```

### OpenAI Codex CLI (`codex`)
Added to `~/.codex/config.toml`:
```toml
notify = ["agent-statusline", "--codex"]
```

### Claude Code CLI (`claude`)
Added to `~/.claude/settings.json`:
```json
{
  "statusLine": {
    "type": "command",
    "command": "agent-statusline"
  }
}
```

---

## 🎨 Themes & Customization

| Theme | Flag | Sample Preview |
| :--- | :--- | :--- |
| **Catppuccin Mocha** | `--theme catppuccin` | Mauve badge, blue model, green git |
| **Tokyo Night** | `--theme tokyonight` | Purple badge, cyan model, green git |
| **Nord** | `--theme nord` | Frost cyan badge, frost blue, polar night |
| **Gruvbox Dark** | `--theme gruvbox` | Purple/yellow retro warm palette |
| **Cyberpunk** | `--theme cyberpunk` | Hot neon pink, cyan, electric yellow |

### Powerline Styles
- `--style arrow` (default classic Powerline arrows)
- `--style rounded` (modern pill / bubble caps)
- `--style slanted` (diagonal slant transitions)
- `--style block` (clean vertical dividers)
- `--style ascii` (pure text fallback)

---

## 🛠️ Development & Testing

```bash
git clone https://github.com/thecodekaizen/agent-statusline.git
cd agent-statusline
npm install
npm run build
npm test
```

## 📄 License
MIT © [thecodekaizen](https://github.com/thecodekaizen)
