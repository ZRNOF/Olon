import Olon from "../Core/main.js"
import * as TypeMaps from "../Data/TypeMaps.js"

Olon.prototype._calcStride = function (attributes) {
	return attributes.reduce((acc, { unit, size }) => {
		return acc + size * this.UnitMap[unit].size
	}, 0)
}

Olon.prototype._vaoByBufferInfos = function (programObj, bufferInfos) {
	if (!Array.isArray(bufferInfos)) bufferInfos = [bufferInfos]
	const vao = this.gl.createVertexArray()
	this.use({
		program: this.useProgram(programObj),
		VAO: vao,
	}).run(() => {
		bufferInfos.forEach((bufferInfo) => {
			this.useBuffer(bufferInfo.buffer, () => {
				const attributes = bufferInfo.attributes
				const stride = bufferInfo.stride || this._calcStride(attributes)
				const divisor = bufferInfo.divisor
				let offset = 0
				attributes.forEach(({ name, unit, size }) => {
					const loc = this.aLoc(name)
					const type = this.UnitMap[unit].type
					this.gl.vertexAttribPointer(loc, size, type, false, stride, offset)
					this.gl.enableVertexAttribArray(loc)
					offset += size * this.UnitMap[unit].size

					if (Number.isInteger(divisor) && divisor >= 0)
						this.gl.vertexAttribDivisor(loc, divisor)
				})
			})
		})
	})
	return vao
}

Olon.prototype._vaoByAttribute = function (programObj, attributes) {
	this.useProgram(programObj)
	const vao = this.gl.createVertexArray()
	this.useVAO(vao, () => {
		attributes.forEach(({ name, data, size }) => {
			const unit = TypeMaps.TypeArrayUnit[data.constructor.name]
			this.setAttribute(name, data, unit, size)
		})
	})
	return vao
}

Olon.prototype._checkUseAttribute = function (params) {
	return Array.isArray(params) && Object.hasOwn(params[0], "name")
}

Olon.prototype.createVAO = function (programObj, params) {
	if (this._checkUseAttribute(params))
		return this._vaoByAttribute(programObj, params)
	return this._vaoByBufferInfos(programObj, params)
}

Olon.prototype.bindVAO = function (vao) {
	this.gl.bindVertexArray(vao)
}

Olon.prototype.unbindVAO = function () {
	this.gl.bindVertexArray(null)
}

Olon.prototype.useVAO = function (vao, callback) {
	this.bindVAO(vao)
	callback()
	this.unbindVAO()
}

export default Olon
