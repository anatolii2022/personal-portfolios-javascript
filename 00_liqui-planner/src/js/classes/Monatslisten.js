import Monatsliste from "./Monatsliste.js";

export default class Monatslisten {
  constructor() {
    this._monatslisten = [];
    this._html = this._html_generieren();
  }

  _eintrag_hinzufuegen(eintrag) {
    let eintragsmonat = eintrag
      .datum()
      .toLocaleDateString("de-DE", { month: "numeric" });
    let eintragsjahr = eintrag
      .datum()
      .toLocaleDateString("de-DE", { year: "numeric" });

    let monatsliste_vorhanden = false;

    this._monatslisten.forEach((monatsliste) => {
      if (
        eintragsmonat === monatsliste.monat() &&
        eintragsjahr === monatsliste.jahr()
      ) {
        monatsliste.eintrag_hinzufuegen(eintrag);
        monatsliste_vorhanden = true;
      }
    });

    if (!monatsliste_vorhanden) {
      this._monatsliste_hinzufuegen(eintragsjahr, eintragsmonat, eintrag);
    }
  }

  _monatsliste_hinzufuegen(jahr, monat, eintrag) {
    let neue_monatsliste = new Monatsliste(jahr, monat);
    neue_monatsliste.eintrag_hinzufuegen(eintrag);
    this._monatslisten.push(neue_monatsliste);
    // this.html = this._html_generieren();
  }

  _monatslisten_sortieren() {
    this._monatslisten.sort((monatsliste_a, monatsliste_b) => {
      if (monatsliste_a.jahr() < monatsliste_b.jahr()) {
        return 1;
      } else if (monatsliste_a.jahr() > monatsliste_b.jahr()) {
        return -1;
      } else {
        if (monatsliste_a.monat() < monatsliste_b.monat()) {
          return 1;
        } else {
          return -1;
        }
      }
    });
  }

  _html_generieren() {
    let monatslisten = document.createElement("section");
    monatslisten.setAttribute("id", "monatslisten");

    this._monatslisten.forEach((monatsliste) => {
      monatslisten.insertAdjacentElement("beforeend", monatsliste.html());
    });
    return monatslisten;
  }

  aktualisieren(eintraege) {
    this._monatslisten = [];
    eintraege.forEach((eintrag) => {
      this._eintrag_hinzufuegen(eintrag);
    });
    this._monatslisten_sortieren();
    this._html = this._html_generieren();
    this.anzeigen();
  }

  _entfernen() {
    let monatslisten = document.querySelector("#monatslisten");
    if (monatslisten !== null) {
      monatslisten.remove();
    }
  }

  anzeigen() {
    let eingabeformular = document.querySelector("#eingabeformular-container");
    if (eingabeformular !== null) {
      this._entfernen();
      eingabeformular.insertAdjacentElement("afterend", this._html);
    }
  }
}
