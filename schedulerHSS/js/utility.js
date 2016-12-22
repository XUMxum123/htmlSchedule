
var g_util_mtvObj;  

function utilInit(object) {
    g_util_mtvObj = object;
}

function utilConvertUtcToLocalTime(utcTime) {
    
    var localTime = null;
    
    if (g_util_mtvObj) {          
        localTime = g_util_mtvObj.convertUtcToLocalTime(parseInt(utcTime));
    }
    
    
    return localTime;
}
function utilGetYear(localTime) {
    if (localTime) { 
        return localTime.DTG.YEAR; 
    }
    return 0;    
}
function utilGetMonth(localTime) {
    if (localTime) { 
        return localTime.DTG.MONTH; 
    }
    return 0;    
}

function utilGetDay(localTime) {
    if (localTime) { 
        return localTime.DTG.DAY; 
    }
    return 0;    
}
function utilGetWeek(localTime) {
    if (localTime) { 
        return localTime.DTG.WEEK; 
    }
    return 0;    
}
function utilGetHours(localTime) {
    if (localTime) { 
        return localTime.DTG.HOUR; 
    }
    return 0;    
}

function utilGetMinutes(localTime) {
    if (localTime) { 
        return localTime.DTG.MINUTE; 
    }
    return 0;    
}
function utilGetSecond(localTime) {
    if (localTime) { 
        return localTime.DTG.SECOND; 
    }
    return 0;    
}