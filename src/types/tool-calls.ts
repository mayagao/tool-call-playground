export type ToolCall = {
  function: {
    arguments: string;
    name: string;
  };
  id: string;
  index: number;
  type: string;
};

export type Choice = {
  delta: {
    content?: string;
    role?: string;
    reasoning_text?: string;
    tool_calls?: ToolCall[];
  };
  finish_reason: string;
};

export type ToolCallResult = {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage?: {
    completion_tokens: number;
    prompt_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
    total_tokens: number;
  };
};

export type ToolCallDisplayMode = "expanded" | "condensed";

export interface ToolCallDisplayConfig {
  [key: string]: ToolCallDisplayMode;
}
