const FfcNotificationService = require('./ffc-notification.service');
const logger = require('@capillarytech/arya').Logger.getLogger('aira');


module.exports = {
	getFfcNotificationService: function getFfcNotificationService(){
		logger.info("In getFfcNotificationService")
		return new FfcNotificationService();
	}
}