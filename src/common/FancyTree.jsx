import { useEffect, useState } from "react"
import { createTree } from "jquery.fancytree";
import "jquery.fancytree/dist/modules/jquery.fancytree.clones";
import "jquery.fancytree/dist/modules/jquery.fancytree.filter";
import "jquery.fancytree/dist/modules/jquery.fancytree.childcounter";
import "jquery.fancytree/dist/modules/jquery.fancytree.edit";
import "jquery.fancytree/dist/modules/jquery.fancytree.multi";
import "jquery.fancytree/dist/skin-win8/ui.fancytree.min.css"

const FancyTree = ({ treeData }) => {
    const [tree, setTree] = useState(null)

    useEffect(() => {
        if (tree) {
            tree.reload(treeData)
        } else {
            const newtree = createTree("#fancy-tree", {
                source: treeData
            });
            setTree(newtree)
        }
    }, [treeData])

    return (
        <div id='fancy-tree'></div>
    )
}

export default FancyTree