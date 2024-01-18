cmake_minimum_required(VERSION 3.21.0)

project("node-jpeg" VERSION 0.0.0)

set(CMAKE_CXX_STANDARD 23)

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

if(MSVC)
	set(CMAKE_CXX_FLAGS_DEBUG "/MTd /Zi")
	set(CMAKE_CXX_FLAGS_RELEASE "/MT")
	set(WITH_CRT_DLL FALSE)
endif()

add_definitions(-DNAPI_VERSION=8)

include(ExternalProject)

ExternalProject_Add(
	jpeg
	BUILD_COMMAND cmake --build . --config ${CMAKE_BUILD_TYPE} --target turbojpeg-static
	CMAKE_ARGS -DCMAKE_POSITION_INDEPENDENT_CODE=ON
	GIT_REPOSITORY "https://github.com/libjpeg-turbo/libjpeg-turbo.git"
	GIT_TAG "2.1.5.1"
	INSTALL_COMMAND ""
)

file(GLOB_RECURSE source "source/native/*")

add_library(${PROJECT_NAME} SHARED ${source} ${CMAKE_JS_SRC})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

execute_process(
	COMMAND node -p "require(\"node-addon-api\").include"
	WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
	OUTPUT_VARIABLE nodeAddonApi
)

string(REGEX REPLACE "[\n\r\"]" "" nodeAddonApi ${nodeAddonApi})

ExternalProject_Get_Property(jpeg BINARY_DIR SOURCE_DIR)

target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC} ${nodeAddonApi} ${SOURCE_DIR})

target_link_directories(${PROJECT_NAME} PRIVATE ${BINARY_DIR})

if(MSVC)
	set(jpeg "turbojpeg-static")
else()
	set(jpeg "turbojpeg")
endif()

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${jpeg})
