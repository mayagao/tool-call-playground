export interface ModelPricing {
  input: string;
  output: string;
}

export interface ModelOption {
  id: string;
  name: string;
  title: string;
  description: string;
  tooltipDescription?: string;
  pricing: ModelPricing;
  contextWindow?: string;
}

export const modelOptions: ModelOption[] = [
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    title: "Claude 3.7 Sonnet",
    description: "Balanced generalist model with strong reasoning and coding skills.",
    tooltipDescription:
      "Ideal default choice for agents that need high quality reasoning, analysis, and code generation without the latency of larger models.",
    pricing: {
      input: "$3.00 / 1M tokens",
      output: "$15.00 / 1M tokens",
    },
    contextWindow: "200K tokens",
  },
  {
    id: "claude-3-7-haiku",
    name: "Claude 3.7 Haiku",
    title: "Claude 3.7 Haiku",
    description: "Fastest model tuned for lightweight reasoning and rapid responses.",
    tooltipDescription:
      "Great for chatty interactions, quick summarization, and cost-sensitive automation workflows.",
    pricing: {
      input: "$1.00 / 1M tokens",
      output: "$5.00 / 1M tokens",
    },
    contextWindow: "200K tokens",
  },
  {
    id: "claude-3-7-opus",
    name: "Claude 3.7 Opus",
    title: "Claude 3.7 Opus",
    description: "Flagship model for deeply complex, multi-step reasoning tasks.",
    tooltipDescription:
      "Use when you need the highest accuracy for research, strategy, or novel code generation where quality matters more than speed.",
    pricing: {
      input: "$15.00 / 1M tokens",
      output: "$75.00 / 1M tokens",
    },
    contextWindow: "200K tokens",
  },
  {
    id: "claude-3-7-thinking",
    name: "Claude 3.7 Thinking",
    title: "Claude 3.7 Thinking",
    description: "Extended reasoning mode that verbalizes intermediate thinking steps.",
    tooltipDescription:
      "Great for debugging agent behavior or when you need more transparency into reasoning chains.",
    pricing: {
      input: "$6.00 / 1M tokens",
      output: "$18.00 / 1M tokens",
    },
    contextWindow: "200K tokens",
  },
];
