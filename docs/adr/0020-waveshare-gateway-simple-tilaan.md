# ADR-0020: Waveshare Simple-tilaan oletuksena, tallentava tila vain STALE-demoon

- **Tila:** Hyväksytty
- **Päivämäärä:** 2026-09-11
- **Liittyy:** ADR-0010 (korvaa), ADR-0004

## Konteksti

ADR-0010 valitsi Wavesharen molemmat tilat, tallentavan (Auto query
storage type, AQST) ja ei-tallentavan (Simple modbus tcp to rtu).
Perusteena oli oletus, että tallentava vastaa välimuistista vaikka RS-485-väylä
on poikki. Oletus ei tullut valmistajalta: Spotpear-ohje sanoo vain
"automatically train the query commands" eikä kerro päivitysväliä.

Penkkiajon vaihe 5 (2026-09-11) mittasi toisin:

| Tila | Ehjä väylä | Väylä poikki (`TB` irti) |
|---|---|---|
| Simple | Arvo seuraa mittarin päivitystä, ei timeouteja | Timeout heti |
| AQST | Sama arvo 10-11 lukua, timeout, uusi arvo | Timeout heti |

AQST:n jakso riippuu kyselyjen määrästä, ei ajasta: 0,09 s välein 2,0 s,
0,54 s välein 6,9 s, 2 s välein noin 19 s. Arvon ikä on noin 11 ×
pollausväli. Mittari päivittää rekisterinsä 1 s välein (`EM111_DS_ENG.pdf`
s. 4), ja Simple-tilan 50 ms ajossa arvo vaihtui juuri 1-2 s välein.

ZLAN, jonka firmwareen laite perustuu (MQTT/JSON-käsikirja s. 29),
dokumentoi tallentavan gatewayn, joka oppii kyselyt, päivittää välimuistia
jatkuvasti taustalla ja vastaa 30-50 ms nopeammin kuin tavallinen muunnos. 
Nopeusetu täsmää: 50 ms ajossa kierros oli AQST:llä 0,087 s ja
Simplellä 0,130 s. Taustapäivitys ei täsmää, koska tämä yksilö päivittää kyselyjen määrän mukaan.

Rajoitteet:

- Master on yksi, Pi.
- Putken pollausväli on 5 s (ADR-0004:n alkuarvo). AQST antaisi silloin
  lähes minuutin vanhaa dataa ja ehjällä väylällä timeoutin noin minuutin
  välein.
- Mittaukset tehtiin aluksi käsin epätasaisella tahdilla. Skriptattu on vain
  AQST 500 ms ja 50 ms sekä Simple 50 ms. Skriptiajoissa ensimmäinen jakso
  on 11 lukua ja seuraavat 10, käsin kaikki 11. Ero on selittämättä.

## Vaihtoehdot

### A: Simple Modbus TCP to RTU

Jokainen kysely menee mittarille asti. Pollausväli ajastetaan omassa
koodissa, ja data on aina tuoretta.

**Puolesta:** ehjällä väylällä ei vanhaa dataa eikä vääriä timeouteja,
katkos näkyy heti `TIMEOUT`:na. 

**Vastaan:** ei jonotusta, joten toinen master samalla gatewaylla törmää väylällä.
Tässä projektissa se olisi käsin ajettu `mbpoll` putken rinnalla, teollisuudessa esimerkiksi SCADA ja
paikallinen HMI.

### B: Auto Query Storage Type

Gateway vastaa välimuistista ja hakee uuden arvon noin joka 11. kyselyllä.

**Puolesta:** säästää hidasta RS-485-väylää, kun useampi master kysyy samaa
dataa (ZLAN:n dokumentaatio, Waveshare ei kerro tarkoitusta). Vastaa noin
40 ms nopeammin (mitattu). Tuottaa `STALE`-tilan ehjällä väylällä.
**Vastaan:** pollata on silti pakko, koska Modbus-palvelin ei lähetä dataa
oma-aloitteisesti. Arvon ikä kasvaa pollausvälin mukana, ja joka 11. kysely
on timeout ilman vikaa. Putki kirjaisi väärän `BAD`-lukeman
noin minuutin välein. Gatewayn oma työ kasvaa.

### C: Multi host non storage type

Kuten A, mutta jonottaa useamman masterin kyselyt.

**Puolesta:** sallii toisen masterin. **Vastaan:** masteria on yksi, eikä
tilaa ole testattu.

### D: Pre configurable modbus GW (ZLMB)

Rekisterilista konffataan Vircomissa, ja gateway pollaa sen itse
käynnistyksestä asti (ZLAN:n ZLMB-dokumentti). Testattu 2026-09-11.

**Puolesta:** data tuoretta, vastaus välimuistista, ei vääriä timeouteja,
sallii useamman masterin. **Vastaan:** katkos näkyy arvona `0` eikä
timeoutina. Offline-erikoisarvoa ja online-lippua ei voinut asettaa
(firmware V1.452). Vakiorekisteri `000Bh` (`103`) vahtina tunnistaa täyden
katkoksen, mutta pätkivässä kontaktissa yksittäinen `0` menee läpi, koska
rivit pollataan erikseen. Rekisterikartta on kahdessa paikassa.

## Päätös

Valittiin **A** oletukseksi. B kytketään päälle vain tarkoituksella
`STALE`-demoa varten (vikaluettelo S-007).

B:n väyläsäästö hyödyttää vain useaa masteria. Yhdellä masterilla jäävät
vain haitat: vanha data ja väärät viat. C ratkaisee ongelman, jota ei ole.
D antaa tuoreen datan, mutta muuttaa vian nollaksi, kun A antaa sen
virheenä juuri epäonnistuneeseen lukuun.

## Seuraukset

**Hyvät**
- Ehjällä väylällä `STALE` tai `TIMEOUT` tarkoittaa oikeaa vikaa
- ADR-0010:n STALE-demo säilyy, mutta nyt mitatulla perusteella

**Huonot / hinta**
- Gatewayn tila ei näy Modbusin yli. Väärä tila havaitaan vain
  laatuportin `STALE`-tunnistuksella tai vilkaisemalla Vircomia
- Demossa tila vaihdetaan käsin Vircomilla ja gateway käynnistetään uudelleen

**Mitä tämä sulkee pois myöhemmin**
- Toisen masterin samalle gatewaylle ilman tilan vaihtoa C:hen. Myös
  gatewayn oma MQTT/JSON-keruu pollaa väylää itse (MQTT/JSON-käsikirja), eli
  ADR-0010:n vertailutyökalu olisi tällainen toinen master

## Todennus

A:n käytös mitattu penkkiajon vaiheessa 5: ehjällä väylällä arvo seuraa
mittarin päivitystä, katkoksessa timeout heti. Kun putki on olemassa,
jännitteellä (`0000h`), koska se vaihtelee aina toisin kuin kuormaton teho:

- A-tilassa ehjällä väylällä ei synny `STALE`:a eikä `TIMEOUT`:ia
- B-tilassa `STALE` syntyy ADR-0004:n rajalla (3 samaa lukemaa), ja joka 11.
  luku on `TIMEOUT`
- Katkos tuottaa `TIMEOUT`:n kummassakin tilassa

Jos A-tilassa syntyy `STALE`, gateway on palautunut B:hen tai tunnistus on
väärin. Arvioidaan uudelleen, jos gatewaylle tulee toinen master.

Mittausmenetelmä (Pi, gatewayn osoite paikalle `<gateway>`, Ctrl+C lopettaa):

```bash
while true; do
  printf '%s ' "$(date +%T.%3N)"
  mbpoll <gateway> -a 1 -r 1 -c 2 -p 502 -t 4 -1 2>&1 | grep -E '^\[1\]|failed'
  sleep 0.5
done | tee aqst-500ms.txt
```
