import React from 'react'

const Contacts = ({ contacts }) => {
    return (
        <div>
            <center><h1>Graph Representation</h1></center>
            <h2>Edges: </h2>
            {contacts.map((contact) => (
                <div>
                    <p>from : {contact.to}</p>
                    <p>to : {contact.from}</p>
                </div>                
            ))}
        </div>
    )
};

export default Contacts