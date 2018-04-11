const FfcNotificationRepo = require('./ffc-notification.repo.js');
const StoreCareRepo = require('./store-care.repo.js');
var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');



module.exports = {
	getFfcNotificationRepo : function getFfcNotificationRepo(){
		logger.info("In getFfcNotificationRepo");
		return new FfcNotificationRepo();
	},

	getStoreCareRepo: function getStoreCareRepo(){
		logger.info("In Store Care Repo index");
		return new StoreCareRepo();
	}
}