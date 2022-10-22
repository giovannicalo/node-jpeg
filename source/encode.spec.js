const { readFileSync } = require("fs");
const { join } = require("path");

const { Format, encode } = require(".");

const path = join(__dirname, "..", "test");

const jpegMagicNumber = Buffer.from([0xFF, 0xD8, 0xFF]);

const rgba511 = {
	data: readFileSync(join(path, "511x511.rgba")),
	format: Format.rgba,
	height: 511,
	width: 511
};

const rgba512 = {
	data: readFileSync(join(path, "512x512.rgba")),
	format: Format.rgba,
	height: 512,
	width: 512
};

const yuv511 = {
	data: readFileSync(join(path, "511x511.yuv")),
	format: Format.yuv,
	height: 511,
	width: 511
};

const yuv512 = {
	data: readFileSync(join(path, "512x512.yuv")),
	format: Format.yuv,
	height: 512,
	width: 512
};

it("should encode an even-sized RGBA image as JPEG", async () => {
	expect((await encode(rgba512, 90)).slice(0, 3).equals(jpegMagicNumber)).toBeTruthy();
});

it("should encode an odd-sized RGBA image as JPEG", async () => {
	expect((await encode(rgba511, 90)).slice(0, 3).equals(jpegMagicNumber)).toBeTruthy();
});

it("should encode an even-sized YUV image as JPEG", async () => {
	expect((await encode(yuv512, 90)).slice(0, 3).equals(jpegMagicNumber)).toBeTruthy();
});

it("should encode an odd-sized YUV image as JPEG", async () => {
	expect((await encode(yuv511, 90)).slice(0, 3).equals(jpegMagicNumber)).toBeTruthy();
});

it("should throw when given no arguments", () => {
	expect(() => {
		encode();
	}).toThrow("[nodeJpeg::encode] At least one argument is required");
});

it("should throw when the first argument is not an object", () => {
	expect(() => {
		encode(42);
	}).toThrow("[nodeJpeg::decode] Argument is not an object");
});

it("shouldn't throw when given more than two arguments", () => {
	expect(() => {
		encode(rgba512, 90, 42);
	}).not.toThrow();
});
