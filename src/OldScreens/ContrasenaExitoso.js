import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default class ContrasenaExitoso extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // system data
      inicio: this.props.route.params.inicio,
    };
    this.codePasswordSubmit = this.codePasswordSubmit.bind(this);
  }

  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.topText}>
          <Text style={styles.topContent}>¡Cambio de contreña exitoso!</Text>
        </View>
        <View style={styles.TxtEndContainer}>
          <Text style={styles.TxtEnd}>
            El cambio de contraseña se ha realizado exitosamente.
        </Text>
        </View>
        <TouchableOpacity onPress={this._onPressButton}>
          <View style={styles.btnEnviar}>
            <Text style={styles.buttonText} onPress={this.props.navigation.navigate(this.state.inicio)}>REGRESAR</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
  },
  topText: {
    flex: 1,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  topContent: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#212F3C',
  },
  TextMd: {
    color: 'blue',
    textAlign: 'center',
    margin: 30,
    fontSize: 25,
  },
  TxtInput: {
    padding: 15,
    borderStyle: 'solid',
    alignSelf: 'center',
    fontSize: 15,
    backgroundColor: '#FDFEFE',
    width: '85%',
    margin: 30,
    borderRadius: 10,
  },
  TxtEndContainer: {
    alignSelf:'center',
    width:'90%',
    marginLeft:25,
  },
  TxtEnd: {
    color: 'black',
    fontSize: 20,
  },
  btnEnviar: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#212F3C',
    borderRadius:10,
    alignSelf:'center',
    marginTop:'65%',
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    fontSize:20,
    fontWeight:'bold',
  }
});
