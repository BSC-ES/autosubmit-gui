import React, { Component } from "react";

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

    // if (this.props.rundata){
    //     console.log('DidMount Running.')
    // }
  }

  componentWillUnmount() {
    this.props.cleanPklData();
    if (this.props.experimentRunning) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { loadingPkl, pklchanges } = this.props;
    // if (loadingPkl) return <div>Loading...</div>
    // const currentDate = new Date();
    // const datetime = currentDate.getHours() + ":"
    //                 + currentDate.getMinutes() + ":"
    //                 + currentDate.getSeconds();

    // if (pklchanges) {
    //     return <div><small>{pklchanges}</small></div>
    // }
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header text-center py-0'>
              <small>Monitoring jobs...</small>
            </div>
            <div className='card-body p-0'>
              {pklchanges && (
                <pre className='scroll-y'>
                  {pklchanges}
                  {/* value={pklchanges} 
                                    className='monitorArea'
                                    style={monitorStyle}
                                    readOnly>                                         */}
                </pre>
              )}
              {loadingPkl && <small>Loading...</small>}
            </div>
          </div>
        </div>
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
