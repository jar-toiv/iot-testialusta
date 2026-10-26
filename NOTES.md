# What I did diary

### 26-10-26 (docs, SDD tool)
- SDD tool is OpenSpec (ADR-0022, proposed). Spec-kit removed
- ADR facts link to the original source with its version
- Sources index trimmed. Rows pointing to files outside git removed

### 26-10-26 (docs, ADR rules)
- ADR template is now MADR 4.0.0 in Finnish
- `docs/adr/README.md` has a ready checklist. Only the user sets an ADR to Hyväksytty
- Every fact in an ADR needs a source or own observation. No parts lists or how-tos

### 25-10-26 (docs, ADR review)
- ADR-0002 reviewed again. (against the rules, but
its practising).
- ADR-0009 parts list moved to `wiring-enclosure.md`. ADR-0001 option B sourced from the Kunbus datasheet

### 19-10-26 (docs, Modbus driver error handling)
- Identification stops at the first failed request, and the next cycle starts it over.
- Cycle overrun: missed starts are skipped and the next cycle waits for its own time. Cycles never overlap on the bus
- A timeout does not stop the cycle. Every register is still read, because REQ-MTD-005 forbids marking unread registers BAD
- Overrun is reported as telemetry. Its message format waits for the meter status message (ADR-0004)

### 15-10-26 (docs, Modbus driver error handling, PR #55, #56)
- Failed identification read gives BAD for the whole meter (REQ-MTD-013). Victron and SunSpec also identify first
- Identification is per meter and retried each cycle. Closing the gateway connection would stop every meter behind it
- Connection life drawn as two small diagrams, gateway and meter
- ADR-0001 review: Pi stays for now, cloud gets its own ADR. Replacement trigger is now measurable (throttling, unexpected reboots)
- Substatus decided in ADR-0004: names the symptom (`NO_CONNECTION`, `EXCEPTION`, `MALFORMED`, `WRONG_DEVICE`, `NOT_IDENTIFIED`), OPC UA names only as a mapping
- ADR-0004 timestamps defined: `ts.source`, `ts.edge`, `ts.ingest`, after OPC UA
- Feature specs live only on the feature branch

### 14-10-26 (docs, Modbus driver requirements)
- Plan for `driver.ts`: requirements -> design -> tasks -> tests -> code, one step at a time
- Decisions now go in `docs/design/modbus-tcp-driver/decisions/`, one file each with a date
- D2: 500 ms timeout, no retry inside a cycle for now. The meter's manual and Home Assistant both retry, so that is the planned change
- D4: poll interval (1000 ms) and timeout live in the gateway file
- D5: one register per request for now, block reads later (max 20 words per request)
- D6: `type` alone gives the sign (`int32` / `uint32`), `signed` goes, `scale` stays a multiplier
- D7: on every new connection read the meter's ID code and firmware, wrong ID gives BAD for all registers
- `requirements.md` accepted, two new requirements REQ-MTD-011 and 012
- READMEs brought up to date: scaffold note, structure block, roadmap (enclosure done), analog ESP32 removed from the diagram
- `npm run driver:modbus` replaced by `npm start`, which runs `index.ts`. Drivers are chosen by config, not by separate scripts
- `design.md`: four components (`scheduler`, `connection`, `registerReader`, `decoder`), gateway and profile shapes, and the four outcomes of one register read
- Error handling: opening the connection uses the same `responseTimeoutMs`. `modbus-serial` has one socket timeout for both, set before `connectTCP`
- Connection lost mid-cycle: put off until a cycle makes more than one request. `readRegister` and `readBlock` both get written and tested, the cycle uses only `readRegister`

### 12-10-26 (docs, straight to main)
- Two cabinet photos in both READMEs, in `docs/images/`
- Checked the photos for GPS and camera data in the Exif block before adding them (none found). Phone photos carry it by default
- Side by side layout: an HTML table with fixed pixel widths. A percentage width worked in the editor preview but not on GitHub

### 9-10-26 (PR #46-#48)
- Reviewed `loadConfig.ts` with a code review checklist: design, functionality, complexity, tests, names
- Two more loader tests: config folder with no JSON files, and the first success case
- Schema mismatch now says `Config does not match schema: <path>`, so it reads differently from a JSON syntax error
- Kept the gateway and profile pipelines as two separate copies on purpose: they may grow apart when other meters come in
- Found but not fixed: a gateway's `profile` name is never checked against the loaded profiles
- Added a why-comment above the two pipelines
- `index.ts` calls the loader go get JSONs

### 8-10-26 IoT-cabinet worki
- Finished the cabinet and took pictures
- Took output voltages from DC powers Mornsun 25 VDC and Mean Well 5.7 VDC

### 7-10-26 (PR #43, #45)
- ESLint is stricter: `strictTypeChecked`, `stylisticTypeChecked` and a `naming-convention` rule
- Broken JSON in a config file now names the file: `Cannot parse JSON file: <path>`
- Two new tests for the loader: broken JSON and schema mismatch
- READMEs got "Running locally" and "Environment variables" sections
- New habits: only docs go straight to `main`, commit subjects use `fix:`, `feat:`, `docs:`
- Lint changes went to `main` by mistake with the wrong message, undone with `git revert` and redone through a branch

### 6-10-26 (PR #42)
- Config pipelines moved into one exported function `getValidatedConfigs(gatewayDir, profileDir)`, returns `{ gateways, profiles }`
- Loader is sync now (`readFileSync`, `readdirSync`): the program must not start without valid configs
- Missing config folder throws `Cannot read config directory: <dir>`
- `index.ts` is the entry point: reads `env`, builds the two paths, calls the loader
- First real tests in `tests/config/loadConfig.test.ts`, fixtures in `tests/fixtures/`, scaffold test removed

### 2-10-26 (PR #40)
- Load all gateway and profile configs from `CONFIG_DIR`, every JSON file validated with Zod
- Validation error names the failing file: `throw new Error(msg, { cause: err })`
- Generic `validateConfigPairs<T extends ZodObject>` returns `z.core.output<T>[]`, so callers get typed configs
- Added the required `type` field to the EM111 profile (b188199, on the feature branch, not merged yet)

### 29-9-26 (PR #39)
- Refactored gateway and profile schemas

### 27-9-26 (PR #35-#38)
- Zod validation pipeline for env and config files
- `.env` reduced to `CONFIG_DIR` and `ENV`, no device names
- `.env.example` updated and kept in git


### 26-9-26 (PR #33-#34)
- `.gitignore` update

### 26-5-26
- When building the software, the `PATHS` do not change. 
  Ex. import { gatewaySchema } from '../schemas/gatewaySchema.`js`'
  Have to be `.js` because the file is .js `after`build


### 25-9-26
- `REMEMBER TO FILL ADDED HARDWARE SPECIFICS - Teltonika TWS100`


## AWS IoT Core: cost estimate

Source: AWS IoT Core pricing page (https://aws.amazon.com/iot-core/pricing/),
US East (N. Virginia), read 2026-09-25 through a summarising fetch tool.
European region prices may differ.

## Prices

| Item | Price |
|---|---|
| Messaging (MQTT/HTTP) | $1.00 per 1,000,000 messages |
| Connectivity | $0.08 per 1,000,000 minutes |
| Keep-alive pings | free |
| Basic Ingest topic | no messaging charge |

## Calculations

Month = 30 days = 2,592,000 s.
Messages per month = 2,592,000 / publish interval (s).

| Publish interval | Messages/month | Cost after free tier |
|---|---|---|
| 1 s | 2,592,000 | $2.59 |
| 5 s | 518,400 | $0.52 |
| 10 s | 259,200 | $0.26 |
| 60 s | 43,200 | $0.04 |

Connectivity: one device, 43,200 min/month, about $0.003/month.

## Where charges start

Free tier for a new account, first 12 months:

| Limit | Free per month | Exceeded when |
|---|---|---|
| Messages | 500,000 | publish interval under 5.2 s |
| Rules triggered | 250,000 | publish interval under 10.4 s, if every message triggers a rule |
| Connection minutes | 2,250,000 | more than 52 devices |
| Message size | 5 KB | a message over 5 KB counts as two |
| Time | 12 months | after that every message and minute is billed from the first one |

Findings:

- A 5 s interval exceeds the message allowance by 18,400 messages (about
  $0.02). A 6 s interval (432,000 messages) stays within it.
- The rules allowance runs out before the message allowance. Basic Ingest
  removes the messaging charge, but the rule still triggers. Rules pricing
  was not checked.
- Batching moves every limit: 5 s readings published once a minute give
  43,200 messages/month. The cost is one minute of latency in the cloud.

## Open

- Monthly data volume over 4G, to be measured once the SIM is in use.
- Data cap of the subscription.
- Rules engine pricing.

---

## 19-9-26
- Created first part of pseudo and first code for the driver `modbus-tcp.ts`.
- found out about TLA, top level await that can be used to read env's before process
- `Zod` can be used with JSON to validate int16/int32

## 18-9-26
- POC for the `modbus-serial`. Successful register reading

## 11-9-26 feat modbus-tcp-driver
initialized SSD design with EARS notation. Starting to practice it.

