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

export default loadImage
