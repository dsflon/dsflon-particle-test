var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();

var SRC = "/audio/common/music/classic.mp4";

/* web gl */
var SEPARATION = 45, AMOUNTX = 30, AMOUNTY = 30;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
/* web gl */

window.addEventListener("load", function(){
	lightUp = true;

	init();
	initAudio();
	threeStart();
});

////////////////////////////////////////////////////////////// init
var WIDTH, HEIGHT;
var playBtn, stopBtn, file, fileWrap, volumeBtn, loading, userMediaBtn;
function init() {
	WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

	playBtn = document.getElementById("playBtn");
	stopBtn = document.getElementById("stopBtn");
	userMediaBtn = document.getElementById("userMediaBtn");
	file = document.getElementById("file");
	fileWrap = document.getElementById("fileWrap");
	volumeBtn = document.getElementById("volumeBtn");
	loading = document.getElementById("loading");
}

////////////////////////////////////////////////////////////// init Audio
var audioContext,audioBuffer,noteBuffer;
var fileReader   = new FileReader;
var analyser, SMOOTHING = 0.95, FFT_SIZE = Math.pow(2,10);
var startOffset = 0, startTime = 0, gainNode;
function initAudio() {
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

////////////////////////////////////////////////////////////// three Start
function threeStart() {
	initThree();
	initCamera();

	// initObjectCube();
	// drawCube();

	// initObjectCircle();
	// drawCircle();

	// initObjectSphere();
	// drawSphere();

	initObjectPoints();
	drawPoints();

	// initObjectParticles();
	// drawParticles();
}

////////////////////////////////////////////////////////////// init Three
var container, scene, renderer ,material;
function initThree() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// レンダラー生成
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( WIDTH, HEIGHT );

	container.appendChild( renderer.domElement );
	renderer.setClearColor(0xffffff, 1.0);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xffffff, 0.001 );

}
////////////////////////////////////////////////////////////// init Camera
var camera;
function initCamera() {

	//カメラを生成
	var fov    = 75;
	var aspect = WIDTH / HEIGHT;
	var near   = 1;
	var far    = 10000;
	camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 500;
	//軸オブジェクト位置座標
	camera.position.set( 0, 500, 500 );
	//カメラ上ベクトルの設定
	camera.up.set( 0, 0, 0 );
	//カメラの中心位置ベクトルの設定
	camera.lookAt({ x:0, y:0, z:0 });
}

////////////////////////////////////////////////////////////// init Object Cube
var cube;
function initObjectCube() {

	//3Dオブジェクトの形と大きさを設定。キューブ(立方体)で1cm四方の大きさ
	var geometry = new THREE.CubeGeometry(300,300,300);
	// 3Dオブジェクトの素材と色を設定。
	if(lightUp) {
		setLight();
		material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );//directionalLightを投影可能
	} else {
		material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	}
	// ↑の設定に基づいて、3Dオブジェクトを作成
	cube = new THREE.Mesh( geometry, material );
	// 作成された3Dオブジェクトを設定したシーンに適応
	scene.add( cube );
}

////////////////////////////////////////////////////////////// init Object Circle
var circle;
function initObjectCircle() {
	var geometry = new THREE.CircleGeometry(100,100,20);
	circles = new Array();
	//
	// var i = 0;
	// for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
	// 	for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
	// 		var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
	//
	// 		// circle = new THREE.Mesh( geometry, material );
	// 		circle = circles[ i ++ ] = new THREE.Mesh( material );
	// 		circle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
	// 		circle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
	// 		scene.add( circle );
	// 	}
	// }
	if(lightUp) {
		setLight();
		material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
	} else {
		material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	}
	circle = new THREE.Mesh( geometry, material );
	scene.add( circle );
}

////////////////////////////////////////////////////////////// init Object Sphere
var sphere;
function initObjectSphere() {
	var geometry = new THREE.SphereGeometry(200,100,100);
	// if(lightUp) {
	// 	setLight();
	// 	material = new THREE.MeshPhongMaterial({
	// 		color: 0xff0000,
	// 		shading: THREE.SmoothShading,
	// 		// opacity: 0.3,
	// 		// transparent: true
	// 	});
	// } else {
	// 	material = new THREE.MeshBasicMaterial( {
	// 		color: 0xff0000,
	// 		shading: THREE.Smoothshading
	// 	} );
	// }

	// material = new THREE.PointCloudMaterial({//PointCloudMaterialは古い
	material = new THREE.PointsMaterial({
		color: 0xff0000,
		size: 3,
		// opacity: 0.3,
		// transparent: true
	});

	// material.opacity = 0.6;
	// material.transparent = true;
	// material.wireframe = true;

	// sphere = new THREE.Mesh( geometry, material );
	// sphere = new THREE.PointCloud(geometry,material);//PointCloudは古い
	sphere = new THREE.Points(geometry,material);
	scene.add( sphere );
}

////////////////////////////////////////////////////////////// init Object Points
var points;
function initObjectPoints() {

	var geometry = new THREE.Geometry();

	// geometry.vertices[0] = new THREE.Vector3(50, 0, 0);
	// geometry.vertices[1] = new THREE.Vector3(0, 50, 0);
	// geometry.vertices[2] = new THREE.Vector3(0, 0, 50);

	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			var vertex = new THREE.Vector3();
			vertex.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			vertex.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			geometry.vertices.push( vertex );
		}
	}

	//material = new THREE.ParticleBasicMaterial({ //ParticleBasicMaterialは古い
	material = new THREE.PointsMaterial({
		color: 0xff0000,
		size: 10.0
	});

	//points = new THREE.ParticleSystem( geometry, material ); //ParticleSystemは古い
	points = new THREE.Points( geometry, material );
	scene.add( points );
}

////////////////////////////////////////////////////////////// init Object Particle
var particle;
function initObjectParticles() {

	// var geometry = new THREE.Geometry();
	//
	// var i = 0;
	// for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
	// 	for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
	// 		var vertex = new THREE.Vector3();
	// 		vertex.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
	// 		vertex.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
	// 		geometry.vertices.push( vertex );
	// 	}
	// }

	material = new THREE.ParticleCanvasMaterial({//THREE.ParticleCanvasMaterial is not a function
		program: function( context ){
			context.beginPath();
			context.arc(0, 0, 20, 0, 2*Math.PI, true);
			context.closePath();
			context.fillStyle = "rgb(100, 0, 0)";
			context.fill();
		}
	});

	// particle = new THREE.Particle( geometry, material );
	particle = new THREE.Particle( material );
	scene.add( particle );
}

////////////////////////////////////////////////////////////// set Light
function setLight() {
	var directionalLight = new THREE.DirectionalLight( 0xffffff,0.9 );
	directionalLight.position.set( 0, 0.7, 0.7 );
	scene.add( directionalLight );
}

////////////////////////////////////////////////////////////// render
function drawCube() {
	requestAnimationFrame(drawCube);
	cube.position.z -= 0.1;
	cube.rotation.z += 0.01;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
}
function drawCircle() {
	requestAnimationFrame(drawCircle);
	circle.position.z -= 0.1;
	circle.rotation.z += 0.01;
	circle.rotation.y += 0.01;
	renderer.render(scene, camera);
}
function drawSphere() {
	requestAnimationFrame(drawSphere);

	var time = Date.now() * 0.00005;
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	material.color.setHSL( h, 0.6, 0.5 );

	sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.001;
    sphere.rotation.z += 0.001;
	sphere.scale.x += 0.001;
	sphere.scale.y += 0.001;
	sphere.scale.z += 0.001;
	renderer.render(scene, camera);
}
function drawPoints() {
	requestAnimationFrame(drawPoints);

	var time = Date.now() * 0.00005;
	h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	material.color.setHSL( h, 0.6, 0.5 );

	points.rotation.z += 0.005;
	points.rotation.y += 0.005;
	renderer.render(scene, camera);
}
function drawParticles() {
	// requestAnimationFrame(drawPoints);
	//
	// var time = Date.now() * 0.00005;
	// h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
	// material.color.setHSL( h, 0.6, 0.5 );
	//
	// points.rotation.z += 0.005;
	// points.rotation.y += 0.005;
	renderer.render(scene, camera);
}
