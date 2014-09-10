// -----------------------------------------------------
// SENSOR INTENT HANDLING
// -----------------------------------------------------
 
var AgentAPI = function() {
var API_URL = "http://127.0.0.1:8080/api";
 
function sendToApi(endPoint, method, data, callback) {
var oReq = new XMLHttpRequest();
var url = API_URL + "/" + endPoint;
if (!method || (typeof method == "function")) {
var method = "GET";
}
oReq.open(method, url, true);
oReq.setRequestHeader("Content-Type", "text/plain");
oReq.onload = function(e) {
var res = oReq.responseText;
if (callback && (typeof callback == "function")) {
callback(res);
} else {
$('#log').text("RES", res);
}
}
oReq.send(data);
}
 
function startSensor(callback) {
var data = {};
data.intent_name = "au.com.sct.agent.plugins.sensors.START_PROXIMITY_SERVICE";
sendToApi("intents", "POST", JSON.stringify(data), callback);
}
 
function pollSensor(callback) {
sendToApi("intents", "GET", null, callback);
}
 
return {
startSensor : startSensor,
pollSensor: pollSensor
}
};
 
 
 
//------------------------------------------
 
var POLL_INTERVAL = 50;
var SENSOR_FLUCTUATING_TIME = 5000;
 
//INIT SENSOR API
var api = AgentAPI();
api.startSensor();
 
 
// TIMEOUT FUNCTION FOR SENSOR
function sensor_poll_timeout() {
setTimeout(sensor_poll, POLL_INTERVAL);
}
 
 
// POLL THE SENSOR
function sensor_poll() {
api.pollSensor( function(json) {
//$('#log').text("polled..", json);
var intents = JSON.parse(json).intents;
 
for(var i=0; i < intents.length;i++) {
if (intents[i].inrange) {
// in range
// $(document).trigger('touchstart');
clearTimeout(window.sensingMovementStillTimeout);
//console.log("WE'RE IN RANGE.......................");
$('#log').text("WE'RE IN "+ i +"mm RADIUS");
startPlayer();
 
} else {
// miss
window.sensingMovementStillTimeout = setTimeout(function(){
$('#log').text("trigger a restart");
restartPlayer();
}, SENSOR_FLUCTUATING_TIME);
 
}
}
});
sensor_poll_timeout();
}
// START THE TIMEOUT LOOP
sensor_poll_timeout();