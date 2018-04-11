var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');


var FfcNotificationRepo =  function FfcNotificationRepo(){
	logger.info("In FfcNotificationRepo");
};


FfcNotificationRepo.prototype.getStoreIds = function getStoreIds(){
	logger.info("In FfcNotificationsRepo get Stores");
}
module.exports = FfcNotificationRepo;