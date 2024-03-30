import Olon from "../Core/main.js"

Olon.prototype._getActiveUniforms = function (programObj) {
	return this.gl.getProgramParameter(
		programObj.program,
		this.gl.ACTIVE_UNIFORMS
	)
}

Olon.prototype.uniform = function (name, data, updateTex) {
	const info = this.program.uniforms[name]
	if (!info) return

	if (Object.hasOwn(this.program.texUnitList, name)) {
		if (updateTex instanceof HTMLVideoElement) {
			if (updateTex.readyState !== updateTex.HAVE_ENOUGH_DATA) return
			const iformat = this.RGBA
			const { format, type } = this.IFormatMap[iformat]
			this.gl.activeTexture(this.gl.TEXTURE0 + this.program.texUnitList[name])
			this.gl.bindTexture(this.T2D, data)
			this.gl.texImage2D(this.T2D, 0, iformat, format, type, updateTex)
		}
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
