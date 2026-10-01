<div align="center">
  <img src="https://autosubmit.readthedocs.io/en/latest/_images/as_gui.png"
       alt="Autosubmit GUI" width="18%" />
  <h4>Autosubmit GUI</h4>
</div>

<p align="center">
  <a href="https://joss.theoj.org/papers/a8ac17f6c02fdf76098ac97ed3e09b22">
    <img src="https://joss.theoj.org/papers/a8ac17f6c02fdf76098ac97ed3e09b22/status.svg" alt="JOSS status" />
  </a>
  <a href="https://codecov.io/gh/BSC-ES/autosubmit-gui">
    <img src="https://codecov.io/gh/BSC-ES/autosubmit-gui/graph/badge.svg?token=0O5IW8PCGO" alt="codecov" />
  </a>
</p>

The **Autosubmit Graphical User Interface (GUI)** is the web-based [Autosubmit](https://github.com/BSC-ES/autosubmit) frontend that allows users to discover, manage, monitor, and analyze High-Performance Computing (HPC) experiments. It is based on [ReactJS](https://react.dev/) and relies on the [Autosubmit API](https://github.com/BSC-ES/autosubmit-api) as the middleware to get experiment information.

Full documentation: https://autosubmit-gui.readthedocs.io/en/latest/

# Table of Contents

1. [Installation](#installation)
2. [Testing](#testing)
3. [User Guide](#user-guide)
4. [Contributing](#contributing)

## Installation

> [!NOTE]
> This project was created using [Vite](https://vite.dev/). Check its documentation before making changes to the deployment process.

First, clone the repository:

```bash
git clone https://github.com/BSC-ES/autosubmit-gui
```

Then, check if you are using the right recommended Node.js version of this project to be sure there is no conflict in its dependencies. This could be easily done by using the [Node Version Manager](https://github.com/nvm-sh/nvm) using: 

```bash
nvm use
```

Install the needed dependencies using the [Node Package Manager](https://www.npmjs.com/):

```bash
npm install
```

It is important to configure the project before using it by setting up the enviroment variables. This can be easily done by creating a `.env` file on the project root directory.

Here is an example content of a `.env` file:

```bash
REACT_APP_AUTOSUBMIT_API_SOURCE=https://earth.bsc.es/autosubmitapi
```

You can check the full list of the configuration variables here: https://autosubmit-gui.readthedocs.io/en/latest/configuration/index.html

> [!NOTE]
> If you want to have different sets of `.env` files for different purposes (production, development, testing, etc), refer to the [Vite's Enviroment variables documentation](https://vite.dev/guide/env-and-mode#env-files).


Now you are able to run the GUI locally using:

`npm start`

Or build the project bundle by doing:

`npm run build`

Furthermore, if you want to set up it for production, please refere to the [Vite's Building for Production documentation](https://vite.dev/guide/build.html).


## Testing

The testing have been developed using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

To start running the e2e and component tests you have to configure and run the GUI. Follow the installation guide above if needed.

Then, you have to write a `.env.cypress` with the URL of your GUI and API like this:

```bash
CYPRESS_BASE_URL=http://localhost:3000/
```

Once done, you can run the tests by running `npm run cy:run` or interactively using `npm run cy:open`.


## User Guide

A user guide has been developed and published at https://autosubmit-gui.readthedocs.io/en/latest/userguide/index.html

We are constantly working on updating it considering the latest features.

## Contributing

The development of this software relies on the `Autosubmit team`, which belongs to the `Earth Sciences Department` of the `Barcelona Supercomputing Center`.

Feel free to open issues in this repository to make suggestions, provide ideas, or report problems. For security concerns, please follow the procedure in the "Security" tab.

You are free (and encouraged) to clone this software and modify it to fit your needs. Pull requests implementing outstanding solutions are always welcome as well.

For reporting issues not directly related with the GUI, please refer to the [Autosubmit repository](https://earth.bsc.es/gitlab/es/autosubmit/-/issues).
