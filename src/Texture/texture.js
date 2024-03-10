import Olon from "../Core/main.js"

Olon.prototype._isDOMElement = function (texture) {
	return texture instanceof HTMLElement ? true : false
}

Olon.prototype.setTexParameter = function (wrapS, wrapT, minFilter, magFilter) {
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_S, wrapS)
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_T, wrapT)
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MIN_FILTER, minFilter)
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MAG_FILTER, magFilter)
}

Olon.prototype.bindTexture2D = function (texture) {
	this.gl.bindTexture(this.T2D, texture)
}

Olon.prototype.unbindTexture2D = function () {
	this.gl.bindTexture(this.T2D, null)
}

Olon.prototype.useTexture2D = function (texture, callback) {
	this.bindTexture2D(texture)
	callback()
	this.unbindTexture2D()
}

Olon.prototype._emptyTexStorage2D = function ({
	width = this.width,
	height = this.height,
	iformat = undefined,
	minFilter = this.LINEAR,
	magFilter = this.LINEAR,
	filter = undefined,
	wrapS = this.REPEAT,
	wrapT = this.REPEAT,
	wrap = undefined,
	flipY = false,
} = {}) {
	if (!iformat)
		throw "_emptyTexStorage2D: Please specify iformat (internalformat)."
	if (filter) [minFilter, magFilter] = [filter, filter]
	if (wrap) [wrapS, wrapT] = [wrap, wrap]
	const texture = this.gl.createTexture()
	this.useTexture2D(texture, () => {
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY)
		this.setTexParameter(wrapS, wrapT, minFilter, magFilter)
		this.gl.texStorage2D(this.T2D, 1, iformat, width, height)
	})
	return texture
}

Olon.prototype._emptyTexImage2D = function ({
	width = this.width,
	height = this.height,
	iformat = undefined,
	minFilter = this.LINEAR,
	magFilter = this.LINEAR,
	filter = undefined,
	wrapS = this.REPEAT,
	wrapT = this.REPEAT,
	wrap = undefined,
	flipY = false,
} = {}) {
	if (!iformat)
		throw "_emptyTexImage2D: Please specify iformat (internalformat)."
	if (filter) [minFilter, magFilter] = [filter, filter]
	if (wrap) [wrapS, wrapT] = [wrap, wrap]
	const { format, type } = this.IFormatMap[iformat]
	const texture = this.gl.createTexture()
	this.useTexture2D(texture, () => {
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY)
		this.setTexParameter(wrapS, wrapT, minFilter, magFilter)
		this.gl.texImage2D(
			this.T2D,
			0,
			iformat,
			width,
			height,
			0,
			format,
			type,
			null
		)
	})
	return texture
}

Olon.prototype.texture2D = function ({
	data = null,
	iformat = undefined,
	level = 0,
	width = data?.width || this.width,
	height = data?.height || this.height,
	minFilter = this.LINEAR,
	magFilter = this.LINEAR,
	filter = undefined,
	wrapS = this.REPEAT,
	wrapT = this.REPEAT,
	wrap = undefined,
	flipY = this._isDOMElement(data),
	immutableStorage = false,
} = {}) {
	if (!iformat) throw "texture2D: Please specify iformat (internalformat)."

	// create empty texture
	if (!data) {
		// prettier-ignore
		const options = { width, height, iformat, minFilter, magFilter, filter, wrapS, wrapT, wrap, flipY }
		return immutableStorage
			? this._emptyTexStorage2D(options)
			: this._emptyTexImage2D(options)
	}

	if (filter) [minFilter, magFilter] = [filter, filter]
	if (wrap) [wrapS, wrapT] = [wrap, wrap]

	const { format, type } = this.IFormatMap[iformat]
	const texture = this.gl.createTexture()
	this.gl.bindTexture(this.T2D, texture)
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY)
	this.gl.texImage2D(
		this.T2D,
		level,
		iformat,
		width,
		height,
		0,
		format,
		type,
		data
	)
	this.gl.generateMipmap(this.T2D)
	this.setTexParameter(wrapS, wrapT, minFilter, magFilter)
	this.gl.bindTexture(this.T2D, null)
	return texture
}

export default Olon
