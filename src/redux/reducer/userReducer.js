import {
  UPDATEPOINTS,
  UPDATEFAVORITES,
  UPDATEFAVORITESLIST,
  UPDATEHISTORIAL,
  UPDATECANJES,
  UPDATEUSER,
  UPDATEPET,
  DEAUTHENTICATE,
  UPDATEBREEDS,
  DATAMESSAGE,
} from '../types';

const initialState = {
  points: 0,
  favoritesList: [],
  favorites: null,
  historial: null,
  canjes: null,
  perfilphoto: null,
  pets: [],
  breeds: [],
  // userData

  push_notifications: false,
  email_notifications: false,
  product_notifications: false,

  fetching: false,
  fetched: false,
  error: null,

  message: {
    status: null,
    data: {
      title: null,
      actived: false,
      canjesActived: true,
      messagePopUp: null,
    },
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATEPOINTS:
      return {
        ...state,
        points: action.payload.points,
      };
    case UPDATEFAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };
    case UPDATEFAVORITESLIST:
      return {
        ...state,
        favoritesList: action.payload,
      };
    case UPDATEHISTORIAL:
      return {
        ...state,
        historial: action.payload,
      };
    case UPDATECANJES:
      return {
        ...state,
        canjes: action.payload,
      };
    case UPDATEUSER:
      return {
        ...state,
        push_notifications: action.payload.push_notifications,
        email_notifications: action.payload.email_notifications,
        product_notifications: action.payload.product_notifications,
        points: action.payload.points,
        perfilphoto: action.payload.photo,
      };
    case UPDATEPET:
      return {
        ...state,
        pets: action.payload,
      };

    case UPDATEBREEDS:
      return {
        ...state,
        breeds: action.payload,
      };

    case DATAMESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case DEAUTHENTICATE:
      return {
        ...state,
        points: 0,
        favoritesList: [],
        favorites: null,
        historial: null,
        canjes: null,
        perfilphoto: null,
        petphoto: [],
      };
    case 'Error':
      return {
        ...state,
      };
    default:
      return state;
  }
};
