## Build

To build the image you can execute `./build.sh`, or:

```bash
docker build -t autosubmit-gui
```

> **NOTE**: The default image builds a GUI which `AUTOSUBMIT_API_SOURCE` is the relative path `/api`. This is needed if you want to change it using environment variables when starting the container.

On the build, you can fix a API URL by doing:

```bash
docker build \
    --build-arg "AUTOSUBMIT_API_SOURCE=http://127.0.0.1:8000" \
    -t autosubmit-gui
```

Also, you can select a different tag/branch/commit by running:

```bash
docker build \
    --build-arg "AUTOSUBMIT_API_SOURCE=http://127.0.0.1:8000" \
    --build-arg "GIT_BRANCH=v4.0.0-beta.3" \
    -t autosubmit-gui
```

Other `--build-arg` are available that are related to the build environment variables with prefix `REACT_APP_`. See the `Dockerfile` to know more about it. 

> **IMPORTANT: This environment variables that are set using the build arguments are only used while building, modifying them on runtime will not make any change.**

## Run

You can run the container by doing:

```bash
docker run --name autosubmit-gui-container \
    --rm -d -p 8089:8080 \
    autosubmit-gui
```

**Remember to map the port `8080` to the one you desire. In the example above, it is mapped to port `8089`.**

If the `AUTOSUBMIT_API_SOURCE` was not set during the build, the GUI will use the relative path `/api`. This means, if the GUI is served in `localhost:8080`, it will send the API requests to `localhost:8080/api`.

This mechanism works because the container can proxy the requests sent to `localhost:8080/api` to another URL using Nginx. And this can be set doing:

```bash
docker run --name autosubmit-gui-container \
    --rm -d -p 8080:8080 \
    -e "API_URL_PROXY=https://hostname/external-as-api/" \
    autosubmit-gui
```

This will forward the requests send to `localhost:8080/api` to `https://hostname/external-as-api/`. For example, `GET localhost:8080/api/v4/experiments` will go to `GET https://hostname/external-as-api/v4/experiments`.

With this option there is no need to build the image again.