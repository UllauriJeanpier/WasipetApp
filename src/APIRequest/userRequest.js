import {API} from '../config';
import {Platform} from 'react-native';
import {exp} from 'react-native-reanimated';

// ------------------- User requests ------------------------------

export const updateUser = ({
  name,
  surname,
  photo,
  email,
  phone,
  dateBorn,
  DNI,
  token,
}) => {
  let postData = {
    name,
    surname,
    email,
    phone,
    dateBorn,
    DNI,
  };

  let data = new FormData();
  if (photo) {
    if (typeof photo === 'string') {
      data.append('photo', photo);
    } else {
      data.append('image', {
        name: Platform.OS === 'android' ? photo.fileName : photo.uri,
        type: photo.type,
        uri: photo.uri,
      });
    }
  }

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  console.log(data);
  return fetch(`${API}/user`, {
    method: 'PUT',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept':'application/json, text/plain, */*',  // It can be used to overcome cors errors
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  }).then(response => response.json());
};

export const getUserbytoken = ({token, id}) => {
  return fetch(`${API}/user/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const sendEmailPassword = ({email}) => {
  let data = new FormData();
  data.append('email', email);

  return fetch(`${API}/forgot_password`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const sendCodePassword = ({email, codigo}) => {
  let data = new FormData();
  data.append('codigo', codigo.trim());
  data.append('email', email.trim());
  console.log(data);

  return fetch(`${API}/verifypasswordcode`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const updatePassword = ({password, email}) => {
  let data = new FormData();
  data.append('password', password);
  data.append('email', email);

  return fetch(`${API}/modifyPassword`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      //Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const addFavorite = (product, brand, token, id, isFavorite) => {
  let postData = {
    productid: isFavorite ? product.productid : product._id,
    name: product.name,
    image: isFavorite ? product.image : product.type,
    brand: brand,
    petType: product.petType,
    description: product.description,
    weight: product.weight,
    pointsValue: product.pointsValue,
    pointsTrade: product.pointsTrade,
    category: product.category,
    type_description: product.type_description,
    type_detail_category: product.type_detail_category,
    type_detail_description: product.type_detail_description,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  return fetch(`${API}/favoritesadd/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const removeFavorite = (product, token, id, isFavorite) => {
  let postData = {
    productid: isFavorite ? product.productid : product._id,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });
  /* console.log(id);
  console.log(data); */

  return fetch(`${API}/favoritesremove/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const getFavoritesbyUser = (token, id) => {
  let postData = {id};
  let data = new FormData();
  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });
  return fetch(`${API}/favorites`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const changeNotificationSettings = (token, email, push, product) => {
  let postData = {
    email,
    push,
    product,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    data.append(key, postData[key]);
  });

  console.log(postData);

  return fetch(`${API}/notifications`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const addFcmToken = (token, fcmtoken) => {
  let postData = {
    fcmtoken,
  };

  let data = new FormData();

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  return fetch(`${API}/addfcmToken`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const getHistorial = token => {
  return fetch(`${API}/user/allhistorial`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const getFavoritesList = token => {
  return fetch(`${API}/user/allfavorites`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }).then(response => response.json());
};

export const addDeferred = (token, deferedcod) => {
  let data = new FormData();
  data.append('id', deferedcod);
  return fetch(`${API}/adddeferred`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};
