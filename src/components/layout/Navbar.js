import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navbar = ({ icon, title }) => {
  return (

    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-3">
        <div className="container">
            <Link className="navbar-brand" to='/'><i className={icon} /> {title}</Link>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to='/'>Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/about'>About</Link>
                </li>
                
            </ul>
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
  title: 'Autosubmit Searcher',
  icon: 'fas fa-home'
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Navbar;
