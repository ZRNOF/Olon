class Olon {
	constructor(width = 300, height = 150, ATTACH_TO_2D = false) {
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
		this.isLooping = true
		this._renderFunc = () => {}
		this._isSave = false
		this._canvasToSave = null
		this._saveName = "untitled.png"
		this.FLOAT_FORMAT_SUPPORT = false
		this.SUPPORTED_EXTENSIONS = []
		this.UNSUPPORTED_EXTENSIONS = []

		this.bufferList = {}

		this.ATTACH_TO_2D = ATTACH_TO_2D

		this.canvas2D = null
		this.o2D = null
		this._initCanvas2D(width, height)

		this.canvas = null
		this.gl = null
		this._initCanvas(width, height)

		this._enableCanvas2D()

		this.program = null

		this.canvas.addEventListener("mousemove", (e) =>
			this._mouseMove(e, this.canvas)
		)
		this.canvas.addEventListener("touchmove", (e) =>
			this._touchMove(e, this.canvas)
		)
	}

	/////////////////////////////////////////////
	// FEATURE //////////////////////////////////

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

	_initCanvas(width, height) {
		this.canvas = document.createElement("canvas")
		;[this.canvas.width, this.canvas.height] = [width, height]
		this.canvas.id = "olon-canvas"
		document.body.appendChild(this.canvas)
		this.gl = this.canvas.getContext("webgl2")
		this.canvas.style.display = "block"
	}

	_initCanvas2D(width, height) {
		if (!this.ATTACH_TO_2D) return
		this.canvas2D = document.createElement("canvas")
		;[this.canvas2D.width, this.canvas2D.height] = [width, height]
		this.canvas2D.id = "o2d"
		document.body.appendChild(this.canvas2D)
		this.o2D = this.canvas2D.getContext("2d")
		this.canvas2D.style.display = "none"
	}

	_enableCanvas2D() {
		if (!this.ATTACH_TO_2D) return
		this.canvas.style.display = "none"
		this.canvas2D.style.display = "block"

		this.canvas2D.addEventListener("mousemove", (e) =>
			this._mouseMove(e, this.canvas2D)
		)
		this.canvas2D.addEventListener("touchmove", (e) =>
			this._touchMove(e, this.canvas2D)
		)
	}

	_save() {
		this._isSave = false
		let extension = "png"
		if (this._saveName) {
			const parts = this._saveName.split(".")
			if (parts.length > 1) {
				extension = parts[parts.length - 1].toLowerCase()
				if (!["png", "jpg", "jpeg"].includes(extension)) extension = "png"
			}
		}

		const tempCanvas = document.createElement("canvas")
		tempCanvas.width = this._canvasToSave.width
		tempCanvas.height = this._canvasToSave.height

		const tempCtx = tempCanvas.getContext("2d")
		tempCtx.drawImage(this._canvasToSave, 0, 0)

		tempCanvas.toBlob(
			(blob) => {
				const link = document.createElement("a")
				link.href = URL.createObjectURL(blob)
				link.download = this._saveName
				link.click()
				URL.revokeObjectURL(link.href)
			},
			["jpg", "jpeg"].includes(extension) ? "image/jpeg" : "image/png"
		)
	}

	save(filename) {
		this._isSave = true
		this._canvasToSave = this.ATTACH_TO_2D ? this.canvas2D : this.canvas
		this._saveName = filename
		if (!this.isLooping) {
			!this.ATTACH_TO_2D && this._renderFunc()
			this._save()
		}
	}

	saveCanvas(canvas, filename) {
		this._isSave = true
		this._canvasToSave = canvas
		this._saveName = filename
		if (!this.isLooping) {
			!this.ATTACH_TO_2D && this._renderFunc()
			this._save()
		}
	}

	render(renderFunc) {
		this._renderFunc = renderFunc

		const animate = (timestamp) => {
			this.frame++
			this.timestamp = timestamp
			this.currentTime = performance.now()
			this.seconds = (this.currentTime - this.startTime) / 1000
			this.fps = 1000 / (this.currentTime - this.lastFrameTime)

			this._renderFunc()

			if (this.canvas2D) this.o2D.drawImage(this.canvas, 0, 0)
			if (this._isSave) this._save()

			this.lastFrameTime = this.currentTime
			this.isLooping && requestAnimationFrame(animate)
		}

		this.pause = () => (this.isLooping = false)
		this.play = () => {
			if (!this.isLooping) {
				this.isLooping = true
				requestAnimationFrame(animate)
			}
		}
		this.toggle = () => {
			this.isLooping = !this.isLooping
			this.isLooping && requestAnimationFrame(animate)
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
	// GET INFOMATION ///////////////////////////

	get oMouse() {
		return [this.oMouseX, this.oMouseY]
	}

	get mouse() {
		return [this.mouseX, this.mouseY]
	}

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

export default Olon
