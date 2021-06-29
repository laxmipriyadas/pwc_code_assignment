import loginDAO from "../dao/loginDAO";
import logger from '../common/logger'
const jwt = require('jsonwebtoken');
const LoginDAO = new loginDAO();


function authUtils() {
}

//Create Token
authUtils.prototype.generateToken = function (admin_id, user_token_id, app_secrete) {
    const [payload, expires_on] = this.jwt_payload(admin_id, user_token_id);
    // const token = jwt.sign(payload, process.env.TOKEN_SECRET)
    const token = jwt.sign(payload, app_secrete)
    return [token, expires_on]
}
authUtils.prototype.jwt_payload = function (admin_id, user_token_id) {
    var now_exp_delta = Math.floor(Date.now() / 1000) + (60 * Number(process.env.JWT_EXPIRATION_DELTA))
    var payload = {
        'iat': Date.now(),
        'exp': now_exp_delta,
        'identity': admin_id,
        'token_id': user_token_id
    }
    if (process.env.JWT_ALLOW_REFRESH) {
        payload['orig_iat'] = payload['iat']
        return [payload, now_exp_delta]
    }
}

// Validate Auth Token
authUtils.prototype.authValidation = async function (token) {
    return new Promise(async (resolve, reject) => {
        const data = await validateToken(token)
        resolve(data)
    })
}
async function validateToken(token) {
    return new Promise(async (resolve, reject) => {
        var token_info = await get_token_details(token);
        if (token_info && token_info != null) {
            var app_id = token_info['app_id']
           // var admin_id = token_info['admin_id']
            var app_info = await get_app_secrete(app_id);
            if (app_info == null) {
                logger.info("App secrete Not Found = >")
                let appResp = {}
                appResp['code'] = '400'
                appResp['message'] = 'App secrete Not Found'
                resolve(appResp)
                return
            }
            var app_sec = app_info['app_secret']
            var jwt_token = token_info['jwt_token']
            // jwt.verify(jwt_token, process.env.TOKEN_SECRET as string, (err: any, result: any) => {
            jwt.verify(jwt_token, app_sec, (err: any, result: any) => {
                if (err) {
                    logger.info("JWT Error: = >")
                    let jwtResp = {}
                    jwtResp['code'] = '420'
                    jwtResp['message'] = err.message
                    resolve(jwtResp)
                    return
                }
                if (result) {
                    logger.info("Valid Token ")
                    let jwtResp = {}
                    jwtResp['code'] = '200'
                    jwtResp['identity'] = result['identity']
                    jwtResp['message'] = "Valid Token"
                    resolve(jwtResp)
                    return
                }
            })
        }
        else {
            logger.info("Token not Found in DB ")
            let tokenResp = {}
            tokenResp['code'] = '401'
            tokenResp['message'] = 'Invalid Token'
            resolve(tokenResp)
            return
        }
    })
};


// Refresh Token
authUtils.prototype.refresh_Token = async function (token) {
    return new Promise(async (resolve, reject) => {
        const expired_token_info = await get_token_details(token)
        if (expired_token_info && expired_token_info != null) {
            var app_id = expired_token_info['app_id']
            var admin_id = expired_token_info['admin_id']
            var id = expired_token_info['id']

            var app_info = await get_app_secrete(app_id);
            if (app_info == null) {
                logger.info("App secrete Not Found")
                let tokenResp = {}
                tokenResp['code'] = '400'
                tokenResp['message'] = 'App secrete Not Found'
                resolve(tokenResp)
                return
            }
            var app_sec = app_info['app_secret']

            logger.info("App information retrived succesfully.")
            let tokenResp = {}
            tokenResp['code'] = '200'
            tokenResp['admin_id'] = admin_id
            tokenResp['app_sec'] = app_sec
            tokenResp['id'] = id
            tokenResp['message'] = 'App information retrived succesfully.'
            resolve(tokenResp)
            return
        }
        else {
            logger.info("Invalid Token")
            let tokenResp = {}
            tokenResp['code'] = '400'
            tokenResp['message'] = 'Invalid Token'
            resolve(tokenResp)
            return
        }
    })
}


function get_token_details(token) {
    return new Promise(async (resolve, reject) => {
        LoginDAO.getTokenDetails({ 'jwt_token': token }, function (result, err) {
            if (result) {
                var token_details = result.dataValues;
                resolve(token_details);
            } else {
                resolve(null)
            }
        })
    });
}

function get_app_secrete(app_id) {
    return new Promise(async (resolve, reject) => {
        LoginDAO.getappDetails({ 'app_id': app_id }, function (result, err) {
            if (result) {
                var app_details = result.dataValues;
                resolve(app_details);
            } else {
                resolve(null)
            }
        })
    });
}




export default authUtils;


