import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

export default class CatalogoProductoPuntos extends Component {
  render() {
    return (  
      <>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.txtTop}>PUNTOS</Text>
            <Text style={styles.txtTop2}>10000</Text>
          </View>
          <View style={styles.txtAreaTop}>
            <Text style={styles.txtMid2}>Advance 400 g</Text>
            <Text style={styles.txtMid2}>/</Text>
            <Text style={styles.txtMid2}>Pts 1</Text>
          </View>
          <View style={styles.Opciones}>
            <TouchableOpacity style={styles.Opcion}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.img}
              />
              <Text style={styles.opcionTxt}>Adulto</Text>
              <View style={styles.litteSquare} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  txtTop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtTop2: {
    backgroundColor: '#D35400',
    color: 'white',
    fontSize: 21,
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  txtAreaTop: {
    marginTop: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  txtMid: {
    fontSize: 15,
  },
  txtMid2: {
    fontSize: 15,
    color: '#D35400',
    fontWeight: 'bold',
  },
  Opciones: {
    flexDirection: 'column',
    width: '100%',
    height: '50%',
    marginTop: 20,
  },
  Opcion: {
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '30%',
    borderColor: '#A6ACAF',
    borderRadius: 20,
  },
  litteSquare: {
    backgroundColor: 'red',
    height: '30%',
    width: '10%',
  },
  opcionTxt: {
    fontSize: 20,
  },
  img: {
    resizeMode: 'contain',
  },
});
