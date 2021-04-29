import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getUserbytoken} from '../APIRequest/userRequest';
import {getPetbyOwnew} from '../APIRequest/petRequest';
import {getOutstadingProducts} from '../APIRequest/productRequest';
import {getAllBrands} from '../APIRequest/brandRequest';
import DestacadoComponent from '../components/DestacadoComponent';
import {SliderBox} from 'react-native-image-slider-box';
import ImgModalCanje from '../assets/svg/Objeto-inteligente-vectorial';
import Close from '../assets/svg/times-cerrar';
import {connect} from 'react-redux';
import {
  updateFavoritesList,
  updateFavorites,
  updatepoints,
  updateUser,
  refreshPet,
  updateMessage,
} from '../redux/actions/userActions';
import {deauthenticate} from '../redux/actions/authActions';
import Profile from '../assets/svg/menu-perfil';
import Mascota from '../assets/svg/menu-mascota';
import Favoritebroken from '../assets/svg/favorito-broken';
import {CATEGORIAS_HOME, BANNERS_HOME} from '../utils/constantes';
import {API} from '../config';
import {getBannersWasipet} from '../APIRequest/helpRquest';

//import {getAllProducts} from '../APIRequest/productRequest';
import CustomHeader from '../components/header';

class Principal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: null,
      points: null,
      deferreds: null,
      pet: null,
      userName: null,
      outstadings: null,
      brands: null,
      message: null,
      bannersHome: [],
      activedCanjes: true,
      titlePopUp: '',
      visibilityModal: false,
    };
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    this.props.updateFavoritesList(token, id);
    this.props.updateUser(token, id);
    //  this.props.updateFavoritesList(token, id);
    this.props.refreshPet(token, id);
    this.props.updateMessage(token);

    try {
      const user = await getUserbytoken({token, id});
      const pet = await getPetbyOwnew(token);
      const outstadings = await getOutstadingProducts(token);
      const brands = await getAllBrands(token);
      const banners = await getBannersWasipet(token);
      let configBanners = [];
      if (banners.length) {
        banners.map(banner =>
          configBanners.push(`${API}/public/${banner.imagen}`),
        );
      }
      if (user) {
        this.setState({
          favorites: user.favorites,
          points: user.points,
          deferreds: user.deferred_users,
          userPhoto: user.photo,
          userName: user.name,
          pet: pet,
          outstadings: outstadings,
          brands: brands,
          bannersHome: configBanners,
        });
      }
      const message = this.props.user.message;
      if (message.status) {
        this.setState({
          visibilityModal: !message.data.canjesActived,
          activedCanjes: message.data.canjesActived,
          titlePopUp: message.data.messagePopUp || '',
        });
      }
    } catch (err) {
      alert('Error de red, verifique que su equipo este conectado a internet');
    }
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

  async submitCategory(category) {
    let type_descriptions = [];
    if (category == 'Alimentos') {
      type_descriptions.push('Alimentos Secos');
      type_descriptions.push('Alimentos Húmedos');
    } else if (category == 'Fármacos') {
      type_descriptions.push('Antiparasitarios');
      type_descriptions.push('Antipulgas');
    } else if (category == 'Accesorios') {
      type_descriptions.push('Bowls');
      type_descriptions.push('Toallas');
    } else if (category == 'Higiene') {
      type_descriptions.push('Higiene dental');
      type_descriptions.push('Arenas sanitarias');
    } else if (category == 'Nutrición') {
      type_descriptions.push('Vitaminas');
      type_descriptions.push('Minerales');
    }

    //console.log(arrayfilter);
    const arrayfilter = {
      pets: ['Dog', 'Cat'],
      type_descriptions,
    };
    this.props.navigation.push('Canjes', {arrayfilter});
  }

  renderFavorites = () => {
    let {favorites} = this.props.user;
    if (favorites) {
      if (favorites.length !== 0) {
        return (
          <View style={styles.ProductsContainer}>
            <FlatList
              nestedScrollEnabled={true}
              style={styles.Products}
              data={favorites}
              renderItem={this._renderFavoritos}
              horizontal={true}
              contentContainerStyle={styles.flatDestacados}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.emptyContiner}>
            <View style={styles.emptysubContainer}>
              <Favoritebroken width={25} height={25} style={styles.imgempty} />
              <Text style={styles.textEmpty}>
                No tienes ningún favorito hasta la fecha
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.emptyContiner}>
          <View style={styles.emptysubContainer}>
            <Favoritebroken width={25} height={25} style={styles.imgempty} />
            <Text style={styles.textEmpty}>
              No tienes ningún favorito hasta la fecha
            </Text>
          </View>
        </View>
      );
    }
  };
  renderOutstandings = () => {
    if (this.state.outstadings) {
      if (this.state.outstadings.length !== 0) {
        return (
          <View style={styles.ProductsContainer}>
            <FlatList
              nestedScrollEnabled={true}
              style={styles.Products}
              horizontal={true}
              contentContainerStyle={styles.flatDestacados}
              data={this.state.outstadings}
              renderItem={this._renderProductoDestacado}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              /*onEndReached={({distanceFromEnd}) => {
                console.log('distanceFromEnd', distanceFromEnd);
                console.log('this.state.limitItem', this.state.limitItem);
                if (distanceFromEnd < 0) {
                  this.makeRemoteRequest();
                  return;
                }
              }}*/

              onEndReachedThreshold={0.5}
            />
          </View>
        );
      } else {
        <View style={styles.withoutFavorites}>
          <Text>No hay productos para este filtro</Text>
        </View>;
      }
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            //height: height * 0.7,
          }}>
          <ActivityIndicator size="large" color="#122E5C" />
        </View>
      );
    }
  };

  renderCategorias = () => {
    if (CATEGORIAS_HOME.length !== 0) {
      return (
        <View style={styles.ProductsContainer}>
          <FlatList
            nestedScrollEnabled={true}
            style={styles.Products}
            horizontal={true}
            contentContainerStyle={styles.flatDestacados}
            data={CATEGORIAS_HOME}
            renderItem={this._renderCategoria}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            numColumns={1}
            /*onEndReached={({distanceFromEnd}) => {
                console.log('distanceFromEnd', distanceFromEnd);
                console.log('this.state.limitItem', this.state.limitItem);
                if (distanceFromEnd < 0) {
                  this.makeRemoteRequest();
                  return;
                }
              }}*/

            onEndReachedThreshold={0.5}
          />
        </View>
      );
    } else {
      <View style={styles.withoutFavorites}>
        <Text>No hay productos para este filtro</Text>
      </View>;
    }
  };
  _renderCategoria = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.submitCategory(item.name)}
        style={[styles.categoriaItem]}>
        <View
          style={[
            styles.imageCategoriaContainer,
            {backgroundColor: item.color},
          ]}>
          <Image source={item.image} style={styles.icon1} />
        </View>
        <Text style={styles.titleCategoria}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  getBrand = name => {
    const {brands} = this.state;
    return brands.find(e => e.name === name);
  };

  parseName = name => {
    return name.split(' ')[0];
  };

  _renderMascotas = ({item, index}) => {
    return (
      <View style={styles.imgMascota}>
        <View style={styles.squarePet}>
          {!item ? (
            <Mascota
              style={{
                width: width * 0.1,
                height: height * 0.1,
              }}
            />
          ) : (
            <Image
              // source={{uri: photo.uri}}
              source={{
                uri: item.photo,
              }}
              style={styles.photo}
              resizeMode="cover"
            />
          )}
        </View>
        <Text style={styles.nameUser}>{item.name}</Text>
      </View>
    );
  };

  _renderProductoDestacado = ({item, index}) => {
    let {favoritesList} = this.props.user;
    const {activedCanjes} = this.state;
    let favorite = favoritesList.includes(item._id);
    if (this.state.brands) {
      const brand = this.getBrand(item.brand);
      return (
        <DestacadoComponent
          product={item}
          brand={brand}
          type={'producto'}
          navigation={this.props.navigation}
          favorite={favorite ? true : false}
          favoritesList={favoritesList}
          activedCanjes={activedCanjes}
        />
      );
    }
  };
  _renderFavoritos = ({item, index}) => {
    let {favoritesList} = this.props.user;
    const {activedCanjes} = this.state;
    let favorite = favoritesList.includes(item.productid);
    //console.log('Renzo: _renderFavoritos -> favorite', favorite);
    if (this.state.brands) {
      const brand = this.getBrand(item.brand);
      return (
        <DestacadoComponent
          product={item}
          brand={brand}
          type={'favorito'}
          navigation={this.props.navigation}
          favorite={favorite ? true : false}
          favoritesList={favoritesList}
          activedCanjes={activedCanjes}
        />
      );
    }
  };

  render() {
    const user = this.props.user;
    return (
      <View>
        <CustomHeader
          title="Menu"
          isHome="true"
          navigation={this.props.navigation}
        />
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.container}>
            <View style={styles.containerBody}>
              <View style={styles.subContainer}>
                <View style={styles.imgcontainer}>
                  <TouchableOpacity
                    style={styles.square}
                    onPress={() =>
                      this.props.navigation.navigate('AjustePerfil')
                    }>
                    {!this.props.user.perfilphoto ? (
                      <Profile style={styles.photo} />
                    ) : (
                      <Image
                        // source={{uri: photo.uri}}
                        source={{
                          uri: this.props.user.perfilphoto,
                          /*  typeof this.state.userPhoto !== 'undefined'
                                  ? this.props.user.perfilphoto
                                  : this.props.user.perfilphoto, */
                        }}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                  {/* <Text style={styles.nameUser}>
                    {this.state.userName ? this.state.userName : null}
                  </Text> */}
                </View>
                <View style={styles.info}>
                  {this.state.userName && (
                    <Text style={styles.helloText}>
                      Hola {this.parseName(this.state.userName)},
                    </Text>
                  )}
                  <Text style={styles.pointsText}>
                    tienes {user.points} puntos
                  </Text>
                </View>
              </View>

              <View style={styles.subContainerMascotas}>
                <Text style={styles.titleMascotas}>Mis Mascotas</Text>
                {/*    <View style={styles.imgcontainer}> */}
                <FlatList
                  nestedScrollEnabled={true}
                  style={styles.Mascotas}
                  data={this.props.user.pets}
                  renderItem={this._renderMascotas}
                  horizontal={true}
                  contentContainerStyle={styles.containerMascotas}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                />
                {/*   </View> */}
              </View>

              <View style={styles.destacadosContainer}>
                {this.state.bannersHome && this.state.bannersHome.length ? (
                  <SliderBox
                    images={this.state.bannersHome}
                    dotColor="#EB8817"
                    inactiveDotColor="#F2F2F2"
                    //paginationBoxVerticalPadding={20}
                    autoplay
                    style={styles.sliderStyles}
                    circleLoop
                    resizeMode={'contain'}
                    paginationBoxStyle={styles.sliderPagination}
                    imageLoadingColor="#122E5C"
                  />
                ) : null}
              </View>

              <View style={styles.destacadosContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleSections}>Productos destacados</Text>
                </View>
                <View>{this.renderOutstandings()}</View>
              </View>

              <View style={styles.destacadosContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleSections}>Categorías</Text>
                  <View>{this.renderCategorias()}</View>
                </View>
              </View>
              <View style={styles.favoritosContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleSections}>Tus favoritos</Text>
                  <View>{this.renderFavorites()}</View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal transparent={true} visible={this.state.visibilityModal}>
          <View
            onPress={() => {
              this.setState({
                visibilityModal: !this.state.visibilityModal,
              });
            }}
            style={styles.containerfondo}>
            <View activeOpacity={1} style={styles.containerModalfond}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visibilityModal: !this.state.visibilityModal,
                  });
                }}
                style={styles.iconClose}>
                <Close width={width * 0.03} height={width * 0.03} />
              </TouchableOpacity>
              <ImgModalCanje
                width={width * 0.32}
                height={width * 0.32}
                style={styles.iconModal}
              />
              {/* <Text style={styles.preguntaModal}>{title}</Text> */}
              <Text style={styles.preguntaModal}>{this.state.titlePopUp}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.authentication, // session.token , session.user
    user: state.userUpdates,
    favorites: state.updateFavorites,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateFavorites: (token, favorites) => {
      return dispatch(updateFavorites(token, favorites));
    },
    updatepoints: data => {
      return dispatch(updatepoints(data));
    },
    updateFavoritesList: (token, id) => {
      return dispatch(updateFavoritesList(token, id));
    },
    updateUser: (token, id) => {
      return dispatch(updateUser(token, id));
    },
    refreshPet: (token, owner) => {
      return dispatch(refreshPet(token, owner));
    },
    updateMessage: token => {
      return dispatch(updateMessage(token));
    },
    deauthenticate: () => {
      return dispatch(deauthenticate());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Principal);

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
  container: {
    height: 'auto',
    alignItems: 'center',
    backgroundColor: '#122E5C',
  },

  // Info container header ---------------------------------------
  containerBody: {
    marginTop: 10,
    //flex: 6,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    width: '100%',
    //height: height * 1.2,
    flexDirection: 'column',
    paddingVertical: 15,
  },
  subContainer: {
    borderRadius: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
    height: height * 0.15,
    backgroundColor: '#F2F2F2',
  },
  subContainerMascotas: {
    borderRadius: width * 0.05,
    marginVertical: height * 0.02,
    paddingVertical: height * 0.02,
    flexDirection: 'column',
    //height: height * 0.15,
    backgroundColor: '#F2F2F2',
  },
  info: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imgcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgMascota: {
    flex: 1,
    marginHorizontal: width * 0.04,
  },
  img: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  helloText: {
    color: '#666666',
    fontSize: width * 0.055,
    fontFamily: 'ProximaNova-Bold',
    // textAlign: 'center',
  },
  pointsText: {
    color: '#122E5C',
    fontSize: width * 0.055,
    fontFamily: 'ProximaNova-Bold',
    //textAlign: 'center',
  },
  nameUser: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    marginTop: 5,
    fontSize: width * 0.035,
  },
  titleMascotas: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    marginTop: 5,
    alignSelf: 'center',
    marginBottom: height * 0.01,
    fontSize: width * 0.04,
  },
  destacadosContainer: {
    marginVertical: 15,
    width: '100%',
  },
  favoritosContainer: {
    marginTop: 15,
    width: '100%',
    marginBottom: 70,
  },
  titleSections: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.045,
  },

  //-------------------------------------------------------------------

  square2: {
    width: '100%',
    height: '100%',
    //backgroundColor: 'red',
    borderRadius: 15,
  },
  midContainer1: {
    flex: 1,
    flexDirection: 'row',
  },
  toPA: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '2%',
    height: '50%',
  },
  txt: {
    //  flex:1,
    //   margin: 25,
    backgroundColor: 'yellow',
    //  height: '10%',
    alignSelf: 'flex-start',
  },
  square: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: width * 0.16,
    height: width * 0.16,
    borderColor: '#122E5C',
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
  },
  squarePet: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: width * 0.15,
    height: width * 0.15,
    borderColor: '#EB8817',
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
  },
  photo: {
    /*  marginTop: 10,
    marginBottom: 10, */
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 100,
  },
  Products: {
    //flex: 1,
    //backgroundColor: 'yellow',
    width: '100%',
    height: 'auto',
  },
  Mascotas: {
    //width: '100%',
    height: 'auto',
    // backgroundColor: 'red',
  },
  ProductsContainer: {
    backgroundColor: 'white',
    width: '100%',
    //height: height * 0.6,
    //flex: 1,
  },
  flatDestacados: {
    flexDirection: 'row',
    //width: '100%',
  },

  containerMascotas: {
    //flex: 1,
    flexDirection: 'row',
    //alignItems: 'flex-start',
    /* width: '100%',
    justifyContent: 'center',
    alignItems: 'center', */
  },

  // favorites  ----c-------------------------

  withoutFavorites: {
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.02,
    flex: 1,
    width: '90%',
    borderRadius: width * 0.05,
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4D2D2',
  },

  favorites: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
    width: '100%',
  },

  favoriteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    //height: '100%',
    flex: 1,
    width: '100%',
    height: height * 0.1,
    // marginHorizontal: '2%',
    backgroundColor: 'red',
  },
  headerFavorite: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'black',
    // height: '33.3%',
    width: '100%',
  },

  marcaContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  nameProductContainer: {
    flex: 3,
    flexDirection: 'column',
    // height: height*0.03,
    backgroundColor: 'blue',
  },
  textNameProduct: {
    flex: 1,
  },
  textNameCategory: {
    flex: 2,
  },
  bodyFavorite: {
    flex: 1,
    backgroundColor: 'blue',
    //   height: '33.3%',
    width: '100%',
  },
  buttonFavorite: {
    flex: 1,
    backgroundColor: 'green',
    //  height: '33.3%',
    width: '100%',
  },
  // empty view
  emptyContiner: {
    flex: 1,
    height: height * 0.1,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 120,
    //marginVertical: height * 0.05,
  },
  emptysubContainer: {
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    height: height * 0.2,
    justifyContent: 'center',
    padding: width * 0.05,
  },
  imgempty: {
    width: '10%',
    height: '10%',
    resizeMode: 'contain',
    marginBottom: height * 0.05,
  },
  textEmpty: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: height * 0.018,
    color: '#B3B3B3',
  },
  //Categorias
  categoriaItem: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCategoria: {
    color: '#122E5C',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Bold',
  },
  imageCategoriaContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  //Slider Home
  sliderStyles: {
    borderRadius: 20,
    height: height * 0.25,
    width: '90%',
  },
  sliderPagination: {
    position: 'absolute',
    bottom: 0,
    padding: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  // Modal de Canjes

  containerfondo: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerModalfond: {
    backgroundColor: '#ffffff',
    //marginTop: height * 0.4,
    alignSelf: 'center',
    padding: width * 0.1,
    width: '75%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preguntaModal: {
    color: '#122E5C',
    fontSize: width * 0.03,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  iconModal: {
    resizeMode: 'center',
    width: 10,
    height: 10,
    marginVertical: height * 0.01,
  },
  iconClose: {
    position: 'absolute',

    padding: width * 0.04,
    top: 0,
    right: 0,
  },
});
