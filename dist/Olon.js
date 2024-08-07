class $946b8ae9394ed0c3$var$Olon {
    constructor(width = 300, height = 150, ATTACH_TO_2D = false){
        this.frame = 0;
        this.seconds = 0;
        this.startTime = 0;
        this.currentTime = performance.now();
        this.lastFrameTime = performance.now();
        this.fps = 60;
        this.oMouseX = 0;
        this.oMouseY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isLooping = true;
        this._renderFunc = ()=>{};
        this._isSave = false;
        this._canvasToSave = null;
        this._saveName = "untitled.png";
        this.FLOAT_FORMAT_SUPPORT = false;
        this.SUPPORTED_EXTENSIONS = [];
        this.UNSUPPORTED_EXTENSIONS = [];
        this.bufferList = {};
        this.ATTACH_TO_2D = ATTACH_TO_2D;
        this.canvas2D = null;
        this.o2D = null;
        this._initCanvas2D(width, height);
        this.canvas = null;
        this.gl = null;
        this._initCanvas(width, height);
        this._enableCanvas2D();
        this.program = null;
        this.canvas.addEventListener("mousemove", (e)=>this._mouseMove(e, this.canvas));
        this.canvas.addEventListener("touchmove", (e)=>this._touchMove(e, this.canvas));
    }
    /////////////////////////////////////////////
    // FEATURE //////////////////////////////////
    sketch() {
        const { positionData: positionData, texCoordData: texCoordData } = this.sketchData();
        this.setAttribute("aPosition", positionData, "f32", 2);
        this.setAttribute("aTexCoord", texCoordData, "f32", 2);
    }
    fullscreen() {
        const { left: left, top: top } = this._getBorderSize(this.canvas);
        this.width = window.innerWidth - left * 2;
        this.height = window.innerHeight - top * 2;
        window.addEventListener("resize", ()=>{
            const { left: left, top: top } = this._getBorderSize(this.canvas);
            this.width = window.innerWidth - left * 2;
            this.height = window.innerHeight - top * 2;
        });
    }
    _initCanvas(width, height) {
        this.canvas = document.createElement("canvas");
        [this.canvas.width, this.canvas.height] = [
            width,
            height
        ];
        this.canvas.id = "olon-canvas";
        document.body.appendChild(this.canvas);
        this.gl = this.canvas.getContext("webgl2");
        this.canvas.style.display = "block";
    }
    _initCanvas2D(width, height) {
        if (!this.ATTACH_TO_2D) return;
        this.canvas2D = document.createElement("canvas");
        [this.canvas2D.width, this.canvas2D.height] = [
            width,
            height
        ];
        this.canvas2D.id = "o2d";
        document.body.appendChild(this.canvas2D);
        this.o2D = this.canvas2D.getContext("2d");
        this.canvas2D.style.display = "none";
    }
    _enableCanvas2D() {
        if (!this.ATTACH_TO_2D) return;
        this.canvas.style.display = "none";
        this.canvas2D.style.display = "block";
        this.canvas2D.addEventListener("mousemove", (e)=>this._mouseMove(e, this.canvas2D));
        this.canvas2D.addEventListener("touchmove", (e)=>this._touchMove(e, this.canvas2D));
    }
    _save() {
        this._isSave = false;
        let extension = "png";
        if (this._saveName) {
            const parts = this._saveName.split(".");
            if (parts.length > 1) {
                extension = parts[parts.length - 1].toLowerCase();
                if (![
                    "png",
                    "jpg",
                    "jpeg"
                ].includes(extension)) extension = "png";
            }
        }
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this._canvasToSave.width;
        tempCanvas.height = this._canvasToSave.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(this._canvasToSave, 0, 0);
        tempCanvas.toBlob((blob)=>{
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = this._saveName;
            link.click();
            URL.revokeObjectURL(link.href);
        }, [
            "jpg",
            "jpeg"
        ].includes(extension) ? "image/jpeg" : "image/png");
    }
    save(filename) {
        this._isSave = true;
        this._canvasToSave = this.ATTACH_TO_2D ? this.canvas2D : this.canvas;
        this._saveName = filename;
        if (!this.isLooping) {
            !this.ATTACH_TO_2D && this._renderFunc();
            this._save();
        }
    }
    saveCanvas(canvas, filename) {
        this._isSave = true;
        this._canvasToSave = canvas;
        this._saveName = filename;
        if (!this.isLooping) {
            !this.ATTACH_TO_2D && this._renderFunc();
            this._save();
        }
    }
    render(renderFunc) {
        this._renderFunc = renderFunc;
        const animate = (timestamp)=>{
            this.frame++;
            this.timestamp = timestamp;
            this.currentTime = performance.now();
            this.seconds = (this.currentTime - this.startTime) / 1000;
            this.fps = 1000 / (this.currentTime - this.lastFrameTime);
            this._renderFunc();
            if (this.canvas2D) this.o2D.drawImage(this.canvas, 0, 0);
            if (this._isSave) this._save();
            this.lastFrameTime = this.currentTime;
            this.isLooping && requestAnimationFrame(animate);
        };
        this.pause = ()=>this.isLooping = false;
        this.play = ()=>{
            if (!this.isLooping) {
                this.isLooping = true;
                requestAnimationFrame(animate);
            }
        };
        this.toggle = ()=>{
            this.isLooping = !this.isLooping;
            this.isLooping && requestAnimationFrame(animate);
        };
        this.startTime = performance.now();
        requestAnimationFrame(animate);
    }
    use({ program: program = null, VAO: VAO = null, FBO: FBO = null, RBO: RBO = null, texture2D: texture2D = null, buffer: buffer = null, Depth: Depth = false, Blend: Blend = false } = {
        program: program,
        VAO: VAO,
        FBO: FBO,
        RBO: RBO,
        texture2D: texture2D,
        Depth: Depth,
        Blend: Blend
    }) {
        return {
            run: (callback)=>{
                if (program) this.useProgram(program);
                if (VAO) this.bindVAO(VAO);
                if (FBO) this.bindFBO(FBO);
                if (RBO) this.bindRBO(RBO);
                if (texture2D) this.bindTexture2D(texture2D);
                if (buffer) this.bindBuffer(buffer);
                if (Depth) this.enableDepth();
                if (Blend) this.enableBlend();
                callback();
                if (Blend) this.disableBlend();
                if (Depth) this.disableDepth();
                if (buffer) this.unbindBuffer();
                if (texture2D) this.unbindTexture2D();
                if (RBO) this.unbindRBO();
                if (FBO) this.unbindFBO();
                if (VAO) this.unbindVAO();
            }
        };
    }
    /////////////////////////////////////////////
    // GET INFOMATION ///////////////////////////
    get oMouse() {
        return [
            this.oMouseX,
            this.oMouseY
        ];
    }
    get mouse() {
        return [
            this.mouseX,
            this.mouseY
        ];
    }
    get limit() {
        return {
            TOTAL_TEXTURES: this.MAX_TEXTURES,
            FRAG_TEXTURE: this.MAX_FRAG_TEXTURES,
            VERT_TEXTURE: this.MAX_VERT_TEXTURES,
            DRAW_BUFFERS: this.MAX_DRAW_BUFFERS
        };
    }
    get MAX_TEXTURES() {
        return this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    }
    get MAX_FRAG_TEXTURES() {
        return this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
    }
    get MAX_VERT_TEXTURES() {
        return this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    }
    get MAX_DRAW_BUFFERS() {
        return this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS);
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    set width(w) {
        if (this.canvas2D) this.canvas2D.width = w;
        this.canvas.width = w;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    set height(h) {
        if (this.canvas2D) this.canvas2D.height = h;
        this.canvas.height = h;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    get resolution() {
        return [
            this.canvas.width,
            this.canvas.height
        ];
    }
}
var $946b8ae9394ed0c3$export$2e2bcd8739ae039 = $946b8ae9394ed0c3$var$Olon;



/////////////////////////////////////////////
// BLEND CONST //////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.BLEND_MODE = 32774 // this.gl.FUNC_ADD
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.BLEND_SFAC = 1 // this.gl.ONE
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.BLEND_DFAC = 0 // this.gl.ZERO
;
/////////////////////////////////////////////
// BUFFER USAGES ////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STATIC_DRAW = 35044 // this.gl.STATIC_DRAW
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DYNAMIC_DRAW = 35048 // this.gl.DYNAMIC_DRAW
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STREAM_DRAW = 35040 // this.gl.STREAM_DRAW
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STATIC_READ = 35045 // this.gl.STATIC_READ
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DYNAMIC_READ = 35049 // this.gl.DYNAMIC_READ
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STREAM_READ = 35041 // this.gl.STREAM_READ
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STATIC_COPY = 35046 // this.gl.STATIC_COPY
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DYNAMIC_COPY = 35050 // this.gl.DYNAMIC_COPY
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STREAM_COPY = 35042 // this.gl.STREAM_COPY
;
/////////////////////////////////////////////
// CLEAR ////////////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.COLOR_BUFF = 16384 // this.gl.COLOR_BUFFER_BIT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DEPTH_BUFF = 256 // this.gl.DEPTH_BUFFER_BIT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.STENCIL_BUFF = 1024 // this.gl.STENCIL_BUFFER_BIT
;
/////////////////////////////////////////////
// PRIMITIVE ////////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.POINTS = 0 // this.gl.POINTS
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LINES = 1 // this.gl.LINES
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LINE_LOOP = 2 // this.gl.LINE_LOOP
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LINE_STRIP = 3 // this.gl.LINE_STRIP
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.TRIANGLES = 4 // this.gl.TRIANGLES
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.TRIANGLE_STRIP = 5 // this.gl.TRIANGLE_STRIP
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.TRIANGLE_FAN = 6 // this.gl.TRIANGLE_FAN
;
/////////////////////////////////////////////
// WRAP MODE ////////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.REPEAT = 10497 // this.gl.REPEAT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.CLAMP = 33071 // this.gl.CLAMP_TO_EDGE
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.MIRROR = 33648 // this.gl.MIRRORED_REPEAT
;
/////////////////////////////////////////////
// MIN & MAG FILTER MODE ////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.NEAREST = 9728 // this.gl.NEAREST
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LINEAR = 9729 // this.gl.LINEAR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.NMN = 9984 // this.gl.NEAREST_MIPMAP_NEAREST
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LMN = 9985 // this.gl.LINEAR_MIPMAP_NEAREST
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.NML = 9986 // this.gl.NEAREST_MIPMAP_LINEAR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LML = 9987 // this.gl.LINEAR_MIPMAP_LINEAR
;
/////////////////////////////////////////////
// UTILS ////////////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.FB = 36160 // this.gl.FRAMEBUFFER
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.T2D = 3553 // this.gl.TEXTURE_2D
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RB = 36161 // this.gl.RENDERBUFFER
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DA = 36096 // this.gl.DEPTH_ATTACHMENT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.AB = 34962 // this.gl.ARRAY_BUFFER
;
/////////////////////////////////////////////
// BLEND MODE ///////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ADD = 32774 // this.gl.FUNC_ADD
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SUB = 32778 // this.gl.FUNC_SUBTRACT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.REV_SUB = 32779 // this.gl.FUNC_REVERSE_SUBTRACT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.MIN = 32775 // this.gl.MIN
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.MAX = 32776 // this.gl.MAX
;
/////////////////////////////////////////////
/////////////////////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.FRONT = 1028 // this.gl.FRONT
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.BACK = 1029 // this.gl.BACK
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.FRONT_AND_BACK = 1032 // this.gl.FRONT_AND_BACK
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ALL = 1032 // this.gl.FRONT_AND_BACK
;
/////////////////////////////////////////////
// BLEND FACTOR /////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ZERO = 0 // this.gl.ZERO
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE = 1 // this.gl.ONE
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SRC_COLOR = 768 // this.gl.SRC_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_SRC_COLOR = 769 // this.gl.ONE_MINUS_SRC_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DST_COLOR = 774 // this.gl.DST_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_DST_COLOR = 775 // this.gl.ONE_MINUS_DST_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SRC_ALPHA = 770 // this.gl.SRC_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_SRC_ALPHA = 771 // this.gl.ONE_MINUS_SRC_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DST_ALPHA = 772 // this.gl.DST_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_DST_ALPHA = 773 // this.gl.ONE_MINUS_DST_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.CONSTANT_COLOR = 32769 // this.gl.CONSTANT_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_CONSTANT_COLOR = 32770 // this.gl.ONE_MINUS_CONSTANT_COLOR
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.CONSTANT_ALPHA = 32771 // this.gl.CONSTANT_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ONE_MINUS_CONSTANT_ALPHA = 32772 // this.gl.ONE_MINUS_CONSTANT_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SRC_ALPHA_SATURATE = 776 // this.gl.SRC_ALPHA_SATURATE
;
/////////////////////////////////////////////
// INTERNAL FORMAT //////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB = 6407 // this.gl.RGB
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA = 6408 // this.gl.RGBA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LUMINANCE_ALPHA = 6410 // this.gl.LUMINANCE_ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.LUMINANCE = 6409 // this.gl.LUMINANCE
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.ALPHA = 6406 // this.gl.ALPHA
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.R8 = 33321 // this.gl.R8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.R16F = 33325 // this.gl.R16F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.R32F = 33326 // this.gl.R32F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.R8UI = 33330 // this.gl.R8UI
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RG8 = 33323 // this.gl.RG8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RG16F = 33327 // this.gl.RG16F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RG32F = 33328 // this.gl.RG32F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RG8UI = 33336 // this.gl.RG8UI
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB8 = 32849 // this.gl.RGB8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SRGB8 = 35905 // this.gl.SRGB8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB565 = 36194 // this.gl.RGB565
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.R11F_G11F_B10F = 35898 // this.gl.R11F_G11F_B10F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB9_E5 = 35901 // this.gl.RGB9_E5
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB16F = 34843 // this.gl.RGB16F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB32F = 34837 // this.gl.RGB32F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB8UI = 36221 // this.gl.RGB8UI
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA8 = 32856 // this.gl.RGBA8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SRGB8_ALPHA8 = 35907 // this.gl.SRGB8_ALPHA8
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB5_A1 = 32855 // this.gl.RGB5_A1
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGB10_A2 = 32857 // this.gl.RGB10_A2
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA4 = 32854 // this.gl.RGBA4
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA16F = 34842 // this.gl.RGBA16F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA32F = 34836 // this.gl.RGBA32F
;
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.RGBA8UI = 36220 // this.gl.RGBA8UI
;
var /////////////////////////////////////////////
// EXPORT ///////////////////////////////////
$853dbd9b9f7ae4ca$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);


// ref: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

// prettier - ignore
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.UniformMap = {
    5126: (gl, loc, data)=>gl.uniform1f(loc, data),
    35664: (gl, loc, data)=>gl.uniform2fv(loc, data),
    35665: (gl, loc, data)=>gl.uniform3fv(loc, data),
    35666: (gl, loc, data)=>gl.uniform4fv(loc, data),
    5124: (gl, loc, data)=>gl.uniform1i(loc, data),
    35667: (gl, loc, data)=>gl.uniform2iv(loc, data),
    35668: (gl, loc, data)=>gl.uniform3iv(loc, data),
    35669: (gl, loc, data)=>gl.uniform4iv(loc, data),
    // check
    35670: (gl, loc, data)=>gl.uniform1i(loc, data),
    35671: (gl, loc, data)=>gl.uniform2iv(loc, data),
    35672: (gl, loc, data)=>gl.uniform3iv(loc, data),
    35673: (gl, loc, data)=>gl.uniform4iv(loc, data),
    // check
    35674: (gl, loc, data)=>gl.uniformMatrix2fv(loc, false, data),
    35675: (gl, loc, data)=>gl.uniformMatrix3fv(loc, false, data),
    35676: (gl, loc, data)=>gl.uniformMatrix4fv(loc, false, data),
    5125: (gl, loc, data)=>gl.uniform1u(loc, data),
    36294: (gl, loc, data)=>gl.uniform2uv(loc, data),
    36295: (gl, loc, data)=>gl.uniform3uv(loc, data),
    36296: (gl, loc, data)=>gl.uniform4uv(loc, data),
    // 35680: (gl, loc, data) => gl.uniform1i(loc, data), // this.gl.SAMPLER_CUBE,
    35678: (gl, loc, data)=>gl.uniform1i(loc, data),
    35679: (gl, loc, data)=>gl.uniform1i(loc, data),
    35682: (gl, loc, data)=>gl.uniform1i(loc, data),
    36289: (gl, loc, data)=>gl.uniform1i(loc, data),
    36292: (gl, loc, data)=>gl.uniform1i(loc, data),
    36293: (gl, loc, data)=>gl.uniform1i(loc, data)
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.samplerTypes = new Set([
    35680,
    35678,
    35679,
    35682,
    36289,
    36292,
    36293
]);
// prettier-ignore
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.UnitMap = {
    i8: {
        size: 1,
        type: 0x1400
    },
    i16: {
        size: 2,
        type: 0x1402
    },
    i32: {
        size: 4,
        type: 0x1404
    },
    u8: {
        size: 1,
        type: 0x1401
    },
    u16: {
        size: 2,
        type: 0x1403
    },
    u32: {
        size: 4,
        type: 0x1405
    },
    f32: {
        size: 4,
        type: 0x1406
    }
};
// prettier-ignore
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.TypeArrayUnit = {
    Int8Array: "i8",
    Int16Array: "i16",
    Int32Array: "i32",
    Uint8Array: "u8",
    Uint16Array: "u16",
    Uint32Array: "u32",
    Float32Array: "f32"
};
// prettier-ignore
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DataMap = {
    i8: Int8Array,
    i16: Int16Array,
    i32: Int32Array,
    u8: Uint8Array,
    u16: Uint16Array,
    u32: Uint32Array,
    f32: Float32Array
};
// prettier-ignore
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.IFormatMap = {
    6407: {
        format: 0x1907,
        type: 0x1401
    },
    /* RGB */ 6408: {
        format: 0x1908,
        type: 0x1401
    },
    /* RGBA */ 6410: {
        format: 0x190a,
        type: 0x1401
    },
    /* LUMINANCE_ALPHA */ 6409: {
        format: 0x1909,
        type: 0x1401
    },
    /* LUMINANCE */ 6406: {
        format: 0x1906,
        type: 0x1401
    },
    /* ALPHA */ 33321: {
        format: 0x1903,
        type: 0x1401
    },
    /* R8 */ 33325: {
        format: 0x1903,
        type: 0x1406
    },
    /* R16F */ 33326: {
        format: 0x1903,
        type: 0x1406
    },
    /* R32F */ 33330: {
        format: 0x8d94,
        type: 0x1401
    },
    /* R8UI */ 33323: {
        format: 0x8227,
        type: 0x1401
    },
    /* RG8 */ 33327: {
        format: 0x8227,
        type: 0x1406
    },
    /* RG16F */ 33328: {
        format: 0x8227,
        type: 0x1406
    },
    /* RG32F */ 33336: {
        format: 0x8228,
        type: 0x1401
    },
    /* RG8UI */ 32849: {
        format: 0x1907,
        type: 0x1401
    },
    /* RGB8 */ 35905: {
        format: 0x1907,
        type: 0x1401
    },
    /* SRGB8 */ 36194: {
        format: 0x1907,
        type: 0x1401
    },
    /* RGB565 */ 35898: {
        format: 0x1907,
        type: 0x1406
    },
    /* R11F_G11F_B10F */ 35901: {
        format: 0x1907,
        type: 0x1406
    },
    /* RGB9_E5 */ 34843: {
        format: 0x1907,
        type: 0x1406
    },
    /* RGB16F */ 34837: {
        format: 0x1907,
        type: 0x1406
    },
    /* RGB32F */ 36221: {
        format: 0x8d98,
        type: 0x1401
    },
    /* RGB8UI */ 32856: {
        format: 0x1908,
        type: 0x1401
    },
    /* RGBA8 */ 35907: {
        format: 0x1908,
        type: 0x1401
    },
    /* SRGB8_ALPHA8 */ 32855: {
        format: 0x1908,
        type: 0x1401
    },
    /* RGB5_A1 */ 32857: {
        format: 0x1908,
        type: 0x8368
    },
    /* RGB10_A2 */ 32854: {
        format: 0x1908,
        type: 0x1401
    },
    /* RGBA4 */ 34842: {
        format: 0x1908,
        type: 0x1406
    },
    /* RGBA16F */ 34836: {
        format: 0x1908,
        type: 0x1406
    },
    /* RGBA32F */ 36220: {
        format: 0x8d99,
        type: 0x1401
    }
};
var $d4c17cdf169be816$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.enableExtensions = function(requestExtensions) {
    requestExtensions.forEach((ext)=>{
        if (!this.gl.getExtension(ext)) this.UNSUPPORTED_EXTENSIONS.push(ext);
        else this.SUPPORTED_EXTENSIONS.push(ext);
    });
    if (this.UNSUPPORTED_EXTENSIONS.length === 0) return true;
    console.warn("The following extensions are not supported:", this.UNSUPPORTED_EXTENSIONS.join(", "));
    return false;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.enableFloat = function() {
    this.FLOAT_FORMAT_SUPPORT = this.enableExtensions([
        "EXT_color_buffer_float",
        "OES_texture_float_linear"
    ]);
    if (!this.FLOAT_FORMAT_SUPPORT) console.warn("Failed to enable float format. If encounter any errors, please try browsing the following resources:\n", "- https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear\n", "- https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float");
};
var $6973175316e650a7$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._shader = function(programObj, source, type) {
    const shader = this.gl.createShader(type);
    if (!/#version 300 es/.test(source)) source = `#version 300 es\n${source}`;
    source = source.replace(/^\s+/, "");
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    this.gl.attachShader(programObj.program, shader);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._processShader = function(programObj, sources, type) {
    if (Array.isArray(sources)) sources.forEach((source)=>this._shader(programObj, source, type));
    else this._shader(programObj, sources, type);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.setShader = function(vert, frag) {
    this.program = this.createProgram(vert, frag);
    this.linkProgram(this.program);
    this.useProgram(this.program);
};
var $43da7bd4590e1e2d$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.setProgram = function(programObj) {
    this.program = programObj;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.linkProgram = function(programObj) {
    this.setProgram(programObj);
    this.gl.linkProgram(programObj.program);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useProgram = function(programObj) {
    this.setProgram(programObj);
    this.gl.useProgram(programObj.program);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._updateProgramUniforms = function(programObj, name, type, size) {
    programObj.uniforms[name] = {
        type: type,
        size: size
    };
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.createProgram = function(vsList, fsList, tfVaryings) {
    const program = this.gl.createProgram();
    const programObj = {
        program: program,
        uniforms: {},
        texUnitList: {},
        texUnitCount: 0,
        emptyTexUnits: []
    };
    this._processShader(programObj, vsList, this.gl.VERTEX_SHADER);
    this._processShader(programObj, fsList, this.gl.FRAGMENT_SHADER);
    if (tfVaryings) this.gl.transformFeedbackVaryings(programObj.program, tfVaryings, this.gl.INTERLEAVED_ATTRIBS);
    this.linkProgram(programObj);
    this.useProgram(programObj);
    const numUniforms = this._getActiveUniforms(programObj);
    for(let i = 0; i < numUniforms; ++i){
        const { name: name, type: type, size: size } = this._getActiveUniform(programObj, i);
        this._updateProgramUniforms(programObj, name, type, size);
        if (this.samplerTypes.has(type)) this._setTexUnit(name);
    }
    return programObj;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._setTexUnit = function(name) {
    const unitIndex = !this.program.emptyTexUnits.length ? this.program.texUnitCount++ : this.program.emptyTexUnits.pop();
    this.uniform(name, unitIndex);
    this.program.texUnitList[name] = unitIndex;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._getActiveUniform = function(programObj, index) {
    const info = this.gl.getActiveUniform(programObj.program, index);
    return {
        name: info.name.replace(/\[[^\]]*\]/g, ""),
        type: info.type,
        size: info.size
    };
};
var $799387af406fff41$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.createBuffer = function(data, usage) {
    const buffer = this.gl.createBuffer();
    this.useBuffer(buffer, ()=>this.gl.bufferData(this.AB, data, usage));
    return buffer;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.bindBuffer = function(buffer) {
    this.gl.bindBuffer(this.AB, buffer);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.unbindBuffer = function() {
    this.gl.bindBuffer(this.AB, null);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useBuffer = function(buffer, callback) {
    this.bindBuffer(buffer);
    callback();
    this.unbindBuffer();
};
var $4584c707c5f1f30a$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.drawArrays = function(primMode, first, count) {
    this.gl.drawArrays(primMode, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.points = function(first, count) {
    this.gl.drawArrays(this.gl.POINTS, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.lines = function(first, count) {
    this.gl.drawArrays(this.gl.LINES, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.lineLoop = function(first, count) {
    this.gl.drawArrays(this.gl.LINE_LOOP, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.lineStrip = function(first, count) {
    this.gl.drawArrays(this.gl.LINE_STRIP, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.triangles = function(first, count) {
    this.gl.drawArrays(this.gl.TRIANGLES, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.triangleStrip = function(first, count) {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, first, count);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.triangleFan = function(first, count) {
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, first, count);
};
/////////////////////////////////////////////
// DRAW ARRAYS INSTANCED ////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.drawArraysInstanced = function(primMode, first, count, instanceCount) {
    this.gl.drawArraysInstanced(primMode, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.pointsInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.POINTS, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.linesInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.LINES, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.lineLoopInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.LINE_LOOP, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.lineStripInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.LINE_STRIP, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.trianglesInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.TRIANGLES, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.triangleStripInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, first, count, instanceCount);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.triangleFanInstanced = function(first, count, instanceCount) {
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_FAN, first, count, instanceCount);
};
var $ea5b62018442b164$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.aLoc = function(name) {
    return this.gl.getAttribLocation(this.program.program, name);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.uLoc = function(name) {
    return this.gl.getUniformLocation(this.program.program, name);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.oLoc = function(name) {
    return this.gl.getFragDataLocation(this.program.program, name);
};
var $a82bcf5f4e848d97$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.setAttribute = function(name, data, unit, size, divisor) {
    const loc = this.aLoc(name);
    const buffer = this.gl.createBuffer();
    const type = this.UnitMap[unit].type;
    this.useBuffer(buffer, ()=>{
        this.gl.bufferData(this.AB, data, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(loc, size, type, false, 0, 0);
        this.gl.enableVertexAttribArray(loc);
        if (Number.isInteger(divisor) && divisor >= 0) this.gl.vertexAttribDivisor(loc, divisor);
    });
    const bufferInfo = {
        buffer: buffer,
        loc: loc,
        name: name,
        data: data,
        size: size
    };
    this.bufferList[name] = bufferInfo;
    return bufferInfo;
};
var /////////////////////////////////////////////
// EXPORT ///////////////////////////////////
$9984c1f5349d00f7$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._getActiveUniforms = function(programObj) {
    return this.gl.getProgramParameter(programObj.program, this.gl.ACTIVE_UNIFORMS);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.uniform = function(name, data, updateTex) {
    const info = this.program.uniforms[name];
    if (!info) return;
    if (Object.hasOwn(this.program.texUnitList, name)) {
        if (updateTex instanceof HTMLVideoElement) {
            if (updateTex.readyState !== updateTex.HAVE_ENOUGH_DATA) return;
            const iformat = this.RGBA;
            const { format: format, type: type } = this.IFormatMap[iformat];
            this.gl.activeTexture(this.gl.TEXTURE0 + this.program.texUnitList[name]);
            this.gl.bindTexture(this.T2D, data);
            this.gl.texImage2D(this.T2D, 0, iformat, format, type, updateTex);
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + this.program.texUnitList[name]);
        this.gl.bindTexture(this.T2D, data);
        return;
    }
    const loc = this.uLoc(name);
    this.UniformMap[info.type](this.gl, loc, data);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.initUniform = function(uniformInfos) {
    const uniforms = {};
    const entries = Object.entries(uniformInfos);
    for (const [name, type] of entries)uniforms[name] = (data)=>this.uniform(type, name, data);
    return uniforms;
};
var $59b1fae59f6c2fee$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._getBorderSize = function(canvas) {
    const style = window.getComputedStyle(canvas);
    const top = parseFloat(style.borderTopWidth) || 0;
    const left = parseFloat(style.borderLeftWidth) || 0;
    return {
        top: top,
        left: left
    };
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._updateMouse = function(canvas, cx, cy) {
    this.oMouseX = cx / canvas.scrollWidth;
    this.oMouseY = cy / canvas.scrollHeight;
    this.oMouseY = canvas.height - this.oMouseY;
    this.mouseX = this.oMouseX / this.width * 2 - 1;
    this.mouseY = this.oMouseY / this.height * 2 - 1;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._mouseMove = function(e, canvas) {
    const cx = e.offsetX * canvas.width;
    const cy = e.offsetY * canvas.height;
    this._updateMouse(canvas, cx, cy);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._touchMove = function(e, canvas) {
    e = e.touches ? e.touches[0] : e.changedTouches?.[0];
    const rect = canvas.getBoundingClientRect();
    const { left: left, top: top } = this._getBorderSize(canvas);
    const cx = (e.clientX - rect.left - left) * canvas.width;
    const cy = (e.clientY - rect.top - top) * canvas.height;
    this._updateMouse(canvas, cx, cy);
};
var $0dc1a158750b4054$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.enableBlend = function() {
    this.gl.enable(this.gl.BLEND);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.disableBlend = function() {
    this.gl.disable(this.gl.BLEND);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.blend = function({ sfactor: sfactor = this.BLEND_SFAC, dfactor: dfactor = this.BLEND_DFAC, mode: mode = this.BLEND_MODE } = {
    sfactor: sfactor,
    dfactor: dfactor,
    mode: mode
}) {
    this.BLEND_SFAC = sfactor;
    this.BLEND_DFAC = dfactor;
    this.BLEND_MODE = mode;
    this.gl.blendEquation(this.BLEND_MODE);
    this.gl.blendFunc(this.BLEND_SFAC, this.BLEND_DFAC);
};
var $d26b4503f0fff045$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.enableDepth = function() {
    this.gl.enable(this.gl.DEPTH_TEST);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.disableDepth = function() {
    this.gl.disable(this.gl.DEPTH_TEST);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useDepth = function(callback) {
    this.gl.enable(this.gl.DEPTH_TEST);
    callback();
    this.gl.disable(this.gl.DEPTH_TEST);
};
var $9dd9dbf73e06b857$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.enableCulling = function() {
    this.gl.enable(this.gl.CULL_FACE);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.disableCulling = function() {
    this.gl.disable(this.gl.CULL_FACE);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.cull = function(mode) {
    this.gl.cullFace(mode);
};
var $62378e3cfcb9442f$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.clear = function(mask) {
    this.gl.clear(mask);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.clearColor = function(r, g, b, a) {
    if (arguments.length !== 0) this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.clearDepth = function(depth) {
    if (arguments.length !== 0) this.gl.clearDepth(depth);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.clearStencil = function(stencil) {
    if (arguments.length !== 0) this.gl.clearStencil(stencil);
    this.gl.clear(this.gl.STENCIL_BUFFER_BIT);
};
var $15866b735a3728d6$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._isDOMElement = function(texture) {
    return texture instanceof HTMLElement ? true : false;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.setTexParameter = function(wrapS, wrapT, minFilter, magFilter) {
    this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_S, wrapS);
    this.gl.texParameteri(this.T2D, this.gl.TEXTURE_WRAP_T, wrapT);
    this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MIN_FILTER, minFilter);
    this.gl.texParameteri(this.T2D, this.gl.TEXTURE_MAG_FILTER, magFilter);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.bindTexture2D = function(texture) {
    this.gl.bindTexture(this.T2D, texture);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.unbindTexture2D = function() {
    this.gl.bindTexture(this.T2D, null);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useTexture2D = function(texture, callback) {
    this.bindTexture2D(texture);
    callback();
    this.unbindTexture2D();
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._emptyTexStorage2D = function({ width: width = this.width, height: height = this.height, iformat: iformat, minFilter: minFilter = this.LINEAR, magFilter: magFilter = this.LINEAR, filter: filter, wrapS: wrapS = this.REPEAT, wrapT: wrapT = this.REPEAT, wrap: wrap, flipY: flipY = false } = {}) {
    if (!iformat) throw "_emptyTexStorage2D: Please specify iformat (internalformat).";
    if (filter) [minFilter, magFilter] = [
        filter,
        filter
    ];
    if (wrap) [wrapS, wrapT] = [
        wrap,
        wrap
    ];
    const texture = this.gl.createTexture();
    this.useTexture2D(texture, ()=>{
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY);
        this.setTexParameter(wrapS, wrapT, minFilter, magFilter);
        this.gl.texStorage2D(this.T2D, 1, iformat, width, height);
    });
    return texture;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._emptyTexImage2D = function({ width: width = this.width, height: height = this.height, iformat: iformat, minFilter: minFilter = this.LINEAR, magFilter: magFilter = this.LINEAR, filter: filter, wrapS: wrapS = this.REPEAT, wrapT: wrapT = this.REPEAT, wrap: wrap, flipY: flipY = false } = {}) {
    if (!iformat) throw "_emptyTexImage2D: Please specify iformat (internalformat).";
    if (filter) [minFilter, magFilter] = [
        filter,
        filter
    ];
    if (wrap) [wrapS, wrapT] = [
        wrap,
        wrap
    ];
    const { format: format, type: type } = this.IFormatMap[iformat];
    const texture = this.gl.createTexture();
    this.useTexture2D(texture, ()=>{
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY);
        this.setTexParameter(wrapS, wrapT, minFilter, magFilter);
        this.gl.texImage2D(this.T2D, 0, iformat, width, height, 0, format, type, null);
    });
    return texture;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.texture2D = function({ data: data = null, iformat: iformat, level: level = 0, width: width = data?.width || this.width, height: height = data?.height || this.height, minFilter: minFilter = this.LINEAR, magFilter: magFilter = this.LINEAR, filter: filter, wrapS: wrapS = this.REPEAT, wrapT: wrapT = this.REPEAT, wrap: wrap, flipY: flipY = this._isDOMElement(data), immutableStorage: immutableStorage = false } = {}) {
    if (!iformat) throw "texture2D: Please specify iformat (internalformat).";
    // create empty texture
    if (!data) {
        // prettier-ignore
        const options = {
            width: width,
            height: height,
            iformat: iformat,
            minFilter: minFilter,
            magFilter: magFilter,
            filter: filter,
            wrapS: wrapS,
            wrapT: wrapT,
            wrap: wrap,
            flipY: flipY
        };
        return immutableStorage ? this._emptyTexStorage2D(options) : this._emptyTexImage2D(options);
    }
    if (filter) [minFilter, magFilter] = [
        filter,
        filter
    ];
    if (wrap) [wrapS, wrapT] = [
        wrap,
        wrap
    ];
    const { format: format, type: type } = this.IFormatMap[iformat];
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.T2D, texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY);
    this.gl.texImage2D(this.T2D, level, iformat, width, height, 0, format, type, data);
    this.gl.generateMipmap(this.T2D);
    this.setTexParameter(wrapS, wrapT, minFilter, magFilter);
    this.gl.bindTexture(this.T2D, null);
    return texture;
};
var $503b1c9377eba4c0$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._calcStride = function(attributes) {
    return attributes.reduce((acc, { unit: unit, size: size })=>{
        return acc + size * this.UnitMap[unit].size;
    }, 0);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._vaoByBufferInfos = function(programObj, bufferInfos) {
    if (!Array.isArray(bufferInfos)) bufferInfos = [
        bufferInfos
    ];
    const vao = this.gl.createVertexArray();
    this.use({
        program: this.useProgram(programObj),
        VAO: vao
    }).run(()=>{
        bufferInfos.forEach((bufferInfo)=>{
            this.useBuffer(bufferInfo.buffer, ()=>{
                const attributes = bufferInfo.attributes;
                const stride = bufferInfo.stride || this._calcStride(attributes);
                const divisor = bufferInfo.divisor;
                let offset = 0;
                attributes.forEach(({ name: name, unit: unit, size: size })=>{
                    const loc = this.aLoc(name);
                    const type = this.UnitMap[unit].type;
                    this.gl.vertexAttribPointer(loc, size, type, false, stride, offset);
                    this.gl.enableVertexAttribArray(loc);
                    offset += size * this.UnitMap[unit].size;
                    if (Number.isInteger(divisor) && divisor >= 0) this.gl.vertexAttribDivisor(loc, divisor);
                });
            });
        });
    });
    return vao;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._vaoByAttribute = function(programObj, attributes) {
    this.useProgram(programObj);
    const vao = this.gl.createVertexArray();
    this.useVAO(vao, ()=>{
        attributes.forEach(({ name: name, data: data, size: size })=>{
            const unit = this.TypeArrayUnit[data.constructor.name];
            this.setAttribute(name, data, unit, size);
        });
    });
    return vao;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype._checkUseAttribute = function(params) {
    return Array.isArray(params) && Object.hasOwn(params[0], "name");
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.createVAO = function(programObj, params) {
    if (this._checkUseAttribute(params)) return this._vaoByAttribute(programObj, params);
    return this._vaoByBufferInfos(programObj, params);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.bindVAO = function(vao) {
    this.gl.bindVertexArray(vao);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.unbindVAO = function() {
    this.gl.bindVertexArray(null);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useVAO = function(vao, callback) {
    this.bindVAO(vao);
    callback();
    this.unbindVAO();
};
var $005fd4dee55b504f$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.bindFBO = function(fbo) {
    this.gl.bindFramebuffer(this.FB, fbo);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.unbindFBO = function() {
    this.gl.bindFramebuffer(this.FB, null);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useFBO = function(fbo, callback) {
    this.bindFBO(fbo);
    callback();
    this.unbindFBO();
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.checkFramebufferStatus = function() {
    const status = this.gl.checkFramebufferStatus(this.FB);
    switch(status){
        case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_ATTACHMENT";
        case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";
        case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_DIMENSIONS";
        case this.gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
            throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_INCOMPLETE_MULTISAMPLE";
        case this.gl.FRAMEBUFFER_UNSUPPORTED:
            throw "FRAMEBUFFER INCOMPLETE: FRAMEBUFFER_UNSUPPORTED";
        default:
            break;
    }
};
// check
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.createFBO = function({ program: program, outs: outs, depthBuffer: depthBuffer }) {
    const fbo = this.gl.createFramebuffer();
    this.useFBO(fbo, ()=>{
        const MAX_DRAW_BUFFERS = this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS);
        const COLOR_ATTACHMENTS = Array.from({
            length: MAX_DRAW_BUFFERS
        }, ()=>this.gl.NONE);
        this.setProgram(program);
        outs.forEach(({ name: name, texture: texture })=>{
            const loc = this.oLoc(name);
            const attachment = this.gl.COLOR_ATTACHMENT0 + loc;
            COLOR_ATTACHMENTS[loc] = attachment;
            this.gl.framebufferTexture2D(this.FB, attachment, this.T2D, texture, 0);
        });
        this.gl.framebufferRenderbuffer(this.FB, this.DA, this.RB, depthBuffer);
        this.gl.drawBuffers(COLOR_ATTACHMENTS);
        this.checkFramebufferStatus();
    });
    return fbo;
};
var $a93b11d823601045$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.bindRBO = function(rbo) {
    this.gl.bindRenderbuffer(this.RB, rbo);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.unbindRBO = function() {
    this.gl.bindRenderbuffer(this.RB, null);
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.useRBO = function(rbo, callback) {
    this.bindRBO(rbo);
    callback();
    this.unbindRBO();
};
var $262e90010f2221e5$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.createDepthBuffer = function(width, height, depthComponent = 16) {
    const depthBuffer = this.gl.createRenderbuffer();
    this.useRBO(depthBuffer, ()=>this.gl.renderbufferStorage(this.RB, depthComponent === 24 ? this.gl.DEPTH_COMPONENT24 : depthComponent === 32 ? this.gl.DEPTH_COMPONENT32F : this.gl.DEPTH_COMPONENT16, width, height));
    return depthBuffer;
};
var $4ae471802946a038$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.transformFeedback = function(readVAO, writeBuffer, primMode, callback) {
    this.useVAO(readVAO, ()=>{
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, writeBuffer);
        this.gl.enable(this.gl.RASTERIZER_DISCARD);
        this.gl.beginTransformFeedback(primMode);
        callback();
        this.gl.endTransformFeedback();
        this.gl.disable(this.gl.RASTERIZER_DISCARD);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    });
};
var $1c5e6c2187b397c9$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



const $ac8b0d1d0dee5f4b$var$flat = (array)=>array.flat(Infinity);
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.DataType = function(data) {
    return data.constructor.name;
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.Data = function(data, type = "f32") {
    if (Array.isArray(data)) return new this.DataMap[type]($ac8b0d1d0dee5f4b$var$flat(data));
    if (typeof data === "number") return new this.DataMap[type](data);
    throw new Error("Unsupported data type");
};
var $ac8b0d1d0dee5f4b$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.quadData = function() {
    return this.Data([
        [
            -1,
            -1,
            0,
            0
        ],
        [
            1,
            -1,
            1,
            0
        ],
        [
            1,
            1,
            1,
            1
        ],
        [
            1,
            1,
            1,
            1
        ],
        [
            -1,
            1,
            0,
            1
        ],
        [
            -1,
            -1,
            0,
            0
        ]
    ]);
};
/////////////////////////////////////////////
// [*] REFACTOR /////////////////////////////
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.quadBufferInfo = function(positionName = "aPosition", texCoordName = "aTexCoord") {
    return {
        buffer: this.createBuffer(this.quadData(), this.STATIC_DRAW),
        stride: 16,
        attributes: [
            {
                name: positionName,
                unit: "f32",
                size: 2
            },
            {
                name: texCoordName,
                unit: "f32",
                size: 2
            }
        ]
    };
};
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.sketchData = function() {
    const positionData = this.Data([
        -1,
        -1,
        1,
        -1,
        1,
        1,
        1,
        1,
        -1,
        1,
        -1,
        -1
    ]);
    const texCoordData = this.Data([
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        0
    ]);
    return {
        positionData: positionData,
        texCoordData: texCoordData
    };
};
var $5481d34f094151f3$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);



/**
 * Modified from p5.flex:
 *   https://github.com/ZRNOF/p5.flex
 *
 * MIT License
 * Copyright © 2024 Zaron
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.CONTAIN = "contain";
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.COVER = "cover";
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.FILL = "fill";
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.NONE = "none";
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.SCALE_DOWN = "scale_down";
// common CSS style
const $e45c2cbdae0ebc9e$var$RESET_BOX_MODEL = `padding: 0; margin: 0; border: 0;`;
const $e45c2cbdae0ebc9e$var$FULL_SIZE = `width: 100%; height: 100%;`;
const $e45c2cbdae0ebc9e$var$FLEX_CENTER = `display: flex; justify-content: center; align-items: center;`;
const $e45c2cbdae0ebc9e$var$BORDER_BOX = `box-sizing: border-box;`;
const $e45c2cbdae0ebc9e$var$STATIC = `position: static;`;
const $e45c2cbdae0ebc9e$var$HIDDEN = `overflow: hidden;`;
const $e45c2cbdae0ebc9e$var$BLOCK = `display: block;`;
const $e45c2cbdae0ebc9e$var$__flexStyle__ = {
    pageCSS: ()=>{
        const html = document.documentElement;
        const body = document.body;
        html.className = "";
        body.className = "";
        html.style.cssText = $e45c2cbdae0ebc9e$var$RESET_BOX_MODEL + $e45c2cbdae0ebc9e$var$FULL_SIZE;
        body.style.cssText = $e45c2cbdae0ebc9e$var$RESET_BOX_MODEL + $e45c2cbdae0ebc9e$var$FULL_SIZE + $e45c2cbdae0ebc9e$var$FLEX_CENTER;
    },
    containerCSS: (container, OPTIONS)=>{
        let boxModel = "";
        if (!OPTIONS.container.customBoxModel) boxModel = `
				margin:  ${OPTIONS.container.margin} ;
				padding: ${OPTIONS.container.padding};
				border:  ${OPTIONS.container.border} ;
			`;
        container.style.cssText = `
			max-width:  ${OPTIONS.container.width};
			max-height: ${OPTIONS.container.height};
			width:  ${OPTIONS.container.width};
			height: ${OPTIONS.container.height};
			${$e45c2cbdae0ebc9e$var$BORDER_BOX + $e45c2cbdae0ebc9e$var$FLEX_CENTER + boxModel}
		`;
    },
    canvasScaleCSS: (OPTIONS)=>{
        return `
			max-width:  ${100 * OPTIONS.canvas.scale}%;
			max-height: ${100 * OPTIONS.canvas.scale}%;
		`;
    },
    // for COVER | NONE mode
    innerContainerCSS: (innerContainer, OPTIONS)=>{
        const scale = $e45c2cbdae0ebc9e$var$__flexStyle__.canvasScaleCSS(OPTIONS);
        let style = scale + $e45c2cbdae0ebc9e$var$STATIC + $e45c2cbdae0ebc9e$var$FLEX_CENTER + $e45c2cbdae0ebc9e$var$HIDDEN;
        if (OPTIONS.canvas.fit === "cover") style += $e45c2cbdae0ebc9e$var$FULL_SIZE;
        innerContainer.style.cssText = style;
    },
    canvasCSS: (canvas, OPTIONS)=>{
        const fit = OPTIONS.canvas.fit;
        let fitStyle = $e45c2cbdae0ebc9e$var$__flexStyle__.canvasScaleCSS(OPTIONS);
        if ([
            "cover",
            "none"
        ].includes(fit)) fitStyle = "";
        if (fit === "fill") fitStyle += $e45c2cbdae0ebc9e$var$FULL_SIZE;
        canvas.style.cssText = `
			${$e45c2cbdae0ebc9e$var$STATIC + $e45c2cbdae0ebc9e$var$RESET_BOX_MODEL + $e45c2cbdae0ebc9e$var$BORDER_BOX + fitStyle + $e45c2cbdae0ebc9e$var$BLOCK}
		`;
    }
};
// provide margin, padding, and border for the container
// using .style to access padding is faster than using getComputedStyle
//
// in default mode (customBoxModel === false), users cannot use percentage in padding
// because it requires computing the padding value every time the container is resized or the aspect ratio changes
//
// setting customBoxModel to true allows user to use sheet style, but it will use getComputedStyle
// in this mode, users can use percentage in padding
const $e45c2cbdae0ebc9e$var$DEFAULT_OPTIONS = {
    container: {
        id: undefined,
        parent: undefined,
        width: "100%",
        height: "100%",
        margin: "0",
        padding: "0",
        border: "0",
        customBoxModel: false
    },
    canvas: {
        scale: 1,
        fit: "contain"
    },
    stylePage: true
};
// merge DEFAULT_OPTIONS & custom options
const $e45c2cbdae0ebc9e$var$mergeOptions = (defaultOpts, userOpts)=>{
    return {
        ...defaultOpts,
        ...userOpts,
        container: {
            ...defaultOpts.container,
            ...userOpts.container
        },
        canvas: {
            ...defaultOpts.canvas,
            ...userOpts.canvas
        }
    };
};
// flex main function
(0, $946b8ae9394ed0c3$export$2e2bcd8739ae039).prototype.flex = function(options = {}) {
    const canvas = this.ATTACH_TO_2D ? this.canvas2D : this.canvas;
    const OPTIONS = $e45c2cbdae0ebc9e$var$mergeOptions($e45c2cbdae0ebc9e$var$DEFAULT_OPTIONS, options);
    const fit = OPTIONS.canvas.fit ?? "contain";
    const customBoxModel = OPTIONS.container.customBoxModel;
    // style html and body if stylePage set to true
    if (OPTIONS.stylePage) $e45c2cbdae0ebc9e$var$__flexStyle__.pageCSS();
    // set container parent
    const parent = OPTIONS.container.parent ?? document.body;
    OPTIONS.container.parent = parent;
    // create flex-container
    const container = document.createElement("div");
    const id = OPTIONS.container.id ?? `flex-container-${canvas.id}`;
    container.id = OPTIONS.container.id = id;
    canvas.container = container;
    // style flex-container and append it to specified parent or body
    $e45c2cbdae0ebc9e$var$__flexStyle__.containerCSS(container, OPTIONS);
    container.classList.add("flex-container");
    parent.appendChild(container);
    // create inner container, only in COVER | NONE mode
    // because COVER and NONE modes utilize CSS overflow hidden
    // container -> inner container -> canvas
    let innerContainer;
    if ([
        "cover",
        "none"
    ].includes(fit)) {
        innerContainer = document.createElement("div");
        $e45c2cbdae0ebc9e$var$__flexStyle__.innerContainerCSS(innerContainer, OPTIONS);
        container.appendChild(innerContainer);
    }
    // calculate vertical and horizontal padding values
    // paddingVer and paddingHor will be used in the stretchToContain function
    // to calculate the correct container width and height
    const calcPadding = ()=>{
        const containerStyle = customBoxModel ? getComputedStyle(container) // user custom sheet style
         : container.style // faster
        ;
        const padding = (side)=>parseFloat(containerStyle[`padding${side}`]);
        const paddingVer = padding("Top") + padding("Bottom");
        const paddingHor = padding("Left") + padding("Right");
        return [
            paddingVer,
            paddingHor
        ];
    };
    let [paddingVer, paddingHor] = calcPadding();
    // store last resized element, "container" | "canvas"
    let resizedElement = "";
    // store stretch side, "width" | "height"
    let stretchSide = "";
    // stretch & stretchToContain only in CONTAIN | COVER mode
    // one direction (either width or height) needs to stretch to fit the container
    // to keep the aspect ratio, the other direction does not need to stretch
    const stretch = (side)=>{
        if (resizedElement === "container" && stretchSide === side) return;
        stretchSide = side;
        canvas.style.width = side === "width" ? "100%" : "";
        canvas.style.height = side === "height" ? "100%" : "";
    };
    const stretchToContain = ()=>{
        requestAnimationFrame(()=>{
            if (customBoxModel) [paddingVer, paddingHor] = calcPadding();
            const containerW = container.clientWidth - paddingHor;
            const containerH = container.clientHeight - paddingVer;
            const containerAR = containerW / containerH;
            const canvasAR = canvas.width / canvas.height;
            if (containerAR >= canvasAR) {
                if (fit === "contain") stretch("height");
                if (fit === "cover") stretch("width");
            } else {
                if (fit === "contain") stretch("width");
                if (fit === "cover") stretch("height");
            }
        });
    };
    // set ResizeObserver for the container
    if ([
        "contain",
        "cover"
    ].includes(fit)) new ResizeObserver(()=>{
        resizedElement = "container";
        stretchToContain();
    }).observe(container);
    // style canvas and append it to flex-container
    $e45c2cbdae0ebc9e$var$__flexStyle__.canvasCSS(canvas, OPTIONS);
    if ([
        "cover",
        "none"
    ].includes(fit)) {
        innerContainer.classList.add("flex-canvas");
        innerContainer.appendChild(canvas);
        this.ATTACH_TO_2D && innerContainer.appendChild(this.canvas);
    } else {
        canvas.classList.add("flex-canvas");
        container.appendChild(canvas);
        this.ATTACH_TO_2D && container.appendChild(this.canvas);
    }
};
var $e45c2cbdae0ebc9e$export$2e2bcd8739ae039 = (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039);


const $95a2ddbad6c62d80$export$fe58198efe02b173 = (src)=>new Promise((resolve, reject)=>{
        const image = new Image();
        image.addEventListener("load", ()=>resolve(image));
        image.addEventListener("error", (error)=>{
            reject(new Error(`Error loading image from ${src}: ${error.message}`));
        });
        image.crossOrigin = "anonymous";
        image.src = src;
    });
const $95a2ddbad6c62d80$export$e733acd7e07c0138 = async ()=>{
    const webcam = document.createElement("video");
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            webcam.srcObject = stream;
            webcam.setAttribute("playsinline", "");
            webcam.play();
            return webcam;
        } else {
            console.error("Your browser does not support accessing the webcam. Please try using a different browser.");
            return null;
        }
    } catch (error) {
        console.error("Error accessing stream:", error);
        return null;
    }
};
const $95a2ddbad6c62d80$export$83674196993caf59 = async (path)=>{
    let shaderCode;
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to fetch ${path}`);
        shaderCode = await response.text();
        shaderCode = await $95a2ddbad6c62d80$var$_processIncludes(shaderCode);
        return shaderCode;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const $95a2ddbad6c62d80$var$_processIncludes = async (shaderCode)=>{
    const includeRegex = /#include "(.+)"/g;
    const includePaths = [];
    let match;
    while((match = includeRegex.exec(shaderCode)) !== null)includePaths.push(match[1]);
    const includes = await Promise.all(includePaths.map(async (path)=>{
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to fetch ${path}`);
            return await response.text();
        } catch (error) {
            console.error(`Failed to load included file: ${path}`);
            throw error;
        }
    }));
    includePaths.forEach((path, index)=>{
        shaderCode = shaderCode.replace(`#include "${path}"`, includes[index]);
    });
    return shaderCode;
};


var $c11457d2050428cd$export$2e2bcd8739ae039 = (width, height, ATTACH_TO_2D)=>new (0, $946b8ae9394ed0c3$export$2e2bcd8739ae039)(width, height, ATTACH_TO_2D);


export {$c11457d2050428cd$export$2e2bcd8739ae039 as default, $95a2ddbad6c62d80$export$83674196993caf59 as loadShader, $95a2ddbad6c62d80$export$fe58198efe02b173 as loadImage, $95a2ddbad6c62d80$export$e733acd7e07c0138 as loadWebcam};
//# sourceMappingURL=Olon.js.map
