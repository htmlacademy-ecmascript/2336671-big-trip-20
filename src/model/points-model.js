import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};
export default class PointsModel extends Observable {

  #pointsApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init () {
    this.#uiBlocker.block();
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers;
      this.#destinations = destinations;
      this.#uiBlocker.unblock();

    } catch (err) {
      this._notify(UpdateType.ERROR, err);
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this.#uiBlocker.unblock();
      return;
    }
    this._notify(UpdateType.INIT);
  }

  async addPoint (updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [updatedPoint, ...this.#points];
      this._notify(updateType, update);

    } catch(err) {

      throw new Error('Can\'t add point');
    }
  }

  async deletePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);

    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  async updatePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const respose = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(respose);

      this.#points[index] = updatedPoint;
      this._notify(updateType, update);

    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  getCitiesNames = () => this.#destinations.map((destination) => destination.name);

  getEventsTypes = () => this.#offers.map((offer) => offer.type);

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

}
