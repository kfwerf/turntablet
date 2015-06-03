# Turntablet

## What is this?
A project aimed to bring a full DJ studio to the web via WebAudio. The idea is to make a skeuomorphic design of a modular implementation of web audio to power digital turntables. It is meant as a showcase of what the web can do. The idea is to use edge technologies and use this project as an experiment to see how the future of the web feels like.

## How can i use it?
Clone this project and start by checking out the /app folder. In here there is a basic setup. Currently the project is far from ready as bridging of GUI and model is not near completion yet. The model part is mostly finished and can be used to create your own ui if needed.

If you want to continue development, make sure you do a 'npm install' on the primary directory so it installs dependencies for gulp. After that you can do 'gulp' to have it build es6 to es5 via babeljs and browserify.

The api is still undocumented. The easiest way to check it out is to either read the class or check the properties by binding it to the 'window'.

## Coffeescript and ES6
The original, older project was based on coffeescript and was much less easy to handle. The new API has a simpler interface by using mostly 'magic' setters and getters and using the ES6 exports and classes to create an easier to use api for the AudioMixer. The core will be AudioMixer. On top of that a GUI implementation can be made or the AudioMixer can be extended.

## Project structure
/app contains all the files for developing and building the project. This needs some cleanup.
/design contains the Photoshop design for the turntable that is handcrafted, based on images.

## Features
* ES6 via BabelJS implementation
* Clean refined GUI for turntable
* AudioMixer as a model, viewcontrollers as bridge to the GUI
* Polymer as choice for web components

## Milestones
The idea is to extend and make the project better and better. However before the project needed to be to big, so instead i want to keep the milestones small and not too far ahead. With that in mind i can only give the initial release milestone

### v1.0
* Allow to select a track from your machine
* Be able to play the file
* Be able to cue
* Be able to do filtering, lo, mid, hi, gain, volume
* Do pitch control on the audio
* Turntable platter should represent current audio track and play state
* Crossfader functionality

### v1.**
* WebRTC support that allows to simulate channels on different devices (e.g. ipad can be a turntable)
* Allow touch control over the platter
* Simulated scratching over the platter
* Spectrum analyzer
* Beatmatching pattern
* Karoake mode (phase cancellation)
* Automate mixes and record and store handling of a mix, for later playback
* Headphone output can be routed to another machine or channel
