var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn')
var notificationService = require('../services/').getFfcNotificationService();
var notificationDetailsModel = require('../models/ffc-notification.model').NotificationDetails;
var notificationTypes = require('../lib/notificationTypes').NotificationTypes;
var currentTime = require('../utils/generics.util').getDateTime;
var kpiTypes = require('../lib/kpiTypes').kpiEnum;
var kpiTypes = require('../lib/kpiTypes').rolesEnum;


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
	notificationService.getStoreIdsVisitorKpi(orgId);
}

FfcNotificationController.prototype.getNotificationDetails = function getNotificationDetails(req, res){
	logger.info("getNotificationDetails Controller");
	var notificationId = req.params.notificationId;
	logger.info("notificationId", notificationId);

}

FfcNotificationController.prototype.sendDataSanityNotification = function sendDataSanityNotification(req, res){
	logger.info("In sendDataSanityNotification");

	var type='DATA-SANITY';
	var dataSanityConfigsPromise = notificationService.getNotificationConfigs(type);
	var enabledOrgsPRomise = notificationService.getEnabledOrgs();
	 
	dataSanityConfigsPromise.then(function(configs){
		logger.info("CONFIGS - ", configs );

		configs.forEach(function(config){
			var kpiType = config.kpi;
			
			if(kpiType == kpiTypes.visitor){

			}
		})



		enabledOrgsPRomise.then(function(rows){
			rows.forEach(function(orgId){


				var storesPromise = notificationService.getStoreIdsVisitorKpi(orgId);
				
				storesPromise.then(function(stores){
					var adminUserStoreListPromise = notificationService.getAdminUsersForStores(orgId, stores);	

					adminUserStoreListPromise.then(function(adminUserStoreList){
						logger.info("IN CONTROLLER ADMIN STORE LIST");
						
						adminUserStoreList.forEach(function(row){
							logger.info(row.storeId + " - "+ row.adminId);
							logger.info("notificationTypes.DATA_SANITY --"+notificationTypes.DATA_SANITY +", orgId -"+orgId+", currentTime- "+ currentTime());
		 					
		 					//TODO: fetch from DB use placeholders
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
							var notificationIdPromise = notificationService.saveNotificationDetailsToDB(notificationDetails);

							notificationIdPromise.then(function(notificationId){
								//TODO: Fetch from DB, title
								var title = "FFC Data Not Received";
								var date = '"'+currentTime()+'"';

								var apiObject = {
									"data" : {
									"message" : message,
									"title" : title,
									"payload":{
											"orgId" : orgId,
											"id" : notificationId,
											"title" : title,
											"message" : message,
											"level": "INFO",
											"date": date,
											"userId": row.adminId,
											"channel": "push",
											"notificationType": "INFO"
										}
									}
								}



								// var uri = 'https://fcm.googleapis.com/fcm/send';
								// var options={
								// 	method:'POST',
								// 	uri: ,
								// 	headers:
								// }
								logger.info("MESSAGE - "+message+", TITLE - "+title+" ORGID - "+orgId+" TITLE - "+title +" userId"+row.adminId)
								logger.info(JSON.toString(apiObject));
							})
							.catch(function(err){
								logger.error(err);
							})
							

						})	
					})
				})
			})

		})

	})
}

module.exports = FfcNotificationController;