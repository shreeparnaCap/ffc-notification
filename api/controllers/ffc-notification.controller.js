var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn')
var notificationService = require('../services/').getFfcNotificationService();

var FfcNotificationController = function FfcNotificationController(){
	logger.info("In Notification Controller");
} 

FfcNotificationController.prototype.testController = function testController(){
	logger.info("In notification Controller");
	notificationService.test();
}


FfcNotificationController.prototype.getStoreIds = function getStoreIds(req, res){
	logger.info("In getStoreIds");
	var orgId = req.headers.orgid;
	notificationService.getStoreIds(orgId);
	logger.info("In getStoreIds");
}

FfcNotificationController.prototype.sendDataSanityNotification = function sendDataSanityNotification(req, res){
	logger.info("In sendDataSanityNotification");
	
}

module.exports = FfcNotificationController;