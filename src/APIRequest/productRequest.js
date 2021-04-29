import {API, TOKEN_SKY_NET, URL_SKY_NET} from '../config';
import {Platform} from 'react-native';

export const getAllProducts = token => {
  return fetch(`${API}/products`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getProductsbyPage = (token, page) => {
  return fetch(`${API}/products/pag/${page}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getProductsbyPoints = (token, points) => {
  return fetch(`${API}/product/points/${points}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getProductById = (token, id) => {
  return fetch(`${API}/product/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getProductsByCategory = (token, brand) => {
  return fetch(`${API}/product/brand/${brand}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getFilterProducts = (token, page, arrayFilter) => {
  console.log(JSON.stringify(arrayFilter));
  return fetch(`${API}/product/filter/${page}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(arrayFilter),
  }).then(response => response.json());
};

export const getProductsByFavorites = (token, favorites) => {
  let postdata = {
    favorites,
  };
  return fetch(`${API}/productsbyFavoriteArray`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(postdata),
  }).then(response => response.json());
};
export const getOutstadingProducts = token => {
  return fetch(`${API}/productoutstanding`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getStoreByRUC = ruc => {
  let postdata = {
    token: TOKEN_SKY_NET,
    operacion: 'consultaCliente',
    numeroDocumento: ruc,
    nombre_razon: '',
    nombre_comercial: '',
    distrito_ubigeo: '',
  };
  return fetch(`${URL_SKY_NET}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postdata),
  }).then(response => response.json());
};

export const getStoresByUbigeo = ubigeo => {
  let postdata = {
    token: TOKEN_SKY_NET,
    operacion: 'consultaCliente',
    numeroDocumento: '',
    nombre_razon: '',
    nombre_comercial: '',
    distrito_ubigeo: ubigeo,
  };
  return fetch(`${URL_SKY_NET}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postdata),
  }).then(response => response.json());
};
