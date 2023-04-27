const { createWriteStream, promises: { mkdir, rename, unlink } } = require("fs");
const { join } = require("path");
const { Readable, promises: { finished } } = require("stream");

const extractZip = require("extract-zip");

(async () => {
	const path = join(__dirname, "..", "libraries");
	await mkdir(path, { recursive: true });
	const response = await fetch("https://codeload.github.com/libjpeg-turbo/libjpeg-turbo/zip/refs/tags/2.1.5.1");
	const filePath = join(path, "xxhash.zip");
	await finished(Readable.fromWeb(response.body).pipe(createWriteStream(filePath)));
	await extractZip(filePath, { dir: path });
	rename(
		join(path, "libjpeg-turbo-2.1.5.1"),
		join(path, "libjpeg-turbo")
	);
	unlink(filePath);
})();
