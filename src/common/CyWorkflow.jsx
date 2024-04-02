import CytoscapeComponent from "react-cytoscapejs"
import Cytoscape from 'cytoscape';
import { useEffect, useRef, MutableRefObject } from "react";
import { triggerDownload } from "../services/utils";

const GRAPH_STYLE = [
  {
    selector: 'node',
    style: {
      'label': 'data(id)',
      'text-valign': "bottom",
      "text-margin-y": 8,
      "border-width": 3,
      "border-color": "black",
      "color": "black",
      "min-zoomed-font-size": 8,
      "background-color": "white"
    }
  },
  {
    selector: 'node:selected',
    style: {
      "border-color": "#4E8490",
      "color": "white",
      'font-weight': 'bold',
      "text-background-opacity": 1,
      "text-background-color": "#4E8490",
      "text-background-shape": "round-rectangle",
      "text-background-padding": 4
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 1,
      'target-arrow-shape': 'triangle',
      'curve-style': "bezier"
    }
  },
  {
    selector: ":parent",
    style: {
      'label': 'data(id)',
      'text-valign': "top",
      'border-style': "dashed",
      "text-margin-y": 0,
      "font-weight": "bold"
    }
  },
  {
    selector: "node:selected > $node",
    style: {
      "border-color": "#4E8490"
    }
  },
  {
    selector: "node:active > $node",
    style: {
      "border-color": "#4E8490"
    }
  },
  {
    selector: "node[status='WAITING']",
    style: {
      backgroundColor: "#aaaaaa"
    }
  },
  {
    selector: "node[status='READY']",
    style: {
      backgroundColor: "lightblue"
    }
  },
  {
    selector: "node[status='SUBMITTED']",
    style: {
      backgroundColor: "cyan"
    }
  },
  {
    selector: "node[status='COMPLETED']",
    style: {
      backgroundColor: "yellow"
    }
  }
]

const CyWorkflow = ({ elements, onSelectNodes, cy: forwardCy }) => {

  /** @type {MutableRefObject<Cytoscape.Core>} */
  const cy = useRef();

  const handleSelect = () => {
    const selectedNodes = cy.current.filter("node:selected");
    onSelectNodes(selectedNodes.jsons())
  }

  useEffect(() => {
    // Mount component

    // First add
    cy.current.one('add', () => { 
      cy.current.fit()
    })

    // Every time a node is selected
    cy.current.on('select', (e) => {
      handleSelect()
    })

    cy.current.on('unselect', (e) => {
      handleSelect()
    })

    //Unmount component
    return () => {

    }
    // eslint-disable-next-line
  }, [])

  const handleFit = () => { cy.current.fit() }

  const handleDownload = async () => {
    const uri = await cy.current.png({output: "base64uri"});
    triggerDownload(uri, `graph_view.png`)
  }

  return (
    <div className="w-full h-full relative bg-white">
      <div className="absolute top-0 left-0 z-10 bg-neutral-200 text-black opacity-50 flex gap-3 px-2">
        <button onClick={handleFit}><i className="fa-solid fa-maximize"></i></button>
        <button onClick={handleDownload}><i className="fa-solid fa-floppy-disk"></i></button>
      </div>
      <CytoscapeComponent
        cy={(_cy) => { cy.current = _cy; forwardCy(_cy); }}
        className="w-full h-full min-h-[50vh]"
        elements={elements}
        stylesheet={GRAPH_STYLE}
        maxZoom={4}
        minZoom={1e-3}
        wheelSensitivity={0.4} />
    </div>
  )
}

export default CyWorkflow;