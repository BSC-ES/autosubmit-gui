import { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const VisNetwork = ({ nodes, edges }) => {
    const [network, setNetwork] = useState(null)

    useEffect(() => {
        const nodesDataset = new DataSet(nodes);
        const edgesDataset = new DataSet(edges);
        const data = {
            nodes: nodesDataset,
            edges: edgesDataset
        };
        const options = {};
        const container = document.getElementById('graph-rep');

        if (network) {

        } else {
            const newNetwork = new Network(container, data, options);
            setNetwork(newNetwork)
        }
    })

    return (
        <div id="graph-rep"></div>
    )
}

export default VisNetwork;