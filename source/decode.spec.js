const { readFileSync } = require("fs");
const { join } = require("path");

const { Format, decode } = require(".");

const path = join(__dirname, "..", "test");

const jpeg511 = readFileSync(join(path, "511x511.jpg"));

const jpeg512 = readFileSync(join(path, "512x512.jpg"));

const yuv511 = readFileSync(join(path, "511x511.yuv"));

const yuv512 = readFileSync(join(path, "512x512.yuv"));

it("should decode an even-sized JPEG as YUV", async () => {
	const decoded = await decode(jpeg512, Format.yuv);
	expect(Buffer.from(decoded.data).equals(yuv512)).toBeTruthy();
	expect(decoded.format).toBe(Format.yuv);
	expect(decoded.height).toBe(512);
	expect(decoded.width).toBe(512);
});

it("should decode an odd-sized JPEG as YUV", async () => {
	const decoded = await decode(jpeg511, Format.yuv);
	expect(Buffer.from(decoded.data).equals(yuv511)).toBeTruthy();
	expect(decoded.format).toBe(Format.yuv);
	expect(decoded.height).toBe(512);
	expect(decoded.width).toBe(512);
});

it("should throw when given no arguments", () => {
	expect(() => {
		decode();
	}).toThrow();
});

it("should throw when the first argument is not a buffer", () => {
	expect(() => {
		decode(42);
	}).toThrow();
});

it("should throw when given a buffer that isn't a JPEG", () => {
	return expect(decode(Buffer.from([1, 2, 3]))).rejects.toThrow();
});

it("should throw when given a format that isn't RGBA or YUV", () => {
	return expect(decode(jpeg512, 42)).rejects.toThrow();
});

it("shouldn't throw when given more than two arguments", () => {
	expect(() => {
		decode(jpeg512, Format.yuv, 42);
	}).not.toThrow();
});
