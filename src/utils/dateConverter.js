/* eslint-disable prettier/prettier */

var moment = require('moment-timezone');

export function convertTimeZone(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz)
    const formattedDate = moment(date).format('DD MMM YYYY')
    const formattedDateBasic = moment(date).format('DD-MM-YYYY')
    const formattedTime = moment(date).format('h:mm A')
    return ({ formattedDate, formattedTime,formattedDateBasic })
}
export function convertTimeZoneDateTime(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz)
    const formattedDate = moment(date).format('YYYY-MM-DD h:mm:ss');
    // const formattedTime = moment(date).format('h:mm A')
    return formattedDate;
}
export function getCurrentTime() {
    const localtz = moment.tz.guess()
    return moment().tz(localtz).format('YYYY-MM-DD h:mm:ss')
}
export function getSaleExpirationSeconds(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const eventDateTime = time.clone().tz(localtz)
    const currentDateTime =  moment().tz(localtz)
    return eventDateTime.diff(currentDateTime, 'seconds');
}
export function remaingDaysCount(originTime, inputTz = "Asia/Qatar") {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const eventDateTime = time.clone().tz(localtz)
    const currentDateTime =  moment().tz(localtz)
    return eventDateTime.diff(currentDateTime, 'days');
}
export function convertTimeZoneFormatted(originTime, inputTz = "Asia/Qatar",format) {
    const time = moment.tz(originTime, inputTz)
    const localtz = moment.tz.guess()
    const date = time.clone().tz(localtz);
    return  moment(date).format(format);
    

}





