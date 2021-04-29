/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import {
  UPDATEPOINTS,
  UPDATEFAVORITES,
  UPDATEFAVORITESLIST,
  UPDATEHISTORIAL,
  UPDATECANJES,
  UPDATEUSER,
  UPDATEPET,
  DEAUTHENTICATE,
  UPDATEBREEDS,
  DATAMESSAGE,
} from '../types';
import {API} from '../../config';
import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getUserbytoken,
  getHistorial,
  getFavoritesList,
  getFavorites,
  getFavoritesbyUser,
} from '../../APIRequest/userRequest';
import {getProductsByFavorites} from '../../APIRequest/productRequest';
import {getCanjebyUserId} from '../../APIRequest/canjesRequest';
import {getPetbyOwnew, getAllByOwner} from '../../APIRequest/petRequest';
import {getMessage} from '../../APIRequest/helpRquest';
// FUNTIONS

export const updatepoints = ({token, id}) => {
  return async dispatch => {
    try {
      const response = await getUserbytoken({token, id});
      if (typeof response._id !== 'undefined') {
        dispatch({type: UPDATEPOINTS, payload: response.points});
      }
    } catch (err) {
      Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
      console.log('Update points error', err);
    }
  };
};

export const updateCanjes = ({token, id}) => {
  return async dispatch => {
    try {
      const canjes = await getCanjebyUserId({token, id});
      dispatch({type: UPDATECANJES, payload: canjes});
    } catch (err) {
      Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
      console.log('Error al actualizar canjes', err);
    }
  };
};

export const updateHistorial = token => {
  return async dispatch => {
    try {
      const historial = await getHistorial(token);
      dispatch({type: UPDATEHISTORIAL, payload: historial});
    } catch (err) {
      Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
      console.log('Error al actualizar historial', err);
    }
  };
};

export const updateFavoritesList = (token, id) => {
  return async dispatch => {
    try {
      const favorites = await getFavoritesList(token);
      dispatch({type: UPDATEFAVORITESLIST, payload: favorites});
      const products = await getFavoritesbyUser(token, id);
      //console.log(products);
      if (!products.msg) {
        dispatch({type: UPDATEFAVORITES, payload: products});
      }
    } catch (err) {
      /* Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      ); */
      console.log('Error al actualizar lista de favoritos', err);
    }
  };
};

export const updateFavorites = (token, id) => {
  return async dispatch => {
    try {
      //const products = await getProductsByFavorites(token, favorites);
      const products = await getFavoritesbyUser(token, id);
      dispatch({type: UPDATEFAVORITES, payload: products});
    } catch (err) {
      /* Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      ); */
      console.log('Error al actualizar favoritos', err);
    }
  };
};

export const updateUser = (token, id) => {
  return async dispatch => {
    try {
      const user = await getUserbytoken({token, id});
      if (typeof user._id !== 'undefined') {
        dispatch({type: UPDATEUSER, payload: user});
      } else {
        console.log('error al consultar usuario por API');
      }
    } catch (err) {
      console.log('Error al actualizar usuario', err);
    }
  };
};

export const updateMessage = token => {
  return async dispatch => {
    try {
      const messageResponse = await getMessage(token);
      dispatch({type: DATAMESSAGE, payload: messageResponse});
    } catch (err) {
      console.log('Error al traer el mensaje');
    }
  };
};

/* export const refreshPet = (token) => {
  return async dispatch => {
    try {
      const pet = await getAllByOwner(token);
      if (pet.msg == null) {
        dispatch({type: UPDATEPET, payload: pet});
      } else {
        console.log('Error al traer mascota actualizada ');
      }
    } catch (err) {
      console.log('Error al traer mascota actualizada ');
    }
  };
}; */

export const refreshPet = (token, id) => {
  return async dispatch => {
    try {
      const pet = await getAllByOwner(token, id);
      /* const photos = pet.map(p => p.photo);
      const names = pet.map(p => p.name); */
      if (pet.length !== 0) {
        dispatch({type: UPDATEPET, payload: pet});
      } else {
        console.log('Error al traer mascota actualizada ');
      }
    } catch (err) {
      console.log('Error al traer mascota actualizada ');
    }
  };
};

export const refreshBreeds = type => {
  return async dispatch => {
    try {
      const breedsState = await fetch(`${API}/breeds/${type}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then(response => response.json());

      // Multirazas al inicio
      let multiraza = breedsState.pop();
      breedsState.unshift(multiraza);

      dispatch({
        type: UPDATEBREEDS,
        payload: breedsState.map(
          breed => (breed = {...breed, label: breed.name, value: breed.name}),
        ),
      });
    } catch (err) {
      console.log('Error al traer las breeds');
    }
  };
};

export const clearReduxStore = () => {
  return async dispatch => {
    try {
      dispatch({type: DEAUTHENTICATE});
    } catch (err) {
      console.log('Error al limpiar el redux');
    }
  };
};
