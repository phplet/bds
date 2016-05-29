// Api.js

import ApiUtils from './ApiUtils';

import cfg from "../cfg";
import log from "./logUtil";
import gui from "./gui";

var userApiUrl = cfg.rootUrl + "/user/";
var requestVerifyCodeUrl = userApiUrl + "requestVerifyCode";
var registerUser = userApiUrl + "registerUser";

var userApi = {
  requestVerifyCode(phone) {
    var params = {
      'phone': phone
    };
    return fetch(`${requestVerifyCodeUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        console.log("Response requestVerifyCode", response);
        return response.json()
      })
      .catch(e => {
        console.log("Error in requestVerifyCode", e);
        return e
      });
  },

  registerUser(userDto) {
    var params = {
      'phone': userDto.phone,
      'fullName' : userDto.fullName,
      'matKhau' : userDto.matKhau
    };

    log.info("fetch ", params, registerUser);

    return fetch(`${registerUser}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(ApiUtils.checkStatus)
      .then(response => {
        log.info("Response of registerUser", response);
        return response.json()
      })
      .catch(e => {
        log.info("Error in registerUser", e);
        return {
          status : 101,
          msg: gui.ERR_LoiKetNoiMayChu
        }
      });
  }
};

export {userApi as default};
