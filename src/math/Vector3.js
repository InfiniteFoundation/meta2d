
class Vector3
{
	constructor(x, y, z) {
		this.x = x || 0.0
		this.y = y || 0.0
		this.z = z || 0.0
		this.v = null
	}

	reset() {
		this.x = 0.0
		this.y = 0.0
		this.z = 0.0
	}

	set(x, y, z) {
		this.x = x
		this.y = (y === undefined) ? x : y
		this.z = (z === undefined) ? x : z
	}

	scalar(value) {
		this.x = value
		this.y = value
		this.z = value
	}

	clone() {
		return new Vector3(this.x, this.y, this.z)
	}

	copy(vec3) {
		this.x = vec3.x
		this.y = vec3.y
		this.z = vec3.z
	}

	add(vec3) {
		this.x += vec3.x
		this.y += vec3.y
		this.z += vec3.z
	}

	addScalar(value) {
		this.x += value
		this.y += value
		this.z += value
	}

	addValues(x, y, z) {
		this.x += x
		this.y += y
		this.z += z
	}

	sub(vec3) {
		this.x -= vec3.x
		this.y -= vec3.y
		this.z -= vec3.z
	}

	subScalar(value) {
		this.x -= value
		this.y -= value
		this.z -= value
	}

	subValues(x, y, z) {
		this.x -= x
		this.y -= y
		this.z -= z
	}

	mul(vec3) {
		this.x *= vec3.x
		this.y *= vec3.y
		this.z *= vec3.z
	}

	mulScalar(value) {
		this.x *= value
		this.y *= value
		this.z *= value
	}

	mulValues(x, y, z) {
		this.x *= x
		this.y *= y
		this.z *= z
	}

	div(vec3) {
		this.x /= vec3.x
		this.y /= vec3.y
		this.z /= vec3.z
	}

	divScalar(value) {
		this.x /= value
		this.y /= value
		this.z /= value
	}

	divValues(x, y, z) {
		this.x /= x
		this.y /= y
		this.z /= z
	}

	applyMatrix3(matrix3)
	{
		const m = matrix.m

		const x = this.x
		const y = this.y
		const z = this.z

		this.x = m[0] * x + m[3] * y + m[ 6 ] * z
		this.y = m[1] * x + m[4] * y + m[ 7 ] * z
		this.z = m[2] * x + m[5] * y + m[ 8 ] * z
	}

	applyMatrix4(matrix4)
	{
		const m = matrix.m

		const x = this.x
		const y = this.y
		const z = this.z

		this.x = m[0] * x + m[4] * y + m[8]  * z + m[12]
		this.y = m[1] * x + m[5] * y + m[9]  * z + m[13]
		this.z = m[2] * x + m[6] * y + m[10] * z + m[14]
		const w =  m[3] * x + m[7] * y + m[11] * z + m[15]

		this.divScalar(w)
	}

	applyQuaternion(q)
	{
		const x = this.x
		const y = this.y
		const z = this.z

		const qx = q.x
		const qy = q.y
		const qz = q.z
		const qw = q.w

		const ix =  qw * x + qy * z - qz * y
		const iy =  qw * y + qz * x - qx * z
		const iz =  qw * z + qx * y - qy * x
		const iw = - qx * x - qy * y - qz * z

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx
	}

	min(vec3) {
		this.x = Math.min(this.x, vec3.x)
		this.y = Math.min(this.y, vec3.y)
		this.z = Math.min(this.z, vec3.z)
	}

	max() {
		this.x = Math.max(this.x, vec3.x)
		this.y = Math.max(this.y, vec3.y)
		this.z = Math.max(this.z, vec3.z)
	}

	clamp(min, max) {
		this.x = Math.max(min, Math.min(max, this.x))
		this.y = Math.max(min, Math.min(max, this.y))
		this.z = Math.max(min, Math.min(max, this.z))
	}

	floor() {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		this.z = Math.floor(this.z)
	}

	ceil() {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		this.z = Math.ceil(this.z)
	}

	round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		this.z = Math.round(this.z)
	}

	roundToZero() {
		this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x)
		this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y)
		this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z)
	}

	negate() {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	lengthManhattan() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
	}

	normalize()
	{
		let length = this.x * this.x + this.y * this.y + this.z * this.z
		if(length > 0)
		{
			length = 1 / Math.sqrt(length)
			this.x *= length
			this.y *= length
			this.z *= length
		}
		else
		{
			this.x = 0.0
			this.y = 0.0
			this.z = 0.0
		}
	}

	lerp(src, alpha) {
		this.x += (src.x - this.x) * alpha
		this.y += (src.y - this.y) * alpha
		this.z += (src.z - this.z) * alpha
	}

	cross(src)
	{
		const x = this.x
		const y = this.y
		const z = this.z

		this.x = y * src.z - z * src.y
		this.y = z * src.x - x * src.z
		this.z = x * src.y - y * src.x
	}

	distanceToSquared(src)
	{
		const dx = this.x - src.x
		const dy = this.y - src.y
		const dz = this.z - src.z

		return dx * dx + dy * dy + dz * dz
	}

	distanceTo(src)
	{
		const dx = this.x - src.x
		const dy = this.y - src.y
		const dz = this.z - src.z

		return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}

	equals(src) {
		return ((this.x === src.x) && (this.y === src.y) && (this.z === src.z))
	}

	toFloat32Array()
	{
		if(!this.v) {
			this.v = new Float32Array([ this.x, this.y, this.z ])
		}
		else {
			this.v[0] = this.x
			this.v[1] = this.y
			this.v[2] = this.z
		}

		return this.v
	}

	fromArray(array) {
		this.x = array[0]
		this.y = array[1]
		this.z = array[2]
	}

	print(text)
	{
		if(text) {
			console.log(`${text} Vector3(${this.x}, ${this.y}, ${this.z})`)
		}
		else {
			console.log(`Vector3(${this.x}, ${this.y}, ${this.z})`)
		}
	}
}

export default Vector3