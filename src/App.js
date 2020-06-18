import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import ExperimentCentral from "./components/pages/ExperimentCentral";
import Home from "./components/pages/Home";
import Footer from "./components/layout/Footer";
import ExperimentState from "./components/context/experiment/ExperimentState";
import AlertState from "./components/context/alert/AlertState";
import StatsState from "./components/context/statistics/StatsState";

import "./App.css";

class App extends Component {
  render() {
    return (
      <ExperimentState>
        <AlertState>
          <StatsState>
            <Router>
              <div className='App'>
                <Navbar />
                <div className='container'>
                  <Alert />
                  <Switch>
                    <Route exact path='/autosubmitapp/' component={Home} />
                    <Route
                      exact
                      path='/autosubmitapp/about'
                      component={About}
                    />
                    <Route
                      exact
                      path='/autosubmitapp/experiment/:expid'
                      component={ExperimentCentral}
                    />
                    <Route
                      exact
                      path='/autosubmitapp/experiment/:expid/:action'
                      component={ExperimentCentral}
                    />
                    <Route component={NotFound} />
                  </Switch>
                  <Footer />
                </div>
              </div>
            </Router>
          </StatsState>
        </AlertState>
      </ExperimentState>
    );
  }
}

export default App;
