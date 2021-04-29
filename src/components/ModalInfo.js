import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';

const ModalInfo = ({
  navigation,
  title,
  modalVisible,
  setModalVisible,
  functionButton,
  buttonTitle,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal transparent={true} visible={modalVisible}>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.containerfondo}>
        {loading ? (
          <View style={styles.containerModalfond}>
            <ActivityIndicator size="large" color="#122E5C" />
          </View>
        ) : (
          <TouchableOpacity activeOpacity={1} style={styles.containerModalfond}>
            <Text style={styles.preguntaModal}>{title}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => functionButton()}>
                <Text style={styles.textButtonModal}>{buttonTitle}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

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
  //Modal de Confirmación:
  containerfondo: {
    flex: 1,
    backgroundColor: '#000000aa',
  },
  containerModalfond: {
    backgroundColor: '#ffffff',
    marginTop: height * 0.4,
    alignSelf: 'center',
    padding: 30,
    width: '90%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preguntaModal: {
    color: '#122E5C',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  buttonModal: {
    padding: 5,
    borderColor: '#122E5C',
    borderWidth: 1,
    borderRadius: 20,
    width: '45%',
    height: height * 0.07,
    marginHorizontal: 2,
    justifyContent: 'center',
    marginTop: 10,
  },
  textButtonModal: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});

export default ModalInfo;
