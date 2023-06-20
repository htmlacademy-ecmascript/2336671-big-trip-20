import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate () {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {

  #newPointButtonHandler = null;

  constructor ({onNewPointButtonClick}) {
    super();

    this.#newPointButtonHandler = onNewPointButtonClick;

    this.element.addEventListener('click',this.#newEventHandler);
  }

  get template () {
    return createNewEventButtonTemplate();
  }

  #newEventHandler = (evt) => {
    evt.preventDefault();
    this.#newPointButtonHandler();
  };
}
