import React from 'react';
import { latestNewsLabel } from "../context/vars"

const News = () => {

  localStorage.setItem(latestNewsLabel, true);

  return (
    <div className="my-3 mx-2">
        <h2>Updates</h2>
        <h4>XX-10-2022</h4>
        <p>
          This new release has been dedicated to improve some capabilities towards a more performant and better experience for our users. One of the main goals achieved is to make the website more reactive and dynamic.
          <ul>
              <li>The Detailed Data for all experiments in a given page is retrieved faster because we target only the current page and not the whole set of experiments.</li>
              <li>A new endpoint for stopping the current job in process has been implemented at the API. Alongside this, we have a clean-up hook so that we cover all the cases in which we do not require the process anymore. This allows us to cancel any expensive job being done at the backend and start attending new user petitions as soon as possible. thus making it a better experience.</li>
              <li>Graph, Tree and QuickView start loading automatically and the transition between them is improved because we cancel any non-active loading taking place in the background.</li>
              <li>An early initial load of the Active experiments at the homepage has been implemented, making the user not have to click on the button each time.</li>
              <li>The graph with independent jobs without any dependency now displays correctly in a single row.</li>
              <li>Added redirection support after log in.</li>
              <li>Fixed a bug in the tree generation that was making the load more tedious.</li>
              <li>Fixed a visual bug regarding the close button in the pop-ups windows.</li>
            </ul>
        </p>
        <h4>11-10-2021</h4>
        <p>
          The Statistics tab of your experiment has been improved.
          <br></br>
          <ul>
              <li>To access these results you only have to press the Get Statistics button on the Statitics tab of your experiment. Optionally, you can provide a job type (section) and a number of hours to look into the past (this number determines the time range to query).</li>
              <li>The result includes a table that summarizes the completion of your experiment according to the number of jobs that have reached a revelant status. It also includes two tables that provide a measure of the resources spent by your experiment compared to the <i>expected</i> consumption.</li>
              <li>The module now includes two graphs: The first mesaures Queue time, Run time, Failed Queue time, and Failed Run time for the jobs in your experiments, in <i>hours</i>. The second graph shows the count of failed run attemps per job.</li>
              <li>You can filter the results using a <i>regular expression</i>. The graphs will only show those jobs that coincide with the regular expression. Then, a new column will be added next to the original results, this new columns shows the metrics for the jobs that coincide with the filter.</li>
            </ul>
        </p>
      </div>
  )
}

export default News
