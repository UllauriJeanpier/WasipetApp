import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

export default class ProductosCanjeablesPromocion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: this.props.route.params.brand,
      petType: this.props.route.params.petType,
    };
  }

  UNSAFE_componentWillMount() {
    console.log(this.state.brand.weights);
  }

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('PromocionesProductoCanjeable', {
            weight: item.weight,
            brand: this.state.brand,
          })
        }
        style={styles.containerProductos}>
        <View style={styles.square} />
        <Text style={styles.squareText}>{item.weight}</Text>
        {/* {item.image !== '' && (<Image style={styles.square} source={{uri: 'https://'+item.photo}} />) } */}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <View style={styles.titleProducto}>
          <Text style={styles.titleProductoText}>ADVANCED</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={styles.txtTop}>PUNTOS</Text>
            <Text style={styles.txtTop2}>10000</Text>
          </View>
          <View style={styles.txtMidArea}>
            <Text style={styles.txtMid}>PRODUCTOS CANJEABLES CON TUS PTS.</Text>
          </View>
          <View style={styles.mgTop}>
            <Text style={styles.nombreProducto}>Advance</Text>
            <Text>
              Descripción de ADVANCE Lorem ipsum dolor sit amet, consectetuer
              adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
              laoreet dolore magna aliquam erat volutpat. 10000
            </Text>
          </View>

          {this.state.brand.weights && (
            <FlatList
              data={this.state.brand.weights}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={this.state.brand.weights.length == 1 ? 1 : 2}
            />
          )}

          {/* <TouchableOpacity style={styles.containerProductos}>
            <View style={styles.square}>
              <Text style={styles.squareText}>800g</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </>
    );
  }
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  mgTop: {
    marginTop: 10,
  },
  titleProducto: {
    alignSelf: 'center',
    backgroundColor: '#154360',
  },
  titleProductoText: {
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  txtTop: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtTop2: {
    backgroundColor: '#D35400',
    color: 'white',
    fontSize: 21,
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  txtMidArea: {
    alignSelf: 'flex-start',
  },
  txtMid: {
    fontSize: 20,
  },
  nombreProducto: {
    color: '#E67E22',
    fontSize: 20,
    fontWeight: 'bold',
  },
  square: {
    marginHorizontal: width * 0.02,
    marginVertical: height * 0.015,
    width: '90%',
    height: '70%',
    backgroundColor: '#1A5276',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 12,
  },
  squareText: {
    color: 'black',
    flex: 1,
    height: 100,
  },
  containerProductos: {
    alignItems: 'center',
    flexDirection: 'column',
    width: width * 0.4,
    height: height * 0.2,
    /* flex: 1,
    marginBottom: 10, */
    backgroundColor: '#D75400',
  },
});
