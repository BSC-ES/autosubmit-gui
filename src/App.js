import React, { Fragment, Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Experiments from "./components/experiment/Experiments";
import Experiment from "./components/experiment/Experiment";
import Search from "./components/experiment/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import ExperimentCentral from "./components/pages/ExperimentCentral";

import ExperimentState from './components/context/experiment/ExperimentState';

import "./App.css";
import GraphRepresentation from "./components/experiment/GraphRepresentation";

class App extends Component {

  state = {
    alert: null,
  }
  // Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {

    return (
      <ExperimentState>
        <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <Fragment>
                    <Search
                      setAlert={this.setAlert}
                    />
                    <Experiments/>
                  </Fragment>
                )}
              />
              <Route exact path='/about' component={About} />
              <Route
                exact path='/experiment/:expid'
                component={ExperimentCentral}/>
            </Switch>
          </div>
        </div>
      </Router>
      </ExperimentState>
    );
  }
}

export default App;
