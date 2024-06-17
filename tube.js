var bgColor = "black";
var onSite = false;
var compVisible = false;
let debounceTimer;
const debounceDelay = 50;

AFRAME.registerComponent('pane-hover', {

  schema: {
    leftStereo: { type: 'string', default: '' },
    rightStereo: { type: 'string', default: '' }
  },

  init: function () {
    let el = this.el;
    // enlarge when hovered over
    this.enlarge = (evt) => { el.setAttribute('scale', { x: 1.1, y: 1.1, z: 1.1 }) }

    // return to normal size when not hovered over
    this.returnScale = (evt) => { el.setAttribute('scale', { x: 1, y: 1, z: 1 }) }

    this.changeBackground = (evt) => {

      if (this.el.getAttribute('visible')) {
        if (!onSite) {
          let skyLeft = el.sceneEl.querySelector('#skyLeft')
          let skyRight = el.sceneEl.querySelector('#skyRight')

          // change sky to stereo images 
          skyLeft.setAttribute("color", "")
          skyRight.setAttribute("color", "")
          skyLeft.setAttribute("src", this.data.leftStereo)
          skyRight.setAttribute("src", this.data.rightStereo)

          // hide all other image plane elements
          let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
          allElements.forEach(element => {
            if (element !== el) { element.setAttribute('visible', 'false') }
          })

          onSite = true;
        } else {
          let skyLeft = el.sceneEl.querySelector('#skyLeft')
          let skyRight = el.sceneEl.querySelector('#skyRight')

          // show all sample tubes
          let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
          allElements.forEach(element => { element.setAttribute('visible', 'true') })

          // reset the background to black
          skyLeft.setAttribute("src", "")
          skyRight.setAttribute("src", "")
          skyLeft.setAttribute("color", "black")
          skyRight.setAttribute("color", "black")

          onSite = false;
        }

      }
    }

    el.addEventListener('mouseenter', this.enlarge)
    el.addEventListener('mouseleave', this.returnScale)
    el.addEventListener('click', this.changeBackground)
  },
  remove: function () {
    this.el.removeEventListener('mouseenter', this.enlarge)
    this.el.removeEventListener('mouseleave', this.returnScale)
    this.el.removeEventListener('click', this.changeBackground)
  }
});


AFRAME.registerComponent('return-to-main', {
  sceneOnly: true,
  init: function () {
    let el = this.el;
    this.returnToMain = (evt) => {
      let skyLeft = el.querySelector('#skyLeft')
      let skyRight = el.querySelector('#skyRight')
      let allElements = el.querySelectorAll('[id^="img-plane"]')

      // show all sample tubes
      allElements.forEach(element => { element.setAttribute('visible', 'true') })

      // reset the background to black
      skyLeft.setAttribute("src", "")
      skyRight.setAttribute("src", "")
      skyLeft.setAttribute("color", "black")
      skyRight.setAttribute("color", "black")

      // point camera back to the center
      let camera = el.querySelector('#rig')
      camera.setAttribute('rotation', { x: 0, y: 0, z: 0 })

      onSite = false;

    }
    el.addEventListener('abuttondown', this.returnToMain)
  },
  remove: function () {
    this.el.removeEventListener('abuttondown', this.returnToMain)
  }
})

AFRAME.registerComponent('view-compass', {
  sceneOnly: true,
  init: function () {

    let rig = this.el.querySelector('#rig')
    let comp = this.el.querySelector('#compassObj')

    this.changeViz = (evt) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log("In change viz:" + comp.getAttribute('visible') + "onSite:" + onSite);
        if (onSite && !compVisible) {
          comp.setAttribute('visible', "true");
          compVisible = true;
        } else {
          comp.setAttribute('visible', "false");
          compVisible = false;
        }
      }, debounceDelay);
    }

    this.hideCompass = (evt) => {
      console.log("Hide compass: " + comp.getAttribute('visible'))
      comp.setAttribute('visible', "false")
      compVisible = false;
    }

    this.el.addEventListener('bbuttondown', this.changeViz)
    this.el.addEventListener('abuttondown', this.hideCompass)
  },
  remove: function () {
    this.el.removeEventListener('bbuttondown', this.changeViz)
    this.el.removeEventListener('abuttondown', this.hideCompass)
  }
})