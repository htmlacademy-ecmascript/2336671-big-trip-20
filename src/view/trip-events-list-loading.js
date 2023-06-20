import AbstractView from '../framework/view/abstract-view.js';

function cretateTripEventsListEmptyTemplate () {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class TripEventsListLodingView extends AbstractView {

  get template () {
    return cretateTripEventsListEmptyTemplate();
  }
}
