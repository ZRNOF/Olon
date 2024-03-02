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

Olon.prototype.sketchData = function () {
	const positionData = this.Data([-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1])
	const texCoordData = this.Data([0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0])
	return { positionData, texCoordData }
}

export default Olon
