import React, { useContext, useEffect } from 'react';
import ExperimentContext from "../context/experiment/experimentContext";
import queryString from 'query-string';

const Login = (props) => {
  
  const experimentContext = useContext(ExperimentContext);
  const { getVerifyTicket, loggedUser } = experimentContext;
  
  useEffect(() => {
    const values = queryString.parse(props.location.search);
    if (values.ticket){      
      onVerify(values.ticket);
    } else {
      onCASLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const onVerify = (ticket) => {
    //e.preventDefault();
    //console.log('Attempt to verify ' + ticket)
    getVerifyTicket(ticket);
    //e.preventDefault();
  }
  const onCASLogin = () => {
    const _target = "https://cas.bsc.es/cas/login?service=https://earth.bsc.es/autosubmitapp/login";
    //console.log('On CAS Log')
    window.location.href = _target;
  }
  // console.log(loggedUser);
  // console.log(values);
  if (loggedUser) {
    if (loggedUser === 'Failed') {
      return (
        <div>
          Oops! We couldn't authenticate you.
        </div>
      );
    } else {
      return (
        <div>
          Welcome {loggedUser}
        </div>
      );
    }    
  };
  
  
  return null;
}

export default Login
