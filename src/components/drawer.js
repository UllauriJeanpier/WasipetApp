import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AjustePerfil from '../screens/Ajuste-perfil';
import Referidos from '../screens/Referidos';
import AjustesPerfilMascota from '../screens/Ajuste-perfil-mascota';
import Favorites from '../screens/favorites';
import Notificaciones from '../screens/Notificaciones';
import Stores from '../screens/Stores';
import Mascotas from '../screens/Mascotas';
import PoliticasSorteo from '../screens/Politicas-sorteo';
import {deauthenticate} from '../redux/actions/authActions';
import AsyncStorage from '@react-native-community/async-storage';
import Logout from '../components/Logout';
import {useSafeArea} from 'react-native-safe-area-context';
import ArrowLeftBlue from '../assets/svg/arrow-left-blue';
import Perfil from '../assets/svg/menu-perfil';
import Mascota from '../assets/svg/menu-mascota';
import Referido from '../assets/svg/menu-referidos';
import Tiendas from '../assets/svg/menu-tienda';
import Notificacion from '../assets/svg/menu-notificaciones';
import Favoritos from '../assets/svg/menu-favoritos';
import Faq from '../assets/svg/menu-faq';
import CerrarSession from '../assets/svg/menu-cerrar-sesion';

import TabBar from './tab-bar';
import Inicio from '../screens/Inicio';

const Drawer = createDrawerNavigator();

/*function renderlogoutButton({navigation}) {
  return (
    <Modal
      transparent={true}
      visible={true}
    >
      <View style={styles.containerfondo}>
        <View style={styles.containerModalfond}>
          <Text >¿ Desea guardar los {"\n"} cambios realizados</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity >
              <View styel={styles.buttonModal}>
                <Text style={styles.textButtonModal}>Salir sin guardar</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Inicio')}>
              <View style={styles.buttonModal}>
                <Text style={styles.textButtonModal}>Guardar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}*/
const goToInicio = async navigation => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (err) {
    console.log(err);
  }
  return navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'Inicio'}],
    }),
  );
};

const CustomDrawerContent = ({navigation}) => {
  //const insets = useSafeArea();
  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      style={styles.drawerStyle}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.menuDrawer}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Principal'}],
                }),
              )
            }>
            <ArrowLeftBlue width={23} height={23} />
            <Text style={styles.textDrawer}>Menú</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('AjustePerfil')}>
            <Perfil width={23} height={23} />
            <Text style={styles.textDrawer}>Mi perfil</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('AjustesPerfilMascota')}>
            <Mascota width={23} height={23} />
            <Text style={styles.textDrawer}>Mi mascota</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('Mascotas')}>
            <Mascota width={23} height={23} />
            <Text style={styles.textDrawer}>Mis mascotas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('Referidos')}>
            <Referido width={23} height={23} />
            <Text style={styles.textDrawer}>Mis referidos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('SelectTienda')}>
            <Tiendas width={23} height={23} />
            <Text style={styles.textDrawer}>Puntos de venta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('Notificaciones')}>
            <Notificacion width={23} height={23} />
            <Text style={styles.textDrawer}>Notificaciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('Favorites')}>
            <Favoritos width={23} height={23} />
            <Text style={styles.textDrawer}>Mis favoritos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('Soporte')}>
            <Faq width={23} height={23} />
            <Text style={styles.textDrawer}>FAQ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainer}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => navigation.navigate('PoliticasSorteo')}>
            <Faq width={23} height={23} />
            <Text style={styles.textDrawer}>Terminos y condiciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonbodycontainerCerrarSesion}>
          <TouchableOpacity
            style={styles.optionDrawer}
            onPress={() => {
              // agregar el async store clear
              //reset();
              goToInicio(navigation);
            }}>
            <CerrarSession width={23} height={23} />
            <Text style={styles.cerrarSesion}>Cerrar Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
export default class MenuDrawer extends Component {
  constructor(props) {
    super(props);
    /* this.state = {
      nav : this.props.navigator
    } */
    this.reset = this.reset.bind(this);
  }
  reset = async navigation => {
    console.log('Logout');
    const response = await deauthenticate();
    console.log('Renzo: response', response);
    if (response) {
      return navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Inicio'}],
        }),
      );
    }
  };

  render() {
    return (
      <Drawer.Navigator
        initialRouteName="MenuTab"
        drawerContent={() => (
          <CustomDrawerContent navigation={this.props.navigation} />
        )}>
        <Drawer.Screen
          name="MenuTab"
          component={TabBar}
          options={{title: 'Menú'}}
        />
        <Drawer.Screen
          name="AjustePerfil"
          component={AjustePerfil}
          options={{title: 'Mi perfil'}}
        />
        <Drawer.Screen
          name="AjustesPerfilMascota"
          component={AjustesPerfilMascota}
          options={{title: 'Mi mascota'}}
        />
        <Drawer.Screen
          name="Mascotas"
          component={Mascotas}
          options={{title: 'Mis mascotas'}}
        />
        <Drawer.Screen
          name="Referidos"
          component={Referidos}
          options={{title: 'Mis referidos'}}
        />
        <Drawer.Screen
          name="Stores"
          component={Stores}
          options={{title: 'Puntos de venta'}}
        />
        <Drawer.Screen name="Notificaciones" component={Notificaciones} />
        <Drawer.Screen name="Soporte" component={Notificaciones} />
        <Drawer.Screen name="PoliticasSorteo" component={PoliticasSorteo} />
      </Drawer.Navigator>
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
  drawerStyle: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 25,
    paddingLeft: 10,
    //backgroundColor: 'red',
  },

  buttonbodycontainer: {
    flex: 1,
    width: '100%',
    height: height * 0.09,
    justifyContent: 'center',
    paddingLeft: '8%',
  },
  buttonbodycontainerCerrarSesion: {
    flex: 1,
    width: '100%',
    height: height * 0.09,
    justifyContent: 'center',
    paddingLeft: '8%',
    marginTop: width * 0.08,
  },
  textDrawer: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.05,
    marginLeft: 5,
  },
  cerrarSesion: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.04,
    marginLeft: 5,
  },
  menuDrawer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  optionDrawer: {
    flexDirection: 'row',
  },
});
