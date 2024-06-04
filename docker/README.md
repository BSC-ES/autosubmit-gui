## Build

To build the image you can execute `./build.sh`, or:

```bash
docker build \
    --build-arg "AUTOSUBMIT_API_SOURCE=http://127.0.0.1:8000" \ # Required argument
    -t autosubmit-gui
```

On the build, you can select a different tag/branch/commit by running:

```bash
docker build \
    --build-arg "AUTOSUBMIT_API_SOURCE=http://127.0.0.1:8000" \
    --build-arg "GIT_BRANCH=v4.0.0-beta.3" \
    -t autosubmit-gui
```

Other `--build-arg` are available that are related to the build environment variables with prefix `REACT_APP_`. See the `Dockerfile` to know more about it. **Note: This environment variables are only used while building, modifying them on runtime will not make any change.**

## Run

You can run the container by doing:

```bash
docker run --name autosubmit-gui-container \
    --rm -d -p 8089:8080 \
    autosubmit-gui
```

**Remember to map the port `8080` to the one you desire. In the example above, it is mapped to port `8089`.**