define [], ->
	###*
	 * XHR 2 wrapper for arraybuffer audio files. Easily makes two callback functions, success and failure
	###
	class AudioLoader
		constructor: ( @strAudioFile, @audioContext ) ->
			unless @strAudioFile and @audioContext then return false
			@_audioXhr = new XMLHttpRequest()
			@_audioXhr.open "GET", @strAudioFile, true
			@_audioXhr.responseType = "arraybuffer"
			@_audioXhr.onload = => 
				@audioContext.decodeAudioData @_audioXhr.response, @_setAudioNodeBuffer.bind(@), @_failure.bind(@)
			@_audioXhr.send()

		_setAudioNodeBuffer: ( @arrAudioBuffer ) ->
			@fnSuccess.call this, arrAudioBuffer, @audioContext if typeof @fnSuccess is 'function'

		_failure: ( strError ) ->
			@fnFailure.call this, strError, @audioContext if typeof @fnFailure is 'function'

		
		###*
		 * The success callback, when the audio loads in with success
		 * @param  {Function} @fnSuccess
		###
		success: ( @fnSuccess ) ->

		
		###*
		 * The failure callback, when the audio loads in with failure
		 * @param  {Function} @fnFailure
		###
		failure: ( @fnFailure ) ->