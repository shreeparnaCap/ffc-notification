var HttpStatus 	= require('http-status');
const logger = require('@capillarytech/arya').Logger.getLogger('bi');
var BaseController = function BaseController () {
	logger.info('base created');
};

BaseController.prototype.getSuccessResponse = function getSuccessResponse (type, message) {
	return {status: {isError: false, code: HttpStatus.OK, message: 'success'}, response: message};
};

BaseController.prototype.getCreatedResponse = function getCreatedResponse (message, res) {
	return {status: {isError: false, code: HttpStatus.CREATED, message: message}, response: res};
};

BaseController.prototype.getErrorResponse = function getErrorResponse (error) {
	return {status: {isError: true, code: HttpStatus.INTERNAL_SERVER_ERROR, message: error}};
};

BaseController.prototype.getSuccessResponseV2 = function getSuccessResponseV2 (res, successCode, message) {
	if (successCode === undefined) {
		successCode = HttpStatus.OK;
	}

	return res.status(successCode)
			.json({
				'success': true,
				'status': successCode,
				'result': message
			});
};

BaseController.prototype.getErrorResponseV2 = function getErrorResponseV2 (res, errorCode, message) {
	if (errorCode === undefined) {
		errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
		message = 'Internal Server Error';
	}

	return res.status(errorCode)
			.json({
				'success': false,
				'status': errorCode,
				'message': message
			});
};
module.exports = BaseController;
