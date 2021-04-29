import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getUserbytoken,
  addFavorite,
  removeFavorite,
} from '../APIRequest/userRequest';
import {connect} from 'react-redux';
import {setDataCanje} from '../redux/actions/canjeActions';
import {
  updateFavoritesList,
  updateFavorites,
} from '../redux/actions/userActions';
import Favorito from '../assets/svg/favorito';
import FavoritoFill from '../assets/svg/favorito-fill';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';

class Producto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.product,
      brand: this.props.brand,
      navigation: this.props.navigation,
      favorite: this.props.favorite,
      type: this.props.type,
      favoritesList: this.props.favoritesList,
      raiz: '',
    };
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
    this.updateFavorite = this.updateFavorite.bind(this);
  }

  reduceCharacters = cadena => {
    if (cadena.length > 30) {
      return `${cadena.slice(0, 30)}...`;
    } else {
      return cadena;
    }
  };

  updateFavorite = async (product, favorite) => {
    const {brand, type} = this.state;
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    const isFavorite = type === 'favorito' ? true : false;
    try {
      if (favorite) {
        const res = await removeFavorite(product, token, id, isFavorite);
        //console.log(res);
        if (res.msg === 'ok') {
          favorite = false;
          this.props.updateFavoritesList(token, id);
          // this.props.updateFavorites(token, this.props.favorites.favoritesList);
        }
      } else {
        const res = await addFavorite(
          product,
          brand.name,
          token,
          id,
          isFavorite,
        );
        if (res.msg === 'ok') {
          favorite = true;
          this.props.updateFavoritesList(token, id);
        }
      }
      this.setState({
        favorite,
      });
    } catch (err) {
      console.log(
        'error al acualizar el estado de favorito del producto: ',
        product.name,
      );
    }
  };

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

  getBackgroundBrand(name) {
    let color = {};
    if (name === PRODUCTS_BY_BRAND.ADVANCE) {
      color = COLORS_BY_BRAND.ADVANCE;
    } else if (name === PRODUCTS_BY_BRAND.GRAN_PLUS) {
      color = COLORS_BY_BRAND.GRAN_PLUS;
    } else if (name === PRODUCTS_BY_BRAND.LIVELONG) {
      color = COLORS_BY_BRAND.LIVELONG;
    } else if (name === PRODUCTS_BY_BRAND.PROGRATO) {
      color = COLORS_BY_BRAND.PROGRATO;
    } else if (name === PRODUCTS_BY_BRAND.KUMAR) {
      color = COLORS_BY_BRAND.KUMAR;
    } else if (name === PRODUCTS_BY_BRAND.BOEHRINGER) {
      color = COLORS_BY_BRAND.BOEHRINGER;
    } else if (name === PRODUCTS_BY_BRAND.ZOETIS) {
      color = COLORS_BY_BRAND.ZOETIS;
    } else if (name === PRODUCTS_BY_BRAND.BAYER) {
      color = COLORS_BY_BRAND.BAYER;
    } else if (name === PRODUCTS_BY_BRAND.MIRA_PET) {
      color = COLORS_BY_BRAND.MIRA_PET;
    } else if (name === PRODUCTS_BY_BRAND.ROYAL_PET) {
      color = COLORS_BY_BRAND.ROYAL_PET;
    }
    return color;
  }
  render() {
    const {product, brand, navigation, favorite, type} = this.state;
    const {activedCanjes} = this.props;
    const {points} = this.props.favorites;
    return (
      <View style={styles.ProductContainer}>
        <View style={styles.ProductTopContainer}>
          <View style={styles.headerProduct}>
            <View style={styles.imgbrandcontainer}>
              <Image source={{uri: brand.photo}} style={styles.brandimg} />
            </View>
            <View style={styles.titleProductContainer}>
              <Text style={styles.nombreProduct}>
                {this.reduceCharacters(product.name)}
              </Text>
              <Text style={styles.categoriaProducto}>
                {product.category === 'Alimentos'
                  ? `${product.category} ${product.type_detail_category}`
                  : `${product.category}`}
              </Text>
            </View>
          </View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flex: 0.7,
              backgroundColor: this.getBackgroundBrand(product.brand),
              height: '100%',
              width: '100%',
              padding: width * 0.01,
              borderRadius: width * 0.05,
            }}>
            <View style={styles.backgroundContainer}>
              <Image
                source={{
                  uri:
                    'https://wasipetapp.com/api/public/' +
                    (type === 'producto' ? product.type : product.image),
                }}
                resizeMode="stretch"
                style={styles.backdrop}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.updateFavorite(product, favorite)}
              style={styles.overlay}>
              {favorite ? (
                <FavoritoFill width={25} height={25} />
              ) : (
                <Favorito width={25} height={25} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonProductContainer}>
          <TouchableOpacity
            style={
              activedCanjes
                ? points < product.pointsTrade
                  ? styles.unableCanjeButton
                  : styles.canjeButton
                : styles.unableCanjeButton
            }
            disabled={!activedCanjes || points < product.pointsTrade}
            // style={styles.unableCanjeButton}
            onPress={() => {
              //console.log(product.name);
              // if (points > product.pointsTrade) {
              this.props.setDataCanje({product, brand});
              navigation.navigate('Stores', {
                product: product,
                brand: brand,
                points: points,
              });
              /*   } else {
                Alert.alert(
                  'Puntos insuficientes',
                  'No cuentas con los puntos suficientes para canjear este producto',
                  [{text: 'Cerrar'}],
                  {cancelable: true},
                );
              } */
            }}>
            <Text
              style={
                activedCanjes
                  ? points < product.pointsTrade
                    ? styles.textUnableButton
                    : styles.textButton
                  : styles.textUnableButton
              }>
              Canjear por {product.pointsTrade} puntos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    canje: state.canjeUpdate, // session.token , session.user
    favorites: state.userUpdates, // user data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDataCanje: data => {
      return dispatch(setDataCanje(data));
    },
    updateFavorites: (token, favorites) => {
      return dispatch(updateFavorites(token, favorites));
    },
    updateFavoritesList: (token, id) => {
      return dispatch(updateFavoritesList(token, id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Producto);

const dim = Dimensions.get('screen');
const width =
  dim.height >= dim.width
    ? Dimensions.get('window').width
    : Dimensions.get('window').height;
const height =
  dim.height >= dim.width
    ? Dimensions.get('window').height
    : Dimensions.get('window').width;

const styles = StyleSheet.create({
  //  Product individual styles

  ProductContainer: {
    flex: 1 / 2,
    margin: 5,
    backgroundColor: 'transparent',
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ProductTopContainer: {
    borderRadius: 25,
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: height * 0.35,
  },
  headerProduct: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },

  imgbrandcontainer: {
    flex: 0.25,
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 5,
    height: 40,
    width: 40,
    borderRadius: 10,
    //backgroundColor: 'white'
  },
  brandimg: {
    width: 40,
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  titleProductContainer: {
    flex: 0.75,
    //backgroundColor: 'black',
  },
  nombreProduct: {
    fontSize: width * 0.036,
    fontFamily: 'ProximaNova-Bold',
    color: '#122E5C',
  },
  categoriaProducto: {
    fontSize: width * 0.034,
    color: '#B3B3B3',
    fontFamily: 'ProximaNova-Regular',
  },

  bodyProduct: {
    flex: 0.7,
    //backgroundColor: 'blue',
    height: '100%',
    width: '100%',
    padding: width * 0.01,
    borderRadius: width * 0.05,
  },

  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },

  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: 'white',
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: '70%',
    resizeMode: 'cover',
  },

  buttonProductContainer: {
    flex: 0.2,
    //backgroundColor: 'green',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canjeButton: {
    flex: 0.5,
    width: '100%',
    borderRadius: width * 0.1,
    borderWidth: 1,
    borderColor: '#122E5C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 13,
  },
  unableCanjeButton: {
    flex: 0.5,
    width: '100%',
    borderRadius: width * 0.1,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F2F2F2',
    marginTop: 13,
  },
  textButton: {
    textAlign: 'center',
    color: '#122E5C',
    fontSize: width * 0.03,
    fontFamily: 'ProximaNova-Bold',
  },
  textUnableButton: {
    textAlign: 'center',
    color: '#B3B3B3',
    fontSize: width * 0.03,
    fontFamily: 'ProximaNova-Bold',
  },
});
