import {API} from '../config';
import {Platform} from 'react-native';
import {exp} from 'react-native-reanimated';

// ------------------- User requests ------------------------------

export const loginSocialNetwork = ({email, service}) => {
  let postdata = {
    email,
    service,
  };

  let data = new FormData();
  Object.keys(postdata).forEach(key => {
    data.append(key, postdata[key]);
  });

  return fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
    },
    body: data,
  }).then(response => response.json());
};

export const login = ({email, password}) => {
  let postdata = {
    email,
    password,
  };

  let data = new FormData();
  Object.keys(postdata).forEach(key => {
    data.append(key, postdata[key]);
  });

  console.log(data);

  return fetch(`${API}/login`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/json',
    },
    body: data,
  }).then(response => response.json());
};

export const register = ({
  name,
  surname,
  photo,
  email,
  /* phone, */ password,
  provide_service,
}) => {
  let postData = {
    name,
    surname,
    email,
    /* phone, */
    password,
    provide_service,
  };

  let data = new FormData();
  if (photo) {
    if (typeof photo === 'string') {
      data.append('photo', photo);
    } else {
      data.append('image', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'android'
            ? photo.uri
            : photo.uri.replace('file://', ''),
      });
    }
  }

  Object.keys(postData).forEach(key => {
    if (postData[key]) {
      data.append(key, postData[key]);
    }
  });

  console.log(data);

  return fetch(`${API}/register`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  }).then(response => response.json());
};
