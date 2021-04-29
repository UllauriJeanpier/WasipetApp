import {DATATOCANJE} from '../types';

const initialState = {
  brand: null,
  product: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DATATOCANJE:
      return {
        ...state,
        brand: action.payload.brand,
        product: action.payload.product,
      };
    default:
      return state;
  }
};
