define [], ->
	class AudioFilters
		constructor: ( @_audioCore ) ->
			@numPitch = 0
			@numVolume = 1
			@numLowFilter = 0
			@numMidFilter = 0
			@numHighFilter = 0

		setInput: ( @_audioBuffer ) ->
			@_audioSrc = @_audioCore.createBufferSource()
			@_audioSrc.buffer = @_audioBuffer

			@_audioSrc.playbackRate.value = (100 + Number(@numPitch))/100 if @_audioSrc

			@_audioVolume = @_audioCore.createGain()
			@_audioVolume.gain.value = @numVolume

			@_audioLowFilter = @_audioCore.createBiquadFilter()
			@_audioLowFilter.type = 'lowshelf'
			@_audioLowFilter.frequency.value = 500
			@_audioLowFilter.gain.value = @numLowFilter

			@_audioMidFilter = @_audioCore.createBiquadFilter()
			@_audioMidFilter.type = 'peaking'
			@_audioMidFilter.frequency.value = 750
			@_audioMidFilter.gain.value =  @numMidFilter

			@_audioHighFilter = @_audioCore.createBiquadFilter()
			@_audioHighFilter.type = 'highshelf'
			@_audioHighFilter.frequency.value = 1000
			@_audioHighFilter.gain.value = @numHighFilter

			@_audioSrc.connect @_audioVolume
			@_audioVolume.connect @_audioLowFilter
			@_audioLowFilter.connect @_audioMidFilter
			@_audioMidFilter.connect @_audioHighFilter

		getInput: ->
			@_audioSrc

		getOutput: ->
			@_audioHighFilter

		setLowFilter: ( @numLowFilter ) ->
			@_audioLowFilter.gain.value = @numLowFilter if @_audioLowFilter

		setMidFilter: ( @numMidFilter ) ->
			@_audioMidFilter.gain.value = @numMidFilter if @_audioMidFilter

		setHighFilter: ( @numHighFilter ) ->
			@_audioHighFilter.gain.value = @numHighFilter if @_audioHighFilter
			
		setVolume: ( @numVolume ) ->
			@_audioVolume.gain.value = @numVolume if @_audioVolume
		
		setPitch: ( @numPitch ) ->
			@_audioSrc.playbackRate.value = (100 + Number(@numPitch))/100 if @_audioSrc

