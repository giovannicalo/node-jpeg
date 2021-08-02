#include "decoder.hpp"

namespace nodeJpeg {

	Decoder::Decoder(
		Napi::Env environment,
		Napi::Uint8Array source,
		Format format
	) :
		Napi::AsyncWorker(environment),
		format(format),
		promise(Napi::Promise::Deferred::New(environment)),
		source(source)
	{}

	void Decoder::Execute() {
		tjhandle handle = tjInitDecompress();
		if (!handle) {
			SetError("[nodeJpeg::Decoder::Execute] Failed to initialize");
			return;
		}
		int32_t colorspace = 0;
		int32_t height = 0;
		int32_t subsampling = 0;
		int32_t width = 0;
		if (tjDecompressHeader3(
			handle,
			source.Data(),
			source.ByteLength(),
			&width,
			&height,
			&subsampling,
			&colorspace
		)) {
			SetError("[nodeJpeg::Decoder::Execute] Failed to read header");
			tjDestroy(handle);
			return;
		};
		if (format == Format::yuv) {
			// TODO: Support other colorspaces
			if (colorspace != TJCS_YCbCr) {
				SetError("[nodeJpeg::Decoder::Execute] Input image colorspace is not YUV");
				tjDestroy(handle);
				return;
			}
			// TODO: Support other subsamplings
			if (subsampling != TJSAMP_420) {
				SetError("[nodeJpeg::Decoder::Execute] Input image subsampling is not 4:2:0");
				tjDestroy(handle);
				return;
			}
			// TODO: Support odd dimensions
			height = (height + 1) & ~1;
			width = (width + 1) & ~1;
			uint64_t size = tjBufSizeYUV2(width, 1, height, TJSAMP_420);
			image = new Image(Format::yuv, width, height, size);
			std::memset(image->data, 0, size);
			if (tjDecompressToYUV2(
				handle,
				source.Data(),
				source.ByteLength(),
				image->data,
				width,
				1,
				height,
				0
			)) {
				SetError("[nodeJpeg::Decoder::Execute] Failed to decode");
				delete image;
			}
		} else if (format == Format::rgba) {
			uint32_t pitch = width * 4;
			uint64_t size = pitch * height;
			image = new Image(Format::rgba, width, height, size);
			if (tjDecompress2(
				handle,
				source.Data(),
				source.ByteLength(),
				image->data,
				width,
				pitch,
				height,
				TJPF_RGBA,
				0
			)) {
				SetError("[nodeJpeg::Decoder::Execute] Failed to decode");
				delete image;
			}
		} else {
			SetError("[nodeJpeg::Decoder::Execute] Format is invalid");
		}
		tjDestroy(handle);
	}

	void Decoder::OnError(const Napi::Error& error) {
		promise.Reject(error.Value());
	}

	void Decoder::OnOK() {
		Napi::Object output = Napi::Object::New(Env());
		output.Set("data", Napi::Uint8Array::New(
			Env(),
			image->size,
			Napi::ArrayBuffer::New(
				Env(),
				image->data,
				image->size,
				[](Napi::Env, void*, void* image) {
					delete static_cast<Image*>(image);
				},
				image
			),
			0,
			napi_uint8_clamped_array
		));
		output.Set(
			"format",
			Napi::Number::New(Env(), image->format)
		);
		output.Set(
			"height",
			Napi::Number::New(Env(), image->height)
		);
		output.Set(
			"width",
			Napi::Number::New(Env(), image->width)
		);
		promise.Resolve(output);
	}

	Napi::Promise Decoder::getPromise() {
		return promise.Promise();
	}

}
