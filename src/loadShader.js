const loadShader = async (path) => {
	let shaderCode
	try {
		const response = await fetch(path)
		if (!response.ok) throw new Error(`Failed to fetch ${path}`)
		shaderCode = await response.text()
		shaderCode = await processIncludes(shaderCode)
		return shaderCode
	} catch (error) {
		console.error(error)
		throw error
	}
}

const processIncludes = async (shaderCode) => {
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

export default loadShader
