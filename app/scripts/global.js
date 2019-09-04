const API_URL = "/api/races";
const API_ARCHIVES_URL = "/api/archives";
const API_BUGS_URL = "/api/bugs";
const POLL_INTERVAL = 2000;
const CURRENT_SEASON = "XC 2019";

const SCHEDULED_RACES = [
    "Vanderbilt Invite",
    "Knight Invite",
    "Michigan State Invite",
    "GRCC Raider Invite",
    "Notre Dame Invite",
    "Lansing Invite",
    "Oshkosh Invite",
    "Muskegon Jayhawk Invite",
    "Prairie Wolf Invite",
    "Conference",
    "Regionals",
    "Nationals"
]

const EVENTS = [
    "Event", 
    "5000m",
    "8k", 
    "3000m", 
    "1500m", 
    "Steeple", 
    "10000m", 
    "Mile",
    "15k",
    "7 Mile",
    "1600m", 
    "800m", 
    "400m", 
    "2000m", 
    "400m Split",
]
if(process.env.GENDER == "womens") {
    EVENTS.forEach(event => {
        if(event == "8k") event = "6k"
    });
}


module.exports = {API_URL, API_BUGS_URL, POLL_INTERVAL, CURRENT_SEASON, API_ARCHIVES_URL, EVENTS, SCHEDULED_RACES };