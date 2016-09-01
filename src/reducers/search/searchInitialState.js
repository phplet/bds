'use strict';

const {Record, List} = require('immutable');
const {
    SEARCH_STATE_INPUT
} = require('../../lib/constants').default;

import RangeUtils from "../../lib/RangeUtils";
import danhMuc from "../../assets/DanhMuc";


const defaultItemInCollection = {
    adsID : "",
    giaFmt : "",
    khuVuc : "",
    soPhongNguFmt : "",
    soPhongTamFmt : "",
    dienTichFmt : "",
    cover : "http://203.162.13.40:5000/web/asset/img/reland_house_large.jpg"
};


/**
 * This Record contains the state of the seach form
 */
const SearchForm = Record({
    fields: new (Record({
        loaiTin: 'ban',
        loaiNhaDat: '',
        soPhongNguSelectedIdx: 0,
        soTangSelectedIdx: 0,
        soNhaTamSelectedIdx : 0,
        dienTich: RangeUtils.BAT_KY_RANGE,
        gia: RangeUtils.BAT_KY_RANGE,
        giaPicker : RangeUtils.sellPriceRange.getPickerData(),
        orderBy: '',
        listData: [],
        marker: {},

        geoBox: [], //Map will use this

        place: {
          placeName: 'Hà Nội',
          fullName: 'Thành phố Hà Nội',
          shortName: 'Thành phố Hà Nội',
          placeType: 'T',
          placeId: '1',
          tinh: 'ha-noi',
          huyen: null,
          viewport: {
            "northeast": {
              "lat": 21.385027,
              "lng": 106.0198859
            },
            "southwest": {
              "lat": 20.562323,
              "lng": 105.2854659
            }
          },
          currentLocation : ''
        },

        radiusInKmSelectedIdx: 0,
        huongNha: '',
        ngayDaDang: 0, //batky
        polygon: [],
        region : {},
        alertUs: ''
    }))

});

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
    state: SEARCH_STATE_INPUT,

    form: new SearchForm,
    loadingFromServer : false,
    map : new (Record({
        type: "Standard",
        region: {latitude: 20.95389909999999,
                 longitude: 105.75490945,
                 longitudeDelta: 0.06102071125314978,
                 latitudeDelta: 0.08616620000177733}
    })),

    result: new (Record({
        listAds: [],
        errorMsg: "",
        viewport : {
            center: {lat:0, lon:0},
            northeast : {lat:0, lon:0},
            southwest : {lat:0, lon:0}
        }

    })),

    /*
     searchObj : {
       name : 'Search at ' + moment().format("DD-MM-YYYY HH:mm:ss"),
       timeModified : new Date().getTime(),
       query : query,
       isRecent : true,
       desc: findApi.convertQuery2String(query),
     }
     */
    saveSearchList : [],
    recentSearchList : [],
    //home screen
    loadingHomeData : false,
    collections : [{
        title1 : "",
        title2 : "",
        //data must have 5 elements
        data : [defaultItemInCollection, defaultItemInCollection,
            defaultItemInCollection,
            defaultItemInCollection, defaultItemInCollection],
        query : {loaiTin: 0} //search conditions
    }],
    homeDataErrorMsg : "",
    autoLoadAds : true,
    //shared
    searchCalledFrom : "Search"
});
export default InitialState;
