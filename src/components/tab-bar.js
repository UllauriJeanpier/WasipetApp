import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Cupones from '../screens/Cupones';
import Principal from '../screens/Principal';
import Historial from '../screens/Historial';
import Scan from '../screens/Scan';
import Canjes from '../screens/Canjes';
import Home from '../assets/svg/inicio';
import CuponIcon from '../assets/svg/cupones';
import CanjesIcon from '../assets/svg/canjes';
import HistorialIcon from '../assets/svg/historial';

import Drawer from './drawer';

import CamButton from './CameraButton';

const Tab = createBottomTabNavigator();

export default class TabBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="Principal"
        tabBarTextFontFamily="ProximaNova-Regular"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Principal') {
              iconName = focused ? (
                <View>
                  <Home width={25} height={25} style={{marginBottom: 2}} />
                </View>
              ) : (
                <View>
                  <Home width={25} height={25} style={{marginBottom: 2}} />
                </View>
              );
            } else if (route.name === 'Cupones') {
              iconName = focused ? (
                <CuponIcon width={25} height={25} style={{marginBottom: 2}} />
              ) : (
                <CuponIcon width={25} height={25} style={{marginBottom: 2}} />
              );
            } else if (route.name === 'Canjes') {
              iconName = focused ? (
                <CanjesIcon width={25} height={25} style={{marginBottom: 2}} />
              ) : (
                <CanjesIcon width={25} height={25} style={{marginBottom: 2}} />
              );
            } else if (route.name === 'Historial') {
              iconName = focused ? (
                <HistorialIcon
                  width={25}
                  height={25}
                  style={{marginBottom: 2}}
                />
              ) : (
                <HistorialIcon
                  width={25}
                  height={25}
                  style={{marginBottom: 2}}
                />
              );
            }
            return iconName;

            // You can return any component that you like here!
            //return <View style={{width: 25, height: 25}}> iconName </View>;
          },
        })}
        tabBarOptions={{
          style: styles.tabBarStyle,
          activeTintColor: '#EB8817',
          inactiveTintColor: 'white',
        }}>
        <Tab.Screen
          name="Principal"
          component={Principal}
          style={{fontFamily: 'ProximaNova-Regular'}}
        />
        <Tab.Screen name="Cupones" component={Cupones} />
        <Tab.Screen
          name="Scan"
          component={Scan}
          options={{
            title: '',
            tabBarIcon: ({focused, color, size}) => (
              <CamButton navigation={this.props.navigation} />
            ),
          }}
        />
        {/* canjes */}
        <Tab.Screen name="Canjes" component={Canjes} />
        <Tab.Screen name="Historial" component={Historial} />
      </Tab.Navigator>
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
  tabBarStyle: {
    backgroundColor: '#122E5C',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    height: height * 0.1,
    paddingVertical: 5,
    fontFamily: 'ProximaNova-Regular',
  },
});
