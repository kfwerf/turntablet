config = 
	baseUrl: "js"
	paths: 
		jquery: "vendor/jquery"
		radio: "vendor/radio"

require.config config

requirejs ["jquery", "modules/turntable/turntable"], ( $, Turntable ) ->
	console.debug "App init"
	$(document).ready () ->

		objTurntable = new Turntable();

		window.turntable = objTurntable