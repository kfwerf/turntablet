# Author: Kenneth van der Werf
# Description: Controller for Turntable module

define [ "require", "jquery", "radio", "modules/turntable/turntablemodel", "modules/turntable/turntableview" ], ( require, $, radio, TurntableModel, TurntableView ) ->
	class Turntable
		constructor: ( @_turntableClass = ".turntable", @_eventPrefix = "TURNTABLE" ) ->

			_audioContext = window.AudioContext || window.webkitAudioContext
			@_audioCore = new _audioContext() #Should become a shared resource we can post to

			numRandomPrefix = do (numLength = "99999") ->
				Math.random() * (numLength - 0 + 1) + 0

			@_eventPrefix = "#{@_eventPrefix}.#{numRandomPrefix}"
		
			radio("#{@_eventPrefix}.START_CHANGE").subscribe [@onStartChange, this]
			radio("#{@_eventPrefix}.POWER_CHANGE").subscribe [@onPowerChange, this]
			radio("#{@_eventPrefix}.PITCH_CHANGE").subscribe [@onPitchChange, this]
			radio("#{@_eventPrefix}.SPEED_CHANGE").subscribe [@onSpeedChange, this]

			@_modelTurntable = new TurntableModel( this )
			@_viewTurntable = new TurntableView( this )

	# ---
	# Power
	# ---
		onPowerChange: (boolPowered) ->
			@setPower boolPowered
		setPower: (boolPowered) ->
			@_modelTurntable.setPower boolPowered
			@_viewTurntable.setPower @_modelTurntable.getPower()

	# ---
	# Start
	# ---	
		onStartChange: (boolStarted) ->
			@setStart boolStarted
		setStart: (boolStarted) ->
			@_modelTurntable.setStart boolStarted
			@_viewTurntable.setStart @_modelTurntable.getStart()

	# ---
	# Pitch
	# ---
		onPitchChange: (numPitch) ->
			@setPitch numPitch
		setPitch: (numPitch) ->
			@_modelTurntable.setPitch numPitch
			@_viewTurntable.setPitch @_modelTurntable.getPitch()

	# ---
	# Speed
	# ---
		onSpeedChange: (numSpeed) ->
			console.log "Setting speed"
			@_viewTurntable.setSpeed numSpeed 

	# ---
	# Started
	# ---
		setStarted: ( boolStarted ) ->
			objSettings = @getSettings()
			if objSettings.powered
				objSettings.started = boolStarted

	# ---
	# Low Pass
	# ---
		setLowPass: () ->
			@_modelTurntable.
			
