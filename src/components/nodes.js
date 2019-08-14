import React from 'react'

const Nodes = ({ nodes }) => {
    return (
        <div>
            <h2>Nodes: </h2>
            {nodes.map((node) => (
                <div>
                    <p>id : {node.id}</p>
                    <p>name : {node.name}</p>
                    <p>member : {node.member}</p>
                    <p>status : {node.status}</p>
                    <p>status_code : {node.status_code}</p>
                </div>                
            ))}
        </div>
    )
};

export default Nodes