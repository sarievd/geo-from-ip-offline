const path = require('path');
const fs = require('fs');
const maxmind = require('maxmind');

const buffer = fs.readFileSync(path.join(__dirname, '/../db/GeoLite2-City.mmdb'));
const lookup = new maxmind.Reader(buffer);



function getAllGeoData(ip) {
    const geoData = lookup.get(ip);
    const result = {};

    if (geoData) {
        result.city = (geoData.city) ? geoData.city : null;
        result.continent = (geoData.continent) ? geoData.continent : null;
        result.country = (geoData.country) ? geoData.country : null;
        result.location = (geoData.location) ? geoData.location : null;
        result.registered_country = (geoData.registered_country) ? geoData.registered_country : null;
        result.subdivisions = (geoData.subdivisions[0]) ? geoData.subdivisions[0] : null;
    } else {
       return new FailedResponse({code: 'NOT_FOUND', msg: `Geo data not found by ip: ${ip}`});
    }

    return new SuccessResponse(result);
}

function getCityData(ip){
    const geoData = lookup.get(ip);

    if (geoData.city) {
        return new SuccessResponse(geoData.city);
    } else {
        return new FailedResponse({code: 'NOT_FOUND', msg: `City data not found by ip: ${ip}`})
    }
}

function getCountryData(ip){
    const geoData = lookup.get(ip);

    if (geoData.country) {
        return new SuccessResponse(geoData.country);
    } else {
        return new FailedResponse({code: 'NOT_FOUND', msg: `Country data not found by ip: ${ip}`})
    }
}

function getLocationData(ip){
    const geoData = lookup.get(ip);

    if (geoData.location) {
        return new SuccessResponse(geoData.location);
    } else {
        return new FailedResponse({code: 'NOT_FOUND', msg: `Location data not found by ip: ${ip}`})
    }
}

function getContinentData(ip){
    const geoData = lookup.get(ip);

    if (geoData.continent) {
        return new SuccessResponse(geoData.continent);
    } else {
        return new FailedResponse({code: 'NOT_FOUND', msg: `Continent data not found by ip: ${ip}`})
    }
}

function validateIp(ip) {
    return maxmind.validate(ip)
}

module.exports.getAllGeoData = getAllGeoData;
module.exports.getCityData = getCityData;
module.exports.getCountryData = getCountryData;
module.exports.getLocationData = getLocationData;
module.exports.getContinentData = getContinentData;
module.exports.validateIp = validateIp;




class SuccessResponse {
    constructor(data) {
        this.success = true;
        this.data = data;
        this.error = null;
    }
}

class FailedResponse {
    constructor(data) {
        this.success = false;
        this.data = null;
        this.error = {
            code: (data.code) ? data.code : null,
            msg: (data.msg) ? data.msg : null
        };
    }
}
