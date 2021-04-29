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
export default class PoliticasPrivacidad extends Component {
  render() {
    return (
      <ScrollView>
        <CustomHeader
          title={'Términos de uso'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.container}>
          <View style={styles.containerText}>
            <Text style={styles.txtTop}>
              POLÍTICA DE PRIVACIDAD DE WASIPET Y TRATAMIENTO DE DATOS
              PERSONALES
            </Text>
            <Text style={styles.txtLorem}>
              De conformidad con lo establecido en la Ley N° 29733 – “Ley de
              Protección de Datos Personales”, su Reglamento, Decreto Supremo N°
              003-2013-JUS y las demás disposiciones complementarias, el titular
              del presente banco de datos en el que se almacenaran los datos
              personales facilitados en la presente solicitud es BIOETIS S.A.C.,
              con Registro Único de Contribuyentes N° 20555507861, con domicilio
              para estos efectos en Calle General José Rufino Echenique
              Benavente 116, Lima Perú (en adelante, “WASIPET”). WASIPET obtiene
              del Titular de los Datos Personales (en adelante, el “Titular”) la
              presente declaración de consentimiento para el tratamiento de sus
              datos personales. {'\n'} {'\n'}Esta política de privacidad y
              tratamiento de datos personales (en adelante, la “Política”)
              entrarán en vigor desde el Titular de los datos personales preste
              su consentimiento a la presente Política y estará vigente hasta
              que éste revoque la autorización al tratamiento de sus datos.
              {'\n'} {'\n'}Como parte normal de nuestras actividades generales,
              recogemos y, en algunos casos, revelamos información sobre
              nuestros Usuarios y visitantes (en adelante, el “Titular”) de
              nuestra aplicación (en adelante, la “Aplicación”). Esta Política
              describe la información que WASIPET recoge del Titular los datos y
              lo que puede hacerse con dicha información. Esta Política es muy
              detallada porque es importante que todos los Titulares que accedan
              a nuestra Aplicación, deben conocer las prácticas de WASIPET de la
              forma más precisa posible.{'\n'} {'\n'}El Titular acepta
              expresamente y otorga su consentimiento libre, expreso, previo,
              informado e inequívoco para que WASIPET, quien es titular de la
              base de datos, utilice y realice el tratamiento de la información
              personal e identificable del Titular bajo la presente Política.
              Con el consentimiento del Titular, WASIPET podrá recopilar la
              información que proporcione (detallada en el numeral 2.1 de la
              presente Política). De la misma manera, el Titular autoriza a
              WASIPET a recopilar, acceder, registrar, organizar, almacenar,
              conservar, elaborar, modificar, extraer, consultar, utilizar,
              bloquear, entregar para tratamiento por encargo transferir a nivel
              nacional e internacional, comunicar, modificar, suprimir y, en
              general, tratar sus datos personales.
              {'\n'} {'\n'}La privacidad de la información del Titular es muy
              importante para WASIPET. Es por esa razón que se toman las
              precauciones y recaudos para resguardar su información, utilizando
              los mecanismos de seguridad informática de protección de la
              información más completos y eficaces.
            </Text>
            <Text style={styles.txtsubTop}>
              PRIMERA: Derechos de acceso, cancelación y rectificación de la
              Información Personal
            </Text>
            <Text style={styles.txtLorem}>
              1.1. El Titular ejercita los derechos de acceder a sus datos que
              están en posesión de WASIPET, conocer las características de su
              tratamiento, rectificarlos en caso de ser inexactos o incompletos,
              solicitar que sean suprimidos o cancelar su Información Personal
              (más adelante definida), incluyendo su dirección de e-mail, así
              como a oponerse al tratamiento de la misma y a ser informado de
              las cesiones y/o transferencias internacionales de la Información
              Personal llevadas a cabo, todo ello de conformidad a lo dispuesto
              en la normativa aplicable.{'\n'} {'\n'}A fin de ejercer los
              derechos antes mencionados, el Titular deberá presentar una
              solicitud mediante la sección de Soporte disponible a través del
              App. La solicitud respectiva en los términos que establece el
              reglamento de la Ley N° 29733, incluyendo los siguientes datos:
              [nombre del titular y domicilio u otro medio para recibir
              respuesta; documentos que acrediten su identidad o la presentación
              legal, descripción clara y precisa de los datos respecto de los
              que busca ejercer sus derechos y otros elementos o documentos que
              faciliten la localización de los datos].{'\n'} {'\n'}WASIPET
              comunicará a los terceros a quienes haya transferido los datos del
              Titular, sin embargo, no será responsable por los actos de los
              terceros. Adicionalmente, WASIPET actuará dentro de los plazos de
              ley.{'\n'} {'\n'}1.2. El Titular garantiza y responde, en
              cualquier caso, de la veracidad, exactitud, vigencia y
              autenticidad de la Información Personal facilitada, y se
              comprometen a mantenerla debidamente actualizada.{'\n'} {'\n'}1.3.
              Una vez registrado en WASIPET, el Titular de los datos podrá
              revisar y cambiar la información que ha enviado a WASIPET durante
              el proceso de registro, incluyendo:{'\n'} {'\n'}• El usuario y
              dirección de correo electrónico. Sin perjuicio de los cambios que
              realice, WASIPET conservará la información personal anterior por
              motivos de seguridad y control del fraude.{'\n'}• La información
              de la registración como: domicilio, ciudad, región, código postal,
              número principal de teléfono, número secundario de teléfono,
              correo electrónico, etc.{'\n'} • La clave.{'\n'} {'\n'}1.4.
              WASIPET conservará la Información Personal del Titular por un
              periodo de diez (10) años a fin de resolver disputas o reclamos,
              detectar problemas o incidencias y solucionarlos, y dar
              cumplimiento a lo dispuesto en los Términos y Condiciones. WASIPET
              podrá modificar esta Política y/o las prácticas de envío de
              e-mails. En caso que WASIPET modifique la Política, éste
              notificará al Titular publicando una versión actualizada de la
              Política en esta sección o mediante el envío de un e-mail o
              informándolo en la página principal u otras secciones de la
              Aplicación para mantener actualizado al Titular de los cambios
              realizados. El Titular deberá decidir si aceptar o no las
              modificaciones a la Política. En el caso que el Titular no acepte
              los nuevos términos y condiciones de la Política, el vínculo entre
              éste y WASIPET quedará disuelto y la Información Personal de dicho
              Titular de los datos no será usada de otra forma que la que fue
              informada al momento de recabarse.{'\n'} {'\n'}1.5. De considerar
              el Titular que no ha sido atendido en el ejercicio de sus derechos
              puede presentar un reclamo ante la Dirección de Protección de
              Datos Personales, dirigiéndose a la mesa de partes del Ministerio
              de Justicia y Derechos Humanos: Calle Scipion Llona 350,
              Miraflores, Lima, Perú.
            </Text>
            <Text style={styles.txtsubTop}>
              SEGUNDA: La Información Personal
            </Text>
            <Text style={styles.txtLorem}>
              2.1. A fin de acceder a la Aplicación de WASIPET, los Titulares de
              los datos deben registrarse, suministrando ciertos datos
              personales completos y exactos. WASIPET podrá solicitar, recabar y
              almacenar la siguiente información personal: apodo o seudónimo
              (nombre de Titular de los datos) para operar en el sitio de
              WASIPET, nombre y apellido, número de documento o identificación
              válida, información física de contacto (como número de teléfono
              domicilio, dirección de e-mail, etc.) (en adelante, la
              “Información Personal”). WASIPET podrá confirmar la Información
              Personal suministrada acudiendo a entidades públicas, compañías
              especializadas o centrales de riesgo, para lo cual el Titular de
              los datos mediante el presente lo autoriza expresamente. La
              información que WASIPET obtenga de estas entidades será tratada en
              forma confidencial.{'\n'}
              {'\n'} 2.2. El Titular de los datos que se registre en WASIPET a
              través de su Cuenta Personal, consiente expresamente que WASIPET
              tenga acceso, en cualquier momento, a la totalidad de la
              información contenida en su Cuenta Personal, incluyendo en
              particular, pero sin limitación, a su Información Personal,
              información sobre sus intereses, gustos, contactos y cualquier
              otro contenido alojado en su Cuenta Personal.
            </Text>
            <Text style={styles.txtsubTop}>
              TERCERA: Uso de la Información Personal
            </Text>
            <Text style={styles.txtLorem}>
              3.1. Para suministrar de manera eficiente el servicio y a fin de
              que el Titular pueda aplicar de manera ágil y fácil a los
              servicios, WASIPET requiere cierta información de carácter
              personal, incluyendo dirección de e-mail. La recolección de
              información permite ofrecer al Titular los servicios y
              funcionalidades que se adecuen mejor a sus necesidades. La
              Información Personal que se recaba tiene las siguientes
              finalidades:{'\n'}
              {'\n'}• Reconocer a las mascotas registradas y a los propietarios
              para poder asignar los puntos correspondientes.{'\n'}• Desarrollar
              estudios internos sobre los intereses, comportamientos y
              demografía del Titular para comprender mejor sus necesidades e
              intereses y ofrecer mejores servicios o proveerles información
              relacionada.{'\n'}Adicionalmente, usted autoriza a WASIPET para
              que pueda usar su Información Personal para:{'\n'}• Enviar
              información o mensajes al Titular por e-mail, sms (mensaje de
              texto y/o a cualquier otro tipo de dispositivos móviles, sobre
              publicidad o promociones, banners, de interés para el Titular,
              noticias sobre WASIPET. Si el Titular lo prefiere, puede solicitar
              que lo excluyan de las listas para el envío de información
              promocional o publicitaria, mediante la sección de Soporte
              disponible a través de la plataforma.{'\n'}En caso no acepte
              alguno(s) de los tratamientos de datos personales, esto no
              afectara a los demás.{'\n'}Sus datos personales solo serán
              utilizados con propósitos limitados, tal como lo aquí expuestos.
              {'\n'} {'\n'}3.2. WASIPET compartirá la Información Personal
              (incluyendo dirección de e-mail) con los proveedores de servicios
              o las empresas de “outsourcing” o con las empresas con quienes
              WASIPET tenga una relación de colaboración o alianza, que
              contribuyan a mejorar o facilitar las operaciones a través de
              WASIPET. WASIPET velará porque se cumplan ciertos estándares,
              mediante la firma de acuerdos o convenios cuyo objeto sea la
              privacidad de los datos personales del Titular. En algunos casos,
              estos proveedores de servicios serán quienes recojan información
              directamente del Titular (por ejemplo, si les solicitamos que
              realicen encuestas o estudios). En tales casos, podrá recibir una
              notificación acerca de la participación de un proveedor de
              servicios en tales actividades, y quedará a discreción del Titular
              toda la información que quiera brindarle y los usos adicionales
              que los proveedores decidan hacer. En caso el Titular le facilite
              por propia iniciativa información adicional a dichos prestadores
              de servicios directamente, tales prestadores usarán esta
              información conforme a sus propias políticas de privacidad.
              WASIPET no se hace responsable por el uso indebido de la
              Información Personal del Titular que hagan compañías o sitios de
              Internet que actúen por cuenta propia.{'\n'}
              {'\n'}3.3. El Titular reconoce y acepta que WASIPET podrá revelar
              o compartir Información Personal con terceros que son proveedores
              de servicios o empresas aliadas, afiliadas o relacionadas con
              WASIPET. En caso de que no sea así, requerirá el consentimiento
              del Titular de los datos para hacerlo.{'\n'}
              {'\n'}3.4. WASIPET contrata servicios en la nube a través de la
              empresa Amazon Web Services.(CAMBIAR EL HOSTING)
            </Text>
            <Text style={styles.txtsubTop}>
              CUARTA: Confidencialidad de la Información Personal
            </Text>
            <Text style={styles.txtLorem}>
              4.1. Una vez registrado en la Aplicación, WASIPET no venderá,
              intercambiará, alquilará o compartirá la Información Personal del
              Titular excepto en las formas establecidas en esta Política. Sin
              perjuicio de ello, el Titular consiente en forma expresa que
              WASIPET transfiera total o parcialmente la Información Personal a
              cualquiera de las sociedades controladas, controlantes y/o
              vinculadas con WASIPET, a cualquier título y en el momento, forma
              y condiciones que estime pertinente. WASIPET hará todo lo posible
              para proteger la privacidad de la Información Personal. Sin
              perjuicio de ello, puede suceder que en virtud de órdenes
              judiciales, cuando se encuentre permitido por ley, o en caso de
              prevención de lavado de activos o financiamiento del terrorismo,
              WASIPET podrá revelar la Información Personal a las autoridades o
              terceras partes sin el consentimiento del Titular.
            </Text>
            <Text style={styles.txtsubTop}>QUINTA: Clave Personal</Text>
            <Text style={styles.txtLorem}>
              5.1. Para acceder a los servicios reservados únicamente para el
              Titular debidamente registrado, el Titular dispondrá de una clave
              personal. Con ella podrá contratar y calificar los servicios que
              prestan por terceros a través de la Aplicación de WASIPET. El
              Titular deberá mantener esta clave bajo absoluta confidencialidad
              y, en ningún caso, deberá revelarla o compartirla con otras
              personas.{'\n'}
              {'\n'}5.2. El Titular será responsable de todos los actos que
              tengan lugar mediante el uso de su nombre de Titular de los datos
              y clave, lo que incluye hacerse cargo del pago de las tarifas que
              eventualmente se devenguen o por los perjuicios que puedan sufrir
              otros Titulares de los datos por tal motivo. Si por cualquier
              razón un Titular de los datos creyera que alguien puede conocer su
              clave, deberá modificarla ingresando a la opción de modificación
              dispuesta para tal fin en la plataforma de WASIPET.
            </Text>
            <Text style={styles.txtsubTop}>SEXTA: Menores de Edad</Text>
            <Text style={styles.txtLorem}>
              6.1. La Aplicación está dirigida exclusivamente a personas mayores
              de 18 años, estando por tanto restringida la entrada de menores de
              18 años al mismo. Sin perjuicio de lo anterior, WASIPET se reserva
              el derecho de verificar, por los medios que considere más
              oportunos, la edad real de cualquier Titular de los datos.{'\n'}
              {'\n'}6.2. Bajo sospecha de que un Titular de los datos de la
              Aplicación sea menor de 18 años, y de que ha falseado los datos
              que se requieren para su acceso, WASIPET podrá denegar al referido
              el acceso a los servicios ofrecidos
            </Text>
            <Text style={styles.txtsubTop}>
              SEPTIMA: Requerimientos Legales
            </Text>
            <Text style={styles.txtLorem}>
              7.1. WASIPET cooperará con las autoridades competentes y con otros
              terceros para garantizar el cumplimiento de las leyes. WASIPET
              podrá revelar la Información Personal del Titular sin su
              consentimiento únicamente cuando esté permitido por ley, requerido
              por mandato judicial, o en casos de prevención de lavado de
              activos o financiamiento del terrorismo o el caso que dicho
              Titular participa de actividades ilegales. En tales situaciones,
              WASIPET colaborará con las autoridades competentes con el fin de
              salvaguardar la integridad y la seguridad de la comunidad y la de
              sus Titulares de los datos.
            </Text>
            <Text style={styles.txtsubTop}>
              OCTAVA: Seguridad y Almacenamiento de la Información Personal
            </Text>
            <Text style={styles.txtLorem}>
              8.1. WASIPET está obligado a cumplir con toda la normativa
              aplicable en materia de medidas de seguridad aplicables a los
              datos personales. Adicionalmente, WASIPET utilizará los estándares
              de la industria entre materia de protección de la confidencialidad
              de su Información Personal, incluyendo, en otras medidas,
              cortafuegos (“firewalls”) y Secure Socket Layers (“SSL”). WASIPET
              considera la Información Personal del Titular como un activo que
              debe ser protegido de cualquier pérdida o acceso no autorizado. A
              tal fin WASIPET emplea diversas técnicas de seguridad para
              proteger tales datos de accesos no autorizados por Titulares de
              los datos de dentro o fuera de la compañía. Sin perjuicio de lo
              expuesto, considerando que internet es un sistema abierto, de
              acceso público, WASIPET no puede garantizar que terceros no
              autorizados no puedan eventualmente superar las medidas de
              seguridad y utilizar la Información Personal en forma indebida.
              {'\n'}
              {'\n'}8.2. WASIPET no se hace responsable por interceptaciones
              ilegales o violación de sus sistemas o bases de datos por parte de
              personas no autorizadas. WASIPET, tampoco se hace responsable por
              la indebida utilización de la información obtenida por esos
              medios.{'\n'}
              {'\n'}8.3. La Información Personal de Titular será almacenada en
              la base de datos de WASIPET, la misma que se encuentra en un
              archivo o soporte automatizado de datos personales. El archivo o
              soporte de datos personales de los Titulares de los datos de
              WASIPET reside en Lima, Perú.
            </Text>
            <Text style={styles.txtsubTop}>
              NOVENA: Cambio en las preferencias de e-mails
            </Text>
            <Text style={styles.txtLorem}>
              9.1. Sin perjuicio que WASIPET quiere mantener al Titular
              actualizado en todo momento sobre promociones, novedades, cambios,
              etc., el Titular puede seleccionar los e-mails e información
              promocional que gustarían recibir de WASIPET, siempre que el
              Titular haya prestado su consentimiento para recibir esta
              información.
            </Text>
            <Text style={styles.txtLorem}>
              9.2. En caso que el Titular no quiera recibir dichos correos
              electrónicos, éste podrá des-inscribirse cambiando sus
              preferencias en el e-mail siguiendo las instrucciones que WASIPET
              proporciona en sus comunicaciones o bien accediendo a su Cuenta
              Personal. En esa sección el Titular de los datos podrá seleccionar
              las preferencias para que sean tenidas en cuenta por WASIPET en
              las futuras comunicaciones o enviando sus preferencias por correo
              a la dirección postal indicada en estas Políticas de Privacidad.
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
