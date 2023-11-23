import React from "react";
import packageJson from "../../../package.json";

const About = () => {
  return (
      <div className="my-2 mx-2">
        <h2>User Information</h2>
        <p>
          For user instructions visit our {" "}
          <a href='https://autosubmit-gui.readthedocs.io/en/latest/'>
            User Guide
          </a>
          .<br></br>
          To request more information make a post in the issue{" "}
          <a href='https://earth.bsc.es/gitlab/es/autosubmit/issues/506'>
            Autosubmit User Documentation
          </a>
          .
        </p>
        <h2>Bugs and Requests</h2>
        <p>
          If you find a bug or want to request some important feature, please open
          an issue at{" "}
          <a href='https://earth.bsc.es/gitlab/es/autosubmitreact/issues'>
            Autosubmit GUI Issues page
          </a>
          .
        </p>
        <figcaption className="blockquote-footer">Version: {packageJson.version}</figcaption>
      </div>
  );
};

export default About;