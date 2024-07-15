.. _installation:

##############
Installation
##############


Building the project locally
*****************************

.. important:: This project has been created by using `Create React App (CRA) <https://create-react-app.dev/>`_, so it is important to check CRA documentation to do changes on its deployment process.

First, clone the repository:

.. code-block:: bash

    git clone https://earth.bsc.es/gitlab/es/autosubmit-gui/

Then, check if you are using the right recommended Node.js version of this project to be sure there is no conflict in its dependencies. This could be easily done by using the `Node Version Manager <https://github.com/nvm-sh/nvm>`_ https://github.com/nvm-sh/nvm using:

.. code-block:: bash

    nvm use

Install the needed dependencies using the `Node Package Manager <https://www.npmjs.com/>`_:

.. code-block:: bash

    npm install


Configuring your GUI
=======================

.. important:: Please refer to the :ref:`configuration` page to check all the available options

To configure your GUI, first, create an ``.env`` file in the project root directory where you can write the URL of your Autosubmit API like in this example:

.. code-block:: bash

    REACT_APP_AUTOSUBMIT_API_SOURCE=https://my-autosubmit-api-url.com/


Start it locally on development mode
=====================================

Once configured, you are now able to run the GUI locally using:

.. code-block:: bash

    npm start


.. note:: Furthermore, if you want to set up it for production, please refere to the `Deployment CRA documentation <https://create-react-app.dev/docs/deployment>`_
