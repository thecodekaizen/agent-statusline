import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { renderStatusLine } from '../renderer.js';
import { stripAnsi } from '../utils/ansi.js';
describe('Statusline Renderer', () => {
    const mockData = {
        agent: 'antigravity',
        agentLabel: 'Antigravity',
        model: 'Gemini 3.8 Flash',
        stepIndex: 12,
        toolCallCount: 5,
        git: {
            branch: 'main',
            sha: 'abcdef1',
            isDirty: false,
            stagedCount: 0,
            unstagedCount: 0,
            untrackedCount: 0
        },
        tokensIn: 15400,
        tokensOut: 850,
        durationMs: 45000
    };
    test('renders statusline with all segments in arrow style', () => {
        const output = renderStatusLine(mockData, { style: 'arrow', theme: 'catppuccin' });
        const stripped = stripAnsi(output);
        assert.match(stripped, /Antigravity/);
        assert.match(stripped, /Gemini 3\.8 Flash/);
        assert.match(stripped, /main/);
        assert.match(stripped, /12/);
        assert.match(stripped, //);
    });
    test('renders rounded style with bubble caps', () => {
        const output = renderStatusLine(mockData, { style: 'rounded', theme: 'tokyonight' });
        const stripped = stripAnsi(output);
        assert.match(stripped, //);
        assert.match(stripped, //);
        assert.match(stripped, /Antigravity/);
    });
    test('renders pure ASCII style without special glyphs', () => {
        const output = renderStatusLine(mockData, { style: 'ascii', nerdFonts: false });
        const stripped = stripAnsi(output);
        assert.match(stripped, /\[/);
        assert.match(stripped, />/);
        assert.match(stripped, /Antigravity/);
    });
    test('adapts to narrow terminal by dropping lower priority segments', () => {
        const wideOutput = renderStatusLine(mockData, { maxWidth: 120 });
        const narrowOutput = renderStatusLine(mockData, { maxWidth: 40 });
        const wideStripped = stripAnsi(wideOutput);
        const narrowStripped = stripAnsi(narrowOutput);
        assert.ok(narrowStripped.length < wideStripped.length);
        // Core priority segments (Agent and Model) are retained
        assert.match(narrowStripped, /Antigravity/);
    });
});
//# sourceMappingURL=renderer.test.js.map