# ADR-0009: Gewiss GW40104BS -moduulikotelo keskukseksi

- **Tila:** Hyväksytty
- **Päivämäärä:** 2026-09-08
- **Liittyy:** —

## Konteksti

Haettiin kahdella DIN-kiskolla varustettua, 30-80 euron hintaista keskuskoteloa kannella.
Useimmat kuluttajalle myytävät keskuskotelot olivat kalliita ja huonolaatuisia.

## Vaihtoehdot

### A: Schneider Electric Kaedra Moduulikotelo IP65
Täsmäsi mittoihin, mutta hinta lähes 100 euroa.
Kirkas kansi antaa mahdollisuuden seurata komponentteja.

### B: Rutab Moduulikotelo IP40
DIN-kiskon takana ei ole tilaa ja sen laskeminen ei onnistu, jos komponentti on korkea esim. DC-teholähde.
Muovi tuntuu ja näyttää huonolaatuiselta.
Kirkas kansi antaa mahdollisuuden seurata komponentteja.

### C: Gewiss GW40104BS Moduulikotelo IP65
Hinnaltaan keskeltä, jos laadulta odotetaan jotain.
Kestää kotelon muokkaukset.
Kirkas kansi antaa mahdollisuuden seurata komponentteja.
DIN-kiskot ovat laskettavissa lähes pohjalle.

## Päätös

Valittiin **C**, koska se vastasi laatu- ja asennuskriteerejä.

## Seuraukset

**Hyvät**
- DIN-kiskot valmiina, ei asennuslevyä
- Nopeasti laajennettavissa

**Huonot**
- Kokoonpanon IP-luokitusta kokonaisuutena ei ole mitattu eikä testattu,
  vaikka yksittäiset osat ovat luokiteltuja. Kirkas kansi, liitokset ja
  saumat ratkaisevat lopputuloksen
- Sulakkeet ja teholähteet vievät jo yhden DIN-kiskorivin, joten testattavien
  laitteiden määrä itse keskuksessa on rajallinen ilman laajennusta.
