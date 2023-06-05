import AbstractView from '../framework/view/abstract-view.js';

function cretateNewEventButtonTemplate () {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {

  #onNewPointButtonClick = null;

  constructor ({onNewPointButtonClick}) {
    super();

    this.#onNewPointButtonClick = onNewPointButtonClick;

    this.element.addEventListener('click',this.#onNewEventClick);
  }

  get template () {
    return cretateNewEventButtonTemplate();
  }

  #onNewEventClick = (evt) => {
    evt.preventDefault();
    this.#onNewPointButtonClick();
  };
}
