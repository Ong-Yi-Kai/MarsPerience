# MarsPerience

This project aims to setup a virtual reality experience that show cases stereoscopic 360 images of Mars at the sample collection site. To do so, we used AFrame and packages build on top of it to develop a WebXR experience.

## To develop with oculus quest

To set up oculus quest 2 for development, follow this [medium article](https://medium.com/@mhatrep/setup-a-frame-vr-with-oculus-quest-2-2759a39d597d). Essentially, one would need to open a terminal and run ```python -m http.server``` to start a python server, the default port that the server is on should be ```port 8000```. Then, open another terminal and check the list of connected devices by running ```adb devices```, you should see your device being listed. Note that on the first usb connection between your oculus device and your computer, oculus would prompt you to allow your computer access to the files on oculus, you should select allow here. Once you see your device, enable port forwarding by running the following command ```adb reverse tcp:8000 tcp:8000```.

Note, the developer needs to first install ADB and specify the path to ```adb.exe``` within PATH of system environment variables on a windows machine. 

To duplicate the what is seen on the ocuclus and to inspect the browser, open a google chrome browser and go to ```chrome://inspect/#devices```.


## Inspecting 3D models

For developers and designers who want to inpsect their 3D models before placing into the scene, here is a cool AFrame site developed by Don Mccurdy go to this [site](https://gltf-viewer.donmccurdy.com/), or if you prefer to host it locally, here is the [repo](https://github.com/donmccurdy/three-gltf-viewer).