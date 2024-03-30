import Olon from "./Core/main.js"
import "./Core/constants.js"
import "./Core/typeMaps.js"
import "./Core/extension.js"
import "./Core/shader.js"
import "./Core/program.js"
import "./Core/buffer.js"
import "./Core/draw.js"

import "./Basic/location.js"
import "./Basic/attribute.js"
import "./Basic/uniform.js"

import "./Mouse/mouse.js"

import "./Capability/blend.js"
import "./Capability/depth.js"
import "./Capability/cull.js"
import "./Capability/clear.js"

import "./Texture/texture.js"
import "./VAO/vao.js"
import "./FBO/frameBuffer.js"
import "./RBO/renderBuffer.js"
import "./RBO/depthBuffer.js"

import "./TransformFeedback/transformFeedback.js"

import "./Data/data.js"
import "./Data/vertices.js"

/////////////////////////////////////////////
// REVIEW ///////////////////////////////////
import "./Flex/flex.js"

import { loadShader, loadImage, loadWebcam } from "./Utils/load.js"

export { loadShader, loadImage, loadWebcam }
export default (width, height, ATTACH_TO_2D) =>
	new Olon(width, height, ATTACH_TO_2D)
