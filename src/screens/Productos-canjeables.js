import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

export default class productosCanjeables extends Component {
  render() {
    return (
      <>
        <View style={styles.titleProducto}>
          <Text style={styles.titleProductoText}>ADVANCED</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.txtTop}>PUNTOS</Text>
            <Text style={styles.txtTop2}>10000</Text>
          </View>
          <View style={styles.txtMidArea}>
            <Text style={styles.txtMid}>PRODUCTOS CANJEABLES CON TUS PTS.</Text>
          </View>
          <View style={styles.mgTop}>
            <Text style={styles.nombreProducto}>Advance</Text>
            <Text>
              Descripción de ADVANCE Lorem ipsum dolor sit amet, consectetuer
              adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
              laoreet dolore magna aliquam erat volutpat. 10000
            </Text>
          </View>
          <TouchableOpacity style={styles.containerProductos}>
            <View style={styles.square}>
              <Text style={styles.squareText}>800g</Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mgTop: {
    marginTop: 10,
  },
  titleProducto: {
    alignSelf: 'center',
    backgroundColor: '#154360',
  },
  titleProductoText: {
    color: 'white',
  },
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
  txtMidArea: {
    alignSelf: 'flex-start',
  },
  txtMid: {
    fontSize: 20,
  },
  nombreProducto: {
    color: '#E67E22',
    fontSize: 20,
    fontWeight: 'bold',
  },
  square: {
    margin: 10,
    width: '30%',
    height: '20%',
    backgroundColor: '#D35400',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 12,
  },
  squareText: {
    color: 'white',
    flex: 1,
    height: 100,
  },
  containerProductos: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
  },
});
