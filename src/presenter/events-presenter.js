import TripEventsListView from '../view/trip-events_list.js';
import TripEventsItemView from '../view/trip-events_item.js';
import EditPointView from '../view/edit-point-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  eventsListComponent = new TripEventsListView();

  constructor({eventContainer}) {
    this.eventContainer = eventContainer;
  }

  init () {
    render(this.eventsListComponent, this.eventContainer);
    render(new EditPointView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render (new TripEventsItemView(), this.eventsListComponent.getElement());
    }
  }
}
