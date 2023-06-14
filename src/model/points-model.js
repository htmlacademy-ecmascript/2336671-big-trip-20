import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {

  #pointsApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

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
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers;
      this.#destinations = destinations;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

  async addPoint (updateType, update) {

    try {
      const respose = await this.#pointsApiService.addPoint(update);
      const updatedPoint = this.#adaptToClient(respose);

      this.#points = [updatedPoint, ...this.points];
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
      this.#points.splice(index, 1);

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

  getDestinationById = (id) => this.#destinations.find((destination) => destination.id === id);

  getOfferById = (id) => {
    let offerItem;
    this.#offers.forEach((offer) => {
      offer.offers.forEach((item) => {
        if (item.id === id) {
          offerItem = item;
        }
      });
    });
    return offerItem;
  };

  getCheckedOffers = (offers) => {
    const offersList = [];
    offers.forEach((id) => {
      offersList.push(this.getOfferById(id));
    });
    return offersList;
  };

  getAllOffersByType = (type) => {
    let offersByType = [];
    this.#offers.forEach((offer) => {
      if (offer.type === type) {
        offersByType = offer.offers;
      }
    });
    return offersByType;
  };

  getCitiesNames = () => this.#destinations.map((destination) => destination.name);

  getEventsTypes = () => this.#offers.map((offer) => offer.type);

}
