import EditPointView from '../view/edit-point-view';
import TripEventsItemView from '../view/trip-events_item.js';
import { remove, render, replace } from '../framework/render';

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

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new TripEventsItemView({
      point: this.#point,
      onEditClick: () => {
        this.#replaceItemToEdit();
      },
      onFavoriteClick: () => {
        //to-do
      }
    });

    this.#eventEditComponent = new EditPointView({
      point: this.#point,
      onFormSubmitClick: () => {
        this.#replaceEditToItem();
      },
      onFormCancelClick: () => {
        this.#replaceEditToItem();
      },
      onFormDeleteClick: () => {
        //to-do
      }
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#eventsListContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventsListContainer.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToItem();
    }
  };

  #replaceItemToEdit() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditToItem() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
