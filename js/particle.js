function Particle(config) {
  this.config = config;
  this.parent = config.parent;
  this.currentAge = 0;

  this.init = function() {
    // Create geometry and mesh
    //var geometry = new THREE.BoxGeometry(1, 1, 1);
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial();

    // Set the base color to hue 0 with 50% saturation and brightness. The hue will change as the particle ages
    material.color.setHSL(.2, .5, .5);
    this.mesh = new THREE.Mesh(geometry, material);

    // It should start at the bottom of the cyl
    this.mesh.position.y = -1 * (this.config.cylHeight / 2);

    // Assign a random position and rotate it to face the center
    // of the cylinder
    var angleRadians = Math.random() * Math.PI * 2;
    var distanceFromCenter = this.config.cylRadius - (Math.random() * this.config.cylThickness);
    // var distanceFromCenter = this.config.cylRadius;

    this.mesh.rotation.y = angleRadians;
    this.mesh.position.x = (distanceFromCenter * (Math.cos(angleRadians))) - distanceFromCenter / 2;
    this.mesh.position.z = (distanceFromCenter * (Math.sin(angleRadians))) - distanceFromCenter / 2;
    
    this.mesh.scale.x = Math.random() * 2;
    this.mesh.scale.y = Math.random() * 2;
    this.mesh.scale.z = Math.random() * 2;
  }

  this.age = function(speed) {
    this.currentAge += speed;

    // Ascend!
    this.mesh.position.y = this.currentAge - this.config.cylHeight / 2;
    
    // Rainbow effect?
    this.mesh.material.color.offsetHSL((speed/100), 0, 0);
    
    if(this.mesh.position.y > this.config.cylHeight / 2) {
      this.killMe = true;
    }
  }

  this.init();
}
