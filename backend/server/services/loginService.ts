import loginDAO from "../dao/loginDAO";
import authUtils from "../utils/authUtils";
import logger from '../common/logger';
import {HttpStatusCode} from '../constants/HttpStatusCode';
import { LOGIN_LOG_TAG,REFRESH_TOKEN_LOG_TAG,LOGOUT_LOG_TAG } from '../constants/logTagConstants';


const auth_utils = new authUtils();
const LoginDAO = new loginDAO();
const format = require('string-format')


function loginService() { }

/* API for Login */
loginService.prototype.validateAuth = async (req, callback) => {
  var req_json = req.body;
  var user_name = req_json['user_name']
  logger.info(format("{0}: user_name:{1}", LOGIN_LOG_TAG,user_name));
  var password = req_json['hash_password']
  logger.info(format("{0}: password:{1}", LOGIN_LOG_TAG,password));
  var cred_details = await get_credentials({ app_key: req.headers['app-key'], app_secret: req.headers['app-secret'] });
  if (cred_details == null) {
    logger.info(format("{0}:Authorization information is missing or invalid.", LOGIN_LOG_TAG));
    return;
  } else {
    var app_id = cred_details['app_id']
    logger.info(format("{0}: app_id:{1}", LOGIN_LOG_TAG,app_id));
    var app_secrete = cred_details['app_secret']
    logger.info(format("{0}: app_secrete:{1}", LOGIN_LOG_TAG,app_secrete));
    var admin_details = await get_admin_users({ user_name: user_name, password: password,is_deleted:0 });
    if (admin_details && admin_details != null) {
      var admin_id = admin_details['admin_id']
      logger.info(format("{0}: admin_id:{1}", LOGIN_LOG_TAG,admin_id));
      var is_active = admin_details['is_active']
      logger.info(format("{0}: is_active:{1}", LOGIN_LOG_TAG,is_active));
      var is_super_admin = admin_details['is_super_admin']
      logger.info(format("{0}: is_super_admin:{1}", LOGIN_LOG_TAG,is_super_admin));
      if (is_active != 1 && is_active == 0) {
        logger.info(format("{0}: Your account has been blocked", LOGIN_LOG_TAG));
        let userResp = {}
        userResp['code'] = HttpStatusCode.BAD_REQUEST
        userResp['message'] = 'Your account has been blocked'
        callback(userResp)
      }
      var user_token_id = await get_token_id({ admin_id: admin_id, app_id: app_id });
      if (user_token_id == null) {
        logger.info(format("{0}:something went wrong please try again", LOGIN_LOG_TAG));
        let userResp = {}
        userResp['code'] = HttpStatusCode.DB_ERROR
        userResp['message'] = 'something went wrong please try again'
        callback(userResp)
        return
      }
      logger.info(format("{0}:User Token ID: {1}", LOGIN_LOG_TAG,user_token_id['id']));
      const [jwt, expires_in] = auth_utils.generateToken(admin_id, user_token_id['id'], app_secrete);
      const timestamp = new Date(expires_in * 1000);
      var token_details = insert_jwt_toekn({ jwt_token: jwt, expires_on: timestamp }, user_token_id['id']);
      if (token_details == null) {
        logger.info(format("{0}:something went wrong please try again", LOGIN_LOG_TAG));
        let userResp = {}
        userResp['code'] = HttpStatusCode.DB_ERROR
        userResp['message'] = 'something went wrong please try again'
        callback(userResp)
        return
      }
      logger.info(format("{0}:Auth token generated successfully. Token:{1} ", LOGIN_LOG_TAG,jwt));
      let userResp = {}
      userResp['code'] = HttpStatusCode.OK
      userResp['message'] = 'Auth token generated successfully.'
      userResp['expires_on'] = expires_in
      userResp['token'] = jwt
      userResp['is_super_admin'] = is_super_admin
      callback(userResp)
    }
    else {
      logger.info(format("{0}:Invalid User Credentials!!!", LOGIN_LOG_TAG));
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = 'Invalid User Credentials!!!'
      callback(userResp)
    }
  }
}

/* API for  Refresh Token */
loginService.prototype.refreshToken = async (req, callback) => {
  var req_json = req.body;
  var expired_token = req_json['token']
  logger.info(format("{0}:expired_token:{1} ", REFRESH_TOKEN_LOG_TAG,expired_token));
  return new Promise(async (resolve, reject) => {
    const app_info = await auth_utils.refresh_Token(expired_token);
    if (app_info != null && app_info.code == 200) {
      var app_secrete = app_info.app_sec
      logger.info(format("{0}:app_secrete:{1} ", REFRESH_TOKEN_LOG_TAG,app_secrete));
      var admin_id = app_info.admin_id
      logger.info(format("{0}:admin_id:{1} ", REFRESH_TOKEN_LOG_TAG,admin_id));
      var id = app_info.id
      logger.info(format("{0}:id:{1} ", REFRESH_TOKEN_LOG_TAG,id));
      const [jwt, expires_in] = await auth_utils.generateToken(admin_id, id, app_secrete);
      const timestamp = new Date(expires_in * 1000);
      var token_details = await insert_jwt_toekn({ jwt_token: jwt, expires_on: timestamp }, id);
      logger.info(format("{0}:Refresh token generated successfully. ", REFRESH_TOKEN_LOG_TAG));
      let refershResp = {}
      refershResp['code'] = HttpStatusCode.OK
      refershResp['token'] = jwt
      refershResp['expires_on'] = expires_in
      refershResp['message'] = "Refresh token generated successfully."
      callback(refershResp)
      return
    }
    else {
      logger.info(format("{0}:Invalid Token.", REFRESH_TOKEN_LOG_TAG));
      let refershResp = {}
      refershResp['code'] = app_info.code
      refershResp['message'] = app_info.message
      callback(refershResp)
      return
    }
  })
}

/* API for  Logout */
loginService.prototype.authlogout = async (req, callback) => {
  let auth_token = req.headers['auth-token'];
  logger.info(format("{0}:auth_token:{1} ", LOGOUT_LOG_TAG,auth_token));
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code == "200") {
    var token_details = await delete_auth_token({ jwt_token: auth_token });
    let jwtResp = {}
    jwtResp['code'] = HttpStatusCode.OK
    jwtResp['message'] = "You have successfully logged out."
    callback(jwtResp)
    logger.info(format("{0}:You have successfully logged out.", LOGOUT_LOG_TAG));
    return
  }
  else {
    let jwtResp = {}
    jwtResp['code'] = validation_data.code
    jwtResp['message'] = validation_data.message
    callback(jwtResp)
    return
  }
}
function insert_jwt_toekn(token_details, token_id) {
  return new Promise(async (resolve, reject) => {
    await LoginDAO.updateToken(token_details, token_id, function (result, err) {
      if (result) {
        var admin_details = result.dataValues;
        resolve(admin_details);
      } else {
        resolve(null)
      }
    })
  });
}
function get_token_id(app_details) {
  return new Promise(async (resolve, reject) => {
    await LoginDAO.getTokenId(app_details, function (result, err) {
      if (result) {
        var admin_details = result.dataValues;
        resolve(admin_details);
      } else {
        resolve(null)
      }
    })
  });
}
function get_admin_users(user_details) {
  return new Promise(async (resolve, reject) => {
    await LoginDAO.getAdminUser(user_details, function (result, err) {
      if (result) {
        var admin_details = result.dataValues;
        resolve(admin_details);
      } else {
        resolve(null)
      }
    })
  });
}
function get_credentials(creds) {
  return new Promise(async (resolve, reject) => {
    await LoginDAO.getappDetails(creds, function (result, err) {
      if (result) {
        var credential_details = result.dataValues;
        resolve(credential_details);
      } else {
        resolve(null)
      }
    })
  });
}
function delete_auth_token(token) {
  return new Promise(async (resolve, reject) => {
    await LoginDAO.deleteAuthToken(token, function (result, err) {
      if (result) {
        var token_details = result.dataValues;
        resolve(token_details);
      } else {
        resolve(null)
      }
    })
  });
}

export default loginService;
