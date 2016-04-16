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

import gui from '../lib/gui';


import React, { Text, View, Component, Navigator, TouchableOpacity, Dimensions
  , SegmentedControlIOS, ScrollView, StyleSheet, StatusBar } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

import LikeTabButton from '../components/LikeTabButton';
import RangeUtils from "../lib/RangeUtils"
import RangePicker from "../components/RangePicker"

import LoaiNhaDat from "../assets/DanhMuc"

import SearchInput from '../components/SearchInputExt';

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
    StatusBar.setBarStyle('default');
  }

  _onLoaiTinChange(value) {
    this.props.actions.setSearchLoaiTin(value);
  }

  _onPressGiaHandle(){
    this.pickerGia.toggle();
  }

  _onPressDienTichHandle(){
    this.pickerDienTich.toggle();
  }
  _onGiaChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("gia", value);
  }
  _onDienTichChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("dienTich", value);
  }

  _getGiaValue() {
    //console.log(this.props.search.form.fields.gia)
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.gia);
  }

  _getDienTichValue() {
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.dienTich);
  }

  _getLoaiNhatDatValue() {
    return this.getLoaiNhaDatForDisplay(this.props.search.form.fields.loaiTin ,
                                               this.props.search.form.fields.loaiNhaDat);
  }

  render() {
    //console.log(RangeUtils.sellPriceRange.getPickerData());
    console.log("CALL Search.render");
    console.log(this.props);
    console.log(Actions);

    let loaiTin = this.props.search.form.fields.loaiTin;

    var _scrollView: ScrollView;
    return (
      <View style={styles.fullWidthContainer}>
        <View style={[myStyles.searchFilter, {top: 55}]}>

          <View style={[myStyles.searchFilterButton]}>
            <View style = {{flex:1, flexDirection: 'row'}}>
              <LikeTabButton name={'ban'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={loaiTin === 'ban'}>BÁN</LikeTabButton>
              <LikeTabButton name={'thue'}
                onPress={this._onLoaiTinChange.bind(this)}
                selected={loaiTin === 'thue'}>CHO THUÊ</LikeTabButton>
            </View>
          </View>

          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            vertical={true}
            style={myStyles.scrollView}>

            <View style={myStyles.searchFilterDetail}>

              <View style={myStyles.searchSectionTitle}>
                <Text style={myStyles.cacDieuKienText}>
                  CÁC ĐIỀU KIỆN
                </Text>
              </View>

              <TouchableOpacity style={myStyles.searchFilterAttribute}
                onPress={this._onPressGiaHandle.bind(this)}>
                <Text style={myStyles.searchAttributeLabel}>
                  Mức giá
                </Text>

                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                  <Text style={myStyles.searchAttributeValue}> {this._getGiaValue()} </Text>
                  <Icon name="angle-down" style = { {color:'gray'} } size={20} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this._onPropertyTypesPressed}>
                <View style={myStyles.searchFilterAttribute}>
                  <Text style={myStyles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={myStyles.searchAttributeValue2}> {this._getLoaiNhatDatValue()} </Text>
                    <Icon name="angle-right" style = { {color:'gray'} } size={20} />
                  </View>
                </View>
              </TouchableOpacity>

              {this._renderSoPhongNgu()}

              {this._renderSoTang()}

              {this._renderSoNhaTam()}

              <TouchableOpacity style={myStyles.searchFilterAttribute}
                  onPress={this._onPressDienTichHandle.bind(this)}>
                <Text style={myStyles.searchAttributeLabel}>
                  Diện tích
                </Text>

                <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                  <Text style={myStyles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                  <Icon name="angle-down" style = { {color:'gray'} } size={20} />
                </View>
              </TouchableOpacity>
              </View>

              <View style={myStyles.searchMoreFilterButton}>
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                <View style={myStyles.searchMoreFilterAttribute}>
                  <Button onPress={this.onMoreOption} style={myStyles.searchMoreText}>Mở rộng</Button>
                </View>
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                <View style={myStyles.searchMoreFilterAttribute}>
                  <Button onPress={this.onResetFilters.bind(this)} style={myStyles.searchResetText}>Thiết lập lại</Button>
                </View>
                <View style={myStyles.searchMoreFilterAttribute} />
              </View>

            </ScrollView>
        </View>

        <View style={styles.searchButton}>
          <View style={styles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={myStyles.searchButtonText}>Thoát</Button>
            <Button onPress={this.onApply.bind(this)}
            style={myStyles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

        <View>
          <RangePicker ref={pickerGia => this.pickerGia = pickerGia}
                    pickerTitle = "Chọn Giá"
                    pickerData={this.props.search.form.fields.giaPicker}
                    selectedValue={this.props.search.form.fields.gia}
                    onPickerDone={(pickedValue) => {this._onGiaChanged(pickedValue)}}
              />
          <RangePicker ref={pickerDienTich => this.pickerDienTich = pickerDienTich}
                    pickerTitle = "Chọn Diện Tích"
                    pickerData={RangeUtils.dienTichRange.getPickerData()}
                    selectedValue={this.props.search.form.fields.dienTich}
                    onPickerDone={(pickedValue) => {this._onDienTichChanged(pickedValue)}}
              />
        </View>

       <View style={myStyles.pageHeader}>
        <SearchInput placeName={this.props.search.form.fields.place.fullName}/>
       </View>
      </View>
    );
  }

  onCancel() {
    Actions.pop();
  }

  onApply() {
    console.log("Call Search.onApply");
/*
    this.props.actions.onSearchFieldChange("listData", []);
    console.log("Search cridential:");
    console.log(this.props.search.form.fields);

    if (this.props.search.form.fields.place.geometry) {
      var lon1 = this.props.search.form.fields.place.geometry.viewport.southwest.lng;
      var lat1 = this.props.search.form.fields.place.geometry.viewport.southwest.lat;
      var lon2 = this.props.search.form.fields.place.geometry.viewport.northeast.lng;
      var lat2 = this.props.search.form.fields.place.geometry.viewport.northeast.lat;
      var bbox = [lon1, lat1, lon2, lat2];
      this.props.actions.onSearchFieldChange("bbox", bbox);
    }
    Actions.SearchResultList({type:'reset'});
    */

    this.props.actions.search(
        this.props.search.form.fields
        , () => {
          if (this.props.needBack) {
            Actions.pop();
          } else {
            Actions.SearchResultList({type: "reset"});
          }
        });
  }

  onMoreOption() {
    console.log("On More Option pressed!");
  }

  onResetFilters() {
    this.props.actions.onSearchFieldChange("loaiNhaDat", '');
    this.props.actions.onSearchFieldChange("soPhongNgu", 0);
    this.props.actions.onSearchFieldChange("soTang", 0);
    this.props.actions.onSearchFieldChange("soNhaTam", 0);
    this.props.actions.onSearchFieldChange("dienTich", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("gia", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("orderBy", '');
  }

  _onPropertyTypesPressed() {
    Actions.PropertyTypes();
  }

  _onSoPhongNguChanged(event) {
    this.props.actions.onSearchFieldChange("soPhongNgu", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoTangChanged(event) {
    this.props.actions.onSearchFieldChange("soTang", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoNhaTamChanged(event) {
    this.props.actions.onSearchFieldChange("soNhaTam", event.nativeEvent.selectedSegmentIndex);
  }

  _renderSoPhongNgu(){
    let loaiTin = this.props.search.form.fields.loaiTin;
    let loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    if (this.showSoPhongNgu(loaiTin, loaiNhaDat)){
      return (
        <View style={[myStyles.searchFilterAttribute2, {flexDirection: "column"}]}>
          <View style={{paddingBottom: 6}}>
            <Text style={myStyles.searchAttributeLabel}>
              Số phòng ngủ
            </Text>
          </View>
          <View style={{paddingLeft: 0, paddingRight: 6, paddingBottom: 5}}>
            <SegmentedControlIOS
              values={[RangeUtils.BAT_KY,"1+","2+","3+","4+","5+"]}
              selectedIndex={this.props.search.form.fields.soPhongNgu}
              onChange={this._onSoPhongNguChanged.bind(this)}
            >
            </SegmentedControlIOS>
          </View>
        </View>
      );
    } else if (0 != this.props.search.form.fields.soPhongNgu) {
      this.props.actions.onSearchFieldChange("soPhongNgu", 0);
    }
  }

  _renderSoTang() {
    let loaiTin = this.props.search.form.fields.loaiTin;
    let loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    if (this.showSoTang(loaiTin, loaiNhaDat)){
      return (
        <View style={[myStyles.searchFilterAttribute2, {flexDirection: "column"}]}>
          <View style={{paddingBottom: 6}}>
            <Text style={myStyles.searchAttributeLabel}>
              Số tầng
            </Text>
          </View>
          <View style={{paddingLeft: 0, paddingRight: 6, paddingBottom: 5}}>
            <SegmentedControlIOS
              values={[RangeUtils.BAT_KY,"1+","2+","3+","4+","5+"]}
              selectedIndex={this.props.search.form.fields.soTang}
              onChange={this._onSoTangChanged.bind(this)}
             >
             </SegmentedControlIOS>
          </View>
        </View>
      );
    }else if (0 != this.props.search.form.fields.soTang) {
      this.props.actions.onSearchFieldChange("soTang", 0);
    }
  }

  _renderSoNhaTam() {
    let loaiTin = this.props.search.form.fields.loaiTin;
    let loaiNhaDat = this.props.search.form.fields.loaiNhaDat;
    if (this.showSoNhaTam(loaiTin, loaiNhaDat)){
      return (
        <View style={[myStyles.searchFilterAttribute2, {flexDirection: "column"}]}>
          <View style={{paddingBottom: 6}}>
            <Text style={myStyles.searchAttributeLabel}>
              Số nhà tắm
            </Text>
          </View>
          <View style={{paddingLeft: 0, paddingRight: 6, paddingBottom: 5}}>
            <SegmentedControlIOS
              values={[RangeUtils.BAT_KY,"1+","2+","3+","4+","5+"]}
              selectedIndex={this.props.search.form.fields.soNhaTam}
              onChange={this._onSoNhaTamChanged.bind(this)}
             >
             </SegmentedControlIOS>
          </View>
        </View>
      );
    }else if (0 != this.props.search.form.fields.soNhaTam) {
      this.props.actions.onSearchFieldChange("soNhaTam", 0);
    }
  }

  getLoaiNhaDatForDisplay(loaiTin, loaiNhaDatKey){
    var value = '';
    if (loaiTin == 'ban')
      value = LoaiNhaDat.ban[loaiNhaDatKey];

    if (loaiTin == 'thue')
      value = LoaiNhaDat.thue[loaiNhaDatKey];

    if (!value)
      value = RangeUtils.BAT_KY;

    return value;
  }

  showSoPhongNgu(loaiTin, loaiNhaDatKey){
    /*let banDat = 5;
    if (loaiTin == 'ban' && [banDat].indexOf(loaiNhaDatKey)!=-1)
      return false;

    let thueVanPhong = 4;
    let thueCuaHang = 5;
    if (loaiTin == 'thue' && [thueVanPhong, thueCuaHang].indexOf(loaiNhaDatKey)!=-1)
      return false;*/

    return true;
  }

  showSoTang(loaiTin, loaiNhaDatKey){
    /*let banDat = 5;
    let banCanHoChungCu = 1;
    if (loaiTin == 'ban' && [banCanHoChungCu, banDat].indexOf(loaiNhaDatKey)!=-1)
      return false;

    let thueCanHoChungCu = 1;
    if (loaiTin == 'thue' && [thueCanHoChungCu].indexOf(loaiNhaDatKey)!=-1)
      return false;*/

    return true;
  }

  showSoNhaTam(loaiTin, loaiNhaDatKey){
    /*let banCanHoChungCu = 1;
    if (loaiTin == 'ban' && [banCanHoChungCu].indexOf(loaiNhaDatKey)!=-1)
      return true;

    let thueCanHoChungCu = 1;
    if (loaiTin == 'thue' && [thueCanHoChungCu].indexOf(loaiNhaDatKey)!=-1)
      return true;

    return false;*/

    return true;
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  pageHeader: {
      top: 0,
      position: 'absolute',
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: Dimensions.get('window').width,
      height: 60
  },
  searchAttributeLabelBold : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'black',
    fontWeight: 'bold'
  },

  searchButtonText: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      color: 'white',
      fontSize: gui.normalFontSize,
      fontFamily: 'Open Sans',
      fontWeight : 'normal'
  },
  searchMoreFilterButton: {
    flex: 0.5,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  searchMoreSeparator: {
    backgroundColor: '#F6F6F6'
  },
  searchResetText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  searchMoreText: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: 'normal',
    color: gui.mainColor
  },
  searchAttributeLabel : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'black'
  },
  searchAttributeValue : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'gray'
  },
  searchAttributeValue2 : {
    fontSize: gui.normalFontSize,
    fontFamily: 'Open Sans',
    color: 'gray',
    marginRight: 6
  },
  searchFilterButton: {
    flexDirection: 'row'
  },
  searchFilter: {
    flex: 1
  },
  searchSectionTitle: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    padding: 8,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 3,
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
    backgroundColor: '#f8f8f8'
  },
  searchFilterDetail: {
    flex: 1,
    flexDirection:"column"
    //borderWidth:1,
    //borderColor: "green"
  },
  scrollView: {
    flex: 1
  },
  cacDieuKienText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#606060',
    justifyContent :'space-between',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute2: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    padding: 10,
    paddingTop: 5,
    paddingLeft: 15,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchMoreFilterAttribute: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
