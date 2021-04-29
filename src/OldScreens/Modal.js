import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default class Menu extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>MENÚ</Text>
                <View style={styles.subContainer}>
                    <Text>CARLOS ALVAREZ</Text>
                    <Image source={require('../assets/images/logo.png')} style={styles.img} />
                </View>
                <View style={styles.subContainer}>
                    <Text>APOLO</Text>
                    <Image source={require('../assets/images/logo.png')} style={styles.img} />
                </View>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Promociones</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Catálogo de productos</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Mecánica y Productos</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Programa de referidos</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Historial de Canjes</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Tiendas</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.notiContainer}>
                        <Text>Notificaciones</Text>
                        <View style={styles.txtArea}>
                            <Text style={styles.txt}>999</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text>Soporte y Ayuda</Text>
                        
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.txt2}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#B3B6B7',
        alignItems: 'flex-start',
    },
    subContainer: {
        flexDirection: 'row',
        alignSelf:'flex-end',
    },
    img: {
        resizeMode: 'center',
        maxHeight: 45,
        marginHorizontal: 50,
    },
    button: {
        backgroundColor: '#FDFEFE',
        width: 360,
        marginVertical: 2,
        padding: 10,
    },
    notiContainer: {
        flexDirection: 'row',
        backgroundColor: '#FDFEFE',
        width: 360,
        marginVertical: 2,
        padding: 10,
    },
    txtArea: {
        marginLeft: 190,
        backgroundColor: '#E67E22',
        borderRadius: 5,
        padding: 5,
    },
    txt: {
        color: '#FDFEFE',
    },
    txt2: {
        marginHorizontal: '27%',
        marginVertical: '17%',
    }
})