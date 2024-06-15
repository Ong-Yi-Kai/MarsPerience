var follow_delay = 0.9;
var translation_speed = 0.1;
var rotation_speed = 0.005;
var deltaPForward = 0.0;
var deltaPRight = 0.0;
var deltaElevation = 0;
var deltaAzimuth = 0;
var zoom = 1;

// logging of thumbstick input for translations
AFRAME.registerComponent('thumbstick-speed-logging', {
  init: function () {
    this.logThumbstick = function (evt) {
      deltaPForward = evt.detail.y;
      deltaPRight = evt.detail.x;
    }
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },

  remove: function () {
    this.el.removeEventListener('thumbstickmoved', this.logThumbstick);
  }
});

// logging of thumbstick input for rotations
AFRAME.registerComponent('thumbstick-rot-logging', {
  init: function () {

    this.logThumbstick = function (evt) {
      deltaAzimuth = evt.detail.x * 90;
      deltaElevation = evt.detail.y * 90;

      console.log("deltaAzimuth: " + deltaAzimuth + ", deltaElevation: " + deltaElevation);
    }
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },

  remove: function () {
    this.el.removeEventListener('thumbstickmoved', this.logThumbstick);
  }
});

// logging of thumbstick input for zoom
AFRAME.registerComponent('thumbstick-zoom-logging', {
  init: function () {
    this.logThumbstick = function (evt) { zoom = zoom + evt.detail.y * 0.1; }
    this.el.addEventListener('thumbstickmoved', this.logThumbstick);
  },

  remove: function () {
    this.el.removeEventListener('thumbstickmoved', this.logThumbstick);
  }
});

// how to move the camera given thumbstick input
AFRAME.registerComponent('thumbstick-controlled-motion', {
  tick: function () {
    let el = this.el;
    let pos = el.getAttribute('position');
    let r = el.getAttribute('rotation');
    let yaw = r.y * Math.PI / 180;

    // update the camera position
    let newX = pos.x + (Math.cos(yaw) * deltaPRight + Math.sin(yaw) * deltaPForward) * translation_speed;
    let newZ = pos.z + (-Math.sin(yaw) * deltaPRight + Math.cos(yaw) * deltaPForward) * translation_speed;
    el.setAttribute('position', { x: newX, y: pos.y, z: newZ })

    // update the camera rotation
    // let newPitch = Math.max(Math.min(r.x - deltaElevation * rotation_speed, 90), -90);
    let newYaw = r.y - deltaAzimuth * rotation_speed;
    el.setAttribute('rotation', { x: r.x, y: newYaw, z: r.z })
  }
});

// Determines how ROVER follows the camera 
AFRAME.registerComponent('camera-follower', {
  tick: function () {
    let rig = document.querySelector('#rig');
    let rigPos = rig.getAttribute('position');

    let pos = this.el.getAttribute('position');

    // animate the element to move to the camera position
    let targetX = rigPos.x;
    let targetZ = rigPos.z;

    let diffX = targetX - pos.x;
    let diffZ = targetZ - pos.z;

    this.el.setAttribute('position', {
      x: pos.x + diffX * (1 - follow_delay),
      y: pos.y,
      z: pos.z + diffZ * (1 - follow_delay)
    })
  }
});

AFRAME.registerComponent('click-scale', {
  init: function () {

    this.clickScale = function (evt) {
      let scale = this.getAttribute('scale');
      let newScale = scale.x * 1.1;
      this.setAttribute('scale', {
        x: newScale,
        y: newScale,
        z: newScale
      })
    }
    this.el.addEventListener('click', this.clickScale);
  },
  remove: function () {
    this.el.removeEventListener('click', this.clickScale);
  }
});