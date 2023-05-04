import TripEventsListView from '../View/trip-events_list.js';
import TripEventsItemView from '../View/trip-events_item.js';
import EditPointView from '../View/edit-point-view.js';
import SortingView from '../View/sorting-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  eventsListComponent = new TripEventsListView();

  constructor({eventContainer, pointsModel}) {
    this.eventContainer = eventContainer;
    this.pointsModel = pointsModel;
  }

  init () {
    this.eventPoints = [...this.pointsModel.getPoints()];

    render (new SortingView(), this.eventContainer);
    render (this.eventsListComponent, this.eventContainer);
    render (new EditPointView(), this.eventsListComponent.getElement());

    for (let i = 0; i < this.eventPoints.length; i++) {
      render (new TripEventsItemView({point: this.eventPoints[i]}), this.eventsListComponent.getElement());
    }
  }
}
