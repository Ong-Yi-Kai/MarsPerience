var rotation_speed = 0.01;
var deltaAzimuth = 0;
var onSite = false;
var nextImgPlane = "";

// logging of thumbstick input for rotations
AFRAME.registerComponent('thumbstick-rot-logging', {
  init: function () {

    this.logThumbstick = (evt) => { deltaAzimuth = evt.detail.x * 90; }
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

    // update the camera rotation
    let r = el.getAttribute('rotation');
    let newYaw = r.y - deltaAzimuth * rotation_speed;
    el.setAttribute('rotation', { x: r.x, y: newYaw, z: r.z })
  }
});

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// logic for entering a site
function enterSite(currSampleEl) {

  // change sky to stereo images
  let skyLeft = currSampleEl.sceneEl.querySelector('#skyLeft')
  let skyRight = currSampleEl.sceneEl.querySelector('#skyRight')
  skyLeft.setAttribute("color", "")
  skyRight.setAttribute("color", "")
  skyLeft.setAttribute("src", currSampleEl.getAttribute('leftstereo'))
  skyRight.setAttribute("src", currSampleEl.getAttribute('rightstereo'))

  // hide all other sample tubes
  let allTubes = currSampleEl.sceneEl.querySelectorAll('[id^="sample-tube"]')
  allTubes.forEach(element => {
    if (element !== currSampleEl) { element.setAttribute('visible', 'false') }
  })
  currSampleEl.setAttribute('visible', 'true')

  // show all comp-dir elements
  let allComps = currSampleEl.sceneEl.querySelectorAll('[id^="comp-dir"]')
  allComps.forEach(element => { element.setAttribute('visible', 'true') })

  // rotate camera to initial yaw
  // note: +ve yaw rotates counter-clockwise and -ve yaw rotates clockwise
  let camera = currSampleEl.sceneEl.querySelector('#rig')
  let initialYaw = currSampleEl.getAttribute('initYaw')
  camera.setAttribute('rotation', { x: 0, y: initialYaw, z: 0 })

}

// logic for returning to landing site
function reenterLanding(sceneEl) {
  // reset sky to black
  let skyLeft = sceneEl.querySelector('#skyLeft')
  let skyRight = sceneEl.querySelector('#skyRight')
  skyLeft.setAttribute("color", "black")
  skyRight.setAttribute("color", "black")

  // show all sample tubes
  let allTubes = sceneEl.querySelectorAll('[id^="sample-tube"]')
  allTubes.forEach(element => { element.setAttribute('visible', 'true') })

  // hide all comp-dir elements
  let allComps = sceneEl.querySelectorAll('[id^="comp-dir"]')
  allComps.forEach(element => { element.setAttribute('visible', 'false') })

  // point camera back to the center
  let camera = sceneEl.querySelector('#rig')
  camera.setAttribute('rotation', { x: 0, y: 0, z: 0 })

}



// functionality for clicks on sample tubes
AFRAME.registerComponent('sample-nav', {
  init: function () {
    let el = this.el;
    // enlarge when hovered over
    this.enlarge = (evt) => { el.setAttribute('scale', { x: 1.1, y: 1.1, z: 1.1 }) }

    // return to normal size when not hovered over
    this.returnScale = (evt) => { el.setAttribute('scale', { x: 1, y: 1, z: 1 }) }

    // function to change bg from landing page to site
    this.initBackground = (evt) => {

      if (this.el.getAttribute('visible')) {
        if (!onSite) {
          enterSite(el)

          // update states
          onSite = true;
          nextImgPlane = el.getAttribute('nextimgplane');

        } else {
          reenterLanding(el.sceneEl)

          // update states
          onSite = false;
          nextImgPlane = "";
        }
      }
    }

    el.addEventListener('mouseenter', this.enlarge)
    el.addEventListener('mouseleave', this.returnScale)
    el.addEventListener('click', this.initBackground)
  },
  remove: function () {
    this.el.removeEventListener('mouseenter', this.enlarge)
    this.el.removeEventListener('mouseleave', this.returnScale)
    this.el.removeEventListener('click', this.initBackground)
  }
});


AFRAME.registerComponent('button-nav', {
  sceneOnly: true,
  init: function () {
    let el = this.el;

    this.returnToMain = (evt) => {
      reenterLanding(el)

      // update onSite state
      onSite = false;
    }

    // switch to next image plane
    this.nextStereo = (evt) => {
      if (onSite) {
        let newSampleEl = el.sceneEl.querySelector(nextImgPlane)

        // enter next stereo site
        enterSite(newSampleEl)

        // update states
        nextImgPlane = newSampleEl.getAttribute('nextimgplane');

      }
    }

    this.debouncedReturnToMain = debounce(this.returnToMain.bind(this), 250);
    this.debouncednextStereo = debounce(this.nextStereo.bind(this), 250);

    el.addEventListener('bbuttondown', this.debouncedReturnToMain)
    el.addEventListener('ybuttondown', this.debouncedReturnToMain)
    el.addEventListener('abuttondown', this.debouncednextStereo)
    el.addEventListener('xbuttondown', this.debouncednextStereo)
  },
  remove: function () {
    this.el.removeEventListener('bbuttondown', this.debouncedReturnToMain)
    this.el.removeEventListener('ybuttondown', this.debouncedReturnToMain)
    this.el.removeEventListener('abuttondown', this.debouncednextStereo)
    this.el.removeEventListener('xbuttondown', this.debouncednextStereo)
  }
})

