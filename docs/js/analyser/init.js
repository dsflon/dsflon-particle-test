var btn,
	volumeBtn,
	loading;

var SRC = "/audio/common/music/sample01.mp4";

var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();

var audioContext,audioBuffer,noteBuffer;
var fileReader   = new FileReader;

/* analyser */
var analyser;
var SMOOTHING = 0.93;
var FFT_SIZE = Math.pow(2,12);
/* analyser */

/* control */
var startOffset = 0,
	startTime = 0;
var gainNode;
/* control */

/* canvas */
var animationId;
/* canvas */

window.onload = init;

function init() {

	playBtn = document.getElementById("playBtn");
	stopBtn = document.getElementById("stopBtn");
	userMediaBtn = document.getElementById("userMediaBtn");
	file = document.getElementById("file");
	fileWrap = document.getElementById("fileWrap");
	volumeBtn = document.getElementById("volumeBtn");
	loading = document.getElementById("loading");

	navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();

	if (!navigator.getUserMedia) {
		userMediaBtn.className = "disabled";
	}

	file.addEventListener('change', function(e){
		fileReader.readAsArrayBuffer(e.target.files[0]);
	});

	/*================================================ analyser*/
	analyser = audioContext.createAnalyser();
	analyser.fftSize = FFT_SIZE;
	analyser.smoothingTimeConstant = SMOOTHING;
	/*================================================ analyser*/

}
