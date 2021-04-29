import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {color} from 'react-native-reanimated';
import FiltroAplicado from '../assets/svg/filtro-aplicado';
import CustomHeader from '../components/header';

export default class Canjes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Dog: false,
      Cat: false,
      AlimentoSeco: false,
      AlimentoHumedo: false,
      SuperPremiunNormal: false,
      HighPremiun: false,
      Manteinace: false,
      Specialities: false,
      Raza: false,
      VeterinariaDiets: false,
      Vitaminas: false,
      Minerales: false,
      Antiparasitarios: false,
      Antipulgas: false,
      HigieneBucal: false,
      Arenas: false,
      Bowls: false,
      Toallas: false,
    };
    this.getStoreData = this.getStoreData.bind(this);
  }

  async submitButton() {
    const token = await this.getStoreData('token');
    let pets = [];
    let type_descriptions = [];
    let type_detail_categories = [];
    let type_detail_descriptions = [];

    Object.keys(this.state).forEach(key => {
      if (this.state[key]) {
        if (key == 'Dog' || key == 'Cat') {
          pets.push(key);
        }
        if (key == 'AlimentoSeco') {
          type_descriptions.push('Alimentos Secos');
        }
        if (key == 'AlimentoHumedo') {
          type_descriptions.push('Alimentos Húmedos');
        }
        if (
          key === 'Vitaminas' ||
          key === 'Minerales' ||
          key === 'Antiparasitarios' ||
          key === 'Antipulgas' ||
          key === 'Bowls'
        ) {
          type_descriptions.push(key);
        }
        if (key === 'HigieneBucal') {
          type_descriptions.push('Higiene dental');
        }
        if (key === 'Arenas') {
          type_descriptions.push('Arenas sanitarias');
        }
        if (key === 'Toallas') {
          type_descriptions.push('Toallas');
        }
        if (key === 'SuperPremiunNormal') {
          type_detail_categories.push('Super Premium');
        }
        if (key === 'HighPremiun') {
          type_detail_categories.push('High Premium');
        }
        if (key === 'Manteinace') {
          type_detail_descriptions.push('Manteinace');
        }
        if (key === 'Specialities') {
          type_detail_descriptions.push('Specialities');
        }
        if (key === 'Raza') {
          type_detail_descriptions.push('Raza');
        }
        if (key === 'VeterinariaDiets') {
          type_detail_descriptions.push('Veterinary Diets');
        }
      }
    });

    const arrayfilter = {
      pets: pets.length !== 0 ? pets : ['Dog', 'Cat'],
      type_descriptions:
        type_descriptions.length !== 0 ? type_descriptions : null,
      type_detail_categories:
        type_detail_categories.length !== 0 ? type_detail_categories : null,
      type_detail_descriptions:
        type_detail_descriptions.length !== 0 ? type_detail_descriptions : null,
    };

    this.props.navigation.push('Canjes', {arrayfilter});
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

  render() {
    return (
      <>
        <ScrollView>
          <CustomHeader
            title={'Canjes'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View styles={styles.backGeneral}>
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <View style={styles.titleProducto}>
                  <Text style={styles.titleProductoText}>Filtros</Text>
                </View>
                <View style={styles.applyContainer}>
                  <TouchableOpacity
                    style={styles.bottonIcon}
                    onPress={() => this.submitButton()}>
                    <Text style={styles.textBottonIcon}>Aplicar filtros</Text>
                    <FiltroAplicado width={20} height={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Mascota</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      style={
                        this.state.Dog ? styles.button : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({Dog: !prevState.Dog}))
                      }>
                      <Text
                        style={
                          this.state.Dog
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Perro
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        this.state.Cat ? styles.button : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({Cat: !prevState.Cat}))
                      }>
                      <Text
                        style={
                          this.state.Cat
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Gato
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Alimentos</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      style={
                        this.state.AlimentoSeco
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          AlimentoSeco: !prevState.AlimentoSeco,
                          HighPremiun: false,
                          SuperPremiunNormal: false,
                          Manteinace: false,
                          Raza: false,
                          Specialities: false,
                          VeterinariaDiets: false,
                        }))
                      }>
                      <Text
                        style={
                          this.state.AlimentoSeco
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Alimentos Secos
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        this.state.AlimentoHumedo
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          AlimentoHumedo: !prevState.AlimentoHumedo,
                        }))
                      }>
                      <Text
                        style={
                          this.state.AlimentoHumedo
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Alimentos Húmedos
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      disabled={!this.state.AlimentoSeco}
                      style={
                        !this.state.AlimentoSeco
                          ? styles.buttonDisabled
                          : this.state.SuperPremiunNormal
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          SuperPremiunNormal: !prevState.SuperPremiunNormal,
                          Manteinace: false,
                          Raza: false,
                          Specialities: false,
                          VeterinariaDiets: false,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.AlimentoSeco
                            ? styles.textbuttonDisabled
                            : this.state.SuperPremiunNormal
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Super Premium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={!this.state.AlimentoSeco}
                      style={
                        !this.state.AlimentoSeco
                          ? styles.buttonDisabled
                          : this.state.HighPremiun
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          HighPremiun: !prevState.HighPremiun,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.AlimentoSeco
                            ? styles.textbuttonDisabled
                            : this.state.HighPremiun
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        High Premium
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      disabled={!this.state.SuperPremiunNormal}
                      style={
                        !this.state.SuperPremiunNormal
                          ? styles.buttonDisabled
                          : this.state.Manteinace
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Manteinace: !prevState.Manteinace,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.SuperPremiunNormal
                            ? styles.textbuttonDisabled
                            : this.state.Manteinace
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Manteinace
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={!this.state.SuperPremiunNormal}
                      style={
                        !this.state.SuperPremiunNormal
                          ? styles.buttonDisabled
                          : this.state.Specialities
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Specialities: !prevState.Specialities,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.SuperPremiunNormal
                            ? styles.textbuttonDisabled
                            : this.state.Specialities
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Specialities
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      disabled={!this.state.SuperPremiunNormal}
                      style={
                        !this.state.SuperPremiunNormal
                          ? styles.buttonDisabled
                          : this.state.Raza
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Raza: !prevState.Raza,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.SuperPremiunNormal
                            ? styles.textbuttonDisabled
                            : this.state.Raza
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Raza
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={!this.state.SuperPremiunNormal}
                      style={
                        !this.state.SuperPremiunNormal
                          ? styles.buttonDisabled
                          : this.state.VeterinariaDiets
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          VeterinariaDiets: !prevState.VeterinariaDiets,
                        }))
                      }>
                      <Text
                        style={
                          !this.state.SuperPremiunNormal
                            ? styles.textbuttonDisabled
                            : this.state.VeterinariaDiets
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Veterinary Diets
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Nutricionales</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      style={
                        this.state.Vitaminas
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Vitaminas: !prevState.Vitaminas,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Vitaminas
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Vitaminas
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        this.state.Minerales
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Minerales: !prevState.Minerales,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Minerales
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Minerales
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Farmacos</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      style={
                        this.state.Antiparasitarios
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Antiparasitarios: !prevState.Antiparasitarios,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Antiparasitarios
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Antiparasitarios
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        this.state.Antipulgas
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Antipulgas: !prevState.Antipulgas,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Antipulgas
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Antipulgas
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Higiene y aseo</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.colum}>
                    <TouchableOpacity
                      style={
                        this.state.HigieneBucal
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          HigieneBucal: !prevState.HigieneBucal,
                        }))
                      }>
                      <Text
                        style={
                          this.state.HigieneBucal
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Higiene dental
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        this.state.Arenas
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Arenas: !prevState.Arenas,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Arenas
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Arenas sanitarias
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.filterContainer}>
                <View style={styles.textFilterContainer}>
                  <Text style={styles.titleSegmentFilter}>Accesorios</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.columFinal}>
                    <TouchableOpacity
                      style={
                        this.state.Bowls
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Bowls: !prevState.Bowls,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Bowls
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Bowls
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        this.state.Toallas
                          ? styles.button
                          : styles.buttonUnSelected
                      }
                      onPress={() =>
                        this.setState(prevState => ({
                          Toallas: !prevState.Toallas,
                        }))
                      }>
                      <Text
                        style={
                          this.state.Toallas
                            ? styles.textbutton
                            : styles.textbuttonUnSelected
                        }>
                        Toallas
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.filterContainerButton}>
                <TouchableOpacity
                  style={styles.buttonAplicar}
                  onPress={() => this.submitButton()}>
                  <FiltroAplicado width={20} height={20} />
                  <Text style={styles.textoAplicar}>Aplicar filtros</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

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
  backGeneral: {backgroundColor: 'red', height: '100%', flex: 6},
  container: {
    //marginHorizontal: '5%',
    paddingVertical: height * 0.05,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  applyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottonIcon: {
    flexDirection: 'row',
  },
  textBottonIcon: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.042,
    marginRight: 5,
  },
  titleProducto: {},
  titleProductoText: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.055,
  },

  // filter containers styles ---------------------------
  filterContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    marginVertical: height * 0.02,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingVertical: 10,
  },
  filterContainerButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    marginVertical: height * 0.02,
    //backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingVertical: 10,
  },

  textFilterContainer: {
    flex: 1,
    //height: height * 0.1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    //flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colum: {
    //backgroundColor: 'red',
    //flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columFinal: {
    //backgroundColor: 'red',
    //flex: 1,
    flexDirection: 'row',
    width: '100%',

    //justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    backgroundColor: '#122E5C',
    marginHorizontal: height * 0.015,
    marginVertical: height * 0.01,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: '#122E5C',
    borderWidth: 1,
    //height: height * 0.05,
    borderRadius: width * 0.03,
  },
  textbutton: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.032,
  },
  buttonUnSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    backgroundColor: 'white',
    marginHorizontal: height * 0.015,
    marginVertical: height * 0.01,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: '#122E5C',
    borderWidth: 1,
    borderRadius: width * 0.03,
  },
  textbuttonUnSelected: {
    textAlign: 'center',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.032,
  },
  buttonDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    backgroundColor: '#B3B3B3',
    marginHorizontal: height * 0.015,
    marginVertical: height * 0.01,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: '#B3B3B3',
    borderWidth: 1,
    borderRadius: width * 0.03,
  },
  textbuttonDisabled: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.032,
  },
  // Button submit
  submitButton: {
    flex: 1,
    width: '80%',
    height: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  titleSegmentFilter: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.06,
  },
  buttonAplicar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    //bottom: 35,
    marginTop: height * 0.02,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
    flexDirection: 'row',
  },
  textoAplicar: {
    marginLeft: 5,
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
});
