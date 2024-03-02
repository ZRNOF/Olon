import Olon from "../Core/main.js"
import * as TypeMaps from "./TypeMaps.js"

const flat = (array) => array.flat(Infinity)

Olon.prototype.DataType = function (data) {
	return data.constructor.name
}

Olon.prototype.Data = function (data, type = "f32") {
	if (Array.isArray(data)) return new TypeMaps.Data[type](flat(data))
	if (typeof data === "number") return new TypeMaps.Data[type](data)
	throw new Error("Unsupported data type")
}

export default Olon
