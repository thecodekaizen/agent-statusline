import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { hexToRgb, stripAnsi, getVisibleWidth } from '../utils/ansi.js';

describe('ANSI Utilities', () => {
  test('hexToRgb parses 6-char hex correctly', () => {
    const rgb = hexToRgb('#ff8800');
    assert.deepStrictEqual(rgb, { r: 255, g: 136, b: 0 });
  });

  test('hexToRgb parses 3-char hex correctly', () => {
    const rgb = hexToRgb('#f80');
    assert.deepStrictEqual(rgb, { r: 255, g: 136, b: 0 });
  });

  test('stripAnsi removes ANSI escape codes', () => {
    const styled = '\x1b[31;1mHello\x1b[0m \x1b[38;2;255;0;0mWorld\x1b[0m';
    assert.strictEqual(stripAnsi(styled), 'Hello World');
  });

  test('getVisibleWidth ignores ANSI escape sequences', () => {
    const styled = '\x1b[38;2;255;255;255m\x1b[48;2;0;0;0mTesting\x1b[0m';
    assert.strictEqual(getVisibleWidth(styled), 7);
  });

  test('getVisibleWidth accounts for wide emojis', () => {
    const textWithEmoji = '🚀 Launch';
    // '🚀' (width 2) + ' ' (1) + 'Launch' (6) = 9
    assert.strictEqual(getVisibleWidth(textWithEmoji), 9);
  });
});
