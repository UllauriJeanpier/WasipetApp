import React, {Component, Fragment} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  TouchableOpacity,
  Text,
  StatusBar,
  Modal,
  Linking,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {
  updatepoints,
  updateUser,
  updateHistorial,
} from '../redux/actions/userActions';
import CustomHeader from '../components/header';
import Puntos from '../assets/svg/puntos';
import {getProductById} from '../APIRequest/productRequest';
import {scanningQRProduct, scanningQRCanje} from '../APIRequest/QRRequest';
import {ScrollView} from 'react-native-gesture-handler';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      instrucciones: null,
      product: null,
      scan: true,
      ScanResult: false,
      result: null,
      zoom: 0,
      modalVisible: false,
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.activeQR = this.activeQR.bind(this);
    this.scanAgain = this.scanAgain.bind(this);
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
  }

  async UNSAFE_componentWillMount() {
    try {
      const instrucciones = await this.getStoreData('scan');
      if (instrucciones) {
        if (instrucciones == 'no') {
          this.setState({
            modalVisible: true,
          });
        }
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  setStoreData = async (key, value) => {
    //console.log(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
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

  onSuccess = async e => {
    this.setState({
      scan: false,
      ScanResult: true,
      fetching: true,
    });
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    console.log(e);
    try {
      let points = parseInt(e.data.split('points:')[1]);
      console.log('Los puntos son:', points);
      let stringdata = e.data.split(':')[1];
      stringdata = stringdata.split(',')[0];
      const res = await scanningQRProduct(stringdata, points, token);
      if (typeof res.msg === 'undefined') {
        this.props.updateUser(token, id);
        this.props.updateHistorial(token);
        // const product = await getProductById(token, res.productId);

        /* console.log('El producto es');
          console.log(product); */
        this.setState({
          result: res,
          points,
          // product,
          fetching: false,
        });

        console.log('Todo ok');
      } else {
        if (res.msg == 'Este qr ya fue escaneado') {
          this.setState({
            result: 'usado',
            fetching: false,
          });
        } else if (res.msg == "This qr doesn't exist") {
          this.setState({
            result: 'no existe',
            fetching: false,
          });
        } else {
          this.setState({
            result: 'problema',
            fetching: false,
          });
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({
        result: 'error',
        fetching: false,
      });
    }
  };

  activeQR = () => {
    this.setState({
      scan: true,
    });
  };
  scanAgain = () => {
    this.setState({
      scan: true,
      ScanResult: false,
    });
  };

  detalleProducto = product => {
    console.log(product);
    return (
      <View style={styles.productContainer}>
        <View style={styles.headerProduct}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.type_description}</Text>
        </View>
        <View style={styles.detailProductContainer}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.getBackgroundBrand(product.brand),
              borderRadius: width * 0.1,
              paddingHorizontal: width * 0.02,
              flex: 1.5,
            }}>
            <Image
              source={{
                uri: 'https://wasipetapp.com/api/public/' + product.type,
              }}
              resizeMode="stretch"
              style={styles.img}
            />
          </View>
          <View style={styles.productdescription}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}>
              <Text style={styles.titleDescription}>Descripcion: </Text>
              <Text style={styles.textDescription}>{product.description}</Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles.infoLabelpoints}>
          <Puntos width={25} height={25} style={styles.puntosicon} />
          <Text style={styles.textPuntos}>
            Este producto es equivalente a {product.pointsValue} puntos
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {points, scan, ScanResult, result, fetching} = this.state;
    const desccription = 'Escanear codigo QR';
    let resultrender, resultitle;

    if (typeof result === 'object' && result !== null) {
      resultrender = (
        <View style={ScanResult ? styles.scanCardView : styles.cardView}>
          {/* <Text style={styles.textCardtitle}>{result._id}</Text> */}
          {/* {this.detalleProducto(product)} */}
          <Text style={styles.textCardtitle}>
            Este producto es equivalente a {points} puntos
          </Text>
          <TouchableOpacity
            onPress={this.scanAgain}
            style={styles.buttonTouchable}>
            <Text style={styles.buttonTextStyle}>Volver a escanear</Text>
          </TouchableOpacity>
        </View>
      );
      resultitle = (
        <Text style={styles.textTitle1}>Has escaneado un producto</Text>
      );
    } else {
      if (result == 'usado') {
        resultrender = (
          <View style={ScanResult ? styles.scanCardView : styles.cardView}>
            <Text style={styles.textCardtitle}>
              Este Qr ya ha sido utilizado
            </Text>
            <TouchableOpacity
              onPress={this.scanAgain}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Volver a escanear</Text>
            </TouchableOpacity>
          </View>
        );
        resultitle = (
          <Text style={styles.textTitle1}>
            Ha fallado el escaneo de este producto
          </Text>
        );
      } else if (result == 'no existe') {
        resultrender = (
          <View style={ScanResult ? styles.scanCardView : styles.cardView}>
            <Text style={styles.textCardtitle}>
              No existe un qr con este id registrado
            </Text>
            <TouchableOpacity
              onPress={this.scanAgain}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Volver a escanear</Text>
            </TouchableOpacity>
          </View>
        );
        resultitle = (
          <Text style={styles.textTitle1}>
            Ha fallado el escaneo de este producto
          </Text>
        );
      } else if (result == 'problema') {
        resultrender = (
          <View style={ScanResult ? styles.scanCardView : styles.cardView}>
            <Text style={styles.textCardtitle}>
              Hubo un problema al escanear este qr
            </Text>
            <TouchableOpacity
              onPress={this.scanAgain}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Volver a escanear</Text>
            </TouchableOpacity>
          </View>
        );
        resultitle = (
          <Text style={styles.textTitle1}>
            Ha fallado el escaneo de este producto
          </Text>
        );
      } else if (result == 'error') {
        resultrender = (
          <View style={ScanResult ? styles.scanCardView : styles.cardView}>
            <Text style={styles.textCardtitle}>
              Ha habido un problema, verifique su conexion a internet o
              intentelo de nuevo
            </Text>
            <TouchableOpacity
              onPress={this.scanAgain}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Volver a escanear</Text>
            </TouchableOpacity>
          </View>
        );
        resultitle = (
          <Text style={styles.textTitle1}>
            Ha fallado el escaneo de este producto
          </Text>
        );
      }
    }

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <CustomHeader
          title={'Escanear código'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.scrollViewStyle}>
          {fetching == false ? (
            <View style={styles.container}>
              <StatusBar barStyle="dark-content" />
              {!scan && !ScanResult && (
                <View style={styles.cardView}>
                  <Text numberOfLines={8} style={styles.descText}>
                    {desccription}
                  </Text>
                  <TouchableOpacity
                    onPress={this.activeQR}
                    style={styles.buttonTouchable}>
                    <Text style={styles.buttonTextStyle}>ESCANEAR</Text>
                  </TouchableOpacity>
                </View>
              )}

              {ScanResult && result && (
                <View style={styles.cardMensaje}>
                  {resultitle}
                  {resultrender}
                </View>
              )}

              {scan && (
                <View style={styles.subContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>
                      ¿Como escanear el codigo QR?
                    </Text>
                    <Text style={styles.headerTitle}>
                      Enfoca la camara directamente en el codigo QR del empaque
                    </Text>
                  </View>
                  <View style={styles.qrContainer}>
                    <QRCodeScanner
                      reactivate={true}
                      showMarker={true}
                      markerStyle={{
                        borderColor: 'white',
                        borderRadius: 18,
                      }}
                      cameraProps={{
                        zoom: this.state.zoom,
                      }}
                      ref={node => {
                        this.scanner = node;
                      }}
                      containerStyle={{
                        //marginTop: 10,
                        flex: 1,
                        marginTop: height * 0.09,
                        alignItems: 'center',
                        justifyContent: 'center',
                        //height: height * 0.1,
                      }}
                      cameraStyle={{
                        //flex: 1,
                        // height: 200,
                        //marginTop: 20,

                        //width: '100%',
                        //height: height * 0.1,
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}
                      onRead={this.onSuccess}
                      topContent={
                        <Text style={styles.centerText}>
                          <Text style={styles.textBold} />{' '}
                        </Text>
                      }
                      /*  bottomContent={
                        <View style={styles.ZoomContainer}>
                          <TouchableOpacity
                            style={styles.buttonTouchable}
                            onPress={() => this.scanner.reactivate()}>
                            <Text style={styles.buttonTextStyle}>
                              OK. Got it!
                            </Text>
                          </TouchableOpacity>
                        </View>
                      } */
                    />
                  </View>
                </View>
              )}
              <View style={styles.ZoomContainer}>
                <TouchableOpacity
                  style={
                    this.state.zoom == 0
                      ? styles.btnZoonActived
                      : styles.btnZoonInactived
                  }
                  onPress={() => this.setState({zoom: 0})}>
                  <Text
                    style={
                      this.state.zoom == 0
                        ? styles.textActived
                        : styles.textInactived
                    }>
                    x0.5
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.state.zoom == 0.5 || this.state.zoom == 0.01
                      ? styles.btnZoonActived
                      : styles.btnZoonInactived
                  }
                  onPress={() =>
                    this.setState({
                      zoom: Platform.OS === 'android' ? 0.5 : 0.01,
                    })
                  }>
                  <Text
                    style={
                      this.state.zoom == 0.5 || this.state.zoom == 0.01
                        ? styles.textActived
                        : styles.textInactived
                    }>
                    x1
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.state.zoom == 1 || this.state.zoom == 0.02
                      ? styles.btnZoonActived
                      : styles.btnZoonInactived
                  }
                  onPress={() =>
                    this.setState({zoom: Platform.OS === 'android' ? 1 : 0.02})
                  }>
                  <Text
                    style={
                      this.state.zoom == 1 || this.state.zoom == 0.02
                        ? styles.textActived
                        : styles.textInactived
                    }>
                    x2
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.7,
              }}>
              <ActivityIndicator size="large" color="#122E5C" />
            </View>
          )}
        </View>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <TouchableOpacity
            onPress={() => this.showModal()}
            style={styles.containerfondo}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.containerModalfond}>
              <View style={styles.buttonContainer}>
                <Image
                  source={require('../assets/images/scan-mensaje.png')}
                  style={styles.imgscan}
                />
                <TouchableOpacity
                  style={styles.buttonModal}
                  onPress={() => {
                    this.setStoreData('scan', 'si');
                    this.setState({
                      instrucciones: 'si',
                    });
                    this.showModal();
                  }}>
                  <Text style={styles.textButtonModal}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
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
    updatepoints: data => {
      return dispatch(updatepoints(data));
    },
    updateUser: (token, id) => {
      return dispatch(updateUser(token, id));
    },
    updateHistorial: token => {
      return dispatch(updateHistorial(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scan);

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
  scrollViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
  },
  subContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'yellow',
  },
  titleContainer: {
    flex: 1,
    width: '100%',
    paddingTop: height * 0.04,
    alignItems: 'center',
    //marginBottom: height * 0.05,
    justifyContent: 'center',
    //backgroundColor: 'red',
  },
  qrContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'yellow',
  },
  headerTitle: {
    fontFamily: 'ProximaNova-Regular',
    color: '#122E5C',
    fontSize: width * 0.032,
  },
  textTitle1: {
    fontFamily: 'ProximaNova-Regular',
    //fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
    paddingVertical: height * 0.05,
    color: '#122E5C',
  },
  cardMensaje: {
    //flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCardtitle: {
    //flex: 1,
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.04,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    marginVertical: height * 0.03,
    marginHorizontal: width * 0.02,
  },
  cardView: {
    flex: 1,
    width: '100%',
    height: height * 0.6,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    /* borderWidth: 1,
    borderRadius: 2, */
    //borderColor: '#16257C',
    borderBottomWidth: 0,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 1,
    backgroundColor: 'white',
  },

  scanCardView: {
    flex: 1,
    width: '90%',
    height: height / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: width * 0.05,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: '#122E5C',
  },
  descText: {
    padding: 16,
    textAlign: 'justify',
    fontSize: 16,
  },

  highlight: {
    fontWeight: '700',
  },
  buttonTouchable: {
    //flex: 1,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#122E5C',
    backgroundColor: 'white',
    marginVertical: height * 0.01,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '12.5%',
  },
  buttonTextStyle: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.04,
  },

  // zoom Styles
  ZoomContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '50%',
    //alignItems: 'center',
    // justifyContent: 'center',
    height: height * 0.05,
    marginBottom: height * 0.02,
    // backgroundColor: 'red',
  },
  btnZoonActived: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#122E5C',
    borderColor: 'white',
    borderRadius: height * 0.025,
    marginHorizontal: width * 0.03,
    width: height * 0.05,
    height: height * 0.05,
  },
  btnZoonInactived: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#122E5C',
    borderRadius: height * 0.025,
    marginHorizontal: width * 0.03,
    width: height * 0.05,
    height: height * 0.05,
    //width: '100%',
    // backgroundColor: 'white',
  },
  textActived: {
    color: 'white',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
  },
  textInactived: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
  },

  // Product styles

  productContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '90%',
    height: height * 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.1,
    marginBottom: 20,
  },
  headerProduct: {
    backgroundColor: 'white',
    flex: 1.7,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginVertical: height * 0.025,
  },
  detailProductContainer: {
    flex: 4,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: '#212F3C',
    fontSize: width * 0.05,
    fontFamily: 'ProximaNova-Bold',
  },
  subtitle: {
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
    color: '#B3B3B3',
    marginTop: 8,
  },
  titleDescription: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: '#212F3C',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Bold',
  },
  textDescription: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: '#212F3C',
    fontSize: width * 0.032,
    fontFamily: 'ProximaNova-Regular',
  },
  productimage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: width * 0.1,
    paddingHorizontal: width * 0.02,
    flex: 1.5,
  },
  productdescription: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.045,
    flex: 2,
    width: '100%',
  },
  canjeado: {},
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  imgscan: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  infoLabelpoints: {
    flex: 1,
    width: '100%',
    marginVertical: height * 0.02,
    //paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#A3D6EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  puntosicon: {
    flex: 1 / 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPuntos: {
    flex: 7 / 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5B98B4',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.03,
    marginLeft: 8,
  },

  //Modal de Confirmación:
  containerfondo: {
    flex: 1,
    /* width: '100%',
    height: height, */
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModalfond: {
    // flex: 0.5,
    width: '90%',
    backgroundColor: '#ffffff',
    marginTop: height * 0.3,
    marginLeft: width * 0.15,
    marginRight: width * 0.15,
    marginBottom: width * 0.4,
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    //height: height * 0.6,
    justifyContent: 'center',
  },
  preguntaModal: {
    color: '#122E5C',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
  },
  buttonContainer: {
    //flex: 1,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonModal: {
    padding: 5,
    borderColor: '#122E5C',
    borderWidth: 1,
    borderRadius: 20,
    width: '50%',
    height: height * 0.07,
    marginHorizontal: 2,
    justifyContent: 'center',
    marginTop: 10,
  },
  textButtonModal: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});
