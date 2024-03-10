import Olon from "./main.js"

Olon.prototype.enableExtensions = function (reqExt) {
	const unsExt = reqExt.filter((ext) => !this.gl.getExtension(ext))
	if (unsExt.length === 0) return true
	console.warn(
		"enableFloat: The following extensions are not supported:",
		unsExt.join(", ")
	)
	return unsExt
}

Olon.prototype.enableFloat = function () {
	this.enableExtensions(["EXT_color_buffer_float", "OES_texture_float_linear"])
}

export default Olon
