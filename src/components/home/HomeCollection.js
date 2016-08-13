'use strict';

import  React, {Component} from 'react';
import { Text, StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'

import gui from '../../lib/gui';
import log from '../../lib/logUtil';
import LinearGradient from 'react-native-linear-gradient';

import TruliaIcon from '../../components/TruliaIcon';

import {Actions} from 'react-native-router-flux';

var imageHeight = 143;

export default class HomeCollection extends Component {
  _onAdsPressed(ads) {
    Actions.SearchResultDetail({adsID: ads.adsID, source: 'server'})
  }

  _onSeeMore() {
    let {query} = this.props.collectionData;
    query.limit = gui.MAX_ITEM;

    Actions.SearchResultList({type: "reset"});

    this.props.searchFromHome(query, () => {});
  }

  _renderAds(ads, flex) {
    if (ads) {
      return (
        <TouchableOpacity onPress={() => this._onAdsPressed(ads)} style={{flex: flex}}>
          <ImageItem ads={ads}/>
        </TouchableOpacity>
      );
    } else {
      log.info("_renderAds null");

      return null
    }
  }

  render() {
    let {title1, title2, data, query} = this.props.collectionData;

    return(
      <View style={{flexDirection: "column"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.boldTitle}>BỘ SƯU TẬP</Text>
          <Text style={styles.categoryLabel}>{title1}</Text>
          <Text style={styles.arrowLabel}>{title2}</Text>
        </View>

        <View style={styles.rowItem}>
          {this._renderAds(data[0], 0.55)}
          <View style={{width:1.5}}/>
          {this._renderAds(data[1], 0.45)}
        </View>

        <View style={{height:1.5}}/>

        <View style={styles.rowItem}>
          {this._renderAds(data[2], 0.45)}
          <View style={{width:1.5}}/>
          {this._renderAds(data[3], 0.55)}
        </View>

        <View style={{height:1.5}}/>
        <View style={{flex: 1}}>
          {this._renderAds(data[4], 1)}
        </View>

        <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={this._onSeeMore.bind(this)} >
          <View style={styles.moreDetail}>
            <Text style={styles.moreDetailButton}>Xem thêm</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}


class ImageItem extends React.Component{
  render() {
    let {cover, giaFmt, soPhongNguFmt, soPhongTamFmt, khuVuc} = this.props.ads;
    let detail = soPhongNguFmt ? soPhongNguFmt + " ": "" + (soPhongTamFmt || "");

    return (
      <Image style={[styles.imgItem]} resizeMode = {'cover'}
             source={{uri: cover}}>

        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                        style={styles.linearGradient2}>
        </LinearGradient>

        <View style={styles.heartContent}>
          <TruliaIcon name="heart-o" mainProps={[styles.heartButton,{marginLeft: 30}]}
                      color={'white'} size={22}/>
        </View>

        <View style={styles.itemContent}>
          <View style={{flex: 1, paddingRight: 7}}>
            <Text style={styles.price}>{giaFmt}</Text>
            <Text style={styles.text} numberOfLines={1}>{khuVuc}</Text>
            <Text style={styles.text}>{detail}</Text>
          </View>
        </View>
      </Image>
    );
  }
}

var styles = StyleSheet.create({
  fullWidthContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  homeDetailInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: 45
  },
  pageHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    height: 61
  },
  search: {
    backgroundColor: gui.mainColor,
    height: 61
  },
  imgItem: {
    flex:1,
    height:imageHeight
  },
  column: {
    flex:1,
    alignItems: "center"
  },
  boldTitle: {
    fontFamily: gui.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'transparent',
    color: gui.mainColor
  },
  categoryLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 17,
    fontWeight: '500',
    backgroundColor: 'transparent'
  },
  arrowLabel: {
    fontFamily: gui.fontFamily,
    fontSize: 13,
    backgroundColor: 'transparent',
    color: gui.arrowColor,
    fontWeight: '500'
  },
  rowItem: {
    flexDirection: "row",
  },
  moreDetail: {
    margin: 11.5,
    marginLeft:23,
    marginRight:23,
    marginBottom: 9.5,
    padding: 4,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gui.mainColor,
    borderRadius: 5,
    borderColor: 'transparent'
  },
  moreDetailButton: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: gui.fontFamily,
    fontWeight: 'normal',
    fontSize: 15
  },
  linearGradient: {
    backgroundColor : "transparent"
  },
  itemContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: imageHeight - 60,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
    color: 'white'
  },
  heartContent: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 3,
    right: 10
  },
  heartButton: {
    marginTop: 5,
  },

  titleContainer : {
    height: 74,
    alignItems:'center',
    justifyContent: 'center',
    padding: 0
    /*
     borderColor: 'red',
     borderWidth : 1,
     */
  },
  linearGradient2: {
    marginTop: imageHeight / 2,
    height: imageHeight / 2,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    flex: 1
  },
});
