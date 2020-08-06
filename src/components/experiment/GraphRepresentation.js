import React, { Component } from "react";
// import vis from "vis-network";
import Spinner from "../layout/Spinner";
import Graph from "react-graph-vis";
import { DEBUG } from "../context/vars";

class GraphRepresentation extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shouldUpdateGraph === true) {
      return true;
    } else if (
      nextProps.data &&
      this.props.data &&
      nextProps.data.pkl_timestamp !== this.props.data.pkl_timestamp
    ) {
      DEBUG && console.log("Rerendering");
      return true;
    } else if (nextProps.loadingGraph !== this.props.loadingGraph) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    this.props.cleanGraphData();
  }

  render() {
    //const experimentContext = useContext(ExperimentContext);
    //{ data, loadingGraph, cleanGraphData, updateSelection } = experimentContext;

    if (this.props.loadingGraph) return <Spinner />;

    if (this.props.data === null) {
      return (
        <div className='card-body text-left'>
          <p className='lead'>
            Press <span className='badge badge-info'>Show Graph</span> to see
            the graph representation of the experiment.
          </p>
          <p className='lead'>
            If the experiment is running, press{" "}
            <span className='badge badge-dark'>Start Job Monitor</span> to start
            a live tracker of the changes on the experiment's jobs. This process
            will automatically update the graph's nodes colors and show a log of
            the detected changes.
          </p>
        </div>
      );
    }

    var nodes_array = [];
    var edges_array = [];

    if (this.props.data.nodes !== null || this.props.data.edges !== null) {
      this.props.data.nodes.map((node) =>
        nodes_array.push({
          id: node.id,
          label: node.label,
          color: { background: node.status_color, border: "black" },
          //level: node.priority,
        })
      );

      this.props.data.edges.map((edge) =>
        edges_array.push({ from: edge.from, to: edge.to })
      );
    }

    const graph = {
      nodes: nodes_array,
      edges: edges_array,
    };

    const options = {
      edges: {
        arrows: {
          to: { enabled: true },
        },
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          nodeSpacing: 250,
          edgeMinimization: false,
          blockShifting: false,
          parentCentralization: false,
          direction: "UD",
          sortMethod: "directed",
        },
      },
      interaction: {
        dragNodes: true,
        hoverConnectedEdges: true,
        // multiselect: true,
        navigationButtons: true,
      },
      physics: {
        enabled: false,
      },
      nodes: {
        shape: "dot",
      },
    };

    const events = {
      select: (event) => {
        //var { nodes, edges } = event;
        var { nodes } = event;
        //setCurrent(nodes);
        // console.log(nodes);
        // console.log(edges);
        this.props.updateSelection(nodes);
        //setCurrent(nodes);
        // console.log("Selected edges:");
        // console.log(edges);
      },
    };

    if (this.props.data.error === false) {
      return (
        <div className='card-body p-0'>
          <Graph
            style={experimentStyle}
            graph={graph}
            options={options}
            events={events}
            getNetwork={(network) => {
              //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
          />
        </div>
      );
    } else {
      return <div className='card-body'>{this.props.data.error_message}</div>;
    }
  }
}

const experimentStyle = {
  height: 600,
};

export default GraphRepresentation;
