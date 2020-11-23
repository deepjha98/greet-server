#!/usr/bin/env bash

set -e

export precisely_USE_VALGRIND="true"
export precisely_VALGRIND_OPTIONS=${precisely_VALGRIND_OPTIONS:="--leak-check=full --track-fds=yes --log-file=./precisely_valgrind_%p.log"}
# export precisely_VALGRIND_OPTIONS=${precisely_VALGRIND_OPTIONS:="--leak-check=full --track-fds=yes"}
export DEBUG="*worker* *WARN* *ERROR* precisely_worker*"
export INTERACTIVE="true"

./server.js
