import { remove } from '../framework/render.js';
import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
export default class TripInfoPresenter {

  #eventContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init () {
    const points = this.#pointsModel.points;

    if (!points.length) {
      return;
    }

    points.sort((a, b) => a.dateFrom - b.dateFrom);
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;

    this.#tripInfoComponent = new TripInfoView({points, destinations, offers});
    render(this.#tripInfoComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    remove(this.#tripInfoComponent);
    this.init();
  };
}
