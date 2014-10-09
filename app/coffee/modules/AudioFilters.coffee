define [], ->
	###*
	 * Adds various filters to the audio source and auto chains them. It gives numerous options and exposes its in and output for usage.
	 * At basic this function tries to support low, mid, hi, pitch and volume. These are basic channel filters.
	###
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

		###*
		 * Returns the original input given in the constructor
		 * @return {AudioBufferSource}
		###
		getInput: ->
			@_audioSrc

		###*
		 * Returns the last filter applied in the connect chain
		 * @return {BiquadFilter}
		###
		getOutput: ->
			@_audioHighFilter


		###*
		 * Sets the low shelf filter
		 * @param {Number} @numLowFilter Value between -40 and 40
		###
		setLowFilter: ( @numLowFilter ) ->
			@_audioLowFilter.gain.value = @numLowFilter if @_audioLowFilter


		###*
		 * Sets the mid shelf filter
		 * @param {Number} @numLowFilter Value between -40 and 40
		###
		setMidFilter: ( @numMidFilter ) ->
			@_audioMidFilter.gain.value = @numMidFilter if @_audioMidFilter


		###*
		 * Sets the high shelf filter
		 * @param {Number} @numLowFilter Value between -40 and 40
		###
		setHighFilter: ( @numHighFilter ) ->
			@_audioHighFilter.gain.value = @numHighFilter if @_audioHighFilter
		

		###*
		 * Sets volume gain
		 * @param {Number} @numVolume Value between 0 and 1
		###
		setVolume: ( @numVolume ) ->
			@_audioVolume.gain.value = @numVolume if @_audioVolume
		

		###*
		 * Sets pitch in percentage relative to 100%
		 * @param {Number} @numPitch Value between -100 and 100 (%)
		###
		setPitch: ( @numPitch ) ->
			@_audioSrc.playbackRate.value = (100 + Number(@numPitch))/100 if @_audioSrc

