"use strict";

// TODO: Create better bounding volume creation for shapes.
// TODO: Use Image buffer instead of creating new Image in loading.

/**
 * Class for handling Canvas/WebGL textures. Also used for SVG operations.
 * @class Resource.Texture
 * @extends Resource.Basic
 * @property textureType {Resource.TextureType} Texture type.
 * @property image {*} Image object.
 * @property ctx {*} Context of image object.
 * @property bgTexture {Resource.Texture} Texture object to render before this.texture is drawn.
 * @property vbo {WebGLBuffer} Vertex buffer object.
 * @property width {Number} Width of one frame.
 * @property height {Number} Height of one frame.
 * @property fullWidth {Number} Width of texture.
 * @property fullHeight {Number} Height of texture.
 * @property offsetX {Number} <b>Setter/Getter.</b> Offset from left.
 * @property offsetY {Number} <b>Setter/Getter.</b> Offset from top.
 * @property fps {Number} Animation speed - frames per second.
 * @property numFrames {Number} Total number of frames.
 * @property numFramesY {Number} Total number of frames on Y axis.
 * @property numFramesX {Number} Total number of frames on X axis.
 * @memberof! <global>
 */
Resource.Texture = Resource.Basic.extend
( /** @lends Resource.Texture.prototype */ {

	/**
	 * Constructor.
	 * Will generate by default texture based on what rendering is used.
	 * @param param {Object|Resource.TextureType|String=} Parameters, texture type or texture path.
	 * @param path {String=} Texture path.
	 * @function
	 */
	init: function(param, path)
	{
		if(param !== void(0))
		{
			var paramType = typeof(param);

			if(paramType === "object") 
			{
				for(var key in param) {
					this[key] = param[key];
				}
			}
			else if(paramType === "string") {
				this.path = param;
			}
			else {
				this.textureType = param;
				if(path) { this.path = path; }
			}

			// If no wildcard specified, default it to png.
			if(this.path)
			{
				var wildCardIndex = this.path.lastIndexOf(".");
				if(wildCardIndex === -1 || this.path.length - wildCardIndex > 4) {
					this.path += ".png";
				}
			}			
		}

		if(this.textureType === -1)
		{
			if(meta.engine.isWebGL) {
				this.textureType = Resource.TextureType.WEBGL;
			}
			else {
				this.textureType = Resource.TextureType.CANVAS;
			}
		}

		if(this.numFrames > 1) {
			this.numFramesX = this.numFrames;
			this.isAnimated = true;
		}
		else if(this.numFramesX > 1 || this.numFramesY > 1) {
			this.numFrames = this.numFramesX * this.numFramesY;
			this.isAnimated = true;
		}	

		this.generate(this.textureType);
	},

	remove: function()
	{

	},

	/**
	 * Generate image object depending from type.
	 * @param type {Resource.TextureType=} Texture type to generate.
	 * @function
	 */
	generate: function(type)
	{
		this.isLoaded = false;

		if(type === Resource.TextureType.WEBGL)
		{
			var gl = meta.ctx;
			this.image = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			this._vertices = new Float32Array([
				0.0, 0.0,
				this.trueWidth, 0.0,
				0.0, this.trueHeight,
				this.trueWidth, this.trueHeight
			]);

			this.vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
		}
		else
		{
			this.image = document.createElement("canvas");
			this.ctx = this.image.getContext("2d");
			this.image.width = this.trueFullWidth;
			this.image.height = this.trueFullHeight;

			this.textureType = Resource.TextureType.CANVAS;
		}	
	},

	/**
	 * Load texture from the source.
	 * @param path {string} Source of texture to load from.
	 * @function
	 */
	load: function(path)
	{
		if(this.isLoading) { return; }

		if(path) {
			this.path = path;	
		}
		else if(!this.path) {
			return;
		}

		if(meta._cache.currResolution) {
			this.fullPath = Resource.ctrl.rootPath + meta._cache.currResolution.path + this.path;
		}
		else {
			this.fullPath = Resource.ctrl.rootPath + this.path;
		}

		Resource.ctrl.addToLoad(this);

		var self = this;
		var img = new Image();

		if(meta.engine.isWebGL) {
			img.crossOrigin = "anonymous";
		}

		img.onload = function()
		{
			if(!img.complete) {
				console.warn("[Resource.Texture.load]:", "Could not load texture from - " + img.src);
				Resource.ctrl.loadFailed(self);
				return;
			}

			self.createFromImg(img);
			Resource.ctrl.loadSuccess(self);
		};

		img.onerror = function(event) {
			Resource.ctrl.loadFailed(self);
		};

		if(this._isLoaded) {
			this._isReloading = true;
		}

		img.src = this.fullPath;
	},

	/**
	 * Create texture from DOM Image object.
	 * @param img {Image} Image file.
	 * @function
	 */
	createFromImg: function(img)
	{
		if(this._isLoaded) {
			this.clear();
		}

		this.resize(img.width, img.height);

		if(this.textureType !== Resource.TextureType.WEBGL) {
			this.ctx.drawImage(img, 0, 0);
		}
		else
		{
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		}

		this.unitRatio = meta.unitRatio;

		this._isReloading = false;
		this.isLoaded = true;
	},

	_createCachedImg: function()
	{
		if(this._cachedImg) { return; }

		this._cachedImg = document.createElement("canvas");
		this._cachedImg.width = this.trueFullWidth;
		this._cachedImg.height = this.trueFullHeight;
		this._cachedCtx = this._cachedImg.getContext("2d");
	},

	/**
	 * Resize texture.
	 * @param width {Number} Width of texture.
	 * @param height {Number} Height of texture.
	 * @function
	 */
	resize: function(width, height)
	{
		if(this.trueFullWidth === width && this.trueFullHeight === height) { return; }

		this.trueFullWidth = width;
		this.trueFullHeight = height;

		if(this.isAnimated) {
			this.trueWidth = width / this.numFramesX;
			this.trueHeight = height / this.numFramesY;
		}
		else {
			this.trueWidth = width;
			this.trueHeight = height;
		}

		var unitRatio = meta.unitRatio;
		this.width = (this.trueWidth * unitRatio) + 0.5 | 0;
		this.height = (this.trueHeight * unitRatio) + 0.5 | 0;
		this.fullWidth = (this.trueFullWidth * unitRatio) + 0.5 | 0;
		this.fullHeight = (this.trueFullHeight * unitRatio) + 0.5 | 0;	
		this.halfWidth = this.width * 0.5;
		this.halfHeight = this.height * 0.5;	

		if(!this.textureType)
		{
			if(this._isLoaded)
			{
				if(this.image.width > 0 && this.image.height > 0)
				{
					this._tmpImg.width = this.image.width;
					this._tmpImg.height = this.image.height;
					this._tmpCtx.drawImage(this.image, 0, 0);

					this.image.width = this.trueFullWidth;
					this.image.height = this.trueFullHeight;
					this.ctx.drawImage(this._tmpImg, 0, 0);
				}
				else {
					this.image.width = this.trueFullWidth;
					this.image.height = this.trueFullHeight;					
				}
			}
			else {
				this.image.width = this.trueFullWidth;
				this.image.height = this.trueFullHeight;
			}
		}
		else
		{
			var gl = meta.ctx;

			this._vertices[2] = this.trueWidth;
			this._vertices[5] = this.trueHeight;
			this._vertices[6] = this.trueWidth;
			this._vertices[7] = this.trueHeight;

			this._xRatio = 1.0 / this.numFramesX;
			this._yRatio = 1.0 / this.numFramesY;

			if(this.fromAtlas) {
				this._widthRatio = 1.0 / ((this.ptr.trueFullWidth / this.trueWidth) / this.numFramesX);
				this._heightRatio = 1.0 / ((this.ptr.trueFullHeight / this.trueHeight) / this.numFramesY);
			}
			else {
				this._widthRatio = 1.0 / this.numFramesX;
				this._heightRatio = 1.0 / this.numFramesY;				
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);

			if(this._isLoaded && this._cachedImg)
			{
				this._tmpImg.width = this.image.width;
				this._tmpImg.height = this.image.height;
				this._tmpCtx.drawImage(this._cachedImg, 0, 0);

				this._cachedImg.width = this.trueFullWidth;
				this._cachedImg.height = this.trueFullHeight;
				this._cachedCtx.drawImage(this._cachedImg, 0, 0);

				gl.bindTexture(gl.TEXTURE_2D, this.image);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
			}
		}

		if(this._isLoaded && !this._isReloading) {
			this.emit(this, Resource.Event.RESIZE);
		}
	},

	upResize: function(width, height)
	{
		if(width < this.trueFullWidth) {
			width = this.trueFullWidth;
		}
		if(height < this.trueFullHeight) {
			height = this.trueFullHeight;
		}

		this.resize(width, height);
	},

	update: function()
	{
		// If WebGL.
		if(this.textureType) {
			this.resize(this.trueWidth, this.trueHeight);
		}
	},


	/**
	 * Draw texture onto context.
	 * @param ctx {*} Context to draw on.
	 * @param x {Number} Offset on x axis from left.
	 * @param y {Number} Offset on y axis from top.
	 * @function
	 */
	draw: function(ctx, x, y)
	{
		if(this._bgTexture) {
			this._bgTexture.draw(ctx, x, y);
		}

		if(!this.fromAtlas) {
			ctx.drawImage(this.image, x, y);
		}
		else {
			ctx.drawImage(this.ptr.image, this._x, this._y, this.trueWidth, this.trueHeight, x, y, this.trueWidth, this.trueHeight);
		}
	},


	/**
	 * Draw frame from the texture.
	 * @param ctx {*} Context to draw on.
	 * @param x {Number} Offset on x axis from left.
	 * @param y {Number} Offset on y axis from top.
	 * @param frame {Number} Frame to draw.
	 * @param isEmulateReverse {Boolean=} Is emulated animation reversed.
	 * @function
	 */
	drawFrame: function(ctx, x, y, frame, isEmulateReverse)
	{
		if(this._bgTexture) {
			ctx.drawImage(this._bgTexture.image, x, y);
		}

		if(this._anim)
		{
			var theta, cos;

			if(this._anim.type === 1)
			{
				var width = this._anim.fill * frame;
				if(width === 0) { width = 0.01; }
				else if(width > this.trueFullWidth) { width = this.trueFullWidth; }

				if(isEmulateReverse)
				{
					ctx.drawImage(this.image, (this.trueFullWidth - width), 0, width,
						this.trueFullHeight, (x + this.trueFullWidth - width), y, width, this.trueFullHeight);
				}
				else {
					ctx.drawImage(this.image, 0, 0, width, this.trueFullHeight, x, y, width, this.trueFullHeight);
				}
			}
			else if(this._anim.type === 2)
			{
				var height = this._anim.fill * frame;
				if(height === 0) { height = 0.01; }
				else if(height > this.trueHeight) { width = this.trueHeight; }

				if(isEmulateReverse)
				{
					ctx.drawImage(this.image, 0, (this.trueFullHeight - height), this.trueFullWidth,
						height, x, (y + this.trueFullHeight - height), this.trueFullWidth, height);
				}
				else {
					ctx.drawImage(this.image, 0, 0, this.trueFullWidth, height, x, y, this.trueFullWidth, height);
				}
			}
			else if(this._anim.type === 3)
			{

			}
			else if(this._anim.type === 4)
			{
				if(isEmulateReverse)
				{
					theta = this._anim.fill * (-this.numFrames + frame + 1) + Math.PI / 2;
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length);
					ctx.lineTo(cos + this.trueFullWidth, y);
					ctx.closePath();
					ctx.clip();
				}
				else
				{
					theta = this._anim.fill * (-frame) + Math.PI / 2;
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length);
					ctx.lineTo(cos, y + this.trueFullHeight);
					ctx.lineTo(x, y + this.trueFullHeight);
					ctx.closePath();
					ctx.clip();
				}

				ctx.drawImage(this.image, x, y);
				ctx.restore();
			}
			else if(this._anim.type === 5)
			{
				if(isEmulateReverse)
				{
					theta = this._anim.fill * (this.numFrames - frame - 1) + Math.PI / 2;
					cos = x + Math.cos(theta) * this._anim.length + this.trueFullWidth;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x + this.trueFullWidth, y);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length);
					ctx.lineTo(x, y + this.trueFullHeight);
					ctx.lineTo(x, y);
					ctx.closePath();
					ctx.clip();
				}
				else
				{
					theta = this._anim.fill * frame + Math.PI / 2;
					cos = x + Math.cos(theta) * this._anim.length + this.trueFullWidth;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x + this.trueFullWidth, y);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length);
					ctx.lineTo(cos, y + this.trueFullHeight);
					ctx.lineTo(x + this.trueFullWidth, y + this.trueFullHeight);
					ctx.closePath();
					ctx.clip();
				}

				ctx.drawImage(this.image, x, y);
				ctx.restore();
			}
			else if(this._anim.type === 6)
			{
				if(isEmulateReverse)
				{
					theta = this._anim.fill * (-this.numFrames + frame + 1);
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, y + this.trueFullHeight);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length + this.trueFullHeight);
					ctx.lineTo(x + this.trueFullWidth, y);
					ctx.lineTo(x, y);
					ctx.closePath();
					ctx.clip();
				}
				else
				{
					theta = this._anim.fill * (-frame);
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, y + this.trueFullHeight);
					ctx.lineTo(cos, y + Math.sin(theta) * this._anim.length + this.trueFullHeight);
					ctx.lineTo(x + this.trueFullWidth, y);
					ctx.lineTo(x + this.trueFullWidth, y + this.trueFullHeight);
					ctx.closePath();
					ctx.clip();
				}

				ctx.drawImage(this.image, x, y);
				ctx.restore();
			}
			else if(this._anim.type === 7)
			{
				if(isEmulateReverse)
				{
					theta = this._anim.fill * (this.numFrames - 1 - frame) + Math.PI;
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x + 64, y + this.trueFullHeight);
					ctx.lineTo(cos + 64, y + Math.sin(theta) * this._anim.length + 64);
					ctx.lineTo(x, y);
					ctx.lineTo(x + 64, y);
					ctx.closePath();
					ctx.clip();
				}
				else
				{
					theta = this._anim.fill * (frame) + Math.PI;
					cos = x + Math.cos(theta) * this._anim.length;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x + 64, y + this.trueFullHeight);
					ctx.lineTo(cos + 64, y + Math.sin(theta) * this._anim.length + 64);
					ctx.lineTo(x, y);
					ctx.lineTo(x, y + 64);
					ctx.closePath();
					ctx.clip();
				}

				ctx.drawImage(this.image, x, y);
				ctx.restore();
			}
		}
		else
		{
			ctx.drawImage(this.image,
				(this.trueWidth * (frame % this.numFramesX)),
				(this.trueHeight * Math.floor(frame / this.numFramesX)),
				this.trueWidth, this.trueHeight, x, y, this.trueWidth, this.trueHeight);
		}
	},


	/**
	 * Clear the texture.
	 * @function
	 */
	clear: function()
	{
		if(this.textureType === Resource.TextureType.WEBGL)
		{
			if(!this._cachedCtx) { return; }

			this._cachedCtx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);

			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}
		else {
			this.ctx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);
		}

		if(!this._isReloading) {
			this.isLoaded = true;
		}
	},

	/**
	 * Clear texture without sending emit.
	 * @function
	 */
	clearSilent: function()
	{
		if(this.textureType === Resource.TextureType.WEBGL)
		{
			this._tmpCtx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);

			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}
		else {
			this.ctx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);
		}
	},


	/**
	 * Draw over texture
	 */
	drawOver: function(texture, x, y) 
	{
		if(!texture) {
			console.warn("[Resource.Texture.drawOver]:", "No texture specified.");
			return;
		}

		x = x || 0;
		y = y || 0;

		console.log("here");

		if(typeof(texture) === "string") 
		{
			var obj = meta.getTexture(texture);
			if(!obj) {
				console.warn("[Resource.Texture.drawOver]:", "No such texture with name - " + texture);
				return;
			}
			texture = obj;	
		}

		if(texture.textureType === Resource.TextureType.WEBGL) 
		{
			if(texture._canvasCache) {
				texture = texture._canvasCache;
			}
			else
			{
				texture._canvasCache = new Resource.Texture(Resource.TextureType.CANVAS, texture.path);
				texture._canvasCache.load();
				texture = texture._canvasCache;

				this._loadCache = { name: "drawOver", texture: texture, x: x, y: y };
				this.isLoaded = false;
				texture.subscribe(this, this.onTextureCacheEvent);
				return;	
			}		
		}

		var ctx = this.ctx;
		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		ctx.drawImage(texture.image, x, y);

		if(this.textureType) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;		
	},

	/**
	 * Fill texture with color.
	 * @param params {Object} Parameters.
	 * @param [params.x=0] {Number=} Offset from the left.
	 * @param [params.y=0] {Number=} Offset from the top.
	 * @param [params.width=this.width] {Number=} Width of rect to fill. By default will use current texture width.
	 * @param [params.height=this.height] {Number=} Height of rect to fill. By default will use current texture height.
	 * @param [params.color=#000000] {Hex=} Color of the filled rect.
	 * @param [params.drawOver=false] {Boolean=} Flag - draw over previous texture content.
	 * @param height {Number=} Height of the rect.
	 * @param color {String=} Color of the rect.
	 * @function
	 */
	fillRect: function(params, height, color)
	{
		if(!params) {
			console.warn("[Resource.Texture.fillRect]:", "No parameters specified.");
			return;
		}

		if(typeof(params) === "number")
		{
			this.fillRect({
				width: params,
				height: height,
				color: color
			});
			return;
		}

		var scope = meta;
		var ctx = this.ctx;

		params.x = params.x || 0;
		params.y = params.y || 0;
		var width = (params.width || this.trueFullWidth || 1) + params.x;
		var height = (params.height || this.trueFullHeight || 1) + params.y;

		// if(meta.maxUnitSize > 1) 
		// {
		// 	width *= scope.maxUnitSize;
		// 	height *= scope.maxUnitSize;

		// 	this._maxResCanvasCache = document.createElement("canvas");
		// 	this._maxResCanvasCache.width = width;
		// 	this._maxResCanvasCache.height = height;
		// 	this._maxResCtxCache = this._maxResCanvasCache("2d");
		// }

		this.upResize(width, height);

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		ctx.fillStyle = (params.color || "#000000");
		ctx.fillRect(params.x, params.y, width, height);

		if(this.textureType) {
			var gl = scope.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},


	/**
	 * Tile source texture on top.
	 * @param params {Object} Parameters.
	 * @param params.texture {Resource.Texture|String} Texture object or name of the texture in resources pool.
	 * @param params.x {Number=} Offset on x axis.
	 * @param params.y {Number=} Offset on y axis.
	 * @param params.width {Number=} Width of area to tile.
	 * @param params.height {Number=} Height of area to tile.
	 */
	tile: function(params, height, texture)
	{
		if(typeof(params) === "number") {
			this.tile({ width: params, height: height, texture: texture });
			return;
		}

		if(!params) {
			console.warn("[Resource.Texture.tile]:", "No parameters specified.");
			return;
		}

		if(typeof(params.texture) === "string") {
			params.texture = Resource.ctrl.getTexture(params.texture);
		}

		if(!params.texture) {
			console.warn("[Resource.Texture.tile]:", "Undefined texture.");
			return;
		}

		var texture = params.texture;

		if(texture.textureType === Resource.TextureType.WEBGL) 
		{
			if(texture._canvasCache) {
				texture = texture._canvasCache;
			}
			else
			{
				texture._canvasCache = new Resource.Texture(Resource.TextureType.CANVAS, texture.path);
				texture._canvasCache.load();
				texture = texture._canvasCache;

				this._loadCache = { name: "tile", data: params };
				this.isLoaded = false;
				texture.subscribe(this, this.onTextureCacheEvent);
				return;	
			}		
		}

		// If source texture is not yet loaded. Create chace and wait for it.
		if(!texture._isLoaded) 
		{
			if(!texture._isLoading) {
				texture.load();
			}

			this._loadCache = { name: "tile", data: params };
			this.isLoaded = false;
			texture.subscribe(this, this.onTextureCacheEvent);
			return;
		}

		var scope = meta;
		params.x = params.x || 0;
		params.y = params.y || 0;
		params.width = params.width || texture.fullWidth;
		params.height = params.height || texture.fullHeight;
		params.width *= scope.unitSize;
		params.height *= scope.unitSize;

		this.resize(params.width, params.height);

		if(params.center) {
			params.x += (this.trueFullWidth & (texture.trueFullWidth - 1)) / 2;
			params.y += (this.trueFullHeight & (texture.trueFullHeight - 1)) / 2;		
		}

		var ctx = this.ctx;
		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		var posX = params.x;
		var posY = params.y;
		var numX = Math.ceil(this.trueFullWidth / texture.trueFullWidth) || 1;
		var numY = Math.ceil(this.trueFullHeight/ texture.trueFullHeight) || 1;


		if(posX > 0) {
			numX += Math.ceil(posX / texture.trueFullWidth);
			posX -= texture.trueFullWidth;
		}
		if(posY > 0) {
			numY += Math.ceil(posY / texture.trueFullHeight);
			posY -= texture.trueFullHeight;
		}

		var origY = posY;

		for(var x = 0; x < numX; x++)
		{
			for(var y = 0; y < numY; y++) {
				console.log(posX, posY);
				ctx.drawImage(texture.image, posX, posY);
				posY += texture.trueHeight;
			}

			posX += texture.trueWidth;
			posY = origY;
		}

		if(this.textureType) {
			var gl = scope.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	/**
	 * Stroke/fill lines.
	 * @param params {Object} Parameters.
	 * @param params.buffer {Array} Array with line points.
	 * @param params.color {Hex} Fill color.
	 * @param [params.borderColor=#000000] {Hex=} Border color.
	 * @param params.borderWidth {Number} Thickness of border line.
	 * @param [params.lineCap="butt"] {String=} Type of line endings.
	 * @param params.lineDash {Array} Array with sequence for dashing.
	 * @param params.drawOver {Boolean} Flag - draw over previous texture content.
	 * @param params.addWidth {Number} Add to width.
	 * @param params.addHeight {Number} Add to height.	 
	 */
	stroke: function(params)
	{
		if(!params) {
			console.warn("[Resource.Texture.stroke]:", "No parameters specified.");
			return;
		}

		if(!params.buffer) {
			console.warn("[Resource.Texture.stroke]:", "No buffer defined.");
			return;
		}	

		var scope = meta;	
		var unitSize = scope.unitSize;

		// Calculate bounds.
		var minX = Number.POSITIVE_INFINITY, minY = minX, maxX = Number.NEGATIVE_INFINITY, maxY = maxX;

		var item, i, x, y;
		var buffer = params.buffer;
		var numItems = buffer.length;
		for(i = 0; i < numItems; i += 2)
		{
			x = buffer[i] * unitSize | 0; 
			y = buffer[i + 1] * unitSize | 0;

			if(x < minX) { minX = x; }
			if(y < minY) { minY = y; }
			if(x > maxX) { maxX = x; }
			if(y > maxY) { maxY = y; }

			buffer[i] = x;
			buffer[i + 1] = y;
		}

		if(minX > 0) { minX = 0; }
		if(minY > 0) { minY = 0; }

		var ctx = this.ctx;
		params.addWidth = params.addWidth || 0;
		params.addHeight = params.addHeight || 0;
		params.lineWidth = params.lineWidth || 1;
		if(!params.color && !params.borderColor) {
			params.borderColor = "#000000"; 
		}

		var halfLineWidth = params.lineWidth / 2;
		var offsetX = -minX + halfLineWidth + (params.addWidth / 2);
		this.resize((maxX - minX + params.lineWidth + params.addWidth), 
			maxY - minY);

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		ctx.lineWidth = params.lineWidth;
		if(params.lineCap) {
			ctx.lineCap = params.lineCap;
		}
		if(params.lineDash) {
			ctx.setLineDash(params.lineDash);
		}

		ctx.beginPath();
		ctx.moveTo(buffer[0] + offsetX, buffer[1]);
		for(i = 2; i < numItems; i += 2) {
			ctx.lineTo(buffer[i] + offsetX, buffer[i + 1]);
		}

		if(params.color) {
			ctx.fillStyle = params.color;
			ctx.closePath();
			ctx.fill();
		}

		if(params.borderColor) {
			ctx.strokeStyle = params.borderColor;
			ctx.stroke();
		}

		if(this.textureType === Resource.TextureType.WEBGL) {
			var gl = scope.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	border: function(params)
	{
		if(!params) {
			console.warn("[Resource.Texture.strokeBorder]:", "No parameters specified.");
			return;
		}

		params.width = params.width || this.trueFullWidth;
		params.height = params.height || this.trueFullHeight;

		var lineWidth = 1;
		if(params.borderWidth) {
			lineWidth = params.borderWidth;
		}

		params.buffer = [ 0, 0, params.width - lineWidth, 0, params.width - lineWidth, 
			params.height - lineWidth, 0, params.height - lineWidth, 0, 0 ];

		this.stroke(params);
	},

	/**
	 * Fill texture with arc.
	 * @param params {Object} Parameters.
	 * @param [params.x=0] {Number=} Offset from the left.
	 * @param [params.y=0] {Number=} Offset from the top.
	 * @param params.color {Hex} Color of the filled arc.
	 * @param [params.borderColor="#000000"] {Hex=} Color of the filled rect.
	 * @param params.radius {Number=} Radius of arc.
	 * @param [params.startAngle=0] {Number=} Starting angle from where arch is being drawn from.
	 * @param [params.endAngle=Math.PI*2] {Number=} End angle to where arc form is drawn.
	 * @param [params.borderWidth=1] {Number=} Thickness of the line.
	 * @param [params.drawOver=false] {Boolean=} Flag - draw over previous texture content.
	 */
	arc: function(params)
	{
		if(!params) {
			console.warn("[Resource.Texture.arc]:", "No parameters specified.");
			return;
		}

		var ctx = this.ctx;
		params.x = params.x || 0;
		params.y = params.y || 0;
		params.radius = params.radius || 5;
		params.startAngle = params.startAngle || 0;
		params.endAngle = params.endAngle || (Math.PI * 2);
		params.borderWidth = params.borderWidth || 1;
		if(!params.color && !params.borderColor) {
			params.borderColor = params.borderColor || "#000000";
		}

		var size = params.radius * 2 + params.borderWidth;
		if(!params.drawOver) {
			this.resize(params.x + size, params.y + size);
		}		

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		ctx.lineWidth = params.borderWidth;
		
		ctx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);
		ctx.beginPath();
		ctx.arc(params.x + params.radius + (params.borderWidth / 2), params.y + params.radius + (params.borderWidth / 2),
			params.radius, params.startAngle, params.endAngle, false);
		ctx.closePath();

		if(params.color) {
			ctx.fillStyle = params.color;
			ctx.fill();
		}

		if(params.borderColor) {
			ctx.strokeStyle = params.borderColor;
			ctx.stroke();
		}		

		if(this.textureType === Resource.TextureType.WEBGL) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	rect: function(params, height, color, borderWidth)
	{
		if(typeof(params) !== "object") 
		{
			this.rect({ 
				width: params, height: height,
				color: color,
				borderWidth: borderWidth
			});
			return;
		}
		if(!params) {
			console.warn("[Resource.Texture.rect]:", "No parameters specified.");
			return;
		}

		var ctx = this.ctx;
		var width = params.width || 1;
		var height = params.height || 1;
		params.color = params.color || "#0000000";
		var borderWidth = params.borderWidth || 1;

		if(!params.drawOver) {
			this.resize(width, height);
		}		

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		ctx.strokeStyle = params.color;
		ctx.lineWidth = borderWidth;

		var halfWidth = Math.ceil(borderWidth / 2);

		if(borderWidth % 2 === 1)
		{
			ctx.save();
			ctx.translate(0.5, 0.5);
			ctx.beginPath();
			ctx.moveTo(halfWidth, halfWidth);
			ctx.lineTo(width - halfWidth - 1, halfWidth);
			ctx.lineTo(width - halfWidth - 1, height - halfWidth - 1);
			ctx.lineTo(halfWidth, height - halfWidth - 1);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
		else 
		{
			ctx.beginPath();
			ctx.moveTo(halfWidth, halfWidth);
			ctx.lineTo(width - halfWidth, halfWidth);
			ctx.lineTo(width - halfWidth, height - halfWidth);
			ctx.lineTo(halfWidth, height - halfWidth);
			ctx.closePath();
			ctx.stroke();	
		}

		if(params.fillColor) {
			ctx.fillStyle = params.fillColor;
			ctx.fill();
		}

		if(this.textureType === Resource.TextureType.WEBGL) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	/**
	 * Draw a rounded rectangle. 
	 */
	roundRect: function(params, height, radius, color, borderWidth)
	{
		if(typeof(params) !== "object") 
		{
			this.roundRect({ 
				width: params, height: height,
				radius: radius,
				color: color,
				borderWidth: borderWidth
			});
			return;
		}		
		if(!params) {
			console.warn("[Resource.Texture.rect]:", "No parameters specified.");
			return;
		}

		var ctx = this.ctx;
		var width = params.width || 1;
		var height = params.height || 1;
		params.color = params.color || "#0000000";
		var radius = params.radius || 1;
		var borderWidth = params.borderWidth || 3;

		if(!params.drawOver) {
			this.resize(width, height);
		}		

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}		

		ctx.strokeStyle = params.color;
		ctx.lineWidth = borderWidth;

		var halfWidth = Math.ceil(borderWidth / 2);

		if(borderWidth % 2 === 1)
		{
			ctx.save();
			ctx.translate(0.5, 0.5);
			ctx.beginPath();
			ctx.moveTo(halfWidth + radius, halfWidth);
			ctx.lineTo(width - halfWidth - radius, halfWidth);
			ctx.quadraticCurveTo(width - halfWidth, halfWidth, width - halfWidth, halfWidth + radius);
			ctx.lineTo(width - halfWidth, height - halfWidth - radius);
			ctx.quadraticCurveTo(width - halfWidth, height - halfWidth, width - halfWidth - radius, height - halfWidth);
			ctx.lineTo(halfWidth + radius, height - halfWidth);
			ctx.quadraticCurveTo(halfWidth, height - halfWidth, halfWidth, height - halfWidth - radius);
			ctx.lineTo(halfWidth, radius + halfWidth);
			ctx.quadraticCurveTo(halfWidth, halfWidth, halfWidth + radius, halfWidth);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
		else 
		{
			ctx.beginPath();
			ctx.moveTo(halfWidth + radius, halfWidth);
			ctx.lineTo(width - halfWidth - radius, halfWidth);
			ctx.quadraticCurveTo(width - halfWidth, halfWidth, width - halfWidth, halfWidth + radius);
			ctx.lineTo(width - halfWidth, height - halfWidth - radius);
			ctx.quadraticCurveTo(width - halfWidth, height - halfWidth, width - halfWidth - radius, height - halfWidth);
			ctx.lineTo(halfWidth + radius, height - halfWidth);
			ctx.quadraticCurveTo(halfWidth, height - halfWidth, halfWidth, height - halfWidth - radius);
			ctx.lineTo(halfWidth, radius + halfWidth);
			ctx.quadraticCurveTo(halfWidth, halfWidth, halfWidth + radius, halfWidth);
			ctx.closePath();
			ctx.stroke();			
		}

		if(params.fillColor) {
			ctx.fillStyle = params.fillColor;
			ctx.fill();
		}

		if(this.textureType === Resource.TextureType.WEBGL) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	bazier: function(color, path, params)
	{
		this.isLoaded = true;
	},


	/**
	 * Emulate(fake) animation dynamically to unaniamted textures.
	 * @param type {Resource.AnimType} Animation type.
	 * @param frames {Number} Number of frames in animation.
	 */
	emulateAnim: function(type, frames)
	{
		if(!this._isLoaded) {
			console.warn("[Resource.Texture.emulateAnim]:", "Texture is not loaded yet.");
			return;
		}

		var animType = Resource.AnimType;

		if(type === animType.NONE) {
			this._anim = null;
		}
		else
		{
			this._anim = {
				type: type
			};

			this.isAnimated = true;
			this.numFrames = frames;

			if(type === animType.LINEAR_H) {
				this._anim.fill = this.trueWidth / (frames - 1);
			}
			else if(type === animType.LINEAR_V) {
				this._anim.fill = this.trueHeight / (frames - 1);
			}
			else if(type === animType.RADIAL)
			{
				console.log("[Resource.Texture.emulateAnim]:", "RADIAL is currently unsupported type.");
				this._anim.halfWidth = (this.trueFullWidth / 2);
				this._anim.halfHeight = (this.trueFullHeight / 2);
				this._anim.fill = (Math.PI * 2 / (frames - 1));
				this._anim.length = Math.sqrt(this._anim.halfWidth * this._anim.halfWidth +
					this._anim.halfHeight * this._anim.halfHeight) + 1 | 0;
			}
			else if(type === animType.RADIAL_TOP_LEFT || type === animType.RADIAL_TOP_RIGHT ||
				type === animType.RADIAL_BOTTOM_LEFT || type === animType.RADIAL_BOTTOM_RIGHT)
			{
				this._anim.fill = (Math.PI * 2 / ((frames - 1) * 4));
				this._anim.length = Math.sqrt(this.trueFullWidth * this.trueFullWidth + this.trueFullHeight * this.trueFullHeight) + 1 | 0;
			}
		}

		this.isLoaded = true;
	},


	gradient: function(data)
	{
		if(!data) {
			console.warn("[Resource.Texture.gradient]:", "No data specified.");
			return;
		}

		if(!data.colors || !data.colors.length) {
			console.warn("[Resource.Texture.gradient]:", "No data.colors specified.");
			return;
		}

		var ctx = this.ctx;
		data.dirX = data.dirX || 0;
		data.dirY = data.dirY || 0;
		data.width = data.width || this.trueFullWidth || 1;
		data.height = data.height || this.trueFullHeight || 1;

		if(!data.drawOver) {
			this.resize(data.width, data.height);
		}

		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		var colors = data.colors;
		var numColors = colors.length;

		var x1, x2, y1, y2;
		if(data.dirX < 0) {
			x1 = this.trueFullWidth
			x2 = 0;
		}
		else {
			x1 = 0;
			x2 = this.trueFullWidth * data.dirX;
		}
		if(data.dirY < 0) {
			y1 = this.trueFullHeight;
			y2 = 0;
		}
		else {
			y1 = 0;
			y2 = this.trueFullHeight * data.dirY;
		}

		var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
		for(var i = 0; i < numColors; i++) {
			gradient.addColorStop(colors[i][0], colors[i][1]);
		}

		ctx.fillStyle = gradient;

		ctx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight);
		ctx.fillRect(0, 0, this.trueFullWidth, this.trueFullHeight);

		if(this.textureType) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	grid: function(params, cellHeight, numCellsX, numCellsY)
	{
		// Init.
		if(typeof(params) === "number") 
		{
			this.grid({ cellWidth: params, cellHeight: cellHeight, 
				numCellsX: numCellsX, numCellsY: numCellsY
			});
			return;
		}

		if(!params) {
			console.warn("[Resource.Texture.grid]:", "No params specified.");
			return;
		}

		var cellWidth = params.cellWidth || 1;
		var cellHeight = params.cellHeight || 1;
		var numCellsX = params.numCellsX || 1;
		var numCellsY = params.numCellsY || 1;
		params.x = params.x || 0;
		params.y = params.y || 0;
		params.color = params.color || "#000000";
		params.borderWidth = params.borderWidth || 1;
		params.drawOver = params.drawOver || false;

		var width = params.x + (params.cellWidth * params.numCellsX) + 1;
		var height = params.y + (params.cellHeight * params.numCellsY) + 1;	

		if(!params.drawOver) {
			this.resize(width, height);
		}		

		var ctx = this.ctx;	
		if(this.textureType) {
			this._createCachedImg();
			ctx = this._cachedCtx;
		}

		// Rendering.
		ctx.strokeStyle = params.color;
		ctx.lineWidth = params.borderWidth;

		ctx.save();
		ctx.translate(0.5, 0.5);

		for(var x = 0; x < (numCellsX + 1); x++) {
			ctx.moveTo((x * cellHeight), 0);
			ctx.lineTo((x * cellHeight), height);
		}

		for(var y = 0; y < (numCellsY + 1); y++) {
			ctx.moveTo(0, (y * cellHeight));
			ctx.lineTo(width, (y * cellHeight));
		}

		ctx.stroke();
		ctx.restore();

		// Update.
		if(this.textureType) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;					
	},


	/**
	 * Callback used if ond to another texture.
	 * @param event {*} Event type.
	 * @param data {*} Event data.
	 */
	onTextureEvent: function(event, data)
	{
		if(event === Resource.Event.LOADED) {
			this.tile(data);
			data.unsubscribe(this);
		}
	},


	construct: function(data)
	{
		if(!data) {
			console.warn("[Resource.Texture.buildMatrix]:", "No parameters specified.");
			return;
		}

		this._constructTex(data, "center");
		this._constructTex(data, "left");
		this._constructTex(data, "right");

		data.width = data.width || this.trueFullWidth;
		data.height = data.height || this.trueFullHeight;
		this.resize(data.width, data.height);
		console.log(this.trueWidth, this.trueHeight);

		var left = ((data.width / 2) - (data.center.width / 2)) | 0;
		var top = ((data.height / 2) - (data.center.height / 2)) | 0;
		console.log(left);

		var ctx = this.ctx;

//		// Left.
//		var tex = data.left;
//		var pos = -tex.width + left;
//		var numTex = Math.ceil(left / tex.width);
//		for(var n = 0; n < numTex; n++) {
//			ctx.drawImage(tex, pos, 0);
//			pos += tex.width;
//		}

		// Center.
		ctx.drawImage(data.center, left, top);

//		// Right.
//		tex = data.right;
//		pos = left + data.center.width;
//		numTex = Math.ceil(left / tex.width);
//		console.log(numTex);
//		for(n = 0; n < numTex; n++) {
//			ctx.drawImage(tex, pos, 0);
//			pos += tex.width;
//		}

		if(this.textureType) {
			var gl = meta.ctx;
			gl.bindTexture(gl.TEXTURE_2D, this.image);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._cachedImg);
		}

		this.isLoaded = true;
	},

	_constructTex: function(data, texture)
	{
		if(data[texture] && typeof(data[texture]) === "string")
		{
			data[texture] = Resource.ctrl.getTexture(data[texture]);

			if(!data[texture]) {
				console.warn("[Resource.Texture.buildMatrix]:", "Undefined texture for: " + texture);
				return;
			}

			data[texture] = data[texture].image;
		}
	},	


	/**
	 * Generate alpha mask from texture.
	 * @returns {Resource.Texture} Generated alpha mask texture.
	 */
	generateAlphaMask: function()
	{
		if(!this._isLoaded) {
			console.warn("[Resource.Texture.generateMask]:", "Texture is not loaded yet.");
			return;
		}

		if(this.textureType !== 0) {
			console.warn("[Resource.Texture.generateMask]:", "Only canvas textures are supported currently.");
			return;
		}

		var alphaMask = new Resource.Texture(Resource.TextureType.CANVAS);
		alphaMask.resize(this.trueFullWidth, this.trueFullHeight);

		var imgData = this.ctx.getImageData(0, 0, this.trueFullWidth, this.trueFullHeight);
		var data = imgData.data;
		var numBytes = data.length;

		for(var i = 0; i < numBytes; i += 4) {
			data[i] = 255;
			data[i + 1] = 255;
			data[i + 2] = 255;
		}

		alphaMask.ctx.putImageData(imgData, 0, 0);
		alphaMask.isLoaded = true;

		return alphaMask;
	},


	onTextureCacheEvent: function(data, event)
	{
		if(event === Resource.Event.LOADED) 
		{
			data.unsubscribe(this);
			if(this._loadCache.name === "drawOver") {
				this.drawOver(this._loadCache.texture, this._loadCache.x, this._loadCache.y);
			}
			else {
				this[this._loadCache.name](this._loadCache.data);
			}
			this._loadCache = null;
		}
	},


	set x(value) 
	{
		if(!this.ptr) {
			this._x = 0;
			return;
		}

		if(this.textureType) {
			this._xRatio = 1.0 / this.ptr.trueFullWidth;
			this._x = this._xRatio * value;
		}
		else {
			this._x = value;
		}
	},

	set y(value) 
	{
		if(!this.ptr) {
			this._y = 0;
			return;
		}

		if(this.textureType) {
			this._yRatio = 1.0 / this.ptr.trueFullHeight;
			this._y = this._yRatio * value;
		}
		else {
			this._y = value;
		}
	},

	get x() { return this._x; },
	get y() { return this._y; },

	set offsetX(x)
	{
		this._offsetX = x;
		if(this._isLoaded) {
			this.emit(this, Resource.Event.CHANGED);
		}
	},

	set offsetY(y)
	{
		this._offsetY = y;
		if(this._isLoaded) {
			this.emit(this, Resource.Event.CHANGED);
		}
	},

	get offsetX() { return this._offsetX; },
	get offsetY() { return this._offsetY; },


	set bgTexture(texture)
	{
		if(typeof(texture) === "string")
		{
			var obj = Resource.ctrl.getTexture(texture);
			if(!obj) {
				console.warn("[Resource.Texture.bgTexture]:", "No such texture found: " + texture);
				return;
			}
			texture = obj;
		}

		this._bgTexture = texture;
		this.isLoaded = true;
	},
	get bgTexture() { return this._bgTexture; },


	//
	type: Resource.Type.TEXTURE,
	textureType: Resource.TextureType.UNKNOWN,

	image: null,
	ctx: null,
	_bgTexture: null,

	vbo: null, _vertices: null,

	_x: 0, _y: 0,
	_xRatio: 0.0, _yRatio: 0.0,
	_width: 0, _height: 0,
	fullWidth: 0, fullHeight: 0,
	_widthRatio: 0, _heightRatio: 0,
	_offsetX: 0, _offsetY: 0,
	unitRatio: 1,

	fps: 0,
	numFrames: 1,
	numFramesX: 1,
	numFramesY: 1,

	isAnimated: false,
	isLoop: false,
	autoPlay: true,
	isAnimReverse: false,
	isEmulateReverse: false,
	fromAtlas: false,

	isReloading: false,

	_tmpImg: null,
	_tmpCtx: null,
	_cachedImg: null,
	_cachedCtx: null,

	_anim: null,
	_frames: null,

	_loadCache: null,
	_canvasCache: null,
	_maxResCanvasCache: null,
	_maxResCtxCache: null
});