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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getAllProducts,
  getProductsbyPage,
  getFilterProducts,
} from '../APIRequest/productRequest';
import {connect} from 'react-redux';
import {
  updateFavoritesList,
  updateFavorites,
} from '../redux/actions/userActions';
import Producto from '../components/ProductComponent';
import {getAllBrands} from '../APIRequest/brandRequest';
import FiltroBlue from '../assets/svg/filtro-blue';
import InfoLogo from '../assets/svg/info';
import CustomHeader from '../components/header';
import {getMessage} from '../APIRequest/helpRquest';

class Canjes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      brands: null,
      favoritesList: [],
      arrayfilter:
        typeof this.props.route.params !== 'undefined'
          ? this.props.route.params.arrayfilter
          : null,
      //
      token: null,
      page: 1,
      limitItem: 10,
      limit: false,
      activedMessage: false,
      message: '',
      activedCanjes: true,
      onEndReachedCalledDuringMomentum: true,
    };
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    this.setState({token});
    this.props.updateFavoritesList(token, id);
    try {
      const products = this.state.arrayfilter
        ? await getFilterProducts(
            token,
            this.state.page,
            this.state.arrayfilter,
          )
        : await getProductsbyPage(token, this.state.page);
      this.setState({page: this.state.page + 1});
      const brands = await getAllBrands(token);
      this.setState({products, brands});

      const messageResponse = this.props.favorites.message;
      // const messageResponse = await getMessage(token);
      if (messageResponse.status) {
        this.setState({
          activedMessage: messageResponse.data.actived || false,
          message: messageResponse.data.title || '',
          activedCanjes: messageResponse.data.canjesActived,
        });
      }
    } catch (err) {
      console.log(err);
      alert(
        'Error de red, verifique que su equipo este conectado a internet, o intentenlo mas tarde',
      );
    }
    //console.log(this.state.products);
  }

  makeRemoteRequest = async () => {
    if (!this.state.limit) {
      const {page, token, arrayfilter} = this.state;
      try {
        const productos = arrayfilter
          ? await getFilterProducts(
              token,
              this.state.page,
              this.state.arrayfilter,
            )
          : await getProductsbyPage(token, page);
        if (productos.length < 10) {
          this.setState({limit: true});
        }
        this.setState({
          page: this.state.page + 1,
          limitItem: this.state.limitItem + 10,
          products: [...this.state.products, ...productos],
        });
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(
          'Error de red, verifique que su equipo este conectado a internet, o intentenlo mas tarde',
        );
      }
    }
  };

  getBrand = name => {
    const {brands} = this.state;
    return brands.find(e => e.name === name);
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

  renderProducts = () => {
    if (this.state.products) {
      if (this.state.products.length !== 0) {
        return (
          <View style={styles.ProductsContainer}>
            <FlatList
              style={styles.Products}
              data={this.state.products}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              onMomentumScrollBegin={() => {
                this.setState({
                  onEndReachedCalledDuringMomentum: false,
                });
              }}
              /*onEndReached={({distanceFromEnd}) => {
                console.log('distanceFromEnd', distanceFromEnd);
                console.log('this.state.limitItem', this.state.limitItem);
                if (distanceFromEnd < 0) {
                  this.makeRemoteRequest();
                  return;
                }
              }}*/
              onEndReached={async () => {
                if (!this.onEndReachedCalledDuringMomentum) {
                  await this.makeRemoteRequest(); // LOAD MORE DATA
                  await this.setState({
                    onEndReachedCalledDuringMomentum: true,
                    limitItem: this.state.page * 20,
                  });
                }
              }}
              onEndReachedThreshold={0.5}
              initialNumToRender={this.state.limitItem}
            />
          </View>
        );
      } else {
        <View style={styles.withoutFavorites}>
          <Text>No hay productos para este filtro</Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: height * 0.7,
          }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      );
    }
  };

  _renderItem = ({item, index}) => {
    let {favoritesList} = this.props.favorites;
    //console.log(favoritesList);
    let favorite = favoritesList.includes(item._id);
    if (this.state.brands) {
      const brand = this.getBrand(item.brand);
      return (
        <Producto
          product={item}
          brand={brand}
          type={'producto'}
          navigation={this.props.navigation}
          favorite={favorite ? true : false}
          favoritesList={favoritesList}
          activedCanjes={this.state.activedCanjes}
        />
      );
    }
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <CustomHeader
            title={'Canjes'}
            navigation={this.props.navigation}
            isHome={false}
          />
          {this.state.activedMessage ? (
            <View style={styles.headerTextContainer}>
              <View style={styles.messageContainer}>
                <InfoLogo style={styles.infoLogo} />
                <Text style={styles.textMessage}>{this.state.message}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.headerContainer}>
            <View style={styles.titleProducto}>
              <Text style={styles.titleProductoText}>Listado de productos</Text>
            </View>
            <View style={{flex: 0.2}} />
            <TouchableOpacity
              style={styles.bottonIcon}
              onPress={() => this.props.navigation.navigate('Canjesfiltros')}>
              <FiltroBlue
                //source={{uri: 'https://'+canje.type}}
                style={styles.img}
              />
            </TouchableOpacity>
          </View>
          {this.renderProducts()}
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    favorites: state.userUpdates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateFavorites: (token, id) => {
      return dispatch(updateFavorites(token, id));
    },
    updateFavoritesList: (token, id) => {
      return dispatch(updateFavoritesList(token, id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canjes);

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
  container: {
    flex: 6,
    alignItems: 'center',
    //marginHorizontal: '5%',
    //marginTop: height * 0.01,
    backgroundColor: '#122E5C',
  },
  headerContainer: {
    //flex: 1,
    //height: height * 0.07,
    flexDirection: 'row',
    width: '100%',
    //paddingHorizontal: '5%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  bottonIcon: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    borderColor: '#B3B3B3',
    borderWidth: 1,
    borderRadius: 100,
    padding: 7,
  },
  titleProducto: {
    flex: 0.8,
  },
  titleProductoText: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: 20,
  },

  // Producto

  ProductsContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: height * 0.6,
    flex: 1,
  },

  Products: {
    flex: 1,
    //backgroundColor: 'yellow',
    width: '100%',
    height: height * 0.6,
  },

  //  Product individual styles

  ProductContainer: {
    flex: 1 / 2,
    margin: 5,
    //backgroundColor: '#ddd',
    height: height * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerProduct: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },

  img: {
    width: height * 0.04,
    height: height * 0.04,
    resizeMode: 'stretch',
  },
  infoLogo: {
    width: height * 0.04,
    height: height * 0.04,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginBottom: 10,
  },
  imgbrandcontainer: {
    flex: 0.25,
    borderRadius: width * 0.01,
    //backgroundColor: 'white'
  },
  brandimg: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  titleProductContainer: {
    flex: 0.75,
    //backgroundColor: 'black',
  },
  nombreProduct: {
    fontSize: width * 0.034,
  },
  categoriaProducto: {
    fontSize: width * 0.034,
  },

  bodyProduct: {
    flex: 0.7,
    backgroundColor: 'blue',
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
  headerTextContainer: {
    //flex: 1,
    //height: height * 0.07,
    flexDirection: 'row',
    width: '100%',
    //paddingHorizontal: '5%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  messageContainer: {
    backgroundColor: '#122E5C',
    padding: 30,
    borderRadius: 25,
  },
  textMessage: {
    color: 'white',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.06,
    textAlign: 'center',
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
    borderWidth: width * 0.002,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textButton: {
    textAlign: 'center',
    color: 'blue',
    fontSize: width * 0.03,
  },

  //------------------------------------
});
