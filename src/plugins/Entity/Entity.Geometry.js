"use strict";

/**
 * @class Entity.Geometry
 * @memberof Entity
 * @param [id=-1] {Number} Unique ID of entity which is set after adding it to Entity.Manager. Default value is -1.
 * @param [name=""] {String} Name of the entity.
 * @param [x=0] {Number} Position on x axis.
 * @param [y=0] {Number} Position on y axis.
 * @param [texture=null] {Resource.Texture=} <b>Setter/Getter.</b> Set the current texture. Will call <b>this.setTexture()</b> function.
 * @param [components=null] {Object=} References to the added components.
 * @param componentBuffer {Array} References to the added components.
 * @param numComponents {Number} Number of components added.
 * @param [flipX=0] {Number=} <b>Setter/Getter.</b> Set flip by X axis. Valid inputs: -1.0 or 1.0.
 * @param [flipY=0] {Number=} <b>Setter/Getter.</b> Set flip by Y axis. Valid inputs: -1.0 or 1.0.
 * @param [isRemoved=false] {Boolean=} <b>Setter/Getter.</b> Flag that tells if entity is flagged as removed(or will be removed ASAP).
 * @param [isLoaded=false] {Boolean=} <b>Setter/Getter.</b> Flag if entity is loaded. If entity has setted texture which is not yet laoded this flag will be false.
 * @param [isCached=false] {Boolean=} <b>Setter/Getter.</b> Flag if entity is cached.
 * @param [tChange=0] {Number=} Time when the last change happened.
 * @param [fps=0] {Number=} Animation speed (Frames per second).
 * @param [currFrame=0] {Number=} <b>Setter/Getter.</b> Current animation frame.
 * @param [animSpeed=0] {Number=} Animation speed modifier.
 * @param [isLoop=false] {Boolean=} Flag if animation should loop forever.
 * @param [isAnimReverse=false] {Boolean=} Flag if animation should play backwards.
 * @param [pauseAtEnd=false] {Boolean=} Pause animation at the end.
 * @param [pickable=true] {Boolean=} Flag if entity is pickable by input.
 * @param [isHover=false] {Boolean=} Flag if input is hovering on top of entity.
 * @param [isPressed=false] {Boolean=} Flag if entity is pressed by input.
 * @param [isDragged=false] {Boolean=} Flag if entity is being dragged.
 * @param pivotX {Number} PivotX
 */
Entity.Geometry = meta.Class.extend
( /** @lends Entity.Geometry.prototype */ {

	_init: function(params)
	{
		this.id = this._entityCtrl.getUniqueID();
		this.name = "entity" + this.id;
		this.volume = new meta.math.AdvAABB(0, 0, 0, 0);
		this._parent = this._entityCtrl;

		this._depthNode = new Entity.DepthList.Node();

		this._initParams(params);
	},

	_initParams: function(params)
	{
		if(params)
		{
			if(typeof(params) === "object")
			{
				if(params instanceof Resource.Texture) {
					this.texture = params;
				}
				else 
				{
					for(var key in params) {
						this[key] = params[key];
					}
				}
			}
			else if(typeof(params) === "string") {
				this.texture = params;
			}
		}		
	},


	/**
	 * Destroy and remove entity from all views.
	 */
	remove: function()
	{
		if(this.isRemoved) { return; }
		this.isRemoved = true;

		if(this._view)
		{
			if(this._parent === this._entityCtrl) {
				this._view.remove(this);
			}
			else
			{
				if(this._view._isActive) {
					this._entityCtrl.entitiesToRemove.push(this);
					this._entityCtrl.numEntitiesToRemove++;
				}
				else {
					this._view = null;
				}
			}

			if(this._tween) {
				this._tween.clear();
				this._tween.owner = null;
			}

			if(this.children) {
				this.removeChilds();
			}
		}
		else 
		{
			if(this.components) {
				this.removeComponents();
			}
		}

		if(this._onResize) {
			this.onResize = null;
		}
	},

	/**
	 * Remove all dependencies that are left.
	 */
	removeFully: function()
	{
		this.isUpdating = false;
		this._depthNode.entity = null;

		if(this.components) {
			this.removeComponents();
		}	
	},

	/**
	 * Remove all attached childs.
	 */
	removeChilds: function()
	{
		var numChildren = this.children.length;
		for(var i = 0; i < numChildren; i++) {
			this.children[i].remove()
		}
	},


	/**
	 * Clone entity.
	 * @return {Entity.Geometry} Cloned entity.
	 */
	clone: function()
	{
		var clone = new Entity.Geometry();

		for(var key in this)
		{
			if(clone[key] === this[key]) {
				continue;
			}

			clone[key] = this[key];
		}

		clone.id = this._entityCtrl.getUniqueID();
		return clone;
	},


	/**
	 * Draw entity on context.
	 * @param ctx {Context} Context to draw on.
	 */
	draw: function(ctx) {
		this._draw(ctx);
	},

	_draw: function(ctx) {
		this._drawDefault(ctx);
	},

	_drawDefault: function(ctx)
	{
		if(!this._texture) { return; }

		var unitSize = this.meta.unitSize;
		if(!this._texture.isAnimated) {
			this._texture.draw(ctx, (this.drawX | 0) * unitSize, (this.drawY | 0) * unitSize);
		}
		else 
		{
			this._texture.drawFrame(ctx, (this.drawX | 0) * unitSize, (this.drawY | 0) * unitSize, 
				this._currFrame, this.isEmulateReverse);
		}
	},

	_drawTransform: function(ctx)
	{
		if(!this._texture) { return; }

		ctx.save();
		ctx.globalAlpha = this.totalAlpha;

		var unitSize = this.meta.unitSize;
		var posX = (this.volume.x - this.pivotX) * unitSize;
		var posY = (this.volume.y - this.pivotY) * unitSize;

		if(!this.isChild) 
		{
			ctx.translate(posX, posY);
			ctx.rotate(this._angleRad);
			ctx.scale(this.totalScaleX * this._flipX, this.totalScaleY * this._flipY);
			ctx.translate(-posX, -posY);
		}
		else
		{
			var posX = (this.volume.x - this.pivotX) * unitSize;
			var posY = (this.volume.y - this.pivotY) * unitSize;			
			var parentOffsetX = (this._parent.volume.x - this._parent.pivotX) * unitSize;
			var parentOffsetY = (this._parent.volume.y - this._parent.pivotY) * unitSize;

			ctx.translate(parentOffsetX, parentOffsetY);
			ctx.rotate(this._parent.totalAngleRad);
			ctx.translate(-parentOffsetX, -parentOffsetY);

			ctx.translate(posX, posY);
			ctx.rotate(this._angleRad);
			ctx.translate(-posX, -posY);
		}

		if(!this.texture.isAnimated) {
			this._texture.draw(ctx, (this.drawX | 0) * unitSize, (this.drawY | 0) * unitSize);
		}
		else 
		{
			this._texture.drawFrame(ctx, (this.drawX | 0) * unitSize, (this.drawY | 0) * unitSize, 
				this._currFrame, this.isEmulateReverse);
		}

		ctx.restore();
	},

	/**
	 * Update function.
	 * @param tDelta {Number} Delta time between frames.
	 */
	update: null,

	_updateComponents: function(tDelta)
	{
		var comp;
		for(var n = 0; n < this.numComponents; n++)  
		{
			comp = this.componentBuffer[n];
			if(comp.update) {
				comp.update(tDelta);
			}
		}
	},

	_updateAnim: function(tDelta)
	{
		if(this.animSpeed <= 0.0 || this._texture.numFrames < 2) { return; }

		var delay = 1.0 / (this.fps * this.animSpeed);

		this._tAnim += tDelta;
		if(this._tAnim < delay) { return; }

		this.isNeedDraw = true;

		var numFrames = this._tAnim / delay | 0;
		this._tAnim -= (delay * numFrames);

		if(!this._isAnimReverse)
		{
			this._currFrame += numFrames;

			if(this._currFrame >= this._texture.numFrames)
			{
				if(this.pauseAtEnd) {
					this.isAnimating = false;
					this._currFrame = this._texture.numFrames - 1;					
				}				
				else if(!this.isLoop && !this._texture.isLoop) {
					this.isAnimating = false;
					this._currFrame = 0;
				}
				else {
					this._currFrame = this._currFrame % this._texture.numFrames;
				}

				if(this.onAnimEnd) {
					this.onAnimEnd();
				}
			}
		}
		else
		{
			this._currFrame -= numFrames;

			if(this._currFrame < 0)
			{
				if(this.pauseAtEnd) {
					this.isAnimating = false;
					this._currFrame = 0;
				}				
				else if(!this.isLoop && !this._texture.isLoop) {
					this.isAnimating = false;
					this._currFrame = this._texture.numFrames - 1;
				}
				else {
					this._currFrame = (this._texture.numFrames + this._currFrame) % this._texture.numFrames;
				}				

				if(this.onAnimEnd) {
					this.onAnimEnd();
				}
			}
		}
	},


	/**
	 * Start playing animation.
	 * @param isLoop {Boolean} Flag if aniamtion should play forever in loop until stopped.
	 * @param fps {Number=} Animation speed (frames per second). If it's not set then will use fps from texture.
	 */
	play: function(isLoop, fps)
	{
		if(!this.texture || !this.texture.isAnimated) {
			return;
		}

		if(isLoop) {
			this.isLoop = true;
		}
		else {
			this.isLoop = false;
		}

		this.fps = fps || this.texture.fps;
		this.currFrame = 0;
		this.isAnimating = true;
		this.pauseAtEnd = false;
		this._isAnimReverse = false;
	},

	/**
	 * Start playing animation. Will pause at the last frame.
	 * @param fps {Number=} Animation speed (frames per second). If it's not set then will use fps from texture.
	 */
	playAndPause: function(fps)
	{
		this.play(false, fps);
		this.pauseAtEnd = true;
	},

	/**
	 * Start playing animation in reverse.
	 * @param isLoop {Boolean} Flag if aniamtion should play forever in loop until stopped.
	 * @param fps {Number=} Animation speed (frames per second). If it's not set then will use fps from texture.
	 */
	playReverse: function(isLoop, fps)
	{
		if(!this.texture) { return; }

		this.play(isLoop, fps);
		this.currFrame = this.texture.numFrames - 1;
		this._isAnimReverse = true;
	},

	/**
	 * Start playing animation in reverse. Will pause at the last frame.
	 * @param fps {Number=} Animation speed (frames per second). If it's not set then will use fps from texture.
	 */
	playReverseAndPause: function(fps)
	{
		this.playReverse(false, fps);
		this.pauseAtEnd = true;
	},

	/**
	 * Stop animation. Will reset to first frame.
	 */
	stop: function()
	{
		if(this._texture)
		{
			this.isLoop = this._texture.isLoop;
			if(this._isAnimReverse) {
				this.currFrame = this._texture.numFrames - 1;
			}
			else {
				this.currFrame = 0;
			}
		}
		else {
			this.isLoop = false;
			this.currFrame = 0;
		}

		this.isAnimating = false;
	},

	/**
	 * Pause entity logic updating (for example - animations).
	 */
	pause: function() {
		this.isAnimating = false;
	},

	/**
	 * Resume entity logic updating.
	 */
	resume: function() {
		this.isAnimating = true;
	},


	/**
	 * Force world position to entity.
	 * @param x {Number} World position on X axis.
	 * @param y {Number} World position on Y axis.
	 */
	forcePosition: function(x, y)
	{
		this._x = x;
		this._y = y;
		this.updatePos();
	},

	/**
	 * Update all position related variables.
	 */
	updatePos: function()
	{
		this.drawSrcX = this._x + this._parent.childOffsetX + this.textureOffsetX + this._anchorPosX;
		this.drawSrcY = this._y + this._parent.childOffsetY + this.textureOffsetY + this._anchorPosY;
		if(this._view) {
			this.drawSrcX += this._view._x;
			this.drawSrcX += this._view._y;
		}

		this.volume.set(this.drawSrcX + this.pivotX, this.drawSrcY + this.pivotY);
		this.drawX = this.drawSrcX - this.volume.initHalfWidth + this.pivotSrcX;
		this.drawY = this.drawSrcY - this.volume.initHalfHeight + this.pivotSrcY;

		if(this.children)
		{			
			this.childOffsetX = this._x + this.childPivotX + this._anchorPosX;
			this.childOffsetY = this._y + this.childPivotY + this._anchorPosY;

			if(this._view) {
				this.childOffsetX += this._view._x;
				this.childOffsetY += this._view._y;
			}		

			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++) {
				this.children[i].updatePos();
			}
		}

		this.isNeedDraw = true;
	},

	/**
	 * Update position from position type.
	 */
	updatePosType: function()
	{
		if(this.positionType === 0) {
			return;
		}

		// TopLeft
		if(this.positionType === 1) {
			this._x = (this.typeX + this.volume.halfWidth) | 0;
			this._y = (this.typeY + this.volume.halfHeight) | 0;	
		}
		// TopRight
		else if(this.positionType === 2) {
			this._x = (this.typeX - this.volume.halfWidth) | 0;
			this._y = (this.typeY + this.volume.halfHeight) | 0;
		}
		// BottomLeft
		else if(this.positionType === 3) {
			this._x = (this.typeX + this.volume.halfWidth) | 0;
			this._y = (this.typeY - this.volume.halfHeight) | 0;			
		}
		// BottomRight
		else if(this.positionType === 4) {
			this._x = (this.typeX - this.volume.halfWidth) | 0;
			this._y = (this.typeY - this.volume.halfHeight) | 0;	
		}
		// Top
		else if(this.positionType === 5) {
			this._y = (this.typeY + this.volume.halfHeight) | 0;		
		}
		// Bottom
		else if(this.positionType === 6) {
			this._y = (this.typeY - this.volume.halfHeight) | 0;	
		}
		// Left
		else if(this.positionType === 7) {
			this._x = (this.typeX + this.volume.halfWidth) | 0;
		}
		// Right
		else if(this.positionType === 8) {
			this._x = (this.typeX - this.volume.halfWidth) | 0;
		}		
	},

	/**
	 * Update offsets and volume from the texture.
	 */
	updateFromTexture: function()
	{
		var unitRatio = this.meta.unitRatio;			
		this.volume.resizeInit(this._texture._width * unitRatio, this._texture._height * unitRatio);	

		this.updatePosType();
		this.updatePos();

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++) 
			{
				var child = this.children[i];
				if(child.positionType) {
					child.updatePosType();
				}
				child.updateAnchor();				
			}
		}					
	},	

	/* 
	 * Called when resolution has been changed.
	 */
	adapt: function()
	{
		if(!this._texture) {
			this.volume.unitSize = meta.unitSize;
			this.updatePosType();
			this.updatePos();
		}
	},

	/**
	 * Set entity world position to x, y.
	 * @param x {Number} World position on X axis.
	 * @param y {Number} World position on Y axis.
	 */
	position: function(x, y)
	{
		this.positionType = 0;

		if(this._x === x && this._y === y) { return; }

		this._x = x;
		this._y = y;
		this.updatePos();
	},

	/**
	 * Add delta position to world x, y.
	 * @param deltaX {Number} Amount to add to x position.
	 * @param deltaY {Number} Amount to add to y position.
	 */
	move: function(deltaX, deltaY)
	{
		var newX = this._x + deltaX;
		var newY = this._y + deltaY;

		if(this._x === newX && this._y === newY) { return; }
		this.forcePosition(newX, newY);
	},	

	moveForward: function(delta)
	{
		var newX = this._x + (delta * Math.cos(this._angleRad - 1.57079));
		var newY = this._y + (delta * Math.sin(this._angleRad - 1.57079));

		if(this._x === newX && this._y === newY) { return; }
		this.forcePosition(newX, newY);
	},

	moveDirected: function(delta, angleOffset)
	{
		var newX = this._x + (-delta * Math.cos(this._angleRad - 1.57079 + angleOffset));
		var newY = this._y + (-delta * Math.sin(this._angleRad - 1.57079 + angleOffset));

		if(this._x === newX && this._y === newY) { return; }
		this.forcePosition(newX, newY);		
	},

	strafe: function(delta)
	{
		var newX = this._x + (-delta * Math.cos(this._angleRad + Math.PI));
		var newY = this._y + (-delta * Math.sin(this._angleRad + Math.PI));

		if(this._x === newX && this._y === newY) { return; }
		this.forcePosition(newX, newY);		
	},

	/**
	 * Position entity from top left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionTopLeft: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 1) { return; }

		this.positionType = 1;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX + this.volume.halfWidth) | 0;
		this._y = (this.typeY + this.volume.halfHeight) | 0;
		this.updatePos();	
	},

	/**
	 * Position entity from top right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionTopRight: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 2) { return; }

		this.positionType = 2;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX - this.volume.halfWidth) | 0;
		this._y = (this.typeY + this.volume.halfHeight) | 0;
		this.updatePos();		
	},

	/**
	 * Position entity from bottom left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionBottomLeft: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 3) { return; }

		this.positionType = 3;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX + this.volume.halfWidth) | 0;
		this._y = (this.typeY - this.volume.halfHeight) | 0;	
		this.updatePos();		
	},

	/**
	 * Position entity from bottom right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionBottomRight: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 4) { return; }

		this.positionType = 4;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX - this.volume.halfWidth) | 0;
		this._y = (this.typeY - this.volume.halfHeight) | 0;	
		this.updatePos();	
	},

	/**
	 * Position entity from top side.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionTop: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 5) { return; }

		this.positionType = 5;
		this.typeX = x;
		this.typeY = y;
		this._x = x;
		this._y = (this.typeY + this.volume.halfHeight) | 0;	
		this.updatePos();		
	},

	/**
	 * Position entity from bottom side.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionBottom: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 6) { return; }

		this.positionType = 6;
		this.typeX = x;
		this.typeY = y;
		this._x = x;
		this._y = (this.typeY - this.volume.halfHeight) | 0;	
		this.updatePos();	
	},

	/**
	 * Position entity from left side.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionLeft: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 7) { return; }

		this.positionType = 7;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX + this.volume.halfWidth) | 0;
		this._y = y;
		this.updatePos();		
	},

	/**
	 * Position entity from right side.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	positionRight: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 8) { return; }

		this.positionType = 8;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX - this.volume.halfWidth) | 0;
		this._y = y;
		this.updatePos();
	},

	/**
	 * Position entity from top left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	topLeft: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 1) { return; }

		this.positionType = 1;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX + this.volume.halfWidth) | 0;
		this._y = (this.typeY + this.volume.halfHeight) | 0;
		this.updatePos();		
	},

	/**
	 * Position entity from top right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	topRight: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 2) { return; }

		this.positionType = 2;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX - this.volume.halfWidth) | 0;
		this._y = (this.typeY + this.volume.halfHeight) | 0;
		this.updatePos();	
	},

	/**
	 * Position entity from bottom left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	bottomLeft: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 3) { return; }

		this.positionType = 3;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX + this.volume.halfWidth) | 0;
		this._y = (this.typeY - this.volume.halfHeight) | 0;	
		this.updatePos();	
	},

	/**
	 * Position entity from bottom right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	bottomRight: function(x, y)
	{
		if(this._x === x && this._y === y && this.positionType === 4) { return; }

		this.positionType = 4;
		this.typeX = x;
		this.typeY = y;
		this._x = (this.typeX - this.volume.halfWidth) | 0;
		this._y = (this.typeY - this.volume.halfHeight) | 0;	
		this.updatePos();	
	},	

	/**
	 * Position entity from top.
	 * @param y {Number} Position on y axis.
	 */
	set top(y) {
		this.positionTop(this._x, y);	
	},

	/**
	 * Position entity from bottom.
	 * @param x {Number} Position on y axis.
	 */
	set bottom(y) {
		this.positionBottom(this._x, y);	
	},	

	/**
	 * Position entity from left side.
	 * @param x {Number} Position on x axis.
	 */
	set left(x) {
		this.positionLeft(x, this._y);	
	},

	/**
	 * Position entity from right side.
	 * @param x {Number} Position on x axis.
	 */
	set right(x) {
		this.positionRight(x, this._y);	
	},		

	/**
	 * Get entity top side position.
	 */
	get top() { return this.volume.minY; },

	/**
	 * Get entity bottom side position.
	 */	
	get bottom() { return this.volume.maxY; },

	/**
	 * Get entity left side position.
	 */		
	get left() { return this.volume.minX; },

	/**
	 * Get entity right side position.
	 */	
	get right() { return this.volume.maxX; },

	/**
	 * Set pivot as ratio. Using prefixed position function will set this to other value.
	 * @param x {Number} Ratio on X axis [-1 .. 1].
	 * @param y {Number} Ratio on Y axis [-1 .. 1].
	 */
	pivot: function(x, y)
	{
		if(y === void(0)) {
			y = x;
		}

		this.pivotRatioX = x;
		this.pivotRatioY = y;

		this.updatePivot();
		this.updatePos();
	},

	updatePivot: function()
	{
		this.pivotSrcX = -this.pivotRatioX * this.volume.initHalfWidth;
		this.pivotSrcY = -this.pivotRatioY * this.volume.initHalfHeight;
		this.pivotX = this.pivotSrcX * this._scaleX;
		this.pivotY = this.pivotSrcY * this._scaleY;

		if(this.id == 2) {
			console.log(this.pivotX, this.pivotY, this.pivotSrcX, this.pivotSrcY);
		}

		if(this.children) 
		{
			this.childPivotX = ((-this.pivotRatioX - 1.0) * this.volume.initHalfWidth);
			this.childPivotY = ((-this.pivotRatioY - 1.0) * this.volume.initHalfHeight);
			this.childOffsetX = this._x + this.childPivotX + this._anchorPosX;
			this.childOffsetY = this._y + this.childPivotY + this._anchorPosY;
		}		
	},

	/**
	 * Set pivot in pixels. Using prefixed position function will set this to other value.
	 * @param x {Number} Pixels from center on X axis.
	 * @param y {Number} Pixels from center on Y axis.
	 */
	pivotPx: function(x, y)
	{
		if(y === void(0)) {
			y = x;
		}

		this.pivotX = x;
		this.pivotY = y;
		if(this.children) {
			this.childOffsetX = this._x + pivotX + this._anchorPosX;
			this.childOffsetY = this._y + pivotY + this._anchorPosY;
		}

		this.updatePos();
	},	

	/**
	 * Set entity world position to center x, y.
	 * @param x {Number} World position on X axis.
	 * @param y {Number} World position on Y axis.
	 */
	pivotCenter: function(x, y)
	{
		if(this.pivotRatioX !== 0.0 && this.pivotRatioY !== 0.0) {
			this._x = x;
			this._y = y;
			this.pivot(0.0, 0.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},	

	/**
	 * Pivot and position entity from top left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotTopLeft: function(x, y)
	{
		if(this.pivotRatioX !== -1.0 && this.pivotRatioY !== -1.0) {
			this._x = x;
			this._y = y;
			this.pivot(-1.0, -1.0);
			return;
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from top right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotTopRight: function(x, y)
	{
		if(this.pivotRatioX !== 1.0 && this.pivotRatioY !== -1.0) {
			this._x = x;
			this._y = y;
			this.pivot(1.0, -1.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from bottom left corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotBottomLeft: function(x, y)
	{
		if(this.pivotRatioX !== -1.0 && this.pivotRatioY !== 1.0) {
			this._x = x;
			this._y = y;			
			this.pivot(-1.0, 1.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from bottom right corner.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotBottomRight: function(x, y)
	{
		if(this.pivotRatioX !== 1.0 && this.pivotRatioY !== 1.0) {
			this._x = x;
			this._y = y;		
			this.pivot(1.0, 1.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from top edge.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotTop: function(x, y)
	{
		if(this.pivotRatioX !== 0.0 && this.pivotRatioY !== -1.0) {
			this._x = x;
			this._y = y;
			this.pivot(0.0, -1.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from bottom edge.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotBottom: function(x, y)
	{
		if(this.pivotRatioX !== 0.0 || this.pivotRatioY !== 1.0) {
			this._x = x;
			this._y = y;
			this.pivot(0.0, 1.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from left edge.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotLeft: function(x, y)
	{
		if(this.pivotRatioX !== -1.0 && this.pivotRatioY !== 0.0) {
			this._x = x;
			this._y = y;
			this.pivot(-1.0, 0.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Pivot and position entity from right edge.
	 * @param x {Number} Position on x axis.
	 * @param y {Number} Position on y axis.
	 */
	pivotRight: function(x, y)
	{
		if(this.pivotRatioX !== 1.0 && this.pivotRatioY !== 0.0) {
			this._x = x;
			this._y = y;
			this.pivot(1.0, 0.0);
			return
		}

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);
	},

	/**
	 * Center entity relative to parent size.
	 * @param x {Number} Centering ratio on X axis. [0.0 ... 1.0]
	 * @param y {Number} Centering ratio on Y axis. [0.0 ... 1.0]
	 */
	anchor: function(x, y)
	{
		if(y === void(0)) {
			y = x;
		}

		if(this._anchorX === x && this._anchorY === y) {
			return;
		}

		this._anchorX = x;
		this._anchorY = y;

		if(!(this._flags & this.Flag.ANCHOR)) {
			this.isAnchor = true;
			var self = this;
			this._onResize_interal = function() { self.updateAnchor(); };
			this.handleResizeFunc();
		}

		this.updateAnchor();
	},

	updateAnchor: function()
	{
		if(this._flags & this.Flag.IGNORE_ZOOM) {
			this._anchorPosX = (this._parent.volume.width * (1.0 / this._parent.volume.scaleX) * this._anchorX + 0.5) | 0;
			this._anchorPosY = (this._parent.volume.height * (1.0 / this._parent.volume.scaleY) * this._anchorY + 0.5) | 0;				
		}
		else {
			this._anchorPosX = (this._parent.volume.width * this._anchorX + 0.5) | 0;
			this._anchorPosY = (this._parent.volume.height * this._anchorY + 0.5) | 0;
		}

		this.updatePos();

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++) {
				this.children[i].updateAnchor();
			}
		}
	},	


	/**
	 * Set position from where entity will be dragged from.
	 * @param x {Number} Drag position on X axis.
	 * @param y {Number} Drag position on Y axis.
	 */
	dragStart: function(x, y) {
		this._dragOffsetX = (this._x + this._anchorPosX) - x;
		this._dragOffsetY = (this._y + this._anchorPosY) - y;
	},

	/**
	 * Set entity as not being dragged anymore.
	 * @param x {Number} Drag position on X axis.
	 * @param y {Number} Drag position on Y axis.
	 */
	dragEnd: function() {
		this._dragOffsetX = 0;
		this._dragOffsetY = 0;
	},

	/**
	 * Drag entity to position. If entity is anchored then anchorPos will be discarded from x, y.
	 * @param x {Number} World position on X axis.
	 * @param y {Number} World position on Y axis.
	 */
	dragTo: function(x, y)
	{
		x -= this._anchorPosX - this._dragOffsetX;
		y -= this._anchorPosY - this._dragOffsetY;

		if(this._x === x && this._y === y) { return; }
		this.forcePosition(x, y);		
	},	


	/**
	 * Check if point is inside entity.
	 * @param x {Number} Point x position.
	 * @param y {Number} Point y position.
	 * @returns {Boolean} True if is inside entity.
	 */
	isInside: function(x, y) {
		return this.volume.vsBorderPoint(x, y);
	},

	_isInsideDefault: function(x, y) {
		return this.volume.vsBorderPoint(x, y);
	},

	_isInsideTransform: function(x, y)
	{
		var centerX = this._anchorPosX + this._parent.childOffsetX;
		var centerY = this._anchorPosY + this._parent.childOffsetY;
		if(!this.isChild) {
			centerX += this._x;
			centerY += this._y;
		}

		var offsetX = x - centerX;
		var offsetY = y - centerY;
		var sin = Math.sin(-this._angleRad);
		var cos = Math.cos(-this._angleRad);

		var newX = offsetX * cos - offsetY * sin + centerX;
		var newY = offsetY * cos + offsetX * sin + centerY;

		return this.volume.vsBorderPoint(newX, newY);
	},

	vsEntity: function(entity) {
		return this.volume.vsAABB(entity.volume);
	},


	/**
	 * Resize entity volume. These changes will be overwritten if entity will change texture.
	 * @param width {Number} New width of the volume.
	 * @param height {Number} New Height of the volume.
	 */
	resize: function(width, height)
	{
		if(height === void(0)) { height = this.volume.height; }

		this.volume.resize(width, height);
	},


	/**
	 * Set current texture.
	 * @param texture {Resource.Texture} Texture to be set.
	 * @return {Resource.Texture} Return texture that was set.
	 * @function
	 */
	setTexture: function(texture)
	{
		if(typeof(texture) === "string")
		{
			var textureName = texture;
			texture = meta.getTexture(textureName);
			if(!texture) {
				this._texture = textureName;
				meta.subscribe(this, Resource.Event.ALL_LOADED, this._onResAllLoaded);
				return;
			}
		}

		if(this._texture) {
			this._texture.unsubscribe(this);
		}

		if(texture)
		{
			if(!(texture instanceof Resource.Texture)) {
				console.warn("[Entity.Geometry.setTexture]:", "Texture should extend Resource.Texture class.");
				return null;
			}

			this._texture = texture;
			this._texture.subscribe(this, this._onTextureEvent);

			this.textureOffsetX = this._texture._offsetX;
			this.textureOffsetY = this._texture._offsetY;

			if(!this._texture._isLoaded) 
			{
				this.isLoaded = false;
				if(!this._texture.isLoading) {
					this._texture.load();
				}
			}
			else {
				this.isLoaded = true;
				this.updateFromTexture();
			}			

			if(texture.isAnimated)
			{
				if(!this.isAnimating) {
					this.isAnimating = texture.autoPlay;
				}
				if(texture.isEmulateReverse) {
					this.isEmulateReverse = true;
				}

				this.isAnimReverse = texture.isAnimReverse;
			}

			return texture;
		}
		else {
			this._texture = null;
			this.isLoaded = false;
		}

		return null;
	},


	/**
	 * Callback for texture events.
	 * @param data {*} Data of the event.
	 * @param event {*} Type of the event.
	 */
	_onTextureEvent: function(data, event)
	{
		var resEvent = Resource.Event;
		if(event === resEvent.LOADED) {
			this.updateFromTexture();
			this.isLoaded = true;
		}
		else if(event === resEvent.UNLOADED) {
			this.isLoaded = false;
		}
		else if(event === resEvent.RESIZE) {
			this.updateFromTexture();
		}
		else if(event === resEvent.CHANGED) {
			this.updateFromTexture();

		}

		this.isNeedDraw = true;
	},

	/**
	 * Callback for resource controller events.
	 * @param data {*} Data of the event.
	 * @param event {*} Type of the event.
	 */
	_onResAllLoaded: function(data, event)
	{
		if(typeof(this._texture) === "string") 
		{
			var texture = meta.getTexture(this._texture);

			if(!texture) {
				console.warn("[Entity.Geometry.setTexture]:", "Could not find texture with a name: " + this._texture);
				this._texture = null;	
			}
			else {
				this._texture = null;
				this.setTexture(texture);
			}

			meta.unsubscribe(this, Resource.Event.ALL_LOADED);
		}
	},


	/**
	 * Attach entity as child.
	 * @param entity {Entity.Geometry}
	 */
	attach: function(entity, isRelative)
	{
		if(!entity) {
			console.error("[Entity.Geometry.attach]:", "Invalid child object passed.");
			return;
		}

		if(entity.isChild) {
			console.error("[Entity.Geometry.attach]:", "Entity is already a child of someone else.");
			return;
		}

		if(entity.isRemoved) {
			console.error("[Entity.Geometry.attach]:", "Entity is marked as removed ro to be removed.");
			return;
		}

		if(entity._view && (entity._view !== this._view || !entity.isChild)) {
			entity._view._removeFromBuffer(entity);
		}

		if(isRelative) 
		{
			entity.move(
				-this._x - this._anchorPosX - this.pivotX + this.volume.halfWidth, 
				-this._y - this._anchorPosY - this.pivotY + this.volume.halfHeight);
		}

		entity._parent = this;
		entity.isChild = true;
		entity.ignoreZoom = this.ignoreZoom;
		entity.isPickable = this.isPickable;
		entity.enableDebug = this.enableDebug;
		entity._view = this._view;

		entity.updateAngle();
		entity.updateAlpha();
		entity.updateScale();

		if(this._z !== 0) {
			entity.z = entity._z;
		}

		if(!this.children)
		{
			this.children = [ entity ];

			this.childPivotX = ((-this.pivotRatioX - 1.0) * this.volume.halfWidth);
			this.childPivotY = ((-this.pivotRatioY - 1.0) * this.volume.halfHeight);
			this.childOffsetX = this._x + this.childPivotX + this._anchorPosX;
			this.childOffsetY = this._y + this.childPivotY + this._anchorPosY;

			var parent = this._parent;
			while(parent) {
				this.childOffsetX += parent.childOffsetX;
				this.childOffsetY += parent.childOffsetY;
				parent = parent._parent;
			}
		}
		else {
			this.children.push(entity);
		}

		if(entity.isAnchor) {
			entity.updateAnchor();
		}
		if(entity.ignoreZoom !== this.ignoreZoom) {
			entity.ignoreZoom = this.ignoreZoom;
		}

		entity.updatePos();

		if(this._view && this._view._isActive) {
			this._entityCtrl.onAddToView(entity, null);
		}

		this.onChildAdded(entity);
		entity.onParentAdded(this);
	},

	/**
	 * Detach child from entity.
	 * @param entity {Entity.Geometry}
	 */
	detach: function(entity)
	{
		if(entity)
		{
			if(!this.children) { return; }

			var child;
			var numChildren = this.children.length;

			for(var i = 0; i < numChildren; i++)
			{
				child = this.children[i];
				if(child.isRemoved) { continue; }

				if(child === entity)
				{
					child._parent = this._entityCtrl;
					child._view = null;
					child.isChild = false;
					this._view.add(child);
					child.move(
						this._x + this._anchorPosX + this.pivotX - this.volume.halfWidth, 
						this._y + this._anchorPosY + this.pivotY - this.volume.halfHeight);

					this.onChildRemoved(child);
					child.onParentRemoved(this);					
					return;
				}
			}	
		}
		else 
		{
			if(!this.isChild) { return; }

			this._parent.detach(this);
		}
	},

	/**
	 * Detach all children fro mentity.
	 */
	detachChildren: function()
	{
		if(!this.children) { return; }

		var i;
		var child;
		var numChildren = this.children.length;

		for(i = 0; i < numChildren; i++)
		{
			child = this.children[i];
			if(child.isRemoved) { continue; }

			child._parent = this._entityCtrl;
			child._view = null;
			child.isChild = false;
			this._view.add(child);
			child.move(
				this._x + this._anchorPosX + this.pivotX - this.volume.halfWidth, 
				this._y + this._anchorPosY + this.pivotY - this.volume.halfHeight);

			this.onChildRemoved(child);
			child.onParentRemoved(this);			
		}

		this.children.length = 0;	
	},

	detachExact: function()
	{
		var child;
		var numChildren = this.children.length;
		for(var i = 0; i < numChildren; i++)
		{
			child = this.children[i];
			if(child.isRemoved) { continue; }

			child._x += this.childOffsetX;
			child._y += this.childOffsetY;
			child._parent = this._entityCtrl;
			child._view = null;
			child.isChild = false;
			this._view.add(child);
			child.forcePosition(child._x, child._y);

			this.onChildRemoved(child);
			child.onParentRemoved(this);			
		}

		this.children.length = 0;
	},


	clip: function(minX, minY, maxX, maxY) 
	{
		if(typeof(minX) === "object") 
		{
			// Is AABB volume.
			if(minX instanceof meta.math.AdvAABB || minX instanceof meta.math.AABB) {
				this.clipVolume = minX;
			}
			// Probably is an entity.
			else {
				this.clipVolume = minX.volume;
			}
		}
		else {
			this.clipVolume = new meta.math.AdvAABB(minX, minY, maxX, maxY);
		}

		this.isNeedDraw = true;

		return this.clipVolume;
	},


	_onDown: meta.emptyFuncParam,
	_onUp: meta.emptyFuncParam,
	_onClick: meta.emptyFuncParam,
	_onDrag: meta.emptyFuncParam,
	_onDragStart: meta.emptyFuncParam,
	_onDragEnd: meta.emptyFuncParam,
	_onHover: meta.emptyFuncParam,
	_onHoverEnter: meta.emptyFuncParam,
	_onHoverExit: meta.emptyFuncParam,

	/**
	 * Callback if entity has been pressed.
	 * @function
	 */
	onDown: meta.emptyFuncParam,

	/**
	 * Callback if press on entity ended.
	 * @function
	 */
	onUp: meta.emptyFuncParam,

	/**
	 * Callback if entity has been clicked.
	 * @function
	 */
	onClick: meta.emptyFuncParam,	

	/**
	 * Callback if entity is being dragged.
	 * @function
	 */
	onDrag: meta.emptyFuncParam,

	/**
	 * Callback if started drag on the entity.
	 * @function
	 */
	onDragStart: meta.emptyFuncParam,	

	/**
	 * Callback if ended drag on the entity.
	 * @function
	 */
	onDragEnd: meta.emptyFuncParam,	

	/**
	 * Callback if input is moving on top of entity.
	 * @function
	 */
	onHover: meta.emptyFuncParam,

	/**
	 * Callback if input entered in entity bounds.
	 * @function
	 */
	onHoverEnter: meta.emptyFuncParam,

	/**
	 * Callback if input left entity bounds.
	 * @function
	 */
	onHoverExit: meta.emptyFuncParam,

	/**
	 * Callback on animation end.
	 */
	onAnimEnd: null,

	/**
	 * Callback called when child is added.
	 */
	onChildAdded: meta.emptyFuncParam,

	/**
	 * Callback called when child is removed.
	 */
	onChildRemoved: meta.emptyFuncParam,

	/**
	 * Callback called when parent is added.
	 */
	onParentAdded: meta.emptyFuncParam,

	/**
	 * Callback called when parent is removed.
	 */
	onParentRemoved: meta.emptyFuncParam,


	/**
	 * Add component.
	 * @param comp {String|Function} Name of the component or function pointer.
	 * @param params {Object} Parameters to add to the component.
	 */
	addComponent: function(comp, params)
	{
		if(!comp) {
			console.warn("[Entity.Geometry.addComponent]:", "No component specified.");
			return null;
		}

		var scope = window.Component;
		var newComp = null;
		var key;

		if(typeof(comp) === "string") 
		{
			for(key in scope) 
			{
				if(key === comp) {
					newComp = new scope[key]();
					break;
				}
			}
		}
		else 
		{
			for(key in scope) 
			{
				if(scope[key] === comp) {
					newComp = new comp();
					break;
				}
			}
		}

		if(!newComp) {
			console.warn("[Entity.Geometry.addComponent]:", "Invalid component - " + comp);
			return null;
		}

		this.numComponents++;

		if(!this.components) {
			this.components = {};
			this.componentBuffer = [];
		}
		if(this.numComponents > this.componentBuffer.length) {
			this.componentBuffer.length = this.numComponents;
		}

		this.components[key] = newComp;
		newComp.owner = this;
		newComp.__id = this.numComponents - 1;
		this.componentBuffer[newComp.__id] = newComp;

		if(params) 
		{
			for(key in params) {
				newComp[key] = params[key];
			}
		}

		if(this._isLoaded && newComp.load) {
			newComp.load();
		}

		if(newComp.update && !this._isUpdating) {
			this.isUpdating = true;
		}

		return newComp;
	},

	/**
	 * Remove component.
	 * @param comp {String|Function} Name of the component or reference to component.
	 */
	removeComponent: function(comp)
	{
		if(!comp) {
			console.warn("[Entity.Geometry.removeComponent]:", "No component specified.");
			return;
		}

		if(!this.components) {
			return;
		}

		var component, compName;
		if(typeof(comp) === "string") 
		{
			component = this.components[comp];
			compName = comp;
			if(!component) {
				console.warn("[Entity.Geometry.removeComponent]:", "No such component found - " + comp);
				return;
			}
		}
		else 
		{
			for(var key in this.components) 
			{
				if(this.components[key] === comp) {
					component = comp;
					compName = key;
					break;
				}
			}

			if(!component) {
				console.warn("[Entity.Geometry.removeComponent]:", "No such component found - " + comp);
				return;
			}
		}

		if(component.unload) {
			component.unload();
		}

		this.numComponents--;
		if(this.numComponents <= 0) {
			this.components = null;
			this.componentBuffer = null;
			this.numComponents = 0;
		}
		else {
			this.componentBuffer[component.__id] = this.componentBuffer[this.numComponents];
			this.componentBuffer[component.__id].__id = component.__id;
			this.componentBuffer[this.numComponents] = null;
			delete this.components[compName];
		}
	},

	/**
	 * Remove all components.
	 */
	removeComponents: function()
	{
		var component;
		for(var n = 0; n < this.numComponents; n++)
		{
			component = this.componentBuffer[n];
			if(component.unload) {
				component.unload();
			}
		}

		this.components = null;
		this.componentBuffer = null;
		this.numComponents = 0;
	},


	/**
	 * Rotate entoty so it looks to x, y world positions.
	 * @param x {Number} World position on x axis to look at.
	 * @param y {Number} World position on y axis to look at.
	 */
	lookAt: function(x, y) 
	{
		this.angleRad = -Math.atan2(x - (this._x + this._anchorPosX + this._parent.childOffsetX), 
			y - (this._y + this._anchorPosY + this._parent.childOffsetY)) + Math.PI;
	},

	/**
	 * Rotate entity to look at another entity.
	 * @param entity {Entity.Geometry} Entity to look at.
	 */
	lookAtEntity: function(entity) {
		this.lookAt(entity._x + entity._parent.childOffsetX, entity._y + entity._parent.childOffsetY);
	},

	getLookAt: function(x, y) 
	{
		this.angleRad = -Math.atan2(x - (this.x + this._anchorPosX + this._parent.childOffsetX), 
			y - (this.y + this._anchorPosY + this._parent.childOffsetY)) + Math.PI;
	},


	on: function(event, func) {
		meta.subscribe(this, event, func);
	},

	emit: function(data, event) {
		
	},


	updateState: function()
	{
		this.isNeedState = false;

		if(!this._brush) { return; }

		var brushState;
		if(this._state)
		{
			brushState = this._brush.getState(this);
			if(!brushState) {
				console.warn("[Entity.Geometry.updateState]:", "Could not get brush state from entity state: " + this._state);
				return;
			}
		}
		else {
			brushState = null;
		}

		if(brushState === this._brushState) { return; }

		if(this._brushState) {
			brushState.discardState(this);
		}
		this._brushState = brushState;

		this.setTexture(brushState.texture);
		brushState.applyState(this);
	},

	setState: function(name, texture, params)
	{
		if(!this._brush)
		{
			this._brush = new meta.Brush();
			this._brushParams = {};

			if(this._texture) {
				this._brush.setState("default", this._texture, params);
			}
		}

		this._brush.setState(name, texture);
	},


	set state(value)
	{
		this._state = value;
		if(value === null) {
			this.setTexture(null);
		}
		else {
			this.isNeedState = true;
		}
	},

	get state() { return this._state; },


	/**
	 * Print name and id of the entity.
	 * @param str {*=} Debug string to output.
	 */
	print: function(str) {
		str = str || "";
		console.log("[Entity", this.name + ":" + this.id + "]", str);
	},


	get view() { return this._view; },


	set x(value) { this.position(value, this._y); },
	set y(value) { this.position(this._x, value); },
	get x() { return this._x; },
	get y() { return this._y; },
	get absoluteX() { return this.volume.x; },
	get absoluteY() { return this.volume.y; },

	get width() { return this.volume.width; },
	get height() { return this.volume.height; },

	set anchorX(x) { this.anchor(x, this._anchorY); },
	set anchorY(y) { this.anchor(this._anchorX, y); },
	get anchorX() { return this._anchorX; },
	get anchorY() { return this._anchorY; },

	set isAnchor(value)
	{
		if((this._flags & this.Flag.ANCHOR) === value) { return; }

		if(!value) 
		{	
			this._anchorX = 0;
			this._anchorY = 0;
			this._anchorPosX = 0;
			this._anchorPosY = 0;

			this._flags ^= this.Flag.ANCHOR;
		}
		else {
			this._flags |= this.Flag.ANCHOR;
		}

		this.isNeedDraw = true;
	},

	get isAnchor() { return (this._flags & this.Flag.ANCHOR); },

	get centerX() {
		return this._x + this._parent.childOffsetX + this.textureOffsetX;
	},

	get centerY() {
		return this._y + this._parent.childOffsetY + this.textureOffsetY;
	},


	set z(value)
	{
		var newZ = this._parent._z + value;
		if(this._view) {
			newZ += this._view._z;
		}

		if(this._depthNode.depth === newZ) { return; }

		this._z = value;
		this._depthNode.depth = newZ

		if(!this._depthNode.entity) { return; }

		this._entityCtrl.entities.update(this._depthNode);
		this.isNeedDraw = true;

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++) {
				this.children[i].z = value;
			}
		}
	},

	set depthIndex(value) { this.z = value; },
	get z() { return this._z; },
	get depthIndex() { return this._z; },


	set texture(texture) {
		this.setTexture(texture);
	},

	get texture() { return this._texture; },


	set brush(brush)
	{
		this._brush = brush;
		this._brushParams = {};

		if(brush) {
			this.isNeedState = true;
		}
		else {
			this.isNeedState = false;
		}
	},

	get brush() { return this._brush; },


	set isNeedDraw(value)
	{
		if(!this._isLoaded) { return; }

		this._isNeedDraw = value;
		this._tChange = Date.now();

		if(this._isCached) {
			this._entityCtrl.uncacheEntity(this);
		}

		if(value) {
			this._entityCtrl.isNeedRender = true;
		}
	},

	get isNeedDraw() { return this._isNeedDraw; },


	set showBounds(value)
	{
		if(this._showBounds === value) { return; }

		this._showBounds = value;
		if(value) {
			this._entityCtrl._addToDrawBounds();
		}
		else {
			this._entityCtrl._removeToDrawBounds();
		}
	},

	get showBounds() { return this._showBounds; },

	// Alpha.
	updateAlpha: function()
	{
		var alpha;

		if(this._flags & this.Flag.IGNORE_PARENT_ALPHA) {
			alpha = this._alpha;
		}
		else {
			alpha = this._alpha * this._parent.totalAlpha;
		}	

		if(this.totalAlpha === alpha) { 
			return; 
		}

		this.totalAlpha = alpha;

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++)
			{
				var child = this.children[i];
				if(child._flag & this.Flag.IGNORE_PARENT_ALPHA) { return; }

				child.updateAlpha();
			}
		}

		this._draw = this._drawTransform;
		this.isNeedDraw = true;
	},

	set alpha(value) 
	{
		if(this._alpha === value) { return; }
		this._alpha = value;

		this.updateAlpha();
	},

	get alpha() { return this._alpha; },

	set ignoreParentAlpha(value) {
		this._flags |= this.Flag.IGNORE_PARENT_ALPHA;
	},

	get ignoreParentAlpha() { 
		return (this._flags & this.Flag.IGNORE_PARENT_ALPHA); 
	},

	// Angle.
	updateAngle: function()
	{
		var angleRad;

		if(this._flags & this.Flag.IGNORE_PARENT_ANGLE) {
			angleRad = this._angleRad;
		}
		else {
			angleRad = this._angleRad + this._parent.totalAngleRad;
		}

		if(angleRad === this.totalAngleRad) {
			return;
		}

		this.totalAngleRad = angleRad;

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++)
			{
				var child = this.children[i];
				if(child._flags & this.Flag.IGNORE_PARENT_ANGLE) { continue; }

				child.updateAngle();
			}
		}

		this._draw = this._drawTransform;
		this.isInside = this._isInsideTransform;
		this.isNeedDraw = true;		
	},

	set angle(value)
	{
		value = meta.math.toRadians(value);
		if(this._angleRad === value) { return; }

		this._angleRad = value;
		this.updateAngle();
	},

	get angle() { return meta.math.toDegree(this._angleRad); },

	set angleRad(value)
	{
		if(this._angleRad === value) { return; }

		this._angleRad = value;
		this.updateAngle();
	},

	get angleRad() { return this._angleRad; },

	set ignoreParentAngle(value) {
		this._flags |= this.Flag.IGNORE_PARENT_ANGLE;
	},

	get ignoreParentAngle() { 
		return (this._flags & this.Flag.IGNORE_PARENT_ANGLE); 
	},	

	// Scale.
	updateScale: function()
	{
		var scaleX, scaleY;

		if(this._flags & this.Flag.IGNORE_PARENT_SCALE) {
			scaleX = this._scaleX;
			scaleY = this._scaleY;
		}
		else {
			scaleX = this._scaleX * this._parent.totalScaleX;
			scaleY = this._scaleY * this._parent.totalScaleY;
		}	

		// if(scaleX === this.totalScaleX && scaleY === this.totalScaleY) {
		// 	return;
		// }

		this.totalScaleX = scaleX;
		this.totalScaleY = scaleY;

		this.pivotX = this.pivotSrcX * scaleX;
		this.pivotY = this.pivotSrcY * scaleY;

		this.volume.scalePivoted(this.totalScaleX, this.totalScaleY, 
			this.drawSrcX + this.pivotX, this.drawSrcY + this.pivotY);

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++)
			{
				var child = this.children[i];
				if(child._flag & this.Flag.IGNORE_PARENT_SCALE) { continue; }

				child.updateScale();
			}
		}		

		this._draw = this._drawTransform;
		this.isInside = this._isInsideTransform;

		this.isNeedDraw = true;
	},

	scale: function(x, y) {
		y = y || x;
		this._scaleX = x;
		this._scaleY = y;
		this.updateScale();
	},

	set scaleX(value) { 
		this._scaleX = value; 
		this.updateScale();
	},

	set scaleY(value) { 
		this._scaleY = value; 
		this.updateScale();
	},

	get scaleX() { return this._scaleX; },
	get scaleY() { return this._scaleY; },

	set ignoreParentScale(value) {
		this._flags |= this.Flag.IGNORE_PARENT_SCALE;
	},

	get ignoreParentScale() { 
		return (this._flags & this.Flag.IGNORE_PARENT_SCALE); 
	},	

	// Flip.
	/**
	 * Flip entity. By default will flip horizontally.
	 * @param x {Number=} Flip by X axis. Valid inputs: -1.0 or 1.0.
	 * @param y {Number=} Flip by Y axis. Valid inputs: -1.0 or 1.0.
	 */
	flip: function(x, y)
	{
		if(x === void(0) && y === void(0)) {
			x = -this._flipX;
			y = this._flipY;
		}
		else
		{
			x = (x !== void(0)) ? x : 1.0;
			y = (y !== void(0)) ? y : 1.0;
		}

		x = Math.round(x);
		y = Math.round(y);

		if(x > 1.0) { x = 1.0; }
		else if(x < -1.0) { x = -1.0; }
		else if(x === 0.0) { x = 1.0; }

		if(y > 1.0) { y = 1.0; }
		else if(y < -1.0) { y = -1.0; }
		else if(y === 0.0) { y = 1.0; }

		if(x === this._flipX && y === this._flipY) { return; }

		this._flipX = x;
		this._flipY = y;

		this._draw = this._drawTransform;
		this.isInside = this._isInsideTransform;
		this.isNeedDraw = true;
 	},

	set flipX(x) { this.flip(x, this._flipY); },
	set flipY(y) { this.flip(this._flipX, y); },
	get flipX() { return this._flipX; },
	get flipY() { return this._flipY; },

	// Visibility.
	set visible(value)
	{
		if(this.isVisible === value) { return; }
		this.isVisible = value;

		this._entityCtrl.isNeedRender = true;

		if(this.children)
		{
			var numChildren = this.children.length;
			for(var i = 0; i < numChildren; i++) {
				this.children[i].visible = value;
			}
		}
	},

	get visible() { return this.isVisible; },


	set isLoaded(value)
	{
		if(this._isLoaded === value) { return; }
		this._isLoaded = value;

		if(value) 
		{
			if(this.load) {
				this.load();
			}

			if(this.components) 
			{
				var comp;
				for(var key in this.components) 
				{
					comp = this.components[key];
					if(comp.load) {
						comp.load();
					}
				}
			}

			this._entityCtrl.cacheEntity(this);
		}
		else {
			this._entityCtrl.uncacheEntity(this);
		}
	},

	get isLoaded() { return this._isLoaded; },


	set isUpdating(value)
	{
		if(this._isUpdating === value) { return; }
		this._isUpdating = value;

		if(value) {
			this._entityCtrl._addToUpdating(this);
		}
		else {
			this._entityCtrl._removeFromUpdating(this);
		}
	},

	get isUpdating() { return this._isUpdating; },

	set currFrame(index)
	{
		if(!this._texture) {
			this._currFrame = index;
		}
		else
		{
			var frame = index % this._texture.numFrames;
			if(frame === this._currFrame) { return; }

			this._currFrame = frame;
			this.isNeedDraw = true;
		}
	},

	get currFrame() { return this._currFrame; },

	set isAnimReverse(value)
	{
		this._isAnimReverse = value;
		if(value && this._texture) {
			this.currFrame = this._texture.numFrames - 1;
		}
		else {
			this.currFrame = 0;
		}
	},

	get isAnimReverse() { return this._isAnimReverse; },

	get tween()
	{
		if(!this._tween) {
			this._tween = new meta.Tween(this);
		}
		else {
			this._tween.clear();
		}

		return this._tween;
	},


	handleResizeFunc: function()
	{
		if(this._onResize_user || this._onResize_interal) {
			meta.subscribe(this, meta.Event.RESIZE, this._onResize);
			meta.subscribe(this, meta.Event.CAMERA_RESIZE, this._onResize);		
		}	
		else {
			meta.unsubscribe(this, meta.Event.RESIZE, this._onResize);
			meta.unsubscribe(this, meta.Event.CAMERA_RESIZE, this._onResize);		
		}
	},

	_onResize: function(data, event)
	{
		if(this._onResize_user) {
			this._onResize_user();
		}
		if(this._onResize_interal) {
			this._onResize_interal();
		}
	},

	_onResize_user: null,
	_onResize_internal: null,

	set onResize(func) {
		this._onResize_user = func;
		this.handleResizeFunc();
	},

	get onResize() { return this._onResize_user; },


	set isCached(value)
	{
		if(this._isCached === value) { return; }

		// if(value) {
		// 	this._entityCtrl.cacheEntity(this);
		// }
		// else {
		// 	this._entityCtrl.uncacheEntity(this);
		// }
	},

	get isCached() { return this._isCached; },

	// Ignore Zoom.
	set ignoreZoom(value) 
	{
		if((this._flags & this.Flag.IGNORE_ZOOM) === value) { return; }

		if(this._flags & this.Flag.ANCHOR) {
			this.updateAnchor();
		}

		if(value) {
			this._flags |= this.Flag.IGNORE_ZOOM;
		}
		else {
			this._flags ^= this.Flag.IGNORE_ZOOM;
		}

		this.isNeedDraw = true;
	},

	get ignoreZoom() { return !!(this._flags & this.Flag.IGNORE_ZOOM); },

	// Enable Debug.
	set enableDebug(value) 
	{ 
		if((this._flags & this.Flag.ENABLE_DEBUG) === value) { return; }

		if(value) {
			this._flag |= this.Flag.ENABLE_DEBUG;
		}
		else {
			this._flag ^= this.Flag.ENABLE_DEBUG;
		}
		
		this.isNeedDraw = true;
	},

	get enableDebug() { return !!(this._flags & this.Flag.ENABLE_DEBUG); },


	// Flag Enum
	Flag: {
		ANCHOR: 128,
		IGNORE_ZOOM: 256,
		IGNORE_PARENT_ANGLE: 512,
		IGNORE_PARENT_SCALE: 1024,
		IGNORE_PARENT_ALPHA: 2048,
		ENABLE_DEBUG: 16384
	},

	//
	meta: meta,
	_entityCtrl: null,

	id: -1,
	type: 0,
	name: "unknown",
	_parent: null,
	_view: null,
	_depthNode: null,

	_checkID: -1,
	_viewNodeID: -1,
	_updateNodeID: -1,
	_updateAnimNodeID: -1,
	_removeFlag: 0,

	_flags: 0,

	_x: 0, _y: 0, _z: 0,
	typeX: 0, typeY: 0,
	_anchorX: 0, _anchorY: 0,
	_anchorPosX: 0, _anchorPosY: 0,
	_dragOffsetX: 0, _dragOffsetY: 0,
	drawX: 0, drawY: 0,
	drawSrcX: 0, drawSrcY: 0,
	offsetX: 0, offsetY: 0,
	textureOffsetX: 0, textureOffsetY: 0,

	pivotX: 0, pivotY: 0,
	pivotRatioX: 0, pivotRatioY: 0,	
	pivotSrcX: 0, pivotSrcY: 0,
	childOffsetX: 0, childOffsetY: 0,
	childPivotX: 0, childPivotY: 0,

	cellX: 0, cellY: 0,
	_cellIndex: 0,

	_brush: null, _brushState: null, _brushParams: null,
	_state: "",
	_tween: null,

	volume: null,
	clipVolume: null,
	positionType: 0,

	_angleRad: 0.0, 
	_scaleX: 1.0, _scaleY: 1.0,
	_flipX: 1.0, _flipY: 1.0,
	_alpha: 1.0,
	totalAngleRad: 0.0,
	totalScaleX: 1.0, totalScaleY: 1.0,
	totalAlpha: 1.0,

	_texture: null,
	vbo: null, vertices: null,

	components: null,
	componentBuffer: null,
	numComponents: 0,

	children: null,

	pickable: true,
	clickable: true,
	isHover: false,
	isPressed: false,
	isDragged: false,

	fps: 0,
	animSpeed: 1.0,
	_currFrame: 0,
	isAnimating: false,
	isLoop: false,
	_isAnimReverse: false,
	isEmulateReverse: false,
	_tAnim: 0.0,
	pauseAtEnd: false,

	_tChange: 0.0,

	isAdded: false,
	_isLoaded: false,
	isVisible: true,
	isPaused: false,
	isChild: false,
	isRemoved: false,
	_isUpdating: false,
	_isNeedDraw: false,
	isNeedState: false,
	_isNeedOffset: false,
	_cacheIndex: -1, // "-1" - it's cached. If more, it's considered as dynamic entity.

	_showBounds: false,
	_isHighlight: false
});