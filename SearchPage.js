'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';

import {ImageBackground} from 'react-native';

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

function urlForQueryAndPage(key, value, pageNumber) {
    const data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber,
    };
    data[key] = value;
    const querystring = Object.keys(data)
      .map(key => key + '=' + encodeURIComponent(data[key]))
      .join('&');
    return 'https://api.nestoria.co.uk/api?' + querystring;
}

function sortByPrice(a, b) {
  return a.price - b.price;
}

type Props = {};
export default class SearchPage extends Component<Props> {
  static navigationOptions = {
    title: 'Property Finder',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
    };
  }

  _onSearchTextChanged = (event) => {
    this.setState({ searchString: event.nativeEvent.text });
  };

  _executeQuery = (query) => {
    console.log(query);
    this.setState({ isLoading: true });
    var fetchArr = fetch(query)
        .then(response => response.json())
        .then(json => this._handleResponse(json.response))
        .catch(error => 
            this.setState({
                isLoading: false,
                message: 'Something bad happened' + error
        }));
  };
  
  _onSearchPressed = () => {
    const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  };

  _handleResponse = (response) => {
    this.setState({ isLoading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      this.props.navigation.navigate (
        /* This is part for sorting array by price array.sort(sortByPrice) */
          'Results', {listings: response.listings.sort(sortByPrice)}
      );
    } else {
      this.setState({ message: 'Location not recognized.\nPlease try again.'});
    }
  };

  render() {
    const spinner = this.state.isLoading?
        <ActivityIndicator size='large'/> : null;
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./Resources/background.png')} style={styles.imageDeco}>
          <Text style={styles.titleDescription}>
            Search for houses to buy!
          </Text>
          <Text style={styles.description}>
            Search by place-name or postcode.
          </Text>
          <FadeInView style={styles.flowRight}>
              <TextInput
                  underlineColorAndroid={'transparent'}
                  style={styles.searchInput}
                  value={this.state.searchString}
                  onChange={this._onSearchTextChanged}
                  placeholder='Search via name or postcode'/>
              <Button
                  onPress={this._onSearchPressed}
                  color='#48BBEC'
                  title='Go'
              />
          </FadeInView>
          <Image source={require('./Resources/house.png')} style={styles.image}/>
          {spinner}
          <Text style={styles.description}>{this.state.message}</Text>
          </ImageBackground>
      </View>
    );
  }
}

let randomHex = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const styles = StyleSheet.create({
    imageDeco:{
      flex:1,
      width: '100%',
      height: '100%',
    },
    titleDescription: {
      marginTop: 65,
      fontSize: 32,
      fontFamily: 'Times New Roman',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'orange',
    },
    description: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 24,
        fontFamily: 'Times New Roman',
        textAlign: 'center',
        color: 'tomato'
    },
    container: {
        height: '100%',
        alignItems: 'center',
        width: '100%',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginLeft: 30,
        marginRight: 30,
      },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC',
    },
    image: {
        marginTop: 30,
        width: 217,
        height: 138,
        alignSelf: 'center'
    },
});