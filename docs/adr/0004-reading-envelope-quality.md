# ADR-0004: Yksi mittausenvelooppi kaikille ajureille, substatus vain todennetuista vioista

- **Tila:** Ehdotettu
- **Päivämäärä:** 2026-09-10
- **Liittyy:** ADR-0010 (Korvattu), ADR-0014 (Ehdotettu), ADR-0020

## Konteksti

Penkillä on todennettu yksi protokollapolku, EM111 Modbus TCP:llä
Waveshare-yhdyskäytävän kautta (ADR-0020). Muilla suunnitelluilla protokollilla ei ole
ajuria eikä osalla laitettakaan. Tavallinen ratkaisu, protokollakohtainen
try/catch, hukkaa virheet poikkeuksina, jolloin hiljainen vika ei näy
kannassa lainkaan.

## Vaihtoehdot

### A: Poikkeukset ja lokitus
Hiljainen vika jää lokiin jota kukaan ei lue.

### B: Yksi envelooppi, vikasanasto kaikille suunnitelluille protokollille
Useimmat substatus-arvot kuvaisivat polkuja joita ei ole rakennettu.

### C: Yksi envelooppi, vikasanasto vain todennetuista vioista
Uusi arvo tulee sen protokollan ADR:n mukana joka sen tuottaa.

## Päätös

Valittiin **C**.

```ts
type Reading = {
  source:     { site: string; device: string; point: string };
  value:      number | null;
  unit:       string;
  quality:    'GOOD' | 'UNCERTAIN' | 'BAD';
  substatus?: 'TIMEOUT' | 'STALE' | 'NO_CONNECTION' | 'EXCEPTION'
            | 'MALFORMED' | 'WRONG_DEVICE' | 'NOT_IDENTIFIED';
  ts:         { source?: string; edge: string; ingest?: string };
};
```

Aikaleimat (`ts`), mallina OPC 10000-4 §7.11:

- `ts.source`: laitteen oma mittausaika. Puuttuu, kun protokolla ei kanna
  aikaa (Modbus, EM111). Vastaa OPC UA:n `sourceTimestamp`ia.
- `ts.edge`: ajurin aika, kun vastaus saatiin tai aikakatkaisu laukesi.
  Asetetaan aina, Pi:n kellosta. Lukeman ensisijainen aika.
- `ts.ingest`: aika, jolloin vastaanottava palvelu tallensi lukeman. Vastaa
  OPC UA:n `serverTimestamp`ia. `ingest - edge` näyttää puskurissa olon ajan.

`TIMEOUT`: ei vastausta saatu, `value` on `null`, `quality` on `BAD`.
`STALE`: vastaus saatiin, arvo raportoidaan,
`quality` on `UNCERTAIN`, ks. seuraava osio.

Modbus TCP:n oireet (2026-10-15). Substatus nimeää sen, minkä ajuri näki,
ei arvausta syystä: sama oire voi johtua useasta viasta, ja syyn päättely
kuuluu kerrokselle joka näkee monta lukemaa. Kaikissa `value` on `null` ja
`quality` on `BAD`. Vaatimukset: `docs/design/modbus-tcp-driver/requirements.md`.

| Substatus | Milloin | REQ-MTD | OPC UA -vastine |
|---|---|---|---|
| `NO_CONNECTION` | Gatewayn TCP-yhteys ei aukea tai katkeaa | 008 | `Bad_NotConnected` |
| `TIMEOUT` | Rekisteri ei vastaa ajoissa | 003 | `Bad_NoCommunication` |
| `EXCEPTION` | Modbus-poikkeusvastaus | 006 | `Bad_ConfigurationError` (01h-03h), `Bad_DeviceFailure` (04h) |
| `MALFORMED` | Vastaus rikki tai väärän pituinen | 007 | `Bad_NoCommunication` |
| `WRONG_DEVICE` | Tunnistuskoodi luettiin, mutta se on väärä | 012 | `Bad_ConfigurationError` |
| `NOT_IDENTIFIED` | Tunnistusluku ei saanut vastausta | 013 | `Bad_NoCommunication` |

OPC-sarake on vain vastaavuus, dataan menee vasemman sarakkeen nimi. Nimet
OPC 10000-8 Table A.7:stä. `MALFORMED`in ja `NOT_IDENTIFIED`in vastine on
oma sovitus. `WRONG_DEVICE` ja `NOT_IDENTIFIED` pidetään erillään, koska
ensimmäinen korjataan profiilista tai osoitteesta, jälkimmäinen kaapelista
tai laitteesta.

Avoin: mittarin tila (tunnistettu, väärä, ei tunnistettu) omana viestinään,
jotta frontti voi laskea tunnistetut mittarit. Kuuluu MQTT-nimiavaruuteen
(ADR-0014), ei lukemaan.

Envelooppi on yhteinen, koska vain ajurikerros saa tietää protokollan. Jos
tyyppi pilkottaisiin protokollittain, normalisointi, laatuportti, puskuri ja
julkaisu haarautuisivat lukeman alkuperän mukaan. Substatus taas on
protokollakohtaista sanastoa, ja se kavennetaan:

| Poistettu | Syy |
|---|---|
| `CRC` | Modbus TCP:ssä ei ole CRC:tä, se jää yhdyskäytävän RTU-puolelle |
| `NO_KEY`, `COUNTER_RESET`, `SESSION_LOST` | Tuottavaa polkua ei ole rakennettu |
| `OUT_OF_RANGE` | Ei rajoja kirjattuna eikä todennettua tapausta |
| `FROZEN` | Todiste on sama kuin `STALE`:n, mikään tällä polulla ei erota niitä |

Substatus on valinnainen unioni, joten uuden arvon lisääminen myöhemmin ei
koske putkea.

## STALE:n tunnistus

Modbus ei kanna aikaleimaa, joten yhdestä vastauksesta ei näe onko arvo
tuore. Hylätyt keinot:

| Keino | Miksi ei riitä |
|---|---|
| Vasteajan mittaus | Välimuisti vastaa noin 40 ms nopeammin (ADR-0020), mutta ero näkyy vain tilojen välillä, eikä gatewayn tila näy Modbusin yli |
| V, A ja W ristiin | Todistaa fysikaalisen järkevyyden, ei tuoreutta |
| Kasvava laskurirekisteri | EM111:llä ei ole, tuntilaskuri `002Ch` palauttaa nollaa |

Jää siis sama raakalukema toistuvana. Toisto kertoo jotain vain, kun
vertailtavien lukemien väli on pidempi kuin mittarin oma päivitysväli
(`EM111_DS_ENG.pdf` s. 4: "Data refresh time 1 s"), koska Simple-tilassa
tiheämmin kysyttäessä sama arvo toistuu normaalisti (ADR-0020). Alkuarvot
ovat kolme lukemaa viiden sekunnin välein. Tulos on `UNCERTAIN` eikä koskaan `BAD`, koska aidosti tasainen
kuorma tuottaa saman havainnon eikä eroa voi todistaa ilman fyysistä
tarkistusta. OPC UA:ssa sama luokka on `Uncertain_LastUsableValue`. Muisti
edellisistä lukemista kuuluu laatuportille, ajuri pysyy tilattomana.

## Seuraukset

**Hyvät**
- Uusi protokolla on uusi ajuripaketti, putkeen ei kosketa
- Virhetelemetria on kyselyttävissä samoilla työkaluilla kuin mittausdata
- `STALE` kattaa Wavesharen tallentavan tilan ehjällä väylällä (ADR-0020)
- Lista on lyhyt ja suljettu, joten jokainen arvo on katettavissa yhdellä
  testillä. Ei vielä tehty: `tests/`:ssä ei ole testiä TIMEOUT:lle eikä
  STALE:lle

**Huonot / hinta**
- Enemmän dataa kantaan, ja jokainen ajuri kirjoitetaan tähän muotoon
- Dashboardin on osattava esittää kolme laatutasoa
- Uusi protokolla vaatii oman ADR:n ennen kuin sen substatus on olemassa

**Mitä tämä sulkee pois**
- Telegrafin Modbus-pluginilla ei ole kiinteää kenttäformaattia, kentät
  ovat käyttäjän itse nimeämiä konfiguraatiosta, eikä dokumentaatio kerro
  edes sitä mitä yksittäisen rekisterin epäonnistuneelle luvulle tapahtuu.
  Laatu- tai virhekenttää ei siis ole mistä ottaa, joten se ei tuota tämän
  päätöksen vaatimaa laatuleimattua lukemaa. Oma bridge on pakollinen.
  Saman työkalun OPC UA -plugin välittää protokollan `StatusCode`n
  `Quality`-kenttään (`input_client.go`). Modbus ei kanna arvokohtaista
  tilaa (Application Protocol V1.1b §6.3), joten laatu pitää johtaa
  epäonnistuneesta kyselystä, eikä Telegrafin Modbus-plugin tee sitä.
  Lähteet: Telegraf Modbus Input Plugin README ja
  `plugins/common/opcua/input/input_client.go` (influxdata/telegraf,
  master-haara), tarkistettu 2026-10-15

## Todennus

Penkkiajon vaihe 5 kumosi ADR-0010:n oletuksen: katkos tuottaa `TIMEOUT`:n
kummassakin tilassa, ja tallentava tila tuottaa `STALE`:n vain ehjällä
väylällä. Mittarina on ADR-0020:n Todennus. Skriptiajot 2026-09-11
(ADR-0020: tulokset Kontekstissa, skripti Todennuksessa) tukevat kolmen
lukeman ja viiden sekunnin rajaa: AQST toistaa arvoa 10-11 lukua, Simplessä
jännite vaihtuu 1-2 s välein. Toteutus todennetaan, kun laatuportti on olemassa.
Vika joka näkyy vain lokissa eikä kannassa on tämän päätöksen
epäonnistuminen ja kirjataan vikaluetteloon.
