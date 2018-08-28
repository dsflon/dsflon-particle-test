function render(){
	var freqDomain = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqDomain);

	var timeDomain = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteTimeDomainData(timeDomain);

	var alpha = fraction+0.1;

	canvasContext.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < analyser.frequencyBinCount; i++) {
		var value = timeDomain[i];
		var percent = value / 256;
		var height = HEIGHT * percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH/analyser.frequencyBinCount;
		var hue = i / analyser.frequencyBinCount * 360;

		var pie = value;

		canvasContext.globalAlpha = alpha;
		canvasContext.fillStyle = 'hsl(' + hue + ', 50%, 50%)';
		canvasContext.beginPath();
		// canvasContext.fillRect(i * barWidth, offset, 2, 2)
		canvasContext.arc(i * barWidth, (offset), value/100, 0, Math.PI*2, false);
		canvasContext.fill();
	}

	for(var i=0; i<analyser.frequencyBinCount; i++){

		var value = freqDomain[i];
		var percent = value / 256;
		var height = HEIGHT * percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH / analyser.frequencyBinCount;
		var hue = i / analyser.frequencyBinCount * 360;
		var hue2 = offset / HEIGHT * 360;

		canvasContext.fillStyle = 'hsl(' + hue2 + ', 70%, 50%)';
		// canvasContext.strokeStyle = 'hsl(' + hue + ', 0%, 10%)';

		canvasContext.beginPath();

		if(fraction <= 0.1){
			var pie = value/6;
		} else {
			var pie = value/6+(fraction*40);
		}

		canvasContext.arc(i * barWidth*4, offset, pie, 0, Math.PI*2, false);

		if ( (i > 0) && (i % 1 == 0)){
			canvasContext.fill();
		}
	}
	animationId = requestAnimationFrame(render);
};
