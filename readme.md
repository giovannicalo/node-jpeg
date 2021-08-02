# Node JPEG

[![Build Status](https://github.com/giovannicalo/node-jpeg/actions/workflows/build.yml/badge.svg)](https://github.com/giovannicalo/node-jpeg/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/giovannicalo/node-jpeg/badge.svg)](https://coveralls.io/github/giovannicalo/node-jpeg)

## Prerequisites

* [CMake](https://cmake.org/) >= 3.21.0

## Installation

```bash
npm install giovannicalo/node-jpeg
```

> Not yet published to NPM. This will install it from GitHub.

## Usage

### Decoding

```javascript
const { promises: { readFile, writeFile } } = require("fs");

const { Format, decode } = require("jpeg");

(async () => {
    const jpeg = await readFile("foo.jpg");
    const rgba = await decode(jpeg, Format.rgba);
    console.log(rgba);
    // {
    //   data: Uint8ClampedArray(8294400) [...],
    //   format: 0,
    //   height: 1080,
    //   width: 1920
    // }
    await writeFile("foo.rgba", rgba.data);
    const yuv = await decode(jpeg, Format.yuv);
    console.log(yuv);
    // {
    //   data: Uint8ClampedArray(3110400) [...],
    //   format: 1,
    //   height: 1080,
    //   width: 1920
    // }
    await writeFile("foo.yuv", yuv.data);
})();
```

### Encoding

```javascript
const { promises: { readFile, writeFile } } = require("fs");

const { Format, encode } = require("jpeg");

(async () => {
    const rgba = {
        data: await readFile("foo.rgba"),
        format: Format.rgba,
        height: 1080,
        width: 1920
    };
    const jpeg = await encode(rgba, 90);
    console.log(jpeg);
    // <Buffer ...>
    await writeFile("foo.jpg", jpeg);
})();
```

## API

### `Format.rgba`

Value: 0

Standard RGBA format, supports both decoding and encoding.

### `Format.yuv`

Value: 1

YUV I420 format, currently supports only decoding. Smaller and faster than RGBA, but less straightforward. When the source JPEG image has odd dimensions, they will be rounded up to the nearest even number.

### `decode(data: Buffer, format = Format.rgba): Promise<Image>`

Decodes the JPEG image stored in the `data` buffer as `format`, which can be either `Format.rgba` or `Format.yuv`.

Returns a promise resolving to an object with `data`, `height`, `format` and `width` properties.

### `encode(image: Image, quality = 90): Promise<Buffer>`

Encodes a raw `image` as JPEG with the given `quality`. `image` must be an object with `data`, `height`, `format` and `width` properties. `image.format` currently has to be `Format.rgba`.

Returns a promise resolving to a buffer.
