import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {generateExchangeQR} from '../APIRequest/QRRequest';
import {generateExchange} from '../APIRequest/canjesRequest';

export default class LugaresPromociones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.route.params.brand,
      product: this.props.route.params.product,
      store: 'Store_id1',
      qr: null,
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.exchangeProduct = this.exchangeProduct.bind(this);
  }

  componentDidUpdate() {
    if (this.state.qr) {
      this.props.navigation.navigate('CanjeoExito', {
        product: this.state.product,
        brand: this.state.brand,
        qr: this.state.qr,
      });
    }
  }

  getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return value;
      }
      return value;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  async exchangeProduct() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    const qrdata = {
      store: this.state.store,
      product: this.state.product._id,
      points: this.state.product.pointsTrade,
      fullname: `${this.state.product.name} ${this.state.product.name} ${
        this.state.product.weight
      }`,
    };
    const resqr = await generateExchangeQR(token, qrdata);
    if (typeof resqr._id !== 'undefined') {
      this.setState({
        qr: resqr,
      });
      console.log('Se genero correctamente');
    } else {
      alert('Hubo un problema al generar el canje');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.txtTop}>PUNTOS</Text>
          <Text style={styles.txtTop2}>10000</Text>
        </View>
        <View style={styles.txtMidArea}>
          <Text>Está por canjear el producto:</Text>
          <Text>
            {this.state.brand.name} {this.state.product.name}{' '}
            {this.state.product.weight} para su mascota
          </Text>
          <Text>
            para su mascota Por una cantidad de {this.state.product.pointsTrade}{' '}
            pts.
          </Text>
        </View>
        <Image
          style={styles.square}
          source={{uri: 'http://' + this.state.product.type}}
        />
        <Text style={styles.txtMidArea}>Lugares para canjear su producto</Text>
        <View style={styles.Opciones}>
          <TouchableOpacity style={styles.Opcion}>
            <Text style={styles.opcionTxt}>Adulto</Text>
            <View style={styles.littleSquare} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.exchangeProduct()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>GENERAR CANJE</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.txtFooter}>
          El tiempo estimado para recoger el producto es mínimo de 3 días
          hábiles
        </Text>
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
  txtMidArea: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  square: {
    width: 80,
    height: 50,
    backgroundColor: '#E67E22',
  },
  littleSquare: {
    backgroundColor: 'red',
    height: '30%',
    width: '10%',
  },
  Opciones: {
    flexDirection: 'column',
    width: '90%',
    height: '25%',
    marginTop: 20,
  },
  Opcion: {
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '20%',
    borderColor: '#A6ACAF',
    borderRadius: 20,
  },
  button: {
    marginBottom: 50,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center',
    backgroundColor: '#F7F9F9',
    borderRadius: 4,
    borderColor: 'red',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: '#27AE60',
  },
  txtFooter: {
    paddingHorizontal: 40,
  },
});
