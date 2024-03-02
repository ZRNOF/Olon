import Olon from "../Core/main.js"

Olon.prototype._getActiveUniforms = function (programObj) {
	return this.gl.getProgramParameter(
		programObj.program,
		this.gl.ACTIVE_UNIFORMS
	)
}

Olon.prototype.uniform = function (name, data) {
	const info = this.program.uniforms[name]
	if (!info) return

	if (Object.hasOwn(this.program.texUnitList, name)) {
		this.gl.activeTexture(this.gl.TEXTURE0 + this.program.texUnitList[name])
		this.gl.bindTexture(this.T2D, data)
		return
	}

	const loc = this.uLoc(name)
	this.UniformMap[info.type](this.gl, loc, data)
}

Olon.prototype.initUniform = function (uniformInfos) {
	const uniforms = {}
	const entries = Object.entries(uniformInfos)
	for (const [name, type] of entries)
		uniforms[name] = (data) => this.uniform(type, name, data)
	return uniforms
}

export default Olon
