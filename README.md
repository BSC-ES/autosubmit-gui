# Autosubmit GUI

[![status](https://joss.theoj.org/papers/a8ac17f6c02fdf76098ac97ed3e09b22/status.svg)](https://joss.theoj.org/papers/a8ac17f6c02fdf76098ac97ed3e09b22)
[![codecov](https://codecov.io/gh/BSC-ES/autosubmit-gui/graph/badge.svg?token=0O5IW8PCGO)](https://codecov.io/gh/BSC-ES/autosubmit-gui)

# Table of Contents

1. [Overview](#Overview)
2. [Installation](#installation)
3. [Testing](#testing)
4. [User Guide](#user-guide)
5. [Contributing](#contributing)

## Overview:

**Autosubmit GUI** is a front-end software developed using [ReactJS](https://react.dev/) as the main framework This front-end software consumes most of the information it needs from [Autosubmit API](https://earth.bsc.es/gitlab/es/autosubmit-api), an API that retrieves information from an internal file system and databases that result from the execution experiments under [Autosubmit](https://earth.bsc.es/gitlab/es/autosubmit) on a High Performance Computing environment.

These two systems, the **API** and the **GUI**, are independent. It is possible to replace **Autosubmit API** for another API that provides similar information. For that purpose, we provide with response examples (more details in the installation section) that can help the developer understand how the information is used in the components of the GUI. Furthermore, you can review the [Autosubmit API repository](https://earth.bsc.es/gitlab/es/autosubmit-api) to learn more about the API and find the current list of available requests.

Full documentation: https://autosubmit-gui.readthedocs.io/en/latest/

## Installation

> **NOTE**
> This project has been created by using [Create React App (CRA)](https://create-react-app.dev/), so it is important to check CRA documentation to do changes on its deployment process.

First, clone the repository:

`git clone https://earth.bsc.es/gitlab/es/autosubmit-gui/`

Then, check if you are using the right recommended Node.js version of this project to be sure there is no conflict in its dependencies. This could be easily done by using the [Node Version Manager](https://github.com/nvm-sh/nvm) using: 

`nvm use`

Install the needed dependencies using the [Node Package Manager](https://www.npmjs.com/):

`npm install`

It's important that you configure this project before using it by using Enviroment variables. This can be easily done by creating a `.env` file on the project root directory.

Here is an example content of a `.env` file:

```bash
REACT_APP_AUTOSUBMIT_API_SOURCE=https://earth.bsc.es/autosubmitapi
```

You can check the full list of the configuration variables here: https://autosubmit-gui.readthedocs.io/en/latest/configuration/index.html

> **NOTE**
> If you want to have different sets of `.env` files for different purposes (production, development, testing, etc), refer to the [Enviroment variables CRA documentation](https://create-react-app.dev/docs/adding-custom-environment-variables).


Now you are able to run the GUI locally using:

`npm start`

Or build the project bundle by doing:

`npm run build`

Furthermore, if you want to set up it for production, please refere to the [Deployment CRA documentation](https://create-react-app.dev/docs/deployment).


## Testing

The testing have been developed using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

To start running the e2e and component tests you have to configure and run the GUI. Follow the installation guide above if needed.

Then, you have to write a `.env.cypress` with the URL of your GUI and API like this:

```bash
CYPRESS_BASE_URL=http://localhost:3000/
CYPRESS_EXTERNAL_API=http://127.0.0.1:8000
```

Once done, you can run the tests by running `npm run cy:run` or interactively using `npm run cy:open`.


## User Guide

A user guide has been developed and published at https://autosubmit-gui.readthedocs.io/en/latest/userguide/index.html

We are constantly working on updating it considering the latest features.

## Contributing

Currently, the development of this software is under the `Autosubmit team` that belongs to the `Earth Science Department` of the `Barcelona Supercomputing Center`.

You can open issues in this repository using the `Email a new issue to this project` function, since user creation is currently restricted to only `BSC` members.
Most issues have been centralized in the [Autosubmit repository](https://earth.bsc.es/gitlab/es/autosubmit/-/issues), and you can check them there.

You are free (and encouraged) to clone this software and modify it to fit your needs. Moreover, the `BSC` is always looking for collaboration, so feel free to request support.
