import React, { Component } from "react";
// import vis from "vis-network";
import Spinner from "../layout/Spinner";
import vis from "vis-network";
import { DEBUG } from "../context/vars";
class GraphNativeRep extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shouldUpdateGraph === true) {
      //console.log("should Rerender")
      return true;
    } else if (
      nextProps.data &&
      this.props.data &&
      nextProps.data.pkl_timestamp !== this.props.data.pkl_timestamp
    ) {
      //console.log("Rerendering")
      return true;
    } else if (nextProps.loadingGraph !== this.props.loadingGraph) {
      //console.log("Render because changed loading")
      return true;
    } else {
      //console.log("NO RERENDER")
      return false;
    }
  }

  componentWillUnmount() {
    DEBUG && console.log("Unmounting Nav Rep");
    this.props.cleanGraphData();
    this.props.clearStats();
  }

  render() {
    if (this.props.loadingGraph) return <Spinner></Spinner>;
    if (!this.props.data) {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>
            Press <span className='badge badge-info'>Classic</span> to see the
            standard graph representation of the experiment.
          </p>
          <p>
            For the classic approach, the algorithm will first try to use
            graphviz, there are some constraints in place that try to identify
            those instances that could potentially make graphviz run forever. If
            an experiment is identified to be time-wise out of bounds for
            graphviz, it will be sent to the regular algorithm. Currently, the
            regular algorithm does not handle well wrappers; work is being done
            to developed a general algorithm.
          </p>
          <p className='lead'>
            Press <span className='badge badge-info'>Date-Member</span> to see the graph representation grouped by date-member.
          </p>

          <p className='lead'>
            Press <span className='badge badge-info'>Status</span> to see the graph representation grouped by status. <span className="badge badge-danger">FAILED</span> jobs are not grouped.
          </p>

          <p className="lead">
            The <span className="badge badge-info"><i className="fas fa-chess-board"></i></span> button produces a graph representation based on 2nd and 3rd eigenvectors of the Laplacian Matrix of the Graph representation of your experiment. Could be interesting in some instances.
          </p>

          {/* <p>
            If the experiment instance cannot be handled by graphviz, then it
            would not be possible to group it. Again, work is being done to
            overcome this.
          </p> */}
          <p className='lead'>
            If the experiment is{" "}
            <span className='badge badge-success'>RUNNING</span> and the Graph
            has been rendered, press{" "}
            <span className='badge badge-success'>Start Job Monitor</span> to start
            a live tracker of the changes on the experiment's jobs. This process
            will automatically update the graph's nodes colors and show a log of
            the detected changes.
          </p>
          <p className='lead'>
            If there are any defined wrappers, they will be shown on the
            corresponding tab at the right side of the Graph. You can click on
            any member of that list and the nodes belonging to that wrapper will
            be highlighted.
          </p>
        </div>
      );
    }

    var nodes_array = [];
    var edges_array = [];
    const graphviz = this.props.data.graphviz;
    const groups = this.props.data.groups;
    const groups_data = this.props.data.groups_data;
    const current_grouped = this.props.current_grouped;

    if (this.props.data.nodes.length > 0 && this.props.data.edges !== null) {
      if (graphviz === true) {
        this.props.data.nodes.map((node) =>
          nodes_array.push({
            id: node.id,
            label: node.label,
            shape: node.shape,
            color: { background: node.status_color, border: "black" },
            status: node.status,
            // level: node.level, // receiving x and y from API
            // fixed: { x: true, y: true},
            x: node.x,
            y: node.y,
            shapeProperties: { borderDashes: node.dashed },
          })
        );
      } else {
        this.props.data.nodes.map((node) =>
          nodes_array.push({
            id: node.id,
            label: node.label,
            shape: node.shape,
            color: { background: node.status_color, border: "black" },
            status: node.status,
            //level: node.level,
            //y: node.level*80,
            shapeProperties: { borderDashes: node.dashed },
            // fixed: { x: true, y: true},
            x: node.x,
            y: node.y,
            // x: node.x * -90,
            // y: node.y * -100,
          })
        );
      }

      if (this.props.data.edges) {
        this.props.data.edges.map((edge) =>
          edges_array.push({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            dashes: edge.dashed,
            background: {
              enabled: edge.is_wrapper,
              color: "rgba(63, 191, 63, 0.5)",
            },
            arrows: { to: { enabled: !edge.dashed } },
          })
        );
      }

      if (this.props.data.fake_edges) {
        this.props.data.fake_edges.map((edge) =>
          edges_array.push({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            dashes: edge.dashed,
            background: {
              enabled: edge.is_wrapper,
              color: "rgba(63, 191, 63, 0.5)",
            },
            arrows: { to: { enabled: !edge.dashed } },
          })
        );
      }
    } else {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>Something has gone very wrong.</p>
          <p className='lead text-danger'>{this.props.data.error_message}</p>
        </div>
      );
    }

    var nodes = new vis.DataSet(nodes_array);
    var edges = new vis.DataSet(edges_array);

    var shouldEdge = false;
    if (this.props.data.total_jobs <= 500) {
      shouldEdge = true;
    }
    const options = {
      autoResize: true,
      edges: {
        arrows: {
          to: { enabled: true },
        },
      },
      layout: {
        improvedLayout: false,
        hierarchical: {
          nodeSpacing: 190,
          blockShifting: false,
          edgeMinimization: shouldEdge,
          parentCentralization: true,
          sortMethod: "hubsize",
          direction: "UD",
          enabled: false,
        },
      },
      interaction: {
        dragNodes: true,
        hoverConnectedEdges: true,
        hideEdgesOnDrag: true,
        //hideEdgesOnZoom: true,
        multiselect: true,
        navigationButtons: true,
      },
      physics: {
        enabled: false,
        stabilization: {
          // Determines an initial layout; enabled by default
          enabled: true,
          iterations: 1000,
        },
      },
      nodes: {
        shape: "dot",
        font: {
          size: 17.5,
        },
      },
    };

    const graph = {
      nodes: nodes,
      edges: edges,
    };

    class VisNetwork extends Component {

      shouldComponentUpdate(nextProps, nextState) {
        if (this.props.shouldUpdateGraph === true) {
          DEBUG && console.log("Should rerender form inside");
          return true;
        } else {
          //console.log("No RERENDER")
          DEBUG && console.log("No rerender");
          return false;
        }
      }

      componentDidMount() {
        let network = new vis.Network(
          this.refs.myRef,
          this.props.graph,
          this.props.options
        );
        const groups_data = this.props.groups_data;
        const current_grouped = this.props.current_grouped;

        this.props.setVisNetwork(network);
        network.on("select", (params) => {
          if (params.nodes) {
            if (params.nodes.length === 1) {
              if (network.isCluster(params.nodes[0])) {
              } else {
                //console.log(params.nodes);
                this.props.updateSelection(params.nodes);
                // this.props.updateGraphSelectedNodes(params.nodes);
                this.props.updateCurrentSelected(
                  params.nodes[0],
                  this.props.data
                );
              }
            }
            // } else {
            //   this.props.updateSelection(params.nodes);
            // }
          }
        });

        // network.on("stabilized", () => {
        //   this.props.navigateAfterLoadGraph(this.props.experimentRunning);
        // });

        network.on("doubleClick", (params) => {
          if (params.nodes) {
            if (params.nodes.length === 1) {
              if (network.isCluster(params.nodes[0])) {
                var OpenClusterObj = {};
                OpenClusterObj.releaseFunction = function (
                  clusterPosition,
                  containedNodesPositions
                ) {
                  return containedNodesPositions;
                };
                network.openCluster(params.nodes[0], OpenClusterObj);
              }
            }
          }
        });

        //network.enableEditMode();
        //console.log(this.props.isGraphViz);
        if (this.props.clusterGroups) {
          const groups = this.props.clusterGroups;
          if (current_grouped === "date-member") {
            let clusterOptionsByDateMember;
            for (let i = 0; i < groups.length; i++) {
              let startingName = groups[i];
              // if (positions[startingName]){
              //   console.log(positions[startingName]);
              // }
              clusterOptionsByDateMember = {
                // eslint-disable-next-line no-loop-func
                joinCondition: function (options) {
                  return options.id.startsWith(startingName);
                },
                processProperties: function (
                  clusterOptions,
                  childNodes,
                  childEdges
                ) {
                  let totalMass = 0;
                  for (let i = 0; i < childNodes.length; i++) {
                    totalMass += childNodes[i].mass;
                  }
                  clusterOptions.mass = totalMass;
                  return clusterOptions;
                },
                clusterNodeProperties: {
                  id: "cluster:" + startingName,
                  borderWidth: 3,
                  shape: "box",
                  label: startingName.split("_").join("\n"),
                  color: groups_data[startingName].color,
                  font: { size: 50 },
                  x: groups_data[startingName].x,
                  y: groups_data[startingName].y,
                },
              };
              network.clustering.cluster(clusterOptionsByDateMember);
            }
          } else if (current_grouped === "date-member-chunk") { 
            let clusterOptionsByDateMemberChunk;
            for (let k = 0; k < groups.length; k++) {
              let startingName = groups[k];
              clusterOptionsByDateMemberChunk = {
                // eslint-disable-next-line no-loop-func
                joinCondition: function (options) {
                  return options.id.startsWith(startingName);
                },
                processProperties: function (
                  clusterOptions,
                  childNodes,
                  childEdges
                ) {
                  let totalMass = 0;
                  for (let i = 0; i < childNodes.length; i++) {
                    totalMass += childNodes[i].mass;
                  }
                  clusterOptions.mass = totalMass;
                  return clusterOptions;
                },
                clusterNodeProperties: {
                  id: "cluster:" + startingName,
                  borderWidth: 3,
                  shape: "box",
                  label: startingName.split("_").join("\n"),
                  color: groups_data[startingName].color,
                  font: { size: 50 },
                  x: groups_data[startingName].x,
                  y: groups_data[startingName].y,
                },
              };
              network.clustering.cluster(clusterOptionsByDateMemberChunk);
            }
          } else if (current_grouped === "status") {
            var clusterOptionsByStatus;
            for (var j = 0; j < groups.length; j++) {
              var statusName = groups[j];
              // console.log(statusName);
              clusterOptionsByStatus = {
                // eslint-disable-next-line no-loop-func
                joinCondition: function (options) {
                  // console.log(options);
                  return (
                    options.status === statusName && options.shape === "dot"
                  );
                },
                processProperties: function (
                  clusterOptions,
                  childNodes,
                  childEdges
                ) {
                  var totalMass = 0;
                  for (var i = 0; i < childNodes.length; i++) {
                    totalMass += childNodes[i].mass;
                  }
                  clusterOptions.mass = totalMass;
                  return clusterOptions;
                },
                clusterNodeProperties: {
                  id: statusName,
                  borderWidth: 3,
                  shape: "box",
                  label: statusName,
                  color: groups_data[statusName].color,
                  font: { size: 50 },
                },
              };
              network.clustering.cluster(clusterOptionsByStatus);
            }
          }
        }

        this.props.navigateAfterLoadGraph(this.props.experimentRunning);
      }

      componentWillUnmount() {
        DEBUG && console.log("Unmounting VisNetwork");
        this.props.cleanNavData();
      }

      render() {
        return (
          <div className='card-body p-0'>
            <div id="graphrep" ref='myRef' style={experimentStyle}></div>
          </div>
        );
      }
    }

    return (
      <VisNetwork
        data={this.props.data}
        graph={graph}
        options={options}
        updateSelection={this.props.updateSelection}
        shouldUpdateGraph={this.props.shouldUpdateGraph}
        setVisNetwork={this.props.setVisNetwork}
        cleanNavData={this.props.cleanNavData}
        isGraphViz={graphviz}
        clusterGroups={groups}
        groups_data={groups_data}
        current_grouped={current_grouped}
        experimentRunning={this.props.experimentRunning}
        navigateAfterLoadGraph={this.props.navigateAfterLoadGraph}
        updateCurrentSelected={this.props.updateCurrentSelected}
        updateGraphSelectedNodes={this.props.updateGraphSelectedNodes}
      />
    );
  }
}

const experimentStyle = {
  height: 755,
};

export default GraphNativeRep;
