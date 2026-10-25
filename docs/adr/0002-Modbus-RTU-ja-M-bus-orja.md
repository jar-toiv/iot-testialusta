# ADR-0002: Modbus- ja M-Bus-mittarit kahdelta eri valmistajalta

- **Tila:** Hyväksytty
- **Päivämäärä:** 2026-08-30
- **Liittyy:** —

## Konteksti

Tarvitaan Modbus RTU -orja ja M-Bus-orja (myöhemmin).

Mahdollisuudet olivat Modbus RTU: `Carlo Gavazzi EM111-DIN.AV8.1.X.S1.X` tai `(Eastron SDM120-Modbus)`.
Carlo Gavazzin kaikki mallit olivat saatavilla seuraavana päivänä tilattaessa.

Mahdollisuudet M-Bus: Tätä ei vielä hankita. `Eastron SDM120-MBus` tai Gavazzin M-Bus-malli (tuotekoodin `M1`-osa).

## Vaihtoehdot

### A: Kaksi Eastronia (SDM120-Modbus + SDM120-MBus)
Yksi rekisterikartta, yksi datalehti, yksi konfigurointityökalu.
Halvin ja nopein.

Vastaan: ajurikerroksen abstraktio ei joudu koetukselle, kun molemmat
laitteet ovat samalta valmistajalta.

### B: Carlo Gavazzi EM111 S1 (Modbus) + Eastron SDM120-MBus (M-Bus)
Kaksi valmistajaa, kaksi dokumentaatiokulttuuria, kaksi rekisterikarttaa.

### C: Kaksi Gavazzia (EM111 S1 + EM111 M1)
Sama valmistaja, sama datalehti, EM111 on jo hyllyssä.

Vastaan: ajurikerroksen abstraktio ei joudu koetukselle, kun molemmat
laitteet ovat samalta valmistajalta.

## Päätös

Valittiin **B**.

Abstraktio joutuu koetukselle vasta kun toteutukset eroavat. Gavazzissa
03h ja 04h palauttavat saman tuloksen (CP s. 3).

## Seuraukset

**Hyvät**
- Ajurikerroksen abstraktio joutuu oikeasti todistamaan itsensä
- Lähteellinen valmistajakohtainen poikkeama demoon (Gavazzi 03h = 04h)

**Huonot / hinta**
- Kaksi datalehteä opeteltavaksi, kaksi konfigurointityökalua
- Kaksi eri tilausta, kaksi rahtia
- Enemmän työtä ajurikerroksessa

**Mitä tämä sulkee pois**
- Ei voi olettaa yhteistä rekisterikarttaa missään koodissa

## Todennus

Onnistunut jos uuden valmistajan lisääminen vaatii vain uuden ajuriluokan
eikä muutoksia pipelineen. Epäonnistunut jos jompikumpi laite vaatii
erikoiskäsittelyä ajurikerroksen yläpuolella.
