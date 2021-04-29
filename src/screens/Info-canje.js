import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getProductById} from '../APIRequest/productRequest';
import {getBrandbyId} from '../APIRequest/brandRequest';
import {getQrCanjeById} from '../APIRequest/QRRequest';

export default class infoCanje extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canje: this.props.route.params.canje,
      product: null,
      brand: null,
      qr: null,
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.FormatDate = this.FormatDate.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');

    // request
    const product = await getProductById(token, this.state.canje.product);
    if (typeof product.msg === 'undefined') {
      this.setState({product});
    }
    const brand = await getBrandbyId(token, product.brand);
    if (brand) {
      this.setState({brand});
    }
    const qr = await getQrCanjeById(token, this.state.canje.code_trade);
    if (qr) {
      this.setState({qr});
    }

    console.log(this.state.product.type);
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

  FormatDate = date => {
    var date = new Date(date);
    let mount = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    if ((date.getMonth() + 1).toString().length == 1) {
      mount = `0${mount}`;
    }
    if (date.getDate().toString().length == 1) {
      day = `0${day}`;
    }
    var str = date.getFullYear() + '-' + mount + '-' + day;
    return str;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>INFORMACIÓN DE CANJE</Text>
        {this.state.brand && this.state.product && this.state.qr && (
          <View style={styles.VwMid}>
            <Text style={styles.txtMid}>Ha canjeado el producto:</Text>

            <Text style={styles.txtMid}>
              {`${this.state.brand.name} ${
                this.state.product.weight
              } por una cantidad de ${this.state.product.pointsTrade} pts`}
            </Text>

            <Text style={styles.txtMid}>
              Fecha: {/* {this.state.qr.createdAt} */}
            </Text>
            <Text style={styles.txtMid}>Cupones Optenidos: 1</Text>
            {/* <View style={styles.txtMid2}>
            <Text style={styles.txtMid}>Cupones Totales por producto: </Text>
            <Text style={styles.txtMid2}>12</Text>
          </View> */}
            <Image
              source={{uri: 'https://' + this.state.qr.image}}
              style={styles.square}
            />
            <Image
              source={{uri: 'https://' + this.state.product.type}}
              style={styles.square}
            />
            <Text
              style={{alignSelf: 'center', fontSize: 15, fontWeight: 'bold'}}>
              {this.state.qr._id}
            </Text>
          </View>
        )}
        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={styles.buttonText}>REGRESAR A CUPONES</Text>
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
});
