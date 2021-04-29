import {API} from '../config';
import {Platform} from 'react-native';

export const getCanjebyUserId = ({token, id}) => {
  return fetch(`${API}/canje/user/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getCanjebyQRId = ({token, id}) => {
  return fetch(`${API}/canje/qr/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const generateExchange = (
  token,
  {code_trade, store, product, fullname, points},
) => {
  let postData = {
    code_trade,
    store,
    product,
    fullname,
    points,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  return fetch(`${API}/canje`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};
