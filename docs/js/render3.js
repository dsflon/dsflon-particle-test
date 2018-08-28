// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container;
	var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
	var materials = [];
	var mouseX = 0, mouseY = 0;

	var SEPARATION = 45, AMOUNTX = 10, AMOUNTY = 10;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	init();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
		camera.position.z = 500;

		scene = new THREE.Scene();
		// scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

		geometry = new THREE.Geometry();


		var i = 0;
		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
				var vertex = new THREE.Vector3();
				vertex.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
				vertex.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
				geometry.vertices.push( vertex );

				materials[i] = new THREE.PointsMaterial( {
					size: 10,
					sizeAttenuation: true,
					alphaTest: 0.5,
					transparent: false
				} );
				particles = new THREE.Points( geometry, materials[i] );
				scene.add( particles );

				i++;
			}

		}

		// material = new THREE.PointsMaterial( {
		// 	size: 10,
		// 	sizeAttenuation: true,
		// 	alphaTest: 0.5,
		// 	transparent: false
		// } );
		// material.color.setHSL( 1.0,0.3, 0.7 );

		// particles = new THREE.Points( geometry, material );
		// scene.add( particles );

		renderer = new THREE.WebGLRenderer();
		// renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		renderer.setClearColor(0xffffff, 1.0);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );

		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove( event ) {

		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;

	}

	function onDocumentTouchStart( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;

		}
	}

	function onDocumentTouchMove( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;

		}

	}


	function render() {
		var freqDomain = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqDomain);

		var time = Date.now() * 0.00005;

		camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

		camera.lookAt( scene.position );

		// h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
		// material.color.setHSL( h, 0.5, 0.5 );

		// var i = 0;
		// for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		// 	for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
		// 		var val = freqDomain[i];
		// 		material = materials[i];
		// 		// particle = particles[ i++ ];
		// 		// material.position.y = (val)+1;
		// 		// material.scale.x = (val/10)+1;
		// 		// material.scale.y = (val/10)+1;
		// 		material.color.setHSL( val/255, 0.5, 0.5 );
		//
		// 	}
		//
		// }
		for ( i = 0; i < materials.length; i ++ ) {
			var val = freqDomain[i];
			materials[i].color.setHSL( val/255, 0.5, 0.5 );
		}

		renderer.render( scene, camera );
		animationId = requestAnimationFrame(render);


	}
