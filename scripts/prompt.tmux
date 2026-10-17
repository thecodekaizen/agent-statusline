# agent-statusline tmux Integration
# Add the following configuration to your ~/.tmux.conf:

# Refresh statusbar every 3 seconds
set -g status-interval 3

# Allow wider status length for rich Powerline segments
set -g status-right-length 140
set -g status-left-length 40

# Show agent statusline on the right side of tmux
set -g status-right "#(agent-statusline --theme catppuccin)"
