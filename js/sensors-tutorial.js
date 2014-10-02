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
       // $('#log').text("RES", res);
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

var POLL_INTERVAL = 500;
var SENSOR_FLUCTUATING_TIME = 10000;

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
        var d = intents[i].reading;
        clearTimeout(window.sensingMovementStillTimeout);
/*         $('#log').text("WE'RE IN RANGE ............ " + distance); */
        //startPlayer();
        //var msg = "Hey you";
        /*
        if (d>=100) { msg = "Hey you! over here!"; }
        if (d>=70 && d<=99) { msg = "Come closer"; }
        if (d>=30 && d<=69) { msg = "Come on, closer, closer!"; }
        if (d<=29) { msg = "Too close, help!"; }
		*/


      } else {
        // miss
        window.sensingMovementStillTimeout = setTimeout(function(){
        	//$('#log').text("trigger a restart");
        	//restartPlayer();
        	window.location.href = "index.html";
        	
        }, SENSOR_FLUCTUATING_TIME);

      }
    } 
  });
  sensor_poll_timeout();
}
 
 
function logText(text, x = 0) {
	$('#log').text(text);
	$('#distance').text(x);
} 
// START THE TIMEOUT LOOP
sensor_poll_timeout();
