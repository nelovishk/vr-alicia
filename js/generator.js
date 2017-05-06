function ParticleGenerator(scene) {
  var scene = scene;
  var particles = [];
  var cyl = new THREE.Object3D();

  scene.add(cyl);

  this.step = function(config) {
    clean();
    ageParticles(config.speed);
    create(config);
  }

  // Step alive particles forward in their timeline
  // The timeline of a particle goes from 0 to 100, they always die at 100
  // It's their business what they do with their age... we just tell them
  // how fast they are aging
  function ageParticles(speed) {
    particles.forEach(function(p, i) {
      p.age(speed);
    });
  }

  function create(config) {
    config.parent = cyl;
    // Create some new random particles
    for(var i=0; i < config.particlesPerStep; i++) {
      var p = new Particle(config);
      particles.push(p);
      cyl.add(p.mesh);
    }
  }
  
  function clean() {
    // Particles ask for euthanasia by setting their killMe property to 1
    particles.forEach(function(p, i) {
      if(p.killMe) {
        p.mesh.parent.remove(p.mesh);
        particles.splice(i, 1);
      }
    });
  }
}
