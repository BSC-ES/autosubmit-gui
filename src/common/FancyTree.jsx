import { useEffect, useState } from "react"
import { createTree } from "jquery.fancytree";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import "jquery.fancytree/dist/modules/jquery.fancytree.glyph";
import "jquery.fancytree/dist/skin-bootstrap/ui.fancytree.min.css"

const FancyTree = ({ treeData, onActivateNode, treeCallback }) => {
    const [tree, setTree] = useState(null)

    useEffect(() => {
        const newSource = Array.isArray(treeData) ? treeData : [];
        if (tree) {
            tree.reload(newSource)
        } else {
            const newtree = createTree("#fancy-tree", {
                activate: onActivateNode,
                extensions: ["filter", "glyph", "childcounter"],
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
                        // Override distinct default icons here
                        folder: "fas fa-folder",
                        folderOpen: "fas fa-folder-open",
                        doc: "far fa-circle text-primary",
                        docOpen: "fas fa-circle text-primary",
                    }
                },
                source: newSource
            });
            setTree(newtree)
            if(treeCallback) treeCallback(newtree)
        }
    }, [treeData])

    return (
        <div id='fancy-tree'></div>
    )
}

export default FancyTree