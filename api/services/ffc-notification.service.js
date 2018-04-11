var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
var FfcNotificationsRepo = require('../repos/').getFfcNotificationRepo();
var StoreCareRepo = require('../repos').getStoreCareRepo();

var FfcNotificationService = function FfcNotificationService(){
	logger.info("In FfcNotificationService");
}


FfcNotificationService.prototype.test = function test(){
	logger.info("Testing service");
	FfcNotificationsRepo.getStoreIds();
}

FfcNotificationService.prototype.getStoreIds = function getStoreIds(orgId){
	logger.info("In FfcNotificationService Stores")
	return StoreCareRepo.getStoreIds()
	.then((storeData) => {
		var storeDataList = JSON.stringify(storeData[orgId].stores) ; 
		logger.info("[***]" ,JSON.parse(storeDataList)[0]);
		storeDataList = JSON.parse(storeDataList)
		var stores = [];

		storeDataList.forEach(function(storeData){
			logger.info("[OOO] Store - ",storeData.storeId);
			stores.push(storeData.storeId);
		})

		return Promise.resolve(stores);
	})
}

FfcNotificationService.prototype.getEnabledOrgs = function getEnabledOrgs(){
	logger.info("In getEnabledOrgs");
	
}

module.exports = FfcNotificationService;