import Olon from "./main.js"
import * as TypeMaps from "../Data/TypeMaps.js"

Olon.prototype.setProgram = function (programObj) {
	this.program = programObj
}

Olon.prototype.linkProgram = function (programObj) {
	this.setProgram(programObj)
	this.gl.linkProgram(programObj.program)
}

Olon.prototype.useProgram = function (programObj) {
	this.setProgram(programObj)
	this.gl.useProgram(programObj.program)
}

Olon.prototype._updateProgramUniforms = function (
	programObj,
	name,
	type,
	size
) {
	programObj.uniforms[name] = { type, size }
}

Olon.prototype.createProgram = function (vsList, fsList, tfVaryings) {
	const program = this.gl.createProgram()
	const programObj = {
		program,
		uniforms: {},
		texUnitList: {},
		texUnitCount: 0,
		emptyTexUnits: [],
	}
	this._processShader(programObj, vsList, this.gl.VERTEX_SHADER)
	this._processShader(programObj, fsList, this.gl.FRAGMENT_SHADER)
	if (tfVaryings)
		this.gl.transformFeedbackVaryings(
			programObj.program,
			tfVaryings,
			this.gl.INTERLEAVED_ATTRIBS
		)
	this.linkProgram(programObj)
	this.useProgram(programObj)

	const numUniforms = this._getActiveUniforms(programObj)
	for (let i = 0; i < numUniforms; ++i) {
		const { name, type, size } = this._getActiveUniform(programObj, i)
		this._updateProgramUniforms(programObj, name, type, size)
		if (TypeMaps.samplerTypes.has(type)) this._setTexUnit(name)
	}
	return programObj
}

Olon.prototype._setTexUnit = function (name) {
	const unitIndex = !this.program.emptyTexUnits.length
		? this.program.texUnitCount++
		: this.program.emptyTexUnits.pop()

	this.uniform(name, unitIndex)
	this.program.texUnitList[name] = unitIndex
}

Olon.prototype._getActiveUniform = function (programObj, index) {
	const info = this.gl.getActiveUniform(programObj.program, index)
	return {
		name: info.name.replace(/\[[^\]]*\]/g, ""),
		type: info.type,
		size: info.size,
	}
}

export default Olon
