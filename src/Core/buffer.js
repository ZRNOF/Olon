import Olon from "./main.js"

Olon.prototype.createBuffer = function (data, usage) {
	const buffer = this.gl.createBuffer()
	this.useBuffer(buffer, () => this.gl.bufferData(this.AB, data, usage))
	return buffer
}

Olon.prototype.bindBuffer = function (buffer) {
	this.gl.bindBuffer(this.AB, buffer)
}

Olon.prototype.unbindBuffer = function () {
	this.gl.bindBuffer(this.AB, null)
}

Olon.prototype.useBuffer = function (buffer, callback) {
	this.bindBuffer(buffer)
	callback()
	this.unbindBuffer()
}

export default Olon
