import React, {Component} from 'react';

import gui from '../../lib/gui';

var {
  StyleSheet,
  View,
  Text,
} = require('react-native');

class PriceMarker2 extends React.Component{
  constructor(){
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, {backgroundColor: this.props.color, borderColor: "white",
              flexDirection: 'row', justifyContent: 'space-between'}]}>
          <Text style={[styles.amount, { fontSize: this.props.fontSize }]}>{this.props.amount} </Text>
          <View style={styles.dupView}>
            <Text style={styles.dupText}>{this.props.duplicate}</Text>
          </View>
        </View>
        <View style={[styles.arrowBorder,{borderTopColor: this.props.color}]} />
        <View style={[styles.arrow, {borderTopColor: this.props.color}]} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  dupView: {
    borderColor: 'white',
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dupText: {
    fontFamily: gui.fontFamily,
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
    backgroundColor: 'transparent'
  },
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#FF5A5F',
    padding: 2,
    borderRadius: 3,
    borderTopRightRadius: 11.5,
    borderBottomRightRadius: 11.5,
    borderColor: '#D23F44',
    borderWidth: 0.5,
    paddingRight: 2
  },
  unit: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  amount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

module.exports = PriceMarker2;
