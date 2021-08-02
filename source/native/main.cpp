#include <napi.h>

#include "./decode.hpp"

Napi::Object initialize(Napi::Env environment, Napi::Object exports) {
	exports.Set(
		"decode",
		Napi::Function::New(environment, nodeJpeg::decode)
	);
	Napi::Object format = Napi::Object::New(environment);
	format.Set(
		"rgba",
		Napi::Number::New(environment, nodeJpeg::Format::rgba)
	);
	format.Set(
		"yuv",
		Napi::Number::New(environment, nodeJpeg::Format::yuv)
	);
	exports.Set("Format", format);
	return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, initialize)
