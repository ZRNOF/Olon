import Olon from "../Core/main.js"

Olon.prototype.quadData = function () {
	return this.Data([
		[-1, -1, 0, 0],
		[1, -1, 1, 0],
		[1, 1, 1, 1],
		[1, 1, 1, 1],
		[-1, 1, 0, 1],
		[-1, -1, 0, 0],
	])
}

/////////////////////////////////////////////
// [*] REFACTOR /////////////////////////////
Olon.prototype.quadBufferInfo = function (
	positionName = "aPosition",
	texCoordName = "aTexCoord"
) {
	return {
		buffer: this.createBuffer(this.quadData(), this.STATIC_DRAW),
		stride: 4 * 4,
		attributes: [
			{ name: positionName, unit: "f32", size: 2 },
			{ name: texCoordName, unit: "f32", size: 2 },
		],
	}
}

Olon.prototype.sketchData = function () {
	const positionData = this.Data([-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1])
	const texCoordData = this.Data([0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0])
	return { positionData, texCoordData }
}

export default Olon
