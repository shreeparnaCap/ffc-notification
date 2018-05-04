var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
var DBase = require('@capillarytech/arya-dbconnect');
var dObject = new DBase({dbname:"authorization"});
var ConfigDetails =  require('../models/ffc-notification.model').ConfigDetails



var FfcNotificationRepo =  function FfcNotificationRepo(){
	logger.info("In FfcNotificationRepo");
};


// FfcNotificationRepo.prototype.getStoreIds = function getStoreIds(){
// 	logger.info("In FfcNotificationsRepo get Stores");
// }

FfcNotificationRepo.prototype.getNotifications =  function getNotifications(options){
	logger.info("In getNotifications",options);
	var fetchQuery = "";

	if(options.notificationId != undefined)
		fetchQuery = "SELECT * FROM  ffc_notifications_data_details.notifications WHERE `id`= "+options.notificationId+" ;";
	else
		fetchQuery = "SELECT * FROM  ffc_notifications_data_details.notifications";

	logger.info("get notifications qquery",fetchQuery);
	return dObject.query(fetchQuery)
	.then(function(notificationRow){
		logger.info("ROWS  -------- " , notificationRow);
		return Promise.resolve(notificationRow);
	}).catch(function(err){
		logger.error(err);
		return Promise.reject(err);
	})
}

FfcNotificationRepo.prototype.getConfig = function getConfig(configId){
	if(configId != undefined){
		logger.info("In getConfigDetailsById REPO")
		var fetchQuery = "SELECT * FROM ffc_notifications_meta_details.notification_configs WHERE id ="+configId +";";
		logger.info(fetchQuery);
		

		return dObject.query(fetchQuery)
		.then(function(configRow){
				logger.info("DB Response",typeof(configRow));
				

				//  configRow.forEach(function(row){
				// 	logger.info("Inside ARRAY",row);

				// 	var ob = { "orgId":1222};
				// 	return Promise.resolve(ob);
				// })


				// var config = new ConfigDetails(configRow.id, configRow.name, configRow.orgId, configRow.type, configRow.kpi, configRow.target, configRow.selfRoles, configRow.parentRoles, configRow.scheduledInterval, configRow.scheduledTime);
				 return Promise.resolve(configRow);			
		});
	}
}

FfcNotificationRepo.prototype.checkOrgEnabled = function checkOrgEnabled(orgId){
	logger.info("Org Id in repo -",orgId)
	var query = "SELECT `is_ffc_enabled` FROM ffc_notifications_meta_details.org_configs WHERE org_id = "+orgId+";";
	return dObject.query(query)
	.then(function(row){
		logger.info("is enabled org",row[0]);
		return Promise.resolve(row[0].is_ffc_enabled);
	})
}

module.exports = FfcNotificationRepo;