#!/bin/bash

docker run --name autosubmit-gui-container \
    --rm -d -p 8080:8080 \
    autosubmit-gui