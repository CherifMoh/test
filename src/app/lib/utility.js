import moment from "moment-timezone"; 

export function convertToTimeZone(date, timeZone = "Africa/Algiers") {
    return moment.utc(date).tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
}