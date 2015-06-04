define [], ->
	class AbstractCircleTouch
		constructor: ->
			@boolDown = false
			@numPreviousRadius = NaN
			@numCurrentRadius = NaN
			@arrHistory = []

			@numIncrement = 10
			@numAmount = 0

			@elTouchObject =  document.querySelector '[turntable-platter]'
			@elTouchCanvas = document.createElement 'canvas'
			@elDebug = document.createElement 'div'

			@objContext = @elTouchCanvas.getContext '2d'
			@elSize = 550
			@elTouchCanvas.width = @elTouchCanvas.height = 550

			@elTouchObject.appendChild @elTouchCanvas
			@elTouchObject.appendChild @elDebug

			@setPlatter()
			@setCenter()

			@objCoords =
				x: 0
				y: 0
				width: 550
				height: 550
				center:
					x: 550 / 2
					y: 550 / 2
				mouse:
					x: NaN
					y: NaN

			@elTouchObject.addEventListener 'mousedown', (e) =>
				@boolDown = true
				@numAmount = 0
				console.debug 'Starting tracking'
			@elTouchObject.addEventListener 'mouseup', (e) =>
				@boolDown = false
			@elTouchObject.addEventListener 'mousemove', (e) =>
				if @boolDown then @doLogic.call @, e

		setPlatter: ->
			numCircleEnd = Math.PI+(Math.PI*3)/2;
			numCircleStart = 0
			numRadius = numX = numY = @elSize / 2
			@objContext.beginPath()
			@objContext.arc numX, numY, numRadius, numCircleStart, numCircleEnd, false
			@objContext.fillStyle = 'rgba(0,0,0,0.2)'
			@objContext.fill()

		setCenter: ->
			numCircleEnd = Math.PI+(Math.PI*3)/2;
			numCircleStart = 0
			numRadius = 10
			numX = numY = (@elSize - numRadius) / 2 
			@objContext.beginPath()
			@objContext.fillStyle = 'rgba(0,0,0,1)'
			@objContext.arc numX, numY, numRadius, numCircleStart, numCircleEnd, false
			@objContext.fill()

		setRedraw: ->
			@objContext.clearRect 0, 0, @elTouchCanvas.width, @elTouchCanvas.height

			@setPlatter()
			@setCenter()

			@objContext.beginPath()
			@objContext.moveTo(@objCoords.mouse.x, @objCoords.mouse.y)
			@objContext.lineTo(@objCoords.center.x, @objCoords.center.y)
			@objContext.stroke()
			@objContext.closePath()

		doLogic: (e) ->
			@objCoords.mouse.x = e.x
			@objCoords.mouse.y = e.y

			numX = @objCoords.mouse.x - @objCoords.center.x
			numY = @objCoords.mouse.y - @objCoords.center.y

			numRadians = Math.atan2 numX, numY
			numRadius = 180 + Math.floor 57.2957795 * numRadians

			@setRedraw()

			if @arrHistory[@arrHistory.length-1] and Math.abs(@arrHistory[@arrHistory.length-1].numRadius - numRadius) < 10
				return
			
			@arrHistory.push
				objCoords: JSON.parse JSON.stringify @objCoords
				numRadius: numRadius
				numRadians: numRadians

			if @arrHistory.length > 50 then @arrHistory.shift()
			
			objCurrent = @arrHistory[@arrHistory.length-1]
			objBefore = @arrHistory[@arrHistory.length-2]

			@numAmount += @numIncrement
			if objBefore and objCurrent
				numDifference = objBefore.numRadius - objCurrent.numRadius
				@boolClockwise = if numDifference > 0 then true else false
				if numDifference < -300 then @boolClockwise = true
				if numDifference > 300 then @boolClockwise = false

			## TODO: Lock circle rotation
			console.debug 'difference': numDifference, 'clockwise': @boolClockwise, 'radius': numRadius
