/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
'use strict'
import {
  createStackNavigator,
} from 'react-navigation'
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';
import SearchPage from './SearchPage';
import SearchResults from './SearchResults';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on\n' +
    'Shake menu button for dev menu',
});


const App = createStackNavigator({
  Home: { screen: SearchPage },
  Results: { screen: SearchResults },
});

export default App;
