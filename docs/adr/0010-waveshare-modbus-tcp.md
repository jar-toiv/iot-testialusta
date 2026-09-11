# ADR-0010: Waveshare-sarjapalvelin Modbus TCP -tasoksi

- **Tila:** Korvattu
- **Päivämäärä:** 2026-08-30
- **Liittyy:** ADR-0004

## Konteksti

Käytettävissä on Waveshare RS232/485/422 TO POE ETH (B). Pääominaisuus on
Modbus RTU - Modbus TCP -yhdyskäytävä. Laitteen firmwaresta löytyy viisi
gateway-tyyppiä, joista kaksi (tallentava ja ei-tallentava) ovat tämän
ADR:n kannalta olennaiset. Lisäksi MQTT-yhdyskäytävä ja Modbus RTU - JSON
-muunnos. Termit, tehdasoletus ja lähteet: `hardware/waveshare-23626/`.

## Vaihtoehdot

### A: Ei käytetä Modbus RTU suoraan USB-RS485:llä Pi:hin

Yksinkertaisin. Yksi protokollataso vähemmän.

### B: Ei-tallentava Modbus-yhdyskäytävä ("non-storing")

Waveshare välittää jokaisen kyselyn sellaisenaan RS-485-väylälle eikä pidä
omaa kopiota rekisteriarvoista.

**Hyöty:** vika näkyy heti. **Hinta:** ei demota `STALE`-tilaa.

### C: Käytetään sekä tallentavaa että ei-tallentavaa tilaa

Sama laite molemmissa tiloissaan, verrataan tarkoituksella.
Voidaan testata tiloja asetuksia vaihtamalla `VirCom:n` ohjelman avulla.

**Hyöty:** kahden tilan eri käytös väylän katketessa on ADR-0004:n
`STALE`/`TIMEOUT`-erottelun konkreettinen live demo. **Hinta:** kaksinkertainen
konfigurointi- ja testaustyö B:hen verrattuna.

## Päätös

Valittiin **C**.

RTU ja TCP eivät ole sama protokolla eri johtimella. Kehys ja vikaprofiilit
eroavat, joten A hukkaisi sen eron. Tallentava vs. ei-tallentava live demotaan
peräkkäin, koska se on suoraan ADR-0004:n `STALE`-substatus: tallentava
vastaa välimuistista vaikka väylä on poikki, ei-tallentava paljastaa
katkoksen heti. Se on hiljainen vika, jonka takia laatukenttä alun perin
suunniteltiin.

## Seuraukset

**Hyvät**
- Kolmas protokollataso ilman uutta hankintaa
- Konkreettinen, demottava esimerkki `STALE`-tilasta

**Huonot / hinta**
- Yksi ylimääräinen komponentti epäonnistumisketjussa
- PoE ei käytössä vaikka laite tukee sitä — molemmat kaapelit on jo
  varattu: Eth Pi:lle, RS-485 ADR-0005:n vian tuottopaneeliin. Virta
  tulee erikseen 24 V muuntajalta (ADR-0009).
- Vaatii Modbus RTU -orjan väylälle. Ratkaistu: hankittu EM111 on
  `EM111-DIN.AV8.1.X.S1.X`.

**Wavesharen suora MQTT-julkaisu ei syötä kantaa.** Ominaisuus jää
kertaluontoiseksi vertailutyökaluksi: flagin takana myöhemmin rakennettava
diagnostiikka, joka vertaa Wavesharen ja oman ajurin lukemaa eikä kirjoita
kantaan. Matala prioriteetti.

## Todennus

Molemmat tilat ajettava läpi katkaisemalla RS-485-väylä kesken pollauksen.
Tallentavan tilan on tuotettava `STALE`, ei-tallentavan tilan `TIMEOUT`.
Jos molemmat tuottavat saman, laatuportti on väärin toteutettu.
