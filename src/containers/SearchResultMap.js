'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';


import React, { Text, View, Component, StyleSheet, Navigator, TouchableOpacity } from 'react-native'

import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../lib/MapApi';
import styles from './styles';
import SearchHeader from '../components/SearchHeader';

import gui from '../lib/gui';

import MapView from 'react-native-maps';
import MMapMarker from '../components/MMapMarker';

import TopModal from '../components/TopModal';

/**
* ## Redux boilerplate
*/
const actions = [
  globalActions,
  searchActions
];

function mapStateToProps(state) {
  return {
      ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
          .merge(...actions)
          .filter(value => typeof value === 'function')
          .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

class SearchResultMap extends Component {

  constructor(props) {
    super(props);
    this.state ={
      modal: false,
      mapType: "standard",
    }
  }

  render() {
    var markerList = [];

    if (this.props.search.form.fields.listData) {
      let i = 0;
      this.props.search.form.fields.listData.map(function(item){
        if (item.hdLat && item.hdLong) {
          let marker = {
            coordinate: {latitude: item.hdLat, longitude: item.hdLong},
            price: item.price_value,
            unit: item.price_unit,
            id: i,
            cover: item.cover,
            diaChi: item.diaChi,
            dienTich: item.dienTich
          }
          markerList.push(marker);
          i++;
        }
      });

    }

    var region = {
      latitude: (markerList[0] ? markerList[0].coordinate.latitude : 10.75759410858154),
      longitude: (markerList[0] ? markerList[0].coordinate.longitude : 106.7169036865234),
      latitudeDelta: 0.0461,
      longitudeDelta: 0.0211,
    };

    if (this.state && this.state.region) {
      region = this.state.region;
    }

    var mapType = this.state.mapType;

    return (
      <View style={styles.fullWidthContainer}>
        <View style={myStyles.search}>
            <SearchHeader />
        </View>
        <View  style={myStyles.map}>
        <MapView 
          region={region}
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          onPress={this._onPress()}
          onMarkerPress={this._onMarkerPress.bind(this)}
          onMarkerSelect={this.props.openModal}
          style={myStyles.mapView}
          mapType={this.state.mapType}
        >
          {markerList.map( marker =>(
            <MMapMarker marker={marker}>
            </MMapMarker>
          ))}
        </MapView>
        <View style={myStyles.buttonContainer}>
          <TouchableOpacity onPress={this._onSatellitePress.bind(this)} style={[myStyles.bubble, myStyles.button]}>
            <Text style={myStyles.text}>Satellite</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onHybridPress.bind(this)} style={[myStyles.bubble, myStyles.button]}>
            <Text style={myStyles.text}>Hybrid</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onStandardPress.bind(this)} style={[myStyles.bubble, myStyles.button]}>
            <Text style={myStyles.text}>Standard</Text>
          </TouchableOpacity>
        </View>
        </View>

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchListButton}>
            <Icon.Button onPress={this._onLocalInfoPressed}
              name="location-arrow" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Local Info
            </Icon.Button>
            <Icon.Button onPress={this._onSaveSearchPressed}
              name="hdd-o" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Lưu tìm kiếm
            </Icon.Button>
            <Icon.Button onPress={this._onListPressed}
              name="list" backgroundColor="white"
              underlayColor="gray" color={gui.blue1}
              style={myStyles.searchListButtonText} >
              Danh sách
            </Icon.Button>
          </View>
        </View>

        {this.state.modal ? <TopModal closeModal={() => this.setState({modal: false}) }/> : null }
      </View>
    )
  }

  onRegionChangeComplete(region) {
    console.log("Region changed");
    console.log(region);
    
    var latMax = region.latitude + region.latitudeDelta/2;
    var lonMax = region.longitude + region.longitudeDelta/2;
    var latMin = latMax - region.latitudeDelta;
    var lonMin = lonMax - region.longitudeDelta;

    console.log(latMin + "," + lonMin + ',' + latMax + "," + lonMax);   

    this.setState({
      region: region
    });
  }

  _onSatellitePress(){
    this.setState({
      mapType: "satellite"
    });
  }

  _onHybridPress(){
    this.setState({
      mapType: "hybrid"
    });
  }

  _onStandardPress(){
   this.setState({
      mapType: "standard"
    });
  }  

  _onMarkerSelect() {
    console.log("marker select") 
    this.setState({modal: true});
  }

  _onMarkerPress(event) {
    console.log("marker presssssss") ;
    //console.log(event) 
    this.setState({modal: true});
  }

  _onPress(event){
    //console.log(event);
  }

  _onLocalInfoPressed() {
    console.log("On Local Info pressed!");
  }

  _onSaveSearchPressed() {
    console.log("On Save Search pressed!");
  }

  _onListPressed() {
    Actions.pop();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultMap);

// Later on in your styles..
var myStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchListButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
  },

  map: {
    flex: 1,
    marginTop: 30,
    marginBottom: 0
  },

  mapView: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0
  },

  searchListButton: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
  },

  searchButton: {
      alignItems: 'stretch',
      justifyContent: 'flex-end',
  },

  search: {
      top:0,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
  },
  bubble: {
    backgroundColor: gui.blue1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
  },
  button: {
    width: 70,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
});
