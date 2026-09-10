# Arkkitehtuuripäätökset (ADR)

Tämä hakemisto sisältää projektin arkkitehtuuripäätökset. Jokainen tiedosto
dokumentoi yhden päätöksen: mikä valittiin, mitä hylättiin ja **miksi**.

## Miksi nämä ovat olemassa

Datan siirtäminen mittarista tietokantaan on suoritustyötä. Sen perusteleminen,
miksi juuri tämä laite, tämä protokolla ja tämä epäonnistumismalli valittiin, on
suunnittelutyötä. Tämä hakemisto on se osa projektia, joka erottaa nämä kaksi.

Kun joku kysyy "miksi Raspberry Pi eikä teollinen ohjain", vastaus ei saa olla
"se oli minulla valmiina". Sen pitää olla ADR-0001.

## Tila juuri nyt: lue tämä ennen kuin luotat mihinkään alla olevaan

Harjoittelen dokumentointia ja tästä syystä nämä ADR:t voivat olla sekavia
tai sisältää väärää tietoa.

Mitä se tarkoittaa lukijalle:

- **`Tila`-kenttiin ei voi luottaa.** Ne asetettiin oletusarvoina, ei
  päätöksinä. Ne korjataan sitä mukaa kun kukin ADR käydään läpi.
- **`Liittyy`-kenttiin ei voi luottaa.** Viittaukset tehtiin nopeasti eikä
  niitä ole tarkistettu. Vahvistamaton viittaus on huonompi kuin puuttuva.
- **ADR ei kelpaa todisteeksi toista ADR:ää vastaan** ennen kuin molemmat on
  käyty läpi.
- **`luonnos` hakemistossa tarkoittaa ettei tiedostoa ole GitHubissa.** Ne
  ovat kirjoitettuja ehdotuksia, jotka voivat päätyä käyttöön tai eivät
  koskaan. Vain ✅-rivit ovat projektin todellisia päätöksiä. Sarake
  tarkistetaan `git status docs/adr/`:lla, ei luoteta tähän tiedostoon.

Sisältö on silti käyttökelpoista: tutkimustyö, hinnat ja vaihtoehtojen
punninta ovat aitoja. Muoto ja tilamerkinnät ovat ne jotka eivät vielä pidä.

## Säännöt

1. **Yksi päätös per tiedosto.** Jos joudut kirjoittamaan "ja lisäksi",
   se on toinen ADR.
2. **Kirjoita hylätyt vaihtoehdot auki.** Päätös ilman hylättyjä vaihtoehtoja
   ei ole päätös, se on toteamus.
3. **Kirjoita seuraukset rehellisesti, myös huonot.** Jokaisella valinnalla on
   hinta. Sen nimeäminen on uskottavuuden lähde, ei heikkous.
4. **Älä muokkaa hyväksytyn ADR:n päätöstä tai seurauksia.** Jos päätös
   muuttuu, kirjoita uusi ADR ja merkitse vanha `Korvattu (ks. ADR-XXXX)`.
   Poikkeus: `Liittyy`-kenttää saa täydentää jälkikäteen (sääntö 6). Se ei
   muuta päätöstä, vaan paljastaa yhteyden joka ei ollut tiedossa
   kirjoitushetkellä.
5. **Numerointi juoksee, ei täytetä aukkoja.**
6. **`Liittyy` on vahvistettu, ei arvattu.** Viittaus lisätään vasta kun se on
   luettu ja tarkistettu, ja se perustellaan ADR:n tekstissä eikä pelkkänä
   otsikkorivinä. Tyhjä `—` on parempi kuin viittaus johon ei voi luottaa.

## Tilat

| Tila | Merkitys |
|---|---|
| `Ehdotettu` | Kirjattu, ei vielä päätetty |
| `Hyväksytty` | Voimassa oleva päätös |
| `Hylätty` | Harkittiin, ei toteutettu |
| `Korvattu` | Uudempi ADR kumoaa tämän |
| `Vanhentunut` | Ei enää relevantti (esim. laite poistui) |

**Milloin `Hyväksytty` ansaitaan.** Tila on tarkistettava fakta, ei mielipide.
`Hyväksytty` edellyttää vähintään yhtä näistä:

- raha on käytetty tai laite on hyllyssä
- päätöstä toteuttava koodi on olemassa
- päätös on todennettu mittauksella, ja `Todennus` kertoo miten se mitattiin

Muutoin `Ehdotettu`. Tämä koskee myös ADR:ää joka tuntuu itsestäänselvältä:
hyvä perustelu ei ole sama asia kuin todennus.

Kriteeri koskee sitä päätöstä jonka ADR tekee, ei mitä tahansa faktaa sen
sisällä. Laite hyllyssä oikeuttaa hankintapäätöksen; se ei oikeuta päätöstä
siitä miten laitetta käytetään. Sellainen ansaitaan mittauksella.

## Hakemisto

| # | Otsikko | Tila | GitHubissa |
|---|---|---|---|
| [0001](0001-reunalaite-raspberry-pi.md) | Reunalaitteeksi Raspberry Pi 4B, ei teollista ohjainta | Hyväksytty | ✅ |
| [0002](0002-Modbus-RTU-ja-M-bus-orja.md) | Kaksi eri valmistajaa yhden sijaan | Hyväksytty | ✅ |
| [0003](0003-omat-parserit.md) | Omat protokollaparserit, ei valmista yhdyskäytävää | Ehdotettu | luonnos |
| [0004](0004-reading-envelope-quality.md) | Yksi mittausenvelooppi kaikille ajureille, substatus vain todennetuista vioista | Ehdotettu | luonnos |
| [0005](0005-fyysinen-vian-tuotto.md) | Fyysinen vian tuottopaneeli | Ehdotettu | ✅ |
| [0006](0006-verkkovikojen-simulointi.md) | Verkkovikojen simulointi netemillä + ristiintestaus oikeaa linkkiä vasten | Ehdotettu | luonnos |
| [0007](0007-ei-erillista-4g-reititinta.md) | Ei erillistä 4G-reititintä ensimmäisessä vaiheessa | Ehdotettu | luonnos |
| [0008](0008-toistotila.md) | Toistotila demon riippumattomuuden takaamiseksi | Ehdotettu | luonnos |
| [0009](0009-kotelo-ja-sahkonsyotto.md) | Ryhmäkeskus koteloksi, ei pistokemuuntajia sisällä | Hyväksytty | ✅ |
| [0010](0010-waveshare-modbus-tcp.md) | Waveshare-sarjapalvelin Modbus TCP -tasoksi | Hyväksytty | ✅ |
| [0011](0011-cn105-takaisinmallinnettu.md) | CN105 takaisinmallinnettuna protokollana standardin vastaparina | Ehdotettu | luonnos |
| [0012](0012-wm-bus-rajaus.md) | wM-Bus-vastaanoton eettinen ja oikeudellinen rajaus | Ehdotettu | luonnos |
| [0013](0013-lora-point-to-point.md) | LoRa point-to-point, ei LoRaWAN-gatewaytä | Ehdotettu | luonnos |
| [0014](0014-mqtt-nimiavaruus.md) | MQTT-nimiavaruus ja Sparkplug B | Ehdotettu | luonnos |
| [0015](0015-kamstrup-kwm2230.md) | Kamstrup KWM2230 rajattu pois wM-Bus-lähteenä | Ehdotettu | luonnos |
| [0016](0016-hiljainen-yhteyden-kuolema.md) | Hiljainen yhteyden kuolema ensiluokkaisena havaittavana vikana | Ehdotettu | luonnos |
| [0017](0017-elpymisportaikko.md) | Portaittainen elpyminen mobiiliyhteyden viasta | Ehdotettu | luonnos |
| [0018](0018-uloslahteva-komentokanava.md) | Uloslähtevä MQTT-komentokanava, ei sisääntulevaa yhteyttä | Ehdotettu | luonnos |
| [0019](0019-pi-tarjoaa-etakohteelle-oman-wifi-tukiaseman-kohteen-infraa-ei-oleteta.md) | Pi tarjoaa etäkohteelle oman WiFi-tukiaseman, kohteen infraa ei oleteta | Ehdotettu | ✅ |

## Liittyvät dokumentit

- [`../vikaluettelo.md`](../vikaluettelo.md): havaittujen ja tuotettujen vikojen rekisteri
- [`0000-template.md`](0000-template.md): pohja uudelle ADR:lle
