define [ 'modules/AudioLoader', 'modules/AudioFilters' ], ( AudioLoader, AudioFilters ) ->
	###*
	 * AudioStream makes it easy to load audio files and apply basic filters to them
	###
	class AudioStream
		constructor: ( @strFileName ) ->
			_audioContext = window.AudioContext || window.webkitAudioContext
			@_audioCore = new _audioContext()

			@_audioFilters = new AudioFilters @_audioCore
						
			@_boolLoading = false
			@boolPlaying = false

			@numPlayhead = 0
			
			@_load()

		
		###*
		 * Resets the audiofilters on each stop as WebAudio does not allow reuse, hence we have to recreate on audio stop
		###
		_reset: ->
			if @_audioBuffer
				@_audioFilters.setInput @_audioBuffer
				
				@_audioIn = @_audioFilters.getInput()
				@_audioOut = @_audioFilters.getOutput()
				
				@_audioOut.connect @_audioCore.destination #Temp connector, needs to be mixer at some point or a bigger overlapper

		
		###*
		 * Delegator to the AudioLoader, which gives back a success and failure callback
		###
		_load: ->
			@_boolLoading = true
			@_audioLoader = new AudioLoader( @strFileName, @_audioCore )
				.success ( @_audioBuffer ) =>
					@_reset()
					@_boolLoading = false

		
		###*
		 * Delegator to the Low filter available via AudioFilters
		 * @param {Number} numValue Value between 40 and -40
		###
		setLow: (  numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setLowFilter numValue

		
		###*
		 * Delegator to the Mid filter available via AudioFilters
		 * @param {Number} numValue Value between 40 and -40
		###
		setMid: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setMidFilter numValue
		
		###*
		 * Delegator to the High filter available via AudioFilters
		 * @param {Number} numValue Value between 40 and -40
		###
		setHigh: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setHighFilter numValue

		
		###*
		 * Delegator to the Volume available via AudioFilters
		 * @param {Number} numValue Value between 0 and 1
		###
		setVolume: ( numValue ) ->			
			if numValue isnt undefined
				@_audioFilters.setVolume numValue

		
		###*
		 * Delegator to the Pitch available via AudioFilters
		 * @param {Number} numValue Value between -100 and 100 (%)
		###
		setPitch: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setPitch numValue

		
		###*
		 * Sets play to the audio object. Will try to use the saved playhead if nothing is filled in.
		 * @param {Number} numPlayhead The point at which the song should start
		###
		setPlay: ( numPlayhead ) ->
			if not @_boolLoading and not @boolPlaying
				if numPlayhead isnt undefined
					@numPlayhead = numPlayhead
				@_audioIn.start @numPlayhead
				@boolPlaying = true
		
		###*
		 * Sets stop to the audio object. Will try saving the current playhead status when play is activated. Does a reset as required.
		###
		setStop: ->
			if not @_boolLoading and @boolPlaying
				@numPlayhead = @_audioOut.context.currentTime
				@_audioIn.stop()
				@_reset()
				@boolPlaying = false

