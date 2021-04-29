import {API} from '../config';
import Platform from 'react-native';
import {generateExchange} from './canjesRequest';

export const scanningQRProduct = (id, points, token) => {
  let postData = {
    points,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  return fetch(`${API}/qr/productScan/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: data,
  }).then(response => response.json());
};

export const scanningQRCanje = (id, token) => {
  return fetch(`${API}/qr/canje/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  }).then(response => response.json());
};

export const getQrCanjeById = (token, id) => {
  return fetch(`${API}/qr/canje/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const generateExchangeQR = (
  token,
  {points, store, product, fullname, type, image, brand},
) => {
  let postData = {
    points,
    store,
    product,
    fullname,
    type,
    image,
    brand,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  return fetch(`${API}/qrs/canje`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};
