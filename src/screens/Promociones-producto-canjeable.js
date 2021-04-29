import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getAllProductsByBrandId} from '../APIRequest/productRequest';
import {
  getUserbytoken,
  addFavorite,
  removeFavorite,
} from '../APIRequest/userRequest';

export default class PromocionesProductoCanjeable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.route.params.brand,
      weight: this.props.route.params.weight,
      products: null,
      // user fields
      token: null,
      favorites: null,
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.updateFavorite = this.updateFavorite.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    const brand = this.state.brand._id;
    let products = await getAllProductsByBrandId(token, brand);
    let user = await getUserbytoken({token, id});
    products = products.filter(
      product =>
        product.onPromotion ==
        true /* && product.weight == this.state.weight */,
    );
    this.setState({
      products,
      token,
      favorites: user.favorites,
    });
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

  updateFavorite = async (product, favorite) => {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    if (favorite) {
      const res = await removeFavorite(product, this.state.brand.photo, token);
      console.log(res);
    } else {
      const res = await addFavorite(product, token);
      console.log(res);
    }

    let user = await getUserbytoken({token, id});
    this.setState({
      favorites: user.favorites,
    });;
  };

  _renderItem = ({item, index}) => {
    let favorite;
    const found = this.state.favorites.find(
      favorite => favorite.productId == item._id,
    );
    if  (found) {
      favorite = true;
    } else {
      favorite = false;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('DetalleProductoPromocion', {
            product: item,
            brand: this.state.brand,,
          })
}
        style={styles.Opcion}>
        <View style={styles.square} />
        <Text style={styles.opcionTxt}>Adulto</Text>
        <TouchableOpacity
          onPress={() => this.updateFavorite(item, favorite)}
          style={styles.litteSquare}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.txtTop}>PUNTOS</Text>
            <Text style={styles.txtTop2}>10000</Text>
          </View>
          <View style={styles.txtAreaTop}>
            <Text style={styles.txtMid}>Productos de 400 g canjeables </Text>
            <Text style={styles.txtMid2}>Advance 400 g</Text>
          </View>
          <View style={styles.Opciones}>
            {/* <TouchableOpacity style={styles.Opcion}>
              <View style={styles.square} />
              <Text style={styles.opcionTxt}>Adulto</Text>
              <View style={styles.litteSquare} />
            </TouchableOpacity> */}

            {this.state.products && (
              <FlatList
                //style={styles.Opciones}
                data={this.state.products}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
              />
            )}
          </View>
        </View>
      </>
    );
  }
}

const {width, height} = Dimensions.get('window');

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
    alignItems: 'center',
  },
  Opcion: {
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.12,
    width: width * 0.9,
    borderColor: '#A6ACAF',
    borderRadius: 20,
  },
  square: {
    backgroundColor: 'red',
    height: '100%',
    width: '30%',
  },
  litteSquare: {
    backgroundColor: 'red',
    height: '30%',
    width: '10%',
  },
  opcionTxt: {
    fontSize: 20,
  },
});
