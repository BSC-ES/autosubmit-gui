import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { rootAppName } from "../context/vars";
import ExperimentContext from "../context/experiment/experimentContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const experimentContext = useContext(ExperimentContext);
  const { loggedUser } = experimentContext;
  const [credential, setCredential] = useState({
    user: localStorage.getItem("user"),
    token: localStorage.getItem("token")
  })

  useEffect(() => {
    setCredential({
      user: localStorage.getItem("user"),
      token: localStorage.getItem("token")
    })
  }, [loggedUser])

  return (
    <Route
      {...rest}
      render={(props) => {
        if ((loggedUser && loggedUser !== "Failed") || (credential.user && credential.token)) {
          return <Component />;
        } else {
          return (
            <Redirect
              to={{
                pathname: `/${rootAppName}/login/`,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
