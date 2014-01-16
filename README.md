Turntablet
==========

A WebAudio / WebRTC experiment with touch

#Introduction

For a while now it has been possible to use professional audio tooling in the browser, the same type of tooling a dj has at his disposal when he has two turntables. Why not create these tools digitally. Make them available for tablets? The idea is to create a webapp that has the same kind of feeling as a real turntable, only on a tablet. Smaller size, less cost, more functional. The best would be if you could wirelessly connect multiple devices on one device. All of these devices transmit audio to the central device and that plays it. Every device can be independently used.

#How

We use WebAudio for professional tooling. The first step is to recreate a turntable, the second is a mixer. After that comes the testing to see if it is possible to push it all over WebRTC. If it can use the data of WebRTC or WebSockets we should be able to receive a audiocontext from a source or maybe even an arraybuffer of audio.

#Why

To show what is possible with the web these days.