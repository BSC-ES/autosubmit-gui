import React, { useContext } from 'react';
import ExperimentContext from "../context/experiment/experimentContext";
import queryString from 'query-string';
import  { Redirect } from 'react-router-dom';

const Login = (props) => {
  const values = queryString.parse(props.location.search);
  const experimentContext = useContext(ExperimentContext);
  const { getVerifyTicket, loggedUser } = experimentContext;
  const onVerify = (ticket) => {
    //e.preventDefault();
    console.log('Attempt to verify ' + ticket)
    getVerifyTicket(ticket);
  }
  const onCASLogin = () => {
    const _target = "https://cas.bsc.es/cas/login?service=https://earth.bsc.es/autosubmitapp/login";
    window.location.href = _target;
  }
  if (loggedUser) {
    if (loggedUser == 'Failed') {
      return (
        <div>
          Oops! We couldn't authenticate you.
        </div>
      )
    } else {
      return (
        <div>
          Welcome {loggedUser}
        </div>
      )
    }    
  } else {
    if (values.ticket){
      console.log('Verify'+ values.ticket);
      onVerify(values.ticket);
      return (    
        <div>
          Login...  {values.ticket}   
        </div>
      )
    } else {      
      onCASLogin();
      return null;
    }
  }
  
  
}

export default Login
