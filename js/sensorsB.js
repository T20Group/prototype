//GLOBAL VARS
var POLL_INTERVAL = 50;
var SENSOR_FLUCTUATING_TIME = 5000;

// Start the proximity App
Agent.send({
"intent_name": "au.com.sct.agent.plugins.sensors.START_PROXIMITY_SERVICE"
});


//Listen for messages from the proximity app
Agent.listen({
"interval": POLL_INTERVAL
}, function(json){
var x = JSON.parse(json).intents;

    for(var i=0; i < x.length;i++) {
      if (x[i].inrange) {
        // in range
        clearTimeout(window.sensingMovementStillTimeout);
        $('#log').text('found');

      } else {
        // miss
        window.sensingMovementStillTimeout = setTimeout(function(){
          $('#log').text('not found');
        }, SENSOR_FLUCTUATING_TIME);

      }
    }
});