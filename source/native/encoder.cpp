#include "encoder.hpp"

namespace nodeJpeg {

	Encoder::Encoder(
		Napi::Env environment,
		Napi::Object source,
		float_t quality
	) :
		Napi::AsyncWorker(environment),
		promise(Napi::Promise::Deferred::New(environment)),
		quality(quality)
	{
		auto data = source.Get("data").As<Napi::Uint8Array>();
		image = new Image(
			static_cast<Format>(source.Get("format").As<Napi::Number>().Int32Value()),
			source.Get("width").As<Napi::Number>().Uint32Value(),
			source.Get("height").As<Napi::Number>().Uint32Value(),
			data.ByteLength()
		);
		std::memcpy(image->data, data.Data(), data.ByteLength());
	}

	Encoder::~Encoder() {
		delete image;
	}

	void Encoder::Execute() {
		tjhandle handle = tjInitCompress();
		if (!handle) {
			SetError("[nodeJpeg::Encoder::Execute] Failed to initialize");
			return;
		}
		if (image->format == Format::rgba) {
			if (tjCompress2(
				handle,
				image->data,
				image->width,
				image->width * 4,
				image->height,
				TJPF_RGBA,
				&buffer,
				reinterpret_cast<unsigned long*>(&size),
				TJSAMP_420,
				quality,
				0
			)) {
				SetError("[nodeJpeg::Encoder::Execute] Failed to encode");
			}
		} else if (image->format == Format::yuv) {
			// TODO: Support YUV
			SetError("[nodeJpeg::Encoder::Execute] Encoding YUV images is not yet supported");
		} else {
			SetError("[nodeJpeg::Encoder::Execute] Format is invalid");
		}
		tjDestroy(handle);
	}

	void Encoder::OnError(const Napi::Error& error) {
		promise.Reject(error.Value());
	}

	void Encoder::OnOK() {
		promise.Resolve(Napi::Buffer<uint8_t>::New(
			Env(),
			buffer,
			size,
			[](Napi::Env, void* data) {
				tjFree(static_cast<unsigned char*>(data));
			}
		));
	}

	Napi::Promise Encoder::getPromise() {
		return promise.Promise();
	}

}
