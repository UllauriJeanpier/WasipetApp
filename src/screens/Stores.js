import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {generateExchangeQR} from '../APIRequest/QRRequest';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from '../components/header';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import Puntos from '../assets/svg/puntos';
import {PET_GENDERS} from '../utils/constantes';
import ArrowRightGray from '../assets/svg/arrow-down';
import ProductoMedicado from '../assets/svg/producto-medicado-green';
import {
  updateCanjes,
  updateHistorial,
  updatepoints,
  updateUser,
} from '../redux/actions/userActions';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';
import {
  getByUbigeoId,
  getDepartments,
  getDistrictsbyProvincia,
  getProvinciasByDepartment,
  getDistritsData,
  getDataSkynet,
  getDataBynombreComercial,
} from '../APIRequest/ubigeoRequest';

import Tienda from '../assets/svg/menu-tienda';
import PetShop from '../assets/svg/menu-mascota';
//import {ScrollView} from 'react-native-gesture-handler';
//import { getProductsbyPoints } from '../APIRequest/productRequest';

class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      id: null,

      departaments: [],
      provincias: [],
      distrits: [],
      stores: [],
      storesfilter: [],
      storesSearch: [],
      datadistrits: null,
      departamento: null,
      provincia: null,
      distrito: null,
      tienda: null,
      tienda_name: null,

      qr: null,
      //-------------------
      typing: false,
      typingTimeout: 0,
      buscando: false,
      //-------------------

      //stores: null,
      providers: null,
      type: 'stores',
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
  }

  async UNSAFE_componentWillMount() {
    try {
      const departaments = await getDepartments();
      if (departaments) {
        // console.log(departaments);
        this.setState({
          departaments: departaments.map(
            department =>
              (department = {
                ...department,
                label: department,
                value: department,
              }),
          ),
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Error de conexion',
        'Verifique que su equipo este conectado a internet, o inicie nuevamente la aplicacion',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
    }
  }

  async changeProvincia(value) {
    try {
      this.setState({
        provincia: value,
      });
      const distrits = await getDistritsData(this.state.departamento, value);
      if (distrits) {
        this.setState({
          distrits: distrits.map(
            distrito =>
              /* if (distrito.Distrito){ */
              (distrito = {
                ...distrito,
                label: distrito.Distrito,
                value: distrito.IdUbigeo,
              }),
          ),
        });
      }
    } catch (err) {
      console.log('Error los distritos');
    }
  }

  async changeDistrito(value) {
    try {
      this.setState({
        distrito: value,
      });
      const stores = await getDataSkynet(value);
      /* console.log(stores); */
      if (stores.status == true) {
        this.setState({
          stores: stores.data,
          storesfilter: stores.data.map(
            store =>
              (store = {
                ...store,
                label:
                  store.nombre_comercial === ''
                    ? store.nombre_razon
                    : store.nombre_comercial,
                value: store.numero_documento,
              }),
          ),
        });
      } else {
        this.setState({
          stores: [],
          storesfilter: [],
        });
      }
    } catch (err) {
      console.log('Error al traer las tiendas');
    }
  }

  reduceCharacters = cadena => {
    if (cadena.length > 30) {
      return `${cadena.slice(0, 30)}...`;
    } else {
      return cadena;
    }
  };

  async handleFetch(text) {
    this.setState({
      stores: [],
      storesSearch: [],
    });
    // eslint-disable-next-line no-control-regex
    const stores = await getDataBynombreComercial(text);
    if (stores.status === true) {
      this.setState({
        stores: stores.data,
        storesSearch: stores.data
          .map(
            store =>
              (store = {
                ...store,
                label:
                  store.nombre_comercial === ''
                    ? store.nombre_razon
                    : store.nombre_comercial,
                value: store.numero_documento,
              }),
          )
          .splice(0, 9),
        buscando: false,
      });
    } else {
      this.setState({
        stores: [],
        storesSearch: [],
        buscando: false,
      });
    }
  }

  changeName = text => {
    // eslint-disable-next-line consistent-this
    const self = this;
    self.setState({
      buscando: true,
      tienda_name: null,
      storesSearch: [],
      departamento: null,
      provincia: null,
      distrito: null,
    });

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      name: text,
      typing: false,
      typingTimeout: setTimeout(function() {
        self.handleFetch(text);
      }, 2000),
    });
  };

  async changeDepartment(value) {
    try {
      this.setState({
        departamento: value,
      });
      const provincias = await getProvinciasByDepartment(value);
      if (provincias) {
        this.setState({
          provincias: provincias.map(
            provincia =>
              (provincia = {
                ...provincia,
                label: provincia,
                value: provincia,
              }),
          ),
        });
      }
    } catch (err) {
      console.log('Error al traer las provincias');
    }
  }

  async getUbigeoData(ubigeo) {
    const ubigeoData = await getByUbigeoId(ubigeo);
    if (ubigeoData.status === 'ok') {
      const {data} = ubigeoData;
      this.setState({
        distrito: data.IdUbigeo,
        departamento: data.Departamento,
        provincia: data.Provincia,
      });
    }
  }

  async exchangeProduct() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    const {tienda} = this.state;
    const {product, brand} = this.props.canje;
    const {points} = this.props.user;

    if (tienda !== null) {
      if (points >= product.pointsTrade) {
        const qrdata = {
          store: tienda,
          product: product._id,
          points: product.pointsTrade,
          fullname: `${product.name}`,
          type:
            product.category === 'Alimentos'
              ? `${product.category} ${product.type_detail_category}`
              : `${product.category}`,
          image: product.type,
          brand: brand.name,
        };
        try {
          const resqr = await generateExchangeQR(token, qrdata);
          if (typeof resqr._id !== 'undefined') {
            if (resqr.activeStatus) {
              this.setState({
                qr: resqr,
              });
              console.log('Se genero correctamente');
              this.props.getCanjes({token, id});
              this.props.getHistorial(token);
              this.props.updateUser(token, id);
              this.props.navigation.navigate('CanjeoExito', {
                product: product,
                brand: brand,
                qr: this.state.qr,
                store: tienda,
              });
            } else {
              Alert.alert(
                'Aviso',
                'Los canjes se encuentran temporalmente desactivados',
                [{text: 'Cerrar'}],
                {cancelable: true},
              );
            }
          } else {
            Alert.alert(
              'Algo ha ido mal',
              'Hubo un problema al generar el canje',
              [{text: 'Cerrar'}],
              {cancelable: true},
            );
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        Alert.alert(
          'Puntos insuficientes',
          'No cuentas con los puntos suficientes para canjear este producto',
          [{text: 'Cerrar'}],
          {cancelable: true},
        );
      }
    } else {
      Alert.alert(
        'Seleccione una tienda',
        'Asegúrese de haber seleccionado una tienda para poder canjear este producto',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
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

  detalleProducto = () => {
    const {product, brand} = this.props.canje;
    /* console.log(product); */
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
              <Text style={styles.titleDescription}>Descripción: </Text>
              <Text style={styles.textDescription}>{product.description}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  renderStoresSearch() {
    const {storesSearch} = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        {storesSearch && storesSearch.length !== 0 ? (
          storesSearch.map((item, i) => (
            <this._renderTienda item={item} key={i} />
          ))
        ) : (
          <View style={styles.containerActivity}>
            <ActivityIndicator
              style={{alignContent: 'center', justifyContent: 'center'}}
              size="large"
              color="#122E5C"
            />
          </View>
        )}
      </ScrollView>
      /* <FlatList
        nestedScrollEnabled={true}
        style={styles.storeItem}
        contentContainerStyle={styles.flatDestacados}
        data={this.state.storesfilter}
        renderItem={this._renderTienda}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
         onEndReached={({distanceFromEnd}) => {
                console.log('distanceFromEnd', distanceFromEnd);
                console.log('this.state.limitItem', this.state.limitItem);
                if (distanceFromEnd < 0) {
                  this.makeRemoteRequest();
                  return;
                }
              }}
        onEndReachedThreshold={0.5}
      /> */
    );
  }

  _renderTienda = ({item, index}) => {
    console.log('Stores -> _renderTienda -> item', item);
    return (
      <View>
        <TouchableOpacity
          style={styles.tiendaContainer}
          onPress={() => {
            this.setState({
              tienda_name: item.nombre_comercial,
              tienda: item.numero_documento,
              buscando: false,
              stores: [],
              storesSearch: [],
            });
            this.getUbigeoData(item.ubigeo);
          }}>
          {/* <View style={styles.logoTienda}>
            {this.state.type === 'stores' ? (
              <Tienda width={50} height={50} />
            ) : (
              <PetShop width={50} height={50} />
            )}
          </View> */}
          <View style={styles.datosTienda}>
            <Text style={styles.nameTienda}>
              {this.reduceCharacters(
                item.nombre_comercial || item.nombre_razon,
              )}
            </Text>
            <Text style={styles.direccionTienda}>{item.direccion}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {product, brand} = this.props.canje;
    const {departaments, provincias, distrits, storesfilter} = this.state;
    //console.log('Renzo: render -> product', product);
    return (
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <CustomHeader
            title={'Canjes'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.bodyContainer}>
            {this.detalleProducto()}

            {product.medicado && (
              <View style={styles.infoLabelprescription}>
                <ProductoMedicado width={25} height={25} />
                <Text style={styles.textPrescripcion}>
                  Este producto requiere prescripción veterinaria
                </Text>
              </View>
            )}
            <View style={styles.infoLabelpoints}>
              <Puntos width={25} height={25} />
              <Text style={styles.textPuntos}>
                Este producto es equivalente a {product.pointsTrade} puntos
              </Text>
            </View>
            {/*
              <View style={styles.headerContainerSelect}>
              <TouchableOpacity
                style={[
                  this.state.type === 'stores'
                    ? styles.activeButton
                    : styles.inactiveButton,
                  styles.left,
                ]}
                onPress={() => this.setState({type: 'stores'})}>
                <Text
                  style={
                    this.state.type === 'stores'
                      ? styles.textButtonactive
                      : styles.textButtoninactive
                  }>
                  Veterinarias
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  this.state.type === 'providers'
                    ? styles.activeButton
                    : styles.inactiveButton,
                  styles.right,
                ]}
                onPress={() => this.setState({type: 'providers'})}>
                <Text
                  style={
                    this.state.type === 'providers'
                      ? styles.textButtonactive
                      : styles.textButtoninactive
                  }>
                  Pet Shop
                </Text>
              </TouchableOpacity>
            </View>
              */}
            <View style={styles.formSelect}>
              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>Busca la tienda</Text>
              </View>

              <View style={styles.searchContainer}>
                <View style={styles.inputSeach}>
                  <TextInput
                    label="storesearch"
                    name="storesearch"
                    placeholder="Escribe una tienda para buscar"
                    textContentType="none"
                    style={styles.colorInputText}
                    value={this.state.tienda_name}
                    onChangeText={text => {
                      this.changeName(text);
                    }}
                  />
                </View>
                {(this.state.buscando ||
                  this.state.storesSearch.length !== 0) &&
                  this.renderStoresSearch()}

                {/* <View style={styles.storesContainer} /> */}
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>
                  Seleccione un departamento:
                </Text>
              </View>
              <RNPickerSelect
                placeholder={{
                  label: 'Elija su departamento',
                  value: null,
                }}
                items={departaments}
                value={this.state.departamento}
                onValueChange={value => {
                  this.changeDepartment(value);
                }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View>
                      <ArrowRightGray
                        width={20}
                        height={20}
                        style={{marginTop: 15}}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>Seleccione una provincia:</Text>
              </View>
              <RNPickerSelect
                placeholder={{
                  label: 'Elija su provincia',
                  value: null,
                }}
                items={provincias}
                value={this.state.provincia}
                onValueChange={value => {
                  this.changeProvincia(value);
                }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View>
                      <ArrowRightGray
                        width={20}
                        height={20}
                        style={{marginTop: 15}}
                      />
                    </View>
                  );
                }}
              />
              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>
                  ¿En cual distrito deseas recoger tu producto?
                </Text>
              </View>
              <RNPickerSelect
                placeholder={{
                  label: 'Elija su distrito',
                  value: null,
                }}
                items={distrits}
                value={this.state.distrito}
                onValueChange={value => {
                  this.changeDistrito(value);
                }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View>
                      <ArrowRightGray
                        width={20}
                        height={20}
                        style={{marginTop: 15}}
                      />
                    </View>
                  );
                }}
              />

              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>Selecciona una tienda:</Text>
              </View>
              <RNPickerSelect
                placeholder={{
                  label: 'Elija su tienda',
                  value: null,
                }}
                items={storesfilter}
                value={this.state.tienda}
                onValueChange={value => {
                  this.setState({
                    tienda: value,
                    //tienda_name: null,
                  });
                }}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View>
                      <ArrowRightGray
                        width={20}
                        height={20}
                        style={{marginTop: 15}}
                      />
                    </View>
                  );
                }}
              />

              {/* {this.renderList()} */}

              <TouchableOpacity
                style={styles.buttonSubmit}
                onPress={() => this.exchangeProduct()}>
                <Text style={styles.texto}>
                  Canjear por {product.pointsTrade} puntos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userUpdates,
    canje: state.canjeUpdate,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCanjes: data => {
      return dispatch(updateCanjes(data));
    },
    getHistorial: token => {
      return dispatch(updateHistorial(token));
    },
    getPoints: data => {
      return dispatch(updatepoints(data));
    },
    updateUser: (token, id) => {
      return dispatch(updateUser(token, id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stores);

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
  bodyContainer: {
    flexDirection: 'column',
    //justifyContent: 'center',
    alignItems: 'center',
    //marginTop: height * 0.05,
    width: '100%',
    height: 'auto',
    //borderRadius: width * 0.05,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    //paddingHorizontal: 25,
    //paddingTop: 25,
    paddingBottom: 15,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    color: '#212F3C',
    fontSize: width * 0.05,
    fontFamily: 'ProximaNova-Bold',
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
  subtitle: {
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
    color: '#B3B3B3',
    marginTop: 8,
  },
  textPuntos: {
    color: '#5B98B4',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.029,
    marginLeft: 8,
  },
  textPrescripcion: {
    color: '#17C82D',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.029,
    marginLeft: 8,
  },

  // Product styles

  productContainer: {
    flexDirection: 'column',
    width: width * 0.9,
    height: height * 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.1,
    marginBottom: 20,
  },
  headerProduct: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginVertical: 20,
  },
  detailProductContainer: {
    flex: 4,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
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
  },
  canjeado: {},
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },

  // label informativos

  infoLabelprescription: {
    width: '90%',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: height * 0.02,
    backgroundColor: '#96FAA2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  infoLabelpoints: {
    width: '90%',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#A3D6EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Store styles
  headerContainerSelect: {
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
    paddingBottom: 20,
    //marginBottom: 10,
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
    fontSize: width * 0.036,
  },
  textButtoninactive: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.036,
  },
  colorInputText: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
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

  searchContainer: {
    maxHeight: height * 0.36,
    borderWidth: 1,
    borderRadius: width * 0.045,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    marginBottom: 15,
  },
  inputSeach: {
    paddingLeft: 10,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold', // to ensure the text is never behind the icon
  },
  storesContainer: {
    //height: height * 0.2,
  },
  store: {
    borderRadius: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
    height: height * 0.15,
    width: width * 0.9,
    backgroundColor: 'yellow',
  },
  containerActivity: {
    paddingVertical: height * 0.1,
  },

  storeItem: {
    height: 'auto',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }, */
  buttonSubmit: {
    backgroundColor: 'white',
    width: '90%',
    fontSize: 22,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
    borderColor: '#122E5c',
    marginTop: '5%',
    borderWidth: width * 0.003,
    paddingVertical: height * 0.02,
  },

  texto: {
    color: '#122E5c',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Regular',
  },
  labeltext: {
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    paddingBottom: height * 0.01,
  },
  labelContainer: {
    alignItems: 'flex-start',
    //paddingLeft: width * 0.07,
  },
  formSelect: {
    width: width,
    textAlign: 'left',
    paddingHorizontal: width * 0.05,
    marginTop: 10,
  },

  //tienda

  tiendaContainer: {
    // flex: 1,
    width: '100%',
    //backgroundColor: '#F2F2F2',
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    // borderRadius: 20,
  },
  logoTienda: {
    width: '25%',
    backgroundColor: 'white',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2F2F2',
  },
  datosTienda: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  nameTienda: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.035,
    marginTop: 10,
    marginBottom: 10,
  },
  direccionTienda: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.028,
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
  },
  inputAndroid: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold', // to ensure the text is never behind the icon
  },
  iconContainer: {
    paddingRight: 15,
  },
});
