import { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const VisNetwork = ({ nodes, edges, onSelectNode, networkCallback }) => {
    const [network, setNetwork] = useState(null)

    useEffect(() => {
        const nodesDataset = new DataSet(nodes);
        const edgesDataset = new DataSet(edges);
        const data = {
            nodes: nodesDataset,
            edges: edgesDataset
        };
        const options = {
            autoResize: true,
            edges: {
                arrows: {
                    to: { enabled: true },
                },
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    nodeSpacing: 190,
                    blockShifting: false,
                    edgeMinimization: (nodes.length <= 500),
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

        if (network) {
            network.setData(data)
            network.setOptions(options)
        } else {
            const container = document.getElementById('graph-rep');
            const newNetwork = new Network(container, data, options);
            
            newNetwork.on("select", params => {
                if (params.nodes && params.nodes.length === 1) {
                    if (!newNetwork.isCluster(params.nodes[0])) {
                        if (onSelectNode) {
                            onSelectNode(params.nodes[0])
                        }
                    }
                }
            })
            
            setNetwork(newNetwork)
            if(networkCallback) networkCallback(newNetwork)
        }
        // eslint-disable-next-line
    }, [nodes, edges])

    return (
        <div id="graph-rep" style={{ height: "75vh", width: "100%" }}></div>
    )
}

export default VisNetwork;