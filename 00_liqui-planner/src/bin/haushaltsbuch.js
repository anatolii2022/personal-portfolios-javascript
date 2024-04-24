"use strict";

const haushaltsbuch = {
  gesamt_bilanz: new Map(),
  eintraege: [],

  eintrag_hinzufuegen(formulardaten) {
    let neuer_eintrag = new Map();
    neuer_eintrag.set("titel", formulardaten.titel);
    neuer_eintrag.set("typ", formulardaten.typ);
    neuer_eintrag.set("betrag", formulardaten.betrag);
    neuer_eintrag.set("datum", formulardaten.datum);
    neuer_eintrag.set("timestamp", Date.now());
    this.eintraege.push(neuer_eintrag);
    this.eintraege_sortieren();
    this.eintraege_anzeigen();
    this.gesamtbilanz_erstellen();
    this.gesamtbilanz_anzeigen();
  },

  eintag_entfernen(timestamp) {
    let start_index;
    for (let i = 0; i < this.eintraege.length; i++) {
      if (this.eintraege[i].get("timestamp") === parseInt(timestamp)) {
        start_index = i;
        break;
      }
    }
    this.eintraege.splice(start_index, 1);
    this.eintraege_anzeigen();
    this.gesamtbilanz_erstellen();
    this.gesamtbilanz_anzeigen();
  },

  // eintrag_erfassen() {
  //   let neuer_eintrag = new Map();
  //   neuer_eintrag.set("titel", this.titel_verarbeiten(prompt("Titel: ")));
  //   neuer_eintrag.set("typ", this.typ_verarbeiten(prompt("Typ: ")));
  //   neuer_eintrag.set(
  //     "betrag",
  //     this.betrag_verarbeiten(prompt("Betrag (in Euro, ohne E-Zeichen): "))
  //   );
  //   neuer_eintrag.set(
  //     "datum",
  //     this.datum_verarbeiten(prompt("Datum (jjjj-mm-tt): "))
  //   );
  //   neuer_eintrag.set("timestamp", Date.now());
  //   if (this.fehler.length === 0) {
  //     this.eintraege.push(neuer_eintrag);
  //   } else {
  //     console.log("Folgende Fehleingaben wurden gefunden:");
  //     this.fehler.forEach((fehler) => console.log(fehler));
  //   }
  // },

  // titel_verarbeiten(titel) {
  //   titel = titel.trim();
  //   if (this.titel_validieren(titel)) {
  //     return titel;
  //   } else {
  //     this.fehler.push("Kein Titel angegeben.");
  //   }
  // },

  // titel_validieren(titel) {
  //   if (titel !== "") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  // typ_verarbeiten(typ) {
  //   typ = typ.trim().toLowerCase();
  //   if (this.typ_validieren(typ)) {
  //     return typ;
  //   } else {
  //     this.fehler.push(`Ungueltiger Eintrags-Typ: ${typ}`);
  //   }
  // },

  // typ_validieren(typ) {
  //   let regEx = /^(?:einnahme|ausgabe)$/;
  //   if (typ.match(regEx) !== null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  // betrag_verarbeiten(betrag) {
  //   betrag = betrag.trim();
  //   if (this.betrag_validieren(betrag)) {
  //     return parseFloat(betrag.replace(",", ".")) * 100;
  //   } else {
  //     this.fehler.push(`Ungueltiger Betrag: ${betrag} EUR`);
  //   }
  // },

  // betrag_validieren(betrag) {
  //   let regEx = /^\d+(?:(?:,|\.)\d\d?)?$/;
  //   if (betrag.match(regEx) !== null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  // datum_verarbeiten(datum) {
  //   datum = datum.trim();
  //   if (this.datum_validieren(datum)) {
  //     return new Date(`${datum} 00:00:00`);
  //   } else {
  //     this.fehler.push(`Ungueltiger Datumsformat: ${datum}`);
  //   }
  // },

  // datum_validieren(datum) {
  //   let regEx = /^\d{4}-\d{2}-\d{2}$/;
  //   if (datum.match(regEx) !== null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

  eintraege_sortieren() {
    this.eintraege.sort((eintrag_a, eintrag_b) => {
      return eintrag_a.get("datum") > eintrag_b.get("datum")
        ? -1
        : eintrag_a.get("datum") < eintrag_b.get("datum")
        ? 1
        : 0;
    });
  },

  // durch HTML ersetzen
  // eintraege_ausgeben() {
  //   console.clear();
  //   this.eintraege.forEach((eintrag) => {
  //     console.log(
  //       `Titel: ${eintrag.get("titel")}\n` +
  //         `Typ: ${eintrag.get("typ")}\n` +
  //         `Betrag: ${(eintrag.get("betrag") / 100).toFixed(2)} EUR\n` +
  //         `Datum: ${eintrag.get("datum").toLocaleDateString("de-DE", {
  //           year: "numeric",
  //           month: "2-digit",
  //           day: "2-digit",
  //         })}`
  //     );
  //   });
  // },

  html_eintrag_generieren(eintrag) {
    let listenpunkt = document.createElement("li");

    eintrag.get("typ") == "einnahme"
      ? listenpunkt.setAttribute("class", "einnahme")
      : listenpunkt.setAttribute("class", "ausgabe");

    listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp"));

    let datum = document.createElement("span");
    datum.setAttribute("class", "datum");
    datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    listenpunkt.insertAdjacentElement("afterbegin", datum);

    let titel = document.createElement("span");
    titel.setAttribute("class", "titel");
    titel.textContent = eintrag.get("titel");

    datum.insertAdjacentElement("afterend", titel);

    let betrag = document.createElement("span");
    betrag.setAttribute("class", "betrag");
    betrag.textContent = `${(eintrag.get("betrag") / 100)
      .toFixed(2)
      .replace(/\./, ",")} €`;
    titel.insertAdjacentElement("afterend", betrag);

    let button = document.createElement("button");
    button.setAttribute("class", "entfernen-button");
    let icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-trash");
    button.appendChild(icon);
    betrag.insertAdjacentElement("afterend", button);

    this.eintag_entfernen_event_hinzufuegen(listenpunkt);

    return listenpunkt;
  },

  eintag_entfernen_event_hinzufuegen(listenpunkt) {
    listenpunkt
      .querySelector(".entfernen-button")
      .addEventListener("click", (e) => {
        let timestamp = e.target.parentElement.getAttribute("data-timestamp");
        this.eintag_entfernen(timestamp);
      });
  },

  eintraege_anzeigen() {
    document.querySelectorAll(".monatsliste ul").forEach((e) => e.remove());

    let eintragliste = document.createElement("ul");

    this.eintraege.forEach((eintrag) =>
      eintragliste.insertAdjacentElement(
        "beforeend",
        this.html_eintrag_generieren(eintrag)
      )
    );

    document
      .querySelector(".monatsliste")
      .insertAdjacentElement("beforeend", eintragliste);
  },

  gesamtbilanz_erstellen() {
    let neue_gesamtbilanz = new Map();
    neue_gesamtbilanz.set("einnahmen", 0);
    neue_gesamtbilanz.set("ausgaben", 0);
    neue_gesamtbilanz.set("bilanz", 0);

    this.eintraege.forEach((eintrag) => {
      switch (eintrag.get("typ")) {
        case "einnahme":
          neue_gesamtbilanz.set(
            "einnahmen",
            neue_gesamtbilanz.get("einnahmen") + eintrag.get("betrag")
          );
          neue_gesamtbilanz.set(
            "bilanz",
            neue_gesamtbilanz.get("bilanz") + eintrag.get("betrag")
          );
          break;
        case "ausgabe":
          neue_gesamtbilanz.set(
            "ausgaben",
            neue_gesamtbilanz.get("ausgaben") + eintrag.get("betrag")
          );
          neue_gesamtbilanz.set(
            "bilanz",
            neue_gesamtbilanz.get("bilanz") - eintrag.get("betrag")
          );
          break;
        default:
          console.log(`Der Typ "${eintrag.get("typ")} ist nicht bekannt`);
          break;
      }
    });

    this.gesamt_bilanz = neue_gesamtbilanz;
  },

  //wird durch HTML-Ausgabe ersetzt
  // gesamtbilanz_ausgeben() {
  //   console.log(
  //     `Einnahmen: ${(this.gesamt_bilanz.get("einnahmen") / 100).toFixed(
  //       2
  //     )} EUR\n` +
  //       `Ausgaben: ${(this.gesamt_bilanz.get("ausgaben") / 100).toFixed(
  //         2
  //       )} EUR\n` +
  //       `Bilanz: ${(this.gesamt_bilanz.get("bilanz") / 100).toFixed(2)} EUR\n` +
  //       `Bilanz ist positiv: ${this.gesamt_bilanz.get("bilanz") >= 0}`
  //   );
  // },

  html_gesamtbilanz_generieren() {
    // anhand der aktuellen gesamtbilanz die gesamtbilanz neu generieren
    let gesamtbilanz = document.createElement("aside");
    gesamtbilanz.setAttribute("id", "gesamtbilanz");

    let h1 = document.createElement("h1");
    h1.textContent = "Gesamtbilanz";
    gesamtbilanz.insertAdjacentElement("afterbegin", h1);

    let einnahmen_zeile = document.createElement("div");
    einnahmen_zeile.setAttribute("class", "gesamtbilanz-zeile einnahmen");
    let einnahmen_titel = document.createElement("span");
    einnahmen_titel.textContent = "Einnahmen:";
    einnahmen_zeile.insertAdjacentElement("afterbegin", einnahmen_titel);
    let einnahmen_betrag = document.createElement("span");
    einnahmen_betrag.textContent = `${(
      this.gesamt_bilanz.get("einnahmen") / 100
    )
      .toFixed(2)
      .replace(/\./, ",")} €`;

    einnahmen_zeile.insertAdjacentElement("beforeend", einnahmen_betrag);
    gesamtbilanz.insertAdjacentElement("beforeend", einnahmen_zeile);

    let ausgaben_zeile = document.createElement("div");
    ausgaben_zeile.setAttribute("class", "gesamtbilanz-zeile ausgaben");
    let ausgaben_titel = document.createElement("span");
    ausgaben_titel.textContent = "Ausgaben:";
    ausgaben_zeile.insertAdjacentElement("afterbegin", ausgaben_titel);
    let ausgaben_betrag = document.createElement("span");
    ausgaben_betrag.textContent = `${(this.gesamt_bilanz.get("ausgaben") / 100)
      .toFixed(2)
      .replace(/\./, ",")} €`;
    ausgaben_zeile.insertAdjacentElement("beforeend", ausgaben_betrag);
    gesamtbilanz.insertAdjacentElement("beforeend", ausgaben_zeile);

    let bilanz_zeile = document.createElement("div");
    bilanz_zeile.setAttribute("class", "gesamtbilanz-zeile bilanz");
    let bilanz_titel = document.createElement("span");
    bilanz_titel.textContent = "Bilanz:";
    bilanz_zeile.insertAdjacentElement("afterbegin", bilanz_titel);
    let bilanz_betrag = document.createElement("span");

    this.gesamt_bilanz.get("bilanz") >= 0
      ? bilanz_betrag.setAttribute("class", "positiv")
      : bilanz_betrag.setAttribute("class", "negativ");

    bilanz_betrag.textContent = `${(this.gesamt_bilanz.get("bilanz") / 100)
      .toFixed(2)
      .replace(/\./, ",")} €`;
    bilanz_zeile.insertAdjacentElement("beforeend", bilanz_betrag);
    gesamtbilanz.insertAdjacentElement("beforeend", bilanz_zeile);

    return gesamtbilanz;
  },

  gesamtbilanz_anzeigen() {
    document.querySelectorAll("#gesamtbilanz").forEach((el) => el.remove());
    document
      .querySelector("body")
      .insertAdjacentElement("beforeend", this.html_gesamtbilanz_generieren());
  },
};
