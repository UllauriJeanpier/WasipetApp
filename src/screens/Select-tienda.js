import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from '../components/header';
import AsyncStorage from '@react-native-community/async-storage';
import Puntos from '../assets/svg/puntos';
import {PET_GENDERS} from '../utils/constantes';
import ArrowRightGray from '../assets/svg/arrow-down';
import Tienda from '../assets/svg/menu-tienda';
import PetShop from '../assets/svg/menu-mascota';
import {
  getDepartments,
  getDistrictsbyProvincia,
  getProvinciasByDepartment,
  getDistritsData,
  getDataSkynet,
} from '../APIRequest/ubigeoRequest';

export default class SelectTienda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: null,
      product: null,
      type: 'stores',
      departaments: [],
      provincias: [],
      distrits: [],
      stores: [],
      storesfilter: [],
      datadistrits: null,
      departamento: null,
      provincia: null,
      distrito: null,
      tienda: null,
      buscando: true,
    };
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
        'Verifique que su equipo este conectado a internet',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
    }
  }

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
      if (stores.status === true) {
        if (this.state.type === 'stores') {
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
            buscando: false,
          });
        } else {
          let storesProviders = await stores.data.filter(
            store => store.familia_cliente === 'PETSHOP',
          );
          this.setState({
            stores: storesProviders.map(
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
            buscando: false,
          });
        }
      }
    } catch (err) {
      console.log('Error al traer las tiendas');
    }
  }

  renderTiendas = () => {
    if (!this.state.buscando) {
      return (
        <View style={styles.ProductsContainer}>
          <FlatList
            nestedScrollEnabled={true}
            style={styles.Products}
            contentContainerStyle={styles.flatDestacados}
            data={this.state.stores}
            renderItem={this._renderTienda}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
            /*onEndReached={({distanceFromEnd}) => {
                console.log('distanceFromEnd', distanceFromEnd);
                console.log('this.state.limitItem', this.state.limitItem);
                if (distanceFromEnd < 0) {
                  this.makeRemoteRequest();
                  return;
                }
              }}*/

            onEndReachedThreshold={0.5}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.mensajeBusqueda}>
          <Text style={styles.mensajeTexto}>Seleccione todos los filtros</Text>
        </View>
      );
    }
  };
  reduceCharacters = cadena => {
    if (cadena.length > 30) {
      return `${cadena.slice(0, 30)}...`;
    } else {
      return cadena;
    }
  };

  _renderTienda = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.tiendaContainer}
          onPress={() => console.log('item', item)}>
          <View style={styles.logoTienda}>
            {this.state.type === 'stores' ? (
              <Tienda width={50} height={50} />
            ) : (
              <PetShop width={50} height={50} />
            )}
          </View>
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
    const {departaments, provincias, distrits, storesfilter} = this.state;
    return (
      <View style={{flex: 6}}>
        {departaments.lenght !== 0 ? (
          <View style={styles.container}>
            <CustomHeader
              title={'Puntos de venta'}
              navigation={this.props.navigation}
              isHome={false}
            />
            <View style={styles.bodyContainer}>
              <View style={styles.headerContainerSelect}>
                {/*
                <TouchableOpacity
                  style={[
                    this.state.type === 'stores'
                      ? styles.activeButton
                      : styles.inactiveButton,
                    styles.left,
                  ]}
                  onPress={() =>
                    this.setState({
                      type: 'stores',
                      distrito: null,
                      departamento: null,
                      provincia: null,
                      buscando: true,
                    })
                  }>
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
                  onPress={() =>
                    this.setState({
                      type: 'providers',
                      distrito: null,
                      departamento: null,
                      provincia: null,
                      buscando: true,
                    })
                  }>
                  <Text
                    style={
                      this.state.type === 'providers'
                        ? styles.textButtonactive
                        : styles.textButtoninactive
                    }>
                    Pet Shop
                  </Text>
                </TouchableOpacity>
                */}
              </View>
              <View style={styles.formSelect}>
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
                  <Text style={styles.labeltext}>
                    Seleccione una provincia:
                  </Text>
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
                    /* this.setState({
                      distrito: value,
                    }); */
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

                {/*
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
                />*/}

                <View style={styles.labelContainer}>
                  {this.renderTiendas()}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: height * 0.7,
            }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    );
  }
}

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
    height: height,
    //borderRadius: width * 0.05,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    //paddingHorizontal: 25,
    //paddingTop: 25,
    paddingBottom: 15,
  },
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
  formSelect: {
    width: width,
    textAlign: 'left',
    paddingHorizontal: width * 0.05,
  },
  //tienda
  tiendaContainer: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    height: 80,
    flexDirection: 'row',
    borderRadius: 20,
    marginVertical: 5,
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
    width: '75%',
    height: '100%',
    paddingLeft: 20,
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
  mensajeBusqueda: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mensajeTexto: {
    color: '#122E5C',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Bold',
  },
  ProductsContainer: {
    marginBottom: 150,
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
