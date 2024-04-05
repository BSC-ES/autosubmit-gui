import { useEffect, useRef, MutableRefObject } from "react";
import { createTree } from "jquery.fancytree";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import "jquery.fancytree/dist/modules/jquery.fancytree.glyph";
import "jquery.fancytree/dist/skin-bootstrap/ui.fancytree.min.css";

const FANCY_TREE_OPTIONS = {
  extensions: ["filter", "glyph", "childcounter", "clones", "multi"],
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
  glyph: {
    // The preset defines defaults for all supported icon types.
    preset: "awesome5",
    map: {
      _addClass: "text-black",
      // Override distinct default icons here
      folder: "fas fa-folder",
      folderOpen: "fas fa-folder-open",
      doc: "far fa-circle text-primary",
      docOpen: "fas fa-circle text-primary",
    },
  },
  childcounter: {
    hideExpanded: true,
  },
};

/**
 *
 * @param {object} props
 * @param {Array<object>} props.source
 * @param {function} props.tree
 * @param {function} props.onSelectNodes
 */
const FancyTree = ({ source, tree: forwardTree, onSelectNodes, className }) => {
  /** @type {MutableRefObject<Fancytree.Fancytree>} */
  const tree = useRef();

  useEffect(() => {
    let newSource = [];
    if (source) newSource = source;
    tree.current = createTree("#fancy-tree", {
      ...FANCY_TREE_OPTIONS,
      source: newSource,
      select: handleSelect,
    });
    if(forwardTree) forwardTree(tree.current);
  }, []);

  useEffect(() => {
    if (tree.current) {
      tree.current.reload(source);
    }
  }, [source]);

  var selectEventTimeout;
  const handleSelect = (e, d) => {
    clearTimeout(selectEventTimeout);
    selectEventTimeout = setTimeout(function () {
      if (onSelectNodes) onSelectNodes(tree.current.getSelectedNodes());
    }, 100);
  };

  return <div id="fancy-tree" className={className} />;
};

export default FancyTree;
