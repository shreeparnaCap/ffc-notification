var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn')
var notificationService = require('../services/').getFfcNotificationService();
var notificationDetailsModel = require('../models/ffc-notification.model').NotificationDetails;
var notificationTypes = require('../lib/notificationTypes').NotificationTypes
var currentTime = require('../utils/generics.util').getDateTime

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
}

FfcNotificationController.prototype.sendDataSanityNotification = function sendDataSanityNotification(req, res){
	logger.info("In sendDataSanityNotification");
	var enabledOrgsPRomise = notificationService.getEnabledOrgs();
	enabledOrgsPRomise.then(function(rows){
		rows.forEach(function(orgId){
			var storesPromise = notificationService.getStoreIds(orgId);
			storesPromise.then(function(stores){
				logger.info("STORES - ",stores);
				logger.info("ORGID",orgId );
				var adminUserStoreListPromise = notificationService.getAdminUsersForStores(orgId, stores);	
				

				adminUserStoreListPromise.then(function(adminUserStoreList){
					logger.info("IN CONTROLLER ADMIN STORE LIST");
					
					adminUserStoreList.forEach(function(row){
						logger.info(row.storeId + " - "+ row.adminId);
						logger.info("notificationTypes.DATA_SANITY --"+notificationTypes.DATA_SANITY +", orgId -"+orgId+", currentTime- "+ currentTime());
	 
						var message = "We did not receive data from your Store -"+ row.storeId +"for the org Id - "+orgId;


						var notificationDetails = new notificationDetailsModel(
														notificationTypes.DATA_SANITY,
														row.storeId,
														orgId,
														row.adminId,
														currentTime(),
														"SENT",
														message
														);
						notificationService.saveNotificationDetailsToDB(notificationDetails);
					})	
				})
			})
		})

	})
}

module.exports = FfcNotificationController;