import React, {Component} from 'react';
import {
  View,
  Text,
  /* TextInput,*/
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import {getProductById} from '../APIRequest/productRequest';
import {getQrCanjeById} from '../APIRequest/QRRequest';
import CustomHeader from '../components/header';
import ArrowCircle from '../assets/svg/arrow-circle-down';
import MenuTienda from '../assets/svg/menu-tienda';
import Zoom from '../assets/svg/zoom';
import {getProductById} from '../APIRequest/productRequest';
import {getClientBySkynet} from '../APIRequest/ubigeoRequest';
import {PRODUCTS_BY_BRAND, COLORS_BY_BRAND} from '../utils/constantes';
import {ScrollView} from 'react-native-gesture-handler';

export default class DetalleCupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      canje: this.props.route.params.canje,
      store: null,
      qr: null,
      modalVisible: false,
    };
    this.detalleProducto = this.detalleProducto.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this.newFormatDate = this.newFormatDate.bind(this);
    this.getBackgroundBrand = this.getBackgroundBrand.bind(this);
    this.openQR = this.openQR.bind(this);
  }

  async UNSAFE_componentWillMount() {
    try {
      const token = await this.getStoreData('token');
      const qr = await getQrCanjeById(token, this.state.canje.code_trade);
      const product = await getProductById(token, this.state.canje.product);
      const store = await getClientBySkynet(this.state.canje.store);
      this.setState({product});
      if (typeof qr._id !== 'undefined') {
        this.setState({qr});
      }
      if (store.status == true) {
        this.setState({
          store: store.data[0],
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Error de conexion',
        'Verifique que si equipo este conectado a internet o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
    }
  }

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
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

  detalleProducto = () => {
    //console.log(this.state.canje);
    return (
      <View style={styles.productContainer}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: width * 0.8,
            height: height * 0.22,
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: 'yellow',
            borderRadius: 25,
            paddingHorizontal: width * 0.02,
            flex: 1,
            backgroundColor: this.getBackgroundBrand(this.state.canje.brand),
            marginRight: 10,
          }}>
          <Image
            source={{
              uri:
                'https://wasipetapp.com/api/public/' + this.state.canje.image,
            }}
            style={styles.img}
          />
        </View>
        <View style={styles.productdescription}>
          <Text style={styles.txtOpa}>{this.state.canje.fullname}</Text>
          <Text style={styles.txtOpa2}>{this.state.canje.type}</Text>
          <Text style={styles.txtOpa3}>Fecha y hora del registro : </Text>
          <View>
            <Text style={styles.txtOpa4}>
              {this.newFormatDate(this.state.canje.createdAt)}
            </Text>
          </View>
          <View>
            <TouchableOpacity disabled={true} style={styles.btnCanjeDisabled}>
              <Text style={styles.txtBtnCanjeDisabled}>
                Canjeado por{' '}
                {this.state.product !== null
                  ? this.state.product.pointsTrade
                  : null}{' '}
                puntos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  openQR = () => {
    this.showModal();
  };

  detalleQr = () => {
    const {qr, store} = this.state;
    if (qr && store) {
      return (
        <View style={styles.qrContainer}>
          <View style={styles.qrimage}>
            <View style={styles.positionLupa}>
              <TouchableOpacity
                onPress={() => this.openQR()}
                style={styles.btnZoom}>
                <Zoom width={15} height={15} />
              </TouchableOpacity>
            </View>
            <Image style={styles.qrimg} source={{uri: qr.image}} />
          </View>
          <View style={styles.extradescription}>
            <Text style={styles.text}>
              Tu cupon ha sido generado exitosamente.{'\n'}
              Deberas mostrar el siguiente codigo QR al {'\n'}
              momento de ir a la tienda. {'\n'}
              {'\n'}
              Cupón número :
            </Text>
            <Text style={styles.textCodigo}>{qr._id}</Text>
            <View style={styles.storeContainer}>
              <MenuTienda style={{flex: 1 / 9}} width={25} height={25} />
              <View style={styles.textStoreContainer}>
                <Text style={styles.tiendatxt}>
                  Tienda:{' '}
                  {store.nombre_comercial
                    ? store.nombre_comercial
                    : store.nombre_razon}
                  {'\n'}
                  {store.direccion}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.qrContainer}>
          <ActivityIndicator size="large" color="#122E5C" />
        </View>
      );
    }
  };

  render() {
    return (
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <CustomHeader
            title={'Cupones'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Detalle de cupón:</Text>
            {this.detalleProducto()}
            {this.detalleQr()}
            <View style={styles.ContainerLine}>
              <View style={styles.lineWithText} />
              <View style={styles.textInTheLine}>
                <ArrowCircle width={25} height={25} />
              </View>
              <View style={styles.lineWithText} />
            </View>
            <Text style={styles.textInTheLine}>Terminos y condiciones</Text>
            <View style={styles.ContainerLine}>
              <Text style={styles.textInTheLine}>
                POLITICAS DE ENVÍO{'\n'}
                {'\n'}Bioetis Sac, distribuye productos de uso veterinario
                diferenciado, destinados al cuidado de la salud y la nutrición
                de animales de compañía {'\n'} {'\n'}¿Cuándo recibiré mi pedido?
                {'\n'}
                {'\n'}
                Los envíos son realizados de Lunes a Viernes, el tiempo de envío
                depende del horario en que realice la orden, pero puedes
                estimarlo de la siguiente manera Pedido antes de las 14:00hrs
                envió al siguiente día hábil. Pedido después de las 14hrs envió
                al segundo día hábil.{'\n'} {'\n'}¿Desde dónde se envía mi
                pedido?{'\n'} {'\n'}Nuestros productos son enviados desde
                nuestro almacén ubicado en: Calle General José Rufino Echenique
                116, San Miguel, Lima - Perú.{'\n'} {'\n'}¿Tendré que pagar
                envío por mi pedido?{'\n'}
                {'\n'}Bioetis Sac, asume la totalidad del envió en el caso de
                pedidos de Biológicos al 100%, en el caso de fármacos mediante
                transporte terrestre, pero en caso de que el cliente lo desee
                vía aérea deberá pagar el envío. En qué caso que él envió que se
                desee a zona aledañas a Lima lo pagará el cliente si fuese un
                volumen inferior a los 100kg. Zonas de Envíos por agencia de
                transportes Chiclayo, tumbes y Nororiente Sur Arequipa, Cusco y
                Puno, Moquegua y Tacna.{'\n'}
                {'\n'} Mi pedido debería haber llegado ya, pero aún no lo he
                recibido. ¿Qué hago?}{'\n'} {'\n'} Antes de contactarnos, por
                favor ayúdanos siguiendo estos pasos:
                {'\n'} {'\n'} ● Comprueba tu email de confirmación para
                asegurarte de que no haya errores en la dirección de envío.
                {'\n'}● Pregunta por tu pedido a tu asesor comercial.{'\n'}●
                Pregunta a tus vecinos por si el transportista les hubiera
                dejado tu paquete.
                {'\n'} {'\n'} Nota: Evita los robos. Si no estarás en casa el
                día de la entrega, utiliza la dirección de donde vayas a estar o
                comunícate con su asesor para solicitar un cambio de dirección
                inmediata. Si la dirección fuera correcta y el paquete no llego,
                ni se la dejo con tus vecinos, ponte en contacto con nosotros en
                atencionalcliente@bioetis.com, además de contactarte con tu
                asesor comercial con tu número de pedido.
                {'\n'} {'\n'} POLÍTICA DE PEDIDOS Y DEVOLUCIONES {'\n'} {'\n'}{' '}
                BIOETIS SAC, distribuye productos de uso veterinario
                diferenciado, destinados al cuidado de la salud y la nutrición
                de animales de compañía
                {'\n'} {'\n'} ¿Cómo hago un seguimiento de mi pedido? {'\n'}{' '}
                {'\n'} Si tienes alguna pregunta sobre tu envío, contáctanos a
                atencionalcliente@bioetis.com o ponte en contacto con tu asesor
                comercial para que te pueda brindar la información más rápida.
                {'\n'} {'\n'} He recibido un producto erróneo o dañado. ¿Qué
                hago? {'\n'} {'\n'} Lo sentimos si tu producto ha llegado
                dañado. Para resolverlo lo antes posible, envíanos un email
                atencionalcliente@bioetis.com, además pedimos que te contactes
                con tu asesor comercial para tener una respuesta más rápida.
                {'\n'} {'\n'} En unos días desde el momento de entrega con fotos
                de tu producto dañado, tu número de pedido y cualquier otro
                detalle que tengas acerca del pedido. ¡Te contactaremos con una
                solución lo antes posible! {'\n'} {'\n'} ¿Cuál es vuestra
                política de devoluciones?
                {'\n'} {'\n'} No ofrecemos devoluciones ni cambios, pero si
                pasara algo con tu pedido, por favor contáctanos en
                atencionalcliente@bioetis.com y con el asesor comercial. {'\n'}{' '}
                {'\n'} ¿Hacen devolución de dinero?
                {'\n'} {'\n'} Solo ofrecemos devoluciones de dinero a clientes
                que reciban artículos erróneos o dañados. Si este fuera tu caso,
                por favor contáctanos en atencionalcliente@bioetis.com con fotos
                de tu artículo y encontraremos una solución. {'\n'} {'\n'}{' '}
                ¿Puedo cambiar un producto por un tamaño diferente o por otro
                producto?
                {'\n'} {'\n'} En este momento no ofrecemos cambios. Te pedimos
                revisar bien tu pedido antes de solicitarlo para evitar
                inconvenientes. No es un caso común, pero puede ocurrir que haya
                un error en el etiquetado de un producto. Si ese fuera el caso,
                contáctanos en atencionalcliente@bioetis.com o comunicándote con
                el asesor comercial, para evaluar tu caso.
              </Text>
            </View>
          </View>
          <Modal transparent={true} visible={this.state.modalVisible}>
            <TouchableOpacity
              onPress={() => this.showModal()}
              style={styles.containerfondo}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.containerModalfond}>
                <View style={styles.buttonContainer}>
                  {this.state.qr !== null ? (
                    <Image
                      style={styles.qrimgModal}
                      source={{uri: this.state.qr.image}}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
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
  headerContainer: {
    flexDirection: 'column',
    //justifyContent: 'center',
    alignItems: 'center',
    //marginTop: height * 0.05,
    width: '100%',
    //height: height,
    //borderRadius: width * 0.05,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    //paddingHorizontal: 25,
    //paddingTop: 25,
    //paddingBottom: 15,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'center',
    color: '#212F3C',
    fontSize: width * 0.05,
    padding: 15,
    margin: 10,
    fontFamily: 'ProximaNova-Bold',
  },
  ContainerLine: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    //marginTop: 25,
    marginBottom: 10,
  },
  lineWithText: {
    backgroundColor: '#B3B3B3',
    height: 1,
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  textInTheLine: {
    marginBottom: height * 0.015,
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: width * 0.03,
    fontFamily: 'ProximaNova-Regular',
    color: '#B3B3B3',
  },
  productContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    //paddingHorizontal: 20,
    //height: height * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    //marginVertical: height * 0.05,
    backgroundColor: '#F2F2F2',
  },
  qrContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    height: height * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: height * 0.05,
    backgroundColor: 'white',
  },
  productimage: {
    width: width * 0.8,
    height: height * 0.22,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    borderRadius: 25,
    paddingHorizontal: width * 0.02,
    flex: 1,
    //backgroundColor: 'red',
    marginRight: 10,
  },
  productdescription: {
    paddingHorizontal: width * 0.01,
    flex: 2,
  },
  textStoreContainer: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor: 'red',
    alignItems: 'center',
    paddingHorizontal: width * 0.01,
    justifyContent: 'center',
  },
  tiendatxt: {
    flex: 1,
    alignSelf: 'center',
    color: '#122E5C',
    //textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.03,
  },
  img: {
    width: width,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  qrimg: {
    width: '100%',
    height: height * 0.15,
    resizeMode: 'contain',
  },
  qrimage: {
    flex: 0.9,
    borderWidth: 3,
    marginRight: 15,
    height: height * 0.2,
    justifyContent: 'center',
    borderColor: '#122E5C',
    borderRadius: 20,
  },
  extradescription: {},
  storeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01,
    flexDirection: 'row',
    //backbackgroundColor: 'blue',
  },
  text: {
    fontSize: width * 0.028,
    color: '#122E5C',
  },
  textCupon: {
    fontSize: width * 0.028,

    marginTop: 15,
    color: '#122E5C',
  },
  textCodigo: {
    fontSize: width * 0.04,
    color: '#122E5C',
  },
  txtOpa: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.036,
    marginBottom: 3,
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
    fontSize: width * 0.03,
    marginBottom: 2,
  },
  txtOpa4: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.028,
  },
  btnCanjeDisabled: {
    width: '85%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#B3B3B3',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 8,
  },
  txtBtnCanjeDisabled: {
    color: '#666666',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.028,
  },
  positionLupa: {
    position: 'relative',
    alignItems: 'flex-end',
    marginTop: -20,
    marginRight: -5,
  },
  btnZoom: {
    borderColor: '#122E5C',
    borderWidth: 2,
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  /*Modal*/
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
  buttonContainer: {
    //flex: 1,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrimgModal: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'contain',
  },
});
