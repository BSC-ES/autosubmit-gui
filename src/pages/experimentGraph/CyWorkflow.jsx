import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import { useEffect, useRef, RefObject } from "react";
import { triggerDownload, JOB_STATUSES, STATUS_COLORS } from "../../services/utils";
import { anyActiveJobs, fitJobsInView, fitActiveJobsInView } from "./graphUtils";
import StatusLegend from "./StatusLegend";
import { attachStatusLegendToImage } from "./statusLegendUtils";

const MIN_WHEEL_ZOOM_FACTOR = 1.06;
const MAX_WHEEL_ZOOM_FACTOR = 1.25;
const MIN_ZOOM_FOR_WHEEL_STEP = 0.01;
const WHEEL_ZOOM_STEP_SCALE = 0.18;
const WHEEL_PIXELS_PER_STEP = 100;
const WHEEL_LINE_HEIGHT = 16; // Approx.

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
  ...JOB_STATUSES.map((status) => ({
    selector: `node[status='${status}']`,
    style: {
      backgroundColor: STATUS_COLORS[status],
    },
  })),
];

const getWheelZoomFactor = (zoom) => {
  // Keep each wheel step within a predictable range avoiding extreme values.
  // The step is smaller when already zoomed in and larger when zoomed out.
  const zoomForStep = Math.max(zoom, MIN_ZOOM_FOR_WHEEL_STEP);
  const factor = 1 + WHEEL_ZOOM_STEP_SCALE / Math.sqrt(zoomForStep);

  // Clamp the calculated factor to the configured minimum and maximum.
  return Math.min(MAX_WHEEL_ZOOM_FACTOR, Math.max(MIN_WHEEL_ZOOM_FACTOR, factor));
};

const CyWorkflow = ({ elements, onSelectNodes, cy: forwardCy }) => {
  /** @type {RefObject<Cytoscape.Core>} */
  const cy = useRef();

  const handleSelect = () => {
    const selectedNodes = cy.current.filter("node:selected:childless");
    onSelectNodes(selectedNodes.jsons());
  };

  useEffect(() => {
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

    const container = cy.current.container();

    const handleWheel = (event) => {
      // Read the scroll units before reading the vertical displacement
      const deltaMode = event.deltaMode;
      const deltaY = event.deltaY;

      if (deltaY === 0) return; // Ignore events with no vertical movement

      event.preventDefault(); // Prevent the default scroll behavior of the browser

      // Normalize the displacement to pixels
      let deltaPixels;
      if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
        deltaPixels = deltaY * WHEEL_LINE_HEIGHT;
      } else if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        deltaPixels = deltaY * container.clientHeight;
      } else {
        deltaPixels = deltaY;
      }

      // Compute the next zoom level based on the current zoom and the scroll displacement
      const currentZoom = cy.current.zoom();
      const factor = getWheelZoomFactor(currentZoom);
      // Instead of applying a full step per event, it is fractional
      const steps = -deltaPixels / WHEEL_PIXELS_PER_STEP;
      const nextZoom = currentZoom * Math.pow(factor, steps);

      // Apply the zoom with the mouse position as the center of the zoom
      const bounds = container.getBoundingClientRect();
      cy.current.zoom({
        level: nextZoom,
        renderedPosition: {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        },
      });
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    //Unmount component
    return () => {
      clearTimeout(selectEventTimeout);
      clearTimeout(unselectEventTimeout);

      cy.current.removeListener("add", "node:parent");
      cy.current.removeListener("select", "node:childless");
      cy.current.removeListener("unselect", "node:childless");

      container.removeEventListener("wheel", handleWheel);
    };
    // eslint-disable-next-line
  }, []);

  const handleFit = () => {
    fitJobsInView(cy, {});
  };

  const handleFocusActive = () => {
    fitActiveJobsInView(cy);
  };

  const handleDownload = async () => {
    const uri = cy.current.png({ output: "base64uri" });
    const imageUrl = await attachStatusLegendToImage(uri);

    triggerDownload(imageUrl, "graph_view.png");

    if (imageUrl.startsWith("blob:")) {
      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 0);
    }
  };

  return (
    <div className="w-full h-full relative bg-white rounded-md">
      <div className="absolute top-0 left-0 rounded-br-md z-10 bg-neutral-200 opacity-50 hover:opacity-100 text-black/50 flex gap-3 px-2">
        <button onClick={handleFit} title="Fit workflow" className="hover:text-black hover:opacity-100">
          <i className="fa-solid fa-maximize"></i>
        </button>
        <button
          onClick={handleFocusActive}
          title="Focus active jobs"
          className="enabled:hover:text-black enabled:hover:opacity-100 disabled:opacity-50"
          disabled={!anyActiveJobs(elements)}
        >
          <i className="fa-solid fa-crosshairs"></i>
        </button>
        <button
          onClick={handleDownload}
          title="Download current viewport"
          className="hover:text-black hover:opacity-100"
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
      <CytoscapeComponent
        cy={(_cy) => {
          cy.current = _cy;
          forwardCy(_cy);

          if (window.Cypress) { // Expose the Cytoscape instance to Cypress
            window.workflowCy = _cy;
          }
        }}
        className="w-full h-full min-h-[50vh]"
        elements={elements}
        stylesheet={GRAPH_STYLE}
        maxZoom={4}
        minZoom={1e-3}
        // Deactivate default scroll zoom while preserving pinch-to-zoom
        userZoomingEnabled={true}
        wheelSensitivity={0}
      />
      <StatusLegend />
      <div className="absolute bottom-0 right-0 z-10 bg-neutral-200 text-black opacity-50 hover:opacity-100 px-2 py-2 text-xs rounded-tl-md">
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
