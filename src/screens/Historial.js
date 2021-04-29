import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getHistorialwithPage} from '../APIRequest/userRequest';
import {connect} from 'react-redux';
import {updateHistorial} from '../redux/actions/userActions';
import CustomHeader from '../components/header';
import ProductoCanjeado from '../assets/svg/producto-canjeado-red';
import ProductoEscaneado from '../assets/svg/producto-escaneado';
import AmigoReferido from '../assets/svg/historial-referidos';
import ProductoIcon from '../assets/svg/producto-icon';
import Favoritebroken from '../assets/svg/favorito-broken';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';
class Historial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historial: null,
    };
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    this.props.getHistorial(token);
    const historial = this.props.user.historial;
    console.log(historial);
    this.setState({
      historial,
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

  FormatDate = date => {
    var date = new Date(date);
    // console.log(date);
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
  newFormatDate(date) {
    let d = new Date(date);
    let newDate = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d
      .getDate()
      .toString()
      .padStart(2, '0')}/${d
      .getFullYear()
      .toString()
      .padStart(4, '0')} ${d
      .getHours()
      .toString()
      .padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
    if (d.getHours() >= 12) {
      newDate = newDate + ' p.m';
    } else {
      newDate = newDate + ' a.m';
    }
    return newDate;
  }
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
    } else {
      color = '#122E5C';
    }
    return color;
  }

  _renderItem = ({item, index}) => {
    // const favorite = this.state.favoritesList.some(f => f === item._id);
    //const brand = this.getBrand(item.brand);
    return (
      <TouchableOpacity
        style={styles.cupon}
        disabled={true}
        key={index}
        /* onPress={() =>
          this.props.navigation.navigate('DetalleCupon', {canje: item})
        } */
      >
        <View
          style={
            item.type_data === 'Referido por amigo' ||
            item.type_data === 'Amigo referido'
              ? {
                  flex: 1,
                  backgroundColor: '#122E5C',
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: width * 0.01,
                  marginRight: 8,
                  borderRadius: width * 0.05,
                }
              : {
                  flex: 1,
                  backgroundColor: this.getBackgroundBrand(item.brand),
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  padding: width * 0.01,
                  marginRight: 8,
                  borderRadius: width * 0.05,
                }
          }>
          {item.type_data === 'Referido por amigo' ||
          item.type_data === 'Amigo referido' ? (
            <AmigoReferido width={'90%'} height={'90%'} />
          ) : item.type_data === 'Producto escaneado' ? (
            <ProductoIcon width={'90%'} height={'90%'} />
          ) : (
            <Image
              //source={require('../assets/images/logo.png')}
              source={{
                uri: 'https://wasipetapp.com/api/public/' + item.photo_image,
              }}
              style={styles.img}
            />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.txtOpa}>{item.name || 'QR Escaneado'}</Text>
          <Text style={styles.txtOpa2}>
            {item.type_data === 'Referido por amigo' ||
            item.type_data === 'Amigo referido'
              ? 'Código referido:  ' + item.description
              : item.description}
          </Text>
          <Text style={styles.txtOpa3}>Fecha y hora de registro:</Text>
          <Text style={styles.txtOpa4}>{this.newFormatDate(item.date)}</Text>
        </View>
        <View style={styles.state}>
          <View style={styles.stateSymbols}>
            {item.type_data === 'Producto canjeado' ? (
              <ProductoCanjeado width={25} height={25} />
            ) : item.type_data === 'Producto escaneado' ? (
              <ProductoEscaneado width={25} height={25} />
            ) : item.type_data === 'Referido por amigo' ||
              item.type_data === 'Amigo referido' ? (
              <AmigoReferido width={25} height={25} />
            ) : null}
            <Text
              style={
                item.type_data === 'Producto canjeado'
                  ? styles.textPendiente
                  : item.type_data === 'Producto canjeado'
                  ? styles.textDisponible
                  : item.type_data === 'Referido por amigo' ||
                    item.type_data === 'Amigo referido' ||
                    item.type_data === 'Producto escaneado'
                  ? styles.textReferido
                  : null
              }>
              {item.type_data}
            </Text>
            <Text
              style={
                item.type_data === 'Producto canjeado'
                  ? styles.textPendiente
                  : item.type_data === 'Producto canjeado'
                  ? styles.textDisponible
                  : item.type_data === 'Referido por amigo' ||
                    item.type_data === 'Amigo referido' ||
                    item.type_data === 'Producto escaneado'
                  ? styles.textReferido
                  : null
              }>
              {item.type_data === 'Producto canjeado'
                ? '-'
                : item.type_data === 'Producto canjeado'
                ? '+'
                : item.type_data === 'Referido por amigo' ||
                  item.type_data === 'Amigo referido' ||
                  item.type_data === 'Producto escaneado'
                ? '+'
                : null}
              {item.ptos} puntos
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderHistorial = historial => {
    if (historial) {
      if (historial.length !== 0) {
        return (
          <View style={styles.HistorialContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.Historial}
              data={historial}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              //onEndReached={this.makeRemoteRequest()}
              //onEndReachedThreshold={0}
              //initialNumToRender={10}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.emptyContiner}>
            <View style={styles.emptysubContainer}>
              <Favoritebroken width={25} height={25} style={styles.imgempty} />
              <Text style={styles.textEmpty}>
                No has hecho ninguna operacion hasta la fecha
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: height * 0.7,
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  };

  render() {
    const {historial} = this.props.user;
    return (
      <>
        <CustomHeader
          title={'Historial'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.backContainer}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.titleProducto}>
                <Text style={styles.titleProductoText}>
                  Historial de puntos
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bottonIcon}
                onPress={() => this.props.navigation.navigate('Canjesfiltros')}>
                <Image
                  source={require('../assets/images/home.png')}
                  //source={{uri: 'https://'+canje.type}}
                  style={styles.img}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.ContainerList}>
              {this.renderHistorial(historial)}
            </View>
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userUpdates, // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getHistorial: token => {
      return dispatch(updateHistorial(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Historial);

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
  backContainer: {
    backgroundColor: '#122E5C',
    flex: 6,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
    width: width * 0.9,
    height: height * 0.07,
    borderRadius: width * 0.05,
    borderColor: 'black',
  },
  titleProducto: {
    width: '100%',
  },
  titleProductoText: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.05,
  },
  activeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'blue',
    borderWidth: width * 0.001,
  },
  inactiveButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: width * 0.001,
  },
  left: {
    borderBottomStartRadius: width * 0.05,
    borderTopLeftRadius: width * 0.05,
  },
  right: {
    borderTopEndRadius: width * 0.05,
    borderBottomRightRadius: width * 0.05,
  },
  textButtonactive: {
    color: 'white',
  },
  textButtoninactive: {
    color: 'black',
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
    fontSize: 23,
    alignSelf: 'center',
    paddingHorizontal: 13,
    borderRadius: 5,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  vwMid: {
    margin: 10,
    alignSelf: 'flex-start',
    padding: 5,
    maxWidth: '70%',
  },
  txtMid: {
    fontSize: 15,
    margin: 10,
  },

  CuponesContainer: {
    //flex: 8,
    width: '90%',
    height: '90%',
    //backgroundColor: 'white',
  },

  flatlistContainer: {},
  info: {
    flex: 1.1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContiner: {
    flex: 1,
    height: height * 0.1,
    alignItems: 'center',
    marginVertical: height * 0.05,
  },
  emptysubContainer: {
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    height: '30%',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  imgempty: {
    width: '10%',
    height: '10%',
    resizeMode: 'contain',
    marginBottom: height * 0.05,
  },
  textEmpty: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: height * 0.018,
    color: '#B3B3B3',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  ContainerList: {
    flex: 4,
    width: '90%',
    alignItems: 'center',
  },

  HistorialContainer: {
    //backgroundColor: 'green',
    width: '100%',
    height: height * 0.6,
    flex: 1,
  },

  Historial: {
    flex: 1,
    //backgroundColor: 'yellow',
    width: '100%',
    height: height * 0.6,
  },
  img: {
    width: '100%',
    height: '80%',
    resizeMode: 'stretch',
  },
  cupon: {
    marginVertical: height * 0.015,
    flexDirection: 'row',
    height: height * 0.19,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
  },
  txtOpa: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.035,
    marginBottom: 3,
    textAlign: 'left',
  },
  txtOpa2: {
    color: '#B3B3B3',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.032,
    marginBottom: 12,
  },
  txtOpa3: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.028,
    marginBottom: 2,
  },
  txtOpa4: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.026,
  },
  stateSymbols: {
    flexDirection: 'column',
    marginRight: width * 0.02,
    alignItems: 'center',
  },
  state: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textDisponible: {
    color: '#4CB622',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.027,
  },
  textPendiente: {
    color: '#FF3030',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.027,
  },
  textReferido: {
    color: '#4CB622',
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: width * 0.027,
  },
});
