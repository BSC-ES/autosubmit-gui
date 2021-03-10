import React from 'react'

const FAQ = () => {
  return (
    <div className='card-body'>
      <h5>Where does the information in the <strong>Tree/Graph/Quick</strong> View come from?</h5>
      <p className='lead'>The information directly related to the jobs' status comes from the <em>pkl</em> file that Autosubmit generates and constantly updates when your experiment is running. This file stores key information from your jobs that allow us to identify them and retrieve their information.</p>
      <p className='lead'> The <em>queuing</em> and <em>running</em> times come from the files that Autosubmit generates to store the submit, start, finish times, and the status of your job. These files usually end with the string <em>*_TOTAL_STATS</em> where <strong>*</strong> is replaced by the job's name. This file can contain the registers for many runs of the same job. Moreover, the latest version of Autosubmit implements a job historical database that improves the previously described functionality and extends its data retrieval capabilities. If this information is available, it will be prioritized over the former source.</p>

      <h5>What does it mean for a job's <strong>STATUS</strong> to be shown as <em>SUSPICIOUS</em>?</h5>
      <p className='lead'>The <em>pkl</em> file of your experiment stores the current status of its jobs. The <em>*_TOTAL_STATS</em> files that Autosubmit generates also store the status of the corresponding job in the experiment. Whenever the values on these sources differ, the GUI assumes that something is not working right and it will show the <em>SUSPICIOUS</em> status text next to the job's name as a warning. Sometimes there is a little bit of delay between Autosubmit updating the <em>pkl</em> file and updating or creating the <em>*_TOTAL_STATS</em> file, in this case the <em>SUSPICIOUS</em> status should be replaced by the right status after some minutes if you <span className="badge badge-success">Refresh</span> (or <em>F5</em>) the Tree/Graph/Quick view of your experiment, or if the <span className="badge badge-success">Job Monitor</span> tool is active. However, if it does not disappear, it could mean that truly something wrong is happening with your experiment.</p>

      <h5>I see a big <span className='text-danger'>Permission Denied</span> message in the top bar. What to do?</h5>
      <p className="lead">This means the Autosubmit GUI could not read the <strong>conf</strong> files of your experiment due to their level of protection. Make sure that your <strong>conf</strong> files have read permission for your user group.</p>

      <h5>Where can I report an issue?</h5>
      <p className="lead">If you find that something is broken or you suspect that it is not working correctly, you can open an issue at <a href="https://earth.bsc.es/gitlab/es/autosubmit/-/issues" rel="noopener noreferrer" target="_blank">Autosubmit Project Issues</a>.</p>

      <h5>The Job Information Panel shows the values SYPD and ASYPD. What are those?</h5>
      <p className="lead">Refer to the definition of the <em>Generalization of SYPD and ASYPD</em> at <a href="https://earth.bsc.es/gitlab/wuruchi/autosubmitreact/-/wikis/Performance-Metrics" target="_blank" rel="noreferrer">Autosubmit API Wiki: Performance Metrics</a>. <em>SYPD</em> is automatically updated when Job Monitor is active. <em>ASYPD</em>, due to the nature of its computation, will require a reload of the Tree or Graph view to be updated.</p>

      <p className="small text-muted">We will continue adding more information. For suggestions, you can open an issue on the Autosubmit project.</p>

    </div>
  )
}

export default FAQ
