import Olon from "./main.js"

Olon.prototype._shader = function (programObj, source, type) {
	const shader = this.gl.createShader(type)
	if (!/#version 300 es/.test(source)) source = `#version 300 es\n${source}`
	source = source.replace(/^\s+/, "")
	this.gl.shaderSource(shader, source)
	this.gl.compileShader(shader)
	this.gl.attachShader(programObj.program, shader)
}

Olon.prototype._processShader = function (programObj, sources, type) {
	if (Array.isArray(sources))
		sources.forEach((source) => this._shader(programObj, source, type))
	else this._shader(programObj, sources, type)
}

Olon.prototype.setShader = function (vert, frag) {
	this.program = this.createProgram(vert, frag)
	this.linkProgram(this.program)
	this.useProgram(this.program)
}

export default Olon
