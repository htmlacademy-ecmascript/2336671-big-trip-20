import Observable from '../framework/observable.js';
import { getPoint } from '../mocks/points';

const POINTS_COUNT = 5;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, getPoint);

  get points() {
    return this.#points;
  }
}
