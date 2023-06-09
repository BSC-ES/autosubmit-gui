import React from 'react';
import { latestNewsLabel } from "../context/vars"

const News = () => {

  localStorage.setItem(latestNewsLabel, true);

  return (
    <div className="container">
      <h3>Updates <small></small></h3>
      <div className="row">
        <div className="col">
          <h4>09-06-2023</h4>
          <div>
             <strong>UI/UX improvements</strong>
            <ul>
              <li>Improved compatibility for Autosubmit 4.0 and above experiments</li>
              <li>Improved robustness and maintainability of the API</li>
              <li>For Autosubmit 4.0 configuration tab will be disabled until a full redesign is carried out.</li>
            </ul>
            <strong>Bug fixes</strong>
            <ul>
               <li>Graph and Treeview fixes on issues detected after migration to Python 3.7.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
