/**
 *
 */
function Thermometer(canvas, opts) {
    var leftMargin

    if (!canvas.getContext) throw new Error('Must pass in a valid <canvas> element!')

    // TODO: Set more default options
    this.opts = opts || {}
    this.ctx = canvas.getContext('2d')
    this.ctx.font = this.opts.font || '200 42px Helvetica'
    this.ctx.strokeStyle = '#666666'
    this.width = this.opts.width || 100
    this.ctx.lineWidth = this.opts.lineWidth || 5;
    this.padding = { top: 10, bottom: 10 }
    this.canvasWidth = this.ctx.canvas.width
    this.canvasHeight = this.ctx.canvas.height
    this.center = this.canvasWidth / 2

    // Make sure we have room on the canvas for the widest part of the thermometer.
    while ( (this.width * 2) + (this.ctx.lineWidth * 2) >= this.canvasWidth) {
        this.width--
    }

    this.bigRadius = this.width
    this.smallRadius = this.width / 2

    leftMargin = (this.canvasWidth - this.width) / 2
    this.pos = {
        left:   leftMargin,
        right:  leftMargin + this.width,
        top:    this.smallRadius + this.ctx.lineWidth,
        bottom: this.canvasHeight - (this.bigRadius * 2)
    }
    this.abs = {
        top:    this.pos.top - this.smallRadius,
        bottom: this.canvasHeight - this.padding.bottom
    }
}

Thermometer.prototype.empty = function() {
    // this.ctx.save()
    // Not sure that I need to do this since I'm not messing with the transform,
    // but leaving here just in case.
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    // this.ctx.restore()
    this.drawOutline()
}

Thermometer.prototype.erase = function() {
    console.log('erasing')
    this.ctx.clearRect(0, 0, this.pos.left, this.pos.bottom)
}

Thermometer.prototype.set = function(prop, value) {
    this[prop] = (typeof value !== 'Number' ) ? parseInt(value) : value
    return this
}

Thermometer.prototype.draw = function() {
    this.drawOutline()
    if (this.data != null) this.fill()
}

Thermometer.prototype.hasMetGoal = function() {
    return this.data > this.goal
}

Thermometer.prototype.fill = function() {
    var self = this,
        fillLine = getFillLine(),
        fillY = this.abs.bottom - fillLine,
        fillHeight = this.abs.bottom - fillY

    this.empty()
    this.clip()
    if (!this.data) return

    this.ctx.fillStyle = 'rgba(255, 70, 20, 0.7)'
    this.ctx.fillRect(0 , fillY, this.canvasWidth, fillHeight)
    this.oldFillHeight = fillHeight
    this.oldFillY = fillY

    this.labelData()
    this.drawTicks()

    function getFillLine() {
        return (self.abs.bottom - self.abs.top) * (self.data / self.goal)
    }
}

Thermometer.prototype.drawOutline = function() {
    this.ctx.beginPath()
    this.ctx.lineWidth = 5
    this.ctx.moveTo(this.pos.left, this.pos.bottom)
    this.ctx.lineTo(this.pos.left, this.pos.top)
    this.ctx.arc(this.center, this.pos.top, this.smallRadius, getRadians(180), getRadians(0))
    this.ctx.lineTo(this.pos.right, this.pos.bottom)
    this.ctx.arc(this.center, this.canvasHeight - this.bigRadius - this.ctx.lineWidth - this.padding.bottom, this.width, getRadians(300), getRadians(240))
    this.ctx.stroke()
    this.drawTicks()
    if (this.goal != null) this.labelGoal()

    

    function getRadians(degree) {
        return degree * (Math.PI / 180)
    }
}

Thermometer.prototype.clip = function() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(this.pos.left + 5, this.pos.bottom)
    this.ctx.lineTo(this.pos.left + 5, this.pos.top)
    this.ctx.arc(this.center, this.pos.top + 5, this.smallRadius - 5, getRadians(180), getRadians(0))
    this.ctx.lineTo(this.pos.right - 5, this.pos.bottom )
    this.ctx.arc(this.center, this.canvasHeight - this.bigRadius - this.ctx.lineWidth - this.padding.bottom - 5 + 2, this.width- 5, getRadians(300), getRadians(240))
    this.ctx.clip()

    function getRadians(degree) {
        return degree * (Math.PI / 180)
    }
}

Thermometer.prototype.label = function(text) {
    if (!text) return
    tm = this.ctx.measureText(text)
}

Thermometer.prototype.labelGoal = function() {
    var text = 'Goal: ' + this.goal,
        tm = this.ctx.measureText(text),
        fontHeight

    if (!text) return

    this.ctx.beginPath()
    this.ctx.fillStyle = '#333'
    // this.ctx.textAlign = 'center'
    fontHeight = parseInt(this.ctx.font, 10)
    // this.ctx.textBaseline = 'middle'
    if (this.hasMetGoal()) {
        // Data is at the top of the thermometer.
        this.adjustGoalLabel(text)
    } else {
        // Goal is at the top of the thermometer.
        this.ctx.fillText(text, 0, this.abs.top + fontHeight, this.pos.left)
        this.ctx.moveTo(this.center, this.abs.top)
        this.ctx.lineWidth = 2
        // Add 1 for padding.
        // this.ctx.lineTo(tm.width, this.abs.top + fontHeight)
        this.ctx.stroke()
    }
}

Thermometer.prototype.label = function() {
      // 
}

Thermometer.prototype.labelData = function() {
    var text = this.data, tm

    if (!text) return
    tm = this.ctx.measureText(text)

    this.ctx.beginPath()
    this.ctx.shadowColor = '#444'
    this.ctx.shadowOffsetX = 2
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 7
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#fff'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(text, this.center, this.canvasHeight - this.bigRadius - this.ctx.lineWidth - this.padding.bottom - 5 + 2)
    this.ctx.closePath()
}

Thermometer.prototype.drawTicks = function() {
    var stop = this.pos.bottom - this.pos.top,
        x, y

    this.ctx.fillStyle = '#666666'
    this.ctx.shadowColor = 'transparent'
    this.ctx.lineWidth = 1;

    for (var i = 0; i < stop; i += 10) {
        y = (this.pos.bottom - i) - this.ctx.lineWidth
        x = this.pos.left
        this.ctx.moveTo(x, y)
        x = (i !== 0 && i % 50 === 0) ? x + 30 : x + 20
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }
}

Thermometer.prototype.adjustGoalLabel = function(text) {
    // (this.abs.bottom - this.abs.top) * (self.data / self.goal)
    var ratio = (this.data / this.goal),
        fontHeight = parseInt(this.ctx.font, 10)

    this.ctx.restore()
    // this.erase()
    this.adjustingGoal = true

console.log('adjusting')
var y = (this.abs.top*ratio) + fontHeight + 50
console.log(y)
    this.ctx.fillText(text, 0, y, this.pos.left)
    // this.ctx.moveTo(this.center, this.abs.top)
    this.ctx.lineWidth = 2
    // Add 1 for padding.
    // this.ctx.lineTo(tm.width, this.abs.top + fontHeight)
    this.ctx.stroke()
    this.adjustingGoal = false
}

