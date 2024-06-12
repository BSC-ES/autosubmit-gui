# Phase 1: Build the app
FROM node:iron-bullseye-slim AS build

# Install git
RUN apt-get update && apt-get install -y git

# Setting up the working directory and dependencies
WORKDIR /app

RUN git clone https://earth.bsc.es/gitlab/es/autosubmit-gui .

ARG GIT_BRANCH="master"

RUN git checkout ${GIT_BRANCH}

RUN yarn install

# Build arguments
ARG AUTOSUBMIT_API_SOURCE
ARG PUBLIC_URL="/"
ARG DARK_MODE_SWITCHER="false"
ARG AUTHENTICATION="false"
ARG AUTH_PROVIDER
ARG CAS_THIRD_PARTY_LOGIN_URL
ARG CAS_SERVICE_ID
ARG GITHUB_CLIENT_ID

# Set environment variables for buils
ENV REACT_APP_AUTOSUBMIT_API_SOURCE=${AUTOSUBMIT_API_SOURCE}
ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_DARK_MODE_SWITCHER=${DARK_MODE_SWITCHER}
ENV REACT_APP_AUTHENTICATION=${AUTHENTICATION}
ENV REACT_APP_AUTH_PROVIDER=${AUTH_PROVIDER}
ENV REACT_APP_CAS_THIRD_PARTY_LOGIN_URL=${CAS_THIRD_PARTY_LOGIN_URL}
ENV REACT_APP_CAS_SERVICE_ID=${CAS_SERVICE_ID}
ENV REACT_APP_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}

# Build the app
RUN yarn run build

# Phase 2: Serve the app with nginx
FROM nginx:alpine-slim AS runtime

ARG PUBLIC_URL="/"

# Conditional COPY path
COPY --from=build /app/build "/usr/share/nginx/html${PUBLIC_URL}"

# Copy the new configuration file over the default one
COPY nginx.conf /etc/nginx/nginx.conf

# Replace %%PUBLIC_URL%% to the value of PUBLIC_URL in the nginx configuration file
RUN sed -i "s|%%PUBLIC_URL%%|${PUBLIC_URL}|g" /etc/nginx/nginx.conf


EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]