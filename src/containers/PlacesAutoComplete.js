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



import React, { Text, View, Component, ListView
    , TextInput, StyleSheet,RecyclerViewBackedScrollView
    , TouchableHighlight} from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';


//import styles from '../containers/styles';

import api from '../lib/FindApi';
var gui = require("../lib/gui");


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

var {GooglePlacesAutocomplete} = require('../components/GooglePlacesAutocomplete');

//const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};

class PlacesAutoComplete extends React.Component {
    constructor(props) {
        super(props);
    }
    _onPress(data, details = null) {
        //console.log(data);
        console.log("You selected: " + data.fullName);
        console.log(data);
        console.log(details);
        //console.log(details);
        //let value = details;
        let value = {
            placeId : data.place_id,
            relandTypeName : data.relandTypeName,
            fullName: data.fullName,
            currentLocation : data.currentLocation
        };

        //value.fullName = details.name;
        //console.log(data);
        console.log(value);

        this.props.actions.onSearchFieldChange("place", value);

        //if not call from Search page, then need perform action
        if (this.props.needReload) {
            this.props.actions.search(
                this.props.search.form.fields
                , () => {
                    Actions.pop();
                }
            );
        } else {
            Actions.pop();
        }
    }

    _onCancelPress() {
        Actions.pop();
    }

    render() {
        return (

        <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                fetchDetails={false}
                onPress = {this._onPress.bind(this)}
                onCancelPress = {this._onCancelPress.bind(this)}
                onPress_original={(data, details = null) => { // 'details' is provided when fetchDetails = true

        }}
                getDefaultValue={() => {
          return ''; // text input default value
        }}
                query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
          language: 'en', // language of the results
          //types: 'geocode', // default: 'geocode', cities,regions
          components:'country:vn' //restrict to VN

        }}
                styles={{
          description: {
            //fontWeight: 'bold',
            fontFamily : gui.fontFamily,
            fontSize: 15,
            marginLeft:20,
            marginRight: 20
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
          container: {
            top:20,
            backgroundColor: 'white'
          },
          row : {
            height: 44
          },
          separator:{
            backgroundColor: "#E9E9E9",
            marginLeft: 20,
            marginRight: 20
          }
        }}

                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='GoogleReverseGeocoding' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
                GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          //rankby: 'distance',
          //types: 'food',
        }}


                //filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                //predefinedPlaces={[homePlace, workPlace]}

                predefinedPlacesAlwaysVisible={true}
            />
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlacesAutoComplete);