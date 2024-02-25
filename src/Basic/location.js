import Olon from "../Core/main.js"

Olon.prototype.aLoc = function (name) {
	return this.gl.getAttribLocation(this.program.program, name)
}

Olon.prototype.uLoc = function (name) {
	return this.gl.getUniformLocation(this.program.program, name)
}

Olon.prototype.oLoc = function (name) {
	return this.gl.getFragDataLocation(this.program.program, name)
}

export default Olon
