import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Clipboard,
  Alert,
  FlatList,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {refreshPet} from '../redux/actions/userActions';

import {Dimensions} from 'react-native';
import Share from 'react-native-share';
import {addDeferred} from '../APIRequest/userRequest';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeader from '../components/header';
import {deleteById} from '../APIRequest/petRequest';
import BorrarBlue from '../assets/svg/borrar-blue';
import EditarBlue from '../assets/svg/editar-blue';
import ModalConfirm from '../components/ModalConfirm';
import ModalInfo from '../components/ModalInfo';

const MascotasList = ({navigation}) => {
  const user = useSelector(state => state.userUpdates);

  const dispatch = useDispatch();
  const [eliminatePetID, seteliminatePetID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const cancelarFunction = () => {
    setModalVisible(false);
  };
  const aceptarFunction = async () => {
    try {
      let token = await getStoreData('token');
      let userid = await getStoreData('user');
      const responseDelete = await deleteById(token, eliminatePetID);
      //console.log('aceptarFunction -> responseDelete', responseDelete);
      //dataUsers();
      // Llamar al updatePets de redux
      dispatch(refreshPet(token, userid));
    } catch (error) {
      console.log('aceptarFunction -> error', error);
    }
    setModalVisible(false);
  };

  const aceptarFunctionInfo = () => {
    setModalVisible2(false);
  };

  const FlatListMascotas = ({usersDataTotal}) => {
    return (
      <FlatList
        //showsVerticalScrollIndicator={false}
        style={styles.Historial}
        data={usersDataTotal}
        renderItem={item => (
          <UserListItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        nestedScrollEnabled={true}
        //onEndReached={this.makeRemoteRequest()}
        //onEndReachedThreshold={0}
        //initialNumToRender={10}
      />
    );
  };

  const UserListItem = ({item}) => {
    return (
      <View style={styles.ItemUserContainer}>
        <View style={styles.ItemUserData}>
          <View style={styles.textUserContainer}>
            <View style={styles.squarePet}>
              <Image source={{uri: item.item.photo}} style={styles.imgPet} />
            </View>
            <Text style={styles.textItemUser}>{item.item.name}</Text>
          </View>
          <View style={styles.imgContainer}>
            <Image
              source={
                item.item.typePet === 'Dog'
                  ? require('../assets/images/REGISTRO.png')
                  : require('../assets/images/REGISTRO-2.png')
              }
              style={styles.img1}
            />
          </View>
        </View>
        <View style={styles.ItemUserActions}>
          <TouchableOpacity
            style={styles.editUserButton}
            onPress={() =>
              navigation.navigate('AjustesPerfilMascotaExtra', {
                state: 'edit',
                pet: item.item,
              })
            }>
            <EditarBlue style={styles.iconUser} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteUserButton}
            onPress={() => {
              seteliminatePetID(item.item._id);
              user.pets.length > 1
                ? setModalVisible(true)
                : setModalVisible2(true);
            }}>
            <BorrarBlue style={styles.iconUser} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  return (
    <>
      <CustomHeader
        title={'Mis mascotas'}
        navigation={navigation}
        isHome={false}
      />
      <View style={styles.backContainer}>
        <View style={styles.bodyContainer}>
          <Text style={styles.topTitle}>Agregar una nueva mascota</Text>
          <TouchableOpacity
            style={styles.lightbuttonContainer}
            onPress={() =>
              navigation.push('AjustesPerfilMascotaExtra', {
                state: 'add',
              })
            }>
            <Text style={styles.lighttextButton}>Agregar</Text>
          </TouchableOpacity>
          <View style={styles.tableContainer}>
            <Text style={styles.topTitle}>Usuarios registrados:</Text>
            <View style={styles.tableHeadContainer}>
              <View style={styles.tableHead}>
                <Text style={styles.tableHeadText}>Nombres y apellidos</Text>
              </View>
              <View style={styles.tableHead}>
                <Text style={styles.tableHeadText}>Tipo de Usuario</Text>
              </View>
            </View>
            <View style={styles.tableBodyContainer}>
              <FlatListMascotas
                usersDataTotal={user.pets}
                navigation={navigation}
              />
            </View>
          </View>
        </View>
      </View>
      <ModalConfirm
        navigation={navigation}
        title={'¿Está seguro que sea eliminar esta mascota?'}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        cancelarFunction={cancelarFunction}
        aceptarFunction={aceptarFunction}
        aceptarButtonTitle={'Aceptar'}
      />

      <ModalInfo
        navigation={navigation}
        title={'No es posible eliminar, debes tener al menos 1 mascota'}
        modalVisible={modalVisible2}
        setModalVisible={setModalVisible2}
        functionButton={aceptarFunctionInfo}
        buttonTitle={'Aceptar'}
      />
    </>
  );
};

export default MascotasList;

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
  backContainer: {
    backgroundColor: '#122E5C',
    flexDirection: 'row',
  },
  bodyContainer: {
    flex: 6,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: height,
  },
  lightbuttonContainer: {
    width: '100%',
    borderColor: '#122E5C',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 20,
  },
  lighttextButton: {
    color: '#122E5C',
    fontSize: width * 0.038,
    fontFamily: 'ProximaNova-Regular',
    textAlign: 'center',
  },
  tableContainer: {
    marginVertical: 10,
    width: '100%',
  },
  tableHeadContainer: {
    width: '100%',
    borderColor: '#122E5C',
    backgroundColor: '#122E5C',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  tableHead: {
    backgroundColor: '#122E5C',
    width: '36%',
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  tableHeadText: {
    color: 'white',
    fontSize: width * 0.031,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
  },
  tableBodyContainer: {
    width: '100%',
  },
  //FlatList User
  ItemUserContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  ItemUserData: {
    flex: 1,
    width: '70%',
    borderColor: '#F2F2F2',
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
  },
  textUserContainer: {
    // backgroundColor: 'red',
    flex: 3 / 4,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imgContainer: {
    paddingVertical: height * 0.0075,
    flex: 1 / 4,
    width: '100%',
    alignItems: 'center',
  },
  textItemUser: {
    color: '#666666',
    fontSize: width * 0.034,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  ItemUserActions: {
    width: '20%',
    backgroundColor: 'white',
    marginVertical: 5,
    marginLeft: 8,
    flexDirection: 'row',
  },
  editUserButton: {
    width: '50%',
    borderColor: '#122E5C',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  deleteUserButton: {
    width: '50%',
    borderColor: '#122E5C',
    borderWidth: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  iconUser: {
    width: 16,
    height: 16,
    alignSelf: 'center',
  },
  img1: {
    width: width * 0.12,
    height: width * 0.12,
    resizeMode: 'stretch',
  },
  imgPet: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 100,
  },
  squarePet: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: width * 0.12,
    height: width * 0.12,
    borderColor: '#EB8817',
    borderWidth: 2,
    borderRadius: 100,
    alignItems: 'center',
  },
});
