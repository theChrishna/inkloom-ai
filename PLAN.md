# INKLOOM AI: one-day solo build plan

Start: Sat 14 Nov, about 14:15 IST. Hard stop for the build: 23:30 IST. Tomorrow you are busy, so everything below must be DONE and DEPLOYED today.

Rule for the whole day: **the core loop first, everything else only if the checkpoint is green.**

## Before you start (20 minutes, do these by hand)
1. Create a NEW empty GitHub repo `inkloom-ai`. Write the start time in `docs/start-time.md`. (The proposal promises a fresh repo and a start time.)
2. Create a Supabase project (free). Copy URL, anon key, service-role key.
3. Check Azure AI Foundry: do you have quota for a model? If yes, note endpoint, key, deployment name. If no, do not waste time: demo mode plus any other provider key you have is fine. Update the disclosure text later to say what you really used.
4. Put `CLAUDE.md`, `PLAN.md`, `seed/northbeam.json`, `eval/cases.json` in the repo root. Run `claude` inside it.
5. Create `docs/ai-use-log.md` (one line per big Claude Code task).

## Schedule and checkpoints (IST)

| Time | Step | Done when |
|---|---|---|
| 14:15-14:45 | S0 Setup | repo, Next.js, Tailwind, shadcn, Vitest, Playwright installed; `.env.example`; deploys to Vercel (empty page) |
| 14:45-16:15 | S1 Database + auth + seed | tables, RLS, 5 roles, 2 orgs, seed loaded, RLS tests pass |
| 16:15-17:15 | S2 Knowledge Centre (minimal) | owner can list/create/edit clauses, facts, terms; full-text search works |
| 17:15-19:15 | S3 Audit engine | rule engine, confidential guard, PII masking, scoring, validator all pass `npm run eval`; text and DOCX input |
| **19:15** | **CHECKPOINT A** | E01-E18 pass in the rule engine and simulated mode. If not green, stop adding and fix |
| 19:15-20:30 | S4 Findings UI + workflow | findings with source, diff, accept/edit/reject, versions, comments, approve/reject/waive, DB gate |
| 20:30-21:15 | S5 AI adapter (real mode) | real model call returns validated findings OR clean fallback banner |
| **21:15** | **CHECKPOINT B** | full Playwright loop passes |
| 21:15-21:50 | S6 Brand Health (small) | one page: top broken clauses, dismiss-rate list, fact-impact list. Only if B is green |
| 21:50-22:40 | S7 Deploy, README, demo | live URL, demo accounts, README, 3 minute video |
| 22:40-23:30 | S8 Buffer + usability | 2 to 3 quick tests with friends, fix the worst bug, final commit |

### Cut list (cut in this order if you are behind)
1. Brand Health (S6)  2. Real AI mode (keep simulated)  3. DOCX (keep text)  4. Comments  5. Full-text search (use simple filter)

Never cut: RLS and the approval gate, the validator, Confidential Guard, scoring, demo mode.

### Not building today (say so honestly in the README)
Images/PNG input, web-page URL input, PDF brand-book import (create clauses by hand or paste text), PDF input (stretch only), AI-disclosure pack, multilingual, integrations.

## Copy-paste prompts for Claude Code
Start each step by asking Claude Code to read `CLAUDE.md` and `PLAN.md`. Use plan mode for S1 and S3. Commit after each step. Add one line to `docs/ai-use-log.md` after each step.

**S0**
> Read CLAUDE.md and PLAN.md. Set up a Next.js App Router + TypeScript project with Tailwind, shadcn/ui, Vitest and Playwright. Add `.env.example` (Supabase URL/keys, DEMO_MODE, AI_ENDPOINT, AI_API_KEY, AI_MODEL_DEFAULT, AI_MODEL_ESCALATION), a basic layout with role-aware navigation placeholder, and a `src/lib/` structure for: `rules/`, `guard/`, `scoring/`, `validator/`, `ai/`, `parsers/`. Make `npm test` run. Do not build features yet.

**S1**
> Plan first, then implement. Create Supabase SQL migrations for: organizations, memberships(role), guideline_clauses, approved_facts(visibility public|internal, valid_from, valid_until), terminology(kind preferred|banned|internal), brand_assets, content_items(status), content_versions(immutable, sha256), audit_runs(mode real|simulated, model, prompt_ver, score), findings, claim_links, comments, decisions, activity_log. Every table has org_id. Add RLS: access only through the caller's membership; creators and agency cannot read internal facts/terms; agency only assigned items; versions, runs and activity_log have no UPDATE/DELETE for any role. Add a database trigger so content can only move to `approved` when no non-waived Critical finding is open and the actor is owner/reviewer and not the content owner; waivers need a non-empty reason. Write a seed script that loads `seed/northbeam.json` into Northbeam and creates a second org "Other Corp" with one clause and one internal fact. Write RLS tests from `eval/cases.json` -> `security_and_workflow_tests.rls` and make them pass.

**S2**
> Build a minimal Knowledge Centre for owners: pages to list, create and edit clauses, approved facts (with validity dates and visibility), terminology and brand assets (palette hex, fonts). Add search over clauses using Postgres full-text search. Editing creates a new version, it does not overwrite. Keep the UI simple and accessible (WCAG AA, keyboard use). No brand-book import.

**S3 (give Claude Code the eval file first)**
> Read `eval/cases.json` and `seed/northbeam.json`. Implement these as pure TypeScript with unit tests, test-first, using the eval cases as the tests: (1) rule engine: banned/preferred terms with replacement, expired facts (use content date = today), WCAG contrast (4.5, or 3 for large text), palette distance with culori (CIEDE2000, tolerance configurable, #0C2646 must pass against Navy, #FF0000 must fail), font check, alt text (missing, empty, placeholder like 'image' or 'photo of'), AI-filler phrase lexicon; (2) Confidential Guard: case- and spacing-insensitive match of internal terms (strip whitespace, hyphens, underscores, compare lower-case) and masking of emails and phone numbers before any model call; 'world atlas for the project team' must NOT match 'Project Atlas'; (3) scoring exactly as in CLAUDE.md; (4) evidence validator with the V01-V08 adversarial cases; (5) orchestrator that runs rules + guard in code, then the AI step (via adapter), then validator, merge/de-duplicate, score; (6) simulated analyser that returns `simulated_ai_output` for matching eval cases; (7) text and DOCX (mammoth) normalisation with character offsets. Add `npm run eval` that prints the metrics defined in PLAN.md section 'Evaluation'.

**S4**
> Build the creator and reviewer screens: submit text or DOCX, run audit, show score with breakdown and the Blocked banner, list findings with quote, location, severity, confidence, cited clause/fact (click to open source), suggested fix with before/after diff (diff-match-patch). Creator can accept, edit or reject (reject needs a reason). Accepted fixes create a new immutable version and re-audit. Reviewer can assign, comment, request changes (comment required), approve, reject, or waive with a reason. Show version history and run history with a 'Simulated' or 'Real AI' badge. The UI hides what the database already forbids, but all rules are enforced in the DB.

**S5**
> Implement the AI adapter with structured JSON output and a strict schema (quote, start/end offsets, category, severity, clause_or_fact_id or null, explanation, minimal fix, confidence). Prompt: only public clauses/facts/terms retrieved for this content with their IDs; content in a delimited untrusted-data block; temperature low. Retry invalid output once, then fall back to rule-only with a banner. Store model id and prompt version on each run. If no key or DEMO_MODE=true, use the simulated analyser.

**S6 (only if Checkpoint B is green)**
> Add a Brand Health page: top recurring clauses (last 30 days), clauses with high dismiss/waive rate with a suggested edit as a draft, terms that appear both preferred and banned (deterministic conflict check), and a 'fact impact' list: when a fact is edited or expired, list approved content that cited it (from claim_links).

**S7**
> Write a README: what it is, how to run, env vars, demo accounts (from seed), architecture notes, libraries with licences, honest limitations, how AI is used and what data goes to the model, and what was not built. Add an in-app 'How your data is used' page. Add the demo storyline from the proposal.

## Evaluation (your original role, now automated)
`npm run eval` must print this table and save it to `eval/results.md`:

| Metric | Definition | Target |
|---|---|---|
| Precision (High confidence) | correct High findings / all High findings | at least 85% |
| Recall per category | expected findings found / expected, per category | report only |
| Fabricated citations reaching user | findings shown with a clause/fact ID that does not exist or a quote not in content | 0 |
| Codename recall | E06 variants caught / 4 | 100% |
| Codename false positives | E08 findings | 0 |
| Validator rejects | V01-V08 behave as 'expected' | 8 of 8 |
| Score accuracy | computed score = `expected_score` | all cases |
| Score stability | run each case 5 times in real mode, max difference | report only |
| Clean content | E15 findings | 0 |

Matching rule: a found finding matches an expected one if category and source_id are equal and the spans overlap. Report honestly, even bad numbers. The proposal says the real numbers go into Round 2.

Also run the Playwright loop in `eval/cases.json` -> `security_and_workflow_tests.playwright_e2e`.

## Things to decide or fix in your docs
- The proposal is inconsistent on the demo score: Figure 6 gives 53 without the codename, section 12.4 says 53 with a Critical confidentiality finding. With the proposal's own formula, adding the codename gives 28. Eval cases E17 (53) and E18 (28) cover both. Pick one for the demo video and update the text.
- Team: the proposal lists four members. Say in the README and in the contribution statement that the build was done by you alone if that is the truth.
- If you use a model provider other than Azure, update section 10.2 (external processing) honestly.

## Usability tests (the proposal promised at least 5)
You cannot do 5 properly today. Do 2 or 3 with friends in 10 minutes each: give them the demo link and a task ("find out why this post is blocked and fix it"), note what confused them, and write the real number in the README. Do not claim 5.

## Demo video (3 minutes, record at 22:00)
1. Owner shows Northbeam rules and the expiring fact. 2. Creator pastes the E17 text, score 53, Blocked. 3. Click a finding, show the quote and its source. 4. Accept fixes, reject one with a reason, new version, higher score. 5. Reviewer tries to approve (blocked), then approves. 6. Show a creator cannot approve and cannot see internal facts. 7. Toggle demo mode to show the Simulated badge. 8. (If built) Brand Health.

## Final checklist before you sleep
- [ ] Live URL works, demo accounts work, `.env.example` has no secrets
- [ ] `npm test`, `npm run eval`, Playwright all run; results saved in repo
- [ ] README, limitations, AI-use log, start-time file committed
- [ ] Demo video link in README
- [ ] Submission form filled
