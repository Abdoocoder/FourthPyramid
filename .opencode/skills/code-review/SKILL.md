---
name: code-review
description: Automated code review for pull requests using multi-perspective analysis with confidence-based scoring.
---

Perform a structured code review on a pull request. Follow these steps precisely:

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Git repo with GitHub remote

## Review Process

### 1. Eligibility Check

Check if the PR (a) is closed, (b) is a draft, (c) is trivial/automated, or (d) already has your review. If any true, stop.

### 2. Gather Guidelines

List file paths to relevant CLAUDE.md or AGENTS.md files from the codebase — root-level plus any in directories the PR modified. Do NOT read contents yet.

### 3. Summarize Changes

View the PR diff and return a one-paragraph summary of what the change does.

### 4. Multi-Perspective Analysis

Run these review passes sequentially (not in parallel since sub-agent spawning is unavailable):

**a. Guideline compliance** — Read the relevant CLAUDE.md/AGENTS.md files. Audit changes against each applicable rule. Not all instructions apply during review.

**b. Bug detection** — Read the file changes. Do a shallow scan for obvious bugs in the changes themselves. Avoid reading extra context. Focus on real bugs, skip nitpicks and likely false positives.

**c. Git history context** — Read `git blame` and git log history of the modified code. Identify issues in light of historical context.

**d. Previous PR comments** — Check previous PRs that touched these files. Note any feedback that may apply to the current PR.

**e. Code comment compliance** — Read code comments in modified files. Verify changes comply with guidance in existing comments.

### 5. Confidence Scoring

For each issue found, score 0-100:

| Score | Meaning |
|-------|---------|
| 0 | False positive or pre-existing issue |
| 25 | Might be real, couldn't verify |
| 50 | Real but minor/nitpick |
| 75 | Highly confident, will impact functionality |
| 100 | Absolutely certain, verified |

For guideline issues: double-check the guideline explicitly calls out that specific issue.

### 6. Filter & Report

Filter to issues ≥80. If none remain, report that. Otherwise, post a comment on the PR with this format:

```
### Code review

Found N issues:

1. Brief description (guideline source / bug / context)

https://github.com/owner/repo/blob/FULL_SHA/path/file#Lstart-Lend

2. ...
```

### False Positive Filtering Rules

Skip:
- Pre-existing issues not introduced by this PR
- Things that look like bugs but aren't
- Pedantic nitpicks
- Issues a linter/typechecker/compiler would catch
- General quality issues unless explicitly required in guidelines
- Changes that are likely intentional or directly related to the broader change

Never check build signal or run typecheck/build steps — these run separately.
