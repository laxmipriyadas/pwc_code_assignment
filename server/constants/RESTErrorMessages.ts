var RESTErrorMessages = {
  ResourceNotFound: `The specified resource does not exist.`,
  MissingRequiredQueryParam: `A required Query Parameter was not specified.`,
  MissingRequiredBody: `A required HTTP Body was not specified.`,
  InternalError: `The server encountered an internal error. Please retry the request.`,
  Unauthorized: `Unauthorized Request.`,
  UserAlreadyExists: `User Already Exists`,
  InsufficientAccountPermissions: `The account being accessed does not have sufficient permissions to execute this operation.`,
  Active_Geofence: `There is an active Geofence session. Please deactivate and try again!!`,
  Customer_Not_Registered: `This mobile number is not registered`,
  Customer_Registered: `This mobile number has already been registered`,
  User_Not_found: `User not found!!`,
};

export default RESTErrorMessages;
