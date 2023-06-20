import AbstractView from '../framework/view/abstract-view.js';

function cretateTripEventsListEmptyTemplate () {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class TripEventsListLoadingView extends AbstractView {

  get template () {
    return cretateTripEventsListEmptyTemplate();
  }
}
