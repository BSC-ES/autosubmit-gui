import React, { useRef, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";


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
      "background-color": "yellow", 
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
];

const CriticalPathGraph = ({ elements, onTapNode }) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.resize();
      cyRef.current.center();
      cyRef.current.fit();
      cyRef.current.on("tap", "node", (event) => {
        if (onTapNode) onTapNode(event.target.data());
      });
    }
  }, [elements, onTapNode]);

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit();
    }
  };

  const handleDownload = async () => {
    if (cyRef.current) {
      const uri = await cyRef.current.png({ output: "base64uri" });
      const link = document.createElement("a");
      link.href = uri;
      link.download = "critical_path.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
        elements={elements}
        stylesheet={GRAPH_STYLE}
        style={{ width: "100%", height: "40vh" }}
        cy={(cy) => {
          cyRef.current = cy;
        }}
      />
    </div>
  );
};

export default CriticalPathGraph;