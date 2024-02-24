import * as TypeMaps from "./TypeMaps.js"
import loadShader from "./loadShader.js"
import loadImage from "./loadImage.js"
import Data from "./Data.js"

export { loadShader, loadImage, Data }

class Olon {
	constructor(width = 300, height = 150) {
		this.frame = 0
		this.seconds = 0
		this.startTime = 0
		this.currentTime = performance.now()
		this.lastFrameTime = performance.now()
		this.fps = 60
		this.oMouseX = 0
		this.oMouseY = 0
		this.mouseX = 0
		this.mouseY = 0

		this.bufferList = {}

		this.canvas2D = null
		this.o2D = null

		this.canvas = document.createElement("canvas")
		;[this.canvas.width, this.canvas.height] = [width, height]
		this.canvas.id = "olon-canvas"
		document.body.appendChild(this.canvas)

		this.gl = this.canvas.getContext("webgl2")
		this.program = null

		/////////////////////////////////////////////
		// BLEND CONST //////////////////////////////
		this.BLEND_MODE = this.gl.FUNC_ADD
		this.BLEND_SFAC = this.gl.ONE
		this.BLEND_DFAC = this.gl.ZERO

		this.canvas.addEventListener("mousemove", (e) =>
			this._mouseMove(e, this.canvas)
		)
		this.canvas.addEventListener("touchmove", (e) =>
			this._touchMove(e, this.canvas)
		)

		this.UnitMap = TypeMaps.Unit
		this.IFormatMap = TypeMaps.IFormat
		this.UniformMap = TypeMaps.Uniform(this.gl)
	}

	/////////////////////////////////////////////
	// FEATURE //////////////////////////////////

	sketchData() {
		const positionData = Data([-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1])
		const texCoordData = Data([0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0])
		return { positionData, texCoordData }
	}

	quadData() {
		return Data([
			[-1, -1, 0, 0],
			[1, -1, 1, 0],
			[1, 1, 1, 1],
			[1, 1, 1, 1],
			[-1, 1, 0, 1],
			[-1, -1, 0, 0],
		])
	}

	sketch() {
		const { positionData, texCoordData } = this.sketchData()
		this.setAttribute("aPosition", positionData, "f32", 2)
		this.setAttribute("aTexCoord", texCoordData, "f32", 2)
	}

	fullscreen() {
		const { left, top } = this._getBorderSize(this.canvas)
		this.width = window.innerWidth - left * 2
		this.height = window.innerHeight - top * 2
		window.addEventListener("resize", () => {
			const { left, top } = this._getBorderSize(this.canvas)
			this.width = window.innerWidth - left * 2
			this.height = window.innerHeight - top * 2
		})
	}

	enableCanvas2D(color = "#000000") {
		this.canvas2D = document.createElement("canvas")
		;[this.canvas2D.width, this.canvas2D.height] = [
			this.canvas.width,
			this.canvas.height,
		]
		this.canvas2D.id = "o2d"
		document.body.appendChild(this.canvas2D)
		this.o2D = this.canvas2D.getContext("2d")

		this.o2D.fillStyle = color
		this.o2D.fillRect(0, 0, this.canvas2D.width, this.canvas2D.height)

		this.canvas.style.display = "none"

		this.canvas2D.addEventListener("mousemove", (e) =>
			this._mouseMove(e, this.canvas2D)
		)
		this.canvas2D.addEventListener("touchmove", (e) =>
			this._touchMove(e, this.canvas2D)
		)
	}

	render(renderFunc) {
		const animate = (timestamp) => {
			this.frame++
			this.timestamp = timestamp
			this.currentTime = performance.now()
			this.seconds = (this.currentTime - this.startTime) / 1000
			this.fps = 1000 / (this.currentTime - this.lastFrameTime)

			renderFunc()

			if (this.canvas2D) this.o2D.drawImage(this.canvas, 0, 0)

			this.lastFrameTime = this.currentTime
			requestAnimationFrame(animate)
		}

		this.startTime = performance.now()
		requestAnimationFrame(animate)
	}

	use(
		{
			program = null,
			VAO = null,
			FBO = null,
			RBO = null,
			texture2D = null,
			buffer = null,
			Depth = false,
			Blend = false,
		} = { program, VAO, FBO, RBO, texture2D, Depth, Blend }
	) {
		return {
			run: (callback) => {
				if (program) this.useProgram(program)
				if (VAO) this.bindVAO(VAO)
				if (FBO) this.bindFBO(FBO)
				if (RBO) this.bindRBO(RBO)
				if (texture2D) this.bindTexture2D(texture2D)
				if (buffer) this.bindBuffer(buffer)
				if (Depth) this.enableDepth()
				if (Blend) this.enableBlend()
				callback()
				if (Blend) this.disableBlend()
				if (Depth) this.disableDepth()
				if (buffer) this.unbindBuffer()
				if (texture2D) this.unbindTexture2D()
				if (RBO) this.unbindRBO()
				if (FBO) this.unbindFBO()
				if (VAO) this.unbindVAO()
			},
		}
	}

	/////////////////////////////////////////////
	// MOUSE ////////////////////////////////////

	_getBorderSize(canvas) {
		const style = window.getComputedStyle(canvas)
		const top = parseFloat(style.borderTopWidth) || 0
		const left = parseFloat(style.borderLeftWidth) || 0
		return { top, left }
	}

	_updateMouse(canvas, cx, cy) {
		this.oMouseX = cx / canvas.scrollWidth
		this.oMouseY = cy / canvas.scrollHeight
		this.oMouseY = canvas.height - this.oMouseY

		this.mouseX = (this.oMouseX / this.width) * 2 - 1
		this.mouseY = (this.oMouseY / this.height) * 2 - 1
	}

	_mouseMove(e, canvas) {
		const cx = e.offsetX * canvas.width
		const cy = e.offsetY * canvas.height
		this._updateMouse(canvas, cx, cy)
	}

	_touchMove(e, canvas) {
		e = e.touches ? e.touches[0] : e.changedTouches?.[0]
		const rect = canvas.getBoundingClientRect()
		const { left, top } = this._getBorderSize(canvas)
		const cx = (e.clientX - rect.left - left) * canvas.width
		const cy = (e.clientY - rect.top - top) * canvas.height
		this._updateMouse(canvas, cx, cy)
	}

	get oMouse() {
		return [this.oMouseX, this.oMouseY]
	}

	get mouse() {
		return [this.mouseX, this.mouseY]
	}

	/////////////////////////////////////////////
	// SHADER ///////////////////////////////////

	_shader(programObj, source, type) {
		const shader = this.gl.createShader(type)
		if (!/#version 300 es/.test(source)) source = `#version 300 es\n${source}`
		source = source.replace(/^\s+/, "")
		this.gl.shaderSource(shader, source)
		this.gl.compileShader(shader)
		this.gl.attachShader(programObj.program, shader)
	}

	_processShader(programObj, sources, type) {
		if (Array.isArray(sources))
			sources.forEach((source) => this._shader(programObj, source, type))
		else this._shader(programObj, sources, type)
	}

	setShader(vert, frag) {
		this.program = this.createProgram(vert, frag)
		this.linkProgram(this.program)
		this.useProgram(this.program)
	}

	/////////////////////////////////////////////
	// PROGRAM //////////////////////////////////

	setProgram(programObj) {
		this.program = programObj
	}

	linkProgram(programObj) {
		this.setProgram(programObj)
		this.gl.linkProgram(programObj.program)
	}

	useProgram(programObj) {
		this.setProgram(programObj)
		this.gl.useProgram(programObj.program)
	}

	_updateProgramUniforms(programObj, name, type, size) {
		programObj.uniforms[name] = { type, size }
	}

	createProgram(vsList, fsList, tfVaryings) {
		const program = this.gl.createProgram()
		const programObj = {
			program,
			uniforms: {},
			texUnitList: {},
			texUnitCount: 0,
			emptyTexUnits: [],
		}
		this._processShader(programObj, vsList, this.gl.VERTEX_SHADER)
		this._processShader(programObj, fsList, this.gl.FRAGMENT_SHADER)
		if (tfVaryings)
			this.gl.transformFeedbackVaryings(
				programObj.program,
				tfVaryings,
				this.gl.INTERLEAVED_ATTRIBS
			)
		this.linkProgram(programObj)
		this.useProgram(programObj)

		const numUniforms = this._getActiveUniforms(programObj)
		for (let i = 0; i < numUniforms; ++i) {
			const { name, type, size } = this._getActiveUniform(programObj, i)
			this._updateProgramUniforms(programObj, name, type, size)
			if (TypeMaps.samplerTypes.has(type)) this._setTexUnit(name)
		}
		return programObj
	}

	_setTexUnit(name) {
		const unitIndex = !this.program.emptyTexUnits.length
			? this.program.texUnitCount++
			: this.program.emptyTexUnits.pop()

		this.uniform(name, unitIndex)
		this.program.texUnitList[name] = unitIndex
	}

	_getActiveUniform(programObj, index) {
		const info = this.gl.getActiveUniform(programObj.program, index)
		return {
			name: info.name.replace(/\[[^\]]*\]/g, ""),
			type: info.type,
			size: info.size,
		}
	}

	/////////////////////////////////////////////
	// BUFFER USAGES ////////////////////////////

	STATIC_DRAW = 35044 // this.gl.STATIC_DRAW
	DYNAMIC_DRAW = 35048 // this.gl.DYNAMIC_DRAW
	STREAM_DRAW = 35040 // this.gl.STREAM_DRAW

	STATIC_READ = 35045 // this.gl.STATIC_READ
	DYNAMIC_READ = 35049 // this.gl.DYNAMIC_READ
	STREAM_READ = 35041 // this.gl.STREAM_READ

	STATIC_COPY = 35046 // this.gl.STATIC_COPY
	DYNAMIC_COPY = 35050 // this.gl.DYNAMIC_COPY
	STREAM_COPY = 35042 // this.gl.STREAM_COPY

	/////////////////////////////////////////////
	// BUFFER ///////////////////////////////////

	createBuffer(data, usage) {
		const buffer = this.gl.createBuffer()
		this.useBuffer(buffer, () => this.gl.bufferData(this.AB, data, usage))
		return buffer
	}

	bindBuffer(buffer) {
		this.gl.bindBuffer(this.AB, buffer)
	}

	unbindBuffer() {
		this.gl.bindBuffer(this.AB, null)
	}

	useBuffer(buffer, callback) {
		this.bindBuffer(buffer)
		callback()
		this.unbindBuffer()
	}

	/////////////////////////////////////////////
	// VAO //////////////////////////////////////

	_calcStride(attributes) {
		return attributes.reduce((acc, { unit, size }) => {
			return acc + size * this.UnitMap[unit].size
		}, 0)
	}

	_vaoByBufferInfos(programObj, bufferInfos) {
		if (!Array.isArray(bufferInfos)) bufferInfos = [bufferInfos]
		const vao = this.gl.createVertexArray()
		this.use({
			program: this.useProgram(programObj),
			VAO: vao,
		}).run(() => {
			bufferInfos.forEach((bufferInfo) => {
				this.useBuffer(bufferInfo.buffer, () => {
					const attributes = bufferInfo.attributes
					const stride = bufferInfo.stride || this._calcStride(attributes)
					const divisor = bufferInfo.divisor
					let offset = 0
					attributes.forEach(({ name, unit, size }) => {
						const loc = this.aLoc(name)
						const type = this.UnitMap[unit].type
						this.gl.vertexAttribPointer(loc, size, type, false, stride, offset)
						this.gl.enableVertexAttribArray(loc)
						offset += size * this.UnitMap[unit].size

						if (Number.isInteger(divisor) && divisor >= 0)
							this.gl.vertexAttribDivisor(loc, divisor)
					})
				})
			})
		})
		return vao
	}

	_vaoByAttribute(programObj, attributes) {
		this.useProgram(programObj)
		const vao = this.gl.createVertexArray()
		this.useVAO(vao, () => {
			attributes.forEach(({ name, data, size }) => {
				const unit = TypeMaps.TypeArrayUnit[data.constructor.name]
				this.setAttribute(name, data, unit, size)
			})
		})
		return vao
	}

	_checkUseAttribute(params) {
		return Array.isArray(params) && Object.hasOwn(params[0], "name")
	}

	createVAO(programObj, params) {
		if (this._checkUseAttribute(params))
			return this._vaoByAttribute(programObj, params)
		return this._vaoByBufferInfos(programObj, params)
	}

	bindVAO(vao) {
		this.gl.bindVertexArray(vao)
	}

	unbindVAO() {
		this.gl.bindVertexArray(null)
	}

	useVAO(vao, callback) {
		this.bindVAO(vao)
		callback()
		this.unbindVAO()
	}

	/////////////////////////////////////////////
	// RENDERBUFFER /////////////////////////////

	bindRBO(rbo) {
		this.gl.bindRenderbuffer(this.RB, rbo)
	}

	unbindRBO() {
		this.gl.bindRenderbuffer(this.RB, null)
	}

	useRBO(rbo, callback) {
		this.bindRBO(rbo)
		callback()
		this.unbindRBO()
	}

	/////////////////////////////////////////////
	// DEPTHBUFFER //////////////////////////////

	createDepthBuffer(width, height, depthComponent = 16) {
		const depthBuffer = this.gl.createRenderbuffer()
		this.useRBO(depthBuffer, () =>
			this.gl.renderbufferStorage(
				this.RB,
				depthComponent === 24
					? this.gl.DEPTH_COMPONENT24
					: depthComponent === 32
					? this.gl.DEPTH_COMPONENT32F
					: this.gl.DEPTH_COMPONENT16,
				width,
				height
			)
		)
		return depthBuffer
	}

	/////////////////////////////////////////////
	// FRAMEBUFFER //////////////////////////////

	bindFBO(fbo) {
		this.gl.bindFramebuffer(this.FB, fbo)
	}

	unbindFBO() {
		this.gl.bindFramebuffer(this.FB, null)
	}

	useFBO(fbo, callback) {
		this.bindFBO(fbo)
		callback()
		this.unbindFBO()
	}

	checkFramebufferStatus() {
		const status = this.gl.checkFramebufferStatus(this.FB)
		switch (status) {
			case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
				throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_ATTACHMENT"
			case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
				throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"
			case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
				throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_DIMENSIONS"
			case this.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
				throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"
			case this.gl.FRAMEBUFFER_UNSUPPORTED:
				throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_UNSUPPORTED"
			default:
				break
		}
	}

	// check
	createFBO({ program, outs, depthBuffer }) {
		const fbo = this.gl.createFramebuffer()
		this.useFBO(fbo, () => {
			const MAX_DRAW_BUFFERS = this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS)
			const COLOR_ATTACHMENTS = Array.from(
				{ length: MAX_DRAW_BUFFERS },
				() => this.gl.NONE
			)

			this.setProgram(program)
			outs.forEach(({ name, texture }) => {
				const loc = this.oLoc(name)
				const attachment = this.gl.COLOR_ATTACHMENT0 + loc
				COLOR_ATTACHMENTS[loc] = attachment
				this.gl.framebufferTexture2D(this.FB, attachment, this.T2D, texture, 0)
			})

			this.gl.framebufferRenderbuffer(this.FB, this.DA, this.RB, depthBuffer)
			this.gl.drawBuffers(COLOR_ATTACHMENTS)
			this.checkFramebufferStatus()
		})
		return fbo
	}

	/////////////////////////////////////////////
	// TRANSFORM FEEDBACK ///////////////////////

	transformFeedback(readVAO, writeBuffer, primMode, callback) {
		this.useVAO(readVAO, () => {
			this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, writeBuffer)
			this.gl.enable(this.gl.RASTERIZER_DISCARD)
			this.gl.beginTransformFeedback(primMode)
			callback()
			this.gl.endTransformFeedback()
			this.gl.disable(this.gl.RASTERIZER_DISCARD)
			this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
		})
	}

	/////////////////////////////////////////////
	// LOCATION /////////////////////////////////

	aLoc(name) {
		return this.gl.getAttribLocation(this.program.program, name)
	}

	uLoc(name) {
		return this.gl.getUniformLocation(this.program.program, name)
	}

	oLoc(name) {
		return this.gl.getFragDataLocation(this.program.program, name)
	}

	/////////////////////////////////////////////
	// UNIFORM //////////////////////////////////

	_getActiveUniforms(programObj) {
		return this.gl.getProgramParameter(
			programObj.program,
			this.gl.ACTIVE_UNIFORMS
		)
	}

	uniform(name, data) {
		const info = this.program.uniforms[name]
		if (!info) return

		if (Object.hasOwn(this.program.texUnitList, name)) {
			this.gl.activeTexture(this.gl.TEXTURE0 + this.program.texUnitList[name])
			this.gl.bindTexture(this.T2D, data)
			return
		}

		const loc = this.uLoc(name)
		this.UniformMap[info.type](loc, data)
	}

	initUniform(uniformInfos) {
		const uniforms = {}
		const entries = Object.entries(uniformInfos)
		for (const [name, type] of entries)
			uniforms[name] = (data) => this.uniform(type, name, data)
		return uniforms
	}

	/////////////////////////////////////////////
	// ATTRIBUTE ////////////////////////////////

	setAttribute(name, data, unit, size, divisor) {
		const loc = this.aLoc(name)
		const buffer = this.gl.createBuffer()
		const type = this.UnitMap[unit].type
		this.useBuffer(buffer, () => {
			this.gl.bufferData(this.AB, data, this.gl.STATIC_DRAW)
			this.gl.vertexAttribPointer(loc, size, type, false, 0, 0)
			this.gl.enableVertexAttribArray(loc)
			if (Number.isInteger(divisor) && divisor >= 0)
				this.gl.vertexAttribDivisor(loc, divisor)
		})
		const bufferInfo = { buffer, loc, name, data, size }
		this.bufferList[name] = bufferInfo
		return bufferInfo
	}

	/////////////////////////////////////////////
	// CLEAR ////////////////////////////////////

	COLOR_BUFF = 16384 // this.gl.COLOR_BUFFER_BIT
	DEPTH_BUFF = 256 // this.gl.DEPTH_BUFFER_BIT
	STENCIL_BUFF = 1024 // this.gl.STENCIL_BUFFER_BIT

	clear(mask) {
		this.gl.clear(mask)
	}

	clearColor(r, g, b, a) {
		if (arguments.length !== 0) this.gl.clearColor(r, g, b, a)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
	}

	clearDepth(depth) {
		if (arguments.length !== 0) this.gl.clearDepth(depth)
		this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
	}

	clearStencil(stencil) {
		if (arguments.length !== 0) this.gl.clearStencil(stencil)
		this.gl.clear(this.gl.STENCIL_BUFFER_BIT)
	}

	/////////////////////////////////////////////
	// PRIMITIVE ////////////////////////////////

	POINTS = 0 // this.gl.POINTS
	LINES = 1 // this.gl.LINES
	LINE_LOOP = 2 // this.gl.LINE_LOOP
	LINE_STRIP = 3 // this.gl.LINE_STRIP
	TRIANGLES = 4 // this.gl.TRIANGLES
	TRIANGLE_STRIP = 5 // this.gl.TRIANGLE_STRIP
	TRIANGLE_FAN = 6 // this.gl.TRIANGLE_FAN

	drawArrays(primMode, first, count) {
		this.gl.drawArrays(primMode, first, count)
	}

	points(first, count) {
		this.gl.drawArrays(this.POINTS, first, count)
	}

	lines(first, count) {
		this.gl.drawArrays(this.LINES, first, count)
	}

	lineLoop(first, count) {
		this.gl.drawArrays(this.LINE_LOOP, first, count)
	}

	lineStrip(first, count) {
		this.gl.drawArrays(this.LINE_STRIP, first, count)
	}

	triangles(first, count) {
		this.gl.drawArrays(this.TRIANGLES, first, count)
	}

	triangleStrip(first, count) {
		this.gl.drawArrays(this.TRIANGLE_STRIP, first, count)
	}

	triangleFan(first, count) {
		this.gl.drawArrays(this.TRIANGLE_FAN, first, count)
	}

	drawArraysInstanced(primMode, first, count, instanceCount) {
		this.gl.drawArraysInstanced(primMode, first, count, instanceCount)
	}

	pointsInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.POINTS, first, count, instanceCount)
	}

	linesInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.LINES, first, count, instanceCount)
	}

	lineLoopInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.LINE_LOOP, first, count, instanceCount)
	}

	lineStripInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.LINE_STRIP, first, count, instanceCount)
	}

	trianglesInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.TRIANGLES, first, count, instanceCount)
	}

	triangleStripInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.TRIANGLE_STRIP, first, count, instanceCount)
	}

	triangleFanInstanced(first, count, instanceCount) {
		this.drawArraysInstanced(this.TRIANGLE_FAN, first, count, instanceCount)
	}

	/////////////////////////////////////////////
	// TEXTURE //////////////////////////////////

	_isDOMElement(texture) {
		return texture instanceof HTMLElement ? true : false
	}

	setTexParameter(wrapX, wrapY, minFilter, magFilter) {
		this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_S, wrapX)
		this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_T, wrapY)
		this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MIN_FILTER, minFilter)
		this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MAG_FILTER, magFilter)
	}

	bindTexture2D(texture) {
		this.gl.bindTexture(this.T2D, texture)
	}

	unbindTexture2D() {
		this.gl.bindTexture(this.T2D, null)
	}

	useTexture2D(texture, callback) {
		this.bindTexture2D(texture)
		callback()
		this.unbindTexture2D()
	}

	emptyTexture2D(
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

	texture2D(
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

	/////////////////////////////////////////////
	// WRAP MODE ////////////////////////////////

	REPEAT = 10497 // this.gl.REPEAT
	CLAMP = 33071 // this.gl.CLAMP_TO_EDGE
	MIRROR = 33648 // this.gl.MIRRORED_REPEAT

	/////////////////////////////////////////////
	// MIN & MAG FILTER MODE ////////////////////

	NEAREST = 9728 // this.gl.NEAREST
	LINEAR = 9729 // this.gl.LINEAR
	NMN = 9984 // this.gl.NEAREST_MIPMAP_NEAREST
	LMN = 9985 // this.gl.LINEAR_MIPMAP_NEAREST
	NML = 9986 // this.gl.NEAREST_MIPMAP_LINEAR
	LML = 9987 // this.gl.LINEAR_MIPMAP_LINEAR

	/////////////////////////////////////////////
	// DEPTH ////////////////////////////////////

	enableDepth() {
		this.gl.enable(this.gl.DEPTH_TEST)
	}

	disableDepth() {
		this.gl.disable(this.gl.DEPTH_TEST)
	}

	useDepth(callback) {
		this.gl.enable(this.gl.DEPTH_TEST)
		callback()
		this.gl.disable(this.gl.DEPTH_TEST)
	}

	/////////////////////////////////////////////
	// BLEND ////////////////////////////////////

	enableBlend() {
		this.gl.enable(this.gl.BLEND)
	}

	disableBlend() {
		this.gl.disable(this.gl.BLEND)
	}

	blend(
		{
			sfactor = this.BLEND_SFAC,
			dfactor = this.BLEND_DFAC,
			mode = this.BLEND_MODE,
		} = { sfactor, dfactor, mode }
	) {
		this.BLEND_SFAC = sfactor
		this.BLEND_DFAC = dfactor
		this.BLEND_MODE = mode
		this.gl.blendEquation(this.BLEND_MODE)
		this.gl.blendFunc(this.BLEND_SFAC, this.BLEND_DFAC)
	}

	/////////////////////////////////////////////
	// UTILS ////////////////////////////////////

	FB = 36160 // this.gl.FRAMEBUFFER
	T2D = 3553 // this.gl.TEXTURE_2D
	RB = 36161 // this.gl.RENDERBUFFER
	DA = 36096 // this.gl.DEPTH_ATTACHMENT
	AB = 34962 // this.gl.ARRAY_BUFFER

	/////////////////////////////////////////////
	// BLEND MODE ///////////////////////////////

	ADD = 32774 // this.gl.FUNC_ADD
	SUB = 32778 // this.gl.FUNC_SUBTRACT
	REV_SUB = 32779 // this.gl.FUNC_REVERSE_SUBTRACT
	MIN = 32775 // this.gl.MIN
	MAX = 32776 // this.gl.MAX

	/////////////////////////////////////////////
	// BLEND FACTOR /////////////////////////////

	ZERO = 0 // this.gl.ZERO
	ONE = 1 // this.gl.ONE
	SRC_COLOR = 768 // this.gl.SRC_COLOR
	ONE_MINUS_SRC_COLOR = 769 // this.gl.ONE_MINUS_SRC_COLOR
	DST_COLOR = 774 // this.gl.DST_COLOR
	ONE_MINUS_DST_COLOR = 775 // this.gl.ONE_MINUS_DST_COLOR
	SRC_ALPHA = 770 // this.gl.SRC_ALPHA
	ONE_MINUS_SRC_ALPHA = 771 // this.gl.ONE_MINUS_SRC_ALPHA
	DST_ALPHA = 772 // this.gl.DST_ALPHA
	ONE_MINUS_DST_ALPHA = 773 // this.gl.ONE_MINUS_DST_ALPHA
	CONSTANT_COLOR = 32769 // this.gl.CONSTANT_COLOR
	ONE_MINUS_CONSTANT_COLOR = 32770 // this.gl.ONE_MINUS_CONSTANT_COLOR
	CONSTANT_ALPHA = 32771 // this.gl.CONSTANT_ALPHA
	ONE_MINUS_CONSTANT_ALPHA = 32772 // this.gl.ONE_MINUS_CONSTANT_ALPHA
	SRC_ALPHA_SATURATE = 776 // this.gl.SRC_ALPHA_SATURATE

	/////////////////////////////////////////////
	// INTERNAL FORMAT //////////////////////////

	RGB = 6407 // this.gl.RGB
	RGBA = 6408 // this.gl.RGBA
	LUMINANCE_ALPHA = 6410 // this.gl.LUMINANCE_ALPHA
	LUMINANCE = 6409 // this.gl.LUMINANCE
	ALPHA = 6406 // this.gl.ALPHA
	R8 = 33321 // this.gl.R8
	R16F = 33325 // this.gl.R16F
	R32F = 33326 // this.gl.R32F
	R8UI = 33330 // this.gl.R8UI
	RG8 = 33323 // this.gl.RG8
	RG16F = 33327 // this.gl.RG16F
	RG32F = 33328 // this.gl.RG32F
	RG8UI = 33336 // this.gl.RG8UI
	RGB8 = 32849 // this.gl.RGB8
	SRGB8 = 35905 // this.gl.SRGB8
	RGB565 = 36194 // this.gl.RGB565
	R11F_G11F_B10F = 35898 // this.gl.R11F_G11F_B10F
	RGB9_E5 = 35901 // this.gl.RGB9_E5
	RGB16F = 34843 // this.gl.RGB16F
	RGB32F = 34837 // this.gl.RGB32F
	RGB8UI = 36221 // this.gl.RGB8UI
	RGBA8 = 32856 // this.gl.RGBA8
	SRGB8_ALPHA8 = 35907 // this.gl.SRGB8_ALPHA8
	RGB5_A1 = 32855 // this.gl.RGB5_A1
	RGB10_A2 = 32857 // this.gl.RGB10_A2
	RGBA4 = 32854 // this.gl.RGBA4
	RGBA16F = 34842 // this.gl.RGBA16F
	RGBA32F = 34836 // this.gl.RGBA32F
	RGBA8UI = 36220 // this.gl.RGBA8UI

	/////////////////////////////////////////////
	// GET INFOMATION ///////////////////////////

	get limit() {
		return {
			TOTAL_TEXTURES: this.MAX_TEXTURES,
			FRAG_TEXTURE: this.MAX_FRAG_TEXTURES,
			VERT_TEXTURE: this.MAX_VERT_TEXTURES,
			DRAW_BUFFERS: this.MAX_DRAW_BUFFERS,
		}
	}

	get MAX_TEXTURES() {
		return this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
	}

	get MAX_FRAG_TEXTURES() {
		return this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS)
	}

	get MAX_VERT_TEXTURES() {
		return this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
	}

	get MAX_DRAW_BUFFERS() {
		return this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS)
	}

	get width() {
		return this.canvas.width
	}

	get height() {
		return this.canvas.height
	}

	set width(w) {
		if (this.canvas2D) this.canvas2D.width = w
		this.canvas.width = w
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
	}

	set height(h) {
		if (this.canvas2D) this.canvas2D.height = h
		this.canvas.height = h
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
	}

	get resolution() {
		return [this.canvas.width, this.canvas.height]
	}
}

export default (width, height) => new Olon(width, height)
