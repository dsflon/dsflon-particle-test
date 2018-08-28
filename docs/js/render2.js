var SEPARATION = 50, AMOUNTX = 30, AMOUNTY = 30;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var WIDTH, HEIGHT;

window.addEventListener("load", function(){
	threeStart();
});

function threeStart() {
	initThree();
	initCamera();

	initObject();
	render();
}

////////////////////////////////////////////////////////////// init Three
var container, scene, renderer;
var mouseX = 0, mouseY = 0;

function initThree() {

	WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xffffff, 1);
	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	// document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

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
	camera.position.set( 0, 0, 500 );
	//カメラ上ベクトルの設定
	camera.up.set( 0, 0, 0 );
	//カメラの中心位置ベクトルの設定
	camera.lookAt({ x:0, y:0, z:0 });

}

////////////////////////////////////////////////////////////// init Object
var particles, particle;
function initObject() {

	particles = new Array();
	var PI2 = Math.PI * 2;

	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

			var material = new THREE.SpriteCanvasMaterial( {

				color: 0xe94e2b,
				program: function ( context ) {
					context.beginPath();
					context.arc( 0, 0, 0.3, 0, PI2, true );
					context.fill();
				}

			} );
			particle = particles[ i ++ ] = new THREE.Sprite( material );
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			scene.add( particle );

		}

	}

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

// function onDocumentTouchStart( event ) {
//
// 	if ( event.touches.length > 1 ) {
//
// 		event.preventDefault();
//
// 		mouseX = event.touches[ 0 ].pageX - windowHalfX;
// 		mouseY = event.touches[ 0 ].pageY - windowHalfY;
// 	}
// }
//
// function onDocumentTouchMove( event ) {
//
// 	if ( event.touches.length == 1 ) {
//
// 		event.preventDefault();
//
// 		mouseX = event.touches[ 0 ].pageX - windowHalfX;
// 		mouseY = event.touches[ 0 ].pageY - windowHalfY;
// 	}
//
// }


function render() {

	var freqDomain = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(freqDomain);

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( 100 - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );

	if(!fraction){fraction = 0.1;}
	if(fraction<0.2) {
		var posFix = 0.1;
	} else {
		var posFix = fraction;
	}

	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			var val = freqDomain[i];
			particle = particles[ i++ ];
			particle.position.y = (val*(posFix*2))+1;
			particle.scale.x = (val/15)+3+(posFix*10);
			particle.scale.y = (val/15)+3+(posFix*10);
		}

	}

	renderer.render( scene, camera );
	animationId = requestAnimationFrame(render);

}
