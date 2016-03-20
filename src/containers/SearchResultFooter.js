// Import some code we need
import React, {View, Component, Text, StyleSheet} from 'react-native';
import Button from 'react-native-button';

import styles from './styles';

import {Actions} from 'react-native-router-flux';

// Create our component
var SearchResultFooter = React.createClass({
  render: function() {
    return <View style={styles.searchButton}>
      <View style={styles.searchListButton}>
        <Button onPress={this.onSort}
          style={myStyles.searchListButtonText}>Sắp xếp</Button>
        <Button onPress={this.onSaveSearch}
          style={myStyles.searchListButtonText}>Lưu tìm kiếm</Button>
        <Button onPress={this.onMap}
          style={myStyles.searchListButtonText}>Bản đồ</Button>
      </View>
    </View>
  },
  onSort() {
    Actions.OrderPicker();
  },
  onSaveSearch() {
    console.log("On Save Search pressed!");
  },
  onMap() {
    Actions.SearchResultMap();
  }
});



// Later on in your styles..
var myStyles = StyleSheet.create({
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      color: '#5BB622', 
      fontSize : 16
  },
});

// Make this code available elsewhere
module.exports = SearchResultFooter;
