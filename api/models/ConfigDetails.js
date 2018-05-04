class ConfigDetails {
    
    constructor(id, name, orgId, type, kpi, target, selfRoles, parentRoles, scheduledInterval, scheduledTime){
        this.id  = id || 0;
        this.name =  name || '';
        this.orgId = orgId || 0;
        this.type = type || '';
        this.kpi = kpi || '';
        this.target = target || 0;
        this.selfRoles = selfRoles || '';
        this.parentRoles = parentRoles || '';
        this.scheduledInterval = scheduledInterval || 0;
        this.scheduledTime = scheduledTime || currentTime();
    }
}



module.exports = ConfigDetails
