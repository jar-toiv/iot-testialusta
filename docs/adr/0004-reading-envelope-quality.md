# ADR-0004: Yksi mittausenvelooppi kaikille ajureille, substatus vain todennetuista vioista

- **Tila:** Ehdotettu
- **Päivämäärä:** 2026-09-10
- **Liittyy:** ADR-0002, ADR-0005, ADR-0016, ADR-0020

## Konteksti

Toteutettuja protokollapolkuja on yksi: EM111 Modbus TCP:llä
Waveshare-yhdyskäytävän kautta (ADR-0020), penkkiajon vaiheet 1-5 ajettu ja
29 rekisteriä ristiintarkistettu. Muilla suunnitelluilla protokollilla ei ole
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
  substatus?: 'TIMEOUT' | 'STALE';
  ts:         { source?: string; edge: string; ingest?: string };
};
```

`TIMEOUT`: ei vastausta saatu, `value` on `null`, `quality` on `BAD`.
`STALE`: vastaus saatiin, arvo raportoidaan,
`quality` on `UNCERTAIN`, ks. seuraava osio.

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

Jää siis sama raakalukema toistuvana, kun kyselyväli ylittää mittarin oman
päivitysvälin (datalehti: 1 s). Alkuarvot ovat kolme lukemaa viiden sekunnin
välein. Tulos on `UNCERTAIN` eikä koskaan `BAD`, koska aidosti tasainen
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
  Saman työkalun OPC UA -plugin sen sijaan kantaa `Quality`-kentän, eli
  puute ei ole Telegrafissa vaan Modbusissa. Lähteet: Telegraf Modbus
  Input Plugin README (influxdata/telegraf, master-haara) ja OPC UA
  Input Plugin -dokumentaatio, tarkistettu 2026-09-10

## Todennus

Penkkiajon vaihe 5 kumosi ADR-0010:n oletuksen: katkos tuottaa `TIMEOUT`:n
kummassakin tilassa, ja tallentava tila tuottaa `STALE`:n vain ehjällä
väylällä. Mittarina on ADR-0020:n Todennus. Skriptiajot 2026-09-11
(ADR-0020: tulokset Kontekstissa, skripti Todennuksessa) tukevat kolmen
lukeman ja viiden sekunnin rajaa: AQST toistaa arvoa 10-11 lukua, Simplessä
jännite vaihtuu 1-2 s välein. Toteutus todennetaan, kun laatuportti on olemassa.
Vika joka näkyy vain lokissa eikä kannassa on tämän päätöksen
epäonnistuminen ja kirjataan vikaluetteloon.
