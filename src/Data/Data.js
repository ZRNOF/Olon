import * as TypeMaps from "./TypeMaps.js"

export const DataType = (data) => data.constructor.name

const flat = (array) => array.flat(Infinity)

const Data = (data, type = "f32") => {
	if (Array.isArray(data)) return new TypeMaps.Data[type](flat(data))
	if (typeof data === "number") return new TypeMaps.Data[type](data)
	throw new Error("Unsupported data type")
}

export default Data
