import React, { Component } from "react";
// import vis from "vis-network";
import Spinner from "../layout/Spinner";
import vis from "vis-network";

class GraphNativeRep extends Component {

    shouldComponentUpdate(nextProps, nextState){ 
        if (this.props.shouldUpdateGraph === true){
            return true
          }else if (nextProps.data && this.props.data && (nextProps.data.pkl_timestamp !== this.props.data.pkl_timestamp)){
            console.log("Rerendering")
            return true;
          }else if (nextProps.loadingGraph !== this.props.loadingGraph){
            return true;    
          }else{
            return false;
          }
    }
    componentWillUnmount() {
        console.log("Unmounting Nav Rep");
        this.props.cleanGraphData();
        this.props.clearStats();
    }

    updateVisNodes = (nodes) => {
        this.props.setVisData(nodes);
    };

    // onSubmit = (x,y) => e => {
    //   e.preventDefault();
    //   this.props.navigateGraph(x,y);
    // };

    // onLatest = (statusCode) => e => {
    //   e.preventDefault();
    //   this.props.navToLatest(statusCode); // Completed
    // };

    render () {
        if (this.props.loadingGraph) return <Spinner></Spinner>;
        if (!this.props.data){
            return (
                <div className="card-body text-left">
                    <p className='lead'>Press <span className='badge badge-info'>Show Graph</span> to see the graph representation of the experiment.</p>
                    <p className='lead'>If the experiment is <span className='badge badge-success'>RUNNING</span> and the Graph has been rendered, press <span className='badge badge-dark'>Start Job Monitor</span> to start a live tracker of the changes on the experiment's jobs.
                        This process will automatically update the graph's nodes colors and show a log of the detected changes.
                    </p>
                </div> 
            );
        }

        var nodes_array = [];
        var edges_array = [];
    
        if (this.props.data.nodes.length > 0 && this.props.data.edges !== null) {
            this.props.data.nodes.map(node => nodes_array.push({
                id: node.id,
                label: node.label,
                shape: node.shape,
                color: { background: node.status_color, border: "black" },
                level: node.level,
              })
            );
      
            this.props.data.edges.map(edge => 
              edges_array.push({ from: edge.from, to: edge.to })
            );
        } else {
          return (
            <div className="card-body text-left">
                <p className='lead'>Something has gone very wrong.</p>
                <p className='lead text-danger'>{this.props.data.error_message}</p>
            </div> 
          );
        }
    
        var nodes = new vis.DataSet(nodes_array);
        var edges = new vis.DataSet(edges_array);

        var shouldEdge = false;
        if (this.props.data.total_jobs <= 500){
            shouldEdge = true;
        }
        const options = {
            edges: {
              arrows: {
                to: { enabled: true }
              }
            },
            layout: {
              improvedLayout: false,
              hierarchical: {
                nodeSpacing: 190,                
                blockShifting: false,
                edgeMinimization: shouldEdge,
                parentCentralization: true,
                sortMethod: 'hubsize',
                direction: 'UD',
                // work on vis current version
                // nodeSpacing: 190,
                // blockShifting: false,
                // edgeMinimization: false,
                // parentCentralization: true,
                // sortMethod: 'hubsize',
                // direction: 'UD',
              }
            },            
            interaction: {
              dragNodes: true,
              hoverConnectedEdges: true,
              hideEdgesOnDrag: true,
              //hideEdgesOnZoom: true,
              // multiselect: true,
              navigationButtons: true,
            },
            physics: {
              enabled: false,
            },
            nodes: {
              shape: 'dot',
              font: {
                size: 10,
              },
            }
        };
    
        const graph = {
            nodes : nodes,
            edges : edges,
        };

        class VisNetwork extends Component {
        
            shouldComponentUpdate(nextProps, nextState){ 
               if (this.props.shouldUpdateGraph === true){
                    return true;
                } else {
                    return false;
                }
            }
    
            componentDidMount() {
                var network = new vis.Network(this.refs.myRef, this.props.graph, this.props.options);
                this.props.setVisNetwork(network);
                network.on("select", (params) => {
                    console.log(params);
                    if (params.nodes){
                        //console.log(params.nodes);
                        this.props.updateSelection(params.nodes);
                    }
                    
                });
            }
    
            componentWillUnmount() {
                console.log("Unmounting VisNetwork");
                this.props.cleanNavData();
            }

          
    
            render() {            
                return (
                    <div className='card-body p-0'>                    
                        <div ref="myRef" style={experimentStyle}></div>
                    </div>
                );
            }
        }

        this.updateVisNodes(nodes);
    
        return (

          <VisNetwork 
            graph={graph} 
            options={options} 
            updateSelection={this.props.updateSelection}
            shouldUpdateGraph={this.props.shouldUpdateGraph}
            setVisNetwork={this.props.setVisNetwork}
            cleanNavData={this.props.cleanNavData}
          />
        );

    }


}


const experimentStyle = {
    height: 600
  };


export default GraphNativeRep;
