import type { AgentStatusData } from '../types.js';
import { getGitInfo } from './git.js';

export function parseClaudeStatusPayload(rawJson: string): AgentStatusData | undefined {
  try {
    const data = JSON.parse(rawJson);
    if (!data || typeof data !== 'object') return undefined;

    const cwd = data.cwd || data.workspace?.current_dir || process.cwd();
    const git = getGitInfo(cwd);

    let modelName: string | undefined;
    if (data.model) {
      modelName = data.model.display_name || data.model.id;
      // Strip context suffix if present, e.g. " (1M context)"
      if (modelName) {
        modelName = modelName.replace(/\s*\([^)]*context\)/i, '').trim();
      }
    }

    return {
      agent: 'claude',
      agentLabel: 'Claude Code',
      model: modelName,
      cwd,
      conversationId: data.session_id,
      costUsd: data.cost?.total_cost_usd,
      durationMs: data.cost?.total_duration_ms,
      tokensIn: data.context_window?.total_input_tokens,
      tokensOut: data.context_window?.total_output_tokens,
      tokensCached: data.context_window?.current_usage?.cache_read_input_tokens,
      contextWindow: data.context_window?.context_window_size,
      contextPercent: data.context_window?.used_percentage,
      git
    };
  } catch {
    return undefined;
  }
}
