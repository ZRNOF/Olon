import Olon from "../Core/main.js"

/**
 * Modified from p5.flex:
 *   https://github.com/ZRNOF/p5.flex
 *
 * MIT License
 * Copyright © 2024 Zaron
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

Olon.prototype.CONTAIN = "contain"
Olon.prototype.COVER = "cover"
Olon.prototype.FILL = "fill"
Olon.prototype.NONE = "none"
Olon.prototype.SCALE_DOWN = "scale_down"

// common CSS style
const RESET_BOX_MODEL = `padding: 0; margin: 0; border: 0;`
const FULL_SIZE = `width: 100%; height: 100%;`
const FLEX_CENTER = `display: flex; justify-content: center; align-items: center;`
const BORDER_BOX = `box-sizing: border-box;`
const STATIC = `position: static;`
const HIDDEN = `overflow: hidden;`
const BLOCK = `display: block;`

const __flexStyle__ = {
	pageCSS: () => {
		const html = document.documentElement
		const body = document.body
		html.className = ""
		body.className = ""
		html.style.cssText = RESET_BOX_MODEL + FULL_SIZE
		body.style.cssText = RESET_BOX_MODEL + FULL_SIZE + FLEX_CENTER
	},
	containerCSS: (container, OPTIONS) => {
		let boxModel = ""
		if (!OPTIONS.container.customBoxModel)
			boxModel = `
				margin:  ${OPTIONS.container.margin} ;
				padding: ${OPTIONS.container.padding};
				border:  ${OPTIONS.container.border} ;
			`
		container.style.cssText = `
			max-width:  ${OPTIONS.container.width};
			max-height: ${OPTIONS.container.height};
			width:  ${OPTIONS.container.width};
			height: ${OPTIONS.container.height};
			${BORDER_BOX + FLEX_CENTER + boxModel}
		`
	},
	canvasScaleCSS: (OPTIONS) => {
		return `
			max-width:  ${100 * OPTIONS.canvas.scale}%;
			max-height: ${100 * OPTIONS.canvas.scale}%;
		`
	},
	// for COVER | NONE mode
	innerContainerCSS: (innerContainer, OPTIONS) => {
		const scale = __flexStyle__.canvasScaleCSS(OPTIONS)
		let style = scale + STATIC + FLEX_CENTER + HIDDEN
		if (OPTIONS.canvas.fit === "cover") style += FULL_SIZE
		innerContainer.style.cssText = style
	},
	canvasCSS: (canvas, OPTIONS) => {
		const fit = OPTIONS.canvas.fit
		let fitStyle = __flexStyle__.canvasScaleCSS(OPTIONS)
		if (["cover", "none"].includes(fit)) fitStyle = ""
		if (fit === "fill") fitStyle += FULL_SIZE
		canvas.style.cssText = `
			${STATIC + RESET_BOX_MODEL + BORDER_BOX + fitStyle + BLOCK}
		`
	},
}

// provide margin, padding, and border for the container
// using .style to access padding is faster than using getComputedStyle
//
// in default mode (customBoxModel === false), users cannot use percentage in padding
// because it requires computing the padding value every time the container is resized or the aspect ratio changes
//
// setting customBoxModel to true allows user to use sheet style, but it will use getComputedStyle
// in this mode, users can use percentage in padding
const DEFAULT_OPTIONS = {
	container: {
		id: undefined,
		parent: undefined,
		width: "100%",
		height: "100%",
		margin: "0",
		padding: "0",
		border: "0",
		customBoxModel: false,
	},
	canvas: {
		scale: 1,
		fit: "contain",
	},
	stylePage: true,
}

// merge DEFAULT_OPTIONS & custom options
const mergeOptions = (defaultOpts, userOpts) => {
	return {
		...defaultOpts,
		...userOpts,
		container: {
			...defaultOpts.container,
			...userOpts.container,
		},
		canvas: {
			...defaultOpts.canvas,
			...userOpts.canvas,
		},
	}
}

// flex main function
Olon.prototype.flex = function (options = {}) {
	const canvas = this.ATTACH_TO_2D ? this.canvas2D : this.canvas
	const OPTIONS = mergeOptions(DEFAULT_OPTIONS, options)
	const fit = OPTIONS.canvas.fit ?? "contain"
	const customBoxModel = OPTIONS.container.customBoxModel

	// style html and body if stylePage set to true
	if (OPTIONS.stylePage) __flexStyle__.pageCSS()

	// set container parent
	const parent = OPTIONS.container.parent ?? document.body
	OPTIONS.container.parent = parent

	// create flex-container
	const container = document.createElement("div")
	const id = OPTIONS.container.id ?? `flex-container-${canvas.id}`
	container.id = OPTIONS.container.id = id
	canvas.container = container

	// style flex-container and append it to specified parent or body
	__flexStyle__.containerCSS(container, OPTIONS)
	container.classList.add("flex-container")
	parent.appendChild(container)

	// create inner container, only in COVER | NONE mode
	// because COVER and NONE modes utilize CSS overflow hidden
	// container -> inner container -> canvas
	let innerContainer
	if (["cover", "none"].includes(fit)) {
		innerContainer = document.createElement("div")
		__flexStyle__.innerContainerCSS(innerContainer, OPTIONS)
		container.appendChild(innerContainer)
	}

	// calculate vertical and horizontal padding values
	// paddingVer and paddingHor will be used in the stretchToContain function
	// to calculate the correct container width and height
	const calcPadding = () => {
		const containerStyle = customBoxModel
			? getComputedStyle(container) // user custom sheet style
			: container.style // faster
		const padding = (side) => parseFloat(containerStyle[`padding${side}`])
		const paddingVer = padding("Top") + padding("Bottom")
		const paddingHor = padding("Left") + padding("Right")
		return [paddingVer, paddingHor]
	}
	let [paddingVer, paddingHor] = calcPadding()

	// store last resized element, "container" | "canvas"
	let resizedElement = ""

	// store stretch side, "width" | "height"
	let stretchSide = ""

	// stretch & stretchToContain only in CONTAIN | COVER mode
	// one direction (either width or height) needs to stretch to fit the container
	// to keep the aspect ratio, the other direction does not need to stretch
	const stretch = (side) => {
		if (resizedElement === "container" && stretchSide === side) return
		stretchSide = side
		canvas.style.width = side === "width" ? "100%" : ""
		canvas.style.height = side === "height" ? "100%" : ""
	}
	const stretchToContain = () => {
		requestAnimationFrame(() => {
			if (customBoxModel) [paddingVer, paddingHor] = calcPadding()

			const containerW = container.clientWidth - paddingHor
			const containerH = container.clientHeight - paddingVer
			const containerAR = containerW / containerH
			const canvasAR = canvas.width / canvas.height

			if (containerAR >= canvasAR) {
				if (fit === "contain") stretch("height")
				if (fit === "cover") stretch("width")
			} else {
				if (fit === "contain") stretch("width")
				if (fit === "cover") stretch("height")
			}
		})
	}

	// set ResizeObserver for the container
	if (["contain", "cover"].includes(fit)) {
		new ResizeObserver(() => {
			resizedElement = "container"
			stretchToContain()
		}).observe(container)
	}

	// style canvas and append it to flex-container
	__flexStyle__.canvasCSS(canvas, OPTIONS)
	if (["cover", "none"].includes(fit)) {
		innerContainer.classList.add("flex-canvas")
		innerContainer.appendChild(canvas)
		this.ATTACH_TO_2D && innerContainer.appendChild(this.canvas)
	} else {
		canvas.classList.add("flex-canvas")
		container.appendChild(canvas)
		this.ATTACH_TO_2D && container.appendChild(this.canvas)
	}
}

export default Olon
