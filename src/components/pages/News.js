import React from 'react';
import { latestNewsLabel } from "../context/vars"

const News = () => {

  localStorage.setItem(latestNewsLabel, true);

  return (
    <div className="container">
      <h3>Updates <small></small></h3>
      <div className="row">
        <div className="col">
          <h4>11-10-2021</h4>
          <div>
            <strong>The Statistics</strong> tab of your experiment has been improved.
            <ul>
              <li>To access these results you only have to press the <strong>Get Statistics</strong> button on the Statitics tab of your experiment. Optionally, you can provide a job type (section) and a number of hours to look into the past (this number determines the time range to query).</li>
              <li>The result includes a table that summarizes the completion of your experiment according to the number of jobs that have reached a revelant status. It also includes two tables that provide a measure of the resources spent by your experiment compared to the <i>expected</i> consumption.</li>
              <li>The module now includes two graphs: The first mesaures Queue time, Run time, Failed Queue time, and Failed Run time for the jobs in your experiments, in <i>hours</i>. The second graph shows the count of failed run attemps per job.</li>
              <li>You can filter the results using a <i>regular expression</i>. The graphs will only show those jobs that coincide with the regular expression. Then, a new column will be added next to the original results, this new columns shows the metrics for the jobs that coincide with the filter.</li>
            </ul>
          </div>
                  
        </div>
      </div>
    </div>    
  )
}

export default News
