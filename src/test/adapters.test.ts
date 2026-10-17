import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { parseClaudeStatusPayload } from '../adapters/claude.js';

describe('Adapters', () => {
  test('parseClaudeStatusPayload extracts valid session and tokens', () => {
    const raw = JSON.stringify({
      session_id: 'sess-12345',
      cwd: '/test/workspace',
      model: {
        id: 'claude-3-7-sonnet',
        display_name: 'Claude 3.7 Sonnet (1M context)'
      },
      cost: {
        total_cost_usd: 0.052,
        total_duration_ms: 120000
      },
      context_window: {
        total_input_tokens: 35000,
        total_output_tokens: 1200,
        used_percentage: 15
      }
    });

    const parsed = parseClaudeStatusPayload(raw);
    assert.ok(parsed);
    assert.strictEqual(parsed.agent, 'claude');
    assert.strictEqual(parsed.model, 'Claude 3.7 Sonnet'); // Context suffix stripped
    assert.strictEqual(parsed.costUsd, 0.052);
    assert.strictEqual(parsed.tokensIn, 35000);
    assert.strictEqual(parsed.contextPercent, 15);
  });

  test('parseClaudeStatusPayload handles malformed JSON gracefully', () => {
    const result = parseClaudeStatusPayload('{ not valid json }');
    assert.strictEqual(result, undefined);
  });
});
