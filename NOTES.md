# What I did diary

- This document should be updated after each PR


### 6-10-26 (branch `feature/modbus-tcp-driver`)
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

- readFile for field files, not import
- JSON import needs with `{ type: 'json' }`
- `--env-file` loads .env into process.env
- `Relative paths` resolve from cwd
- `path.resolve` shows the real path
- !value catches `undefined` and `empty`
- Pi config belongs in /etc
- One `industry` method is to load up registers during system buildup
- Linux `systemd`-service will handle `Restart=always` if it crashes etc.
- The Modbus driver is a device independent. Each devices's register map is a JSON file placed on the PI,
    loaded at startup and validated with Zod, so a new device needs no code change or rebuild
- `export type Gateway = z.infer<typeof gatewaySchema>`: one source for both validation and type
- Test file `<unit>.test.ts`, `describe` names the function, each `it` is one situation
- `expect(() => fn()).toThrow(text)`: the arrow lets `expect` run the call and catch the throw
- A test can pass for the wrong reason: check the error message, not just that something threw
- A function can be tested only on what it receives: the config root is visible only in `index.ts`
- Import paths start from the file, folder paths in code start from cwd

## 19-9-26
- Created first part of pseudo and first code for the driver `modbus-tcp.ts`.
- found out about TLA, top level await that can be used to read env's before process
- `Zod` can be used with JSON to validate int16/int32

## 18-9-26
- POC for the `modbus-serial`. Successful register reading

## 11-9-26 feat modbus-tcp-driver
initialized SSD design with EARS notation. Starting to practice it.

