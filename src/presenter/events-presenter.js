import TripEventsListView from '../View/trip-events_list.js';
import TripEventsItemView from '../View/trip-events_item.js';
import EditPointView from '../View/edit-point-view.js';
import SortingView from '../View/sorting-view.js';
import { remove, render, replace } from '../framework/render.js';

export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();

  #eventContainer = null;
  #pointsModel = null;

  #eventPoints = [];

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
  }

  init () {
    this.#eventPoints = [...this.#pointsModel.points];

    this.#renderEventsList();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const itemComponent = new TripEventsItemView({
      point,
      onEditClick: () => {
        replaceItemToEdit();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onFavoriteClick: () => {
        //to-do
      }
    });

    const editItemComponent = new EditPointView({
      point,
      onFormSubmit: () => {
        replaceEditToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormCancel: () => {
        replaceEditToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormDelete: () => {
        remove(editItemComponent);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceItemToEdit() {
      replace(editItemComponent, itemComponent);
    }

    function replaceEditToItem() {
      replace(itemComponent, editItemComponent);
    }

    render(itemComponent, this.#eventsListComponent.element);
  }

  #renderEventsList() {

    render (new SortingView(), this.#eventContainer);
    render (this.#eventsListComponent, this.#eventContainer);

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderPoint(this.#eventPoints[i]);
    }

  }

}
