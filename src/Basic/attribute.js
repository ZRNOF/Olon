import Olon from "../Core/main.js"

Olon.prototype.setAttribute = function (name, data, unit, size, divisor) {
	const loc = this.aLoc(name)
	const buffer = this.gl.createBuffer()
	const type = this.UnitMap[unit].type
	this.useBuffer(buffer, () => {
		this.gl.bufferData(this.AB, data, this.gl.STATIC_DRAW)
		this.gl.vertexAttribPointer(loc, size, type, false, 0, 0)
		this.gl.enableVertexAttribArray(loc)
		if (Number.isInteger(divisor) && divisor >= 0)
			this.gl.vertexAttribDivisor(loc, divisor)
	})
	const bufferInfo = { buffer, loc, name, data, size }
	this.bufferList[name] = bufferInfo
	return bufferInfo
}

/////////////////////////////////////////////
// EXPORT ///////////////////////////////////

export default Olon
