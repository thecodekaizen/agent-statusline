export const POWERLINE_STYLES = {
    arrow: {
        leftSeparator: '',
        leftSubSeparator: '',
        rightSeparator: '',
        rightSubSeparator: '',
        leftCap: '',
        rightCap: ''
    },
    rounded: {
        leftSeparator: '',
        leftSubSeparator: '',
        rightSeparator: '',
        rightSubSeparator: '',
        leftCap: '',
        rightCap: ''
    },
    slanted: {
        leftSeparator: '',
        leftSubSeparator: '',
        rightSeparator: '',
        rightSubSeparator: '',
        leftCap: '',
        rightCap: ''
    },
    block: {
        leftSeparator: ' ',
        leftSubSeparator: '│',
        rightSeparator: ' ',
        rightSubSeparator: '│',
        leftCap: '',
        rightCap: ''
    },
    ascii: {
        leftSeparator: '>',
        leftSubSeparator: '|',
        rightSeparator: '<',
        rightSubSeparator: '|',
        leftCap: '[',
        rightCap: ']'
    }
};
export const NERD_FONT_ICONS = {
    agent: '󰧑',
    git: '',
    clock: '󱑆',
    step: '󰘬',
    tools: '',
    sandbox: '󰒃',
    dirty: '●',
    clean: '✔',
    token: '󰅒',
    folder: ''
};
export const UNICODE_ICONS = {
    agent: '▲',
    git: '⑂',
    clock: '⏱',
    step: '#',
    tools: '⚙',
    sandbox: '🛡',
    dirty: '*',
    clean: '✓',
    token: 'T',
    folder: '📁'
};
export function getAgentIcon(agent, nerdFonts = true) {
    if (!nerdFonts) {
        switch (agent) {
            case 'antigravity': return '✦';
            case 'codex': return '◈';
            case 'claude': return '✻';
            default: return '❯';
        }
    }
    switch (agent) {
        case 'antigravity': return '󰧑';
        case 'codex': return '󰚩';
        case 'claude': return '󰯉';
        default: return '󰞷';
    }
}
//# sourceMappingURL=glyphs.js.map