/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import {DATATOCANJE} from '../types';
/* import {API} from '../../config';
import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getUserbytoken, getHistorial} from '../../APIRequest/userRequest';
import {getCanjebyUserId} from '../../APIRequest/canjesRequest'; */
// FUNTIONS

export const setDataCanje = ({product, brand}) => {
  return async dispatch => {
    dispatch({type: DATATOCANJE, payload: {product, brand}});
  };
};
