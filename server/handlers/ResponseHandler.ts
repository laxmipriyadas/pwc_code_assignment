import util from "util";

import RESTErrorMessages from "../constants/RESTErrorMessages";

function ResponseHandler() {}

function ResponseBody() {
  this.status = "failure";
  this.error = null;
}

ResponseHandler.handleHttpErrors = function (res, data) {
  var response = new ResponseBody();
  response.status = "failure";
  response.code = data["code"];
  response.message = data["message"];
  res.status(data["code"]).send(response);
};

ResponseHandler.handleSuccess = function (res, data) {
  var response = new ResponseBody();
  response.status = "success";
  response.result = data;
  if (util.isArray(data)) {
    response.count = data.length;
  } else {
    //Data must be an object, Hence setting count as 1
    response.count = 1;
  }
  res.status(200).send(response);
};

ResponseHandler.handleConflictResourceWithMsg = function (res, msg) {
  var response = new ResponseBody();
  response.status = "error";
  response.message = msg;
  res.status(409).send(response);
};

ResponseHandler.handleBadRequestWithMessage = function (res, message) {
  var response = new ResponseBody();
  response.message = message;
  response.code = 400;
  res.status(400).send(response);
};

ResponseHandler.handleBadRequestQueryParam = function (res) {
  var response = new ResponseBody();
  response.status = "failure";
  response.message = RESTErrorMessages.MissingRequiredQueryParam;
  res.status(400).send(response);
};

ResponseHandler.handleBadRequestBody = function (res) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.MissingRequiredBody;
  res.status(400).send(response);
};

ResponseHandler.handleBadRequestBodyWithErrors = function (res, error) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.MissingRequiredBody;
  response.error = error;
  res.status(400).send(response);
};

ResponseHandler.handleResourceNotFound = function (res) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.ResourceNotFound;
  res.status(404).send(response);
};

ResponseHandler.handleServerError = function (res) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.InternalError;
  res.status(500).send(response);
};

ResponseHandler.handleUnAuthorized = function (res) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.Unauthorized;
  res.status(401).send(response);
};
ResponseHandler.handleInsufficientAccountPermissions = function (res) {
  var response = new ResponseBody();
  response.message = RESTErrorMessages.InsufficientAccountPermissions;
  res.status(403).send(response);
};

ResponseHandler.handleAPIResponse = function (res, result) {
  var response = new ResponseBody();
  let statusCode = result.statusCode;
  switch (statusCode) {
    case 400:
      response.status = "Bad Request";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(400).send(response);
      break;
    case 401:
      response.status = "Unauthorized";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(401).send(response);
      break;
    case 403:
      response.status = "Duplicate data";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(403).send(response);
      break;
    case 404:
      response.status = "User Not Found";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(401).send(response);
      break;
    case 405:
      response.status = "Invalid country";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(400).send(response);
      break;
    case 409:
      response.status = "Duplicate request";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(409).send(response);
      break;
    case 420:
      response.status = "User exist";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(420).send(response);
      break;
    case 500:
      response.status = "Invalid country";
      response.code = result.statusCode;
      response.message = result.message;
      res.status(400).send(response);
      break;
    case 170014:
      response.status = "Bad request invalid scan information";
      response.code = result.response.code;
      response.message = result.response.message;
      res.status(400).send(response);
    case 170012:
      response.status = "Bad request";
      response.code = result.response.statusCode;
      response.message = result.response.message;
      res.status(400).send(response);
      break;
  }
};

export default ResponseHandler;
