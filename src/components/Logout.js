import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity,Modal, Dimensions } from 'react-native'

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    UNSAFE_componentWillMount(){
        
    }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerfondo: {
        backgroundColor: '#000000aa',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      },
      containerModalfond: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '80%',
        height: '20%',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.03,
        borderRadius: 10,
       // flex: 1
      },
      buttonContainer: {
        flex:1,
        width:'100%',
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow'
      },
      buttonModal: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '80%',
        alignItems: 'center',
        backgroundColor: '#34495E',
        borderRadius: 10,
      },
      textButtonModal: {
        fontSize: width*0.05,
        color: 'white',
        fontSize: width*0.04,
      },
})