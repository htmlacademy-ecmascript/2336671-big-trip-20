import { RenderPosition, remove, render } from '../framework/render.js';
import NewPointView from '../view/add-new-point-view.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPointPresenter {

  #pointsListContainer = null;

  #handleDataChange = null;
  #handlePointDestroy = null;

  #pointEditComponent = null;

  constructor ({pointsListContainer, onDataChange, onPointDestroy}) {
    this.#pointsListContainer = pointsListContainer;

    this.#handleDataChange = onDataChange;
    this.#handlePointDestroy = onPointDestroy;
  }

  init () {
    this.#pointEditComponent = new NewPointView ({
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

  #handleFormSubmitClick = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
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