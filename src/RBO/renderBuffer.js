import Olon from "../Core/main.js"

Olon.prototype.bindRBO = function (rbo) {
	this.gl.bindRenderbuffer(this.RB, rbo)
}

Olon.prototype.unbindRBO = function () {
	this.gl.bindRenderbuffer(this.RB, null)
}

Olon.prototype.useRBO = function (rbo, callback) {
	this.bindRBO(rbo)
	callback()
	this.unbindRBO()
}

export default Olon
