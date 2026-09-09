# ADR-0009: Ryhmäkeskus koteloksi, ei pistokemuuntajia sisällä

- **Tila:** Hyväksytty
- **Päivämäärä:** 2026-09-08
- **Liittyy:** ADR-0001, ADR-0005

## Konteksti

Haettiin 2-DIN kiskon omaavaa sopivan hintaista keskuskoteloa kannella.
Useimmat haetut keskuskotelot olivat kalliita ja huonolaatuisia.

## Vaihtoehdot

### A: Schneider Electric Kaedra Moduulikotelo IP65
Täsmäsi mittoihin, mutta hinta lähes 100 euroa.
Kirkas kansi antaa mahdollisuuden seurata komponentteja.

### B: Rutab Moduulikotelo IP40
DIN-kiskon takana ei ole tilaa ja sen lasku ei onnistu, jos komponentti on korkea esim. Dc-poweri.
Keskus ei pysy pystyssä ilman kiinnitystä, joten hankala säilyttää rakennus ja testaus vaiheessa.
Kirkas kansi antaa mahdollisuuden seurata komponentteja.

### C: Gewiss GW40104BS Moduulikotelo IP65
Hinnaltaa keskeltä, jos laadulta odotetaan jotain. Kirkas kansi antaa mahdollisuuden seurata komponentteja
Din-kiskot ovat laskettavissa lähes pohjalle.

## Päätös

Valittiin **C**, Vastasi laatu ja asennus kriteereitä.


| Osa | Malli/koodi | Rooli | alv 0 % | alv 25,5 % |
|---|---|---|---|---|
| Moduulikotelo, pinta, 24-mod, IP65 | PC GW40104BS | Runko | 61,45 € | 77,12 € |
| Riviliitin WAGO 3N, SIN, 2 kpl | 2002-1304 | Kenttäkaapelointi | 1,71 € | 2,15 € |
| Riviliitin WAGO, KEVI, 2 kpl | 2002-1304 | " | 3,16 € | 3,97 € |
| Riviliitin WAGO, harmaa, 8 kpl | 2002-1304 | " | 6,82 € | 8,56 € |
| Johdonsuojakatkaisija 1x10A, C-käyrä | GW92006 | Ylivirtasuoja, pistorasian haara | 2,15 € | 2,70 € |
| Johdonsuojakatkaisija 1x10A, C-käyrä (toinen) | GW92006 | Ylivirtasuoja, Pi:n ja Wavesharen DC-syöttöjen yhteinen haara | 2,15 € | 2,70 € |
| Vikavirtasuojakytkin 30mA/2x40A, tyyppi A | GWS4032 | Vikavirtasuoja, mitattavan kuorman haara | 29,29 € | 36,76 € |
| DIN-teholähde 5V 2,4A 12W | Mean Well HDR-15-5 | Pi:n syöttö | 18,90 € | 23,72 € |
| DIN-teholähde 24V 1,5A 30W | Mornsun LI30-20B24PR2 | Wavesharen syöttö, lahjoitus | — | — |
| IEC C14 -paneeliliitin, urospuoli, 10A 250V, ei sulakepesää | GSD336-63 | Irrotettava verkkojohto | 3,20 € | 4,02 € |
| Keinukytkin 2-nap ON-OFF 16A, IP65, merkkivalo | B448PUIP65 | Pääkytkin | 4,90 € | 6,15 € |
| ABB DIN-suko | | Varaus tuleville lisäyksille | 12,00 € | 15,06 € |
| Holkkitiiviste PG13,5, IP68, 6-12 mm, 3 kpl | WISKA HF-SKV | Vedonpoistot kenttäkaapeleille | 6,00 € | 7,53 € |
| **Yhteensä (lahjoitukset pois lukien)** | | | **151,73 €** | **190,42 €** |

**Lähteitä hinnoista ei liitetä tähän tarkoituksella; hankinta kanava pidetään yksityisenä.**

## Seuraukset

**Hyvät**
- Kokonaishinta 190,42 € (lahjoitukset pois lukien), yli
  kaksinkertainen alkuperäiseen ~85 € arvioon nähden, mutta silti
  selvästi alle teollisen kotelon hinnan
- DIN-kisko valmiina, ei asennuslevyä
- Kaikki kiskotavara näkyvissä kirkkaan kannen läpi
- Yksittäiset osat IP-luokiteltuja: kotelo IP65, kaapelinipat IP68

**Huonot / hinta**
- Kokoonpanon IP-luokitusta kokonaisuutena ei ole mitattu eikä testattu,
  vaikka yksittäiset osat ovat luokiteltuja — kirkas kansi, liitokset ja
  saumat ratkaisevat lopputuloksen
- Kansi ei ole umpinainen (vian tuottokytkimet, ADR-0005)
- Painava kantaa verrattuna laukkuun

**Mitä tämä sulkee pois**
- Ei IEC C14 -sulakepesää — ylivirtasuoja tulee johdonsuojakatkaisijalta

## Auki

- 4G-yhteys/mokkula: ei päätöstä tehty. Langaton yhteys tulee joka
  tapauksessa olemaan, mutta laite ja reititystapa ovat auki. Ks. myös
  ADR-0007.
- Kokoonpanon IP-luokitus mittaamatta.

## Todennus

Kansi auki -tarkastus: näkyykö yhtään irrallista laturia tai teippiä?
Jos näkyy, tämä ADR ei ole toteutunut.

Vikavirtasuojan haarajako todennettu käytännössä 2026-09: kiinteä
teholähde laukaisi 30 mA:n suojan kun oli virheellisesti sen takana;
korjattu erilliseksi haaraksi.
