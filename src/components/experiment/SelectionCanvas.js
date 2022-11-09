import { useRef, useEffect, useState, useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const drawRect = (info, ctx, style = {}) => {
  const { x, y, w, h } = info;
  const { backgroundColor = 'black' } = style;

  ctx.beginPath();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x, y, w, h);
}

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width) + 18,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height) + 181
  };
}

const SelectionCanvas = (props) => {
  const canvasRef = useRef(null)
  const experimentContext = useContext(ExperimentContext);
  const { setSelectedJobs, canSelect } = experimentContext;

  const resetState = (e) => {
    setRect({x: null, y: null, w: null, h: null})
    clearSquare()
  }

  const clearSquare = () => {
    if (canvasRef.current && canvasRef.current.getContext('2d')) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.globalAlpha = 0.1;
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }
  }

  // Square drawing
  const [rect, setRect] = useState({ x: null, y: null, w: null, h:null } )
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    if (go === false) {
      drawRect({ x: rect.x - 18, y: rect.y - 181, w: rect.w, h: rect.h }, context);
    }
    context.globalAlpha = 0.1;
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    context.stroke()
  }, [rect]);

  // Nodes final selection
  const [go, setGo] = useState(false)
  useEffect(() => {
    const { currentSelected } = experimentContext;
    if (go === true) {
      const canvas = canvasRef.current
      if (rect.x !== null ) {
        var rect_c = canvas.getBoundingClientRect();
        let res = []
        // Loop through all nodes and get those who are within the selection square
        props.net.state.stateNet.selectNodes(props.net.state.stateNet.body.data.nodes.get().reduce(
          (selected, {id, color}) => {
            const { x, y } = props.net.state.stateNet.getPositions(id)[id];
            let test = props.net.state.stateNet.canvasToDOM({x: x,y: y})
            test = {
              x: ((test.x - rect_c.left) / (rect_c.right - rect_c.left) * canvas.width)+25,
              y: ((test.y - rect_c.top) / (rect_c.bottom - rect_c.top) * canvas.height)+217
            }
            if (rect.x <= test.x && test.x <= rect.w + rect.x && rect.y <= test.y && test.y <= rect.h + rect.y) {
              res.push({name: id, color: color.background})
              selected.push(id)
            }
            return selected;
          }, []
        ));
        setSelectedJobs(res)
        clearSquare()
      }
    }
  // eslint-disable-next-line
  }, [go]);

  const [rightClick, setRightClick] = useState(false)
  const [init_Point, setInitPoint] = useState({x: null, y: null})
  const [fi_Point, setFiPoint] = useState({x: null, y: null})
  useEffect(() => {
    let selectCanvas = document.getElementById("canva").getBoundingClientRect();

    const handleRightClick = (e) => {
      if (!canSelect) {
        props.net.state.stateNet.unselectAll()
        setSelectedJobs([])
      }
      let p = getMousePos(document.getElementById("canva"), e)
      if(p.x <= selectCanvas.x + selectCanvas.width && p.x >= selectCanvas.x && p.y <= selectCanvas.y + selectCanvas.height && p.y >= selectCanvas.y) {
        e.preventDefault();
        setGo(false)
        setRightClick(true)
        setInitPoint({x: p.x, y: p.y})
      }
    };

    const handleMouseMove = (e) => {
        if (rightClick === true) {
          let p = getMousePos(document.getElementById("canva"), e)
          if(p.x <= selectCanvas.x + selectCanvas.width && p.x >= selectCanvas.x && p.y <= selectCanvas.y + selectCanvas.height && p.y >= selectCanvas.y) {
              e.preventDefault();
              if (rightClick === true) {
                  e.preventDefault()
                  setFiPoint({x: p.x, y: p.y})
              }
          }
        }
    }

    const handleRightClickUp = (e) => {
        let p = getMousePos(document.getElementById("canva"), e)
        if(p.x <= selectCanvas.x + selectCanvas.width && p.x >= selectCanvas.x && p.y <= selectCanvas.y + selectCanvas.height && p.y >= selectCanvas.y) {
          e.preventDefault();
          if (rightClick === true) {
            e.preventDefault()
            setFiPoint({x: p.x, y: p.y})
            setGo(true)
          }
        }
        clearSquare()
        setRightClick(false)
    };

    document.addEventListener("wheel", resetState);
    document.addEventListener("mousedown", resetState);
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("mouseup", handleRightClickUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("wheel", resetState);
      document.removeEventListener("mosuedown", resetState);
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("mouseup", handleRightClickUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line
  }, [rightClick]);

  useEffect(() => {
    if (fi_Point.x !== null) {
      setRect( { x: Math.min(init_Point.x, fi_Point.x), y: Math.min(init_Point.y, fi_Point.y), w: (Math.max(init_Point.x, fi_Point.x) - Math.min(init_Point.x, fi_Point.x)), h: (Math.max(init_Point.y, fi_Point.y) - Math.min(init_Point.y, fi_Point.y)) })
    }
  // eslint-disable-next-line
  }, [fi_Point])

  return (
    <canvas
        id="canva"
        tabIndex={0}
        ref={canvasRef}
        style={{width:"100%", height:"100%", position:"absolute"}}
        />
  );
};

export default SelectionCanvas;
