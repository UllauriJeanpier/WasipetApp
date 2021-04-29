import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

export default class Intro3 extends Component {
  render() {
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.bg}>
          <View style={styles.imgContainer}>
            <Image
              source={require('../assets/images/icon-intro-3.png')}
              style={styles.img}
            />
          </View>
          <Text style={styles.txtLorem}>
            Busca los códigos QR {'\n'} en los empaques {'\n'} y escanea para
            obtener {'\n'} más puntos.
          </Text>
          <View style={styles.sliderContainer}>
            <View style={styles.slidericon} />
            <View style={styles.slidericon} />
            <View style={styles.slidericonfocus} />
            <View style={styles.slidericon} />
          </View>
          <TouchableOpacity
            style={styles.button}
            touchSoundDisabled={false}
            onPress={() => this.props.navigation.push('Intro4')}>
            <Text style={styles.texto}>Continuar</Text>
          </TouchableOpacity>
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
  scroll: {
    flex: 1,
    height: height,
  },
  img: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  bg: {
    backgroundColor: '#FFB6CB',
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtLorem: {
    maxWidth: '100%',
    textAlign: 'center',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Bold',
    marginHorizontal: '10%',
    marginVertical: '10%',
    color: '#122E5C',
  },
  button: {
    justifyContent: 'center',
    borderColor: '#122E5C',
    borderWidth: 1,
    width: '85%',
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: height * 0.01,
    //marginVertical: height * 0.2,
  },
  texto: {
    textAlign: 'center',
    padding: 5,
    color: '#122E5C',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: height * 0.2,
    height: height * 0.4,
    width: height * 0.4,
    borderWidth: width * 0.02,
    borderColor: '#EC325E',
  },
  sliderContainer: {
    //flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: width * 0.1,
  },
  slidericon: {
    marginHorizontal: width * 0.01,
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#122E5C',
  },
  slidericonfocus: {
    marginHorizontal: width * 0.01,
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#122E5C',
  },
});
