import React, { Component } from 'react'

class FileStatus extends Component {

  componentDidMount(){
    this.props.getFileStatus();
    this.interval = setInterval(() => this.props.getFileStatus(), 300000); // Every 300 seconds
  }

  componentWillUnmount() {
    this.props.cleanFileStatusData();
    clearInterval(this.interval);
  }

  render() {
    
    if (this.props.esarchiveStatus){
      const {
        avg_bandwidth,
        avg_latency,
        bandwidth_warning,
        current_bandwidth,
        current_latency,
        //datetime,
        error, 
        error_message,
        latency_warning,
        reponse_time,
        response_warning,
        status,
      } = this.props.esarchiveStatus;

      // let badge_style = status === "ONLINE" ? "badge badge-success" : "badge badge-secondary";
      // let show_alert = false;
      const metrics_text = !error ? current_bandwidth.toFixed(2) + " MB/s " + current_latency.toFixed(2) + " s" : "";
      let span_alert = <small>esarchive {metrics_text}</small>;
      if (error || status !== "ONLINE"){
        const message_pop = error ? error_message : "Access to esarchive seems to be unstable at the moment.";
        span_alert = <span className="badge badge-light" data-toggle='tooltip' data-placement='bottom' title={message_pop}>esarchive UNKNOWN!</span>;
      } else {
        if (bandwidth_warning || latency_warning || response_warning){
          //badge_style = "badge badge-warning";     
          //show_alert = true;  
          const title_bandwidth_warn  =  bandwidth_warning ? 
          String(bandwidth_warning) + ". Current bandwidth: " + String(current_bandwidth.toFixed(2)) + " MB/s. Average over last day: " + String(avg_bandwidth.toFixed(2)) + " MB/s." 
          : "";
          const title_latency_warn  =  latency_warning ? 
          "\n" + String(latency_warning) + ". Current latency: " + String(current_latency.toFixed(2)) + "s Average over last day: " + String(avg_latency.toFixed(2)) + "s." 
          : "";
          const title_response_warn = response_warning ? "\n" + String(response_warning) + ". Current response time: " + String(reponse_time.toFixed(2)) + " s." : "";
  
  
          const tootltip_title = title_bandwidth_warn + title_latency_warn + title_response_warn;
          span_alert = <span className="badge badge-warning" data-toggle='tooltip' data-placement='bottom' title={tootltip_title}>esarchive <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {metrics_text}</span>
        }
      }
      
      
      return (
        <span className="navbar-brand ml-4">
          <small>{span_alert}</small>
        </span>
        
      )
    } else {
      return (<span className="navbar-brand ml-4"><span className="badge badge-secondary">UNKNOWN</span></span>);
    }
    
  }
}

export default FileStatus
