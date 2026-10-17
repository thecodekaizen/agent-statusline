#!/usr/bin/env zsh
# agent-statusline ZSH Prompt Integration
# Add this to your ~/.zshrc:
#   source /path/to/agent-statusline/scripts/prompt.zsh

autoload -Uz add-zsh-hook

_agent_statusline_precmd() {
  local statusline
  statusline=$(agent-statusline 2>/dev/null)
  if [[ -n "$statusline" ]]; then
    PROMPT="${statusline}
%# "
  else
    PROMPT="%F{cyan}%~%f %# "
  fi
}

add-zsh-hook precmd _agent_statusline_precmd
