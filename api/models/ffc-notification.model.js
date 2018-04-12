var NotificationDetails = function NotificationDetails(configId, storeId, orgId, adminId, sentTime, status, message, createdBy){
	this.configId = configId;
	this.storeId = storeId;
	this.orgId = orgId;
	this.adminId = adminId;
	this.sentTime = sentTime;
	this.status = status;
	this.message = message;
	this.createdBy = createdBy || -1;
}


var LiveKpiDataDetails = function LiveKpiDataDetails(id, name, current, live, last, target, extra, compare) {
    this.id = id || 0;
    this.label = name || '';
    this.current_dimension = current;
    this.next_dimension = 'NONE';
    this.live = live || 0;
    this.last = last || 0;
    this.prevValues = [0, 0, 0];
    this.target = target || 0;
    this.extra = extra || {};
    this.compare = compare || {};
    this.distribution = {}
    this.msg = "user doesn\'t have access to any entities";
}


module.exports = {
	NotificationDetails
}