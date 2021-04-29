import {API} from '../config';
import {Platform} from 'react-native';

// ------------------- Breed requests ------------------------------

export const getAllHelps = token => {
  return fetch(`${API}/helps`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getMessage = token => {
  return fetch(`${API}/mensaje`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getBannersWasipet = token => {
  return fetch(`${API}/bannersWasi`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};
