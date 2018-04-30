var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
var kpiTypes = require('../lib/kpiTypes').kpiEnum;
var kpiTypes = require('../lib/kpiTypes').rolesEnum;
var notificationTypes = require('../lib/notificationTypes').NotificationEnum;



var templateGenerator = function templateGenerator(){
	logger.info("In templateGenerator");
} 

templateGenerator.prototype.getTemplate = function getTemplate(notificationType, kpi, role, entityType, entityName){
	var messageContent="";

	if(notificationType === notificationTypes.DATA_SANITY){
		
			if(role === kpiTypes.self){
				messageContent = kpi+ " Data for your "+ entityType +" - "+ storeName +" is not available for today. ";
			}
			else if(role === kpiTypes.parent){
				messageContent = kpi+ " Data for the below "+ entityType +" under you is not available for today. ";
				var storeList="";
				entityType.forEach(function(entity){
					storeList+=entity +", ";
				})
				messageContent+=storeList;
			}
		
	}


	return messageContent;
} 

module.exports = {
	templateGenerator
}