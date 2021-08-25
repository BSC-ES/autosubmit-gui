import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";
import Experiment from "../experiment/Experiment";
import FileStatus from "../experiment/FileStatus";

const Navbar = ({ icon, title }) => {
  const history = useHistory();
  const experimentContext = useContext(ExperimentContext);
  const { searchExperiments, experiment, cleanFileStatusData, getFileStatus, esarchiveStatus, loggedUser, setLoggedUser } = experimentContext;
  // Fake Session
  // localStorage.setItem("user", "molid");
  // localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token && !loggedUser){
      setLoggedUser(user, token);
    }

    // if (user && token && loggedUser){
    //   testToken();
    // }   
    
  } ,[loggedUser, setLoggedUser])

  const [text, setText] = useState("");
  // const expid = match.params.expid;
  const submitSearch = (e) => {
    e.preventDefault();
    if (text !== "") {
      searchExperiments(text);
      history.push("/autosubmitapp/");
    }
  };
  let expid = null;
  if (experiment) {
    expid = experiment.expid;
  }
  const onChange = (e) => setText(e.target.value);

  const onLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLoggedUser(null, null);    
  }

  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-1 p-1'>
      <div className='container'>
        <Link className='navbar-brand' to='/autosubmitapp/'>
          <i className={icon} /> {title}
        </Link>
        <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>
          <li className='nav-item'>
            <Link className='nav-link' to='/autosubmitapp/'>
              Home
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/autosubmitapp/about'>
              <u>About</u>
            </Link>
          </li>
          <li className='nav-item'>
            {expid && <Experiment expidToken={expid} />}
          </li>
          <li>
          <FileStatus getFileStatus={getFileStatus} cleanFileStatusData={cleanFileStatusData} esarchiveStatus={esarchiveStatus} />
          </li>
        </ul>

        {history &&
          history.location.pathname !== "/autosubmitapp/" &&
          history.location.pathname !== "/autosubmitapp" && (
            <form className='form-inline my-2 my-lg-0' onSubmit={submitSearch}>
              <div className="input-group input-group-sm">
                <input
                  type='search'
                  className='form-control py-0'
                  placeholder='Search Experiments'
                  aria-label='Search'
                  value={text}
                  onChange={onChange}
                />
                <div className='input-group-append'>
                <button
                className='btn btn-dark'
                type='submit'
                data-toggle='tooltip' 
                data-placement='bottom' 
                title='Search by expid, description, or owner.'
              >
                Search
              </button>
                </div>
              </div>
            </form>
          )}
        
        {loggedUser && loggedUser !== "Failed" && (
          <span className="bg-secondary rounded text-dark px-2 mx-1">{loggedUser}</span>          
        )}
        {loggedUser && loggedUser !== "Failed" && (
          <button className="btn btn-sm btn-dark" onClick={onLogout}>
            Logout
          </button>
        )}
        {(!loggedUser || loggedUser === "Failed") && (
          <Link title='Only for testing purposes.' className='btn btn-sm btn-primary' to='/autosubmitapp/login'>Login</Link>
        )}
        
      </div>
    </nav>

    // <nav className='navbar bg-primary'>
    //   <h1>
    //     <i className={icon} /> {title}
    //   </h1>
    //   <ul>
    //     <li>
    //       <Link to='/'>Home</Link>
    //     </li>
    //     <li>
    //       <Link to='/about'>About</Link>
    //     </li>
    //   </ul>
    // </nav>
  );
};

Navbar.defaultProps = {
  title: "Autosubmit Searcher",
  icon: "fas fa-home",
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Navbar;
