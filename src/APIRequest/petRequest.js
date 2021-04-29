import {API} from '../config';
import {Platform} from 'react-native';

// ------------------- Pet requests ------------------------------

export const getPetbyOwnew = token => {
  return fetch(`${API}/pet`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};

export const getAllByOwner = (token, owner) => {
  return fetch(`${API}/pet/${owner}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};

export const addPet = ({name, photo, owner, breed, token}) => {
  let postData = {
    name,
    breed,
  };

  console.log(token);

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
    data.append(key, postData[key]);
  });

  return fetch(`${API}/pet`, {
    method: 'POST',
    headers: {
      /* 'Content-Type': 'multipart/form-data', */
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  })
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};

export const addAditionalPet = (
  {
    name,
    breed,
    BornDate,
    gender,
    allergies,
    disability,
    description,
    photo,
    token,
    typePet,
  },
  id,
) => {
  let postData = {
    name,
    breed,
    BornDate,
    allergies,
    disability,
    description,
    gender,
    typePet,
  };

  let data = new FormData();
  console.log(photo);
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
    data.append(key, postData[key]);
  });

  return fetch(`${API}/pet/${id}`, {
    method: 'POST',
    headers: {
      /* 'Content-Type': 'multipart/form-data', */
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  })
    .then(response => response.json())
    .catch(err => {
      console.log(err);
    });
};

export const updatePet = ({
  name,
  breed,
  BornDate,
  gender,
  allergies,
  disability,
  description,
  photo,
  typePet,
  token,
}) => {
  let postData = {
    name,
    breed,
    BornDate,
    allergies,
    disability,
    description,
    gender,
    typePet,
  };

  let data = new FormData();
  console.log(photo);
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

  return fetch(`${API}/pet`, {
    method: 'PUT',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const updatePetById = ({
  name,
  breed,
  BornDate,
  gender,
  allergies,
  disability,
  description,
  photo,
  token,
  typePet,
  id,
}) => {
  let postData = {
    name,
    breed,
    BornDate,
    allergies,
    disability,
    description,
    gender,
    typePet,
  };

  let data = new FormData();
  console.log(postData);
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

  return fetch(`${API}/pet/${id}`, {
    method: 'PUT',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: data,
  }).then(response => response.json());
};

export const deleteById = (token, id) => {
  return fetch(`${API}/pet/${id}`, {
    method: 'DELETE',
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};
