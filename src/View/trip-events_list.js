import {createElement} from '../render.js';

function cretateTripEventsListTemplate () {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripEventsListView {
  getTemplate () {
    return cretateTripEventsListTemplate();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
