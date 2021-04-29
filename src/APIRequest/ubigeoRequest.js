import {API} from '../config';
import {Platform} from 'react-native';

export const getByUbigeoId = id => {
  return fetch(`${API}/ubigeo/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getDepartments = () => {
  return fetch(`${API}/departament/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getProvinciasByDepartment = departament => {
  return fetch(`${API}/filterdepartment/${departament}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getDistrictsbyProvincia = provincia => {
  return fetch(`${API}/filterprovincia/${provincia}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getDistritsData = (department, provincia) => {
  let postData = {
    department,
    provincia,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    data.append(key, postData[key]);
  });

  return fetch(`${API}/filterdistrito`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const getDataSkynet = ubigeo => {
  let postData = {
    token: '62f73e69-e0cd75ff-cedffa3e-b60923c5',
    operacion: 'consultaCliente',
    numero_documento: '',
    nombre_razon: '',
    nombre_comercial: '',
    distrito_ubigeo: ubigeo,
  };

  /* let data = new FormData();

  Object.keys(postData).forEach(key => {
    data.append(key, postData[key]);
  }); */

  return fetch('https://ws.gestionx.com/Ecommerce/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(postData),
  }).then(response => response.json());
};

export const getClientBySkynet = doc => {
  let postData = {
    token: '62f73e69-e0cd75ff-cedffa3e-b60923c5',
    operacion: 'consultaCliente',
    numero_documento: doc,
    nombre_razon: '',
    nombre_comercial: '',
    distrito_ubigeo: '',
  };

  /* let data = new FormData();

  Object.keys(postData).forEach(key => {
    data.append(key, postData[key]);
  }); */

  return fetch('https://ws.gestionx.com/Ecommerce/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(postData),
  }).then(response => response.json());
};

export const getDataBynombreComercial = doc => {
  let postData = {
    token: '62f73e69-e0cd75ff-cedffa3e-b60923c5',
    operacion: 'consultaCliente',
    numero_documento: '',
    nombre_razon: '',
    nombre_comercial: doc,
    distrito_ubigeo: '',
  };

  /* let data = new FormData();

  Object.keys(postData).forEach(key => {
    data.append(key, postData[key]);
  }); */

  return fetch('https://ws.gestionx.com/Ecommerce/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(postData),
  }).then(response => response.json());
};
