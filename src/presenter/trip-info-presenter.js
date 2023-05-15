import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../View/trip-info-view.js';

export default class TripInfoPresenter {

  constructor({eventContainer, pointsModel}) {
    this.eventContainer = eventContainer;
    this.pointsModel = pointsModel;
  }

  init () {
    this.eventPoints = [...this.pointsModel.getPoints()];

    render(new TripInfoView({points: this.eventPoints}), this.eventContainer, RenderPosition.AFTERBEGIN);

  }
}
