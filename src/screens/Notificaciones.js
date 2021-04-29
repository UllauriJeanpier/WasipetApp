import React, {Component} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import CustomHeader from '../components/header';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

import {
  changeNotificationSettings,
  addFcmToken,
} from '../APIRequest/userRequest';
import {connect} from 'react-redux';
import {updateUser} from '../redux/actions/userActions';

class Notificaciones extends Component {
  constructor(props) {
    super(props);
    const {
      push_notifications,
      product_notifications,
      email_notifications,
    } = this.props.user;
    this.state = {
      allSwitch:
        push_notifications && product_notifications && email_notifications,
      pushSwitch: push_notifications,
      productsSwitch: product_notifications,
      correoSwitch: email_notifications,
    };
  }

  async componentDidUpdate() {
    if (this.state.pushSwitch) {
      this.checkPermission();
    }
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

  async addDeviceToken(fcmtoken) {
    const token = await this.getStoreData('token');
    try {
      const res = await addFcmToken(token, fcmtoken);
      console.log(res);
    } catch (err) {
      console.log('No se pudo agregar el fcmtoken');
    }
  }

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log(fcmToken);
        await this.setStoreData('fcmToken', fcmToken);
        this.addDeviceToken(fcmToken);

        //Agregar token de dispositivo
      } else {
        console.log('no se puedo obtener fcmtoken de firebase');
      }
    }
  }

  //2

  async requestPermission() {
    try {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  submit = async () => {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    let all = this.state.allSwitch;
    let push = this.state.pushSwitch;
    let email = this.state.correoSwitch;
    let product = this.state.productsSwitch;
    try {
      if (all) {
        push = true;
        email = true;
        product = true;
      }
      const res = await changeNotificationSettings(token, email, push, product);
      if (res.msg == 'todo bien') {
        this.props.updateUser(token, id);
        this.props.navigation.goBack();
      }
    } catch (err) {
      console.log(err);
      alert('Error de red, verifique que su equipo este conectado a internet');
    }
  };

  onshare = async () => {
    try {
      const shareOptions = {
        /*  title: 'Share via',
                message: 'some message',
                url: 'some share url',
                social: Share.Social.WHATSAPP,
                whatsAppNumber: "9199999999",  // country code + phone number
                filename: 'test', // only for base64 file in Android
 */

        url: 'https://awesome.contents.com/',
        title: 'Awesome Contents',
        message: 'Please check this out.',
        icon: 'data:<data_type>/<file_extension>;base64,<base64_data>',
      };
      Share.open(shareOptions);
    } catch (error) {
      alert(error.message);
    }
  };

  toggleAllSwitch = () =>
    this.setState(previousState => ({
      allSwitch: !previousState.allSwitch,
    }));

  toggleEmailSwitch = () =>
    this.setState(previousState => ({
      correoSwitch: !previousState.correoSwitch,
    }));

  toggleProductsSwitch = () =>
    this.setState(previousState => ({
      productsSwitch: !previousState.productsSwitch,
    }));

  togglePushSwitch = () =>
    this.setState(previousState => ({
      pushSwitch: !previousState.pushSwitch,
    }));

  render() {
    const {allSwitch, productsSwitch, correoSwitch, pushSwitch} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <CustomHeader
          title={'Notificaciones'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.subContainer}>
          <View style={styles.optionsContainer}>
            {/* <View style={styles.optionContainer}>
              <Text style={styles.textNotification}>
                Todas las notificaciones
              </Text>
              <Switch onValueChange={this.toggleAllSwitch} value={allSwitch} />
            </View> */}
            <View style={styles.optionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.textNotification}>Nuevos productos</Text>
                <Text style={styles.subtext}>
                  Recibiras notificaciones de productos nuevos
                </Text>
              </View>

              <Switch
                style={styles.Switch}
                onValueChange={this.toggleProductsSwitch}
                value={productsSwitch}
              />
            </View>
            <View style={styles.optionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.textNotification}>Puntos</Text>
                <Text style={styles.subtext}>
                  Recibiras notificaciones de puntos acumulados
                </Text>
              </View>

              <Switch
                style={styles.Switch}
                onValueChange={this.togglePushSwitch}
                value={pushSwitch}
              />
            </View>
            <View style={styles.optionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.textNotification}>Correo electronico</Text>
                <Text style={styles.subtext}>
                  Recibiras notificaciones de sobre tus canjes
                </Text>
              </View>
              <Switch
                style={styles.Switch}
                onValueChange={this.toggleEmailSwitch}
                value={correoSwitch}
              />
            </View>
          </View>

          <View style={{marginTop: height * 0.3}}>
            <TouchableOpacity onPress={() => this.submit()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Guardar</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => this.onshare()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Compartir</Text>
            </View>
          </TouchableOpacity> */}

            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userUpdates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (token, id) => {
      return dispatch(updateUser(token, id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notificaciones);

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
    // flex: 1,
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  subContainer: {
    flex: 1,
    //marginTop: 10,
    //flex: 6,
    // backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 15,
  },
  optionsContainer: {
    marginTop: 20,
  },
  textContainer: {
    flex: 3,
    flexDirection: 'column',
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxWidth: '100%',
    alignSelf: 'stretch',
    marginVertical: 10,
    flexDirection: 'row',
    padding: 5,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: 15,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  buttonText: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
  Switch: {
    flex: 1,
    alignItems: 'flex-start',
  },
  textNotification: {
    flex: 1,
    fontSize: width * 0.045,
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    marginHorizontal: 10,
    alignItems: 'flex-end',
  },
  subtext: {
    flex: 1,
    fontSize: width * 0.025,
    fontFamily: 'ProximaNova-Bold',
    marginHorizontal: 10,
    color: '#B3B3B3',
  },
});
