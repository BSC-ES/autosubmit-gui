#!/bin/bash

docker build \
    --build-arg "AUTOSUBMIT_API_SOURCE=http://127.0.0.1:8000" \
    -t autosubmit-gui --progress=plain . &> build.log