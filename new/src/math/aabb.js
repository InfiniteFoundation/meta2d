"use strict";

meta.math.AABB = function(x, y, width, height) 
{
	this.set(x, y, width, height);
};

meta.math.AABB.prototype =
{
	set: function(x, y, width, height)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || width;
		this.height = height || height;
	}
};