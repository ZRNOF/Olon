import Olon from "../Core/main.js"

Olon.prototype.enableDepth = function () {
	this.gl.enable(this.gl.DEPTH_TEST)
}

Olon.prototype.disableDepth = function () {
	this.gl.disable(this.gl.DEPTH_TEST)
}

Olon.prototype.useDepth = function (callback) {
	this.gl.enable(this.gl.DEPTH_TEST)
	callback()
	this.gl.disable(this.gl.DEPTH_TEST)
}

export default Olon
