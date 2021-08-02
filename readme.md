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

## API

### `Format.rgba`

Value: 0

Standard RGBA format, currently supports only decoding.

### `Format.yuv`

Value: 1

YUV I420 format, currently supports only decoding. Smaller and faster than RGBA, but less straightforward. When the source JPEG image has odd dimensions, they will be rounded up to the nearest even number.

### `decode(data: Buffer, format = Format.rgba): Promise<Image>`

Decodes the JPEG image stored in the `data` buffer as `format`, which can be either `Format.rgba` or `Format.yuv`.

Returns a promise resolving to an object with `data`, `height`, `format` and `width` properties.
