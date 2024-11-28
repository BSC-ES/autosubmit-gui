.. _configuration:

##############
Configuration
##############

Before building the project, it is important to create a ``.env`` file on the project root and set the following variables:

General variables
**************************

* ``REACT_APP_AUTOSUBMIT_API_SOURCE``: Defines the API URI. For more information check `autosubmit_api <https://github.com/BSC-ES/autosubmit-api>`_.
* ``PUBLIC_URL``: This allows to serve the GUI from another subpath. See more in `CRA advanced configuration <https://create-react-app.dev/docs/advanced-configuration>`_.
* ``REACT_APP_DARK_MODE_SWITCHER`` *(experimental feature)*: Default ``false``. Set it to ``true`` if you want to enable the Dark mode feature.


Authentication variables
**************************

* ``REACT_APP_AUTHENTICATION``: Default ``false``. You can set it to ``false`` to avoid the requirement of an authentication in the GUI. However, some API calls might require that you have a valid token. In case is set to ``true``, you have to specify ``REACT_APP_AUTH_PROVIDER``.
* ``REACT_APP_AUTH_PROVIDER``: Can be set to ``cas`` or ``github``. If ``cas`` is set, you have to specify ``REACT_APP_CAS_THIRD_PARTY_LOGIN_URL`` and ``REACT_APP_CAS_SERVICE_ID``, else if ``github`` you have to specify ``REACT_APP_GITHUB_CLIENT_ID``.
* ``REACT_APP_CAS_THIRD_PARTY_LOGIN_URL``: This is the login endpoint to request credentials to the user according to the `CAS protocol <https://apereo.github.io/cas/6.6.x/protocol/CAS-Protocol.html>`_.
* ``REACT_APP_CAS_SERVICE_ID``: This will specify the `service` parameter during the request of credentials according to the `CAS protocol <https://apereo.github.io/cas/6.6.x/protocol/CAS-Protocol.html>`_.
* ``REACT_APP_GITHUB_CLIENT_ID``: Client ID that will be used to link with the Oauth app. See more on `Github Oauth <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>`_.


.. note:: If you want to have different sets of ``.env`` files for different purposes (production, development, testing, etc), refer to the `Enviroment variables CRA documentation <https://create-react-app.dev/docs/adding-custom-environment-variables>`_.

Here is an example of ``.env`` file:

.. code-block:: bash

    REACT_APP_AUTOSUBMIT_API_SOURCE=https://earth.bsc.es/autosubmitapi

    REACT_APP_AUTHENTICATION=true
    REACT_APP_AUTH_PROVIDER=cas
    REACT_APP_CAS_THIRD_PARTY_LOGIN_URL=https://cas.bsc.es/cas/login
    REACT_APP_CAS_SERVICE_ID=https://earth.bsc.es/autosubmitapp/login
