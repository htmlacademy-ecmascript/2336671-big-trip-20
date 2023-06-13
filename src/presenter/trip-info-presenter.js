import { remove } from '../framework/render.js';
import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
export default class TripInfoPresenter {

  #eventContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  #eventPoints = [];

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init () {
    if (!this.#pointsModel.points.length) {
      return;
    }
    this.#tripInfoComponent = new TripInfoView({pointsModel: this.#pointsModel});
    render(this.#tripInfoComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    remove(this.#tripInfoComponent);
    this.init();
  };
}
