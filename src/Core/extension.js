import Olon from "./main.js"

Olon.prototype.enableExtensions = function (requestExtensions) {
	requestExtensions.forEach((ext) => {
		if (!this.gl.getExtension(ext)) this.UNSUPPORTED_EXTENSIONS.push(ext)
		else this.SUPPORTED_EXTENSIONS.push(ext)
	})
	if (this.UNSUPPORTED_EXTENSIONS.length === 0) return true
	console.warn(
		"The following extensions are not supported:",
		this.UNSUPPORTED_EXTENSIONS.join(", ")
	)
	return false
}

Olon.prototype.enableFloat = function () {
	this.FLOAT_FORMAT_SUPPORT = this.enableExtensions([
		"EXT_color_buffer_float",
		"OES_texture_float_linear",
	])
	if (!this.FLOAT_FORMAT_SUPPORT) {
		console.warn(
			"Failed to enable float format. If encounter any errors, please try browsing the following resources:\n",
			"- https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear\n",
			"- https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float"
		)
	}
}

export default Olon
