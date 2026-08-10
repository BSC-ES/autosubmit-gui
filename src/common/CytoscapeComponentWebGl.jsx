import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";

class CytoscapeComponentWebGl extends CytoscapeComponent {
  componentDidMount() {
    const container = this.containerRef.current;

    const {
      global,
      headless,
      styleEnabled,
      hideEdgesOnViewport,
      textureOnViewport,
      motionBlur,
      motionBlurOpacity,
      wheelSensitivity,
      pixelRatio,
    } = this.props;

    const cy = (this._cy = new Cytoscape({
      container,
      headless,
      styleEnabled,
      hideEdgesOnViewport,
      textureOnViewport,
      motionBlur,
      motionBlurOpacity,
      wheelSensitivity,
      pixelRatio,
      renderer: {
        // Add WebGL renderer options
        name: "canvas",
        webgl: true, // turns on WebGL mode
        showFps: true, // (optional) shows the current FPS at the top-left
        webglDebug: true, // (optional) prints debug info to the browser console
      },
    }));

    if (global) {
      window[global] = cy;
    }

    this.updateCytoscape(null, this.props);
  }
}

export default CytoscapeComponentWebGl;
