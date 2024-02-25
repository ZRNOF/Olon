import Olon from "../Core/main.js"

Olon.prototype._getBorderSize = function (canvas) {
	const style = window.getComputedStyle(canvas)
	const top = parseFloat(style.borderTopWidth) || 0
	const left = parseFloat(style.borderLeftWidth) || 0
	return { top, left }
}

Olon.prototype._updateMouse = function (canvas, cx, cy) {
	this.oMouseX = cx / canvas.scrollWidth
	this.oMouseY = cy / canvas.scrollHeight
	this.oMouseY = canvas.height - this.oMouseY

	this.mouseX = (this.oMouseX / this.width) * 2 - 1
	this.mouseY = (this.oMouseY / this.height) * 2 - 1
}

Olon.prototype._mouseMove = function (e, canvas) {
	const cx = e.offsetX * canvas.width
	const cy = e.offsetY * canvas.height
	this._updateMouse(canvas, cx, cy)
}

Olon.prototype._touchMove = function (e, canvas) {
	e = e.touches ? e.touches[0] : e.changedTouches?.[0]
	const rect = canvas.getBoundingClientRect()
	const { left, top } = this._getBorderSize(canvas)
	const cx = (e.clientX - rect.left - left) * canvas.width
	const cy = (e.clientY - rect.top - top) * canvas.height
	this._updateMouse(canvas, cx, cy)
}

export default Olon
