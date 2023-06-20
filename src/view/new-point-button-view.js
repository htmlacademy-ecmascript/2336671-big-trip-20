import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate () {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {

  #onNewPointButtonHandle = null;

  constructor ({onNewPointButtonClick}) {
    super();

    this.#onNewPointButtonHandle = onNewPointButtonClick;

    this.element.addEventListener('click',this.#newEventHandle);
  }

  get template () {
    return createNewEventButtonTemplate();
  }

  #newEventHandle = (evt) => {
    evt.preventDefault();
    this.#onNewPointButtonHandle();
  };
}
