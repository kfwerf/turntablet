// Generated by CoffeeScript 1.7.1
(function() {
  define([], function() {
    var AbstractCircleTouch;
    return AbstractCircleTouch = (function() {
      function AbstractCircleTouch() {
        this.boolDown = false;
        this.numPreviousRadius = NaN;
        this.numCurrentRadius = NaN;
        this.arrHistory = [];
        this.numIncrement = 10;
        this.numAmount = 0;
        this.elTouchObject = document.querySelector('[turntable-platter]');
        this.elTouchCanvas = document.createElement('canvas');
        this.elDebug = document.createElement('div');
        this.objContext = this.elTouchCanvas.getContext('2d');
        this.elSize = 550;
        this.elTouchCanvas.width = this.elTouchCanvas.height = 550;
        this.elTouchObject.appendChild(this.elTouchCanvas);
        this.elTouchObject.appendChild(this.elDebug);
        this.setPlatter();
        this.setCenter();
        this.objCoords = {
          x: 0,
          y: 0,
          width: 550,
          height: 550,
          center: {
            x: 550 / 2,
            y: 550 / 2
          },
          mouse: {
            x: NaN,
            y: NaN
          }
        };
        this.elTouchObject.addEventListener('mousedown', (function(_this) {
          return function(e) {
            _this.boolDown = true;
            _this.numAmount = 0;
            return console.debug('Starting tracking');
          };
        })(this));
        this.elTouchObject.addEventListener('mouseup', (function(_this) {
          return function(e) {
            return _this.boolDown = false;
          };
        })(this));
        this.elTouchObject.addEventListener('mousemove', (function(_this) {
          return function(e) {
            if (_this.boolDown) {
              return _this.doLogic.call(_this, e);
            }
          };
        })(this));
      }

      AbstractCircleTouch.prototype.setPlatter = function() {
        var numCircleEnd, numCircleStart, numRadius, numX, numY;
        numCircleEnd = Math.PI + (Math.PI * 3) / 2;
        numCircleStart = 0;
        numRadius = numX = numY = this.elSize / 2;
        this.objContext.beginPath();
        this.objContext.arc(numX, numY, numRadius, numCircleStart, numCircleEnd, false);
        this.objContext.fillStyle = 'rgba(0,0,0,0.2)';
        return this.objContext.fill();
      };

      AbstractCircleTouch.prototype.setCenter = function() {
        var numCircleEnd, numCircleStart, numRadius, numX, numY;
        numCircleEnd = Math.PI + (Math.PI * 3) / 2;
        numCircleStart = 0;
        numRadius = 10;
        numX = numY = (this.elSize - numRadius) / 2;
        this.objContext.beginPath();
        this.objContext.fillStyle = 'rgba(0,0,0,1)';
        this.objContext.arc(numX, numY, numRadius, numCircleStart, numCircleEnd, false);
        return this.objContext.fill();
      };

      AbstractCircleTouch.prototype.setRedraw = function() {
        this.objContext.clearRect(0, 0, this.elTouchCanvas.width, this.elTouchCanvas.height);
        this.setPlatter();
        this.setCenter();
        this.objContext.beginPath();
        this.objContext.moveTo(this.objCoords.mouse.x, this.objCoords.mouse.y);
        this.objContext.lineTo(this.objCoords.center.x, this.objCoords.center.y);
        this.objContext.stroke();
        return this.objContext.closePath();
      };

      AbstractCircleTouch.prototype.doLogic = function(e) {
        var numDifference, numRadians, numRadius, numX, numY, objBefore, objCurrent;
        this.objCoords.mouse.x = e.x;
        this.objCoords.mouse.y = e.y;
        numX = this.objCoords.mouse.x - this.objCoords.center.x;
        numY = this.objCoords.mouse.y - this.objCoords.center.y;
        numRadians = Math.atan2(numX, numY);
        numRadius = 180 + Math.floor(57.2957795 * numRadians);
        this.setRedraw();
        if (this.arrHistory[this.arrHistory.length - 1] && Math.abs(this.arrHistory[this.arrHistory.length - 1].numRadius - numRadius) < 10) {
          return;
        }
        this.arrHistory.push({
          objCoords: JSON.parse(JSON.stringify(this.objCoords)),
          numRadius: numRadius,
          numRadians: numRadians
        });
        if (this.arrHistory.length > 50) {
          this.arrHistory.shift();
        }
        objCurrent = this.arrHistory[this.arrHistory.length - 1];
        objBefore = this.arrHistory[this.arrHistory.length - 2];
        this.numAmount += this.numIncrement;
        if (objBefore && objCurrent) {
          numDifference = objBefore.numRadius - objCurrent.numRadius;
          this.boolClockwise = numDifference > 0 ? true : false;
          if (numDifference < -300) {
            this.boolClockwise = true;
          }
          if (numDifference > 300) {
            this.boolClockwise = false;
          }
        }
        return console.debug({
          'difference': numDifference,
          'clockwise': this.boolClockwise,
          'radius': numRadius
        });
      };

      return AbstractCircleTouch;

    })();
  });

}).call(this);