var speech = require('./speech.js');
var library = require('./library.js');
var clock = require('./clock.js');

var workingPhrase = "";
var history = "";

$(document).ready(function() {
	
	updateTextEntry();

	if (localStorage["history"] != null) {
     	$("#history").html(JSON.parse(localStorage["history"]));
    } 
	
	$('#stopSpeaking').click(function() {
		speech.stop(); 
	});

	$('#toggleTimer').click(function() {
		if (clock.isRunning()) {
			clock.stop();
			$('#toggleTimer').text("START");
		} else {
			clock.start({ 
				seconds: 300, 
				onUpdate: function(seconds) {
					$('#time').text(formatSeconds(seconds));
					if (seconds == 0) {
						$('#toggleTimer').text("START");
					}
				}
			});
			$('#toggleTimer').text("STOP");
		}
	})

	$(document).on('click', '.phrase', function(e) {
		sayPhrase(e.target.innerText);
	});

    window.speechSynthesis.onvoiceschanged = function() {
		speech.setVoice("Google UK English Male");
	};

	window.addEventListener('startedSpeaking', function() { $('#status').show(); });
	window.addEventListener('stoppedSpeaking', function() { $('#status').hide(); });

	window.onkeydown = function(e) {
		if (e.key == "Enter") {
			sayPhrase(workingPhrase);
			library.addToLibrary(workingPhrase);
			workingPhrase = "";	
		} else if (e.key == "Escape") {
			speech.stop();
		} else if (e.ctrlKey || e.altKey || e.metaKey) {
			return; // allow default behavior for special keys
		} else if (isKeyPrintable(e)) {
			workingPhrase += e.key;
		} else if (e.keyCode == 8 || e.keyCode == 46) {
			// backspace or delete
			workingPhrase = workingPhrase.slice(0, -1);
		}

		updateTextEntry();
		e.preventDefault();
	}
});

function isKeyPrintable(e) {
	var keycode = e.keyCode;

    var valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32   || // spacebar 
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}

function formatSeconds(seconds) {
	return Math.floor(seconds / 60) + ":" + ((seconds % 60 < 10) ? "0" : "") + seconds % 60;
}

function updateTextEntry() {
	$('#textEntry span').text('> ' + workingPhrase);
}

function addToHistory(phraseText) {
	$('#history').append('<span class="timestamp">[' + formatSeconds(clock.currentTime()) + '] </span> ');
	$('#history').append('<span class="phrase">' + phraseText + '</span><br>');
	$('#history').scrollTop($('#history')[0].scrollHeight);
	localStorage["history"] = JSON.stringify($("#history").html());
}

function sayPhrase(phraseText) {
	speech.say(phraseText);
	addToHistory(phraseText);
}



