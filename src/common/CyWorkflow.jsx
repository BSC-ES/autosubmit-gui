import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import { useEffect, useRef, MutableRefObject } from "react";
import { triggerDownload } from "../services/utils";

const GRAPH_STYLE = [
  {
    selector: "node",
    style: {
      label: "data(id)",
      "text-valign": "bottom",
      "text-margin-y": 8,
      "border-width": 3,
      "border-color": "black",
      color: "black",
      "min-zoomed-font-size": 1,
      "background-color": "white",
    },
  },
  {
    selector: "node:selected",
    style: {
      "border-color": "#4E8490",
      color: "white",
      "font-weight": "bold",
      "text-background-opacity": 1,
      "text-background-color": "#4E8490",
      "text-background-shape": "round-rectangle",
      "text-background-padding": 4,
    },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
  {
    selector: ":parent",
    style: {
      label: "data(id)",
      "text-valign": "top",
      "border-style": "dashed",
      "text-margin-y": -8,
      "text-opacity": 0.75,
      "font-style": "italic",
    },
  },
  {
    selector: "node:selected > $node",
    style: {
      "border-color": "#4E8490",
      "border-style": "dashed",
    },
  },
  {
    selector: "node[status='WAITING']",
    style: {
      backgroundColor: "#aaaaaa",
    },
  },
  {
    selector: "node[status='READY']",
    style: {
      backgroundColor: "lightblue",
    },
  },
  {
    selector: "node[status='PREPARED']",
    style: {
      backgroundColor: "lightsalmon",
    },
  },
  {
    selector: "node[status='SUBMITTED']",
    style: {
      backgroundColor: "cyan",
    },
  },
  {
    selector: "node[status='HELD']",
    style: {
      backgroundColor: "salmon",
    },
  },
  {
    selector: "node[status='QUEUING']",
    style: {
      backgroundColor: "lightpink",
    },
  },
  {
    selector: "node[status='RUNNING']",
    style: {
      backgroundColor: "green",
    },
  },
  {
    selector: "node[status='COMPLETED']",
    style: {
      backgroundColor: "yellow",
    },
  },
  {
    selector: "node[status='FAILED']",
    style: {
      backgroundColor: "red",
    },
  },
  {
    selector: "node[status='SUSPENDED']",
    style: {
      backgroundColor: "orange",
    },
  },
  {
    selector: "node[status='SKIPPED']",
    style: {
      backgroundColor: "lightyellow",
    },
  },
  {
    selector: "node[status='DELAYED']",
    style: {
      backgroundColor: "lightcyan",
    },
  },
];

const CyWorkflow = ({ elements, onSelectNodes, cy: forwardCy }) => {
  /** @type {MutableRefObject<Cytoscape.Core>} */
  const cy = useRef();

  const handleSelect = () => {
    const selectedNodes = cy.current.filter("node:selected:childless");
    onSelectNodes(selectedNodes.jsons());
  };

  useEffect(() => {
    // Mount component

    // First add
    cy.current.one("add", "node", () => {
      cy.current.fit();
    });

    // On wrapper add
    cy.current.on("add", "node:parent", (e) => {
      const selectedNodes = cy.current.filter("node:parent");
      selectedNodes.removeAllListeners();
      // This will allow Shift + DoubleClick select
      selectedNodes.addListener("dblclick", (e) => {
        e.target.children().select();
      });
    });

    // Every time a node is selected, timeout used to only call the handle once when multiple are called at the same time
    // https://stackoverflow.com/questions/16677856/cy-onselect-callback-only-once
    var selectEventTimeout;
    cy.current.on("select", "node:childless", (e) => {
      clearTimeout(selectEventTimeout);
      selectEventTimeout = setTimeout(function () {
        handleSelect();
      }, 100);
    });

    var unselectEventTimeout;
    cy.current.on("unselect", "node:childless", (e) => {
      clearTimeout(unselectEventTimeout);
      unselectEventTimeout = setTimeout(function () {
        handleSelect();
      }, 100);
    });

    //Unmount component
    return () => {};
    // eslint-disable-next-line
  }, []);

  const handleFit = () => {
    cy.current.fit();
  };

  const handleDownload = async () => {
    const uri = await cy.current.png({ output: "base64uri" });
    triggerDownload(uri, `graph_view.png`);
  };

  return (
    <div className="w-full h-full relative bg-white">
      <div className="absolute top-0 left-0 z-10 bg-neutral-200 text-black opacity-50 flex gap-3 px-2">
        <button onClick={handleFit} title="Fit">
          <i className="fa-solid fa-maximize"></i>
        </button>
        <button onClick={handleDownload} title="Download current viewport">
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
      <CytoscapeComponent
        cy={(_cy) => {
          cy.current = _cy;
          forwardCy(_cy);
        }}
        className="w-full h-full min-h-[50vh]"
        elements={elements}
        stylesheet={GRAPH_STYLE}
        maxZoom={4}
        minZoom={1e-3}
        wheelSensitivity={0.4}
      />
      <div className="absolute bottom-0 right-0 z-10 bg-neutral-200 text-black opacity-50 px-2 py-2 text-xs">
        <div>
          Box selection: <kbd className="kbd-key">Shift + LClick</kbd>
        </div>
        <div>
          Add/remove select: <kbd className="kbd-key">Ctrl + LClick</kbd>
        </div>
      </div>
    </div>
  );
};

export default CyWorkflow;
