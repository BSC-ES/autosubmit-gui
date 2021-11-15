import React, { Fragment } from "react";

const About = () => {
  return (
    <Fragment>
      <h3>User Information</h3>
      {/* <p>
        For user instructions visit our user guide{" "}
        <a href='https://autosubmit.readthedocs.io/en/latest/autosubmit-gui.html'>
          User Guide
        </a>
        .
      </p> */}
      <p>
        To request more information make a post in the issue{" "}
        <a href='https://earth.bsc.es/gitlab/es/autosubmit/issues/506'>
          Autosubmit User Documentation
        </a>
        .
      </p>
      <h3>Bugs and Requests</h3>
      <p>
        If you find a bug or want to request some important feature, please open
        an issue at{" "}
        <a href='https://earth.bsc.es/gitlab/es/autosubmit/issues'>
          Autosubmit Issues
        </a>
        .
      </p>
      <p>Version: 1.0.0-beta</p>
    </Fragment>
  );
};

export default About;
