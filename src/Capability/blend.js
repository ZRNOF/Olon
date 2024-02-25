import Olon from "../Core/main.js"

Olon.prototype.enableBlend = function () {
	this.gl.enable(this.gl.BLEND)
}

Olon.prototype.disableBlend = function () {
	this.gl.disable(this.gl.BLEND)
}

Olon.prototype.blend = function (
	{
		sfactor = this.BLEND_SFAC,
		dfactor = this.BLEND_DFAC,
		mode = this.BLEND_MODE,
	} = { sfactor, dfactor, mode }
) {
	this.BLEND_SFAC = sfactor
	this.BLEND_DFAC = dfactor
	this.BLEND_MODE = mode
	this.gl.blendEquation(this.BLEND_MODE)
	this.gl.blendFunc(this.BLEND_SFAC, this.BLEND_DFAC)
}

export default Olon
