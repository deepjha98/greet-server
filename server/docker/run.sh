#!/usr/bin/env bash

export DEBUG=${DEBUG:="mediasoup:INFO* *WARN* *ERROR*"}
export INTERACTIVE=${INTERACTIVE:="true"}
export PROTOO_LISTEN_PORT=${PROTOO_LISTEN_PORT:="4443"}
export HTTPS_CERT_FULLCHAIN=${HTTPS_CERT_FULLCHAIN:="/service/certs/fullchain.pem"}
export HTTPS_CERT_PRIVKEY=${HTTPS_CERT_PRIVKEY:="/service/certs/privkey.pem"}
export mediasoup_LISTEN_IP=${mediasoup_LISTEN_IP:="0.0.0.0"}
export mediasoup_MIN_PORT=${mediasoup_MIN_PORT:="2000"}
export mediasoup_MAX_PORT=${mediasoup_MAX_PORT:="2020"}

# Valgrind related options.
export mediasoup_USE_VALGRIND=${mediasoup_USE_VALGRIND:="false"}
export mediasoup_VALGRIND_OPTIONS=${mediasoup_VALGRIND_OPTIONS:="--leak-check=full --track-fds=yes --log-file=/storage/mediasoup_valgrind_%p.log"}

docker run \
	--name=mediasoup-demo \
	-p ${PROTOO_LISTEN_PORT}:${PROTOO_LISTEN_PORT}/tcp \
	-p ${mediasoup_MIN_PORT}-${mediasoup_MAX_PORT}:${mediasoup_MIN_PORT}-${mediasoup_MAX_PORT}/udp \
	-p ${mediasoup_MIN_PORT}-${mediasoup_MAX_PORT}:${mediasoup_MIN_PORT}-${mediasoup_MAX_PORT}/tcp \
	-v ${PWD}:/storage \
	-v ${mediasoup_SRC}:/mediasoup-src \
	--init \
	-e DEBUG \
	-e INTERACTIVE \
	-e DOMAIN \
	-e PROTOO_LISTEN_PORT \
	-e HTTPS_CERT_FULLCHAIN \
	-e HTTPS_CERT_PRIVKEY \
	-e mediasoup_LISTEN_IP \
	-e mediasoup_ANNOUNCED_IP \
	-e mediasoup_MIN_PORT \
	-e mediasoup_MAX_PORT \
	-e mediasoup_USE_VALGRIND \
	-e mediasoup_VALGRIND_OPTIONS \
	-e mediasoup_WORKER_BIN \
	-it \
	--rm \
	mediasoup-demo:latest
