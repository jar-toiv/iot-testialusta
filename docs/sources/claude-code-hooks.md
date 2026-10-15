# Claude Code hooks reference

- **Kind:** Primary
- **URL:** https://code.claude.com/docs/en/hooks (page text about 270 000
  characters, read up to character 200 000)
- **Read:** 2026-10-15, via WebFetch
- **Used by:** `.claude/scripts/hooks/remind-source-archive.sh`

## Decision control summary table

> PreToolUse | `hookSpecificOutput` | `permissionDecision` (allow/deny/ask/defer), `permissionDecisionReason`

## PreToolUse decision control

> `"allow"` skips the permission prompt, except for the actions no mode
> auto-approves, for reads from network paths, and for `AskUserQuestion` and
> `ExitPlanMode`, which need `updatedInput` paired with it. `"deny"` prevents
> the tool call. `"ask"` prompts the user to confirm. `"defer"` exits
> gracefully so the tool can be resumed later. Deny and ask rules are still
> evaluated regardless of what the hook returns

`permissionDecisionReason`:

> For `"ask"`, shown to the user in the permission prompt. When Claude Code
> denies the call in a `-p` run where no one can answer that prompt, Claude
> reads the reason in the tool result instead. For `"deny"`, shown to
> Claude. For `"allow"` and `"defer"`, written to the debug log only

Also from the same section (paraphrase by WebFetch): `"defer"` is honoured
only in non-interactive `-p` mode. Precedence when hooks disagree:
`deny` > `defer` > `ask` > `allow`.

## additionalContext timing ("Add context for Claude")

> Claude Code wraps the string in a system reminder and inserts it into the
> conversation at the point where the hook fired. Claude reads the reminder
> on the next model request, but it doesn't appear as a chat message in the
> interface.

> PreToolUse, PostToolUse, PostToolUseFailure, and PostToolBatch: next to the tool result

So a PreToolUse reminder reaches Claude only after the tool has run.
Observed live the same day: a WebFetch result arrived first, the archive
reminder with it.

Values over 10 000 characters are written to a file with a 2 000-character
preview (paraphrase).
