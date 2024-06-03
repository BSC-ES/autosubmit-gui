#!/bin/bash

docker run --name autosubmit-gui-container \
    --rm -d -p 8089:8080 \
    autosubmit-gui