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



import React, { Text, View, Component, Image, Dimensions, ScrollView, StyleSheet, MapView } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import MapApi from '../lib/MapApi';
import DanhMuc from '../assets/DanhMuc';
import styles from './styles';
import SearchResultDetailFooter from '../components/SearchResultDetailFooter';
import CommonHeader from '../components/CommonHeader';

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

var LoaiNhaDatBan = [
    {key: 1, value: DanhMuc['ban'][1]},
    {key: 2, value: DanhMuc['ban'][2]},
    {key: 3, value: DanhMuc['ban'][3]},
    {key: 4, value: DanhMuc['ban'][4]},
    {key: 5, value: DanhMuc['ban'][5]},
    {key: 99, value: DanhMuc['ban'][99]}
];

var LoaiNhaDatThue = [
    {key: 1, value: DanhMuc['thue'][1]},
    {key: 2, value: DanhMuc['thue'][2]},
    {key: 3, value: DanhMuc['thue'][3]},
    {key: 4, value: DanhMuc['thue'][4]},
    {key: 5, value: DanhMuc['thue'][5]},
    {key: 99, value: DanhMuc['thue'][99]}
];

var LoaiTin = [
    {key: 0, value: "Bán"},
    {key: 1, value: "Cho thuê"}
];


class SearchResultDetail extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log(this.props);
    var rowIndex = this.props.data;
    var listData = this.props.search.form.fields.listData;
    if (!listData) {
  			return (
          <View style={styles.fullWidthContainer}>
            <CommonHeader headerTitle={"Chi tiết"} />
            <View style={styles.searchContent}>
              <Text style={styles.welcome}>"Lỗi kết nối đến máy chủ!"</Text>
            </View>
            <SearchResultDetailFooter />
    			</View>
        )
    }
    var rowData = listData[rowIndex];
    //console.log(rowData);
    var imageUrl = rowData.cover;
    //console.log(imageUrl);
    var loaiTin = this.getValueByKey(LoaiTin, rowData.loaiTin);
    var loaiNhaDatArr = rowData.loaiTin ? LoaiNhaDatThue : LoaiNhaDatBan;
    var loaiNhaDat = this.getValueByKey(loaiNhaDatArr, rowData.loaiNhaDat);
    var diaChi = rowData.diaChi;
    var dienTich = '';
    if (rowData.dienTich) {
      dienTich = rowData.dienTich + ' m²';
    }
    var gia = rowData.price_value + ' ' + rowData.price_unit;
    var soTang = rowData.soTang;
    var soPhongNgu = rowData.soPhongNgu;
    var ngayDangTin = rowData.ngayDangTin;
    var chiTiet = rowData.loc;
    var dangBoi = rowData.cust_dangBoi;
    var email = rowData.cust_email;
    var mobile = rowData.cust_mobile;
    var phone = rowData.cust_phone;
    var _scrollView: ScrollView;
    var pin = {latitude: 0, longitude: 0};
    return (
			<View style={styles.fullWidthContainer}>
        <View style={styles.customPageHeader}>
          <Icon.Button onPress={this._onBack}
            name="chevron-left" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="facebook" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="envelope-o" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="share-alt" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="comment-o" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
          <Icon.Button onPress={this._onShare}
            name="clone" backgroundColor="#f44336"
            underlayColor="gray"
            style={styles.search} >
          </Icon.Button>
        </View>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          vertical={true}
          style={styles.scrollView}>
          <View style={styles.searchContent}>
            <Image style={detailStyles.imgItem}
               source={{uri: `${imageUrl}`}}>
            </Image>

            <View style={detailStyles.slideItem}>
              <Text style={detailStyles.price}>
                Giá: {gia}
              </Text>
              <View style={styles.searchDetailRowAlign}>
                <Text style={detailStyles.textHalfWidth}>
                  Bán/Cho thuê: {loaiTin}
                </Text>
                <Text style={detailStyles.textHalfWidth}>
                  Loại nhà: {loaiNhaDat}
                </Text>
              </View>
              <Text style={detailStyles.textFullWidth}>
                Diện tích: {dienTich}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Địa chỉ: {diaChi}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Chi tiết: {chiTiet}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Ngày đăng: {ngayDangTin}
              </Text>
              <Text style={detailStyles.textTitle}>
                Đặc điểm
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Số tầng: {soTang}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Số phòng ngủ: {soPhongNgu}
              </Text>
              <Text style={detailStyles.textTitle}>
                Bản đồ
              </Text>
              <MapView
                annotations={[pin]}
                onRegionChangeComplete={this.onRegionChangeComplete}
                style={detailStyles.searchMapView}>
              </MapView>
              <Text style={detailStyles.textTitle}>
                Liên hệ
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Đăng bởi: {dangBoi}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Email: {email}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Mobile: {mobile}
              </Text>
              <Text style={detailStyles.textFullWidth}>
                Phone: {phone}
              </Text>
              <Text style={detailStyles.textTitle}>
                Danh sách comments
              </Text>
            </View>
          </View>
        </ScrollView>
        <SearchResultDetailFooter />
			</View>
		)
	}

  getValueByKey(hashArr, key) {
    var value = '';
    for (var i = 0; i < hashArr.length; i++) {
      var attr = hashArr[i];
      if (key == attr["key"]) {
        value = attr["value"];
        break;
      }
    }
    console.log(value);
    return value;
  }

  _onBack() {
    Actions.pop();
  }

  _onShare() {
    console.log("On share pressed!");
  }

  onRegionChangeComplete(region) {
    MapApi(region.latitude, region.longitude)
      .then((data) => {
        console.log(data);
      });
  }
}

var detailStyles = StyleSheet.create({
  imgItem: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 256
  },
  searchMapView: {
    flex: 1,
    width: Dimensions.get('window').width-20,
    height: Dimensions.get('window').width-20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  slideItem: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'stretch',
          backgroundColor: 'transparent', marginTop: 15
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textHalfWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: Dimensions.get('window').width/2-20
  },
  textFullWidth: {
    textAlign: 'left',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultDetail);
