import React, { Component } from "react";
import Spinner from "../layout/Spinner";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
// import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less';  // CSS or LESS
import { createTree } from "jquery.fancytree";
import { DEBUG } from "../context/vars";

export class LighterNativeRep extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data) {
      DEBUG && console.log("Rerendering Lighter Tree");
      return true;
    } else if (nextProps.loadingView !== this.props.loadingView) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    DEBUG && console.log("Unmount Lighter Rep.");
    this.props.cleanLoadingLighterView();
  }

  componentDidMount() {
    DEBUG && console.log("Lighter Rep Mounted.");
  }

  render() {
    if (this.props.loadingView) return <Spinner></Spinner>;
    if (!this.props.data) {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>
            Press <span className='badge badge-info'>View</span> to see the
            light-version of the experiment representation.
          </p>
          <p className='lead'>Use the search tool.</p>
        </div>
      );
    }
    if (this.props.data.error === true) {
      return (
        <div className='card-body text-left' style={experimentStyle}>
          <p className='lead'>Something has gone very wrong.</p>
          <p className='lead text-danger'>{this.props.data.error_message}</p>
        </div>
      );
    }

    class LightFancyTree extends Component {
      componentDidMount() {
        let l_tree = new createTree("#light_tree", {
          extensions: ["filter", "childcounter"],
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

          source: this.props.tree_data,
        });

        //console.log(tree.activeNode);

        DEBUG && console.log(l_tree);
        this.props.setLighterFancyTree(l_tree);
      }

      componentWillUnmount() {
        DEBUG && console.log("Unmounting Lighter Tree");
        //this.props.cleanNavData();
      }

      render() {
        return (
          <div className='card-body p-0'>
            <div id='light_tree'></div>
          </div>
        );
      }
    }

    return (
      <LightFancyTree
        tree_data={this.props.data.tree_view}
        originaldata={this.props.data}
        setLighterFancyTree={this.props.setLighterFancyTree}
      />
    );
  }
}

const experimentStyle = {
  height: 750,
};

export default LighterNativeRep;
