import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../components/header';
export default class PoliticasSorteo extends Component {
  render() {
    return (
      <ScrollView>
        <CustomHeader
          title={'Legales'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.container}>
          <View style={styles.containerText}>
            <Text style={styles.txtTop}>TÉRMINOS Y CONDICIONES - WASIPET</Text>
            <Text style={styles.txtsubTop}>1. SOBRE EL PROGRAMA {'\n'}</Text>
            <Text style={styles.txtLorem}>
              El programa Wasipet, es un sistema promocional de fidelización
              exclusivo para nuestros clientes tenedores de mascotas. El
              objetivo del programa es premiar la lealtad de dichos clientes
              mediante beneficios y acceso a premios a través de puntos
              canjeables. {'\n'} {'\n'}Las condiciones para la obtención de
              premios y demás beneficios otorgados a nuestros clientes
              participantes del programa son reguladas en el presente documento,
              así como las disposiciones y procedimientos que, en forma
              complementaria, sean establecidos por Wasipet.
              {'\n'} {'\n'}La afiliación al programa es gratuita, el registro al
              programa es de carácter personal e intransferible y únicamente
              podrá asociarse una persona por cada cuenta. {'\n'} {'\n'}El
              cliente debe descargar el aplicativo móvil Wasipet – Usuario,
              registrarse y obtener su cuenta personal, en la que consignará la
              información solicitada por Wasipet. Al registrarse. la persona se
              convierte automáticamente en cliente participante del programa
              Wasipet y acepta los términos y condiciones, así como la política
              de privacidad. {'\n'} {'\n'}Posterior a la recepción de la
              confirmación de registro, a través de su correo electrónico
              inscrito en Wasipet, el cliente podrá comenzar a acumular puntos.{' '}
              {'\n'} {'\n'}Asimismo, el cliente podrá cancelar su cuenta,
              notificando a Wasipet, desde su cuenta de correo electrónico
              registrada, al correo electrónico de atención al cliente:
              atencionalcliente@bioetis.com {'\n'} {'\n'}Los clientes del
              programa no podrán mantener más de una cuenta. De lo contrario, la
              cuenta duplicada será cancelada y se perderán la cantidad de
              puntos acumulada en esta. {'\n'} {'\n'}Wasipet se reserva el
              derecho de, en cualquier momento y sin previo aviso, modificar
              total o parcialmente sus términos y condiciones.
            </Text>
            <Text style={styles.txtsubTop}>
              2. ACUMULACIÓN DE PUNTOS Y PREMIOS {'\n'}
            </Text>
            <Text style={styles.txtLorem}>
              El cliente debidamente registrado en el programa podrá acumular
              puntos canjeables por la compra de cualquiera de los productos de
              Wasipet.{'\n'} {'\n'}Para el registro y acumulación de puntos en
              su cuenta, el cliente deberá localizar en el empaque del producto,
              el sticker de raspado que oculta un código QR. Mediante el
              aplicativo móvil Wasipet – Usuario se deberá escanear dicho código
              y automáticamente se cargarán los puntos a su cuenta.{'\n'} {'\n'}
              Los puntos acumulados no tienen ningún valor monetario, no podrán
              ser canjeados por dinero en ninguna circunstancia, sirven
              exclusivamente para el canje de premios establecidos en nuestro
              portafolio.{'\n'} {'\n'}No se sumarán los puntos de diferentes de
              cuentas registradas en la plataforma Wasipet – usuario.{'\n'}
              {'\n'}El cliente podrá visualizar la cantidad de puntos acumulados
              ingresando a la plataforma de Wasipet en su perfil personal.
            </Text>
            <Text style={styles.txtsubTop}>3. CANJE DE PUNTOS {'\n'}</Text>
            <Text style={styles.txtLorem}>
              El cliente será notificado al alcanzar la cantidad de puntos
              suficiente para canjearla por un determinado premio. Tendrá la
              posibilidad de obtener ese premio o continuar acumulando los
              puntos en su cuenta. {'\n'} {'\n'}En caso, el cliente decida por
              la obtención del premio, mediante el aplicativo móvil elegirá una
              de las Clínicas Veterinarias o Pet Shop de disponibles para el
              canje - las mismas que se encontrarán detalladas en la aplicación-
              y generará un cupón que deberá mostrar para poder retirarlo.{' '}
              {'\n'} {'\n'}Una vez generado el cupón, el cliente no podrá
              solicitar su cancelación del cupón o devolución de puntos. {'\n'}{' '}
              {'\n'}Los puntos canjeados por premio serán automáticamente
              descontados de su balance; y, el canje realizado será registrado
              en la cuenta del cliente. {'\n'} {'\n'}El cliente podrá visualizar
              en la plataforma los premios a los que puede acceder mediante el
              canje de la cantidad de puntos que posee. {'\n'} {'\n'}Todos los
              premios estarán disponibles en las fechas establecidas por
              Wasipet. En el caso de que, por causas ajenas al programa, resulte
              imposible entregar el premio en el establecimiento de su
              preferencia, Wasipet se comunicará con el cliente para reprogramar
              el retiro del premio, sin derecho a reclamo por parte del cliente.
            </Text>
            <Text style={styles.txtsubTop}>4. DE LOS SORTEOS</Text>
            <Text style={styles.txtLorem}>
              4.1 Sorteo Anual{'\n'} {'\n'}Todos los clientes registrados en la
              plataforma de Wasipet – Usuario, que hayan realizado compras y
              acumulado puntos canjeables, participarán de un sorteo anual del
              paquete turístico “Europa de ensueño”. El premio del sorteo
              corresponde a un paquete turístico para dos personas.{'\n'} {'\n'}{' '}
              4.1.1 Fecha del sorteo: 31 de mayo 2021 {'\n'} {'\n'} 4.1.2
              Selección del ganador {'\n'} {'\n'}El ganador del sorteo será
              seleccionado a través de un sorteo aleatorio. El día del sorteo se
              validará en la base de datos de nuestros clientes registrados
              mediante el aplicativo móvil Wasipet para proceder a seleccionar a
              los ganadores. {'\n'} {'\n'}El ganador será contactado mediante
              vía telefónica y/o correo electrónico, para brindarles la
              información del recojo de su premio. En caso el ganador no
              conteste y/o no se comunique pasados los siete (07) días hábiles
              y/o no dé su confirmación sobre el premio, perderá su derecho al
              mismo y no podrá reclamar compensación o indemnización alguna. De
              ocurrir esto, Wasipet podrá proceder a volver a realizar el sorteo
              mediante aviso previo por correo electrónico a todos los clientes
              participantes de la fecha y hora del nuevo sorteo. {'\n'} {'\n'}
              En el caso el ganador del sorteo lo crea conveniente, el premio
              podrá ser reembolsado por el monto máximo equivalente a S/
              18,000.00 (Dieciocho mil con 00/100 Soles). {'\n'} {'\n'}
              4.2 Sorteos Trimestrales {'\n'} {'\n'}Todos los clientes
              registrados en la plataforma de Wasipet – Usuario y que durante el
              trimestre hayan realizados compras y hayan acumulado puntos
              canjeables, participarán de sorteos trimestrales. {'\n'} {'\n'}Se
              otorgarán (03) premios, que corresponden a un (01) año gratis de
              alimentos para su mascota (perro/gato), un (01) año gratis de
              desparasitación de su mascota (perro/gato) y doce (12) baños en la
              clínica veterinaria de la preferencia. {'\n'} {'\n'}Wasipet no
              correrá con ningún gasto que no esté expresamente contemplado en
              el reglamento.{'\n'} {'\n'}4.2.1 Fechas de los sorteos: {'\n'}{' '}
              {'\n'} • 30 de septiembre 2020 {'\n'} {'\n'} • 30 de diciembre de
              2020 {'\n'} {'\n'} • 30 de marzo de 2021 {'\n'} {'\n'} • 30 de
              junio 2021 {'\n'} {'\n'} 4.2.2 Selección del ganador {'\n'} {'\n'}
              Se realizarán tres sorteos individuales. Los ganadores serán
              seleccionados a través de sorteos aleatorios. El día de los
              sorteos se validará la base de datos de nuestros clientes,
              registrados mediante el aplicativo móvil Wasipet, para proceder a
              seleccionar a los ganadores. {'\n'} {'\n'}Los ganadores serán
              contactados mediante vía telefónica y/o correo electrónico, para
              brindarles la información y realizar las coordinaciones
              correspondientes a su premio. En caso el ganador no conteste y/o
              no se comunique pasados los siete (07) días hábiles y/o no dé su
              confirmación sobre el premio, perderá su derecho al mismo y no
              podrá reclamar compensación o indemnización alguna. {'\n'} {'\n'}
              Los premios no podrán serán reembolsados en forma monetaria, ni
              podrán ser intercambiados por el cliente con algún otro servicio o
              su valor en productos.
            </Text>
            <Text style={styles.txtsubTop}>
              Bioetis SAC es el único responsable de los sorteos realizados en
              wasipet, exonerando a Apple de toda responsabilidad
            </Text>
            <TouchableOpacity
              style={styles.button}
              touchSoundDisabled={false}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.texto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#122E5C',
  },
  containerText: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
  txtTop: {
    fontSize: 20,
    color: '#122E5C',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'ProximaNova-Bold',
  },
  txtsubTop: {
    fontSize: 18,
    color: '#122E5C',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'ProximaNova-Bold',
  },
  txtLorem: {
    textAlign: 'justify',
    fontSize: 16,
    fontFamily: 'ProximaNova-Regular',
    //marginTop: 10,
    color: '#122E5C',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#122E5C',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: height * 0.12,
    borderColor: '#122E5C',
    borderWidth: width * 0.004,
  },
  texto: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: 'white',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
});
