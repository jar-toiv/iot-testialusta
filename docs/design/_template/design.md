# [Feature name]: Technical Design

- **Related:** requirements.md, ADR-XXXX

## Components

What pieces exist and what does each one own? Keep this at the level of
"the driver reads raw registers, the normalizer converts them to SI units,
the quality gate decides GOOD/UNCERTAIN/BAD", not class-by-class detail.

## Data model / interface

The shape of the data crossing this component's boundary. TypeScript
types are fine here if that's the clearest way to say it, but this is
still a sketch, not the final `src/types/` file.

**Do not restate the Reading envelope here.** It is defined once, in
ADR-0004, including the quality values, the allowed substatus set and
the dual timestamp. Reference it (`Related: ADR-0004`) and describe only
what this component adds or narrows on top of it.

```ts
// Sketch only - what THIS component contributes, not the envelope.
```

## Pseudocode

Describe the logic in prose-like pseudocode: enough to catch design
mistakes before writing real code, not a full implementation.

```
```

## Error handling and edge cases

What happens when the happy path breaks? Be explicit about timeouts,
malformed data, and what the system does when it genuinely doesn't know
the answer (this is where the `UNCERTAIN` quality value earns its place).

## Testing strategy

Which REQ is proven how. Unit tests for logic that needs no hardware, bench
tests for anything the wire decides. Prefer recorded values over invented
ones.

| REQ | Test | Where |
|---|---|---|
| REQ-n | ... | ... |

## Open questions

Anything still unresolved that shouldn't block writing this doc, but
should block marking it "Accepted".
