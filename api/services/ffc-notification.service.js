var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
var FfcNotificationsRepo = require('../repos/').getFfcNotificationRepo();
var StoreCareRepo = require('../repos').getStoreCareRepo();
var DBase = require('@capillarytech/arya-dbconnect');

var dObject = new DBase({dbname:"authorization"});

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

		logger.info("[@@@@@@@] STORES",storeData );
		logger.info("[@@@@@@@] ORGID",orgId);
		var stores = [];

		if(storeData[orgId] !== undefined){
				var storeDataList = JSON.stringify(storeData[orgId].stores) ; 
				storeDataList = JSON.parse(storeDataList)
				storeDataList.forEach(function(storeData){
					//FIND DIFF
					stores.push(storeData.storeId);
				})
		}		
		
		return Promise.resolve(stores);
	})
}

FfcNotificationService.prototype.getEnabledOrgs = function getEnabledOrgs(){
	logger.info("In getEnabledOrgs");
	var queryEnabledOrgs = "select org_id from ffc_notifications_meta_details.org_configs where is_ffc_enabled=1";

	return dObject.query(queryEnabledOrgs)
		.then(function(rows){
			logger.info("ROWS  -------- " , rows);
			var orgIDs=[];
			rows.forEach(function(row){
				orgIDs.push(row.org_id);
			})
			return Promise.resolve(orgIDs);
		})
		.catch(function(err){
			logger.error(err);
		})

}

FfcNotificationService.prototype.getAdminUsersForStores = function getAdminUsersForStores(orgId, stores){
	logger.info("In getAdminUsersForStores")
	var queryAdminUsersForStores = 	"SELECT admin_user_id, ref_id FROM `masters`.`admin_user_roles` WHERE `org_id` = "+ orgId+" AND `type` = 'STORE' AND `ref_id` IN ( ";
	var storesStr = "";
	stores.forEach(function(store){
		if(storesStr === "")
			storesStr +="'"+store+"'";
		else
			storesStr +=", '"+store+"'";
	})
	queryAdminUsersForStores+=storesStr;
	queryAdminUsersForStores += ");"
	logger.info("QUERY --- "+queryAdminUsersForStores);



	var mastersConnection = new DBase({ orgId:orgId, dbname:"masters"})
	return mastersConnection.query(queryAdminUsersForStores).then(function(rows){
			logger.info("ADMIN ROWSS --- ", rows);

			var falseList = [
					{ 
						storeId : "50008488",
						adminId : "111"
					},
					{ 
						storeId : "50008483",
						adminId : "112"
					},
					{ 
						storeId : "50008431",
						adminId : "113"
					},
					{ 
						storeId : "50008462",
						adminId : "114"
					},
					{ 
						storeId : "50008478",
						adminId : "115"
					},
					{ 
						storeId : "50008473",
						adminId : "116"
					},
				]

			// return Promise.resolve(rows);
			return Promise.resolve(falseList);
		})
		.catch(function(err){
			logger.error(err);
		})
}

FfcNotificationService.prototype.saveNotificationDetailsToDB = function saveNotificationDetailsToDB(notificationOb){
		logger.info("IN SRVC ---- ");
		logger.info("notificationTypes.DATA_SANITY --"+notificationOb.configId );


		var insertQuery = "INSERT INTO `ffc_notifications_data_details`.`notifications`(`notification_config_id`, `store_id`, `org_id`, `user_id`, `sent_time`, `status`, `message`, `createdBy`) VALUES (" 
		+ notificationOb.configId+","+notificationOb.storeId+","+notificationOb.orgId+","+notificationOb.adminId+",'"+notificationOb.sentTime+"', '"+notificationOb.status+"', '"+
		notificationOb.message+"',"+notificationOb.createdBy+");";

		logger.info("INSERT QUERY"+insertQuery);


		return dObject.insert(insertQuery)
		.then(function(insertId){
			logger.info("INSERT ID IS --- ",insertId);
			return Promise.resolve(insertId);
		})
		.catch(function(err){
			logger.error(err);
		})
}



module.exports = FfcNotificationService;