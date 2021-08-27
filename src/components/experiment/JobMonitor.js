import React, { Component } from "react";
import Notification from "react-web-notification";

class JobMonitor extends Component {
  // const experimentContext = useContext(ExperimentContext);
  // const { pkldata, loadingPkl } = experimentContext;
  componentDidMount() {
    if (this.props.experiment) {
      this.props.getExperimentPkl(
        this.props.experiment.expid,
        this.props.experiment.pkl_timestamp
      );
      if (this.props.experimentRunning) {        
        this.interval = setInterval(
          () =>
            this.props.getExperimentPkl(
              this.props.experiment.expid,
              this.props.experiment.pkl_timestamp
            ),
          this.props.experiment.updateTime * 2000
        );
      }
    }
  }

  componentWillUnmount() {
    this.props.cleanPklData();
    if (this.props.experimentRunning) {
      clearInterval(this.interval);
    }
  }

  render() {
    const {
      loadingPkl,
      pklchanges,
      notificationTitleGraph,
      setNotificationTitleGraph,
    } = this.props;
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header text-center py-0'>
              <small>Monitoring jobs...</small>
            </div>
            <div className='card-body p-0'>
              {pklchanges && <pre className='scroll-y mb-0'>{pklchanges}</pre>}
              {loadingPkl && <small>Loading...</small>}
            </div>
          </div>
        </div>
        {notificationTitleGraph && (
          <Notification
            title={notificationTitleGraph}
            onClose={() => setNotificationTitleGraph(null)}
            onPermissionDenied={() => console.log("Permission Denied.")}
          />
        )}
      </div>
    );
  }
}

// const experimentStyle = {
//     height: 338
//   };
// const monitorStyle = {
//     height: 310
// }

export default JobMonitor;
