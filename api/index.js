const express = require('express');
const Promise = require('bluebird');
const logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
const auth = require('@capillarytech/arya').AuthServiceSdk();
const mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.Promise = Promise;
const serviceMapper = require('@capillarytech/arya').ServiceFinder;
const airaDBParams = serviceMapper.getDbParams('aira_mongo');
const airaDBValues = serviceMapper.getDbServiceValues('aira_mongo');
const ffcNotifnRoutes = require("./routes/ffc-notification.route.js")

const router = express.Router(); // eslint-disable-line new-cap

router.use(function (req, res, next) {
    logger.info(req, 'Start of request');
    logger.info("testing");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    next();
});

var middleware = {
    disableRequests: function (req, res, next) {
        if (config.env === 'production') {
            logger.info('request disabled for prod env!!!');
            res.json({ message: 'Request Unsupported!' });
        }
        next();
    },
    validateHeaders: function (req, res, next) {
        logger.info('request headers are : ' + JSON.stringify(req.headers));
        if (!req.headers['x-cap-api-auth-org-id'] && !req.headers['X-CAP-API-AUTH-ORG-ID']) {
            res.status(HttpStatus.BAD_REQUEST).send({ 'message': 'required header x-cap-api-auth-org-id is missing' });
        } else if (!req.headers['x-cap-app-name'] && config.allowedApps.indexOf(req.headers['x-cap-app-name']) === -1) {
            res.status(HttpStatus.BAD_REQUEST).send({ 'message': 'required header x-cap-app-name is missing' });
        }
        next();
    },
    addHeadersForAiraApiEngine: function (req, res, next) {
        logger.info('Inside AiraApiEngineMiddleware with url:', req.originalUrl);
        var headers = req.headers;
        headers['orgId'] = req.orgId;
        headers['userId'] = req.userId;
	    var userDetails =  req.userDetails;
        userDetails['proxyOrgList'] = null;
        headers['userDetails'] = JSON.stringify(userDetails);
        headers['userRoleType'] = req.userRoleType;
        headers['accessibleEntities'] = JSON.stringify(req.userDetails.aryaUserRoles);
        return makeRestApiCall(apiOptionReturn(headers,
            req.originalUrl.substring(req.originalUrl.lastIndexOf("v1")), req.method, JSON.stringify(req.body)))
            .then((data) => {
                res.status(HttpStatus.OK).json(data);
            }).catch((err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            });
        next();
    },

    addHeadersForAiraApiEngineV2: function (req, res, next) {
        logger.info('Inside AiraApiEngineMiddleware with url:', req.originalUrl);
        var headers = req.headers;
        headers['orgId'] = req.orgId;
        headers['userId'] = req.userId;
	    var userDetails =  req.userDetails;
        userDetails['proxyOrgList'] = null;
        headers['userDetails'] = JSON.stringify(userDetails);
        headers['userRoleType'] = req.userRoleType;
        headers['accessibleEntities'] = JSON.stringify(req.userDetails.aryaUserRoles);
        return makeRestApiCall(apiOptionReturn(headers,
            req.originalUrl.substring(req.originalUrl.lastIndexOf("v2")), req.method, JSON.stringify(req.body)))
            .then((data) => {
                res.status(HttpStatus.OK).json(data);
            }).catch((err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            });
        next();
    },

    responseForQA: function (req, res, next) {
        var options = {};
        options["headers"] =  req.headers,
        options["method"] =  req.body["method"];
        options["url"] = req.body["url"];
        if (req.body["method"] === "POST"){
            options["body"] =req.body["body"]
        }
       delete options["headers"]["content-length"];
        options["resolveWithFullResponse"] = true;
        return makeRestApiCall(options)
            .then((data) => {
                res.status(HttpStatus.OK).json(data);
            }).catch((err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            });
        next();
    },

    authenticate: auth.authenticate(),
}

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));
router.use('/ffc-notification',ffcNotifnRoutes);
// mount org-routes routes at /org


//adding raygunClient middleware
//router.use(errorManagement.raygunClient.expressHandler);

module.exports = router;
