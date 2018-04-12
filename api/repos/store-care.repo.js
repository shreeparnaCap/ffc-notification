const logger = require('@capillarytech/arya').Logger.getLogger('ffc-notifn');
const apiUtil = require('../utils/apiRequests.util').makeRestApiCall;



var StoreCareRepo = function StoreCareRepo(){
	logger.info("In Store Repo");
}

StoreCareRepo.prototype.getStoreIds = function getStoreIds(){
	logger.info("In get Store Care");
	const getStoreIdUrl = 'http://storecare.nightly.capillary.in:8002/notifications';
	var options = {
		method:'GET',
		uri:getStoreIdUrl
		
	};
	logger.info(" ***** MAKING REST CALL ")
	return 	apiUtil(options);
}


module.exports = StoreCareRepo; 