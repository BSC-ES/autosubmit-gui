import React from 'react';
import { latestNewsLabel } from "../context/vars"

const News = () => {

  localStorage.setItem(latestNewsLabel, true);

  return (
    <div className="container">
      <h3>Updates <small></small></h3>
      <div className="row">
        <div className="col">
          <h4>30-11-2022</h4>
          <div>
            <strong>Performance improvements</strong>
            <ul>
              <li>Performance improvement in the experiment dashboard, we increased the retrieval speed for the experiments when user clicks on 'Detailed Data' button. Now only experiments on the current page will be refreshed.</li>
              <li>General performance improvement by the addition of a new endpoint for stopping current background API jobs (on the API side). Alongside this, we have a clean-up hook to use in all the required situations, The new endpoint allows discarding expensive, non-relevant petitions and dispatching new user demands on time. Thus, proving a better user experience. Graph, Tree and QuickView start loading automatically, and the transition between them is improved due to the mentioned task canceling mechanism.</li>
            </ul>
             <strong>UI/UX improvements</strong>
            <ul>
              <li>Treeview UI/UX improved by adding new folders for the wrappers, and inside these, we added a sorting to display the proper execution sequence, collapse all/Expand all buttons were added</li>
              <li>New tab icon was added to replace generic React.js icon that was previously being displayed</li>
              <li>An early initial load of the Active experiments at the homepage has been implemented without requiring the user to click on the button each time.</li>
              <li>UI/UX of the graph view improved: Tasks without dependencies are displayed correctly in the Graph View in a single row now.</li>
            </ul>
            <strong>Bug fixes</strong>
            <ul>
               <li>Fixed bug when Added redirection support after logging in.</li>
               <li>Fixed a bug in the tree generation that was making the load more tedious.</li>
               <li>Fixed a visual bug regarding the close button in the pop-up windows.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
