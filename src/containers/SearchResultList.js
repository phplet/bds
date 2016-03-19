'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Map
 */
import {Map} from 'immutable';



import React, { Text, View, Component, Image, ListView, RecyclerViewBackedScrollView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Api from '../components/Api';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';


/**
* ## Redux boilerplate
*/
const actions = [
  globalActions
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



class SearchResultList extends Component {
  constructor(props) {
    super(props);
  }
  isChangeSearchFilter() {
    var _loaiTin = this.props.search.form.fields.loaiTin;
    var _loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var _gia = this.props.search.form.fields.gia;
    var _soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var _soTang = this.props.search.form.fields.soTang;
    var _dienTich = this.props.search.form.fields.dienTich;
    var _orderBy = this.props.search.form.fields.orderBy;

    var loaiTin = null;
    var loaiNhaDat = null;
    var gia = null;
    var soPhongNgu = null;
    var soTang = null;
    var dienTich = null;
    var orderBy = null;
    var loaded = false;
    if (this.state) {
      loaiTin = this.state.loaiTin;
      loaiNhaDat = this.state.loaiNhaDat;
      gia = this.state.gia;
      soPhongNgu = this.state.soPhongNgu;
      soTang = this.state.soTang;
      dienTich = this.state.dienTich;
      orderBy = this.state.orderBy;
      loaded = this.state.loaded;
    }
    if (loaded && _loaiTin === loaiTin && _loaiNhaDat === loaiNhaDat
      && _gia === gia && _soPhongNgu === soPhongNgu && _soTang === soTang
      && _dienTich === dienTich && _orderBy === orderBy) {
      return false;
    }
    return true;
  }
  updateSearchFilterState(dataSource, errormsg) {
    var _loaiTin = this.props.search.form.fields.loaiTin;
    var _loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var _gia = this.props.search.form.fields.gia;
    var _soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var _soTang = this.props.search.form.fields.soTang;
    var _dienTich = this.props.search.form.fields.dienTich;
    var _orderBy = this.props.search.form.fields.orderBy;
    this.setState({
      loaiTin: _loaiTin,
      loaiNhaDat: _loaiNhaDat,
      gia: _gia,
      soPhongNgu: _soPhongNgu,
      soTang: _soTang,
      dienTich: _dienTich,
      orderBy: _orderBy,
      dataSource: dataSource,
      errormsg: errormsg,
      loaded: true
    })
  }
  refreshListData() {
    var loaiTin = this.props.search.form.fields.loaiTin;
    var loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    var gia = this.props.search.form.fields.gia;
    var soPhongNgu = this.props.search.form.fields.soPhongNgu;
    var soTang = this.props.search.form.fields.soTang;
    var dienTich = this.props.search.form.fields.dienTich;
    var orderBy = this.props.search.form.fields.orderBy;
    var dataBlob = [];
    Api.getItems(loaiTin, loaiNhaDat, gia, soPhongNgu, soTang, dienTich, orderBy)
      .then((data) => {
        if (data.list) {
          data.list.map(function(aRow) {
              // console.log(aRow.value);
              dataBlob.push(aRow.value);
            }
          );
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          var dataSource = ds.cloneWithRows(dataBlob);
          this.updateSearchFilterState(dataSource, null);
        } else {
          this.updateSearchFilterState(null, "Lỗi kết nối đến máy chủ!");
        }
      });
  }
  render() {
    if (this.isChangeSearchFilter()) {
      this.refreshListData();
    }
    if (!this.state) {
      return (
  			<View style={styles.container}>
  			</View>
      )
    }
    if (!this.state.dataSource) {
      return (
  			<View style={styles.container}>
          <Text style={styles.welcome}>{this.state.errormsg}</Text>
  			</View>
      )
    }
    return (
			<View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.searchListView}
        />
        <View style={styles.searchButton}>
          <View style={styles.searchListButton}>
            <Button onPress={this.onSort}
              style={styles.searchListButtonText}>Sắp xếp</Button>
            <Button onPress={this.onSaveSearch}
              style={styles.searchListButtonText}>Lưu tìm kiếm</Button>
            <Button onPress={this.onMap}
              style={styles.searchListButtonText}>Bản đồ</Button>
          </View>
        </View>
			</View>
		)
	}
  renderRow(rowData, sectionID, rowID) {
    var diaChi = rowData.diaChi;
    var index = diaChi.indexOf(',', 15);
    var length = 0;
    if (index !== -1 && index <= 20) {
      length = index;
    } else {
      index = diaChi.indexOf(' ', 15);
      length = index !== -1 && index <= 20 ? index : 20;
    }
    diaChi = diaChi.substring(0,length);
    if (diaChi.length < rowData.diaChi.length) {
      diaChi = diaChi + '...';
    }
    var soPhongNgu = rowData.soPhongNgu;
    if (soPhongNgu) {
      soPhongNgu = " " + soPhongNgu + " phòng ngủ";
    }
    return (
      <View style={styles.row}>
        <Image style={styles.thumb} source={{uri: `${rowData.cover}`}}>
          <View style={styles.searchListViewRowAlign}>
            <View>
              <Text style={styles.price}>{rowData.price_value} {rowData.price_unit}</Text>
              <Text style={styles.text}>{diaChi}{soPhongNgu}</Text>
            </View>
            <Icon.Button name="heart-o" backgroundColor="transparent"
              underlayColor="transparent" style={styles.heartButton}/>
          </View>
        </Image>
      </View>
    );
  }
  onSort() {
    Actions.OrderPicker();
  }
  onSaveSearch() {
    console.log("On Save Search pressed!");
  }
  onMap() {
    Actions.SearchResultMap();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultList);
