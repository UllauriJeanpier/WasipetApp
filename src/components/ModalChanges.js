import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    Dimensions,
    Image,
    Modal
} from 'react-native';

export default class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render() {
        return (
            <View style={styles.centeredView}>
                <Modal
                    visible={this.props.isvisible}
                    transparent={true}>
                    <View style={styles.containercenter}>
                      {/*   <View style={styles.con}> */}
                            <Text style={styles.text}>¿ Desea guardar los {"\n"} cambios realizados</Text>
                            <View>
                                
                            </View>
                        {/* </View> */}
                    </View>
                </Modal>
            </View>

        )
    }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: height * 0.5,
    },
    containercenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center'
    }
})

