export default class Navigationsleiste {
  constructor() {
    this._html = this._html_generieren();
  }

  _html_generieren() {
    let nav = document.createElement("nav");
    nav.setAttribute("id", "navigationsleiste");

    let anchor = document.createElement("a");
    anchor.setAttribute("href", "#");
    nav.insertAdjacentElement("afterbegin", anchor);

    let span = document.createElement("span");
    span.setAttribute("id", "markenname");
    span.textContent = "Liqui-Planner";
    anchor.insertAdjacentElement("afterbegin", span);

    return nav;
  }

  anzeigen() {
    let body = document.querySelector("body");
    if (body !== null) {
      body.insertAdjacentElement("afterbegin", this._html);
    }
  }
}
