import {API} from '../config';
import {Platform} from 'react-native';

// ------------------- Breed requests ------------------------------

export const getBreedsCat = () => {
  return fetch(`${API}/breeds/Cat`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.json());
};

export const getBreedsDog = () => {
  return fetch(`${API}/breeds/Dog`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.json());
};

export const getBreedbyid = id => {
  return fetch(`${API}/breed/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.json());
};
