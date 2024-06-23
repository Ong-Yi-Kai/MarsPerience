var follow_delay = 0.9;
var translation_speed = 0.1;
var rotation_speed = 0.01;
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
    }
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
    let newYaw = r.y - deltaAzimuth * rotation_speed;
    el.setAttribute('rotation', { x: r.x, y: newYaw, z: r.z })
  }
});

AFRAME.registerComponent('thumbstick-controlled-compass', {
  tick: function () {
    let compass = this.el;
    let rig = this.el.sceneEl.querySelector('#rig');
    let rigRot = rig.getAttribute('rotation');


    let children = compass.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let cr = child.getAttribute('rotation');
      // let newCRoll = cr.z - deltaAzimuth * rotation_speed;
      child.setAttribute('rotation', { x: cr.x, y: cr.y, z: rigRot.y })
    }
  }
});