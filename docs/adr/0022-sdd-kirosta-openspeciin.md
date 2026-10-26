# ADR-0022: SDD-putki Kirosta OpenSpeciin

- **Tila:** Ehdotettu
- **Päivämäärä:** 2026-10-26

## Konteksti ja ongelma

SDD-putki rakennettiin Kiron spec-muodon päälle omilla agenteilla ja
säännöillä. Putki osoittautui liian hankalaksi SDD:n opiskelun
aloittamiseen, eikä omia sääntöjä voi tarkistaa mistään ulkoisesta
lähteestä (oma havainto).

## Päätöstekijät

- Vakiotyökalu, jonka toiminnan voi tarkistaa sen omasta dokumentaatiosta
- Kevyt aloittaa: vähän vaiheita ennen kuin työ pääsee alkuun
- Sama ajoympäristö kuin projektissa (Node 24)

## Harkitut vaihtoehdot

- A: Kiro-putki omilla agenteilla nykyisellään
- B: GitHub spec-kit
- C: OpenSpec

## Päätös

Valittiin "C: OpenSpec", koska se on vakiotyökalu, toimii projektin omalla
Node-ympäristöllä ja tuottaa muutoksen suunnitelman yhdellä komennolla.
Se täyttää kaikki kolme päätöstekijää, spec-kit ei täytä kahta viimeistä.

### Seuraukset

- Hyvä, koska putken rakenteelle on yksi ulkoinen lähde.
- Hyvä, koska projektiin ei tule toista ajoympäristöä.
- Huono, koska OpenSpec kerää oletuksena käyttötilastoja. Ne kytketään pois
  asennuksessa (`openspec config set telemetry.enabled false`).
- Huono, koska `/opsx:apply` toteuttaa taskit itse, kun projektissa
  käyttäjä kirjoittaa koodin funktio kerrallaan.
- Huono, koska vanhan putken työ ei siirry, vaan specit tehdään uudelleen.

## Vaihtoehtojen hyvät ja huonot puolet

### A: Kiro-putki omilla agenteilla nykyisellään

- Hyvä, koska putki on valmis (oma havainto).
- Huono, koska jokainen sääntö on oma keksintö ilman ulkoista lähdettä.
- Huono, koska putki oli liian hankala opiskelun aloittamiseen (oma havainto).

### B: GitHub spec-kit

- Hyvä, koska se on vakiotyökalu, jolla on laaja dokumentaatio.
- Huono, koska se vaatii Pythonin 3.11+ ja uv:n.
- Huono, koska työ kulkee constitutionin ja kuuden komennon kautta yksi
  kerrallaan.

### C: OpenSpec

- Hyvä, koska se asennetaan npm:llä tai yhtenä binäärinä.
- Hyvä, koska `/opsx:propose` luo proposalin, specsit, designin ja taskit
  kerralla, ja `/opsx:archive` päivittää ne pysyviin specseihin.
- Huono, koska telemetria on oletuksena päällä.

## Lisätietoa

- OpenSpec v1.15.0, README:
  <https://github.com/Fission-AI/OpenSpec/blob/6d04a1b58dedc95729d34e4f223d9d483aae210a/README.md>
  (asennus, `/opsx:*`-komennot, telemetria)
- Spec-kit v1.2.3, README:
  <https://github.com/github/spec-kit/blob/9783b49ed66c26935cf7ef5ccc6ae5a296316eb7/README.md>
  (Python 3.11+ ja uv, SDD-komennot)
