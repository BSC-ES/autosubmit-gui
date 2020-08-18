import React, { Component } from "react";
// import Notification from "react-web-notification";

class JobMonitorTree extends Component {
  componentDidMount() {
    if (this.props.experiment) {
      this.props.getExperimentTreePkl(
        this.props.experiment.expid,
        this.props.experiment.pkl_timestamp
      );
      if (this.props.experimentRunning) {
        this.interval = setInterval(
          () =>
            this.props.getExperimentTreePkl(
              this.props.experiment.expid,
              this.props.experiment.pkl_timestamp
            ),
          this.props.experiment.updateTime * 2000
        );
      }
    }
  }

  componentWillUnmount() {
    this.props.cleanPklTreeData();
    if (this.props.experimentRunning) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { loadingTreePkl, pkltreechanges } = this.props;
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header text-center py-0'>
              <small>Monitoring jobs...</small>
            </div>
            <div className='card-body p-0'>
              {pkltreechanges && (
                <pre className='scroll-y-tree mb-0'>{pkltreechanges}</pre>
              )}
              {loadingTreePkl && <small>Loading...</small>}
            </div>
          </div>
        </div>
        {/* <Notification title={"Honk"} /> */}
      </div>
    );
  }
}

export default JobMonitorTree;
