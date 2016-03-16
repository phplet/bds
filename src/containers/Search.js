'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';



import React, { Text, View, Component, Navigator } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

import LikeTabButton from '../components/LikeTabButton';

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



class Search extends Component {
  constructor() {
    super();
  }

  _onLoaiTinChange(value) {
    this.props.actions.onSearchFieldChange("loaiTin", value);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchFilter}>
          <View style={styles.searchFilterButton}>

            <View onPress={this.onForSale} style = {{flex:1, flexDirection: 'row'}}>
              <LikeTabButton name={'ban'} 
                onPress={this._onLoaiTinChange.bind(this)} 
                selected={this.props.search.form.fields.loaiTin === 'ban'}>Bán</LikeTabButton>
              <LikeTabButton name={'thue'} 
                onPress={this._onLoaiTinChange.bind(this)} 
                selected={this.props.search.form.fields.loaiTin === 'thue'}>Cho thuê</LikeTabButton> 
            </View>

          </View>
          <View style={styles.searchFilterDetail}>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome}>
              Giá
              </Text>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome} onPress={this.onChosePropertyTypes}>
              Loại nhà đất
              </Text>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Text style={styles.welcome}>
              Diện tích
              </Text>
            </View>
          </View>
          <View style={styles.searchMoreFilterButton}>
            <View style={styles.searchFilterAttribute}>
              <Button onPress={this.onMoreOption}>Thêm</Button>
            </View>
            <View style={styles.searchFilterAttribute}>
              <Button onPress={this.onResetFilters}>Thiết lập lại</Button>
            </View>
          </View>
        </View>
        <View style={styles.searchButton}>
          <View style={styles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={styles.searchButtonText}>Thoát</Button>
            <Button onPress={this.onApply}
            style={styles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>
      </View>
    );
  }
  onCancel() {
    Actions.pop();
  }
  onApply() {
    Actions.SearchResultList();
  }
  onForSale() {
    console.log("On For Sale pressed!");
  }
  onForRent() {
    console.log("On For Rent pressed!");
  }
  onMoreOption() {
    console.log("On More Option pressed!");
  }
  onResetFilters() {
    console.log("On Reset Filters pressed!");
  }

  onChosePropertyTypes() {
    Actions.PropertyTypes();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
