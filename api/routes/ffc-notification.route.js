const express = require('express')
const logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn')
const router = express.Router();
const Promise = require('bluebird');
const ffcNotificationController = require('../controllers/').getFfcNotificationController();

router.get('/store', function(req, res){
	logger.info("In Notification Router");
	ffcNotificationController.getStoreIds(req, res);
	res.send("OK Notification Store");
	// return Promise.resolve("RESULT OK");
})

router.get('/sendNotification/dataSanity/:config_id', function(req, res){
	logger.info("In Notification Router dataSanity");
	ffcNotificationController.sendDataSanityNotification(req,res);
	res.send("OK Notification Data Sanity");
})

router.get('/notification/:notificationId', function(req, res){
	logger.info("In get One Notification");
	ffcNotificationController.getNotificationDetails(req,res);
	// res.send("OK get one notifn")
})

router.get

module.exports = router;