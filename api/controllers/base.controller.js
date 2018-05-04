var HttpStatus = require('http-status');
const logger = require('@capillarytech/arya').Logger.getLogger('aira');
var BaseController = function BaseController() {
	logger.info('base created');
};

BaseController.prototype.getSuccessResponse = function getSuccessResponse(type, message) {
	return { status: { isError: false, code: HttpStatus.OK, message: 'success' }, body: message };
};

BaseController.prototype.getCreatedResponse = function getCreatedResponse(message, res) {
	return { status: { isError: false, code: HttpStatus.CREATED, message: message }, body: res };
};

BaseController.prototype.getErrorResponse = function getErrorResponse(error) {
	return { status: { isError: true, code: HttpStatus.INTERNAL_SERVER_ERROR, message: error } };
};

BaseController.prototype.getBadRequestResponse = function getBadRequestResponse(error) {
	return { status: { isError: true, code: HttpStatus.BAD_REQUEST, message: error } };
};

module.exports = BaseController;