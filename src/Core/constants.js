import Olon from "./main.js"

/////////////////////////////////////////////
// BLEND CONST //////////////////////////////

Olon.prototype.BLEND_MODE = 32774 // this.gl.FUNC_ADD
Olon.prototype.BLEND_SFAC = 1 // this.gl.ONE
Olon.prototype.BLEND_DFAC = 0 // this.gl.ZERO

/////////////////////////////////////////////
// BUFFER USAGES ////////////////////////////

Olon.prototype.STATIC_DRAW = 35044 // this.gl.STATIC_DRAW
Olon.prototype.DYNAMIC_DRAW = 35048 // this.gl.DYNAMIC_DRAW
Olon.prototype.STREAM_DRAW = 35040 // this.gl.STREAM_DRAW

Olon.prototype.STATIC_READ = 35045 // this.gl.STATIC_READ
Olon.prototype.DYNAMIC_READ = 35049 // this.gl.DYNAMIC_READ
Olon.prototype.STREAM_READ = 35041 // this.gl.STREAM_READ

Olon.prototype.STATIC_COPY = 35046 // this.gl.STATIC_COPY
Olon.prototype.DYNAMIC_COPY = 35050 // this.gl.DYNAMIC_COPY
Olon.prototype.STREAM_COPY = 35042 // this.gl.STREAM_COPY

/////////////////////////////////////////////
// CLEAR ////////////////////////////////////

Olon.prototype.COLOR_BUFF = 16384 // this.gl.COLOR_BUFFER_BIT
Olon.prototype.DEPTH_BUFF = 256 // this.gl.DEPTH_BUFFER_BIT
Olon.prototype.STENCIL_BUFF = 1024 // this.gl.STENCIL_BUFFER_BIT

/////////////////////////////////////////////
// PRIMITIVE ////////////////////////////////

Olon.prototype.POINTS = 0 // this.gl.POINTS
Olon.prototype.LINES = 1 // this.gl.LINES
Olon.prototype.LINE_LOOP = 2 // this.gl.LINE_LOOP
Olon.prototype.LINE_STRIP = 3 // this.gl.LINE_STRIP
Olon.prototype.TRIANGLES = 4 // this.gl.TRIANGLES
Olon.prototype.TRIANGLE_STRIP = 5 // this.gl.TRIANGLE_STRIP
Olon.prototype.TRIANGLE_FAN = 6 // this.gl.TRIANGLE_FAN

/////////////////////////////////////////////
// WRAP MODE ////////////////////////////////

Olon.prototype.REPEAT = 10497 // this.gl.REPEAT
Olon.prototype.CLAMP = 33071 // this.gl.CLAMP_TO_EDGE
Olon.prototype.MIRROR = 33648 // this.gl.MIRRORED_REPEAT

/////////////////////////////////////////////
// MIN & MAG FILTER MODE ////////////////////

Olon.prototype.NEAREST = 9728 // this.gl.NEAREST
Olon.prototype.LINEAR = 9729 // this.gl.LINEAR
Olon.prototype.NMN = 9984 // this.gl.NEAREST_MIPMAP_NEAREST
Olon.prototype.LMN = 9985 // this.gl.LINEAR_MIPMAP_NEAREST
Olon.prototype.NML = 9986 // this.gl.NEAREST_MIPMAP_LINEAR
Olon.prototype.LML = 9987 // this.gl.LINEAR_MIPMAP_LINEAR

/////////////////////////////////////////////
// UTILS ////////////////////////////////////

Olon.prototype.FB = 36160 // this.gl.FRAMEBUFFER
Olon.prototype.T2D = 3553 // this.gl.TEXTURE_2D
Olon.prototype.RB = 36161 // this.gl.RENDERBUFFER
Olon.prototype.DA = 36096 // this.gl.DEPTH_ATTACHMENT
Olon.prototype.AB = 34962 // this.gl.ARRAY_BUFFER

/////////////////////////////////////////////
// BLEND MODE ///////////////////////////////

Olon.prototype.ADD = 32774 // this.gl.FUNC_ADD
Olon.prototype.SUB = 32778 // this.gl.FUNC_SUBTRACT
Olon.prototype.REV_SUB = 32779 // this.gl.FUNC_REVERSE_SUBTRACT
Olon.prototype.MIN = 32775 // this.gl.MIN
Olon.prototype.MAX = 32776 // this.gl.MAX

/////////////////////////////////////////////
// BLEND FACTOR /////////////////////////////

Olon.prototype.ZERO = 0 // this.gl.ZERO
Olon.prototype.ONE = 1 // this.gl.ONE
Olon.prototype.SRC_COLOR = 768 // this.gl.SRC_COLOR
Olon.prototype.ONE_MINUS_SRC_COLOR = 769 // this.gl.ONE_MINUS_SRC_COLOR
Olon.prototype.DST_COLOR = 774 // this.gl.DST_COLOR
Olon.prototype.ONE_MINUS_DST_COLOR = 775 // this.gl.ONE_MINUS_DST_COLOR
Olon.prototype.SRC_ALPHA = 770 // this.gl.SRC_ALPHA
Olon.prototype.ONE_MINUS_SRC_ALPHA = 771 // this.gl.ONE_MINUS_SRC_ALPHA
Olon.prototype.DST_ALPHA = 772 // this.gl.DST_ALPHA
Olon.prototype.ONE_MINUS_DST_ALPHA = 773 // this.gl.ONE_MINUS_DST_ALPHA
Olon.prototype.CONSTANT_COLOR = 32769 // this.gl.CONSTANT_COLOR
Olon.prototype.ONE_MINUS_CONSTANT_COLOR = 32770 // this.gl.ONE_MINUS_CONSTANT_COLOR
Olon.prototype.CONSTANT_ALPHA = 32771 // this.gl.CONSTANT_ALPHA
Olon.prototype.ONE_MINUS_CONSTANT_ALPHA = 32772 // this.gl.ONE_MINUS_CONSTANT_ALPHA
Olon.prototype.SRC_ALPHA_SATURATE = 776 // this.gl.SRC_ALPHA_SATURATE

/////////////////////////////////////////////
// INTERNAL FORMAT //////////////////////////

Olon.prototype.RGB = 6407 // this.gl.RGB
Olon.prototype.RGBA = 6408 // this.gl.RGBA
Olon.prototype.LUMINANCE_ALPHA = 6410 // this.gl.LUMINANCE_ALPHA
Olon.prototype.LUMINANCE = 6409 // this.gl.LUMINANCE
Olon.prototype.ALPHA = 6406 // this.gl.ALPHA
Olon.prototype.R8 = 33321 // this.gl.R8
Olon.prototype.R16F = 33325 // this.gl.R16F
Olon.prototype.R32F = 33326 // this.gl.R32F
Olon.prototype.R8UI = 33330 // this.gl.R8UI
Olon.prototype.RG8 = 33323 // this.gl.RG8
Olon.prototype.RG16F = 33327 // this.gl.RG16F
Olon.prototype.RG32F = 33328 // this.gl.RG32F
Olon.prototype.RG8UI = 33336 // this.gl.RG8UI
Olon.prototype.RGB8 = 32849 // this.gl.RGB8
Olon.prototype.SRGB8 = 35905 // this.gl.SRGB8
Olon.prototype.RGB565 = 36194 // this.gl.RGB565
Olon.prototype.R11F_G11F_B10F = 35898 // this.gl.R11F_G11F_B10F
Olon.prototype.RGB9_E5 = 35901 // this.gl.RGB9_E5
Olon.prototype.RGB16F = 34843 // this.gl.RGB16F
Olon.prototype.RGB32F = 34837 // this.gl.RGB32F
Olon.prototype.RGB8UI = 36221 // this.gl.RGB8UI
Olon.prototype.RGBA8 = 32856 // this.gl.RGBA8
Olon.prototype.SRGB8_ALPHA8 = 35907 // this.gl.SRGB8_ALPHA8
Olon.prototype.RGB5_A1 = 32855 // this.gl.RGB5_A1
Olon.prototype.RGB10_A2 = 32857 // this.gl.RGB10_A2
Olon.prototype.RGBA4 = 32854 // this.gl.RGBA4
Olon.prototype.RGBA16F = 34842 // this.gl.RGBA16F
Olon.prototype.RGBA32F = 34836 // this.gl.RGBA32F
Olon.prototype.RGBA8UI = 36220 // this.gl.RGBA8UI

/////////////////////////////////////////////
// EXPORT ///////////////////////////////////

export default Olon
