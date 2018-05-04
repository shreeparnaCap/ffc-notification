var amqp = require('amqplib/callback_api');
var logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn')
var notificationService = require('../services/').getFfcNotificationService();
var notificationDetailsModel = require('../models/ffc-notification.model').NotificationDetails;
var notificationTypes = require('../lib/notificationTypes').NotificationTypes;
var currentTime = require('../utils/generics.util').getDateTime;
var templateGenerator = require('../utils/templateGenerator.util').templateGenerator;
var kpiTypes = require('../lib/kpiTypes').kpiEnum;
var kpiTypes = require('../lib/kpiTypes').rolesEnum;
var BaseController = require('./base.controller');
var util = require('util');
const serviceMapper = require('@capillarytech/arya').ServiceFinder;
const rabbitParams = serviceMapper.getDbParams('rabbitmq');
const rabbitValues = serviceMapper.getDbServiceValues('rabbitmq');

var FfcNotificationController = function FfcNotificationController(){
	logger.info("In Notification Controller");
} 
util.inherits(FfcNotificationController,BaseController)

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
	var options = {}

	var notificationId = req.params.notificationId;	
	options.notificationId = req.params.notificationId;
	logger.info(" Received NotificationId", notificationId);
	var that = this;
	
	notificationService.getNotificationDetails(options)
	.then(function(response){
		logger.info("Notification Respose", response);
		logger.info(response instanceof Array);
		logger.info(response[0]);
		response = response[0];

		var obj = {}
		obj['_id'] = response.id;
		obj['type'] = "FFC";
		obj['date'] = currentTime();
		obj['orgId'] = response.org_id;
		obj["communicate"] = false;
		obj['message'] = response.message;
		obj['status'] = (response.readAt !== null) ? "UNREAD": "READ";
		obj['userId'] = response.user_id;
		obj["entityList"] = [{}]
		obj['channel'] = response.channel;
		obj['notificationType'] = response.priority_type;
		obj['title'] = response.text;
		obj['text'] = response.text;
		obj['kpis'] = [{
			"settings": {
				"units": "currency",
				"decimals": 2
			},
			"name": "Data Missing Report"
		}];
		obj["__v"]=  0;
		// obj['entityList'] = 

		logger.info("Object Created",obj);
		res.json(that.getSuccessResponse("notification", obj));
	}).catch(function(err){
		logger.error(err);
		res.json(that.getErrorResponse(err));
	})
	
}

FfcNotificationController.prototype.sendDataSanityNotification = function sendDataSanityNotification(req, res){
	logger.info("In sendDataSanityNotification");
	var that = this;
	var configId = req.params.config_id;

	// var dataSanityConfigsPromise = notificationService.getNotificationConfigs(type);
	// var enabledOrgsPRomise = notificationService.getEnabledOrgs();
	// dataSanityConfigsPromise.then(function(configs){
		// logger.info("CONFIGS - ", configs );
		// configs.forEach(function(config){
		// 	notificationService.getMessageContent(config);
		// })

		notificationService.getConfigDetailsById(configId).then(function(config){
		config = config[0];
		that.orgId = config.orgId;
		that.selfRoles = config.selfRoles;

		logger.info("Config Org id",config.orgId);
		// enabledOrgsPRomise.then(function(rows){
		// 	rows.forEach(function(orgId){
		
		notificationService.checkOrgEnabled(that.orgId).then(function(isEnabled){
				logger.info("IS ENABLED - ",isEnabled);
				var storesPromise = notificationService.getStoreIdsVisitorKpi(that.orgId);
				
				storesPromise.then(function(stores){
					notificationService.getAdminUserStoreMappingSelf(that.orgId,that.selfRoles);
					var adminUserStoreListPromise = notificationService.getAdminUsersForStores(that.orgId, stores);	

					adminUserStoreListPromise.then(function(adminUserStoreList){
						logger.info("IN CONTROLLER ADMIN STORE LIST");
						logger.info("Admin Result ", adminUserStoreList);
						
						var connectionString ;

						if (process.env.NODE_ENV === 'production') {
							connectionString = "amqp://" + rabbitValues.user + ":" + rabbitValues.pass.replace(/\"/g,"") + "@" + rabbitValues.host + "/";
						} else {
							connectionString = "amqp:";//capillary:123";
						}
						amqp.connect(connectionString, function(err, connection) {


						adminUserStoreList.forEach(function(row){
							logger.info(row.storeId + " - "+ row.adminId);
		 					
		 					//TODO: fetch from DB use placeholders
							var message = "We did not receive data from your Store -";

							var notificationDetails = new notificationDetailsModel(
															notificationTypes.DATA_SANITY,
															row.storeId,
															that.orgId,
															row.adminId,
															row.role,
															currentTime(),
															"SENT",
															undefined,
															"TITLE",
															"HEADER",
															message,
															"PUSH",
															undefined,
															undefined
															);
							var notificationIdPromise = notificationService.saveNotificationDetailsToDB(notificationDetails);

							notificationIdPromise.then(function(notificationId){
								//TODO: Fetch from DB, title
								var title = "FFC Data Not Received";
								var date = '"'+currentTime()+'"';

								var obj = {}
								obj['_id'] = notificationId;
								obj['type'] = "FFC";
								obj['date'] = currentTime();
								obj['orgId'] = that.orgId;
								obj["communicate"] = false;
								obj['message'] = message;
								obj['status'] = "UNREAD";
								obj['userId'] = row.adminId;
								obj["entityList"] = [{}]
								obj['channel'] = "push";
								obj['notificationType'] = "INFO";
								obj['title'] = title;
								obj['text'] = message;
								obj['kpis'] = [{
									"settings": {
										"units": "currency",
										"decimals": 2
									},
									"name": "Data Missing Report"
								}];
								obj["__v"]=  0;
								
								logger.info("MESSAGE - "+message+", TITLE - "+title+" ORGID - "+orgId+" TITLE - "+title +" userId"+row.adminId)

								connection.createChannel(function(err, channel) {
									var queue = 'notification_communicator';
								
									channel.assertQueue(queue, {durable: true});
									// Note: on Node 6 Buffer.from(msg) should be used
									channel.sendToQueue(queue, new Buffer(JSON.stringify(obj), {persistent: true}));
									logger.info("Sent message ",JSON.stringify(obj,4, null));
									
								});
							}).catch(function(err){
								logger.info("WHTA THE HELL ARFE YOU DOING ", err)
								
								logger.error(err);
							});
						})
					})
				})				
				})
			})
		})
	}

module.exports = FfcNotificationController;