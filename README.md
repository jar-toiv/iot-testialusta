***Suomeksi** · [English](README.en.md)*

# Iot Demo Testbed Teollisen IoT:n moniprotokollainen demoympäristö

Kentälle on asennettu Testbed keskus, jonka tarkoituksena on kerätä data kenttäväylistä.
Hyödynnän MQTT protokollaa tiedon keruussa ja typescriptiä niiden viennissä tietokantoihin

Keskuksella on tarkoitus myöhemmin saada simuloitua kentällä tapahtuvia vikoja.

## Miksi tämä on olemassa

Tarkoituksena on syventää tietoa teollisuuden tiedonsiirto protokollista sekä laitteista ja oppia tekemään koodi tasolla. Pyrin myös dokumentoimaan jokaisen harkinnan, päätöksen, vian ja teon.

Tausta: sähköalan tausta, IoT/pilvipuoli opeteltavana.

## Mitä tässä on erilaista

Useimmat harrasteprojektit demoavat toimivaa polkua. Tämä demoaa myös
**epäonnistuvaa** polkua tarkoituksella:

- Fyysinen vian tuottopaneeli (kytkinrima: A/B ristiin, päätevastus
  irti, yhteinen maa poikki...)
- Ohjelmallinen verkkovikojen simulointi (`tc netem`) ja ristiintestaus
  oikeaa mobiiliverkkoa vasten
- Jokainen mittaus kantaa OPC UA -tyylistä laatukenttää
  (`GOOD` / `UNCERTAIN` / `BAD` + substatus), ei vain arvoa
- Jokainen arkkitehtuuripäätös on kirjattu ADR:ksi hylättyine
  vaihtoehtoineen.

## Arkkitehtuuri

```
Kenttä                    Reuna                   Pilvi
──────                    ─────                   ─────
Modbus-mittari ──RS485──┐
Modbus-anturi ──────────┤
                        └─► Waveshare ──Eth──┐
                                             ├─► Pi 4B ──4G──► broker + kanta
ESP32 (CN105) ──┐                           │   Mosquitto
ESP32 (analogia)┴──WiFi (Pi:n oma AP)───────┘   InfluxDB, MongoDB
                                                 store-and-forward
```

Kerrokset: **ajuri → normalisointi → laatuportti → puskuri → julkaisu.**

## Katetut protokollat

| Protokolla | Rooli tässä projektissa | Tila |
|---|---|---|
| Modbus RTU | Energiamittari, RS-485-anturi | 🟡 |
| Modbus TCP | Waveshare-yhdyskäytävä | 🟡 |
| M-Bus | Erillinen mittari, oma parseri | ⚪ |
| wM-Bus | 868 MHz, vain omat mittarit | ⚪ |
| CN105 | Ilmalämpöpumpun tilan luku | ⚪ |
| 1-Wire | Lämpötilavahti | ⚪ |
| Analogia | Virtapihti | ⚪ |
| S0-pulssi | Varareitti | ⚪ |
| LoRa (P2P) | Radio-osoitus | ⚪ |
| MQTT | Koko sisäinen viestiväylä | ⚪ |

🟢 toteutettu putkessa · 🟡 todennettu penkillä, ei putkikoodia · ⚪ suunniteltu

Yhtään protokollaa ei ole vielä toteutettu putkessa: `src/` sisältää
toistaiseksi vain scaffoldin. Modbus RTU ja TCP on todennettu penkillä
(kaikki EM111:n rekisterit luettu Wavesharen kautta).

## Rakenne

```
docs/
  adr/                ← arkkitehtuuripäätökset, yksi tiedosto per päätös
  design/             ← feature-speksit (requirements, design, tasks)
  vikaluettelo.md     ← havaitut ja tuotetut viat, mittarit
src/                  ← ajurit, pipeline (TypeScript)
hardware/             ← kytkentäkaaviot, hankintalista
```

## Arkkitehtuuripäätökset

Jokainen merkittävä valinta ja hylätty vaihtoehto on kirjattu ADR:ksi:
konteksti, vaihtoehdot, päätös, seuraukset, todennus.

→ [`docs/adr/`](docs/adr/README.md): hakemisto ja kaikki päätökset

## Vikaluettelo

⚪

## Tila ja tiekartta

- [ ] Suunnittelu ja laitevalinnat, ADR-0001…0019
- [ ] Modbus-ketju pöydällä (mittari → Waveshare → kanta)
- [ ] Kotelointi ja vian tuottopaneeli
- [ ] CN105-luku ilmalämpöpumpusta (vain luku)
- [ ] Etäkohteen käyttöönotto
- [ ] Toistotila demoa varten


## Tekijä

Jarmo T Sähköasennustausta, opettelee IoT/pilvipuolta tämän
projektin kautta.

## Lisenssi

MIT [`LICENSE`](LICENSE)