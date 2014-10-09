define [], ->
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

		
		success: ( @fnSuccess ) ->
		failure: ( @fnFailure ) ->