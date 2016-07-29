// adapted from
// http://stackoverflow.com/questions/1191865/code-for-a-simple-javascript-countdown-timer

var timer;
var instance = undefined;
var running = false;
var update = undefined;

module.exports = {
	
		tick: function() {
		    if (seconds === 0) {
      			instance.stop();
      	    }
		    seconds--;
		    update(seconds);
		},

		start: function (options) {
			seconds = options.seconds || 300;
			update = options.onUpdate || function () {};

		    clearInterval(timer);
		    timer = 0;
		    running = true;
		    instance = this;
		    update(seconds);
		    timer = setInterval(instance.tick, 1000);
		},

		stop: function () {
		  	running = false;
		    clearInterval(timer);
		},

		isRunning: function() {
		  	return running;
		}

}