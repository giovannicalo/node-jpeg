export enum Format { rgba, yuv }

interface Image {
	data: Uint8ClampedArray;
	format: Format;
	height: number;
	width: number;
}

/**
 * Decodes a JPEG image.
 *
 * @param {Buffer} data - A JPEG-encoded buffer.
 * @param {Format} [format=Format.rgba] - The desired output format, either RGBA or YUV I420, defaults to RGBA.
 * @returns {Promise<Image>} A promise resolving to the decoded image.
 */
export function decode(data: Buffer, format = Format.rgba): Promise<Image>
