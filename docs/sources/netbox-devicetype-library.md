# NetBox devicetype-library validation

- **Kind:** Primary
- **URL:** https://github.com/netbox-community/devicetype-library, commit
  `6a2703f7303e6f770bcfed16140ca2bc688a037a` (2026-10-26)
- **Read:** 2026-10-27, *by eye* (raw files)
- **Used by:** hardware record structure (what a record check covers)

## What the tests check

`tests/definitions_test.py`, `test_definitions()`, in order:

- line 207: "Check file extension. Only .yml or .yaml files are supported."
- line 214: "Check for trailing newline."
- "Check for non-ASCII characters"
- "Validate YAML definition against the supplied schema"
- slug against known slugs (line 372), filename (375), components (378)
- cross-references inside one file, e.g. a front-port "references
  rear_port '...', but no such rear-port exists"
- empty quotes (line 389), power, child height (400-402)
- images: "has Front or Rear Image set to True but no images found"

`schema/devicetype.json` line 149:
`"required": ["manufacturer", "model", "slug", "u_height","is_full_depth"]`

## Contribution rules

`CONTRIBUTING.md`:

- line 3: "the regular contribution of accurate and complete device type
  definitions is crucial to its success."
- line 47: "Verify that the proposed definition does not duplicate or
  conflict with an existing definition."

## Not found

No test or contribution rule asks where a value came from (datasheet, page,
URL). A search of `CONTRIBUTING.md` for datasheet, source, verify, official
found only the two lines above.
