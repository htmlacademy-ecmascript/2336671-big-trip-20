import { RenderPosition, remove, render } from '../framework/render.js';
import NewPointView from '../view/new-point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {

  #pointsModel = null;
  #pointsListContainer = null;

  #handleDataChange = null;
  #handlePointDestroy = null;

  #pointEditComponent = null;

  constructor ({pointsModel, pointsListContainer, onDataChange, onPointDestroy}) {
    this.#pointsListContainer = pointsListContainer;

    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handlePointDestroy = onPointDestroy;
  }

  init () {
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;
    const events = this.#pointsModel.getEventsTypes();
    const cities = this.#pointsModel.getCitiesNames();

    this.#pointEditComponent = new NewPointView ({
      destinations: destinations,
      offers: offers,
      events: events,
      cities: cities,
      onFormSubmitClick: this.#handleFormSubmitClick,
      onFormCancelClick: this.#handleFormCancelClick,
    });

    render (this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy () {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handlePointDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving () {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting () {
    const resetState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#pointEditComponent.shake(resetState);
  }

  #handleFormSubmitClick = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
