const loadImage = (src) =>
	new Promise((resolve, reject) => {
		const image = new Image()
		image.addEventListener("load", () => resolve(image))
		image.addEventListener("error", (error) => {
			reject(new Error(`Error loading image from ${src}: ${error.message}`))
		})
		image.crossOrigin = "anonymous"
		image.src = src
	})

const loadWebcam = async () => {
	const webcam = document.createElement("video")
	try {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true })
			webcam.srcObject = stream
			webcam.setAttribute("playsinline", "")
			webcam.play()
			return webcam
		} else {
			console.error(
				"Your browser does not support accessing the webcam. Please try using a different browser."
			)
			return null
		}
	} catch (error) {
		console.error("Error accessing stream:", error)
		return null
	}
}

const loadShader = async (path) => {
	let shaderCode
	try {
		const response = await fetch(path)
		if (!response.ok) throw new Error(`Failed to fetch ${path}`)
		shaderCode = await response.text()
		shaderCode = await _processIncludes(shaderCode)
		return shaderCode
	} catch (error) {
		console.error(error)
		throw error
	}
}

const _processIncludes = async (shaderCode) => {
	const includeRegex = /#include "(.+)"/g
	const includePaths = []
	let match

	while ((match = includeRegex.exec(shaderCode)) !== null) {
		includePaths.push(match[1])
	}

	const includes = await Promise.all(
		includePaths.map(async (path) => {
			try {
				const response = await fetch(path)
				if (!response.ok) throw new Error(`Failed to fetch ${path}`)
				return await response.text()
			} catch (error) {
				console.error(`Failed to load included file: ${path}`)
				throw error
			}
		})
	)

	includePaths.forEach((path, index) => {
		shaderCode = shaderCode.replace(`#include "${path}"`, includes[index])
	})

	return shaderCode
}

export { loadImage, loadWebcam, loadShader }
