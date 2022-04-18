const { promises: { mkdir, rename } } = require("fs");
const { get } = require("https");
const { join } = require("path");

const { Extract } = require("unzipper");

get(
	"https://codeload.github.com/libjpeg-turbo/libjpeg-turbo/zip/refs/tags/2.1.3",
	async (response) => {
		const path = join(__dirname, "..", "libraries");
		await mkdir(path, { recursive: true });
		response.pipe(Extract({ path })).on("close", async () => {
			await rename(
				join(path, "libjpeg-turbo-2.1.3"),
				join(path, "libjpeg-turbo")
			);
		});
	}
);
