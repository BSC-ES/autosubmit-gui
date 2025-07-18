# Phase 1: Build the app
FROM node:iron-bullseye-slim AS build

# Install git
RUN apt-get update && apt-get install -y git

# Setting up the working directory and dependencies
WORKDIR /app

RUN git clone https://github.com/BSC-ES/autosubmit-gui.git .

ARG GIT_BRANCH="master"

RUN git checkout ${GIT_BRANCH}

RUN yarn install

# Build arguments
ARG AUTOSUBMIT_API_SOURCE="/api"
ARG PUBLIC_URL="/"
ARG DARK_MODE_SWITCHER="false"
ARG AUTHENTICATION="false"
ARG AUTH_PROVIDER
ARG CAS_THIRD_PARTY_LOGIN_URL
ARG CAS_SERVICE_ID
ARG GITHUB_CLIENT_ID
ARG OIDC_AUTHORIZATION_ENDPOINT
ARG OIDC_CLIENT_ID
ARG CUSTOM_LOGO_URL
ARG TOP_ANNOUNCEMENT

# Set environment variables for buils
ENV REACT_APP_AUTOSUBMIT_API_SOURCE=${AUTOSUBMIT_API_SOURCE}
ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_DARK_MODE_SWITCHER=${DARK_MODE_SWITCHER}
ENV REACT_APP_AUTHENTICATION=${AUTHENTICATION}
ENV REACT_APP_AUTH_PROVIDER=${AUTH_PROVIDER}
ENV REACT_APP_CAS_THIRD_PARTY_LOGIN_URL=${CAS_THIRD_PARTY_LOGIN_URL}
ENV REACT_APP_CAS_SERVICE_ID=${CAS_SERVICE_ID}
ENV REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV REACT_APP_OIDC_AUTHORIZATION_ENDPOINT=${OIDC_AUTHORIZATION_ENDPOINT}
ENV REACT_APP_OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
ENV REACT_APP_CUSTOM_LOGO_URL=${CUSTOM_LOGO_URL}
ENV REACT_APP_TOP_ANNOUNCEMENT=${TOP_ANNOUNCEMENT}

# Build the app
RUN yarn run build

# Phase 2: Serve the app with nginx
FROM nginx:alpine-slim AS runtime

ARG PUBLIC_URL="/"

# Conditional COPY path
COPY --from=build /app/build "/usr/share/nginx/html${PUBLIC_URL}"

# Copy the new configuration file over the default one
COPY nginx.conf /etc/nginx/nginx.conf

# Create an empty file for the API proxy
RUN touch /etc/nginx/conf.d/proxy.conf
ENV API_URL_PROXY=""

# Replace %%PUBLIC_URL%% to the value of PUBLIC_URL in the nginx configuration file
RUN sed -i "s|%%PUBLIC_URL%%|${PUBLIC_URL}|g" /etc/nginx/nginx.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "/entrypoint.sh" ]