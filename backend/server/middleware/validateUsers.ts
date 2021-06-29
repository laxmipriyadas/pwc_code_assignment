import logger from '../common/logger'
import { credentials } from '../models/index';

const format = require('string-format')

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
module.exports = function (req, res, next) {

    if (req.headers['app-key'] != null) {
        logger.info(format("App Key  -> {0}", req.headers['app-key']))
    } else {
        logger.info("App Key value missing or empty.")
        return res.status(400).send({ code: "400", status: 'failure', message: 'Appkey required!!!' });
    }
    if (req.headers['app-secret'] != null) {
        logger.info(format("App Secrete  -> {0}", req.headers['app-secret']))
    } else {
        logger.info("App Secrete value missing or empty.")
        return res.status(400).send({ code: "400", status: 'failure', message: 'App Secrete required!!!' });
    }



    //let authorization = req.headers.authorization;
    let appKey = req.headers['app-key'];
    let appSecret = req.headers['app-secret'];
    let log_unique_id = uuidv4();
    req.unique_log_id = log_unique_id;
    res.set('BIRA_REQ_UUID', log_unique_id);

    // if (!req.headers.authorization) {
    if (!appKey || !appSecret) {
        if (req.url == "/api/v1/ping" || req.url == "/api/v1/sync") {
            return next();
        }
        return res.status(401).send({ message: 'Please make sure your request has a Token header' });
    } else {
        let app_key = req.headers['app-key'];
        let app_secret = req.headers['app-secret'];
        let appQueryParams = {}
        appQueryParams['app_key'] = app_key
        appQueryParams['app_secret'] = app_secret
        appQueryParams['is_active'] = 1

        logger.info({ 'Authentication of appkey and secret - appQueryParams': appQueryParams, 'unique_log_id': req['unique_log_id'] }, 'MIDDLEWARE')

        credentials.findOne({ where: appQueryParams })
            .then(appKeyData => {
                try {
                    if (!appKeyData) {
                        return res.status(401).send({ code: "401", message: 'Authorization information is missing or invalid.' });
                    } else {
                        next()
                    }
                } catch (exception) {
                    logger.info({ 'Authentication of appkey and secret - {exception}': exception, 'unique_log_id': req['unique_log_id'] }, 'MIDDLEWARE')
                }
            })
    }



};