import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableHighlight, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ScanIcon from '../assets/svg/escanear';

export default class CamButton extends Component {
  render() {
    return (
      <View style={{paddingBottom: 35, alignItems: 'center'}}>
        <View style={styles.button}>
          <ScanIcon style={styles.logo} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    //paddingBottom: 25,
    backgroundColor: 'white',
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#EB8817',
    // position: 'relative',
    //zIndex: 9,
  },
  logo: {
    //position: 'relative',
    width: 35,
    height: 35,
    zIndex: 1,
    backgroundColor: 'white',
  },
});
