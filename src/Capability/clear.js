import Olon from "../Core/main.js"

Olon.prototype.clear = function (mask) {
	this.gl.clear(mask)
}

Olon.prototype.clearColor = function (r, g, b, a) {
	if (arguments.length !== 0) this.gl.clearColor(r, g, b, a)
	this.gl.clear(this.gl.COLOR_BUFFER_BIT)
}

Olon.prototype.clearDepth = function (depth) {
	if (arguments.length !== 0) this.gl.clearDepth(depth)
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
}

Olon.prototype.clearStencil = function (stencil) {
	if (arguments.length !== 0) this.gl.clearStencil(stencil)
	this.gl.clear(this.gl.STENCIL_BUFFER_BIT)
}

export default Olon
