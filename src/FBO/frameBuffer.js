import Olon from "../Core/main.js"

Olon.prototype.bindFBO = function (fbo) {
	this.gl.bindFramebuffer(this.FB, fbo)
}

Olon.prototype.unbindFBO = function () {
	this.gl.bindFramebuffer(this.FB, null)
}

Olon.prototype.useFBO = function (fbo, callback) {
	this.bindFBO(fbo)
	callback()
	this.unbindFBO()
}

Olon.prototype.checkFramebufferStatus = function () {
	const status = this.gl.checkFramebufferStatus(this.FB)
	switch (status) {
		case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
			throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_ATTACHMENT"
		case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
			throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
		case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
			throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_DIMENSIONS"
		case this.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
			throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"
		case this.gl.FRAMEBUFFER_UNSUPPORTED:
			throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_UNSUPPORTED"
		default:
			break
	}
}

// check
Olon.prototype.createFBO = function ({ program, outs, depthBuffer }) {
	const fbo = this.gl.createFramebuffer()
	this.useFBO(fbo, () => {
		const MAX_DRAW_BUFFERS = this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS)
		const COLOR_ATTACHMENTS = Array.from(
			{ length: MAX_DRAW_BUFFERS },
			() => this.gl.NONE
		)

		this.setProgram(program)
		outs.forEach(({ name, texture }) => {
			const loc = this.oLoc(name)
			const attachment = this.gl.COLOR_ATTACHMENT0 + loc
			COLOR_ATTACHMENTS[loc] = attachment
			this.gl.framebufferTexture2D(this.FB, attachment, this.T2D, texture, 0)
		})

		this.gl.framebufferRenderbuffer(this.FB, this.DA, this.RB, depthBuffer)
		this.gl.drawBuffers(COLOR_ATTACHMENTS)
		this.checkFramebufferStatus()
	})
	return fbo
}

export default Olon
