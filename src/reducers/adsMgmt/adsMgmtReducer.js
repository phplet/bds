'use strict';
const InitialState = require('./adsMgmtInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_ADSMGMT_FIELD_CHANGE,
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function adsMgmtReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    case ON_ADSMGMT_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }
  }

  return state;
}
