import Olon from "../Core/main.js"

Olon.prototype.transformFeedback = function (
	readVAO,
	writeBuffer,
	primMode,
	callback
) {
	this.useVAO(readVAO, () => {
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, writeBuffer)
		this.gl.enable(this.gl.RASTERIZER_DISCARD)
		this.gl.beginTransformFeedback(primMode)
		callback()
		this.gl.endTransformFeedback()
		this.gl.disable(this.gl.RASTERIZER_DISCARD)
		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
	})
}

export default Olon
