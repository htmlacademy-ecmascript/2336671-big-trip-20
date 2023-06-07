import { FilterType } from '../const';
import Observable from '../framework/observable.js';

export default class FIlterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter () {
    return this.#filter;
  }

  setFilter (updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
