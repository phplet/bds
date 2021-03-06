'use strict';

import Api from "../../lib/FindApi";
import {Actions} from 'react-native-router-flux';
import gui from "../../lib/gui";
import log from "../../lib/logUtil";
import {Alert} from "react-native";

import userApi from '../../lib/userApi';
import db from '../../lib/localDB';
import localStorage  from '../../lib/localStorage';

const {
  ON_ALERT_US_CHANGE,
  ON_POLYGONS_CHANGE,
  ON_DRAW_MODE_CHANGE,
  ON_SEARCH_FIELD_CHANGE,
  SET_SEARCH_LOAI_TIN,
  FETCH_SEARCH_RESULT_FAIL,
  FETCH_SEARCH_RESULT_SUCCESS,
  CHANGE_LOADING_SEARCH_RESULT,
  FETCH_DETAIL_FAIL,
  FETCH_DETAIL_SUCCESS,
  SET_LOADING_DETAIL,
  SEARCH_STATE_INPUT,
  SEARCH_LIST_LIKE_SUCCESS,
  SEARCH_LIST_UNLIKE_SUCCESS,
  SEARCH_LOAD_SAVED_SEARCH,
  CHANGE_LOADING_HOME_DATA,
  LOAD_HOME_DATA_DONE,
  CHANGE_SEARCH_CALLED_FROM

} = require('../../lib/constants').default;

export function onSearchFieldChange(field, value) {
  return {
    type: ON_SEARCH_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}


export function setSearchLoaiTin(value) {
  return {
    type: SET_SEARCH_LOAI_TIN,
    payload: value
  }
}

export function fetchSearchResultFail(error) {
  return {
    type: FETCH_SEARCH_RESULT_FAIL,
    payload: error
  };
}

export function fetchSearchResultSuccess(data) {
  return {
    type: FETCH_SEARCH_RESULT_SUCCESS,
    payload: data
  }
}

export function changeLoadingSearchResult(loading) {
  return {
    type: CHANGE_LOADING_SEARCH_RESULT,
    payload: loading
  }
}

export function onDrawModeChange(loading) {
  return {
    type: ON_DRAW_MODE_CHANGE,
    payload: loading
  }
}

export function onPolygonsChange(loading) {
  return {
    type: ON_POLYGONS_CHANGE,
    payload: loading
  }
}

export function onAlertUsChange(loading) {
  return {
    type: ON_ALERT_US_CHANGE,
    payload: loading
  }
}

export function changeSearchCalledFrom(loading) {
  return {
    type: CHANGE_SEARCH_CALLED_FROM,
    payload: loading
  }
}

export function fetchDetailFail(error) {
  return {
    type: FETCH_DETAIL_FAIL,
    payload: error
  };
}

export function fetchDetailSuccess(data) {
  return {
    type: FETCH_DETAIL_SUCCESS,
    payload: data
  }
}

export function setLoadingDetail() {
  return {
    type: SET_LOADING_DETAIL,
    payload: null
  }
}

function callApiSearch(params, dispatch, successCallback) {
  dispatch(changeLoadingSearchResult(true));

  return Api.getItems(params)
    .then((data) => {
      if (data.list) {
        //let listAds = data.list;
        log.info("searchActions.search, Number of result: " + data.length);
        //log.info("searchActions.search", data);

        dispatch(fetchSearchResultSuccess({data, query:params}));

        successCallback();
      } else if (data.error) {
        dispatch(fetchSearchResultFail(data.error));
      }
      else {
        dispatch(fetchSearchResultFail(gui.ERR_LoiKetNoiMayChu));
        //Alert.alert(gui.ERR_LoiKetNoiMayChu)
      }
    });
}

export function search(credential, successCallback) {
  return dispatch => {
    let params = Api.convertFieldsToQueryParams(credential);
    dispatch(changeSearchCalledFrom("Search"));

    return callApiSearch(params, dispatch, successCallback)
  }
}

export function abortSearch() {
  return dispatch => {
    return Api._abortRequest();
  }
}

export function searchFromHome(query, successCallback) {
  return dispatch => {
    dispatch(changeSearchCalledFrom("Home"));

    return callApiSearch(query, dispatch, successCallback)
  }
}


export function getDetail(credential, successCallback) {
  return dispatch => {

    dispatch(setLoadingDetail());

    return Api.getDetail(credential)
      .then((data) => {
        log.info("getDetail", data);
        if (data.ads) {
          dispatch(fetchDetailSuccess(data));

          successCallback(data);
        } else if (data.error) {
          dispatch(fetchDetailFail(data.error));
        }

        else {
          dispatch(fetchDetailFail(gui.ERR_LoiKetNoiMayChu));
        }
      });
  }
}

export function likeSuccess(payload) {
  return {
    type: SEARCH_LIST_LIKE_SUCCESS,
    payload: payload
  }
}

export function unlikeSuccess(payload) {
  return {
    type: SEARCH_LIST_UNLIKE_SUCCESS,
    payload: payload
  }
}

export function likeAds(userID, rowData) {
  return dispatch => {
    let dto = {
      userID: userID,
      adsID: rowData.adsID
    };

    db.likeAds(dto).then((res) => {
      if (res.status === 0) {
        dispatch(likeSuccess(res.adsLikes));
        // Alert.alert("Thành công!");
      } else {
        Alert.alert("Không thành công!");
      }
    });
  }
}

export function unlikeAds(userID, adsID) {
  return dispatch => {
    let dto = {
      userID: userID,
      adsID: adsID
    };

    db.unlikeAds(dto).then((res) => {
      if (res.status === 0) {
        dispatch(unlikeSuccess(res.adsLikes));
        // Alert.alert("Thành công!");
      } else {
        Alert.alert("Không thành công!");
      }
    });
  }
}

export function saveSearch(userID, searchObj) {
  return dispatch => {
    let dto = {
      userID: userID,
      searchObj: searchObj
    };

    db.saveSearch(dto).then((res) => {
      if (res.status === 0) {
        //dispatch(likeSuccess(res.adsLikes));
        Alert.alert("Thành công!");
      } else {
        Alert.alert(res.msg);
      }
    });
  }
}


//use for both Recent and SaveSearch
export function loadSavedSearch(savedSearch) {
  return {
    type: SEARCH_LOAD_SAVED_SEARCH,
    payload: savedSearch
  }
}


// HOME screen
export function changeLoadingHomeData(loading) {
  return {
    type: CHANGE_LOADING_HOME_DATA,
    payload: loading
  }
}

export function loadHomeDataDone(res) {
  return {
    type: LOAD_HOME_DATA_DONE,
    payload: res
  }
}


export function loadHomeData() {
  return dispatch => {
    dispatch(changeLoadingHomeData(true));

    return localStorage.getLastSearch().then((ret) => {
      log.info("loadHomeData.getLastSearch", ret);
      let lastSearchObj = ret && JSON.parse(ret);
      if (!lastSearchObj) {
        let today = new Date(); today.setHours(0,0,0);
        lastSearchObj = {
          timeModified : today.getTime(),
          query : {}
        }
      }

      var getHomeData = (currentLocation) => {
        return Api.getAppHomeData({
          timeModified : lastSearchObj.timeModified,
          query : lastSearchObj.query,
          currentLocation: currentLocation
        }).then((res) => {
          log.info("getAppHomeData", res);
          dispatch(loadHomeDataDone(res));
        });
      };

      return navigator.geolocation.getCurrentPosition(
        (position) => {
          return getHomeData({
            "lat": position.coords.latitude,
            "lon": position.coords.longitude
          });
        },
        (error) => {
          alert(error.message);

          return getHomeData(gui.defaultLocation);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    });
  }
}
