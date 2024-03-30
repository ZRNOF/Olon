import Olon from "../Core/main.js"

Olon.prototype.enableCulling = function () {
	this.gl.enable(this.gl.CULL_FACE)
}

Olon.prototype.disableCulling = function () {
	this.gl.disable(this.gl.CULL_FACE)
}

Olon.prototype.cull = function (mode) {
	this.gl.cullFace(mode)
}

export default Olon
