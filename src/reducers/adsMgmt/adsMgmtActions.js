'use strict';

const {
  ON_ADSMGMT_FIELD_CHANGE,
} = require('../../lib/constants').default;

import log from "../../lib/logUtil";

import userApi from '../../lib/userApi';

import localDB from '../../lib/localDB';

import util from '../../lib/utils';

export function onAdsMgmtFieldChange(field, value) {
  return {
    type: ON_ADSMGMT_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

function convertAds(e) {
  var diaChiFullName = e.place.diaChiFullName;
  e.diaChi = diaChiFullName;
  e.dienTichFmt = util.getDienTichDisplay(e.dienTich);
  e.soPhongNguFmt = e.soPhongNgu ? e.soPhongNgu + "pn" : null;
  e.soTangFmt = e.soTang ? e.soTang + "t" : null;
  e.giaFmt = util.getPriceDisplay(e.gia, e.loaiTin);
  return e;
}

export function loadMySellRentList() {
  return dispatch => {
    localDB.getAllAdsDocs().then((adsList) => {
      var sellList = adsList.filter((e) => e.loaiTin == 0);
      sellList = sellList.map(e => convertAds(e));

      var rentList = adsList.filter((e) => e.loaiTin == 1);
      rentList = rentList.map(e => convertAds(e));

      dispatch(onAdsMgmtFieldChange('sellList', sellList));
      dispatch(onAdsMgmtFieldChange('rentList', rentList));
    });
  };
}

// likedList get from Server
export function loadLikedList(userID) {
  return dispatch => {
    dispatch(onAdsMgmtFieldChange('refreshing', true));

    userApi.getAdsLikes(userID)
      .then(res => {
        if (res.status == 0) {
          dispatch(onAdsMgmtFieldChange('likedList', res.data));

        } else {
          log.error("loadAdsMgmtData error", res);
        }
        dispatch(onAdsMgmtFieldChange('refreshing', false));
      })
  }
}


