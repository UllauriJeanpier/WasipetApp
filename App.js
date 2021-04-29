import React, {Component} from 'react';
import {Platform, Dimensions} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from './src/redux/configStore';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
import {Alert, View} from 'react-native';

// componets
import Intro1 from './src/screens/Intro1';
import Intro2 from './src/screens/Intro2';
import Intro3 from './src/screens/Intro3';
import Intro4 from './src/screens/Intro4';
import Inicio from './src/screens/Inicio';
import Registry from './src/screens/Registry';
import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Registro_foto from './src/screens/Registro_foto';
import Scan from './src/screens/Scan';
import RecuperarContrasena from './src/screens/RecuperarContrasena';
import RegistroCuentanosMascota from './src/screens/Registro-cuentanos-mascota';
import Terminos from './src/screens/Registro_term';
import AjustesPerfil from './src/screens/Ajuste-perfil';
import AjustesPerfilMascota from './src/screens/Ajuste-perfil-mascota';
import AjustesPerfilMascotaExtra from './src/screens/Ajuste-perfil-mascota-extra';
import Cupones from './src/screens/Cupones';
import DetalleCupon from './src/screens/Detalle-Cupon';
import InfoCanje from './src/screens/Info-canje';
import Catalogo from './src/OldScreens/Catalogo';
import ProductosCanjeables from './src/screens/Productos-canjeables';
import Promociones from './src/OldScreens/Promociones';
import LugaresPromociones from './src/screens/Lugares-promociones';
import CanjeoExito from './src/screens/canjeo-exito';
import Historial from './src/screens/Historial';
import Favorites from './src/screens/favorites';
import CatalogoProductosPuntos from './src/OldScreens/Catalogo-productos-puntos';
import Referidos from './src/screens/Referidos';
import Notificaciones from './src/screens/Notificaciones';
import InfoCanjeRegresarHistorial from './src/screens/Info-canje-regresar-historial';
import Principal from './src/screens/Principal';
import AjustePerfil from './src/screens/Ajuste-perfil';
import PoliticasPrivacidad from './src/screens/Politicas-privacidad';
import RecuperarContrasenaCodigo from './src/screens/RecuperarContrasenaCodigo';
import ContrasenaExitoso from './src/OldScreens/ContrasenaExitoso';
import CambiarContrasena from './src/screens/CambiarContrasena';
import ProductosCanjeablesPromocion from './src/screens/ProductosCanjeablesPromocion';
import SelectTienda from './src/screens/Select-tienda';
import DetalleProductoPromocion from './src/screens/Detalle-producto-promocion';
import Stores from './src/screens/Stores';
import Soporte from './src/screens/Soporte';
import SoportePregunta from './src/screens/Soporte-pregunta';
import Canjes from './src/screens/Canjes';
import Canjesfiltros from './src/screens/Canjes-filtros';
import MenuDrawer from './src/components/drawer';
import Mascotas from './src/screens/Mascotas';
import TerminosSorteo from './src/screens/Politicas-sorteo';

import {addFcmToken} from './src/APIRequest/userRequest';
import PoliticasSorteo from './src/screens/Politicas-sorteo';

// Initial route

let store = configureStore();

//const Navigation = NavigationContainer(AppNavigator);
const Stack = createStackNavigator();
const StackMenu = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

//const navigation = useNavigation();

const principalTab = () => {
  return (
    <Tab.Navigator initialRouteName="Principal">
      <Tab.Screen name="Principal" component={Principal} />
      <Tab.Screen name="Cupones" component={Cupones} />
      {/* canjes */}
      <Tab.Screen name="Historial" component={Historial} />
    </Tab.Navigator>
  );
};

const principalDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="MenuTab">
      <Drawer.Screen name="MenuTab" component={principalTab} />
      <Drawer.Screen name="AjustePerfil" component={AjustePerfil} />
      <Drawer.Screen
        name="AjustesPerfilMascota"
        component={AjustesPerfilMascota}
      />
      <Drawer.Screen name="Mascotas" component={Mascotas} />
      {/* Mecanica */}
      <Drawer.Screen name="Referidos" component={Referidos} />
      {/* Tiendas */}
      <Drawer.Screen name="Notificaciones" component={Notificaciones} />
      {/* Favoritos  */}
      {/* Soporte y ayuda  */}

      {/* Cerrar Session (inicio) */}
    </Drawer.Navigator>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user: null,
      intro: true,
      mainPage: null,
    };
  }

  setStoreData = async (key, value) => {
    //console.log(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
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

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const intro = await this.getStoreData('intro');
    const petRegister = await this.getStoreData('pet');
    console.log(intro);
    let mainPage = 'Intro1';
    if (intro === 'realizado') {
      if (typeof token === 'string') {
        console.log(petRegister);
        if (petRegister === 'si') {
          mainPage = 'Principal';
        } else {
          mainPage = 'Registro_foto';
        }
      } else {
        mainPage = 'Inicio';
      }
    } else {
      mainPage = 'Intro1';
    }
    console.log(mainPage);
    this.setState({mainPage});
  }

  async componentDidMount() {
    this.messageListener();
    this.onTokenRefreshListener();
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  async onTokenRefreshListener() {
    // Evento de escucha para cuando se refresca el token
    /////////////////////////////////////////////////////////
    this.tokenRefresh = messaging().onTokenRefresh(async fcmtoken => {
      const token = await this.getStoreData('token');
      try {
        const oldfcmtoken = await this.getStoreData('fcmtoken');
        if (oldfcmtoken) {
          // const res = await removeFcmToken(token, fcmtoken);
        }
        const res = await addFcmToken(token, fcmtoken);
        await this.setStoreData('fcmToken', fcmtoken);
        console.log(res);
      } catch (err) {
        console.log('No se pudo actualizar el token');
      }
    });
  }

  async messageListener() {
    // Eventos de escucha para diferentes casos

    ///////////////////////////////////////////////////////////
    this.notificationListener = messaging().onMessage(notification => {
      const {title, body} = notification;
      //    this.showAlert(title, body);
    });

    /* this.notificationOpenedListener = messaging()
      .onNotificationOpenedApp(notificationOpen => {
        const {title, body} = notificationOpen.notification;
   //     this.showAlert(title, body);
      }); */
    //////////////////////////////////////////////////////////////

    /* if(Platform.OS === 'android'){
      this.notificationListener = messaging()
      .setBackgroundMessageHandler(async remoteMessage => {
        console.log('FCM Message Data:', remoteMessage);
      });
    } */
  }

  render() {
    return (
      <Provider store={store}>
        {/* <Navigation /> */}
        <NavigationContainer>
          {this.state.mainPage && (
            <Stack.Navigator
              initialRouteName={this.state.mainPage}
              headerMode="none"
              mode="card"
              screenOptions={{
                gesturesEnabled: true,
                gestureDirection: 'horizontal',
                // if you want to change the back swipe width
                //just put the number, e.g. 100 would be fine to get the iOS effect
                gestureResponseDistance: {
                  horizontal: Dimensions.get('window').width,
                },
                cardStyleInterpolator: ({current, next, layouts}) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                    overlayStyle: {
                      opacity: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.5],
                      }),
                    },
                  };
                },
              }}>
              <Stack.Screen
                name="Intro1"
                component={Intro1}
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              />
              <Stack.Screen
                name="Intro2"
                component={Intro2}
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              />
              <Stack.Screen
                name="Intro3"
                component={Intro3}
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              />
              <Stack.Screen
                name="Intro4"
                component={Intro4}
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              />
              <Stack.Screen name="Inicio" component={Inicio} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Registro_foto" component={Registro_foto} />
              <Stack.Screen name="Registry" component={Registry} />
              <Stack.Screen name="Menu" component={Menu} />
              <Stack.Screen name="Scan" component={Scan} />
              <Stack.Screen
                name="RecuperarContrasena"
                component={RecuperarContrasena}
              />
              <Stack.Screen
                name="RegistroCuentanosMascota"
                component={RegistroCuentanosMascota}
              />
              <Stack.Screen name="Terminos" component={Terminos} />
              <Stack.Screen name="AjustePerfil" component={AjustePerfil} />
              <Stack.Screen
                name="AjustesPerfilMascota"
                component={AjustesPerfilMascota}
              />
              <Stack.Screen
                name="AjustesPerfilMascotaExtra"
                component={AjustesPerfilMascotaExtra}
              />
              <Stack.Screen name="Cupones" component={Cupones} />
              <Stack.Screen name="DetalleCupon" component={DetalleCupon} />
              <Stack.Screen name="InfoCanje" component={InfoCanje} />
              <Stack.Screen
                name="ProductosCanjeables"
                component={ProductosCanjeables}
              />
              <Stack.Screen name="Promociones" component={Promociones} />
              <Stack.Screen
                name="ProductosCanjeablesPromocion"
                component={ProductosCanjeablesPromocion}
              />
              <Stack.Screen
                name="DetalleProductoPromocion"
                component={DetalleProductoPromocion}
              />
              <Stack.Screen name="SelectTienda" component={SelectTienda} />
              <Stack.Screen
                name="LugaresPromociones"
                component={LugaresPromociones}
              />
              <Stack.Screen name="CanjeoExito" component={CanjeoExito} />
              <Stack.Screen name="Historial" component={Historial} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="Canjes" component={Canjes} />
              <Stack.Screen name="Canjesfiltros" component={Canjesfiltros} />

              {/* <Stack.Screen name="CatalogoProductosPuntos" component={CatalogoProductosPuntos} /> */}
              <Stack.Screen name="Referidos" component={Referidos} />
              <Stack.Screen name="Notificaciones" component={Notificaciones} />
              <Stack.Screen
                name="InfoCanjeRegresarHistorial"
                component={InfoCanjeRegresarHistorial}
              />

              <Stack.Screen
                name="Principal"
                component={MenuDrawer}
                navigator={this.props.navigation}
              />

              <Stack.Screen
                name="PoliticasPrivacidad"
                component={PoliticasPrivacidad}
              />
              <Stack.Screen
                name="PoliticasSorteo"
                component={PoliticasSorteo}
              />
              <Stack.Screen
                name="RecuperarContrasenaCodigo"
                component={RecuperarContrasenaCodigo}
              />
              <Stack.Screen
                name="CambiarContrasena"
                component={CambiarContrasena}
              />
              <Stack.Screen
                name="ContrasenaExitoso"
                component={ContrasenaExitoso}
              />
              <Stack.Screen name="Stores" component={Stores} />
              <Stack.Screen name="Soporte" component={Soporte} />
              <Stack.Screen
                name="SoportePregunta"
                component={SoportePregunta}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </Provider>
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
