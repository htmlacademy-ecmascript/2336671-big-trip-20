import EditPointView from '../view/edit-point-view';
import TripEventsItemView from '../view/trip-events_item.js';
import { render, replace } from '../framework/render';

export default class EventPresenter {
  #eventsListContainer = null;

  #point = null;

  #eventComponent = null;
  #eventEditComponent = null;

  constructor ({eventsListContainer}) {
    this.#eventsListContainer = eventsListContainer;
  }

  init (point) {
    this.#point = point;

    this.#eventComponent = new TripEventsItemView({
      point: this.#point,
      onEditClick: () => {
        this.#replaceItemToEdit();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: () => {
        //to-do
      }
    });

    this.#eventEditComponent = new EditPointView({
      point: this.#point,
      onFormSubmit: () => {
        this.#replaceEditToItem();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
      onFormCancel: () => {
        this.#replaceEditToItem();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
      onFormDelete: () => {
        //to-do
      }
    });

    render(this.#eventComponent, this.#eventsListContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToItem();
    }
  };

  #replaceItemToEdit() {
    replace(this.#eventEditComponent, this.#eventComponent);
  }

  #replaceEditToItem() {
    replace(this.#eventComponent, this.#eventEditComponent);
  }
}
