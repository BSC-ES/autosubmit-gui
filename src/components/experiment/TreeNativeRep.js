import React, { Component } from "react";
//import Spinner from "../layout/Spinner";
import Loading from "../layout/Loading";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import { createTree } from "jquery.fancytree";
import { DEBUG } from "../context/vars";

// import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
// import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';

export class TreeNativeRep extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.shouldUpdateGraph === true){
    //     return true
    //   }else
    if (nextProps.treedata !== this.props.treedata) {
      DEBUG && console.log("Rerendering Tree");
      return true;
    } else if (nextProps.loadingTree !== this.props.loadingTree) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    DEBUG && console.log("Unmounting Tree Rep");
    this.props.cleanTreeData();
    // this.props.clearStats();
  }

  componenteDidMount() {
    DEBUG && console.log("In after mount");
    // createTree("#tree", {
    //   extensions: ["edit", "filter"],
    //   source: this.props.treedata,
    // });
  }

  render() {
    //console.log(this.props.treedata)
    if (this.props.loadingTree) return <Loading source={"tree"} />;
    if (!this.props.treedata) {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>
            Press <span className='badge badge-info'>Show</span> to see the tree
            view representation of the experiment.
          </p>
          <p className='lead'>
            Repeating subtrees in the tree view are only shown once, use the
            searcher to focus only on those items.
          </p>
        </div>
      );
    }

    if (this.props.treedata.error === true) {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>Something has gone very wrong.</p>
          <p className='lead text-danger'>
            {this.props.treedata.error_message}
          </p>
        </div>
      );
    }

    class FancyTree extends Component {
      componentDidMount() {
        let tree = new createTree("#tree", {
          activate: (event, data) => {

            if (data) {

              this.props.updateSelectionTree(data);
              //console.log(this.props.canSelect);
              //if (this.props.canSelect === true) {
              if (data && data.node && data.node.folder === undefined) {
                this.props.updateCurrentSelected(
                  data.node.refKey,
                  this.props.originaldata
                );
              }

              //}

              //this.updateSelection(data);
            }
          },
          // extensions: ['edit', 'filter'],
          // extensions: ["clones","filter", "childcounter"],
          extensions: ["filter", "childcounter", "clones", "multi"],
          filter: {
            autoApply: true, // Re-apply last filter if lazy data is loaded
            autoExpand: true, // Expand all branches that contain matches while filtered
            counter: true, // Show a badge with number of matching child nodes near parent icons
            fuzzy: false, // Match single characters in order, e.g. 'fb' will match 'FooBar'
            hideExpandedCounter: true, // Hide counter badge if parent is expanded
            hideExpanders: false, // Hide expanders if all child nodes are hidden by filter
            highlight: false, // Highlight matches by wrapping inside <mark> tags
            leavesOnly: true, // Match end nodes only
            nodata: true, // Display a 'no data' status node if result is empty
            mode: "hide", // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
          },
          // clones: {
          //     highlightClones: true,
          //     highlightActiveClones: true,
          //   },
          source: this.props.treedata,
        });

        //console.log(tree.activeNode);

        DEBUG && console.log(tree);
        this.props.setFancyTree(tree);
        // if (this.props.total !== this.props.exptotal) {
        //   alert(
        //     "The number of jobs in the experiment is different than the number of jobs in your current run. This might be due to a change in the config files of your experiment while Autosubmit was already running."
        //   );
        // }
      }

      componentWillUnmount() {
        DEBUG && console.log("Unmounting Tree");
        //this.props.cleanNavData();
      }

      render() {
        return (
          <div className='card-body p-0'>
            <div id='tree'></div>
          </div>
        );
      }
    }

    return (
      <FancyTree
        treedata={this.props.treedata.tree}
        originaldata={this.props.treedata}
        setFancyTree={this.props.setFancyTree}
        updateSelectionTree={this.props.updateSelectionTree}
        updateCurrentSelected={this.props.updateCurrentSelected}
        canSelect={this.props.canSelect}
        // total={this.props.treedata.total}
        // exptotal={this.props.totalJobs}
      />
    );
  }
}

// const experimentStyle = {
//     maxHeight: 600,
//     height: 600
//   };

const experimentStyle = {
  height: 750,
};

export default TreeNativeRep;
