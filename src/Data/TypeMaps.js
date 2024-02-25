// ref: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

// prettier - ignore
export const Uniform = (gl) => ({
	5126: (loc, data) => gl.uniform1f(loc, data), // this.gl.FLOAT,
	35664: (loc, data) => gl.uniform2fv(loc, data), // this.gl.FLOAT_VEC2,
	35665: (loc, data) => gl.uniform3fv(loc, data), // this.gl.FLOAT_VEC3,
	35666: (loc, data) => gl.uniform4fv(loc, data), // this.gl.FLOAT_VEC4,

	5124: (loc, data) => gl.uniform1i(loc, data), // this.gl.INT,
	35667: (loc, data) => gl.uniform2iv(loc, data), // this.gl.INT_VEC2,
	35668: (loc, data) => gl.uniform3iv(loc, data), // this.gl.INT_VEC3,
	35669: (loc, data) => gl.uniform4iv(loc, data), // this.gl.INT_VEC4,

	// check
	35670: (loc, data) => gl.uniform1i(loc, data), // this.gl.BOOL,
	35671: (loc, data) => gl.uniform2iv(loc, data), // this.gl.BOOL_VEC2,
	35672: (loc, data) => gl.uniform3iv(loc, data), // this.gl.BOOL_VEC3,
	35673: (loc, data) => gl.uniform4iv(loc, data), // this.gl.BOOL_VEC4,

	// check
	35674: (loc, data) => gl.uniformMatrix2fv(loc, false, data), // this.gl.FLOAT_MAT2,
	35675: (loc, data) => gl.uniformMatrix3fv(loc, false, data), // this.gl.FLOAT_MAT3,
	35676: (loc, data) => gl.uniformMatrix4fv(loc, false, data), // this.gl.FLOAT_MAT4,

	5125: (loc, data) => gl.uniform1u(loc, data), // this.gl.UNSIGNED_INT,
	36294: (loc, data) => gl.uniform2uv(loc, data), // this.gl.UNSIGNED_INT_VEC2,
	36295: (loc, data) => gl.uniform3uv(loc, data), // this.gl.UNSIGNED_INT_VEC3,
	36296: (loc, data) => gl.uniform4uv(loc, data), // this.gl.UNSIGNED_INT_VEC4,

	// 35680: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_CUBE,
	35678: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_2D,
	35679: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_3D,
	35682: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_2D_SHADOW,
	36289: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_2D_ARRAY,
	36292: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_2D_ARRAY_SHADOW,
	36293: (loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_CUBE_SHADOW,

	// 35685: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT2x3,
	// 35686: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT2x4,
	// 35687: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT3x2,
	// 35688: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT3x4,
	// 35689: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT4x2,
	// 35690: (loc, data) => gl.uniform1f (loc, data), // this.gl.FLOAT_MAT4x3,

	// 36298: (loc, data) => gl.uniform1f (loc, data), // this.gl.INT_SAMPLER_2D,
	// 36299: (loc, data) => gl.uniform1f (loc, data), // this.gl.INT_SAMPLER_3D,
	// 36300: (loc, data) => gl.uniform1f (loc, data), // this.gl.INT_SAMPLER_CUBE,
	// 36303: (loc, data) => gl.uniform1f (loc, data), // this.gl.INT_SAMPLER_2D_ARRAY,

	// 36306: (loc, data) => gl.uniform1f (loc, data), // this.gl.UNSIGNED_INT_SAMPLER_2D,
	// 36307: (loc, data) => gl.uniform1f (loc, data), // this.gl.UNSIGNED_INT_SAMPLER_3D,
	// 36308: (loc, data) => gl.uniform1f (loc, data), // this.gl.UNSIGNED_INT_SAMPLER_CUBE,
	// 36311: (loc, data) => gl.uniform1f (loc, data), // this.gl.UNSIGNED_INT_SAMPLER_2D_ARRAY,
})

export const samplerTypes = new Set([
	35680, 35678, 35679, 35682, 36289, 36292, 36293,
])

// prettier-ignore
export const Unit = {
	i8 : { size: 1, type: 0x1400 },
	i16: { size: 2, type: 0x1402 },
	i32: { size: 4, type: 0x1404 },
	u8 : { size: 1, type: 0x1401 },
	u16: { size: 2, type: 0x1403 },
	u32: { size: 4, type: 0x1405 },
	f32: { size: 4, type: 0x1406 },
}

// prettier-ignore
export const TypeArrayUnit = {
	Int8Array: "i8",
	Int16Array: "i16",
	Int32Array: "i32",
	Uint8Array: "u8",
	Uint16Array: "u16",
	Uint32Array: "u32",
	Float32Array: "f32",
}

// prettier-ignore
export const Data = {
	i8 : Int8Array,
	i16: Int16Array,
	i32: Int32Array,
	u8 : Uint8Array,
	u16: Uint16Array,
	u32: Uint32Array,
	f32: Float32Array,
}

// prettier-ignore
export const IFormat = {
	6407 : { format: 0x1907, type: 0x1401 }, /* RGB */
	6408 : { format: 0x1908, type: 0x1401 }, /* RGBA */
	6410 : { format: 0x190a, type: 0x1401 }, /* LUMINANCE_ALPHA */
	6409 : { format: 0x1909, type: 0x1401 }, /* LUMINANCE */
	6406 : { format: 0x1906, type: 0x1401 }, /* ALPHA */
	33321: { format: 0x1903, type: 0x1401 }, /* R8 */
	33325: { format: 0x1903, type: 0x1406 }, /* R16F */
	33326: { format: 0x1903, type: 0x1406 }, /* R32F */
	33330: { format: 0x8d94, type: 0x1401 }, /* R8UI */
	33323: { format: 0x8227, type: 0x1401 }, /* RG8 */
	33327: { format: 0x8227, type: 0x1406 }, /* RG16F */
	33328: { format: 0x8227, type: 0x1406 }, /* RG32F */
	33336: { format: 0x8228, type: 0x1401 }, /* RG8UI */
	32849: { format: 0x1907, type: 0x1401 }, /* RGB8 */
	35905: { format: 0x1907, type: 0x1401 }, /* SRGB8 */
	36194: { format: 0x1907, type: 0x1401 }, /* RGB565 */
	35898: { format: 0x1907, type: 0x1406 }, /* R11F_G11F_B10F */
	35901: { format: 0x1907, type: 0x1406 }, /* RGB9_E5 */
	34843: { format: 0x1907, type: 0x1406 }, /* RGB16F */
	34837: { format: 0x1907, type: 0x1406 }, /* RGB32F */
	36221: { format: 0x8d98, type: 0x1401 }, /* RGB8UI */
	32856: { format: 0x1908, type: 0x1401 }, /* RGBA8 */
	35907: { format: 0x1908, type: 0x1401 }, /* SRGB8_ALPHA8 */
	32855: { format: 0x1908, type: 0x1401 }, /* RGB5_A1 */
	32857: { format: 0x1908, type: 0x8368 }, /* RGB10_A2 */
	32854: { format: 0x1908, type: 0x1401 }, /* RGBA4 */
	34842: { format: 0x1908, type: 0x1406 }, /* RGBA16F */
	34836: { format: 0x1908, type: 0x1406 }, /* RGBA32F */
	36220: { format: 0x8d99, type: 0x1401 }, /* RGBA8UI */
}
