import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  processColor,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ArrowLeftWhite from '../assets/svg/arrow-left-white';
import Menu from '../assets/svg/menu-white';
import LogoWasipet from '../assets/svg/logo_WASIPET';

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.getStoreData = this.getStoreData.bind();
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

  // {isHome, title, navigation}
  render() {
    const {isHome, title, navigation, actived} = this.props;
    console.log(actived);
    return (
      <View
        style={
          isHome ? styles.backgroundHeader : styles.backgroundHeaderTitles
        }>
        <View style={styles.containerArrow}>
          {isHome ? (
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.openDrawer()}>
                <Menu style={styles.arrowLeft} />
              </TouchableOpacity>
            </View>
          ) : actived !== 'no' ? (
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <ArrowLeftWhite style={styles.arrowLeft} />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </View>
        {isHome ? (
          <View style={styles.textHeaderImage}>
            <LogoWasipet width={180} height={60} />
          </View>
        ) : (
          <View style={styles.textHeaderContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
      </View>
    );
  }
}

const paddinTopGeneral = Platform.OS === 'ios' ? 40 : 10;
const heightHeader = Platform.OS === 'ios' ? 95 : 65;
const styles = StyleSheet.create({
  backgroundHeader: {
    flexDirection: 'row',
    height: heightHeader,
    width: '100%',
    //alignSelf: 'center',
    //backgroundColor: '#122E5C',
    backgroundColor: '#122E5C',
    paddingLeft: 20,
    paddingTop: paddinTopGeneral,
  },
  backgroundHeaderTitles: {
    flexDirection: 'row',
    height: heightHeader,
    width: '100%',
    //backgroundColor: '#122E5C',
    backgroundColor: '#122E5C',
    paddingHorizontal: 20,
    paddingTop: paddinTopGeneral,
  },
  containerArrow: {
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  arrowLeft: {
    width: 25,
    height: 25,
    color: 'white',
  },
  textHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
  },
  textHeaderImage: {
    flexDirection: 'row-reverse',
    width: '85%',
  },
  titleText: {
    textAlign: 'right',
    color: 'white',
    fontSize: 25,
    fontFamily: 'ProximaNova-Bold',
  },
});
