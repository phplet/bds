'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as globalActions from '../reducers/global/globalActions';
import * as searchActions from '../reducers/search/searchActions';

import {Map} from 'immutable';

import gui from '../lib/gui';

import React, {Component} from 'react';

import { Text, View, Navigator, TouchableOpacity, Dimensions
  , SegmentedControlIOS, ScrollView, StyleSheet, StatusBar, PickerIOS } from 'react-native'

import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import TruliaIcon from '../components/TruliaIcon'

import LikeTabButton from '../components/LikeTabButton';
import RangeUtils from "../lib/RangeUtils"

import RangePicker from "../components/RangePicker"

import RangePicker2 from "../components/RangePicker2"

import DanhMuc from "../assets/DanhMuc"

import SearchInput from '../components/SearchInputExt';

import PlaceUtil from '../lib/PlaceUtil';

import apiUtils from '../lib/ApiUtils';

import SegmentedControl from '../components/SegmentedControl';

import log from '../lib/logUtil';

import PickerExt from '../components/picker/PickerExt';

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
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('default');

    this.state = {
      showMore: false,
      showNgayDaDang: false,
      showGia: false,
      showDienTich: false
    };
  }

  _onLoaiTinChange(value) {
    this.props.actions.setSearchLoaiTin(value);
  }

  _onPressGiaHandle(){
    // this.pickerGia.toggle();
      var {showGia} = this.state;
      this.setState({showGia: !showGia});
  }

  _onPressDienTichHandle(){
    // this.pickerDienTich.toggle();
      var {showDienTich} = this.state;
      this.setState({showDienTich: !showDienTich});
  }

  _onPressNgayDaDangHandle() {
    var {showNgayDaDang} = this.state;
    this.setState({showNgayDaDang: !showNgayDaDang});
  }

  _onGiaChanged(pickedValue) {
    let {loaiTin, gia} = this.props.search.form.fields;
    let giaStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
    let value = giaStepValues.rangeVal2Display(pickedValue.split('_'));
    this.props.actions.onSearchFieldChange("gia", value);
  }
  _onDienTichChanged(pickedValue) {
    let value = RangeUtils.dienTichRange.rangeVal2Display(pickedValue.split('_'));
    this.props.actions.onSearchFieldChange("dienTich", value);
  }

  _onNgayDaDangChanged(pickedValue) {
    let value = pickedValue;
    this.props.actions.onSearchFieldChange("ngayDaDang", value);
  }

  _getGiaValue() {
    //log.info(this.props.search.form.fields.gia)
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.gia);
  }

  _getDienTichValue() {
    return RangeUtils.getFromToDisplay(this.props.search.form.fields.dienTich);
  }

  _getLoaiNhatDatValue() {
    return DanhMuc.getLoaiNhaDatForDisplay(this.props.search.form.fields.loaiTin ,
                                               this.props.search.form.fields.loaiNhaDat);
  }
  
  _getHuongNhaValue() {
    var huongNha = this.props.search.form.fields.huongNha;
    if (!huongNha) {
      return RangeUtils.BAT_KY;
    }
    return DanhMuc.HuongNha[huongNha];
  }

  _getNgayDaDangValue() {
    var ngayDaDang = this.props.search.form.fields.ngayDaDang;
    if (!ngayDaDang) {
      return RangeUtils.BAT_KY;
    }
    return ngayDaDang + " ngày";
  }

  _getHeaderTitle() {
    let diaChinh = this.props.search.form.fields.diaChinh;

    //1. Search by diaChinh, then name = diaChinh's name
    if (this.props.search.map.polygons && this.props.search.map.polygons.length) {
        //placeName = `[${r.latitude}, ${r.longitude}]`
        return 'Trong khu vực đã vẽ';
    }

    if (this.props.search.form.fields.center && Object.keys(this.props.search.form.fields.center).length > 0) {
        return 'Xung quanh vị trí của bạn';
    }

    let placeName;
    let r = this.state.region;
    //2. Search by Polygon: name is just center
    if (diaChinh.tinhKhongDau) {
        placeName = diaChinh.fullName;
    } else { //others: banKinh or currentLocation
        placeName = 'Tìm tất cả theo khung nhìn'
    }

    return placeName;
  }

  render() {
    //log.info(RangeUtils.sellPriceRange.getPickerData());
    log.info("CALL Search.render");
    //log.info(this.props);

    let loaiTin = this.props.search.form.fields.loaiTin;

    let placeName = this._getHeaderTitle();

    var _scrollView;
    return (
      <View style={myStyles.fullWidthContainer}>
        <View style={[myStyles.searchFilter, {top: 65}]}>

          <View style={[myStyles.searchFilterButton]}>
            <View style = {{flex:1, flexDirection: 'row', paddingLeft: 5, paddingRight: 5}}>
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

              <TouchableOpacity
                onPress={this._onPropertyTypesPressed}>
                <View style={myStyles.searchFilterAttributeExt3}>
                  <Text style={myStyles.searchAttributeLabel}>
                  Loại nhà đất
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                    <Text style={myStyles.searchAttributeValue}> {this._getLoaiNhatDatValue()} </Text>
                    <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
                  </View>
                </View>
              </TouchableOpacity>

                {this._renderDienTich()}

              {this._renderSoPhongNgu()}

              {/*this._renderSoTang()*/}

              {this._renderSoNhaTam()}

              {this._renderBanKinhTimKiem()}

                {this._renderGia()}

              </View>

              <View style={myStyles.searchMoreFilterButton}>
                <View style={[myStyles.searchMoreFilterAttribute, myStyles.searchMoreSeparator]}>
                  <Text />
                </View>
                {this._renderMoreComponent()}
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

        <View style={myStyles.searchButton}>
          <View style={myStyles.searchButtonWrapper}>
            <Button onPress={this.onCancel}
            style={myStyles.searchButtonText}>Thoát</Button>
            <Button onPress={this.onApply.bind(this)}
            style={myStyles.searchButtonText}>Thực hiện</Button>
          </View>
        </View>

       <View style={myStyles.pageHeader}>
        <SearchInput placeName={placeName}/>
       </View>
      </View>
    );
  }

  onCancel() {
    Actions.pop();
    StatusBar.setBarStyle('light-content');
  }

  onApply() {
    log.info("Call Search.onApply");

    if (this.props.needBack) {
      Actions.pop();
    } else {
      log.info("Call open SearchResultList in reset mode");

      Actions.SearchResultList({type: "reset"});
    }
    this.props.actions.onSearchFieldChange("orderBy", '');
    this.props.actions.onSearchFieldChange("pageNo", 1);

    this._handleSearchAction('', 1, gui.MAX_ITEM);
    this.props.refreshRegion && this.props.refreshRegion();
    this.props.onShowMessage && this.props.onShowMessage();
 }

 _handleSearchAction(newOrderBy, newPageNo, newLimit){
     var {loaiTin, loaiNhaDat, gia, soPhongNguSelectedIdx, soNhaTamSelectedIdx,
         radiusInKmSelectedIdx, dienTich, orderBy, viewport, diaChinh, center, huongNha, ngayDaDang,
         polygon, pageNo, limit, isIncludeCountInResponse} = this.props.search.form.fields;
     var fields = {
         loaiTin: loaiTin,
         loaiNhaDat: loaiNhaDat,
         soPhongNguSelectedIdx: soPhongNguSelectedIdx,
         soNhaTamSelectedIdx : soNhaTamSelectedIdx,
         dienTich: dienTich,
         gia: gia,
         orderBy: newOrderBy || orderBy,
         viewport: viewport,
         diaChinh: diaChinh,
         center: center,
         radiusInKmSelectedIdx: radiusInKmSelectedIdx,
         huongNha: huongNha,
         ngayDaDang: ngayDaDang,
         polygon: polygon,
         pageNo: newPageNo || pageNo,
         limit: newLimit || limit,
         isIncludeCountInResponse: isIncludeCountInResponse};

     this.props.actions.search(
         fields
         , () => {});
 }

  onMoreOption() {
    this.setState({showMore: true});
  }

  onResetFilters() {
    this.props.actions.onSearchFieldChange("loaiNhaDat", '');
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("dienTich", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("gia", RangeUtils.BAT_KY_RANGE);
    this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", 0);
    this.props.actions.onSearchFieldChange("huongNha", 0);
    this.props.actions.onSearchFieldChange("ngayDaDang", '');
    this.setState({showMore: false});
  }

  _onPropertyTypesPressed() {
    Actions.PropertyTypes({func: 'search'});
  }

  _onHuongNhaPressed() {
    Actions.HuongNha();
  }

  _onSoPhongNguChanged(event) {
    this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoTangChanged(event) {
    this.props.actions.onSearchFieldChange("soTangSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

  _onSoNhaTamChanged(event) {
    this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", event.nativeEvent.selectedSegmentIndex);
  }

    _onBanKinhTimKiemChanged(event) {
        this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", event.nativeEvent.selectedSegmentIndex);
    }

    _renderDienTich() {
        var {showDienTich} = this.state;
        var iconName = showDienTich ? "arrow-up" : "arrow-down";
        return (
            <View>
                <TouchableOpacity
                                  onPress={this._onPressDienTichHandle.bind(this)}>
                    <View style={myStyles.searchFilterAttribute}>
                        <Text style={myStyles.searchAttributeLabel}>
                            Diện tích
                        </Text>

                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.searchAttributeValue}>{this._getDienTichValue()} </Text>
                            <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableOpacity>
                {this._renderDienTichPicker()}
            </View>
        );
    }

    _renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder, onTextChange,
                     pickerSelectedValue, onPickerValueChange) {
        return (
            <PickerExt pickerRange={pickerRange} rangeStepValues={rangeStepValues} fromPlaceholder={fromPlaceholder}
                       toPlaceholder={toPlaceholder} onTextChange={onTextChange}
                       pickerSelectedValue={pickerSelectedValue} onPickerValueChange={onPickerValueChange} />
        );
    }

    _renderDienTichPicker() {
        var {showDienTich} = this.state;
        if (showDienTich) {
            let rangeStepValues = RangeUtils.dienTichRange;
            let pickerRange = rangeStepValues.getAllRangeVal();
            let fromPlaceholder = '';
            let toPlaceholder = '';
            let onTextChange = this._onDienTichInputChange.bind(this);
            let dienTichRange = rangeStepValues.toValRange(this.props.search.form.fields.dienTich);
            let pickerSelectedValue = dienTichRange[0] + '_' + dienTichRange[1];
            let onPickerValueChange = this._onDienTichChanged.bind(this);
            return this._renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder,
                onTextChange, pickerSelectedValue, onPickerValueChange);
        }
    }

    _onDienTichInputChange(index, val) {
        let {dienTich} = this.props.search.form.fields;
        dienTich[index] = val;
        let other = dienTich[1-index];
        if (DanhMuc.CHUA_XAC_DINH == other) {
            other = 0;
        } else if (DanhMuc.BAT_KY == other) {
            other = -1;
        } else if (other && other.indexOf(" ") != -1) {
            other = Number(other.substring(0, other.indexOf(" ")));
        } else {
            other = -1;
        }
        dienTich[1-index] = other;

        let value = RangeUtils.dienTichRange.rangeVal2Display(dienTich);
        this.props.actions.onSearchFieldChange("dienTich", value);
    }

    _renderGia() {
        var {showGia} = this.state;
        var iconName = showGia ? "arrow-up" : "arrow-down";
        return (
            <View>
                <TouchableOpacity
                    onPress={this._onPressGiaHandle.bind(this)}>
                    <View style={myStyles.searchFilterAttribute}>
                        <Text style={myStyles.searchAttributeLabel}>
                            Mức giá
                        </Text>

                        <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                            <Text style={myStyles.searchAttributeValue}> {this._getGiaValue()} </Text>
                            <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
                        </View>
                    </View>
                </TouchableOpacity>
                {this._renderGiaPicker()}
            </View>
        );
    }

    _renderGiaPicker() {
        var {showGia} = this.state;
        if (showGia) {
            var {loaiTin, gia} = this.props.search.form.fields;
            var rangeStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
            let pickerRange = rangeStepValues.getAllRangeVal();
            let fromPlaceholder = '';
            let toPlaceholder = '';
            let onTextChange = this._onGiaInputChange.bind(this);
            let giaRange = rangeStepValues.toValRange(gia);
            let pickerSelectedValue = giaRange[0] + '_' + giaRange[1];
            let onPickerValueChange = this._onGiaChanged.bind(this);
            return this._renderPickerExt(pickerRange, rangeStepValues, fromPlaceholder, toPlaceholder,
                onTextChange, pickerSelectedValue, onPickerValueChange);
        }
    }

    _onGiaInputChange(index, val) {
        let {loaiTin, gia} = this.props.search.form.fields;
        var rangeStepValues = 'ban' === loaiTin ? RangeUtils.sellPriceRange :RangeUtils.rentPriceRange;
        gia[index] = val;
        let other = gia[1-index];
        if (DanhMuc.THOA_THUAN == other) {
            other = 0;
        } else if (DanhMuc.BAT_KY == other) {
            other = -1;
        } else if (other && other.indexOf(" ") != -1) {
            if (other.indexOf("tỷ") != -1) {
                other = 1000 * Number(other.substring(0, other.indexOf(" ")));
            } else {
                other = Number(other.substring(0, other.indexOf(" ")));
            }
        } else {
            other = -1;
        }
        gia[1-index] = other;

        let value = rangeStepValues.rangeVal2Display(gia);
        this.props.actions.onSearchFieldChange("gia", value);
    }

  _renderSoPhongNgu(){
    if (this.showSoPhongNgu()){
        return this._renderSegment("Số phòng ngủ", DanhMuc.getSoPhongNguValues(),
            this.props.search.form.fields["soPhongNguSelectedIdx"], this._onSoPhongNguChanged.bind(this));
    } else if (0 != this.props.search.form.fields.soPhongNguSelectedIdx) {
      this.props.actions.onSearchFieldChange("soPhongNguSelectedIdx", 0);
    }
      return null;
  }

  _renderSoTang() {
    if (this.showSoTang()){
        return this._renderSegment("Số tầng", DanhMuc.getSoTangValues(),
            this.props.search.form.fields["soTangSelectedIdx"], this._onSoTangChanged.bind(this));
    }else if (0 != this.props.search.form.fields.soTangSelectedIdx) {
      this.props.actions.onSearchFieldChange("soTangSelectedIdx", 0);
    }
  }

  _renderSoNhaTam() {
    if (this.showSoNhaTam()){
        return this._renderSegment("Số nhà tắm", DanhMuc.getSoPhongTamValues(),
            this.props.search.form.fields["soNhaTamSelectedIdx"], this._onSoNhaTamChanged.bind(this));
    }else if (0 != this.props.search.form.fields.soNhaTamSelectedIdx) {
      this.props.actions.onSearchFieldChange("soNhaTamSelectedIdx", 0);
    }
      return null;
  }

  _renderBanKinhTimKiem() {
        if (this.showBanKinhTimKiem()){
            return this._renderSegment("Bán kính tìm kiếm (Km)", DanhMuc.getRadiusInKmValues(),
                this.props.search.form.fields["radiusInKmSelectedIdx"], this._onBanKinhTimKiemChanged.bind(this));
        }
        /*
        else if (0 != this.props.search.form.fields.radiusInKmSelectedIdx) {
            this.props.actions.onSearchFieldChange("radiusInKmSelectedIdx", 0);
        }
        */
    }

    _renderSegment(label, values, selectedIndexAttribute, onChange) {
        return (
            <SegmentedControl label={label} values={values} selectedIndexAttribute={selectedIndexAttribute}
                              onChange={onChange} />
        );
    }

  _renderMoreComponent() {
    var {showMore} = this.state;
    if (!showMore) {
      return (
          <View>
            {this._renderMoreButton()}
          </View>
      );
    } else {
      return (
          <View>
            {this._renderHuongNha()}
            {this._renderNgayDaDang()}
          </View>
      );
    }
  }

  _renderMoreButton() {
    return (
        <View style={myStyles.searchMoreFilterAttribute}>
          <Button onPress={() => this.onMoreOption()} style={myStyles.searchMoreText}>Mở rộng</Button>
        </View>
    );
  }

  _renderHuongNha() {
    return (
        <TouchableOpacity
            onPress={() => this._onHuongNhaPressed()}>
          <View style={myStyles.searchFilterAttributeExt3}>
            <Text style={myStyles.searchAttributeLabel}>
              Hướng nhà
            </Text>
            <View style={{flexDirection: "row", alignItems: "flex-end"}}>
              <Text style={myStyles.searchAttributeValue}> {this._getHuongNhaValue()} </Text>
              <TruliaIcon name="arrow-right" color={gui.arrowColor} size={18} />
            </View>
          </View>
        </TouchableOpacity>
    );
  }

  _renderNgayDaDang() {
    var {showNgayDaDang} = this.state;
    var iconName = showNgayDaDang ? "arrow-up" : "arrow-down";
    return (
        <View>
          <TouchableOpacity
                            onPress={() => this._onPressNgayDaDangHandle()}>
            <View style={myStyles.searchFilterAttribute3}>
              <Text style={myStyles.searchAttributeLabel}>
                Ngày đã đăng
              </Text>

              <View style={{flexDirection: "row", alignItems: "flex-end"}}>
                <Text style={myStyles.searchAttributeValue}> {this._getNgayDaDangValue()} </Text>
                <TruliaIcon name={iconName} color={gui.arrowColor} size={18} />
              </View>
             </View>
          </TouchableOpacity>
          {this._renderNgayDaDangPicker()}
        </View>
    );
  }

  _renderNgayDaDangPicker() {
    var {showNgayDaDang} = this.state;
    if (showNgayDaDang) {
      return (
          <PickerIOS ref={pickerNgayDaDang => this.pickerNgayDaDang = pickerNgayDaDang}
                 selectedValue={this.props.search.form.fields.ngayDaDang}
                 onValueChange={(pickedValue) => {this._onNgayDaDangChanged(pickedValue)}}
                 itemStyle={myStyles.ngayDaDangItem}
          >
            {DanhMuc.getNgayDaDangValues().map((ngayDaDangKey) => (
                <PickerIOS.Item key={ngayDaDangKey}
                                value={ngayDaDangKey}
                                label={DanhMuc.NgayDaDang[ngayDaDangKey]} />
            ))}
          </PickerIOS>
      );
    }
  }

  showSoPhongNgu(){
    var {loaiTin, loaiNhaDat} = this.props.search.form.fields;
    var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
      if (loaiNhaDat == loaiNhaDatKeys[0]
      || loaiNhaDat == loaiNhaDatKeys[1]
      || loaiNhaDat == loaiNhaDatKeys[2]
      || loaiNhaDat == loaiNhaDatKeys[3]
      || loaiNhaDat == loaiNhaDatKeys[4]) {
          return true;
      } else {
          return false;
      }
  }

  showSoTang(){
    return false;
  }

  showSoNhaTam(){
      var {loaiTin, loaiNhaDat} = this.props.search.form.fields;
      var loaiNhaDatKeys = loaiTin ? DanhMuc.LoaiNhaDatThueKey : DanhMuc.LoaiNhaDatBanKey;
      if (loaiNhaDat == loaiNhaDatKeys[0]
          || loaiNhaDat == loaiNhaDatKeys[1]
          || loaiNhaDat == loaiNhaDatKeys[2]
          || loaiNhaDat == loaiNhaDatKeys[3]
          || loaiNhaDat == loaiNhaDatKeys[4]) {
          return true;
      } else {
          return false;
      }
  }

  showBanKinhTimKiem(){
      let {center} = this.props.search.form.fields;
      return center && !isNaN(center.lat);
  }
}

/**
 * ## Styles
 */
var myStyles = StyleSheet.create({
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
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

  searchButton: {
    alignItems: 'stretch',
    justifyContent: 'flex-end'
  },
  searchButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: gui.mainColor,
    height: 44
  },
  searchButtonText: {
      marginLeft: 17,
      marginRight: 17,
      marginTop: 10,
      marginBottom: 10,
      color: 'white',
      fontSize: gui.buttonFontSize,
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
    fontSize: gui.buttonFontSize,
    fontFamily: 'Open Sans',
    fontWeight: 'normal'
  },
  searchMoreText: {
    fontSize: gui.buttonFontSize,
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
    color: gui.arrowColor,
    marginRight: 3
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
    paddingRight: 8,
    paddingLeft: 17,
    paddingTop: 12,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
    backgroundColor: '#f8f8f8'
  },
  searchFilterDetail: {
    flex: 0,
    flexDirection:"column"
    //borderWidth:1,
    //borderColor: "green"
  },
  scrollView: {
    flex: 1,
    marginBottom: 44
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
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 13,
    paddingBottom: 10,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute2: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 8,
    paddingTop: 5,
    paddingLeft: 17,
    paddingBottom: 7,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttribute3: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 10,
    paddingLeft: 17,
    paddingRight: 13,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 12,
    paddingLeft: 0,
    paddingRight: 19,
    paddingBottom: 10,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt2: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingRight: 10,
    paddingTop: 5,
    paddingLeft: 0,
    paddingBottom: 8,
    borderTopWidth: 1,
    marginLeft: 17,
    borderTopColor: gui.separatorLine
  },
  searchFilterAttributeExt3: {
    flexDirection : "row",
    //borderWidth:1,
    //borderColor: "red",
    justifyContent :'space-between',
    paddingTop: 12,
    paddingLeft: 17,
    paddingRight: 19,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  searchMoreFilterAttribute: {
    padding: 10,
    paddingBottom: 11,
    borderTopWidth: 1,
    borderTopColor: gui.separatorLine
  },
  ngayDaDangItem: {
    fontSize: gui.normalFontSize,
    fontFamily: gui.fontFamily
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
