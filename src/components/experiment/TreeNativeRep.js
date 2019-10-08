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
            return null;
        }
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
                    // extensions: ['edit', 'filter'],
                    extensions: ["clones","filter", "childcounter"],
                    clones: {
                        highlightClones: true,
                        highlightActiveClones: true,
                      },
                    source: this.props.treedata,
                });

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
                        <div id="tree"></div>
                    </div>
                );
            }
        }

        return (

            <FancyTree 
              treedata={this.props.treedata.tree} 
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

export default TreeNativeRep
