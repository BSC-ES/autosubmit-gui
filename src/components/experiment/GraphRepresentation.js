import React, { Fragment, Component } from "react";
// import vis from "vis-network";
import Spinner from "../layout/Spinner";
import Graph from 'react-graph-vis';

class GraphRepresentation extends Component {

 
  // { data, loadingGraph, cleanGraphData, updateSelection } = experimentContext;
  // console.log("Entering GraphRep")

  // useEffect(() => {
  //   return () => {
  //     cleanGraphData();
  //   };
  //   // eslint-disable-next-line
  // }, []);

  shouldComponentUpdate(nextProps, nextState){
    if (nextProps.loadingGraph !== this.props.loadingGraph){
      return true;
    }else if (nextProps.data !== this.props.data){
      return true;
    }else{
      return false;
    }
  }

  componentWillUnmount() {
    this.props.cleanGraphData();
  }

  render(){
    //const experimentContext = useContext(ExperimentContext);
    //{ data, loadingGraph, cleanGraphData, updateSelection } = experimentContext;

    if (this.props.loadingGraph) return <Spinner />;

    if (this.props.data === null){
      return(
        <Fragment>
          <div>Press the button to show the Graph.</div>
        </Fragment>
      );       
    }

    var nodes_array = [];
    var edges_array = [];

    if (
      this.props.data.nodes !== null ||
      this.props.data.edges !== null
    ) {
      this.props.data.nodes.map(node =>
        nodes_array.push({
          id: node.id,
          label: node.label,
          color: { background: node.status_color, border: "black" }
        })
      );

      this.props.data.edges.map(edge => 
        edges_array.push({ from: edge.from, to: edge.to })
      );
    }

    const graph = {
      nodes : nodes_array,
      edges : edges_array
    };


    const options = {
      edges: {
        arrows: {
          to: { enabled: true }
        }
      },
      layout: {
        improvedLayout: true,
        hierarchical: {

          nodeSpacing: 250,
          edgeMinimization: false,
          blockShifting: false,
          parentCentralization: false,
          direction: 'UD',
          sortMethod: 'directed',
        }
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
        shape: 'dot',
      }
    };
    
    

    const events = {
      select: (event) => {
        var { nodes, edges } = event;
        //setCurrent(nodes);
        console.log(nodes);
        console.log(edges);
        this.props.updateSelection(nodes);
        //setCurrent(nodes);
        // console.log("Selected edges:");
        // console.log(edges);
      }
    };
    

    if (this.props.data.error === false) {
      return (
        <Fragment>
          <Graph
            style={experimentStyle}
            graph={graph}
            options={options}
            events={events}
            getNetwork={network => {
              //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
          />                  
        </Fragment> 
      );
    }
    else {
      return (
        <Fragment>
          <div>
            {this.props.data.error_message}
          </div>
        </Fragment>
      )
    }    
  }
   
}

const experimentStyle = {
    height: 800
  };

export default GraphRepresentation;
