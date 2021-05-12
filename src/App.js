import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import ExperimentCentral from "./components/pages/ExperimentCentral";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Profile from './components/pages/Profile';
import Footer from "./components/layout/Footer";
import ExperimentState from "./components/context/experiment/ExperimentState";
import GraphState from "./components/context/graph/GraphState";
import TreeState from "./components/context/tree/TreeState";
import AlertState from "./components/context/alert/AlertState";
import StatsState from "./components/context/statistics/StatsState";
import LightState from "./components/context/lighter/LighterState";

import "./App.css";

class App extends Component {
  render() {
    return (
      <ExperimentState>
        <GraphState>
          <TreeState>
            <LightState>
              <AlertState>
                <StatsState>
                  <Router>
                    <div className='App'>
                      <Navbar />
                      <div className='container' style={{ height: "100%" }}>
                        <Alert />
                        <Switch>
                          <Route
                            exact
                            path='/autosubmitapp/'
                            component={Home}
                          />
                          <Route
                            exact
                            path='/autosubmitapp/login/'
                            component={Login}
                            />
                          <Route
                            exact
                            path='/autosubmitapp/profile/'
                            component={Profile}
                            />
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
            </LightState>
          </TreeState>
        </GraphState>
      </ExperimentState>
    );
  }
}

export default App;
