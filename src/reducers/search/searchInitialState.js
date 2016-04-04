/**
 * # authInitialState.js
 *
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';
/**
 * ## Import
 */
const {Record} = require('immutable');
const {
  SEARCH_STATE_INPUT
} = require('../../lib/constants').default;

import RangeUtils from "../../lib/RangeUtils"

/**
 * This Record contains the state of the seach form
 */
const SearchForm = Record({
  state: SEARCH_STATE_INPUT,

  fields: new (Record({
    loaiTin:'ban',
    loaiNhaDat:'',
    soPhongNgu:0,
    soTang:0,
    soNhaTam:0,
    dienTich:RangeUtils.BAT_KY_RANGE,
    gia:RangeUtils.BAT_KY_RANGE,
    giaPicker : RangeUtils.sellPriceRange.getPickerData(),
    orderBy:'',
    listData: [],
    marker: {},
    bbox: [],
    place:{
      "placeID":"Place_Tinh_1",
      "placeName":"Hà Nội",
      "placeType":"Tinh",
      "geo" : {
        "lat" : 21.0226823,
        "lon" : 105.7669236
      },
      fullName : "Hà Nội"
    }
  }))
});

/**
 * ## InitialState
 * The form is set
 */
var InitialState = Record({
  form: new SearchForm
});
export default InitialState;
