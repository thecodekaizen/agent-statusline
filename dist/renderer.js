import { DEFAULT_THEME, THEMES } from './themes.js';
import { getAgentIcon, NERD_FONT_ICONS, POWERLINE_STYLES, UNICODE_ICONS } from './glyphs.js';
import { ANSI_BOLD, ANSI_RESET, bgColor, fgColor, getVisibleWidth } from './utils/ansi.js';
import { contractPath, formatDuration, formatNumber, getTerminalWidth } from './utils/terminal.js';
export function renderStatusLine(data, options = {}) {
    const theme = (options.theme && THEMES[options.theme.toLowerCase()]) || DEFAULT_THEME;
    const style = options.style || 'arrow';
    const glyphs = POWERLINE_STYLES[style] || POWERLINE_STYLES.arrow;
    const icons = options.nerdFonts === false ? UNICODE_ICONS : NERD_FONT_ICONS;
    const termWidth = options.maxWidth || getTerminalWidth();
    const leftSegments = [];
    const rightSegments = [];
    // 1. Agent badge
    const agentIcon = getAgentIcon(data.agent, options.nerdFonts !== false);
    leftSegments.push({
        id: 'agent',
        text: `${agentIcon} ${data.agentLabel}`,
        color: theme.primary,
        priority: 1
    });
    // 2. Model & Effort
    if (data.model) {
        let modelText = data.model;
        if (data.effort) {
            modelText += ` (${data.effort})`;
        }
        leftSegments.push({
            id: 'model',
            text: modelText,
            color: theme.secondary,
            priority: 2
        });
    }
    // 3. Step / Turns count or Tools
    if (data.stepIndex !== undefined || data.toolCallCount !== undefined) {
        const parts = [];
        if (data.stepIndex !== undefined) {
            parts.push(`${icons.step} ${data.stepIndex}`);
        }
        if (data.toolCallCount && data.toolCallCount > 0) {
            parts.push(`${icons.tools} ${data.toolCallCount}`);
        }
        if (parts.length > 0) {
            leftSegments.push({
                id: 'steps',
                text: parts.join(' '),
                color: theme.stats,
                priority: 4
            });
        }
    }
    // 4. Git Info
    if (data.git) {
        const git = data.git;
        const parts = [`${icons.git} ${git.branch}`];
        if (git.sha) {
            parts.push(`[${git.sha}]`);
        }
        if (git.isDirty) {
            const dirtyParts = [];
            if (git.stagedCount > 0)
                dirtyParts.push(`+${git.stagedCount}`);
            if (git.unstagedCount > 0)
                dirtyParts.push(`!${git.unstagedCount}`);
            if (git.untrackedCount > 0)
                dirtyParts.push(`?${git.untrackedCount}`);
            parts.push(`${icons.dirty} ${dirtyParts.join(' ')}`);
        }
        else {
            parts.push(icons.clean);
        }
        if (git.aheadCount || git.behindCount) {
            const div = [];
            if (git.aheadCount)
                div.push(`⇡${git.aheadCount}`);
            if (git.behindCount)
                div.push(`⇣${git.behindCount}`);
            parts.push(div.join(' '));
        }
        leftSegments.push({
            id: 'git',
            text: parts.join(' '),
            color: git.isDirty ? theme.warning : theme.tertiary,
            priority: 3
        });
    }
    // 5. CWD
    if (data.cwd) {
        leftSegments.push({
            id: 'cwd',
            text: `${icons.folder} ${contractPath(data.cwd)}`,
            color: theme.quaternary,
            priority: 5
        });
    }
    // Right segments:
    // 6. Tokens
    if (data.tokensIn !== undefined || data.tokensOut !== undefined) {
        const tokParts = [icons.token];
        if (data.tokensIn !== undefined)
            tokParts.push(`${formatNumber(data.tokensIn)} in`);
        if (data.tokensOut !== undefined)
            tokParts.push(`${formatNumber(data.tokensOut)} out`);
        rightSegments.push({
            id: 'tokens',
            text: tokParts.join(' '),
            color: theme.quaternary,
            priority: 6
        });
    }
    // 7. Session Duration
    if (data.durationMs !== undefined && data.durationMs > 0) {
        rightSegments.push({
            id: 'time',
            text: `${icons.clock} ${formatDuration(data.durationMs)}`,
            color: theme.primary,
            priority: 2
        });
    }
    // Format Left Group with Powerline transitions
    return buildPowerlineLine(leftSegments, rightSegments, glyphs, termWidth);
}
function buildPowerlineLine(left, right, glyphs, termWidth) {
    // Pre-calculate segments while adjusting for terminal width
    let activeLeft = [...left];
    let activeRight = [...right];
    function calculateTotalWidth() {
        let width = 0;
        if (glyphs.leftCap)
            width += getVisibleWidth(glyphs.leftCap);
        for (const seg of activeLeft) {
            width += getVisibleWidth(seg.text) + 2; // + 2 padding spaces
            width += getVisibleWidth(glyphs.leftSeparator);
        }
        for (const seg of activeRight) {
            width += getVisibleWidth(glyphs.rightSeparator);
            width += getVisibleWidth(seg.text) + 2;
        }
        if (glyphs.rightCap)
            width += getVisibleWidth(glyphs.rightCap);
        return width;
    }
    // Drop low priority segments if wider than terminal
    while (calculateTotalWidth() > termWidth && (activeLeft.length > 2 || activeRight.length > 0)) {
        if (activeRight.length > 0) {
            let maxIdx = 0;
            let maxPriority = -1;
            for (let i = 0; i < activeRight.length; i++) {
                const p = activeRight[i].priority ?? 5;
                if (p > maxPriority) {
                    maxPriority = p;
                    maxIdx = i;
                }
            }
            activeRight.splice(maxIdx, 1);
        }
        else {
            let maxIdx = 0;
            let maxPriority = -1;
            for (let i = 0; i < activeLeft.length; i++) {
                const p = activeLeft[i].priority ?? 5;
                if (p > maxPriority) {
                    maxPriority = p;
                    maxIdx = i;
                }
            }
            activeLeft.splice(maxIdx, 1);
        }
    }
    let out = '';
    // Render Left Segments
    for (let i = 0; i < activeLeft.length; i++) {
        const seg = activeLeft[i];
        const prevSeg = i > 0 ? activeLeft[i - 1] : undefined;
        if (i === 0) {
            if (glyphs.leftCap) {
                out += fgColor(seg.color.bg) + glyphs.leftCap;
            }
        }
        else if (prevSeg) {
            // Transition from prev to curr
            out += fgColor(prevSeg.color.bg) + bgColor(seg.color.bg) + glyphs.leftSeparator;
        }
        // Segment text
        out += fgColor(seg.color.fg) + bgColor(seg.color.bg) + ANSI_BOLD + ` ${seg.text} ` + ANSI_RESET;
    }
    // Closing left cap
    if (activeLeft.length > 0) {
        const lastLeft = activeLeft[activeLeft.length - 1];
        out += fgColor(lastLeft.color.bg) + ANSI_RESET + glyphs.leftSeparator;
    }
    // Flex spacer if right segments exist
    if (activeRight.length > 0) {
        const currentWidth = getVisibleWidth(out);
        let rightWidth = 0;
        for (const seg of activeRight) {
            rightWidth += getVisibleWidth(glyphs.rightSeparator) + getVisibleWidth(seg.text) + 2;
        }
        if (glyphs.rightCap)
            rightWidth += getVisibleWidth(glyphs.rightCap);
        const gap = Math.max(1, termWidth - currentWidth - rightWidth);
        out += ' '.repeat(gap);
        // Render Right Segments
        for (let i = 0; i < activeRight.length; i++) {
            const seg = activeRight[i];
            const prevSeg = i > 0 ? activeRight[i - 1] : undefined;
            if (i === 0) {
                out += fgColor(seg.color.bg) + glyphs.rightSeparator;
            }
            else if (prevSeg) {
                out += fgColor(seg.color.bg) + bgColor(prevSeg.color.bg) + glyphs.rightSeparator;
            }
            out += fgColor(seg.color.fg) + bgColor(seg.color.bg) + ANSI_BOLD + ` ${seg.text} ` + ANSI_RESET;
        }
        if (glyphs.rightCap && activeRight.length > 0) {
            const lastRight = activeRight[activeRight.length - 1];
            out += fgColor(lastRight.color.bg) + glyphs.rightCap + ANSI_RESET;
        }
    }
    out += ANSI_RESET;
    return out;
}
//# sourceMappingURL=renderer.js.map