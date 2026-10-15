# ADR-0001: Reunalaitteeksi Raspberry Pi 4B, ei teollista ohjainta

- **Tila:** Hyväksytty
- **Päivämäärä:** 2026-08-28
- **Liittyy:** ADR-0004 (Ehdotettu)

## Konteksti

Reunasolmun on ajettava Docker Composella Mosquitto, InfluxDB, MongoDB ja
dashboard, sekä toimittava kaikkien kenttäväylien masterina. Käytettävissä on
Raspberry Pi 4B (jo omistuksessa, 0 €).

Vastaväite on aiheellinen ja se esitettiin projektin aikana suoraan:
Raspberry Pi -korttia ei käytetä tehtaissa.

## Vaihtoehdot

### A: Raspberry Pi 4B sellaisenaan
Ilmainen, riittävä teho, tuttu ympäristö. Ei teollisia sertifiointeja. Ostettu lisäksi paristovarmennus RTC DS3231.

### B: Kunbus Revolution Pi
Sama Raspberry Pi -piiri, mutta EN 61131-2 -yhteensopiva DIN-kiskokotelo,
CE- ja UL-sertifioitu, IEC 61000-6-2 EMC-häiriönsieto, -25...+60 °C, TPM 2.0,
paristovarmennettu RTC, laitteistovahtikoira. Käytössä oikeasti valmistavassa
teollisuudessa ja rakennusautomaatiossa. Hinta satoja euroja.

### C: Teollinen PLC + erillinen edge-PC
Oikeaoppisin, kallein, eniten työtä. Ei mahdu budjettiin.

## Päätös

Valittiin **A**, mutta puute kirjataan auki eikä peitetä.

Ero teollisen ja tavallisen Pi:n välillä on täsmälleen lueteltavissa:
eMMC vs. SD-kortti / SSD, 24 V vs. USB-C, laitteistovahtikoira, RTC, EMC-sertifiointi,
lämpötila-alue, saatavuustakuu. Ratkaisevaa ei ole rauta vaan **rooli**:
reunasolmu ei ohjaa mitään, se kerää ja puskuroi, ja sen menettäminen ei
pysäytä prosessia. Kriittinen ohjaus kuuluu PLC:lle, datankeruu edge-laitteelle.

## Seuraukset

**Hyvät**
- 0 € laitekustannus, koko budjetti mittalaitteisiin
- Täysi Linux-ympäristö, Docker.
- Osoittaa että raja teollisen ja ei-teollisen välillä ymmärretään

**Huonot / hinta**
- Ei tietoturva- eikä saatavuustakuuta pitkällä aikavälillä
- 0...50 °C kaupallinen lämpötila-alue
- Ei EMC-häiriönsiedon sertifiointia, sähkökaapin lähellä riski
- Kuluttajaliittimet, ei ruuvikiinnitystä

**Pakolliset lievennykset**
- DS3231-RTC: Pi:llä ei ole paristokelloa. Sähkökatkon jälkeen ilman
  verkkoa se ei tiedä aikaa, ja jokainen puskuroitu lukema saisi väärän
  `ts.edge`-ajan (ADR-0004)
- SSD USB 3.0:sta, ei microSD: aikasarjakannan kirjoituskuorma tappaa kortin
- `bcm2835_wdt` ja systemd-vahtikoira käyttöön (0 €, yksi rivi)
- Passiivinen jäähdytys, koska suljettu kotelo throttlaa

**Mitä tämä sulkee pois**
- Reaaliaikaista ohjausta ei voi luvata
- Laitetta ei voi esittää tuotantokelpoisena ilman koteloa ja sertifiointia

## Todennus

Päätös kumotaan, jos jompikumpi ylittyy kentällä kuukauden aikana:

- Kuristus tai lämpörajoitus on tapahtunut (`vcgencmd get_throttled`,
  bitit 18 ja 19, [Raspberry Pi OS -dokumentaatio](https://www.raspberrypi.com/documentation/computers/os.html),
  kohta `get_throttled`) yli `TBD` kertaa.
- Odottamattomia uudelleenkäynnistyksiä on yli `TBD` (`journalctl --list-boots`).

Korvaaja on passiivijäähdytteinen teollinen mini-PC.