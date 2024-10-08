import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AUTHENTICATION, latestNewsLabel, NOAPI, rootAppName, TRACK_ESARCHIVE } from "../context/vars";
import ExperimentContext from "../context/experiment/experimentContext";
import Experiment from "../experiment/Experiment";
import FileStatus from "../experiment/FileStatus";
import { unsetAuthInLocalStorage } from "../context/utils";

const Navbar = ({ icon, title }) => {
  const navigate = useNavigate();
  const experimentContext = useContext(ExperimentContext);
  const {
    experiment,
    cleanFileStatusData,
    getFileStatus,
    esarchiveStatus,
    loggedUser,
    setLoggedUser,
    // testToken,
  } = experimentContext;
  const haveIReadTheNews = localStorage.getItem(latestNewsLabel);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // console.log(user);
    // console.log(token);
    // console.log(loggedUser);
    if (user && token && !loggedUser) {
      setLoggedUser(user, token);
    }

    // if (user && token && loggedUser) {
    //   testToken();
    // }
    // eslint-disable-next-line
  }, [loggedUser, setLoggedUser]);

  // useEffect(() => {
  //   testToken();
  // });

  // const expid = match.params.expid;

  let expid = null;
  if (experiment) {
    expid = experiment.expid;
  }

  const onLogout = (e) => {
    e.preventDefault();
    unsetAuthInLocalStorage();
    setLoggedUser(null, null);
    navigate(`/${rootAppName}/about`);
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-1 p-1'>
      <div className='container'>
        <Link className='navbar-brand' to={`/${rootAppName}/`}>
          <i className={icon} /> {title}
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#mainMenuContent'
          aria-controls='mainMenuContent'
          aria-expanded='false'
          aria-label='Toggle main menu'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='mainMenuContent'>
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
            <li className='nav-item'>
              <Link className='nav-link' to={`/${rootAppName}/news`}>
                <u className='text-decoration-none'>
                  News{" "}
                  {haveIReadTheNews === null ? (
                    <span className='badge badge-warning'>!</span>
                  ) : (
                    ""
                  )}
                </u>
              </Link>
            </li>
            <li className='nav-item'>
              {expid && <Experiment expidToken={expid} />}
            </li>
            <li>
              {
                TRACK_ESARCHIVE &&
                <FileStatus
                  getFileStatus={getFileStatus}
                  cleanFileStatusData={cleanFileStatusData}
                  esarchiveStatus={esarchiveStatus}
                />
              }

            </li>
          </ul>
          {
            AUTHENTICATION &&
            <>
              {loggedUser && loggedUser !== "Failed" && (
                <>
                  <span className='bg-secondary rounded text-dark px-2 mx-1'>
                    {loggedUser}
                  </span>
                  <button className='btn btn-sm btn-dark' onClick={onLogout}>
                    Logout
                  </button>
                </>
              )}
              {(!loggedUser || loggedUser === "Failed") && !NOAPI && (
                <Link
                  title='Some features might require your credentials.'
                  className='btn btn-sm btn-primary'
                  to={`/${rootAppName}/login`}
                >
                  Login
                </Link>
              )}
            </>
          }  
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
