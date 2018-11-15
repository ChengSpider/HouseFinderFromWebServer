'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  Animated,
  Easing,
} from 'react-native';

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    xPosition: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2000,              // Make it take a while
        useNativeDriver: true,
        easing: Easing.linear,
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

class ListItem extends React.PureComponent {
    _onPress = () => {
      this.props.onPressItem(this.props.item);
    }
  
    render() {
      const item = this.props.item;
      const price = item.price_formatted.split(' ')[0];
      return (
        <TouchableHighlight
          onPress={this._onPress}
          underlayColor='#dddddd'>
          <FadeInView>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb} source={{ uri: item.img_url }} />
              <View style={styles.textContainer}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.title}
                  numberOfLines={2}>{item.title}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </FadeInView>
        </TouchableHighlight>
      );
    }
}

type Props = {};
export default class SearchResults extends Component<Props> {
  static navigationOptions = {
    title: 'Results',
  };

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => {
    return (
        <ListItem
            item={item}
            index={index}
            onPressItem={this._onPressItem}
        />
    );
  };

  _onPressItem = (index) => {
    console.log("Pressed row: "+index);
    alert("Pressed row: " + index.title);
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <FlatList
        data={params.listings}
        ItemSeparatorComponent = {this.ItemSeparatorComponent}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
    thumb: {
      width: 80,
      height: 80,
      marginRight: 10
    },
    textContainer: {
      flex: 1
    },
    separator: {
      height: 1,
      backgroundColor: '#dddddd'
    },
    price: {
      fontSize: 25,
      fontFamily: 'Times New Roman',
      fontWeight: 'bold',
      color: '#48BBEC'
    },
    title: {
      fontSize: 20,
      fontFamily: 'Times New Roman',
      color: '#656565'
    },
    rowContainer: {
      flexDirection: 'row',
      padding: 10
    },
  });