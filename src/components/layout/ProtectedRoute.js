import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { rootAppName } from "../context/vars";
import ExperimentContext from "../context/experiment/experimentContext";
import { setAuthInLocalStorage, unsetAuthInLocalStorage } from "../context/utils";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const experimentContext = useContext(ExperimentContext);
  const { loggedUser } = experimentContext;
  const [credential, setCredential] = useState({
    loading: true,
    user: null,
    token: null
  })

  useEffect(() => {
    let newCredential = {
      loading: false,
      user: localStorage.getItem("user"),
      token: localStorage.getItem("token")
    }
    if(newCredential.user && newCredential.token){
      setAuthInLocalStorage(newCredential.user, newCredential.token)
    }else{
      unsetAuthInLocalStorage()
    }
    setCredential(newCredential)
  }, [loggedUser])

  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {
              !credential.loading &&
              <>
                {
                  ((loggedUser && loggedUser !== "Failed") || (credential.user && credential.token)) ?
                    <Component />
                    :
                    <Redirect
                      to={{
                        pathname: `/${rootAppName}/login/`,
                        state: { from: props.location },
                      }}
                    />
                }
              </>
            }
          </>
        )
      }}
    />
  );
};

export default ProtectedRoute;
