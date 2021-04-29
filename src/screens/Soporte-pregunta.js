import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../components/header';
export default class SoportePregunta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.route.params.soporte.title,
      type: null,
      description: this.props.route.params.soporte.description,
    };
  }
  render() {
    return (
      <ScrollView styles={{backgroundColor: 'white'}}>
        <CustomHeader
          title={'FAQ'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.container}>
          <View style={styles.containerText}>
            <Text style={styles.txtTop}>{this.state.title}</Text>
            <Text style={styles.txtLorem}>{this.state.description}</Text>
            {/* <Text style={styles.txtTop}>Política de privacidad:</Text>
            <Text style={styles.txtLorem}>
              Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
              exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
              commodo consequat. Lorem ipsum dolor sit amet, consectetuer
              adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
              laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim
              veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
              nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure
              dolor in hendrerit in vulputate velit esse molestie consequat, vel
              illum dolore eu feugiat nulla facilisis at vero eros et accumsan
              et iusto odio dignissim qui blandit praesent luptatum zzril
              delenit augue duis dolore te feugait nulla facilisi.
            </Text> */}
            <View
              style={{
                flex: 1.5,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.texto}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: height - 65,
  },
  containerText: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
  txtTop: {
    // flex: 1.5,
    fontSize: 20,
    color: '#212F3C',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5,
    fontFamily: 'ProximaNova-Bold',
  },
  txtLorem: {
    flex: 5,
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'ProximaNova-Regular',
    marginVertical: 10,
    color: '#212F3C',
  },
  button: {
    justifyContent: 'center',
    width: '100%',
    // height: '100%',
    alignItems: 'center',
    backgroundColor: '#122E5C',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: height * 0.12,
    borderColor: '#122E5C',
    borderWidth: width * 0.004,
  },
  texto: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: 'white',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
});
