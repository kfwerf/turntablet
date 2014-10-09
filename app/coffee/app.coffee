
config = 
	baseUrl: 'js'

require.config config

requirejs [ 'modules/AudioStream' ], ( AudioStream ) ->
	window.a = new AudioStream 'audio/demo.mp3'
	window.b = new AudioStream 'audio/demo.mp3'