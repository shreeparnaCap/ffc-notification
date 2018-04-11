const FfcNotificationController = require('./ffc-notification.controller.js');
const logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');




module.exports = {
	getFfcNotificationController : function getFfcNotificationController(){
		logger.info("In FfcNotificationController Index File");
		return new FfcNotificationController();
	}
};