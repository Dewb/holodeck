
var currentVoice = null;
var speechSynthesis = window.speechSynthesis;
var numPending = 0;

var startedSpeakingEvent = new Event('startedSpeaking');
var stoppedSpeakingEvent = new Event('stoppedSpeaking');

module.exports = {

	setVoice: function(name) {
		var voices = speechSynthesis.getVoices();
		var newVoice = null;
		for (var i = 0; i < voices.length; i++) { 
			if (voices[i].name == name) {
				newVoice = voices[i];
			}
		}

		if (newVoice) {
			currentVoice = newVoice;
		} 
	},

	say: function(text, cancelPending) {
		var msg = new SpeechSynthesisUtterance();
		msg.text = text;
		msg.voice = currentVoice;
		msg.onend = function () {
			numPending--; 
			if (numPending <= 0) {
				window.dispatchEvent(stoppedSpeakingEvent); 
				numPending = 0;
			}
		}

		if (cancelPending && speechSynthesis.pending) {
			speechSynthesis.cancel();
			numPending = 0;
		} else if (numPending <= 0) {
			numPending = 0;
			window.dispatchEvent(startedSpeakingEvent);
		}
		
		speechSynthesis.speak(msg);
		numPending++;
	},

	stop: function() {
		numPending = 0;
		speechSynthesis.cancel();
		window.dispatchEvent(stoppedSpeakingEvent); 
	}

};