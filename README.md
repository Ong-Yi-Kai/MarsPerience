# MarsPerience

This project aims to setup a virtual reality experience that show cases stereoscopic 360 images of Mars at the sample collection site. This VR environment is made using [Aframe](https://github.com/aframevr/aframe) and we used the packages [aframe-stereo-component](https://github.com/c-frame/aframe-stereo-component?tab=readme-ov-file) and [aframe-troika-text](https://github.com/lojjic/aframe-troika-text) to display the stereo and text respectively. 

## To develop with oculus quest

To set up oculus quest 2 for development, follow this [medium article](https://medium.com/@mhatrep/setup-a-frame-vr-with-oculus-quest-2-2759a39d597d). Essentially, one would need to open a terminal and run ```python -m http.server``` to start a python server, the default port that the server is on should be ```port 8000```. Then, open another terminal and check the list of connected devices by running ```adb devices```, you should see your device being listed. Note that on the first usb connection between your oculus device and your computer, oculus would prompt you to allow your computer access to the files on oculus, you should select allow here. Once you see your device, enable port forwarding by running the following command ```adb reverse tcp:8000 tcp:8000```.

Note, the developer needs to first install ADB and specify the path to ```adb.exe``` within PATH of system environment variables on a windows machine. 

To duplicate the what is seen on the ocuclus and to inspect the browser, open a google chrome browser and go to ```chrome://inspect/#devices```.

## Credits
This work is done by Christian Tate, Yi Kai Ong and Jonathan Joseph from the department of Astronomy at Cornell University. 