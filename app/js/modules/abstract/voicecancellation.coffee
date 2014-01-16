# Author: Kenneth van der Werf
# Description: Voice remover based on phase cancellation http://jsfiddle.net/licson0729/r3Gx7/light/

define [], () ->
	class VoiceCancellation
		constructor: ( @_audioContext ) ->
			@audioProcessor = @_audioContext.createScriptProcessor 4096
			@audioProcessor.onaudioprocess = ( e ) ->
				inputOne = e.inputBuffer.getChannelData 0
				inputTwo = e.inputBuffer.getChannelData 1
				outputOne = e.outputBuffer.getChannelData 0
				outputTwo = e.outputBuffer.getChannelData 1


				for i in inputOne
					outputOne[_i] = (inputOne[_i] - inputTwo[_i]) / 2
					outputTwo[_i] = (inputTwo[_i] - inputOne[_i]) / 2

			@audioProcessor
