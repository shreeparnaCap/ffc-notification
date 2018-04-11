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

router.get('/sendNotification/dataSanity', function(req, res){

})

module.exports = router;