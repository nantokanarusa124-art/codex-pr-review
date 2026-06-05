# codex-pr-review

> AI-powered pull request reviewer for your terminal — powered by OpenAI Codex

[![npm version](https://img.shields.io/npm/v/codex-pr-review)](https://www.npmjs.com/package/codex-pr-review)
[![CI](https://github.com/nantokanarusa124-art/codex-pr-review/actions/workflows/ci.yml/badge.svg)](https://github.com/nantokanarusa124-art/codex-pr-review/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Stop waiting for reviewers. Get instant, structured feedback on any git diff — before you even open a PR.**

```
$ codex-pr-review main feature/auth-refactor

🔍 Reviewing diff with Codex...

**Summary**
Refactors the authentication module to use JWT tokens instead of session cookies,
adding token refresh logic and updating middleware accordingly.

**Issues**
- Line 47 (auth.ts): The token expiry is hardcoded to 3600s. Consider making
  this configurable via environment variable.
- Line 112 (middleware.ts): No handling for malformed JWT payloads — will throw
  an unhandled exception if `jwt.verify()` fails.

**Suggestions**
- Extract the token validation logic into a separate `validateToken()` helper
  for easier unit testing.
- Add a test case for the token refresh path.

**Verdict**: REQUEST_CHANGES
```

---

## Why

Code review is the biggest bottleneck in most development workflows. `codex-pr-review` gives you a senior engineer's perspective on your diff in seconds — catching bugs, security issues, and style problems before your teammates even see the PR.

It works on any git repository, against any two refs, with no configuration required.

---

## Install

```bash
npm install -g codex-pr-review
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY=sk-...
```

---

## Usage

```bash
# Review diff between two branches
codex-pr-review main feature/my-branch

# Review the last commit
codex-pr-review --last

# Review staged changes before committing
codex-pr-review --staged

# Add context to guide the review
codex-pr-review main feature/my-branch --context "Performance optimization for the search query"

# Review between specific commits
codex-pr-review HEAD~3 HEAD
```

### Output format

Every review includes:

| Section | Description |
|---------|-------------|
| **Summary** | What the diff does in plain English |
| **Issues** | Bugs, security concerns, performance problems |
| **Suggestions** | Readability and maintainability improvements |
| **Verdict** | `APPROVE` / `REQUEST_CHANGES` / `COMMENT` |

---

## GitHub Actions integration

Add AI review as a step in your CI pipeline:

```yaml
- name: AI Code Review
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    npm install -g codex-pr-review
    codex-pr-review ${{ github.event.pull_request.base.sha }} ${{ github.event.pull_request.head.sha }}
```

---

## Requirements

- Node.js 18+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- A git repository

---

## Contributing

Issues and PRs are welcome. Please open an issue before submitting large changes.

---

## License

MIT
