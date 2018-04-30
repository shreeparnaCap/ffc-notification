var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
var FfcNotificationsRepo = require('../repos/').getFfcNotificationRepo();
var StoreCareRepo = require('../repos').getStoreCareRepo();
var DBase = require('@capillarytech/arya-dbconnect');
var currentTime = require('../utils/generics.util').getDateTime


var dObject = new DBase({dbname:"authorization"});

var FfcNotificationService = function FfcNotificationService(){
	logger.info("In FfcNotificationService");
}


FfcNotificationService.prototype.test = function test(){
	logger.info("Testing service");
	FfcNotificationsRepo.getStoreIdsVisitorKpi();
}

FfcNotificationService.prototype.getStoreIdsVisitorKpi = function getStoreIdsVisitorKpi(orgId){
	logger.info("In FfcNotificationService Stores")
	return StoreCareRepo.getStoreIdsVisitorKpi()
	.then((storeData) => {

		logger.info("[@@@] STORES",storeData);
		logger.info("[@@@] ORGID",orgId);
		var stores = [];

		if(storeData[orgId] !== undefined){
				var storeDataList = JSON.stringify(storeData[orgId].stores) ; 
				storeDataList = JSON.parse(storeDataList)
				
				storeDataList.forEach(function(storeData){
					var lastEventTime = storeData.lastEventTime;
					var diff = (Date.parse(currentTime()) - Date.parse(lastEventTime))/ (3600000)

					if(diff>6){
						logger.info("STORE lastEventTime is  --- ",diff);
						stores.push(storeData.storeId);
					}	
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

FfcNotificationService.prototype.checkOrgEnabled = function checkOrgEnabled(orgId){
	logger.info("In checkOrgEnabled");
	return FfcNotificationsRepo.checkOrgEnabled(orgId)
	.then(function(isEnabled){
		logger.info("SERVICE ---",isEnabled);
		return Promise.resolve(isEnabled)
	}).catch(function(err){
		return Promise.reject(err);
	})
}

FfcNotificationService.prototype.getNotificationConfigs = function getNotificationConfigs(type){
	var query = "SELECT * FROM ffc_notifications_meta_details.notification_configs WHERE type='"+type+"' ;";
	return dObject.query(query).then(function(rows){
		logger.info("Config Rows", rows);
		return Promise.resolve(rows);
	})
}

FfcNotificationService.prototype.getConfigDetailsById = function getConfigDetailsById(configId){
	logger.info("In getConfigDetailsById service")
	return FfcNotificationsRepo.getConfig(configId).then(function(config){
		logger.info("In getConfigDetailsById service Promise")
		config.forEach(function(row){
			logger.info("ROWWWWW",row)
			return Promise.resolve(row);
		})
		logger.info("comes here ")
		return Promise.resolve(config);
	}).catch(function(err){
		return Promise.reject(err);
	})
}

FfcNotificationService.prototype.getAdminUsersForStores = function getAdminUsersForStores(orgId, stores){
	logger.info("In getAdminUsersForStores")
	var queryAdminUsersForStores = 	"SELECT admin_user_id, ref_id, org_id FROM `masters`.`admin_user_roles` WHERE `org_id` = "+ orgId+" AND `type` = 'STORE' AND `ref_id` IN ( ";
	var refId = "select a.id, a.org_id,a.role_name,a.role_type, b.ref_id, b.admin_user_id from org_roles as a join admin_user_roles as b  on a.id = b.role_id where a.org_id= 1195 and a.role_name='Zone Manager' "	



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
FfcNotificationService.prototype.getAdminUserStoreMappingSelf = function getAdminUserStoreMappingSelf(orgId, selfRoles){
	roles = selfRoles.split(",");
	


}

FfcNotificationService.prototype.saveNotificationDetailsToDB = function saveNotificationDetailsToDB(notificationOb){
		logger.info("IN SRVC ---- ");
		logger.info("notificationTypes.DATA_SANITY --"+notificationOb.configId );

		var insertQuery = "INSERT INTO `ffc_notifications_data_details`.`notifications`(`notification_config_id`, `store_id`, `org_id`, `user_id`, `role`, `sent_time`, `status`, `readAt`, `title`, `header`, `message`, `channel`, `createdBy`, `createdOn`) VALUES (" 
		+ notificationOb.configId+","+notificationOb.storeId+","+notificationOb.orgId+","+notificationOb.adminId+","+ "'"+notificationOb.role+"'"+",'"+notificationOb.sentTime+"', '"+notificationOb.status+
		"', '"+ notificationOb.readAt+"', '"+notificationOb.title+"', '"+notificationOb.header
		+"', '"+notificationOb.message+"', '"+notificationOb.channel+"', "+notificationOb.createdBy+ ", '" +notificationOb.createdOn+"' );";

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

FfcNotificationService.prototype.getMessageContent = function getMessageContent(config){
			var kpiType = config.kpi;
			var notificationType = config.type;
			role = 
			entityType = 
			entityName = 
			getTemplate(notificationType, kpi, role, entityType, entityName)
}

FfcNotificationService.prototype.getNotificationDetails = function getNotificationDetails(options){
	return FfcNotificationsRepo.getNotifications(options).then(function(notificationDetails){
		logger.info("In service get notification - ",notificationDetails);
		return Promise.resolve(notificationDetails);
	}).catch(function(err){
		logger.error(err);
		return Promise.reject(err);
	})
}



module.exports = FfcNotificationService;