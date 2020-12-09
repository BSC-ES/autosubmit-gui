## Autosubmit GUI
### Overview: 
Autosubmit GUI is a front-end software developed using [ReactJS](https://reactjs.org/docs/getting-started.html) as the main framework, and JavaScript in general.
This front-end software consumes most of the information it needs from [Autosubmit API](https://earth.bsc.es/gitlab/wuruchi/autosubmitreact/-/wikis/Autosubmit-API), an API that retrieves information from an internal file system that 
results from the execution of [Autosubmit](https://earth.bsc.es/gitlab/es/autosubmit) to execute experiments on a High Performance Computing environment.

These two systems, the API and the GUI, are tightly coupled. However, it is possible to adapt the API calls to other sources of information you might prefer, and for 
that purpose we provide with response examples (more details in the installation section) that can help the developer understand how the information is used in 
the components of the GUI.

Autosubmit GUI uses [FancyTree](https://github.com/mar10/fancytree/) and [vis.js](https://visjs.org/), two popular and very useful libraries, to show the experiment 
information in a graphical and comprehensive way. The GUI implements creative ways to use these libraries to dynamically display information without losing performance. 
Some of the expermients in our environment can include more than `10000` items, and showing this information in a web format without significant loss of performance is 
by itself and achievement. 


### General Knowledge Requirements:

* npm
* Javascript: asynchronous functions, promises, event handling, etc.
* Bootstrap 4 and CSS
* DOM manipulation
* JSON
* ReactJS


### Installation
The main development framework is **npm**, we are currently using version `6.9.0`. You can find the main **npm** dependencies in the file: [package.json](package.json).
Refer to: [npm documentation](https://docs.npmjs.com/) for more information about installation and first steps on this platform.

Make sure to have npm installed in your local environment.

Execute:

`git clone https://earth.bsc.es/gitlab/wuruchi/autosubmitreact/`

As default, the GUI will request data from the `Autosubmit API`, which is inacessible from outside the Barcelona Supercomputing Center internal network. 
So, we should open the file:

`/autosubmitreact/src/components/context/vars.js`

And change the line:

`export const NOAPI = false;`

to: 

`export const NOAPI = true;`

This will effectively set the API calls to be redirected towards an internal data samples folder `/autosubmitreact/src/components/context/data/` implemented for testing purposes.

Go to the cloned folder and execute:

`npm start`

Then, the GUI should open in your default browser, and the information displayed should correspond to that of the data samples folder.

### Testing

The testing suite has been developed using [JEST](https://jestjs.io/en/).

To execute it, go to your main folder (`/autosubmitreact/`) and execute:

`npm test`

Almost all tests can be found at `/autosubmitreact/src/components/experiment/tests/`.

### User Guide

A user guide has been developed and published at [https://autosubmit.readthedocs.io/en/latest/autosubmit-gui.html](https://autosubmit.readthedocs.io/en/latest/autosubmit-gui.html). 
Although a little outdated, we are constantly working on updating it considering the latest features.

### Contributing

Currently, the development of this software is under the `Autosubmit team` that belongs to the `Earth Science Department` of the `Barcelona Supercomputing Center`. 

You can open issues in this repository using the `Email a new issue to this project` function, since user creation is currently restricted to only `BSC` members. 
Most issues have been centralized in the [Autosubmit repository](https://earth.bsc.es/gitlab/es/autosubmit/-/issues), and you can check them there.

As per license, you are free (and encouraged) to clone this software and modify it to fit your needs.






