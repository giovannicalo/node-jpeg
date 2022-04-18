const { readFileSync } = require("fs");
const { join } = require("path");

const { Format, decode, encode } = require("../source");

const iterations = 100;

const path = join(__dirname, "..", "test");

const jpeg = readFileSync(join(path, "512x512.jpg"));

const rgba = {
	data: readFileSync(join(path, "512x512.rgba")),
	format: Format.rgba,
	height: 512,
	width: 512
};

const yuv = {
	data: readFileSync(join(path, "512x512.yuv")),
	format: Format.yuv,
	height: 512,
	width: 512
};

const benchmark = async (label, method, ...parameters) => {
	const start = Date.now();
	for (let i = 0; i < iterations; i++) {
		await method(...parameters);
	}
	console.log(`${label}: ${((Date.now() - start) / iterations).toFixed(2)}ms`);
};

(async () => {
	for (const parameters of [
		["JPEG => RGBA", decode, jpeg, Format.rgba],
		["JPEG => YUV ", decode, jpeg, Format.yuv],
		["RGBA => JPEG", encode, rgba, 90],
		["YUV  => JPEG", encode, yuv, 90]
	]) {
		await benchmark(...parameters);
	}
})();
