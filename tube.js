var bgColor = "black";
var onSite = false;
var nextImgPlane = "";

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

AFRAME.registerComponent('sample-loc', {
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
          let skyLeft = el.sceneEl.querySelector('#skyLeft')
          let skyRight = el.sceneEl.querySelector('#skyRight')
          let leftstereo = el.getAttribute('leftstereo')
          let rightstereo = el.getAttribute('rightstereo')

          // change sky to stereo images 
          skyLeft.setAttribute("color", "")
          skyRight.setAttribute("color", "")
          skyLeft.setAttribute("src", leftstereo)
          skyRight.setAttribute("src", rightstereo)

          // hide all other image plane elements
          let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
          allElements.forEach(element => {
            if (element !== el) { element.setAttribute('visible', 'false') }
          })

          // show all comp-dir elements
          let allComps = el.sceneEl.querySelectorAll('[id^="comp-dir"]')
          allComps.forEach(element => { element.setAttribute('visible', 'true') })

          // update states
          onSite = true;
          nextImgPlane = el.getAttribute('nextimgplane');

        } else {
          let skyLeft = el.sceneEl.querySelector('#skyLeft')
          let skyRight = el.sceneEl.querySelector('#skyRight')

          // show all sample tubes
          let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
          allElements.forEach(element => { element.setAttribute('visible', 'true') })

          // reset the background to black
          skyLeft.setAttribute("color", "black")
          skyRight.setAttribute("color", "black")

          // hide all comp-dir elements
          let allComps = el.sceneEl.querySelectorAll('[id^="comp-dir"]')
          allComps.forEach(element => { element.setAttribute('visible', 'false') })

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

// to toggle the background to next image plane
AFRAME.registerComponent('toggle-bg', {
  sceneOnly: true,
  init: function () {
    let el = this.el;

    this.toggleBackground = (evt) => {
      console.log("Toggling background...")
      if (onSite) {
        let skyLeft = el.sceneEl.querySelector('#skyLeft')
        let skyRight = el.sceneEl.querySelector('#skyRight')

        let nextImgPlaneEl = el.sceneEl.querySelector(nextImgPlane)
        let nextLeftStereo = nextImgPlaneEl.getAttribute('leftstereo')
        let nextRightStereo = nextImgPlaneEl.getAttribute('rightstereo')

        // change sky to stereo images 
        // reset the background to black
        skyLeft.setAttribute("src", nextLeftStereo)
        skyRight.setAttribute("src", nextRightStereo)


        // make tube visible
        nextImgPlaneEl.setAttribute('visible', 'true')

        // hide all other image plane elements
        let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
        allElements.forEach(element => {
          if (element !== nextImgPlaneEl) { element.setAttribute('visible', 'false') }
        })

        // update nextImgPlane
        nextImgPlane = nextImgPlaneEl.getAttribute('nextimgplane')
      }
    }

    this.debouncedToggleBackground = debounce(this.toggleBackground.bind(this), 250);

    el.addEventListener('abuttondown', this.debouncedToggleBackground)
    el.addEventListener('xbuttondown', this.debouncedToggleBackground)
  },
  remove: function () {
    this.el.removeEventListener('abuttondown', this.debouncedToggleBackground)
    el.addEventListener('abuttondown', this.debouncedToggleBackground)
  }

})



AFRAME.registerComponent('return-to-main', {
  sceneOnly: true,
  init: function () {
    let el = this.el;
    this.returnToMain = (evt) => {
      console.log("Returning to main...")

      let skyLeft = el.querySelector('#skyLeft')
      let skyRight = el.querySelector('#skyRight')
      let allElements = el.querySelectorAll('[id^="img-plane"]')

      // show all sample tubes
      allElements.forEach(element => { element.setAttribute('visible', 'true') })

      // point camera back to the center
      let camera = el.querySelector('#rig')
      camera.setAttribute('rotation', { x: 0, y: 0, z: 0 })

      // hide all comp-dir elements
      let allComps = el.querySelectorAll('[id^="comp-dir"]')
      allComps.forEach(element => { element.setAttribute('visible', 'false') })

      // reset the background to black
      skyLeft.setAttribute("color", "black")
      skyRight.setAttribute("color", "black")


      console.log("skyleft src: ", skyLeft.getAttribute("src"))
      console.log("skyright src: ", skyRight.getAttribute("src"))
      console.log("skyleft color: ", skyLeft.getAttribute("color"))
      console.log("skyright color: ", skyRight.getAttribute("color"))


      // update onSite state
      onSite = false;

    }

    this.debouncedReturnToMain = debounce(this.returnToMain.bind(this), 250);

    el.addEventListener('bbuttondown', this.debouncedReturnToMain)
    el.addEventListener('ybuttondown', this.debouncedReturnToMain)
  },
  remove: function () {
    this.el.removeEventListener('bbuttondown', this.debouncedReturnToMain)
    this.el.removeEventListener('ybuttondown', this.debouncedReturnToMain)
  }
})

// AFRAME.registerComponent('view-compass', {
//   sceneOnly: true,
//   init: function () {
//     let comp = this.el.querySelector('#compassObj')

//     // function to toggle the visibility of the compass
//     this.changeViz = (evt) => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(() => {
//         if (onSite && !compVisible) {
//           comp.setAttribute('visible', "true");
//           compVisible = true;
//         } else {
//           comp.setAttribute('visible', "false");
//           compVisible = false;
//         }
//       }, debounceDelay);
//     }

//     // function to hide the compass
//     this.hideCompass = (evt) => {
//       comp.setAttribute('visible', "false")
//       compVisible = false;
//     }

//     this.el.addEventListener('bbuttondown', this.changeViz)
//     this.el.addEventListener('abuttondown', this.hideCompass)
//   },
//   remove: function () {
//     this.el.removeEventListener('bbuttondown', this.changeViz)
//     this.el.removeEventListener('abuttondown', this.hideCompass)
//   }
// })