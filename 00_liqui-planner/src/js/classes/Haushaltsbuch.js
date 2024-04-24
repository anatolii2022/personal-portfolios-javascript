import Navigationsleiste from "./Navigationsleiste.js";
import Eingabeformular from "./Eingabeformular.js";
import Monatslisten from "./Monatslisten.js";
import Gesamtbilanz from "./Gesamtbilanz.js";
import Eintrag from "./Eintrag.js";

export default class Haushaltsbuch {
  constructor() {
    this._eintraege = [];
    this._navigationsleiste = new Navigationsleiste();
    this._eingabeformular = new Eingabeformular();
    this._monatslisten = new Monatslisten();
    this._gesamt_bilanz = new Gesamtbilanz();
    this._wiederherstellen();
  }

  eintrag_hinzufuegen(eintragsdaten) {
    let neuer_eintrag = new Eintrag(
      eintragsdaten.titel,
      eintragsdaten.typ,
      eintragsdaten.betrag,
      eintragsdaten.datum
    );

    this._eintraege.push(neuer_eintrag);
    this._monatslisten.aktualisieren(this._eintraege);
    this._gesamt_bilanz.aktualisieren(this._eintraege);
    this._speichern();
  }

  eintag_entfernen(timestamp) {
    let start_index;
    for (let i = 0; i < this._eintraege.length; i++) {
      if (this._eintraege[i].timestamp() === parseInt(timestamp)) {
        start_index = i;
        break;
      }
    }
    this._eintraege.splice(start_index, 1);
    this._monatslisten.aktualisieren(this._eintraege);
    this._gesamt_bilanz.aktualisieren(this._eintraege);
    this._speichern();
  }

  _speichern() {
    localStorage.setItem("eintraege", JSON.stringify(this._eintraege));
  }

  _wiederherstellen() {
    let gespeicherte_eintraege = localStorage.getItem("eintraege");
    if (gespeicherte_eintraege !== null) {
      JSON.parse(gespeicherte_eintraege).forEach((eintrag) => {
        this.eintrag_hinzufuegen({
          titel: eintrag._titel,
          typ: eintrag._typ,
          betrag: eintrag._betrag,
          datum: new Date(eintrag._datum),
        });
      });
    }
    console.log(gespeicherte_eintraege);
  }

  start() {
    this._navigationsleiste.anzeigen();
    this._eingabeformular.anzeigen();
    this._monatslisten.anzeigen();
    this._gesamt_bilanz.anzeigen();
  }
}
