var bgColor = "black";

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
        let skyLeft = el.sceneEl.querySelector('#skyLeft')
        let skyRight = el.sceneEl.querySelector('#skyRight')

        // change sky to stereo images 
        skyLeft.setAttribute("color", "")
        skyRight.setAttribute("color", "")
        skyLeft.setAttribute("src", this.data.leftStereo)
        skyRight.setAttribute("src", this.data.rightStereo)

        // hide all other image plane elements
        let allElements = el.sceneEl.querySelectorAll('[id^="img-plane"]')
        allElements.forEach(element => { element.setAttribute('visible', 'false') })
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
    }
    el.addEventListener('abuttondown', this.returnToMain)
    el.addEventListener('bbuttondown', this.returnToMain)
  },
  remove: function () {
    this.el.removeEventListener('abuttondown', this.returnToMain)
    this.el.removeEventListener('bsbuttondown', this.returnToMain)
  }
})