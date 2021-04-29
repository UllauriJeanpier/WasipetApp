import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getCanjebyUserId} from '../APIRequest/canjesRequest';
import Favoritebroken from '../assets/svg/favorito-broken';
//import { getProductsbyPoints } from '../APIRequest/productRequest';
import {connect} from 'react-redux';
import {updateCanjes} from '../redux/actions/userActions';
import CustomHeader from '../components/header';
import Disponible from '../assets/svg/cupon-disponible';
import Pendiente from '../assets/svg/cupon-pendiente';
import Vencido from '../assets/svg/vencido';
import Canjeado from '../assets/svg/producto-canjeado-gray';
import ArrowRight from '../assets/svg/arrow-right-gray';
// import {getProductById} from '../APIRequest/productRequest';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';

class Cupones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      id: null,
      // user
      points: null,
      // canjes array
      canjes: null,
      canjesvigentes: null,
      canjesvencidos: null,
      type: 'Vigentes',
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
    this.newFormatDate = this.newFormatDate.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    this.setState({
      token,
      id,
    });
    this.props.getCanjes({token, id});
    const canjes = this.props.canjes.canjes;
    /* console.log(
      'Renzo: Cupones -> UNSAFE_componentWillMount -> canjes',
      canjes,
    ); */
    //console.log(canjes);
    if (canjes) {
      let canjesvigentes = canjes.filter(
        canje => canje.state === 'Pendiente' || canje.state === 'Disponible',
      );
      let canjesvencidos = canjes.filter(
        canje => canje.state === 'Vencido' || canje.state === 'Canjeado',
      );
      this.setState({
        canjes,
        canjesvigentes,
        canjesvencidos,
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
    }
    return color;
  }

  _renderItem = ({item, index}) => {
    console.log('Renzo: _renderItem -> item', item);
    return (
      <TouchableOpacity
        style={styles.cupon}
        key={index}
        onPress={() =>
          this.props.navigation.navigate('DetalleCupon', {canje: item})
        }>
        <View
          style={{
            flex: 0.8,
            backgroundColor: this.getBackgroundBrand(item.brand),
            height: '100%',
            width: '100%',
            padding: width * 0.01,
            borderRadius: 20,
            marginRight: 10,
            justifyContent: 'center',
          }}>
          <Image
            //source={require('../assets/images/logo.png')}
            source={{uri: 'https://wasipetapp.com/api/public/' + item.image}}
            style={styles.img}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.txtOpa}>{item.fullname}</Text>
          <Text style={styles.txtOpa2}>{item.type}</Text>
          <Text style={styles.txtOpa3}>Fecha y hora de registro:</Text>
          <Text style={styles.txtOpa4}>
            {this.newFormatDate(item.createdAt)}
          </Text>
        </View>
        <View style={styles.state}>
          <View style={styles.stateSymbols}>
            {item.state === 'Disponible' ? (
              <Disponible width={25} height={25} />
            ) : item.state === 'Pendiente' ? (
              <Pendiente width={25} height={25} />
            ) : item.state === 'Vencido' ? (
              <Vencido width={25} height={25} />
            ) : item.state === 'Canjeado' ? (
              <Canjeado width={25} height={25} />
            ) : null}
            <Text
              style={
                item.state === 'Disponible'
                  ? styles.textDisponible
                  : item.state === 'Pendiente'
                  ? styles.textPendiente
                  : item.state === 'Vencido'
                  ? styles.textVencido
                  : item.state === 'Canjeado'
                  ? styles.textVencido
                  : null
              }>
              {item.state}
            </Text>
          </View>
          <ArrowRight width={25} height={25} />
        </View>
      </TouchableOpacity>
    );
  };

  renderList = canjes => {
    //console.log(canjes);
    if (canjes) {
      let canjesvigentes = canjes.filter(
        canje => canje.state === 'Pendiente' || canje.state === 'Disponible',
      );
      let canjesvencidos = canjes.filter(
        canje => canje.state === 'Vencido' || canje.state === 'Canjeado',
      );
      if (canjes.length !== 0) {
        let data =
          this.state.type === 'Vigentes' ? canjesvigentes : canjesvencidos;
        //console.log(data);
        if (data.length !== 0) {
          return (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.flatlistContainer}
              contentContainerStyle={{paddingBottom: height * 0.24}} // muestra el ultimo elemento de la lista
              data={data}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
            />
          );
        } else {
          return (
            <View style={styles.emptyContiner}>
              <View style={styles.emptysubContainer}>
                <Favoritebroken
                  width={25}
                  height={25}
                  style={styles.imgempty}
                />
                <Text style={styles.textEmpty}>
                  No tienes ningún cupón hasta la fecha
                </Text>
              </View>
            </View>
          );
        }
      } else {
        return (
          <View style={styles.emptyContiner}>
            <View style={styles.emptysubContainer}>
              <Favoritebroken width={25} height={25} style={styles.imgempty} />
              <Text style={styles.textEmpty}>
                No tienes ningún cupón hasta la fecha
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
          <ActivityIndicator size="large" color="#122E5C" />
        </View>
      );
    }
  };

  render() {
    const {canjes} = this.props.canjes;
    return (
      <View style={styles.container}>
        <CustomHeader
          title={'Cupones'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[
              this.state.type === 'Vigentes'
                ? styles.activeButton
                : styles.inactiveButton,
              styles.left,
            ]}
            onPress={() => this.setState({type: 'Vigentes'})}>
            <Text
              style={
                this.state.type === 'Vigentes'
                  ? styles.textButtonactive
                  : styles.textButtoninactive
              }>
              Cupones Vigentes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              this.state.type === 'Vencidos'
                ? styles.activeButton
                : styles.inactiveButton,
              styles.right,
            ]}
            onPress={() => this.setState({type: 'Vencidos'})}>
            <Text
              style={
                this.state.type === 'Vencidos'
                  ? styles.textButtonactive
                  : styles.textButtoninactive
              }>
              Cupones Vencidos
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.CuponesContainer}>{this.renderList(canjes)}</View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    canjes: state.userUpdates, // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCanjes: data => {
      return dispatch(updateCanjes(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cupones);

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
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#122E5C',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: height * 0.05,
    width: '100%',
    //height: height * 0.07,
    //borderRadius: width * 0.05,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    //paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
  },
  activeButton: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
    height: height * 0.07,
    backgroundColor: '#122E5C',
    borderWidth: width * 0.001,
  },
  inactiveButton: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
    height: height * 0.07,
    backgroundColor: 'white',
    borderColor: '#122E5C',
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
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.033,
  },
  textButtoninactive: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.033,
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
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },

  flatlistContainer: {},

  cupon: {
    marginVertical: height * 0.015,
    flexDirection: 'row',
    height: height * 0.19,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 20,
    marginRight: 10,
  },
  info: {
    flex: 1.1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  state: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '80%',
    resizeMode: 'stretch',
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
  },
  txtOpa: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.035,
    marginBottom: 3,
  },
  txtOpa2: {
    color: '#B3B3B3',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.03,
    marginBottom: 12,
  },
  txtOpa3: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.025,
    marginBottom: 2,
  },
  txtOpa4: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.023,
  },
  textDisponible: {
    color: '#4CB622',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
  },
  textPendiente: {
    color: '#FF3030',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
  },
  textVencido: {
    color: '#B3B3B3',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
  },
  stateSymbols: {
    flexDirection: 'column',
    marginRight: width * 0.02,
    alignItems: 'center',
  },
});
