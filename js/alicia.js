function Alicia(config) {

  this.defaultConfig = {
    cylHeight: 200,
    cylRadius: 20,
    cylThickness: 10,
    fadeDistance: 10,
    speed: .01,
    targetSpeed: 0.2,
    nextSwitch: 12, // Number of scene seconds when the next speed transition will occurr
    nextTimeInterval: 10,
    minSpeed: .7,
    maxSpeed: 1.5,
    time: 0,
    particlesPerStep: 3
  }

  var scene,
      camera,
      renderer,
      element,
      effect,
      controls,
      clock;

  if(typeof(config) == 'undefined') {
    this.config = this.defaultConfig;
  }
  else {
    this.config = config;
  }
  
  this.init = function() {
    this.initScene();
    clock = new THREE.Clock();
    this.initGenerator();
    this.animate();
  }

  this.initScene = function() {
    var a = this;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 700);
    camera.position.set(0, 3, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('webglviewer');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(
      camera.position.x + 0.01,
      camera.position.y,
      camera.position.z
    );
    controls.enablePan = true;
    controls.enableZoom = false;

    // Our preferred controls via DeviceOrientation
    function setOrientationControls(e) {
      if (!e.alpha) {
        return;
      }

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();

      element.addEventListener('click', a.fullscreen, false);

      window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);

    // Lighting
    var ambientLight = new THREE.PointLight(0x999999, 2, 0);
    ambientLight.position.set(0, 20, 0);
    scene.add(ambientLight);

    var myLight = new THREE.PointLight(0x999999, 2, 50, 2);
    myLight.position.set(0, 5, 0);
    scene.add(myLight);
  }

  this.initGenerator = function() {
    this.generator = new ParticleGenerator(scene);
    this.generator.clock = clock;
  }

  this.animate = function() {
    var a = this;

    var animate = function() {
      a.animate();
    }
    requestAnimationFrame(animate);

    a.update();
    a.render();
  }

  this.update = function() {
    if(clock && this.generator) {
      this.config.time = clock.getElapsedTime();
      
      // Is it time for changing the speed?
      if(this.config.time > this.config.nextSwitch) {
        this.config.nextSwitch += Math.random() * this.config.nextTimeInterval;
        this.config.targetSpeed = this.config.minSpeed + ((this.config.maxSpeed - this.config.minSpeed) * Math.random());
      }
      
      // Apply speed easing
      this.config.speed += (this.config.targetSpeed - this.config.speed) * .15;
      this.generator.step(this.config);
    }

    this.resize();
    camera.updateProjectionMatrix();
    controls.update();
  }

  this.resize = function() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
  }

  this.render = function() {
    effect.render(scene, camera);
  }

  this.fullscreen = function() {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  }
};

var App = new Alicia();

App.init();
