define [ "jquery", "radio"], ( $, radio ) ->
	class AudioModel
		constructor: () ->

			_audioContext = window.AudioContext || window.webkitAudioContext
			@_audioCore = new _audioContext()
			
			@_audioBuffer = null
			@_boolLoaded = false
 			
 			# Standard
			@numPitch = 0
			@numSpeed = 0
			@boolPowered = false
			@boolStarted = false
			@boolPaused = false

			# Advanced
			@numLowCut = 0
			@numMidCut = 0
			@numHighCut = 0

	# ---
	# Initialize 
	# ---
		init: () ->
			@_audioFile = "audio/song2.mp3"
			@_audioSrc = @_audioCore.createBufferSource()
			@_audioLowFilter = @_audioCore.createBiquadFilter()
			@_audioMidFilter = @_audioCore.createBiquadFilter()
			@_audioHighFilter = @_audioCore.createBiquadFilter()
			@_audioVolume = @_audioCore.createGainNode()

			radio("#{@_eventPrefix}.AUDIO_REQUEST").subscribe [@_onAudioRequest, this]
			radio("#{@_eventPrefix}.AUDIO_UPDATED").subscribe [@_onAudioUpdated, this]
			radio("#{@_eventPrefix}.AUDIO_LOADED").subscribe [@_onAudioLoaded, this]

			@setAudio @_audioFile

	# ---
	# Loading audio
	# ---
		_onAudioRequest: ( strAudio ) ->
			$this = @
			@_audioXhr = new XMLHttpRequest()
			@_audioXhr.open "GET", strAudio, true
			@_audioXhr.responseType = "arraybuffer"

			onComplete = ( audioBuffer ) ->
				$this._audioBuffer = audioBuffer
				$this._setAudioNodeBuffer()

				$this._isLoaded = true;

				radio("#{$this._eventPrefix}.AUDIO_LOADED").broadcast()
			onError = ( strError ) ->
				console.log "Error processing file: , #{$this._audioFile},  -> cause: #{strError}"

			@_audioXhr.onload = () ->
				$this._audioCore.decodeAudioData $this._audioXhr.response, onComplete, onError

			@_audioXhr.send()
	
		_onAudioLoaded: () ->
			if @boolStarted then @playAudio()
			true

		_setAudioNodeBuffer: () ->
			if @_audioCore and @_audioBuffer
				
				@_audioSrc = @_audioCore.createBufferSource()
				@_audioSrc.buffer = @_audioBuffer

				@_audioVolume = @_audioCore.createGain()

				# One manufacturer may choose a low-shelving corner frequency of 50 Hz, while another may choose 250 Hz, and the highs could start anywhere from 2 KHz to 20 KHz- it's all in the hands of the designer. Again, read the manual for your specific unit, or contact the manufacturer for their specs. Low-mids may generally be around 250-500 Hz, mid-mids around 500-1000 Hz, and high-mids around 1-2 KHz (for the US readers, 'K' stands for an increment of 1,000).
				#male 85 to 180 Hz, and that of a typical adult female from 165 to 255 -> 85 255
				
				@_audioLowFilter = @_audioCore.createBiquadFilter()
				@_audioLowFilter.type = 'lowshelf'
				@_audioLowFilter.frequency.value = 500
				@_audioLowFilter.gain.value = @numLowCut

				@_audioMidFilter = @_audioCore.createBiquadFilter()
				@_audioMidFilter.type = 'peaking'
				@_audioMidFilter.frequency.value = 750
				@_audioMidFilter.gain.value =  @numMidCut

				@_audioHighFilter = @_audioCore.createBiquadFilter()
				@_audioHighFilter.type = 'highshelf'
				@_audioHighFilter.frequency.value = 1000
				@_audioHighFilter.gain.value = @numHighCut

				console.log @_audioMidFilter

				# input.connect output, src -> volume, volume -> low
				@_audioSrc.connect @_audioVolume
				@_audioVolume.connect @_audioLowFilter
				@_audioLowFilter.connect @_audioMidFilter
				@_audioMidFilter.connect @_audioHighFilter
				# @_audioHighFilter.connect @_audioCore.destination

				@_audioHighFilter.connect @voiceCancellation.audioProcessor
				@voiceCancellation.audioProcessor.connect @_audioCore.destination
				

	# ---
	# Setting and getting of the audio
	# ---	
		setAudio: ( strAudio ) ->
			@_audioFile = strAudio
			@_isLoaded = false;
			radio("#{@_eventPrefix}.AUDIO_REQUEST").broadcast strAudio
			true
		getAudio: () ->
			@_audioSrc
		getAudioStatus: () ->
			if @getAudio().buffer then true else false

	# ---
	# Manipulating audio
	# ---		
		playAudio: ( numPlayhead ) ->
			@_audioSrc.start numPlayhead
		
		stopAudio: ( numPlayhead ) ->
			@_audioSrc.stop numPlayhead
			@_setAudioNodeBuffer() # Reset

		setAudioPitch: ( numPitch ) ->
			@_audioSrc.playbackRate.value = (100 + Number(numPitch))/100
			console.log @_audioSrc.playbackRate.value
		setAudioFilter: () ->
			# @_audioSrc

	# ---
	# Power
	# ---	
		setPower: ( boolPowered ) ->
			if @boolPowered isnt boolPowered
				@boolPowered = boolPowered
				@setSpeed()
				if not @boolPowered
					@setStart false
				radio("#{@_eventPrefix}.POWER_CHANGE").broadcast boolPowered
		getPower: () ->
			@boolPowered

	# ---
	# Start
	# ---
		setStart: ( boolStarted ) ->
			boolStarted = if boolStarted and not @boolPowered then false else boolStarted
			
			if @boolStarted isnt boolStarted
				@boolStarted = boolStarted
				if @boolStarted then @playAudio() else @stopAudio()
				radio("#{@_eventPrefix}.START_CHANGE").broadcast boolStarted
		getStart: () ->
			@boolStarted

	# ---
	# Pitch
	# ---
		setPitch: ( numPitch ) ->
			if @numPitch isnt numPitch
				@numPitch = numPitch
				if @numPitch then @setAudioPitch @numPitch
				@setSpeed()
				radio("#{@_eventPrefix}.PITCH_CHANGE").broadcast numPitch
		getPitch: () ->
			@numPitch

	# ---
	# Speed
	# ---
		setSpeed: () ->
			@numSpeed = if @boolPowered then (( Number(@numRpm) / 60)/100) * (100 + Number(@numPitch)) * 1000
			radio("#{@_eventPrefix}.SPEED_CHANGE").broadcast @numSpeed

	# ---
	# Low
	# ---
		setLowCut: ( @numLowCut ) ->
			@_audioLowFilter.gain.value = @numLowCut

	# ---
	# Mid
	# ---
		setMidCut: ( @numMidCut ) ->
			@_audioMidFilter.gain.value = @numMidCut

	# ---
	# High
	# ---
		setHighCut: ( @numHighCut ) ->
			@_audioMidFilter.gain.value = @numHighCut