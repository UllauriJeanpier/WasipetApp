import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default class infoCanje extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>INFORMACIÓN DE CANJE</Text>
        <View style={styles.VwMid}>
          <Text style={styles.txtMid}>Ha canjeado el producto:</Text>
          <Text style={styles.txtMid}>
            KITTEN ADVANCE 400g para su mascota
          </Text>
          <Text style={styles.txtMid}>Fecha: 10/01/2020</Text>
          <Text style={styles.txtMid}>Lugar de Canje: Miraflores</Text>
          <View style={styles.square}>
            <Image source={require('../assets/images/logo.png')} style={styles.img} />
          </View>
          <Text style={styles.square}></Text>
          <Text style={{alignSelf: 'center', fontSize: 15, fontWeight: 'bold'}}>
            t1e2a3m4o4
          </Text>
        </View>
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText}>REGRESAR A HISTORIAL</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    marginVertical: 15,
    fontWeight: 'bold',
    color: '#1A5276',
  },
  VwMid: {
    marginVertical: 15,
  },
  txtMid: {
    fontSize: 16,
    maxWidth: '90%',
  },
  VwMid2: {
    margin: 15,
    flexDirection: 'row',
  },
  txtMid2: {
    fontSize: 16,
    maxWidth: '90%',
    color: 'red',
  },
  square: {
    backgroundColor: '#1B4F72',
    width: 90,
    height: 90,
    alignSelf: 'center',
    margin: 10,
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  img: {
      resizeMode: 'center',
  },
});
