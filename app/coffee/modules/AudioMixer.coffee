define [ 'modules/AudioStream' ], ( AudioStream ) ->
	###*
	 * AudioMixer creates channels that can be mixed
	###

	class AudioMixer
		constructor: ->
			_audioContext = window.AudioContext || window.webkitAudioContext
			@_audioCore = @_audioCore or new _audioContext()

			###*
			 * The available AudioStream channels
			 * @type {Object}
			###
			@objAudioChannels =
				one: false
				two: false


			@objCrossfader =
				from: 'one'
				to: 'two'
				amount: .5

		_batchChannels: ( strMethod, arrValues ) ->
			for strKey, audioStream of @objAudioChannels
				audioStream[strMethod].apply this, arrValues if typeof audioStream is 'object'

		###*
		 * Sets up an audio channel with a AudioStream
		 * @param {String} strUrl
		 * @param {String} strlChannel = 'one'
		###
		setAudioChannel: ( strUrl, strChannel = 'one' ) ->
			@objAudioChannels[strChannel] = new AudioStream @_audioCore, strUrl
			@setCrossFade()

		###*
		 * returns the audio channel
		 * @param  {String} strChannel = 'one'
		 * @return {AudioStream}
		###
		getAudioChannel: ( strChannel = 'one' ) ->
			@objAudioChannels[strChannel]

		setStopAll: ->
			@_batchChannels 'setStop'

		setCrossFadeSources: ( strFrom, strTo ) ->
			@objCrossfader['from'] = strFrom
			@objCrossfader['to'] = strTo

			setCrossFade()
			
		setCrossFadeAmount: ( @numCrossFadeAmount ) ->
			@setCrossFade()
		
		setCrossFade: ->
			numFromAmount = 1 - @numCrossFadeAmount
			numToAmount = @numCrossFadeAmount
			audioFromChannel = @objAudioChannels[ @objCrossfader['from'] ]
			audioToChannel = @objAudioChannels[ @objCrossfader['to'] ]

			audioFromChannel.setVolume numFromAmount if typeof audioFromChannel is 'object'
			audioToChannel.setVolume numToAmount if typeof audioToChannel is 'object'



