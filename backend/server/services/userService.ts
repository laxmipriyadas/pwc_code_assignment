import userDAO from "../dao/userDAO";
import authUtils from "../utils/authUtils";
import logger from '../common/logger';
import { HttpStatusCode } from '../constants/HttpStatusCode';
import RESTErrorMessages from '../constants/RESTErrorMessages';
import md5 from 'md5';


const auth_utils = new authUtils();
const UserDAO = new userDAO();
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');
const format = require('string-format')



function userService() { }


/* API to add new User*/
userService.prototype.userAdd = async (req, callback) => {

  let auth_token = req.headers['auth-token'];
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code != "200") {
    let userResp = {}
    userResp['code'] = validation_data.code
    userResp['message'] = validation_data.message
    logger.info(format("Authorization Error:{0} code: {1} -->", validation_data.message, validation_data.code));
    callback(userResp)
    return

  }
  var req_json = req.body;
  var user_name = req_json['user_name']
  var password = req_json['password']
  var role_id = req_json['roll_id']
  let reqObject = {};
  var user_exist_details = await is_user_exist({ user_name: user_name });
  if (user_exist_details && user_exist_details != null) {
    let userResp = {}
    userResp['code'] = HttpStatusCode.BAD_REQUEST
    userResp['message'] = user_exist_details['is_deleted'] ? "User already exists with this email please contact super admin to activate it." : "Email already exists. Please select another..."
    logger.info("User already exists.");
    callback(userResp)
    return
  }
  else {
    // Email Validation ========
    const is_valid = await isEmailValid(user_name);
    if (!is_valid) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "Please provide a valid email address."
      logger.info("Invalid email address.");
      callback(userResp)
      return
    }
    reqObject["user_name"] = user_name
    // Password Validation =======
    const is_valid_password = await isPasswordValid(password);
    if (!is_valid_password) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "A passphrase of at least 12 characters with uppercase and lowercase letters, numbers and symbols (!@#$%^&*())."
      logger.info("Invalid Password.");
      callback(userResp)
      return
    }
    reqObject["password"] = md5(password)

    // Role Validation =======
    const role_info = await is_role_exist({ roll_id: role_id });
    if (role_info == null) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "Invalid role id."
      logger.info("Invalid role id.");
      callback(userResp)
      return
    }
    reqObject["roll_id"] = role_id
    if (role_id == '2') {
      reqObject["is_super_admin"] = 1
    }

    reqObject["is_active"] = 1
    // var user_details = await insert_user_data({ user_name: user_name, password: md5(password), roll_id: role_id, is_active: 1 });
    var user_details = await insert_user_data(reqObject);
    if (user_details['admin_id'] && user_details['admin_id'] != null) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.OK
      userResp['user_id'] = user_details['admin_id']
      userResp['message'] = "User Created Successfully."
      logger.info(format("User Created Successfully.admin user ID:{0}", user_details['admin_id']));
      callback(userResp)
      return
    }
    else {
      let userResp = {}
      userResp['code'] = HttpStatusCode.DB_ERROR
      userResp['message'] = RESTErrorMessages.InternalError
      logger.info("DB Error.");
      callback(userResp)
      return
    }
  }
}

/* API to Edit User*/
userService.prototype.userEdit = async (req, callback) => {
  let auth_token = req.headers['auth-token'];
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code != "200") {
    let userResp = {}
    userResp['code'] = validation_data.code
    userResp['message'] = validation_data.message
    logger.info(format("Authorization Error:{0} code: {1} -->", validation_data.message, validation_data.code));
    callback(userResp)
    return
  }

  var req_json = req.body;
  var user_id = req_json['user_id']
  logger.info(format("User ID -> {0}", user_id))
  let reqObject = {};

  var user_exist_details = await is_user_exist({ admin_id: user_id });
  if (user_exist_details == null) {
    logger.info(format("User not found in DB, User ID:{0} = >", user_id))
    let userResp = {}
    userResp['code'] = HttpStatusCode.BAD_REQUEST
    userResp['message'] = "User not found in DB"
    callback(userResp)
    return
  }
  var exist_password_in_db = user_exist_details['password'];

  if ('user_name' in req_json && req_json['user_name'] != null) {
    var user_name = req_json['user_name']
    const is_valid = await isEmailValid(user_name);
    if (!is_valid) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "Please provide a valid email address."
      logger.info("Invalid email address.");
      callback(userResp)
      return
    }
    reqObject["user_name"] = user_name;
  }
  if ('password' in req_json && req_json['password'] != null) {
    var password = req_json['password']
    const is_valid_password = await isPasswordValid(password);
    if (!is_valid_password) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "A passphrase of at least 12 characters with uppercase and lowercase letters, numbers and symbols (!@#$%^&*())."
      logger.info("Invalid Password.");
      callback(userResp)
      return
    }
    if (exist_password_in_db == md5(password)) {
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "Existing password can't be set as new password"
      logger.info("Existing password can't be set as new password");
      callback(userResp)
      return
    }
    reqObject["password"] = md5(password);
  }
  if ('roll_id' in req_json && req_json['roll_id'] != null) {
    var roll_id = req_json['roll_id'];
    if (roll_id == '2') {
      reqObject["is_super_admin"] = 1
    }
    if (roll_id == '1') {
      reqObject["is_super_admin"] = 0
    }
    reqObject["roll_id"] = roll_id
  }

  var user_details = await update_user_data(reqObject, user_id);
  if (user_details[0] > 0) {
    let userResp = {}
    userResp['code'] = HttpStatusCode.OK
    userResp['message'] = "Admin user updated successfully.."
    logger.info("Admin user updated successfully..")
    callback(userResp)
    return
  }
  else {
    logger.info("Duplicate value trying to update.")
    let userResp = {}
    userResp['code'] = HttpStatusCode.BAD_REQUEST
    userResp['message'] = "Duplicate value trying to update."
    callback(userResp)
    return
  }
}


/* API to Delete User*/
userService.prototype.userDelete = async (req, callback) => {
  let auth_token = req.headers['auth-token'];
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code != "200") {
    let userResp = {}
    userResp['code'] = validation_data.code
    userResp['message'] = validation_data.message
    logger.info(format("Authorization Error:{0} code: {1} -->", validation_data.message, validation_data.code));
    callback(userResp)
    return
  }
  var req_json = req.body;
  var user_id = req_json['user_id']
  logger.info(format("User ID -> {0}", user_id))
  var user_exist_details = await is_user_exist({ admin_id: user_id, is_deleted: 0 });
  if (user_exist_details == null) {
    logger.info(format("User does not exist, User ID:{0} = >", user_id))
    let userResp = {}
    userResp['code'] = HttpStatusCode.BAD_REQUEST
    userResp['message'] = "User does not exist"
    callback(userResp)
    return
  }
  var user_details = await update_user_data({ is_deleted: 1 }, user_id);
  if (user_details[0] > 0) {
    let userResp = {}
    userResp['code'] = HttpStatusCode.OK
    userResp['message'] = "User Deleted successfully.."
    logger.info("User Deleted successfully..")
    callback(userResp)
    return
  }
  else {
    logger.info("user not deleted.")
    let userResp = {}
    userResp['code'] = HttpStatusCode.DB_ERROR
    userResp['message'] = RESTErrorMessages.InternalError
    callback(userResp)
    return
  }
}

/* API to activate and deactivate admin Users. */

userService.prototype.userActiveDeactive = async (req, callback) => {
  let auth_token = req.headers['auth-token'];
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code != "200") {
    let userResp = {}
    userResp['code'] = validation_data.code
    userResp['message'] = validation_data.message
    logger.info(format("Authorization Error:{0} code: {1} -->", validation_data.message, validation_data.code));
    callback(userResp)
    return
  }
  var req_json = req.body;
  var user_id = req_json['user_id']
  logger.info(format("User ID -> {0}", user_id))
  var is_active = req_json['is_active']
  logger.info(format("Is active -> {0}", is_active))

  var user_exist_details = await is_user_exist({ admin_id: user_id, is_deleted: 0 });

  if (user_exist_details == null) {
    logger.info(format("User does not exist, User ID:{0} = >", user_id))
    let userResp = {}
    userResp['code'] = HttpStatusCode.BAD_REQUEST
    userResp['message'] = "User does not exist"
    callback(userResp)
    return
  }
  var is_active_form_db = user_exist_details['is_active'];
  if (is_active == 0) {
    if (is_active == is_active_form_db) {
      logger.info("User already deactivated")
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "User already deactivated."
      callback(userResp)
      return
    }
  }
  if (is_active == 1) {
    if (is_active == is_active_form_db) {
      logger.info("User already activated")
      let userResp = {}
      userResp['code'] = HttpStatusCode.BAD_REQUEST
      userResp['message'] = "User already activated."
      callback(userResp)
      return
    }
  }

  var user_details = await update_user_data({ is_active: is_active }, user_id);
  if (user_details[0] > 0) {
    let userResp = {}
    userResp['code'] = HttpStatusCode.OK
    userResp['message'] = is_active ? 'Activated Successfully' : 'Deactivated Successfully';
    logger.info(format("User :{0} = >", userResp['message']))
    callback(userResp)
    return
  }
  else {
    logger.info("user not activated or deactivated")
    let userResp = {}
    userResp['code'] = HttpStatusCode.DB_ERROR
    userResp['message'] = RESTErrorMessages.InternalError
    callback(userResp)
    return
  }

}

/* API to Fetch all Users */
userService.prototype.getUserLists = async (req, callback) => {
  let auth_token = req.headers['auth-token'];
  const validation_data = await auth_utils.authValidation(auth_token);
  if (validation_data.code != "200") {
    let userResp = {}
    userResp['code'] = validation_data.code
    userResp['message'] = validation_data.message
    logger.info(format("Authorization Error:{0} code: {1} -->", validation_data.message, validation_data.code));
    callback(userResp)
    return
  }
  UserDAO.getAllUsers(req, callback);
}


function insert_user_data(params) {
  return new Promise(async (resolve, reject) => {
    await UserDAO.createUser(params, function (result, err) {
      if (result) {
        var user_details = result.dataValues;
        resolve(user_details);
      } else {
        resolve(null)
      }
    })
  });
}

function is_user_exist(params) {
  return new Promise(async (resolve, reject) => {
    await UserDAO.getAdminUser(params, function (result, err) {
      if (result) {
        var user_details = result.dataValues;
        resolve(user_details);
      } else {
        resolve(null)
      }
    })
  });
}

function is_role_exist(params) {
  return new Promise(async (resolve, reject) => {
    await UserDAO.getRoleByID(params, function (result, err) {
      if (result) {
        var role_details = result.dataValues;
        resolve(role_details);
      } else {
        resolve(null)
      }
    })
  });
}

function update_user_data(data, user_id) {
  return new Promise(async (resolve, reject) => {
    await UserDAO.updateUser(data, user_id, function (result, err) {
      if (result) {
        var user_details = result
        resolve(user_details);
      } else {
        resolve(null)
      }
    })
  });
}

function isEmailValid(email) {
  return new Promise(async (resolve, reject) => {
    const valid = await emailValidator.validate(email)
    resolve(valid)
  });
}

function isPasswordValid(password) {
  return new Promise(async (resolve, reject) => {
    var schema = new passwordValidator();
    schema
      .is().min(12)                                    // Minimum length 8
      .is().max(20)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(1)                                // Must have at least 2 digits
      .has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123']) // Blacklist these values
    // .has([/[!@#$%^&*()]/]);
    // schema.validate(password)
    // const valid = schema.validate(password)
    // resolve(valid)
    var format = /[!@#$%^&*()]/;
    if (format.test(password) && schema.validate(password)) {
      resolve(true)
    } else {
      resolve(false)
    }
  });
}

export default userService;



