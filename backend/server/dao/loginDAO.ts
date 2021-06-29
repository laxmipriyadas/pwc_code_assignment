import {
  adminusers,
  credentials,
  usertokens
} from "../models/index";

function loginDAO() { }
loginDAO.prototype.getAdminUser = function (where_condition, callback) {
  adminusers.findOne({ where: where_condition }).then(callback)

};

loginDAO.prototype.getTokenId = function (req_params, callback) {
  usertokens.create(req_params).then(callback);
};

loginDAO.prototype.updateToken = function (req_params,token_id, callback) {
  usertokens.update(req_params, {
    where: {
      id: token_id 
    }
  }).then(callback);
};

loginDAO.prototype.getTokenDetails = function (where_condition, callback) {
  usertokens.findOne({ where: where_condition }).then(callback)

};

loginDAO.prototype.getappDetails = function (where_condition, callback) {
  credentials.findOne({ where: where_condition }).then(callback)

};

loginDAO.prototype.deleteAuthToken = function (where_condition, callback) {
  usertokens.destroy({ where: where_condition }).then(callback)

};

export default loginDAO;

