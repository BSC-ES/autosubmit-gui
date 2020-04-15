import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import ExperimentContext from "../context/experiment/experimentContext";

const Navbar = ({ icon, title }) => {
  const history = useHistory();
  const experimentContext = useContext(ExperimentContext);
  const { searchExperiments } = experimentContext;

  const [text, setText] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (text !== "") {
      searchExperiments(text);
      history.push("/autosubmitapp/");
    }
  };

  const onChange = (e) => setText(e.target.value);

  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-dark mb-3'>
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
        </ul>
        {history &&
          history.location.pathname !== "/autosubmitapp/" &&
          history.location.pathname !== "/autosubmitapp" && (
            <form className='form-inline my-2 my-lg-0' onSubmit={submitSearch}>
              <input
                type='search'
                className='form-control mr-sm-2'
                placeholder='Search Experiments'
                aria-label='Search'
                value={text}
                onChange={onChange}
              />
              <button
                className='btn btn-outline-light my-2 my-sm-0'
                type='submit'
              >
                Search
              </button>
            </form>
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
