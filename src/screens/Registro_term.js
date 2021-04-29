import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

export default class Terminos extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.txtTop}>Terminos de uso:</Text>
        <Text style={styles.txtLorem}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Dolore magna aliquam erat volutpat.
          </Text>
        <Text style={styles.txtLorem}>
          Quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        </Text>
        <Text style={styles.txtLorem}>Lorem ipsum dolor sit amet, cons ectetuer adipi.
        </Text>
        <Text style={styles.txtBottom}>Políticas de privacidad:</Text>
        <Text style={styles.txtLorem}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet. Dolore magna aliquam erat volutpat.
          </Text>
        <Text style={styles.txtLorem}>
          Quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        </Text>
        <Text style={styles.txtLorem}>Lorem ipsum dolor sit amet, cons ectetuer adipi.
        </Text>
        <TouchableOpacity
          style={styles.button}
          touchSoundDisabled={false}
          onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.texto}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
  },
  txtTop: {
    fontSize: 20,
    color: '#19315C',
    textAlign: 'left',
    paddingTop:height*0.05,
    paddingLeft:width*0.04,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  txtBottom: {
    fontSize: 20,
    color: '#19315C',
    textAlign: 'left',
    paddingTop:height*0.05,
    paddingLeft:width*0.04,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  txtLorem: {
    textAlign: 'left',
    fontSize: 13,
    paddingHorizontal:width*0.04,
    paddingVertical: height * 0.01,
    color: '#19315C',
  },
  button: {
    padding:height*0.01,
    width: '85%',
    backgroundColor: '#19315C',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: height*0.2,
  },
  texto: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    fontSize:width*0.04,
  },
});
