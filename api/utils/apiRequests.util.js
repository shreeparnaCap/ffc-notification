const logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
const serviceMapper = require('@capillarytech/arya').ServiceFinder;
const reqPromise = require('request-promise');
const Promise = require('bluebird');



var storeCareApiOptionsReturn = function(headers,url, method, body){
	const nginxServiceValues = serviceMapper.getServiceValues('bi_api');
	var completeUrl = 'http://' + nginxServiceValues['host'] + ':' + nginxServiceValues['port']
        + '/arya/api/v1/bi/' + givenUrl; 
}

var makeRestApiCall = function makeRestApiCall(options) {
    logger.info('calling REST API with options : ' + JSON.stringify(options, null, 2));
    return reqPromise(options)
        .then(function (response) {
            logger.debug('\n\ngot REST API response : ' + JSON.stringify(response));
            return Promise.resolve(parseResponse(response));
        }).catch(function (err) {
            logger.error('REST API error : ', err);
            return Promise.reject(err);
        });
}

var createHeadersFromRequestObj = function (req) {
    var headers = req.headers;
    headers['orgId'] = req.orgId;
    headers['userId'] = req.userId;
    return headers;
}

var parseResponse = function (res) {
    if (res.body) {
        if (isJson(res.body)) {
            res.body = JSON.parse(res.body);
        }
        return res.body;
    } else {
        if (isJson(res)) {
            res = JSON.parse(res);
        }
        return res;
    }
}

var isJson = function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


module.exports= {
	makeRestApiCall,
	parseResponse,
	isJson,
	createHeadersFromRequestObj
};