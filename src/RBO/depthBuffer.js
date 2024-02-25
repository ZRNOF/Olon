import Olon from "../Core/main.js"

Olon.prototype.createDepthBuffer = function (
	width,
	height,
	depthComponent = 16
) {
	const depthBuffer = this.gl.createRenderbuffer()
	this.useRBO(depthBuffer, () =>
		this.gl.renderbufferStorage(
			this.RB,
			depthComponent === 24
				? this.gl.DEPTH_COMPONENT24
				: depthComponent === 32
				? this.gl.DEPTH_COMPONENT32F
				: this.gl.DEPTH_COMPONENT16,
			width,
			height
		)
	)
	return depthBuffer
}

export default Olon
