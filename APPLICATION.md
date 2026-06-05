# Codex for Open Source — 申請文草稿

---

## "Why does this repository qualify?" (500文字以内・英語)

`codex-pr-review` is a CLI tool that brings AI-powered code review directly into developer terminals and CI pipelines using the OpenAI API. It targets a universal pain point: review latency. Any developer working alone or in a small team can get structured, actionable feedback on a git diff before opening a PR — without waiting for a human reviewer.

The project is designed around real maintainer workflows: staged-change review before commit, branch diffing, and GitHub Actions integration. As usage grows, maintaining prompt quality, model compatibility, and CI integration examples requires ongoing effort that API credits would directly support.

---

## "How will you use API credits?" (500文字以内・英語)

API credits will fund the core functionality of `codex-pr-review` itself: every review invocation calls the OpenAI API. Credits will support:

1. Running the tool against our own PRs and releases as part of the maintainer workflow — dogfooding the product continuously.
2. Expanding the prompt library to support additional review modes (security-focused, performance-focused, documentation review).
3. Testing model compatibility across Codex versions to ensure the tool stays current as OpenAI releases updates.

This is a direct, transparent use case: the tool exists to use Codex for PR review, and the credits sustain that mission.

---

## 補足メモ（申請時の"Anything else?"欄用）

This project was built specifically to make Codex accessible to solo developers and small teams who lack dedicated reviewers. The GitHub Actions integration example in the README is designed to lower the barrier for maintainers to adopt AI review in their own OSS workflows — which aligns directly with the goals of the Codex for Open Source program.
