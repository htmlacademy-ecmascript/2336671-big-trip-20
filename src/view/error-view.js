import AbstractView from '../framework/view/abstract-view.js';

function cretateErrorTemplate (data) {
  return `<p class="trip-events__msg">Error ${data.message}</p>`;
}

export default class ErrorView extends AbstractView {

  #data = null;

  constructor (data) {
    super();
    this.#data = data;
  }

  get template () {
    return cretateErrorTemplate(this.#data);
  }
}
