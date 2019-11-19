import React, { Component } from 'react';
import Spinner from "../layout/Spinner";
import 'jquery.fancytree/dist/modules/jquery.fancytree.clones'
import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';
import 'jquery.fancytree/dist/modules/jquery.fancytree.childcounter';
// import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less';  // CSS or LESS
import { createTree } from 'jquery.fancytree';

// import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
// import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';

export class TreeNativeRep extends Component {

    shouldComponentUpdate(nextProps, nextState){ 
        // if (this.props.shouldUpdateGraph === true){
        //     return true
        //   }else 
        if (nextProps.treedata !== this.props.treedata){
            console.log("Rerendering Tree")
            return true;
        }else if (nextProps.loadingTree !== this.props.loadingTree){
            return true;    
        }else{
            return false;
        }
    }

    componentWillUnmount() {
        console.log("Unmounting Tree Rep");
        this.props.cleanTreeData();
        // this.props.clearStats();
    }

    componenteDidMount(){
        console.log("In after mount")
        createTree('#tree', {
            extensions: ['edit', 'filter'],
            source: this.props.treedata,
        });
    }


    render() {
        //console.log(this.props.treedata)
        if (this.props.loadingTree) return <Spinner></Spinner>;
        if (!this.props.treedata) {
            return (
                <div className="card-body text-left" style={experimentStyle}>
                    <p className='lead'>Press <span className='badge badge-info'>Show Tree View</span> to see the tree view representation of the experiment.</p>
                    <p className='lead'>Repeating subtrees in the tree view are only shown once, use the searcher to focus only on those items.
                    </p>
                </div> 
            );
        }

        if (this.props.treedata.error === true) {
            return (
                <div className="card-body text-left" style={experimentStyle}>
                    <p className='lead'>Something has gone very wrong.</p>
                    <p className='lead text-danger'>{this.props.treedata.error_message}</p>
                </div> 
              );
        };
        
        // if (!this.props.treedata){
        //     return (
        //         <div className="card-body text-left">
        //             <p className='lead'>Press <span className='badge badge-info'>Show Tree</span> to see the tree representation of the experiment.</p>
        //             <p className='lead'>If the experiment is <span className='badge badge-success'>RUNNING</span> and the Tree has been rendered, press <span className='badge badge-dark'>Start Job Monitor</span> to start a live tracker of the changes on the experiment's jobs.
        //                 This process will automatically update the tree's nodes colors and show a log of the detected changes.
        //             </p>
        //         </div> 
        //     );
        // }

        class FancyTree extends Component {
        
            // shouldComponentUpdate(nextProps, nextState){ 
            //    if (this.props.shouldUpdateGraph === true){
            //         return true;
            //     } else {
            //         return false;
            //     }
            // }                  
            
            componentDidMount() {

                var tree = new createTree('#tree', {
                    activate: (event, data) => {
                        //console.log(event)
                        if (data){
                            //console.log(data);
                            //console.log(this);
                            this.props.updateSelectionTree(data);
                            //this.updateSelection(data);
                        }                        
                    },
                    // extensions: ['edit', 'filter'],
                    // extensions: ["clones","filter", "childcounter"],
                    extensions: ["filter", "childcounter"],
                    filter: {
                        autoApply: true,   // Re-apply last filter if lazy data is loaded
                        autoExpand: true, // Expand all branches that contain matches while filtered
                        counter: true,     // Show a badge with number of matching child nodes near parent icons
                        fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                        hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                        hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                        highlight: true,   // Highlight matches by wrapping inside <mark> tags
                        leavesOnly: false, // Match end nodes only
                        nodata: true,      // Display a 'no data' status node if result is empty
                        mode: "hide"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                      },
                    // clones: {
                    //     highlightClones: true,
                    //     highlightActiveClones: true,
                    //   },
                    source: this.props.treedata,
                });

                //console.log(tree.activeNode);             

                console.log(tree);
                this.props.setFancyTree(tree);

                //tree.filterBranches("FORMAT");

                // tree.addClass("fancytree-connectors");
                // this.props.setVisNetwork(network);
                // network.on("select", (params) => {
                //     console.log(params);
                //     if (params.nodes){
                //         //console.log(params.nodes);
                //         this.props.updateSelection(params.nodes);
                //     }
                    
                // });
            }
    
            componentWillUnmount() {
                console.log("Unmounting Tree");
                //this.props.cleanNavData();
            }

          
    
            render() {            
                return (
                    <div className='card-body p-0'> 
                        <div id="tree">

                        </div>
                    </div>
                );
            }
        }

        return (

            <FancyTree 
              treedata={this.props.treedata.tree} 
              setFancyTree={this.props.setFancyTree}
              updateSelectionTree={this.props.updateSelectionTree}
            />
          );

        // if(this.props.treedata){
        //     return (
        //         <div className="card-body p-0">
        //             <div className="" id="tree" style={experimentStyle}></div>
        //         </div>
        //     );
        // }
    }
}

// const experimentStyle = {
//     maxHeight: 600,
//     height: 600
//   };

const experimentStyle = {
    height: 600
};



export default TreeNativeRep
