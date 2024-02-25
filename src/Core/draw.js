import Olon from "./main.js"

Olon.prototype.drawArrays = function (primMode, first, count) {
	this.gl.drawArrays(primMode, first, count)
}

Olon.prototype.points = function (first, count) {
	this.gl.drawArrays(this.gl.POINTS, first, count)
}

Olon.prototype.lines = function (first, count) {
	this.gl.drawArrays(this.gl.LINES, first, count)
}

Olon.prototype.lineLoop = function (first, count) {
	this.gl.drawArrays(this.gl.LINE_LOOP, first, count)
}

Olon.prototype.lineStrip = function (first, count) {
	this.gl.drawArrays(this.gl.LINE_STRIP, first, count)
}

Olon.prototype.triangles = function (first, count) {
	this.gl.drawArrays(this.gl.TRIANGLES, first, count)
}

Olon.prototype.triangleStrip = function (first, count) {
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, first, count)
}

Olon.prototype.triangleFan = function (first, count) {
	this.gl.drawArrays(this.gl.TRIANGLE_FAN, first, count)
}

/////////////////////////////////////////////
// DRAW ARRAYS INSTANCED ////////////////////

Olon.prototype.drawArraysInstanced = function (
	primMode,
	first,
	count,
	instanceCount
) {
	this.gl.drawArraysInstanced(primMode, first, count, instanceCount)
}

Olon.prototype.pointsInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.POINTS, first, count, instanceCount)
}

Olon.prototype.linesInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.LINES, first, count, instanceCount)
}

Olon.prototype.lineLoopInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.LINE_LOOP, first, count, instanceCount)
}

Olon.prototype.lineStripInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.LINE_STRIP, first, count, instanceCount)
}

Olon.prototype.trianglesInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.TRIANGLES, first, count, instanceCount)
}

Olon.prototype.triangleStripInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(
		this.gl.TRIANGLE_STRIP,
		first,
		count,
		instanceCount
	)
}

Olon.prototype.triangleFanInstanced = function (first, count, instanceCount) {
	this.gl.drawArraysInstanced(this.gl.TRIANGLE_FAN, first, count, instanceCount)
}

export default Olon
