/* 
  Component that shows the log of the experiment.
*/
import React, { Component, Fragment } from "react";

class Running extends Component {
  constructor(props) {
    super(props);
    this.rundata = null;
    //this.messagesEnd = null;
    //this.messagesEndRef = React.createRef()
  }

  componentDidMount() {
    this.props.getExperimentRun(this.props.experiment.expid);
    if (this.props.experimentRunning) {
      this.interval = setInterval(
        () => this.props.getExperimentRun(this.props.experiment.expid),
        this.props.experiment.updateTime * 1000
      );
    }
  }

  componentWillUnmount() {
    //console.log(this.props.experimentRunning)
    this.props.cleanRunData();
    if (this.props.experimentRunning) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate() {
    window.scrollToBottom();
  }

  render() {
    if (this.props.rundata === null) {
      return (
        <Fragment>
          <div>Loading...</div>
        </Fragment>
      );
    }

    const {
      logcontent,
      error,
      error_message,
      found,
      logfile,
      lastModified,
      timeStamp,
    } = this.props.rundata;

    const logitems = logcontent.map((item) => (
      <li key={item.index}>
        <small>{item.content}</small>
      </li>
    ));

    if (error) {
      return <div className='error-message'>{error_message}</div>;
    }
    if (!found) {
      return (
        <Fragment>
          <div className='error-message'>
            Running log not found. This experiment might not be currently
            running on Autosubmit.
          </div>
        </Fragment>
      );
    }

    return (
      <div className='row'>
        <div className='col-12'>
          <div className='row px-1 file-info'>
            <div className='col-6 text-left'>
              <span>LOG FILE: {logfile}</span>{" "}
              <span className='text-muted'>({timeStamp})</span>
            </div>
            <div className='col-6 text-right text-muted'>
              LAST MODIFIED: {lastModified}
            </div>
          </div>

          {/* <p><strong>Showing last 50 lines of the log file:</strong></p> */}
          <pre className='bash mb-0 scroll' id='log_scroll'>
            <ul style={pStyle} className='p-1 mb-0 ul-2'>
              {logitems}
            </ul>
            {/* <div style={{ float:"left", clear: "both" }}
                            ref={this.messagesEndRef}>
                        </div>            */}
          </pre>

          <div className='text-muted text-center file-info'>
            Showing last 150 lines
          </div>
        </div>
      </div>
    );
  }
}

const pStyle = {
  listStyleType: "none",
};

// const experimentBuffer = {
//   height: 100,
// };

export default Running;
