import { API } from '../config';
import {Platform} from 'react-native';


export const getBrandbyId = (token, id) => {
    return fetch(`${API}/brand/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': (token ? `Bearer ${token}` : ''),
        }
    }).then(response => response.json())
}

export const getAllBrands = (token) => {
    return fetch(`${API}/brands`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': (token ? `Bearer ${token}` : ''),
        }
    }).then(response => response.json())
}