import Olon from "../Core/main.js"

Olon.prototype._isDOMElement = function (texture) {
	return texture instanceof HTMLElement ? true : false
}

Olon.prototype.setTexParameter = function (wrapX, wrapY, minFilter, magFilter) {
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_S, wrapX)
	this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_T, wrapY)
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

Olon.prototype.emptyTexture2D = function (
	width,
	height,
	iformat,
	{
		minFilter = this.NML,
		magFilter = this.LINEAR,
		filter = undefined,
		wrapX = this.REPEAT,
		wrapY = this.REPEAT,
		wrap = undefined,
		flipY = false,
	} = {}
) {
	if (filter) [minFilter, magFilter] = [filter, filter]
	if (wrap) [wrapX, wrapY] = [wrap, wrap]
	const texture = this.gl.createTexture()
	this.useTexture2D(texture, () => {
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY)
		this.setTexParameter(wrapX, wrapY, minFilter, magFilter)
		this.gl.texStorage2D(this.T2D, 1, iformat, width, height)
	})
	return texture
}

Olon.prototype.texture2D = function (
	{
		data = null,
		iformat,
		level = 0,
		width,
		height,
		minFilter = this.NML,
		magFilter = this.LINEAR,
		filter = undefined,
		wrapX = this.REPEAT,
		wrapY = this.REPEAT,
		wrap = undefined,
		flipY = this._isDOMElement(data),
	} = {
		data,
		iformat,
		level,
		width,
		height,
		minFilter,
		magFilter,
		filter,
		wrapX,
		wrapY,
		wrap,
		flipY,
	}
) {
	if (!width) width = data?.width
	if (!height) height = data?.height
	if (!width) throw "Please specify width."
	if (!height) throw "Please specify height."
	if (filter) [minFilter, magFilter] = [filter, filter]
	if (wrap) [wrapX, wrapY] = [wrap, wrap]

	// create empty texture
	// prettier-ignore
	if (!data) return this.emptyTexture2D(width, height, { minFilter, magFilter, wrapX, wrapY })

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
	this.setTexParameter(wrapX, wrapY, minFilter, magFilter)
	this.gl.bindTexture(this.T2D, null)
	return texture
}

export default Olon
