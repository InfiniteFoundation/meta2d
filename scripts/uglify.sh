#!/bin/bash
cd ../src/
cat meta.js \
	Engine.js \
	Device.js \
	Error.js \
	Utilities.js \
	Signal.js \
	View.js \
	Camera.js \
	World.js \
	Class.js \
	Controller.js \
	Timer.js \
	Style.js \
	Enum.js \
	Macros.js \
	utils/Ajax.js \
	math/Math.js \
	math/Vector2.js \
	math/AABB.js \
	math/AABBext.js \
	math/Circle.js \
	math/Matrix4.js \
	math/Random.js \
	tween/Tween.js \
	tween/Easing.js \
	tween/Link.js \
	renderer/Renderer.js \
	renderer/CanvasRenderer.js \
	renderer/utils/Anim.js \
	plugins/Component/Component.js \
	plugins/Resource/Resource.Controller.js \
	plugins/Resource/Enum.js \
	plugins/Resource/Resource.Basic.js \
	plugins/Resource/Resource.Texture.js \
	plugins/Resource/Resource.Sound.js \
	plugins/Resource/Resource.SpriteSheet.js \
	plugins/Resource/Resource.Font.js \
	plugins/Resource/Resource.SVG.js \
	plugins/Entity/Enum.js \
	plugins/Entity/Entity.Geometry.js \
	plugins/Entity/Entity.Text.js \
	plugins/Entity/Entity.Tiling.js \
	plugins/Entity/svg/Entity.SVG.js \
	plugins/Entity/svg/Entity.Line.js \
	plugins/Input/Input.Controller.js \
	plugins/Input/Enum.js \
	plugins/Physics/Physics.Controller.js \
	plugins/Physics/Physics.Body.js \
	plugins/UI/UI.Controller.js \
	plugins/UI/UI.Button.js \
	plugins/UI/UI.Checkbox.js \
	plugins/UI/UI.ProgressBar.js \
	plugins/UI/UI.Group.js \
	Loader.js \
	Debugger.js \
	| uglifyjs --output ../versions/meta.js --mangle -c dead_code=false,unused=false,side_effects=false --screw-ie8

