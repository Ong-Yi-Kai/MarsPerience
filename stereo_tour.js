var rotation_speed = 0.01;
var deltaAzimuth = 0;

var curr_scene_idx = 0;
var num_scenes;
var scene_info = null;

document.addEventListener("DOMContentLoaded", function () {
  scene_info = fetch("./stereo_info.json")
    .then((response) => response.json())
    .then((data) => {
      data.reverse();
      scene_info = data;
      num_scenes = data.length;
      load_assets(data);
      enter_scene();
    });
});

function load_assets(data) {
  let assetsEl = document.querySelector("a-assets");
  console.log(assetsEl);

  for (let i = 0; i < data.length; i++) {
    let stereo = data[i];
    let stereoLeft = document.createElement("img");
    stereoLeft.setAttribute("id", "stereo-" + i + "-left");
    stereoLeft.setAttribute("src", stereo["left_stereo_src"]);
    stereoLeft.setAttribute("crossorigin", "anonymous");
    assetsEl.appendChild(stereoLeft);

    let stereoRight = document.createElement("img");
    stereoRight.setAttribute("id", "stereo-" + i + "-right");
    stereoRight.setAttribute("src", stereo["right_stereo_src"]);
    stereoRight.setAttribute("crossorigin", "anonymous");
    assetsEl.appendChild(stereoRight);
  }
}

function enter_scene() {
  let leftStereoEl = document.getElementById("stereo-left");
  let rightStereoEl = document.getElementById("stereo-right");

  leftStereoEl.setAttribute("color", "");
  rightStereoEl.setAttribute("color", "");
  leftStereoEl.setAttribute("src", `#stereo-${curr_scene_idx}-left`);
  rightStereoEl.setAttribute("src", `#stereo-${curr_scene_idx}-right`);

  let rigEl = document.getElementById('rig');
  rigEl.setAttribute('rotation', { x: 0, y: scene_info[curr_scene_idx]["start_rotation"] + 90, z: 0 });

  let siteNameEl = document.getElementById("site-name");
  siteNameEl.setAttribute("value", scene_info[curr_scene_idx]["site_name"]);

  let siteNameContEl = document.getElementById('site-name-cont');
  siteNameContEl.setAttribute('rotation', { x: 0, y: scene_info[curr_scene_idx]["start_rotation"] + 90, z: 0 });

  let compassEl = document.getElementById("compass");
  compassEl.setAttribute("rotation", {
    x: 0,
    y: scene_info[curr_scene_idx]["compass_rotation"] + 90,
    z: 0,
  });
}

AFRAME.registerComponent("thumbstick-rot-logging", {
  init: function () {
    this.logThumbstick = (evt) => {
      deltaAzimuth = evt.detail.x * 90;
    };
    this.el.addEventListener("thumbstickmoved", this.logThumbstick);
  },

  remove: function () {
    this.el.removeEventListener("thumbstickmoved", this.logThumbstick);
  },
});

AFRAME.registerComponent("thumbstick-controlled-motion", {
  tick: function () {
    let el = this.el;

    // update the camera rotation
    let r = el.getAttribute("rotation");
    let newYaw = r.y - deltaAzimuth * rotation_speed;
    el.setAttribute("rotation", { x: r.x, y: newYaw, z: r.z });
  },
});

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

function reset_site() {
  let skyLeftEl = document.querySelector('#stereo-left');
  let skyRightEl = document.querySelector('#stereo-right');

  skyLeftEl.setAttribute("color", "black");
  skyRightEl.setAttribute("color", "black");
}

AFRAME.registerComponent("button-nav", {
  sceneOnly: true,
  init: function () {
    let el = this.el;

    // switch to next image plane
    this.nextStereo = (evt) => {
      reset_site();
      curr_scene_idx = (curr_scene_idx + 1) % num_scenes;
      setTimeout(enter_scene, 5);
    };

    // switch to prev image plane
    this.prevStereo = (evt) => {
      reset_site();
      curr_scene_idx = (curr_scene_idx + num_scenes - 1) % num_scenes;
      setTimeout(enter_scene, 5);
    };

    this.debouncedNextStereo = debounce(this.nextStereo.bind(this), 250);
    this.debouncedPrevStereo = debounce(this.prevStereo.bind(this), 250);

    el.addEventListener("abuttondown", this.debouncedNextStereo);
    // el.addEventListener("triggerdown", this.debouncedNextStereo);

    el.addEventListener("xbuttondown", this.debouncedPrevStereo);
    // el.addEventListener("gripdown", this.debouncedPrevStereo);
  },
  remove: function () {
    this.el.addEventListener("abuttondown", this.debouncedNextStereo);
    // this.el.addEventListener("triggerdown", this.debouncedNextStereo);

    this.el.addEventListener("xbuttondown", this.debouncedPrevStereo);
    // this.el.addEventListener("gripdown", this.debouncedPrevStereo);
  },
});