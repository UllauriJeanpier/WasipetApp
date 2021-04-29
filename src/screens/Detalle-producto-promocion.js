import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

export default class DetalleProductoPromocion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.route.params.brand,
      product: this.props.route.params.product,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.product && this.state.brand && (
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <Text style={styles.txtTop}>PUNTOS</Text>
              <Text style={styles.txtTop2}>10000</Text>
            </View>
            <View style={styles.nameProductoSpace}>
              <Text style={styles.titleMid}>
                {this.state.brand.name} {this.state.product.weight}
              </Text>
            </View>
            <View style={styles.containerMid}>
              <Image
                style={styles.square}
                source={{uri: 'https://' + this.state.product.type}}
              />
              <Text style={styles.txtMid}>
                {this.state.product.description}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('LugaresPromociones', {
                  product: this.state.product,
                  brand: this.state.brand,
                })
              }>
              <View style={styles.button}>
                <Text style={styles.buttonText}>CANJEAR POR 13 pts. </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  nameProductoSpace: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  titleMid: {
    color: '#E67E22',
  },
  square: {
    width: 100,
    height: 80,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  containerMid: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  txtMid: {
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#F8F9F9',
    borderColor: '#909497',
    borderWidth: 2,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: '#17202A',
  },
});
