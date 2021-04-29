import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Picker,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  CheckBox,
} from 'react-native';

import {getBreedsCat, getBreedsDog} from '../APIRequest/breedRequest';
import {addPet} from '../APIRequest/petRequest';
import AsyncStorage from '@react-native-community/async-storage';

export default class RegistroCuentanosMascota extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // array breeds
      breeds: null,
      photo: this.props.route.params.photo,
      name: null,
      breed: null,
    };
    this.getStoreData = this.getStoreData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //const Buffer = require("buffer").Buffer;

  async componentDidMount() {
    this.setState({
      breeds: await getBreedsDog(),
    });
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

  async handleSubmit() {
    const {name, breed, photo} = this.state;
    const owner = await this.getStoreData('user');
    const token = await this.getStoreData('token');
    if (name && breed && photo && owner && token) {
      const pet = {name, photo, owner, breed, token};
      let response = await addPet(pet);
      console.log(response);
      if (response.name) {
        this.props.navigation.navigate('Principal');
      } else {
        alert('Hubo un problema al registrar a su mascota');
      }
    } else {
      alert('Verifica todos los campos');
    }
  }

  render() {
    return (
      <>
        <View>
          <Text style={styles.txtInicio}>Cuentanos sobre tu mascota </Text>
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.txt}>Seleccione una opción</Text>
        </View>
        <View style={styles.imgsContainer}>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                breeds: await getBreedsDog(),
              });
            }}
            title="Perro"
            style={styles.BtnPerro}>
            <Image
              source={require('../assets/images/REGISTRO.png')}
              style={styles.img1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                breeds: await getBreedsCat(),
              });
              // console.log(this.state.breeds);
            }}
            title="Gato"
            style={styles.BtnGato}>
            <Image
              source={require('../assets/images/REGISTRO-2.png')}
              style={styles.img2}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.TextInput}
          label="Name"
          name="name"
          placeholder="Nombre"
          autoCompleteType="name"
          textContentType="name"
          value={this.state.name}
          onChangeText={text => this.setState({name: text})}
        />
        <Picker
          selectedValue={this.state.breed}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({breed: itemValue})
          }
          style={styles.Pick}>
          {this.state.breeds &&
            this.state.breeds.map((breed, key) => {
              return (
                <Picker.Item label={breed.name} value={breed.name} key={key} />
              );
            })}
        </Picker>
        <View style={styles.CheckboxContainer}>
          <TouchableOpacity style={styles.Check}>
            <TouchableOpacity
              style={styles.little}
              onFocus={() => {
                backgroundColor: '#212F3C';
              }}
            />
          </TouchableOpacity>

          <Text
            style={styles.txtBox}
            onPress={() => this.props.navigation.navigate('Terminos')}>
            Acepto los Términos & Condiciones y la Política de Privacidad
          </Text>
          {/* <TouchableOpacity
            onPress={()=> this.route.navigation.navigate('Terminos')} >
            <Text>
            Acepto los Términos & Condiciones y la Política de Privacidad
            </Text>
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity onPress={() => this.handleSubmit()}>
          <View style={styles.Button}>
            <Text style={styles.txtButton}>LISTO</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  txtInicio: {
    fontSize: 25,
    margin: 25,
  },
  BtnGato: {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  BtnPerro: {
    margin: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  TextInput: {
    fontSize: 23,
    margin: 20,
    marginTop: '-29%',
    backgroundColor: '#FDFEFE',
    borderRadius: 10,
    paddingLeft: 5,
  },
  Pick: {
    borderStartColor: 'red',
    backgroundColor: '#FDFEFE',
  },
  Check: {
    marginTop: 20,
    marginLeft: 10,
    padding: 10,
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 3,
  },
  little: {
    marginTop: -7,
    marginLeft: -7,
    padding: 7,
    backgroundColor: '#212F3C',
    borderRadius: 25,
  },
  TOpa: {
    alignSelf: 'center',
    margin: 15,
  },
  Term: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgsContainer: {
    flexDirection: 'row',
    width: '40%',
    marginHorizontal: 20,
  },
  img1: {
    maxHeight: '50%',
    marginHorizontal: '-55%',
    resizeMode: 'contain',
  },
  img2: {
    maxHeight: '50%',
    resizeMode: 'contain',
  },
  txt: {
    fontSize: 20,
  },
  txtContainer: {
    margin: 15,
  },
  CheckboxContainer: {
    flexDirection: 'row',
  },
  txtBox: {
    padding: 20,
    maxWidth: '90%',
    fontSize: 14,
  },
  Button: {
    borderRadius: 10,
    marginBottom: 30,
    alignSelf: 'center',
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#212F3C',
  },
  txtButton: {
    textAlign: 'center',
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },
});
