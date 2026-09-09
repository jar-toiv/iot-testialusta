# ADR-0005: Fyysinen vian tuottopaneeli

- **Tila:** Ehdotettu
- **Päivämäärä:** 2026-08-24
- **Liittyy:** ADR-0004, ADR-0006

## Konteksti

Teollisuuslaitteet ovat luotu kestämään, siten vikojen testaus on usein jätetty tekemättä ja jopa mahdotonta tehdä.
Itse tuotetut viat voisivat auttaa vikojen paikannuksessa tehokkaammin.
Jos vian pystyy sitomaan johonkin tiettyyn oireeseen sen voi ennakoida, dokumentoida ja tunnistaa nopeammin kun se ilmenee
oikeasti.
Pidän ajatusta auki siitä, että tekisin fyysisen ja ohjelmallisen vikoja tuottavan paneelin projektiini.
Vikoja voi simuloida monenlaisia, niistä joitain on listattu alla.

## Vaihtoehdot

### A: Ei vian tuottoa, odotetaan luonnollisia vikoja
Realistisin, mutta ei välttämättä toistettava eikä esitettävä.

### B: Ohjelmallinen vian tuotto (mockatut virheet ajurikerroksessa)
Halpa, toistettava, mutta ei todista fyysisestä kerroksesta mitään.

### C: Fyysinen kytkinrima esim. keskuksessa.
Johtojen väärin kytkennät, puuttuvat vastukset, rikkinäiset komponentit.

## Päätös

Valittiin **C**, ja **B** täydentävänä (ks. ADR-0006).
Fyysistä testausrimaa ei ole vielä suunniteltu.

 Tuotettavat viat:

| Tunnus | Vika | Odotettu telemetria |
|---|---|---|
| S1 | A/B ristiin RS-485:llä | Ei vastausta → `TIMEOUT` |
| S2 | Päätevastus irti | Satunnaisia `CRC`-virheitä, kasvaa etäisyyden myötä |
| S3 | GND (signaalimaa) poikki | Ajoittainen, lämpötilariippuvainen `CRC` |
| S4 | Sarjavastus linjaan | Heikkenevä signaali, virheiden asteittainen kasvu |
| S5 | Orjan syöttö poikki | Yksi laite `BAD`, muut `GOOD` |
| S6 | Pulssilinja irti | Laskuri jäätyy → `FROZEN` |
| S7 | DC-powerin jännite seilaa tai putoo | Ei tiedossa, mitattava: riippuu koskeeko Wavesharea vai Pi:tä ja miten laite reagoi alijännitteeseen |
| S8 | Modeemi/mokkula irrotetaan fyysisesti Pi:stä | `SESSION_LOST`, ADR-0017:n elpymisportaikko taso 4, tavoite < 30 s (vrt. vikaluettelo.md S-012, joka tekee saman ohjelmallisesti unbind/bind:llä) |

Puuttuva GND (S3) on tarkoituksella mukana: se on se johdin, jonka kaikki
unohtavat, ja jonka vika toimii pöydällä mutta kaatuu kentällä. Tämä on
RS-485:n signaalimaa, ei PE-suojamaa, eri johdin. Ilmiö on tunnettu ja
dokumentoitu (puuttuva referenssimaa saa transceiverien common-mode-
jännitteen karkaamaan yli sallitun rajan pitkillä kaapeleilla tai eri
virtapiireissä), mutta ei liioiteltu periaatteessa.

## Seuraukset

**Hyvät**
- Toistettava, esitettävä, ja aidosti fyysinen
- Tekee ADR-0004:n laatukentästä näkyvän kolmessa sekunnissa
- Sama rima toimii regressiotestinä ajurimuutosten jälkeen

**Huonot / hinta**
- ~15 € kytkimiä ja vastuksia, uusi kotelo
- Lisää johdotusta ja mahdollisia omia vikoja

## Auki

- Käyttäytyykö sama laite eri valmistajalta samoin saman vian alla?
  Tuloksia ei voi tässä vaiheessa yleistää muihin laitteisiin.

## Todennus

Jokainen kytkentä tai muutos on ajettava läpi ja tulos kirjattava
[`../vikaluettelo.md`](../vikaluettelo.md) -tiedostoon. Kohta, joka ei
tuota odotettua substatusta, on löytö eikä epäonnistuminen, se kirjataan.
