#!/usr/bin/env node
import { execSync } from "child_process";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getDiff(base: string, head: string): Promise<string> {
  try {
    return execSync(`git diff ${base}..${head}`, { encoding: "utf-8" });
  } catch {
    return execSync(`git diff ${base}`, { encoding: "utf-8" });
  }
}

async function reviewDiff(diff: string, context?: string): Promise<string> {
  const systemPrompt = `You are a senior software engineer performing a thorough code review.
Analyze the provided git diff and give structured feedback covering:
- **Summary**: What this change does in 1-2 sentences
- **Issues**: Bugs, security concerns, performance problems (if any)
- **Suggestions**: Improvements to readability, maintainability, or correctness
- **Verdict**: APPROVE / REQUEST_CHANGES / COMMENT

Be concise, specific, and actionable. Reference line numbers where relevant.`;

  const userPrompt = context
    ? `Context: ${context}\n\nDiff:\n\`\`\`diff\n${diff}\n\`\`\``
    : `Diff:\n\`\`\`diff\n${diff}\n\`\`\``;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content ?? "";
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
codex-pr-review — AI-powered pull request reviewer

Usage:
  codex-pr-review <base> [head]         Review diff between two refs
  codex-pr-review --staged              Review staged changes
  codex-pr-review --last                Review last commit

Options:
  --context, -c <text>   Additional context for the reviewer
  --help, -h             Show this help

Examples:
  codex-pr-review main feature/my-branch
  codex-pr-review HEAD~1 HEAD
  codex-pr-review --staged -c "Refactoring auth module"
`);
    process.exit(0);
  }

  let diff = "";
  let context: string | undefined;

  const ctxIdx = args.findIndex((a) => a === "--context" || a === "-c");
  if (ctxIdx !== -1) {
    context = args[ctxIdx + 1];
    args.splice(ctxIdx, 2);
  }

  if (args[0] === "--staged") {
    diff = execSync("git diff --cached", { encoding: "utf-8" });
  } else if (args[0] === "--last") {
    diff = execSync("git diff HEAD~1 HEAD", { encoding: "utf-8" });
  } else {
    const [base, head = "HEAD"] = args;
    diff = await getDiff(base, head);
  }

  if (!diff.trim()) {
    console.error("No diff found. Nothing to review.");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is not set.");
    process.exit(1);
  }

  console.log("🔍 Reviewing diff with Codex...\n");

  const review = await reviewDiff(diff, context);
  console.log(review);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
