/**
 * Das Modul "Eingabeformular" ist die Klasse "Eingabeformular" zur Verfuegung.
 * @module classes/Eingabeformular
 */

import Fehler from "./Fehler.js";
import liqui_planner from "../liqui-planner.js";

/**
 * Die Klasse "Eingabeformular" stellt alle Eigenschaften
 * und Methoden des Eingabeformulars (inkl. HTML und Events) zur Verfuegung.
 */
export default class Eingabeformular {
  /**
   * Der Konstruktor generiert bie Instanzierung der Klasse "Eingabeformular"
   * das HTML des Eingabeformulars.
   * @prop {Element} _html - das HTML des Eingabeformulars
   */
  constructor() {
    this._html = this._html_generieren();
  }

  /**
   * Diese private Methode extrahiert die im Eingabeformular eingegebene Daten aus
   * dem Submit-Event des Eingabeformulars.
   * @param {Event} sumit_event - das Submit-Event des Eingabeformulars
   * @returns {Object} - einfaches Objekt mit den Rohdaten des Eingabformulars
   */
  _formulardaten_holen(sumit_event) {
    return {
      titel: sumit_event.target.elements.titel.value,
      betrag: sumit_event.target.elements.betrag.value,
      einnahme: sumit_event.target.elements.einnahme.checked,
      ausgabe: sumit_event.target.elements.ausgabe.checked,
      datum: sumit_event.target.elements.datum.valueAsDate,
    };
  }

  _formulardaten_verarbeiten(formulardaten) {
    return {
      titel: formulardaten.titel.trim(),
      typ: formulardaten.ausgabe === true ? "ausgabe" : "einnahme",
      betrag: parseFloat(formulardaten.betrag) * 100,
      datum: formulardaten.datum,
    };
  }

  _formulardaten_valiederen(formulardaten) {
    let fehler = [];
    if (formulardaten.titel === "") {
      fehler.push("Titel");
    }
    if (isNaN(formulardaten.betrag)) {
      fehler.push("Betrag");
    }
    if (formulardaten.datum === null) {
      fehler.push("Datum");
    }
    return fehler;
  }

  _absenden_event_hinzufuegen(eingabeformular) {
    eingabeformular
      .querySelector("#eingabeformular")
      .addEventListener("submit", (e) => {
        e.preventDefault();

        console.log(e);
        let formulardaten = this._formulardaten_verarbeiten(
          this._formulardaten_holen(e)
        );
        console.log(formulardaten);

        let formular_fehler = this._formulardaten_valiederen(formulardaten);

        if (formular_fehler.length === 0) {
          liqui_planner.eintrag_hinzufuegen(formulardaten);
          let bestehnde_fehlerbox = document.querySelector(".fehlerbox");
          if (bestehnde_fehlerbox !== null) {
            bestehnde_fehlerbox.remove();
          }
          e.target.reset();
          this._datum_aktualisieren();
        } else {
          let fehler = new Fehler(
            "Folgende Felder wurden nicht korrekt ausgefuellt: ",
            formular_fehler
          );
          fehler.anzeigen();
        }
      });
  }

  _html_generieren() {
    let eingabeformular = document.createElement("section");

    eingabeformular.setAttribute("id", "eingabeformular-container");
    eingabeformular.innerHTML = `
    <form id="eingabeformular" action="#" method="get"></form>
    <div class="eingabeformular-zeile">
      <h1>Neue Einnahme / Ausgabe hinzufügen</h1>
    </div>
    <div class="eingabeformular-zeile">
      <div class="titel-typ-eingabe-gruppe">
        <label for="titel">Titel</label>
        <input type="text" id="titel" form="eingabeformular" name="titel" placeholder="z.B. Einkaufen" size="10" title="Titel des Eintrags"/>
        <input type="radio" id="einnahme" name="typ" value="einnahme" form="eingabeformular" title="Typ des Eintrags"/>
        <label for="einnahme" title="Typ des Eintrags">Einnahme</label>
        <input type="radio" id="ausgabe" name="typ" value="ausgabe" form="eingabeformular" title="Typ des Eintrags" checked/>
        <label for="ausgabe" title="Typ des Eintrags">Ausgabe</label>
      </div>
    </div>
    <div class="eingabeformular-zeile">
      <div class="betrag-datum-eingabe-gruppe">
        <label for="betrag">Betrag</label>
        <input type="number" id="betrag" name="betrag" form="eingabeformular" placeholder="z.B. 10,42" size="10" step="0.01" min="0"
          title="Betrag des Eintrags (max. zwei Nachkommastellen, kein €-Zeichen)"/>
        <label for="datum">Datum</label>
        <input type="date" id="datum" name="datum" form="eingabeformular" size="10" title="Datum des Eintrags"/>
      </div>
    </div>
    <div class="eingabeformular-zeile">
      <button class="standard" type="submit" form="eingabeformular">
        Hinzufügen
      </button>
    </div>`;

    this._absenden_event_hinzufuegen(eingabeformular);

    return eingabeformular;
  }

  anzeigen() {
    let navigationleiste = document.querySelector("#navigationsleiste");
    if (navigationleiste !== null) {
      navigationleiste.insertAdjacentElement("afterend", this._html);
      this._datum_aktualisieren();
    }
  }

  _datum_aktualisieren() {
    let datums_input = document.querySelector("#datum");
    if (datums_input !== null) {
      datums_input.valueAsDate = new Date();
    }
  }
}
