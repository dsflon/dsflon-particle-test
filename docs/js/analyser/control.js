var source;

var sound = {};
var userMedia = {};
var fraction;
var localMediaStream;

var fistPlayFlag = true;
var playing = true;
var fileFlag = false;
var userMediaFlag = false;

var input, filter;

fileReader.onload = function(){
	//ボタン関係
	loading.className = "active";
	playBtn.className = "hide";
	fileWrap.className = "hide";
	userMediaBtn.className = "hide";
	startOffset = 0;

	audioContext.decodeAudioData(fileReader.result, function(buffer){
		audioBuffer = buffer;
		loading.className = "";
		sound.play();
	}, function(error) {
		console.error("decodeAudioData error", error);
	});
};

loadNote = function() {
	var request = new XMLHttpRequest();
	request.open("GET", SRC, true);
	request.responseType = "arraybuffer";
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(buffer) {
			noteBuffer = buffer;
			audioBuffer = noteBuffer;
			loading.className = "";
			sound.play();
		}, function(error) {
			console.error("decodeAudioData error", error);
		});
	};
	request.send();
}

//////////////////////////////////////////////////////////////////
sound.fistPlay = function() {
	loading.className = "active";
	loadNote();
	fistPlay = false;
}

sound.play = function() {
	userMediaFlag = false;
	playing = true;

	if(source) {
		source.stop();
		cancelAnimationFrame(animationId);
	}

	if (!audioContext.createGain)
		audioContext.createGain = audioContext.createGainNode;
		this.gainNode = audioContext.createGain();

		fraction = parseInt(volumeBtn.value) / parseInt(volumeBtn.max);
		this.gainNode.gain.value = fraction;
		startTime = audioContext.currentTime;

		source = audioContext.createBufferSource();
		source.buffer = audioBuffer;

		source.connect(analyser);
		source.connect(this.gainNode);
		this.gainNode.connect(audioContext.destination);

		source.loop = true;
		if (!source.start)
			source.start = source.noteOn;
			source.start(0, startOffset % audioBuffer.duration);
			this.source = source;

			animationId = requestAnimationFrame(render);

			//ボタン関係
			stopBtn.className = "";
			volumeBtn.className = "";
};

sound.stop = function() {
	if (!this.source.stop)
		this.source.stop = source.noteOff;
		this.source.stop(0);
		cancelAnimationFrame(animationId);

	startOffset += audioContext.currentTime - startTime;

};

sound.changeVolume = function(element) {
  fraction = parseInt(element.value) / parseInt(element.max);
  this.gainNode.gain.value = fraction;
};

sound.start = function() {

	//ボタン関係
	playBtn.className = "hide";
	fileWrap.className = "hide";
	userMediaBtn.className = "hide";

	if(fistPlayFlag) {
		this.fistPlay();
		fistPlayFlag = false;
	} else {
		startOffset = 0;
		audioBuffer = noteBuffer;
		this.play();
	}

};

sound.toggle = function() {

	if(playing) {
		playBtn.className = "";
		fileWrap.className = "";
		userMediaBtn.className = "";
		stopBtn.className = "play";
		volumeBtn.className = "";

		if(!userMediaFlag) {
			this.stop();
		} else {
			console.log("userMedia.stop");
			volumeBtn.className = "hide";
			userMedia.stop();
		}
		playing = false;
	} else {
		playBtn.className = "hide";
		fileWrap.className = "hide";
		userMediaBtn.className = "hide";
		stopBtn.className = "";
		volumeBtn.className = "";

		if(!userMediaFlag) {
			this.play();
		} else {
			console.log("userMedia.start");
			volumeBtn.className = "hide";
			userMedia.start();
		}
		playing = true;
	}

};


//////////////////////////////////////////////////////////////////

userMedia.start = function() {
	if (navigator.getUserMedia) {

		playBtn.className = "hide";
		fileWrap.className = "hide";
		userMediaBtn.className = "hide";
		stopBtn.className = "";

		playing = true;
		userMediaFlag = true;

		userMedia.play();

	} else {
		console.log("getUserMedia not supported");
	}
}

userMedia.play = function() {
	navigator.getUserMedia (
		{ video: false, audio: true },
		function(stream) {
			localMediaStream = stream;
			input = audioContext.createMediaStreamSource(stream);
			filter = audioContext.createBiquadFilter();
			filter.frequency.value = 60.0;

			input.connect(filter);
			filter.connect(analyser);
			animationId = requestAnimationFrame(render);
		},
		function(err) {
			console.log("The following error occured: " + err);
		}
	);
}

userMedia.stop = function() {
	cancelAnimationFrame(animationId);
	// if(userAgent.indexOf('chrome') != -1) {
	// 	setTimeout(function(){
	// 		location.reload();
	// 	},400)
	// } else {
	// 	localMediaStream.stop();
	// }
	setTimeout(function(){
		location.reload();
	},600)
}
