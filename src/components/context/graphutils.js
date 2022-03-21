import { DEBUG } from "./vars";

// graphutils.js tests are provided in GraphNativeRep.test.js

export const navigateGraph = (Id, posx, posy, cScale = 0.9, visNetwork) => {
  DEBUG && console.log(posx + " " + posy);
  if (cScale <= 0.05) cScale = 0.05;
  if (visNetwork) {
    visNetwork.moveTo({
      position: { x: posx, y: posy },
      scale: cScale,
      //offset: {x: 30, y: 30},
      animation: false,
    });
    if (Id) {
      visNetwork.selectNodes([Id]);
    }
  }
};

export const addFakeEdge = (source, target, state) => {
  let id_edge = source + "-" + target;
  DEBUG && console.log("Adding fake edge from " + source + " to " + target);
  if (state.visNetwork) {
    const nodesIn = Object.keys(state.visNetwork.body.data.nodes._data);
    let edgesSet = new Set();
    state.visNetwork.body.data.edges.map((item) => edgesSet.add(item.id));
    if (
      nodesIn.includes(source) &&
      nodesIn.includes(target) &&
      !edgesSet.has(id_edge)
    ) {
      state.visNetwork.body.data.edges.add([
        {
          id: id_edge,
          from: source,
          to: target,
          dashes: true,
          background: { enabled: true, color: "rgba(63, 191, 63, 0.5)" },
          arrows: { to: { enabled: false } },
        },
      ]);
    }
  }
};

export const updateEdgeStyle = (idEdge, state) => {
  if (state.visNetwork) {
    if (Object.keys(state.visNetwork.body.edges).includes(idEdge)) {
      DEBUG && console.log("Update style of edge " + idEdge);
      state.visNetwork.body.edges[idEdge].options.dashes = false;
      state.visNetwork.body.edges[idEdge].options.background.enabled = true;
      state.visNetwork.body.edges[idEdge].options.background.color =
        "rgba(63, 191, 63, 0.5)";
    }
  }
};

export const updateGraphBorder = (idChange, state) => {
  DEBUG && console.log("Upate graph border of " + idChange);
  if (state.visNetwork) {
    state.visNetwork.body.nodes[
      idChange
    ].options.shapeProperties.borderDashes = true;
    state.visNetwork.selectNodes([idChange]);
  }
};

export const updateGraphColor = (idChange, newColor, state) => {
  DEBUG && console.log("Upate graph color of " + idChange);
  if (state.visNetwork) {
    state.visNetwork.body.nodes[idChange].options.color.background = newColor;
    state.visNetwork.selectNodes([idChange]);
  }
};

export const updateGraphShape = (idChange, shape, state) => {
  DEBUG && console.log("Upate graph shape of " + idChange);
  if (state.visNetwork) {
    state.visNetwork.body.nodes[idChange].options.shape = shape;
    state.visNetwork.selectNodes([idChange]);
  }
};

export const navToLatest = (
  statusCode,
  latest = true,
  cScale = 0.9,
  visNetwork = null,
  data = null,
  state = null
) => {
  var currentLevel = 0;
  DEBUG && console.log("Nav to Latest.");
  //var currentNode = null;
  var latestId = "not found";
  //console.log(state.data.nodes);
  if (data && data.nodes) {
    //console.log("Iterate")
    if (latest === true) {
      for (const node of data.nodes) {
        if (node.status_code === statusCode) {
          if (node.level >= currentLevel) {
            currentLevel = node.level;
            //currentNode = node;
            latestId = node.id;
          }
        }
      }
    } else {
      currentLevel = Number.MAX_VALUE;
      for (const node of data.nodes) {
        if (node.status_code === statusCode) {
          if (node.level <= currentLevel) {
            currentLevel = node.level;
            //currentNode = node;
            latestId = node.id;
          }
        }
      }
    }
  }

  //console.log(latestId);
  let currentPosition;
  if (visNetwork) {
    currentPosition = visNetwork.getPositions([latestId]);
    if (currentPosition[latestId]) {
      //console.log("So good so far")
      navigateGraph(
        latestId,
        currentPosition[latestId].x,
        currentPosition[latestId].y,
        cScale,
        visNetwork
      );
      state.selection = [latestId];
    } else {
      state.selection = null;
    }
  }
  if (currentPosition[latestId]) {
    return true;
  } else {
    return false;
  }
};

export const findIdinGraph = (Id, state) => {
  if (state.visNetwork) {
    const currentPosition = state.visNetwork.getPositions([Id]);
    if (currentPosition[Id]) {
      return { x: currentPosition[Id].x, y: currentPosition[Id].y };
    }
  }
  return { x: null, y: null };
};

// export const searchJobInGraph = async (string, state) => {
//   if (state.data && state.data.nodes) {
//     const foundNodes = await state.data.nodes.filter(
//       (node) => node.id.toUpperCase().indexOf(string) >= 0
//     );
//     // console.log(foundNodes);
//     // console.log(foundNodes.length);
//     if (foundNodes && foundNodes.length > 0) {
//       state.foundNodes = foundNodes;
//       state.selection = [foundNodes[0].id]
//     }
//   }
// }
