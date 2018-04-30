var currentTime = require('../utils/generics.util').getDateTime;


var NotificationDetails = function NotificationDetails(configId, storeId, orgId, adminId, role, sentTime, status, readAt, title, header, message, channel, createdBy, createdOn){
    this.configId = configId;
	this.storeId = storeId;
	this.orgId = orgId;
    this.adminId = adminId;
    this.role = role|| 'NONE';
	this.sentTime = sentTime || currentTime();
    this.status = status || 'SENT';
    this.readAt = readAt || 'NONE';
    this.title = title;
    this.header = header;
    this.message = message;
    this.channel = channel || "PUSH";
    this.createdBy = createdBy || -1;
    this.createdOn = createdOn || currentTime();
}

var ConfigDetails = function ConfigDetails(id, name, orgId, type, kpi, target, selfRoles, parentRoles, scheduledInterval, scheduledTime){
    this.id  = id ;
    this.name =  name ;
    this.orgId = orgId ;
    this.type = type ;
    this.kpi = kpi ;
    this.target = target ;
    this.selfRoles = selfRoles ;
    this.parentRoles = parentRoles ;
    this.scheduledInterval = scheduledInterval ;
    this.scheduledTime = scheduledTime ;
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
    NotificationDetails,
    ConfigDetails
}