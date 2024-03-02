import Olon from "../Core/main.js"

const flat = (array) => array.flat(Infinity)

Olon.prototype.DataType = function (data) {
	return data.constructor.name
}

Olon.prototype.Data = function (data, type = "f32") {
	if (Array.isArray(data)) return new this.DataMap[type](flat(data))
	if (typeof data === "number") return new this.DataMap[type](data)
	throw new Error("Unsupported data type")
}

export default Olon
