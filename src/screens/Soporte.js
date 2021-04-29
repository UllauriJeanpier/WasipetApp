import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../components/header';
import AsyncStorage from '@react-native-community/async-storage';
import {getAllHelps} from '../APIRequest/helpRquest';
import {ScrollView} from 'react-native-gesture-handler';
import ArrowRight from '../assets/svg/arrow-right-blue';
//import { getProductsbyPoints } from '../APIRequest/productRequest';

export default class Soporte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      id: null,
      // user
      // canjes array
      soportes: null,
      types: [],
      titles: [],
    };
    this.getStoreData = this.getStoreData.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    try {
      const res = await getAllHelps(token);
      this.setState({
        soportes: res,
      });
      // console.log(res);
      let types = [];
      res.forEach(soporte => {
        if (!types.includes(soporte.type)) {
          types.push(soporte.type);
        }
      });
      /* console.log(types);
      const titles = res.map(soporte => {
        return soporte.title;
      }); */
      this.setState({
        types,
        //titles,
      });
    } catch (err) {
      console.log(err);
      alert('Error de red, verifique que su equipo este conectado a internet');
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

  renderPreguntas = title => {
    const listPreguntas = this.state.soportes.map(soporte => {
      <View>{soporte.title == title && <Text>{soporte.title}</Text>}</View>;
    });
    return listPreguntas;
  };

  renderList = () => {
    this.state.types.map(type => {
      return (
        <View style={styles.typeContainer}>
          <Text>{type}</Text>
          <ArrowRight style={{width: 25, height: 25}} />
          {this.renderPreguntas(type)};
        </View>
      );
    });
    //return listypes;
  };

  render() {
    return (
      <ScrollView>
        <CustomHeader
          title={'FAQ'}
          navigation={this.props.navigation}
          isHome={false}
        />
        {this.state.soportes ? (
          <View style={styles.container}>
            {this.state.types.map(type => {
              return (
                <View key={type} style={styles.typeContainer}>
                  <Text style={styles.typetext}>{type}</Text>
                  {this.state.soportes.map(soporte => {
                    if (soporte.type == type) {
                      return (
                        <TouchableOpacity
                          style={styles.preguntaContainer}
                          onPress={() =>
                            this.props.navigation.navigate('SoportePregunta', {
                              soporte,
                            })
                          }
                          key={soporte._id}>
                          <Text style={styles.textPregunta}>
                            {soporte.title}
                          </Text>
                          <View style={styles.iconContainer}>
                            <ArrowRight style={{width: 12.5, height: 12.5}} />
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  })}
                </View>
              );
            })}
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
    flex: 6,
    /* alignItems: 'center',
    justifyContent: 'center', */
    backgroundColor: 'white',
    width: '100%',
    //  height: height - 65,
  },
  typeContainer: {
    flex: 1,
    padding: width * 0.05,
    width: '100%',
    //height: height * 0.4,
    //backgroundColor: 'red',
  },
  typetext: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.06,
    color: '#122E5C',
  },
  preguntaContainer: {
    flex: 1,
    marginVertical: height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  textPregunta: {
    flex: 7,
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.037,
    color: '#122E5C',
  },
  title: {},
  question: {},
});
