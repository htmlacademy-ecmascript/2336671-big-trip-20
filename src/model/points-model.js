import Observable from '../framework/observable.js';
import { getPoint } from '../mocks/points';

const POINTS_COUNT = 5;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, getPoint);

  get points() {
    return this.#points;
  }

  addPoint (updateType, update) {
    this.#points = [update, ...this.points];

    this._notify(updateType, update);
  }

  deletePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index > -1) {
      this.#points.splice(index, 1);
    }

    this._notify(updateType);
  }

  updatePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index > -1) {
      this.#points[index] = update;
    }

    this._notify(updateType, update);
  }

}
