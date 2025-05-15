import React from "react";
import { EndBlockDetector } from "./EndBlockDetector";

export function EndBlockExample() {
  // Sample data that resembles content from LLM with end blocks
  const sampleContent = `<pr_title>Summarize retro content and create tracking issue for action items</pr_title>
<pr_description>This PR addresses the task of summarizing the Copilot Extensibility Team's retrospective from April 2, 2025, and creating a tracking mechanism for the action items identified during the retro.

Changes made:
- Created a detailed markdown summary of the retro (issues/retro-04-02-2025-action-items.md) that captures:
  - Key themes from the discussion
  - Positive highlights
  - Areas for improvement
  - Specific action items with assignees
- Created a GitHub issue (#258) to track action items with:
  - Clear ownership assignments (@belaltaher8 assigned to relevant items)
  - Appropriate labeling (retro, action-items, team-health)
  - Structured format for easy tracking and follow-up

Key action items identified:
- Document MCP landscape/org chart
- Organize MCP Lunch and Learn session
- Share "after Build" documentation
- Consider organizing a Padawan-wide retrospective
- Implement knowledge sharing sessions
- Investigate extensibility support issues
- Evaluate team workload and pace
- Clarify project management approach

The issue will serve as the primary tracking mechanism for the team to follow up on these action items and ensure they're addressed.</pr_description>`;

  // This simulates the finish_reason property from an LLM response
  const finishReason = "stop";

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">End Block Example</h2>
      <EndBlockDetector content={sampleContent} finishReason={finishReason} />
    </div>
  );
}
