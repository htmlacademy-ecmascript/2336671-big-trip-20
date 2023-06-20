import EventsPresenter from './presenter/events-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FilterModel from './model/filters-model.js';
import { nanoid } from 'nanoid';
import PointsApiService from './points-api-service.js';

const auth = nanoid();
const AUTHORIZATION = `Basic ${auth}`;
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter({eventContainer: tripMainElement, pointsModel});
const eventsPresenter = new EventsPresenter({newEventButtonContainer: newEventButtonElement, eventContainer: tripEventsElement, pointsModel, filterModel});
const filtersPresenter = new FiltersPresenter({eventContainer: filtersElement, pointsModel, filterModel});

pointsModel.init();
tripInfoPresenter.init();
filtersPresenter.init();
eventsPresenter.init();
