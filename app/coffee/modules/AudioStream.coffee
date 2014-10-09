define [ 'modules/AudioLoader', 'modules/AudioFilters' ], ( AudioLoader, AudioFilters ) ->
	###*
	 * @module  AudioStream
	 * @description Wrapper for easy loading of an audio file and attaching filters to it
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

		_reset: ->
			if @_audioBuffer
				@_audioFilters.setInput @_audioBuffer
				
				@_audioIn = @_audioFilters.getInput()
				@_audioOut = @_audioFilters.getOutput()
				
				@_audioOut.connect @_audioCore.destination #Temp connector, needs to be mixer at some point or a bigger overlapper

		_load: ->
			@_boolLoading = true
			@_audioLoader = new AudioLoader( @strFileName, @_audioCore )
				.success ( @_audioBuffer ) =>
					@_reset()
					@_boolLoading = false
		
		setLow: (  numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setLowFilter numValue

		setMid: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setMidFilter numValue

		setHigh: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setHighFilter numValue

		setVolume: ( numValue ) ->			
			if numValue isnt undefined
				@_audioFilters.setVolume numValue

		setPitch: ( numValue ) ->
			if numValue isnt undefined
				@_audioFilters.setPitch numValue

		setPlay: ( numPlayhead ) ->
			if not @_boolLoading and not @boolPlaying
				if numPlayhead isnt undefined
					@numPlayhead = numPlayhead
				@_audioIn.start @numPlayhead
				@boolPlaying = true

		setStop: ( numPlayhead ) ->
			if not @_boolLoading and @boolPlaying
				@numPlayhead = @_audioOut.context.currentTime
				@_audioIn.stop()
				@_reset()
				@boolPlaying = false

