import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { rootAppName } from "../context/vars";
import ExperimentContext from "../context/experiment/experimentContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const experimentContext = useContext(ExperimentContext);
  const { loggedUser, setLoggedUser } = experimentContext;
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  setLoggedUser(user, token);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loggedUser && loggedUser !== "Failed") {
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
