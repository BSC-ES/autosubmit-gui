import React, { useContext, useEffect } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import queryString from "query-string";
import { rootAppUrl, rootAppName, thirdPartyLoginURL } from "../context/vars";

const Login = (props) => {
  const experimentContext = useContext(ExperimentContext);
  const { getVerifyTicket, loggedUser } = experimentContext;

  useEffect(() => {
    if (props.location && props.location.state) {
      localStorage.setItem("previousPath", props.location.state.from.pathname)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const values = queryString.parse(props.location.search);
    if (values.ticket) {
      onVerify(values.ticket);
    } else {
      onCASLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionAfter = () => {
    if (loggedUser) {
      let previousPath = localStorage.getItem("previousPath")
      if (previousPath) {
        localStorage.removeItem("previousPath")
        setTimeout(() => {
          props.history.push(`${previousPath}`);
        }, 3000);
      } else {
        setTimeout(() => {
          props.history.push(`/${rootAppName}/?user=${loggedUser}`);
        }, 3000);
      }
    }
  };

  const onVerify = (ticket) => {
    //e.preventDefault();
    //console.log('Attempt to verify ' + ticket)
    getVerifyTicket(ticket);
    //e.preventDefault();
  };
  const onCASLogin = () => {
    const _target = `${thirdPartyLoginURL}?service=${rootAppUrl}/${rootAppName}/login`;
    window.location.href = _target;
  };
  // console.log(loggedUser);
  // console.log(values);
  if (loggedUser) {
    actionAfter();
    if (loggedUser === "Failed") {
      return (
        <div>
          Oops! We couldn't authenticate you.
          <p>You will be redirected after some seconds.</p>
        </div>
      );
    } else {
      return (
        <div>
          Welcome {loggedUser}
          <p>You've been authenticated through CAS.</p>
          <p>You will be redirected after some seconds.</p>
        </div>
      );
    }
  }

  return null;
};

export default Login;
