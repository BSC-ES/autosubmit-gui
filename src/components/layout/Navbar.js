import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { latestNewsLabel, NOAPI, rootAppName } from "../context/vars";
import ExperimentContext from "../context/experiment/experimentContext";
import Experiment from "../experiment/Experiment";
import FileStatus from "../experiment/FileStatus";

const Navbar = ({ icon, title }) => {
  const history = useHistory();
  const experimentContext = useContext(ExperimentContext);
  const { searchExperiments, experiment, cleanFileStatusData, getFileStatus, esarchiveStatus, loggedUser, setLoggedUser } = experimentContext;
  const haveIReadTheNews = localStorage.getItem(latestNewsLabel);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token && !loggedUser) {
      setLoggedUser(user, token);
    }
  }, [loggedUser, setLoggedUser])

  const [text, setText] = useState("");
  // const expid = match.params.expid;
  const submitSearch = (e) => {
    e.preventDefault();
    if (text !== "") {
      searchExperiments(text);
      history.push(`/${rootAppName}/`);
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
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-1 p-1'>
      <div className='container'>
        <Link className='navbar-brand' to={`/${rootAppName}/`}>
          <i className={icon} /> {title}
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainMenuContent" aria-controls="mainMenuContent" aria-expanded="false" aria-label="Toggle main menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainMenuContent">
          <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>
            <li className='nav-item'>
              <Link className='nav-link' to={`/${rootAppName}/`}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to={`/${rootAppName}/about`}>
                <u>About</u>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/${rootAppName}/news`}>
                <u className="text-decoration-none">News {haveIReadTheNews === null ? <span className="badge badge-warning">!</span> : ""}</u>
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
            history.location.pathname !== `/${rootAppName}/` &&
            history.location.pathname !== `/${rootAppName}` && (
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
          {((!loggedUser || loggedUser === "Failed") && !NOAPI) && (
            <Link title='Some features might require your credentials.' className='btn btn-sm btn-primary' to='/autosubmitapp/login'>Login</Link>
          )}
        </div>
      </div>
    </nav>
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
