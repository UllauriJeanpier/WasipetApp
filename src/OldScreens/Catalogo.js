import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  List,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getAllBrands} from '../APIRequest/brandRequest';

export default class Catalogo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      // user
      points: null,
      // brand array
      brands: null,
    };
    this.getStoreData = this.getStoreData.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    this.setState({
      brands: await getAllBrands(token),
    });
    console.log(this.state.brands);
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

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.card}>
        <Image style={styles.square} source={{uri: 'https://' + item.photo}} />
        <Text styles={{alignSelf: 'flex-start'}}>{item.name}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.txtTop}>PUNTOS</Text>
          <Text style={styles.txtTop2}>10000</Text>
        </View>
        <Text style={styles.txtMid}>PRODUCTOS CANJEABLES CON TUS PTS</Text>
        <Text style={styles.ctg}>CATEGORÍAS</Text>
        <View style={styles.scdContainer}>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>PERRO</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>GATO</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View>
          <Text style={styles.square} />
          <Text styles={{alignSelf: 'flex-start'}}>Advance</Text>
        </View> */}

        {/* <View style={styles.containerCards}>
          {this.state.brands && this.state.brands.map((brand, key) => {
            return (
              <View key={key} style={styles.card}>
                <Text style={styles.square} />
                <Text styles={{ alignSelf: 'flex-start' }}>{brand.name}</Text>
              </View>
            )
          })}
        </View> */}

        {this.state.brands && (
          <FlatList
            style={styles.containerCards}
            data={this.state.brands}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        )}
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    color: '#EAEDED',
  },
  subContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  containerCards: {
    width: width,
    height: height * 0.3,
    flexDirection: 'row',
  },
  card: {
    height: height * 0.2,
    width: width * 0.3,
  },
  square: {
    flex: 2,
    width: width * 0.1,
    height: height * 0.5,
    backgroundColor: '#985111',
    //alignSelf: 'flex-start',
  },

  txtTop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtTop2: {
    backgroundColor: '#D35400',
    color: 'white',
    fontSize: 21,
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  txtMid: {
    margin: 10,
    alignSelf: 'flex-start',
  },
  ctg: {
    color: '#E67E22',
    alignSelf: 'flex-start',
  },
  button: {
    marginBottom: 20,
    width: '94%',
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#95A5A6',
    borderWidth: 2,
  },
  buttonText: {
    textAlign: 'center',
    padding: 25,
    color: '#17202A',
    fontSize: 20,
  },
  scdContainer: {
    flexDirection: 'row',
  },
});
