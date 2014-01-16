define [ "require", "jquery", "radio" ], ( require, $, radio ) ->
	class TurntableView
		constructor: ( @_controllerTurntable ) ->

			_eventPrefix = @_controllerTurntable._eventPrefix
			@elTurntable = $(@_controllerTurntable._turntableClass)

			@elRpmButtons = @elTurntable.find( "[data-rpm='33'], [data-rpm='45']" )
			@elRpm33 = @elTurntable.find( "[data-rpm='33']" )
			@elRpm45 = @elTurntable.find( "[data-rpm='45']" )
			@elPitchHandle = @elTurntable.find( "[data-pitch]" )
			@elPowerButton = @elTurntable.find( "[data-power]" )
			@elStartStop = @elTurntable.find( "[data-startstop]" )
			@elPlatter = @elTurntable.find( "[data-spinning]" )
			
		# ---
		# Event bindings and tiggering
		# ---
			@elPowerButton.on "click", (e) ->
				boolPowered = if $(this).attr("data-power") is "true" then false else true
				radio("#{_eventPrefix}.POWER_CHANGE").broadcast boolPowered

			@elStartStop.on "click", (e) ->
				boolStarted = if $(this).attr("data-startstop") is "true" then false else true
				radio("#{_eventPrefix}.START_CHANGE").broadcast boolStarted

			@elPitchHandle.on "click", (e) ->
				numPitchRange = ($(this).val() / 100) * $(this).attr("data-pitchrange")
				radio("#{_eventPrefix}.PITCH_CHANGE").broadcast numPitchRange

	# ---
	# Power
	# ---
		setPower: ( boolPowered ) ->
			if @elPowerButton.attr("data-power") isnt boolPowered
				@elPowerButton.attr "data-power", boolPowered

	# ---
	# Start
	# ---
		setStart: ( boolStarted ) ->
			if @elStartStop.attr("data-startstop") isnt boolStarted
				@elStartStop.attr "data-startstop", boolStarted

	# ---
	# Pitch
	# ---
		setPitch: ( numPitch ) ->
			console.log @elPitchHandle.attr("data-pitch"), numPitch
			if @elPitchHandle.attr("data-pitch") isnt numPitch
				@elPitchHandle.attr("data-pitch", numPitch)
				numReversePitchRange = (numPitch / @elPitchHandle.attr("data-pitchrange")) * 100

	# ---
	# Speed
	# ---		
		setSpeed: ( numSpeed ) ->
			strAnimationCss = "-webkit-animation: rotating #{numSpeed}ms linear infinite;-moz-animation: rotating #{numSpeed}ms linear infinite;-ms-animation: rotating #{numSpeed}ms linear infinite;-webkit-animation: rotating #{numSpeed}ms linear infinite;-moz-animation: rotating #{numSpeed}ms linear infinite;-o-animation: rotating #{numSpeed}ms linear infinite;animation: rotating #{numSpeed}ms linear infinite;"

			@elPlatter.attr "data-spinning", true
			@elPlatter.attr "data-rpm", numSpeed

			@elPlatter.attr "style", strAnimationCss
