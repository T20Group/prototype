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

var POLL_INTERVAL = 30;
var SENSOR_FLUCTUATING_TIME = 5000;

//INIT SENSOR API
var api = AgentAPI();
api.startSensor();


// TIMEOUT FUNCTION FOR SENSOR
function sensor_poll_timeout() {
	setTimeout(sensor_poll, POLL_INTERVAL);
}


// GAME CONSTANTS
var P_START = false;
var P_MAX = 120;
var P_AREA = 50;
var P_BUFFER = P_MAX - P_AREA;	
var p_min = 0;

var p_total = 0;
var ass_moving = false;

// set balloon size
function setBalloon(size, target) {
	if (p_total<10) {
		p_total = 50;
	}
	
	$('#sam').attr('height', p_total);
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

        /*
        var r = d/139; // get ratio
        var h = 1000*r;
        $('#sam').attr('height', h);
		*/
		
        if (!P_START) { // if pump start is false
	    	if (d>=P_MAX && d<=P_MAX+15) {
		        p_power = "ok, within hump range, hump now!";
				P_START = true;
	        }
	        
        } else { // else start pumping
			if (d>=P_BUFFER && d<P_MAX ) { 			
				p_min = d;
				p_power = p_min-P_BUFFER;
				p_total += p_power;
				
				P_START = false;
			}
	          
        } 
        
        
		ass_moving = true;
		
		
		setBalloon(p_total);
        
		msg = d;
	    logText(p_power, msg);

      } else {
        // miss
        window.sensingMovementStillTimeout = setTimeout(function(){
        	//$('#log').text("trigger a restart");
        	//restartPlayer();
        	
        	ass_moving = false;
        	msg = "Stand behind the line!";
        	
        	
        	if(!ass_moving) {
	        	p_total -= 2;
        	}
        	
        	setBalloon(p_total);
        	
        	$('#log').text(msg);
        	
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
