import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import GraphNativeRep from "../GraphNativeRep";
import Selection from "../Selection";
import ExperimentContext from "../../context/experiment/experimentContext";
import GraphContext from "../../context/graph/graphContext";
import TreeContext from "../../context/tree/treeContext";
import { navigateGraph, addFakeEdge, updateEdgeStyle, updateGraphBorder, updateGraphColor, updateGraphShape, navToLatest, findIdinGraph } from "../../context/graphutils";

const data = {
  "chunk_size": 1,
  "chunk_unit": "month",
  "edges": [
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_INI",
          "id": "a34f_INI-a34f_19600101_fc0000_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0000_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_1_SIM",
          "id": "a34f_19600101_fc0000_1_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_POST",
          "id": "a34f_19600101_fc0000_POST-a34f_19600101_fc0001_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0001_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_6_SIM",
          "id": "a34f_19600101_fc0001_6_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_POST",
          "id": "a34f_19600101_fc0001_POST-a34f_19600101_fc0002_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0002_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_4_SIM",
          "id": "a34f_19600101_fc0002_4_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_POST",
          "id": "a34f_19600101_fc0002_POST-a34f_19600101_fc0003_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0003_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_2_SIM",
          "id": "a34f_19600101_fc0003_2_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_POST",
          "id": "a34f_19600101_fc0003_POST-a34f_19600101_fc0004_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0004_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_9_SIM",
          "id": "a34f_19600101_fc0004_9_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_POST",
          "id": "a34f_19600101_fc0004_POST-a34f_19600101_fc0005_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0005_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_7_SIM",
          "id": "a34f_19600101_fc0005_7_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_POST",
          "id": "a34f_19600101_fc0005_POST-a34f_19600101_fc0006_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0006_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_3_SIM",
          "id": "a34f_19600101_fc0006_3_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_POST",
          "id": "a34f_19600101_fc0006_POST-a34f_19600101_fc0007_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0007_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_6_SIM",
          "id": "a34f_19600101_fc0007_6_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_POST",
          "id": "a34f_19600101_fc0007_POST-a34f_19600101_fc0008_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0008_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_7_SIM",
          "id": "a34f_19600101_fc0008_7_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_5_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_5_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_6_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_6_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_9_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_9_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_7_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_7_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_8_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_8_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_1_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_1_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_2_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_2_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_3_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_3_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_4_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_4_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_POST",
          "id": "a34f_19600101_fc0008_POST-a34f_19600101_fc0009_10_SIM",
          "is_wrapper": false,
          "to": "a34f_19600101_fc0009_10_SIM"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_5_SIM",
          "id": "a34f_19600101_fc0009_5_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_6_SIM",
          "id": "a34f_19600101_fc0009_6_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_9_SIM",
          "id": "a34f_19600101_fc0009_9_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_7_SIM",
          "id": "a34f_19600101_fc0009_7_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_8_SIM",
          "id": "a34f_19600101_fc0009_8_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_1_SIM",
          "id": "a34f_19600101_fc0009_1_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_2_SIM",
          "id": "a34f_19600101_fc0009_2_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_3_SIM",
          "id": "a34f_19600101_fc0009_3_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_4_SIM",
          "id": "a34f_19600101_fc0009_4_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0009_10_SIM",
          "id": "a34f_19600101_fc0009_10_SIM-a34f_19600101_fc0009_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_8_SIM",
          "id": "a34f_19600101_fc0008_8_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_1_SIM",
          "id": "a34f_19600101_fc0008_1_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_2_SIM",
          "id": "a34f_19600101_fc0008_2_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_10_SIM",
          "id": "a34f_19600101_fc0008_10_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_3_SIM",
          "id": "a34f_19600101_fc0008_3_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_4_SIM",
          "id": "a34f_19600101_fc0008_4_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_9_SIM",
          "id": "a34f_19600101_fc0008_9_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_5_SIM",
          "id": "a34f_19600101_fc0008_5_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0008_6_SIM",
          "id": "a34f_19600101_fc0008_6_SIM-a34f_19600101_fc0008_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_10_SIM",
          "id": "a34f_19600101_fc0007_10_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_9_SIM",
          "id": "a34f_19600101_fc0007_9_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_5_SIM",
          "id": "a34f_19600101_fc0007_5_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_3_SIM",
          "id": "a34f_19600101_fc0007_3_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_8_SIM",
          "id": "a34f_19600101_fc0007_8_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_7_SIM",
          "id": "a34f_19600101_fc0007_7_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_4_SIM",
          "id": "a34f_19600101_fc0007_4_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_2_SIM",
          "id": "a34f_19600101_fc0007_2_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0007_1_SIM",
          "id": "a34f_19600101_fc0007_1_SIM-a34f_19600101_fc0007_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_6_SIM",
          "id": "a34f_19600101_fc0006_6_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_8_SIM",
          "id": "a34f_19600101_fc0006_8_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_10_SIM",
          "id": "a34f_19600101_fc0006_10_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_9_SIM",
          "id": "a34f_19600101_fc0006_9_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_1_SIM",
          "id": "a34f_19600101_fc0006_1_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_7_SIM",
          "id": "a34f_19600101_fc0006_7_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_5_SIM",
          "id": "a34f_19600101_fc0006_5_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_4_SIM",
          "id": "a34f_19600101_fc0006_4_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0006_2_SIM",
          "id": "a34f_19600101_fc0006_2_SIM-a34f_19600101_fc0006_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_6_SIM",
          "id": "a34f_19600101_fc0005_6_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_2_SIM",
          "id": "a34f_19600101_fc0005_2_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_5_SIM",
          "id": "a34f_19600101_fc0005_5_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_1_SIM",
          "id": "a34f_19600101_fc0005_1_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_4_SIM",
          "id": "a34f_19600101_fc0005_4_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_9_SIM",
          "id": "a34f_19600101_fc0005_9_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_8_SIM",
          "id": "a34f_19600101_fc0005_8_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_3_SIM",
          "id": "a34f_19600101_fc0005_3_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0005_10_SIM",
          "id": "a34f_19600101_fc0005_10_SIM-a34f_19600101_fc0005_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_4_SIM",
          "id": "a34f_19600101_fc0004_4_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_2_SIM",
          "id": "a34f_19600101_fc0004_2_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_5_SIM",
          "id": "a34f_19600101_fc0004_5_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_8_SIM",
          "id": "a34f_19600101_fc0004_8_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_10_SIM",
          "id": "a34f_19600101_fc0004_10_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_1_SIM",
          "id": "a34f_19600101_fc0004_1_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_6_SIM",
          "id": "a34f_19600101_fc0004_6_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_3_SIM",
          "id": "a34f_19600101_fc0004_3_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0004_7_SIM",
          "id": "a34f_19600101_fc0004_7_SIM-a34f_19600101_fc0004_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_6_SIM",
          "id": "a34f_19600101_fc0003_6_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_10_SIM",
          "id": "a34f_19600101_fc0003_10_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_7_SIM",
          "id": "a34f_19600101_fc0003_7_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_9_SIM",
          "id": "a34f_19600101_fc0003_9_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_1_SIM",
          "id": "a34f_19600101_fc0003_1_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_3_SIM",
          "id": "a34f_19600101_fc0003_3_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_4_SIM",
          "id": "a34f_19600101_fc0003_4_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_5_SIM",
          "id": "a34f_19600101_fc0003_5_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0003_8_SIM",
          "id": "a34f_19600101_fc0003_8_SIM-a34f_19600101_fc0003_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_5_SIM",
          "id": "a34f_19600101_fc0002_5_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_6_SIM",
          "id": "a34f_19600101_fc0002_6_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_7_SIM",
          "id": "a34f_19600101_fc0002_7_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_10_SIM",
          "id": "a34f_19600101_fc0002_10_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_8_SIM",
          "id": "a34f_19600101_fc0002_8_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_1_SIM",
          "id": "a34f_19600101_fc0002_1_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_2_SIM",
          "id": "a34f_19600101_fc0002_2_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_3_SIM",
          "id": "a34f_19600101_fc0002_3_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0002_9_SIM",
          "id": "a34f_19600101_fc0002_9_SIM-a34f_19600101_fc0002_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_7_SIM",
          "id": "a34f_19600101_fc0001_7_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_10_SIM",
          "id": "a34f_19600101_fc0001_10_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_8_SIM",
          "id": "a34f_19600101_fc0001_8_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_1_SIM",
          "id": "a34f_19600101_fc0001_1_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_9_SIM",
          "id": "a34f_19600101_fc0001_9_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_2_SIM",
          "id": "a34f_19600101_fc0001_2_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_3_SIM",
          "id": "a34f_19600101_fc0001_3_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_4_SIM",
          "id": "a34f_19600101_fc0001_4_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0001_5_SIM",
          "id": "a34f_19600101_fc0001_5_SIM-a34f_19600101_fc0001_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_2_SIM",
          "id": "a34f_19600101_fc0000_2_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_3_SIM",
          "id": "a34f_19600101_fc0000_3_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_4_SIM",
          "id": "a34f_19600101_fc0000_4_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_5_SIM",
          "id": "a34f_19600101_fc0000_5_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_6_SIM",
          "id": "a34f_19600101_fc0000_6_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_7_SIM",
          "id": "a34f_19600101_fc0000_7_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_8_SIM",
          "id": "a34f_19600101_fc0000_8_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_9_SIM",
          "id": "a34f_19600101_fc0000_9_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      },
      {
          "dashed": false,
          "from": "a34f_19600101_fc0000_10_SIM",
          "id": "a34f_19600101_fc0000_10_SIM-a34f_19600101_fc0000_POST",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_POST"
      }
  ],
  "error": false,
  "error_message": "None",
  "fake_edges": [
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_2_SIM",
          "id": "a34f_19600101_fc0007_2_SIM-a34f_19600101_fc0007_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_1_SIM",
          "id": "a34f_19600101_fc0007_1_SIM-a34f_19600101_fc0007_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_10_SIM",
          "id": "a34f_19600101_fc0007_10_SIM-a34f_19600101_fc0007_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_6_SIM",
          "id": "a34f_19600101_fc0007_6_SIM-a34f_19600101_fc0007_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_9_SIM",
          "id": "a34f_19600101_fc0007_9_SIM-a34f_19600101_fc0007_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_3_SIM",
          "id": "a34f_19600101_fc0007_3_SIM-a34f_19600101_fc0007_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_5_SIM",
          "id": "a34f_19600101_fc0007_5_SIM-a34f_19600101_fc0007_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_8_SIM",
          "id": "a34f_19600101_fc0007_8_SIM-a34f_19600101_fc0007_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0007_4_SIM",
          "id": "a34f_19600101_fc0007_4_SIM-a34f_19600101_fc0007_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0007_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_1_SIM",
          "id": "a34f_19600101_fc0003_1_SIM-a34f_19600101_fc0003_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_8_SIM",
          "id": "a34f_19600101_fc0003_8_SIM-a34f_19600101_fc0003_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_4_SIM",
          "id": "a34f_19600101_fc0003_4_SIM-a34f_19600101_fc0003_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_9_SIM",
          "id": "a34f_19600101_fc0003_9_SIM-a34f_19600101_fc0003_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_5_SIM",
          "id": "a34f_19600101_fc0003_5_SIM-a34f_19600101_fc0003_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_7_SIM",
          "id": "a34f_19600101_fc0003_7_SIM-a34f_19600101_fc0003_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_10_SIM",
          "id": "a34f_19600101_fc0003_10_SIM-a34f_19600101_fc0003_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_3_SIM",
          "id": "a34f_19600101_fc0003_3_SIM-a34f_19600101_fc0003_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0003_6_SIM",
          "id": "a34f_19600101_fc0003_6_SIM-a34f_19600101_fc0003_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0003_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_4_SIM",
          "id": "a34f_19600101_fc0004_4_SIM-a34f_19600101_fc0004_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_8_SIM",
          "id": "a34f_19600101_fc0004_8_SIM-a34f_19600101_fc0004_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_10_SIM",
          "id": "a34f_19600101_fc0004_10_SIM-a34f_19600101_fc0004_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_2_SIM",
          "id": "a34f_19600101_fc0004_2_SIM-a34f_19600101_fc0004_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_1_SIM",
          "id": "a34f_19600101_fc0004_1_SIM-a34f_19600101_fc0004_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_9_SIM",
          "id": "a34f_19600101_fc0004_9_SIM-a34f_19600101_fc0004_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_6_SIM",
          "id": "a34f_19600101_fc0004_6_SIM-a34f_19600101_fc0004_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_3_SIM",
          "id": "a34f_19600101_fc0004_3_SIM-a34f_19600101_fc0004_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0004_7_SIM",
          "id": "a34f_19600101_fc0004_7_SIM-a34f_19600101_fc0004_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0004_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_3_SIM",
          "id": "a34f_19600101_fc0008_3_SIM-a34f_19600101_fc0008_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_8_SIM",
          "id": "a34f_19600101_fc0008_8_SIM-a34f_19600101_fc0008_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_4_SIM",
          "id": "a34f_19600101_fc0008_4_SIM-a34f_19600101_fc0008_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_5_SIM",
          "id": "a34f_19600101_fc0008_5_SIM-a34f_19600101_fc0008_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_1_SIM",
          "id": "a34f_19600101_fc0008_1_SIM-a34f_19600101_fc0008_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_9_SIM",
          "id": "a34f_19600101_fc0008_9_SIM-a34f_19600101_fc0008_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_7_SIM",
          "id": "a34f_19600101_fc0008_7_SIM-a34f_19600101_fc0008_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_10_SIM",
          "id": "a34f_19600101_fc0008_10_SIM-a34f_19600101_fc0008_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0008_2_SIM",
          "id": "a34f_19600101_fc0008_2_SIM-a34f_19600101_fc0008_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0008_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_6_SIM",
          "id": "a34f_19600101_fc0009_6_SIM-a34f_19600101_fc0009_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_2_SIM",
          "id": "a34f_19600101_fc0009_2_SIM-a34f_19600101_fc0009_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_1_SIM",
          "id": "a34f_19600101_fc0009_1_SIM-a34f_19600101_fc0009_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_8_SIM",
          "id": "a34f_19600101_fc0009_8_SIM-a34f_19600101_fc0009_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_3_SIM",
          "id": "a34f_19600101_fc0009_3_SIM-a34f_19600101_fc0009_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_9_SIM",
          "id": "a34f_19600101_fc0009_9_SIM-a34f_19600101_fc0009_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_4_SIM",
          "id": "a34f_19600101_fc0009_4_SIM-a34f_19600101_fc0009_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_5_SIM",
          "id": "a34f_19600101_fc0009_5_SIM-a34f_19600101_fc0009_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0009_10_SIM",
          "id": "a34f_19600101_fc0009_10_SIM-a34f_19600101_fc0009_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0009_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_8_SIM",
          "id": "a34f_19600101_fc0006_8_SIM-a34f_19600101_fc0006_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_7_SIM",
          "id": "a34f_19600101_fc0006_7_SIM-a34f_19600101_fc0006_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_6_SIM",
          "id": "a34f_19600101_fc0006_6_SIM-a34f_19600101_fc0006_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_4_SIM",
          "id": "a34f_19600101_fc0006_4_SIM-a34f_19600101_fc0006_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_5_SIM",
          "id": "a34f_19600101_fc0006_5_SIM-a34f_19600101_fc0006_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_1_SIM",
          "id": "a34f_19600101_fc0006_1_SIM-a34f_19600101_fc0006_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_2_SIM",
          "id": "a34f_19600101_fc0006_2_SIM-a34f_19600101_fc0006_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_3_SIM",
          "id": "a34f_19600101_fc0006_3_SIM-a34f_19600101_fc0006_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0006_10_SIM",
          "id": "a34f_19600101_fc0006_10_SIM-a34f_19600101_fc0006_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0006_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_5_SIM",
          "id": "a34f_19600101_fc0000_5_SIM-a34f_19600101_fc0000_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_4_SIM",
          "id": "a34f_19600101_fc0000_4_SIM-a34f_19600101_fc0000_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_3_SIM",
          "id": "a34f_19600101_fc0000_3_SIM-a34f_19600101_fc0000_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_6_SIM",
          "id": "a34f_19600101_fc0000_6_SIM-a34f_19600101_fc0000_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_10_SIM",
          "id": "a34f_19600101_fc0000_10_SIM-a34f_19600101_fc0000_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_1_SIM",
          "id": "a34f_19600101_fc0000_1_SIM-a34f_19600101_fc0000_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_2_SIM",
          "id": "a34f_19600101_fc0000_2_SIM-a34f_19600101_fc0000_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_8_SIM",
          "id": "a34f_19600101_fc0000_8_SIM-a34f_19600101_fc0000_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0000_9_SIM",
          "id": "a34f_19600101_fc0000_9_SIM-a34f_19600101_fc0000_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0000_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_6_SIM",
          "id": "a34f_19600101_fc0005_6_SIM-a34f_19600101_fc0005_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_4_SIM",
          "id": "a34f_19600101_fc0005_4_SIM-a34f_19600101_fc0005_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_3_SIM",
          "id": "a34f_19600101_fc0005_3_SIM-a34f_19600101_fc0005_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_5_SIM",
          "id": "a34f_19600101_fc0005_5_SIM-a34f_19600101_fc0005_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_1_SIM",
          "id": "a34f_19600101_fc0005_1_SIM-a34f_19600101_fc0005_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_10_SIM",
          "id": "a34f_19600101_fc0005_10_SIM-a34f_19600101_fc0005_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_9_SIM",
          "id": "a34f_19600101_fc0005_9_SIM-a34f_19600101_fc0005_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_7_SIM",
          "id": "a34f_19600101_fc0005_7_SIM-a34f_19600101_fc0005_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0005_8_SIM",
          "id": "a34f_19600101_fc0005_8_SIM-a34f_19600101_fc0005_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0005_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_4_SIM",
          "id": "a34f_19600101_fc0002_4_SIM-a34f_19600101_fc0002_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_10_SIM",
          "id": "a34f_19600101_fc0002_10_SIM-a34f_19600101_fc0002_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_8_SIM",
          "id": "a34f_19600101_fc0002_8_SIM-a34f_19600101_fc0002_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_1_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_1_SIM",
          "id": "a34f_19600101_fc0002_1_SIM-a34f_19600101_fc0002_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_3_SIM",
          "id": "a34f_19600101_fc0002_3_SIM-a34f_19600101_fc0002_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_5_SIM",
          "id": "a34f_19600101_fc0002_5_SIM-a34f_19600101_fc0002_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_7_SIM",
          "id": "a34f_19600101_fc0002_7_SIM-a34f_19600101_fc0002_6_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_6_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_6_SIM",
          "id": "a34f_19600101_fc0002_6_SIM-a34f_19600101_fc0002_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0002_2_SIM",
          "id": "a34f_19600101_fc0002_2_SIM-a34f_19600101_fc0002_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0002_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_6_SIM",
          "id": "a34f_19600101_fc0001_6_SIM-a34f_19600101_fc0001_7_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_7_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_7_SIM",
          "id": "a34f_19600101_fc0001_7_SIM-a34f_19600101_fc0001_4_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_4_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_4_SIM",
          "id": "a34f_19600101_fc0001_4_SIM-a34f_19600101_fc0001_9_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_9_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_9_SIM",
          "id": "a34f_19600101_fc0001_9_SIM-a34f_19600101_fc0001_8_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_8_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_8_SIM",
          "id": "a34f_19600101_fc0001_8_SIM-a34f_19600101_fc0001_5_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_5_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_5_SIM",
          "id": "a34f_19600101_fc0001_5_SIM-a34f_19600101_fc0001_2_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_2_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_2_SIM",
          "id": "a34f_19600101_fc0001_2_SIM-a34f_19600101_fc0001_10_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_10_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_10_SIM",
          "id": "a34f_19600101_fc0001_10_SIM-a34f_19600101_fc0001_3_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_3_SIM"
      },
      {
          "dashed": true,
          "from": "a34f_19600101_fc0001_3_SIM",
          "id": "a34f_19600101_fc0001_3_SIM-a34f_19600101_fc0001_1_SIM",
          "is_wrapper": true,
          "to": "a34f_19600101_fc0001_1_SIM"
      }
  ],
  "graphviz": true,
  "groups": [],
  "groups_data": {},
  "max_children": 10,
  "max_parents": 10,
  "nodes": [
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0000_1_SIM",
              "a34f_19600101_fc0000_2_SIM",
              "a34f_19600101_fc0000_3_SIM",
              "a34f_19600101_fc0000_4_SIM",
              "a34f_19600101_fc0000_5_SIM",
              "a34f_19600101_fc0000_6_SIM",
              "a34f_19600101_fc0000_7_SIM",
              "a34f_19600101_fc0000_8_SIM",
              "a34f_19600101_fc0000_9_SIM",
              "a34f_19600101_fc0000_10_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": false,
          "date": "",
          "date_plus": "",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_INI.20201105105424.err",
          "finish": "2020-11-05 10:58:07",
          "id": "a34f_INI",
          "internal_id": "a34f_INI",
          "label": "a34f_INI",
          "level": 1,
          "member": null,
          "minutes": 192,
          "minutes_queue": 29,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_INI.20201105105424.out",
          "package": "",
          "parent_list": [],
          "parents": 0,
          "platform_name": null,
          "priority": 0,
          "processors": "1",
          "rm_id": "12299018",
          "section": "INI",
          "shape": "dot",
          "start": "2020-11-05 10:54:55",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:54:26",
          "wallclock": "00:25",
          "x": 1363.77,
          "y": -1822.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_1_SIM.20201105105807.err",
          "finish": "2020-11-05 11:02:07",
          "id": "a34f_19600101_fc0000_1_SIM",
          "internal_id": "a34f_19600101_fc0000_1_SIM",
          "label": "a34f_19600101_fc0000_1_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 184,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_1_SIM.20201105105807.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:12",
          "wallclock": "00:30",
          "x": 408.753,
          "y": -1732.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0001_6_SIM",
              "a34f_19600101_fc0001_7_SIM",
              "a34f_19600101_fc0001_10_SIM",
              "a34f_19600101_fc0001_8_SIM",
              "a34f_19600101_fc0001_1_SIM",
              "a34f_19600101_fc0001_9_SIM",
              "a34f_19600101_fc0001_2_SIM",
              "a34f_19600101_fc0001_3_SIM",
              "a34f_19600101_fc0001_4_SIM",
              "a34f_19600101_fc0001_5_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_POST.20201105105809.err",
          "finish": "2020-11-05 11:02:09",
          "id": "a34f_19600101_fc0000_POST",
          "internal_id": "a34f_19600101_fc0000_POST",
          "label": "a34f_19600101_fc0000_POST",
          "level": 3,
          "member": "fc0000",
          "minutes": 3,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_POST.20201105105809.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_8_SIM",
              "a34f_19600101_fc0000_1_SIM",
              "a34f_19600101_fc0000_2_SIM",
              "a34f_19600101_fc0000_3_SIM",
              "a34f_19600101_fc0000_4_SIM",
              "a34f_19600101_fc0000_5_SIM",
              "a34f_19600101_fc0000_10_SIM",
              "a34f_19600101_fc0000_6_SIM",
              "a34f_19600101_fc0000_7_SIM",
              "a34f_19600101_fc0000_9_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299173",
          "section": "POST",
          "shape": "hexagon",
          "start": "2020-11-05 11:02:06",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:15",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -1642.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_6_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:07",
          "id": "a34f_19600101_fc0001_6_SIM",
          "internal_id": "a34f_19600101_fc0001_6_SIM",
          "label": "a34f_19600101_fc0001_6_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 183,
          "minutes_queue": 26,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_6_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:38",
          "wallclock": "00:30",
          "x": 1772.4599999999998,
          "y": -1552.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0002_4_SIM",
              "a34f_19600101_fc0002_5_SIM",
              "a34f_19600101_fc0002_6_SIM",
              "a34f_19600101_fc0002_7_SIM",
              "a34f_19600101_fc0002_10_SIM",
              "a34f_19600101_fc0002_8_SIM",
              "a34f_19600101_fc0002_1_SIM",
              "a34f_19600101_fc0002_2_SIM",
              "a34f_19600101_fc0002_3_SIM",
              "a34f_19600101_fc0002_9_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_POST.20201105110233.err",
          "finish": "2020-11-05 11:06:08",
          "id": "a34f_19600101_fc0001_POST",
          "internal_id": "a34f_19600101_fc0001_POST",
          "label": "a34f_19600101_fc0001_POST",
          "level": 5,
          "member": "fc0001",
          "minutes": 2,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_POST.20201105110233.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_6_SIM",
              "a34f_19600101_fc0001_7_SIM",
              "a34f_19600101_fc0001_10_SIM",
              "a34f_19600101_fc0001_8_SIM",
              "a34f_19600101_fc0001_1_SIM",
              "a34f_19600101_fc0001_9_SIM",
              "a34f_19600101_fc0001_2_SIM",
              "a34f_19600101_fc0001_3_SIM",
              "a34f_19600101_fc0001_4_SIM",
              "a34f_19600101_fc0001_5_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299307",
          "section": "POST",
          "shape": "square",
          "start": "2020-11-05 11:06:06",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:39",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -1462.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_4_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:55",
          "id": "a34f_19600101_fc0002_4_SIM",
          "internal_id": "a34f_19600101_fc0002_4_SIM",
          "label": "a34f_19600101_fc0002_4_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 187,
          "minutes_queue": 18,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_4_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:30",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -1372.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0003_2_SIM",
              "a34f_19600101_fc0003_6_SIM",
              "a34f_19600101_fc0003_10_SIM",
              "a34f_19600101_fc0003_7_SIM",
              "a34f_19600101_fc0003_9_SIM",
              "a34f_19600101_fc0003_1_SIM",
              "a34f_19600101_fc0003_3_SIM",
              "a34f_19600101_fc0003_4_SIM",
              "a34f_19600101_fc0003_5_SIM",
              "a34f_19600101_fc0003_8_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_POST.20201105110626.err",
          "finish": "2020-11-05 11:10:07",
          "id": "a34f_19600101_fc0002_POST",
          "internal_id": "a34f_19600101_fc0002_POST",
          "label": "a34f_19600101_fc0002_POST",
          "level": 7,
          "member": "fc0002",
          "minutes": 3,
          "minutes_queue": 4,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_POST.20201105110626.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_4_SIM",
              "a34f_19600101_fc0002_5_SIM",
              "a34f_19600101_fc0002_6_SIM",
              "a34f_19600101_fc0002_7_SIM",
              "a34f_19600101_fc0002_10_SIM",
              "a34f_19600101_fc0002_8_SIM",
              "a34f_19600101_fc0002_1_SIM",
              "a34f_19600101_fc0002_2_SIM",
              "a34f_19600101_fc0002_3_SIM",
              "a34f_19600101_fc0002_9_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299436",
          "section": "POST",
          "shape": "square",
          "start": "2020-11-05 11:10:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:35",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -1282.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_2_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:44",
          "id": "a34f_19600101_fc0003_2_SIM",
          "internal_id": "a34f_19600101_fc0003_2_SIM",
          "label": "a34f_19600101_fc0003_2_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 190,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_2_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:34",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:18",
          "wallclock": "00:30",
          "x": 683.748,
          "y": -1192.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0004_9_SIM",
              "a34f_19600101_fc0004_4_SIM",
              "a34f_19600101_fc0004_2_SIM",
              "a34f_19600101_fc0004_5_SIM",
              "a34f_19600101_fc0004_8_SIM",
              "a34f_19600101_fc0004_10_SIM",
              "a34f_19600101_fc0004_1_SIM",
              "a34f_19600101_fc0004_6_SIM",
              "a34f_19600101_fc0004_3_SIM",
              "a34f_19600101_fc0004_7_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_POST.20201105111014.err",
          "finish": "2020-11-05 11:13:45",
          "id": "a34f_19600101_fc0003_POST",
          "internal_id": "a34f_19600101_fc0003_POST",
          "label": "a34f_19600101_fc0003_POST",
          "level": 9,
          "member": "fc0003",
          "minutes": 1,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_POST.20201105111014.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_2_SIM",
              "a34f_19600101_fc0003_6_SIM",
              "a34f_19600101_fc0003_10_SIM",
              "a34f_19600101_fc0003_7_SIM",
              "a34f_19600101_fc0003_9_SIM",
              "a34f_19600101_fc0003_1_SIM",
              "a34f_19600101_fc0003_3_SIM",
              "a34f_19600101_fc0003_4_SIM",
              "a34f_19600101_fc0003_5_SIM",
              "a34f_19600101_fc0003_8_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299604",
          "section": "POST",
          "shape": "square",
          "start": "2020-11-05 11:13:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:20",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -1102.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_9_SIM.20201105111347.err",
          "finish": "2020-11-05 11:17:53",
          "id": "a34f_19600101_fc0004_9_SIM",
          "internal_id": "a34f_19600101_fc0004_9_SIM",
          "label": "a34f_19600101_fc0004_9_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 189,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_9_SIM.20201105111347.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:54",
          "wallclock": "00:30",
          "x": 2594.97,
          "y": -1012.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0005_7_SIM",
              "a34f_19600101_fc0005_6_SIM",
              "a34f_19600101_fc0005_2_SIM",
              "a34f_19600101_fc0005_5_SIM",
              "a34f_19600101_fc0005_1_SIM",
              "a34f_19600101_fc0005_4_SIM",
              "a34f_19600101_fc0005_9_SIM",
              "a34f_19600101_fc0005_8_SIM",
              "a34f_19600101_fc0005_3_SIM",
              "a34f_19600101_fc0005_10_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_POST.20201105111348.err",
          "finish": "2020-11-05 11:17:50",
          "id": "a34f_19600101_fc0004_POST",
          "internal_id": "a34f_19600101_fc0004_POST",
          "label": "a34f_19600101_fc0004_POST",
          "level": 11,
          "member": "fc0004",
          "minutes": 9,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_POST.20201105111348.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_9_SIM",
              "a34f_19600101_fc0004_4_SIM",
              "a34f_19600101_fc0004_2_SIM",
              "a34f_19600101_fc0004_5_SIM",
              "a34f_19600101_fc0004_8_SIM",
              "a34f_19600101_fc0004_10_SIM",
              "a34f_19600101_fc0004_1_SIM",
              "a34f_19600101_fc0004_6_SIM",
              "a34f_19600101_fc0004_3_SIM",
              "a34f_19600101_fc0004_7_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299739",
          "section": "POST",
          "shape": "hexagon",
          "start": "2020-11-05 11:17:41",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:54",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -922.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_7_SIM.20201105111754.err",
          "finish": "2020-11-05 11:22:02",
          "id": "a34f_19600101_fc0005_7_SIM",
          "internal_id": "a34f_19600101_fc0005_7_SIM",
          "label": "a34f_19600101_fc0005_7_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 190,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_7_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:52",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:01",
          "wallclock": "00:30",
          "x": 2046.24,
          "y": -832.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0006_3_SIM",
              "a34f_19600101_fc0006_6_SIM",
              "a34f_19600101_fc0006_8_SIM",
              "a34f_19600101_fc0006_10_SIM",
              "a34f_19600101_fc0006_9_SIM",
              "a34f_19600101_fc0006_1_SIM",
              "a34f_19600101_fc0006_7_SIM",
              "a34f_19600101_fc0006_5_SIM",
              "a34f_19600101_fc0006_4_SIM",
              "a34f_19600101_fc0006_2_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_POST.20201105111755.err",
          "finish": "2020-11-05 11:21:56",
          "id": "a34f_19600101_fc0005_POST",
          "internal_id": "a34f_19600101_fc0005_POST",
          "label": "a34f_19600101_fc0005_POST",
          "level": 13,
          "member": "fc0005",
          "minutes": 3,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_POST.20201105111755.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_7_SIM",
              "a34f_19600101_fc0005_6_SIM",
              "a34f_19600101_fc0005_2_SIM",
              "a34f_19600101_fc0005_5_SIM",
              "a34f_19600101_fc0005_1_SIM",
              "a34f_19600101_fc0005_4_SIM",
              "a34f_19600101_fc0005_9_SIM",
              "a34f_19600101_fc0005_8_SIM",
              "a34f_19600101_fc0005_3_SIM",
              "a34f_19600101_fc0005_10_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12299886",
          "section": "POST",
          "shape": "hexagon",
          "start": "2020-11-05 11:21:53",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:02",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -742.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_3_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:31",
          "id": "a34f_19600101_fc0006_3_SIM",
          "internal_id": "a34f_19600101_fc0006_3_SIM",
          "label": "a34f_19600101_fc0006_3_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 172,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_3_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:39",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:24",
          "wallclock": "00:30",
          "x": 953.7299999999999,
          "y": -652.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0007_6_SIM",
              "a34f_19600101_fc0007_10_SIM",
              "a34f_19600101_fc0007_9_SIM",
              "a34f_19600101_fc0007_5_SIM",
              "a34f_19600101_fc0007_3_SIM",
              "a34f_19600101_fc0007_8_SIM",
              "a34f_19600101_fc0007_7_SIM",
              "a34f_19600101_fc0007_4_SIM",
              "a34f_19600101_fc0007_2_SIM",
              "a34f_19600101_fc0007_1_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_POST.20201105112220.err",
          "finish": "2020-11-05 11:25:34",
          "id": "a34f_19600101_fc0006_POST",
          "internal_id": "a34f_19600101_fc0006_POST",
          "label": "a34f_19600101_fc0006_POST",
          "level": 15,
          "member": "fc0006",
          "minutes": 3,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_POST.20201105112220.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_3_SIM",
              "a34f_19600101_fc0006_6_SIM",
              "a34f_19600101_fc0006_8_SIM",
              "a34f_19600101_fc0006_10_SIM",
              "a34f_19600101_fc0006_9_SIM",
              "a34f_19600101_fc0006_1_SIM",
              "a34f_19600101_fc0006_7_SIM",
              "a34f_19600101_fc0006_5_SIM",
              "a34f_19600101_fc0006_4_SIM",
              "a34f_19600101_fc0006_2_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12300024",
          "section": "POST",
          "shape": "square",
          "start": "2020-11-05 11:25:31",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:26",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -562.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_6_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:50",
          "id": "a34f_19600101_fc0007_6_SIM",
          "internal_id": "a34f_19600101_fc0007_6_SIM",
          "label": "a34f_19600101_fc0007_6_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 186,
          "minutes_queue": 41,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_6_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:03",
          "wallclock": "00:30",
          "x": 1772.4599999999998,
          "y": -472.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0008_7_SIM",
              "a34f_19600101_fc0008_8_SIM",
              "a34f_19600101_fc0008_1_SIM",
              "a34f_19600101_fc0008_2_SIM",
              "a34f_19600101_fc0008_10_SIM",
              "a34f_19600101_fc0008_3_SIM",
              "a34f_19600101_fc0008_4_SIM",
              "a34f_19600101_fc0008_9_SIM",
              "a34f_19600101_fc0008_5_SIM",
              "a34f_19600101_fc0008_6_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_POST.20201105112553.err",
          "finish": "2020-11-05 11:29:47",
          "id": "a34f_19600101_fc0007_POST",
          "internal_id": "a34f_19600101_fc0007_POST",
          "label": "a34f_19600101_fc0007_POST",
          "level": 17,
          "member": "fc0007",
          "minutes": 2,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_POST.20201105112553.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_6_SIM",
              "a34f_19600101_fc0007_10_SIM",
              "a34f_19600101_fc0007_9_SIM",
              "a34f_19600101_fc0007_5_SIM",
              "a34f_19600101_fc0007_3_SIM",
              "a34f_19600101_fc0007_8_SIM",
              "a34f_19600101_fc0007_7_SIM",
              "a34f_19600101_fc0007_4_SIM",
              "a34f_19600101_fc0007_2_SIM",
              "a34f_19600101_fc0007_1_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12300173",
          "section": "POST",
          "shape": "square",
          "start": "2020-11-05 11:29:45",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:05",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -382.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_7_SIM.20201105112952.err",
          "finish": "2020-11-05 11:33:49",
          "id": "a34f_19600101_fc0008_7_SIM",
          "internal_id": "a34f_19600101_fc0008_7_SIM",
          "label": "a34f_19600101_fc0008_7_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 218,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_7_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:57",
          "wallclock": "00:30",
          "x": 2044.98,
          "y": -292.5
      },
      {
          "children": 10,
          "children_list": [
              "a34f_19600101_fc0009_5_SIM",
              "a34f_19600101_fc0009_6_SIM",
              "a34f_19600101_fc0009_9_SIM",
              "a34f_19600101_fc0009_7_SIM",
              "a34f_19600101_fc0009_8_SIM",
              "a34f_19600101_fc0009_1_SIM",
              "a34f_19600101_fc0009_2_SIM",
              "a34f_19600101_fc0009_3_SIM",
              "a34f_19600101_fc0009_4_SIM",
              "a34f_19600101_fc0009_10_SIM"
          ],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_POST.20201105112952.err",
          "finish": "2020-11-05 11:33:57",
          "id": "a34f_19600101_fc0008_POST",
          "internal_id": "a34f_19600101_fc0008_POST",
          "label": "a34f_19600101_fc0008_POST",
          "level": 19,
          "member": "fc0008",
          "minutes": 11,
          "minutes_queue": 0,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_POST.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_7_SIM",
              "a34f_19600101_fc0008_8_SIM",
              "a34f_19600101_fc0008_1_SIM",
              "a34f_19600101_fc0008_2_SIM",
              "a34f_19600101_fc0008_10_SIM",
              "a34f_19600101_fc0008_3_SIM",
              "a34f_19600101_fc0008_4_SIM",
              "a34f_19600101_fc0008_9_SIM",
              "a34f_19600101_fc0008_5_SIM",
              "a34f_19600101_fc0008_6_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12300291",
          "section": "POST",
          "shape": "hexagon",
          "start": "2020-11-05 11:33:46",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:58",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -202.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_5_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:13",
          "id": "a34f_19600101_fc0009_5_SIM",
          "internal_id": "a34f_19600101_fc0009_5_SIM",
          "label": "a34f_19600101_fc0009_5_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 188,
          "minutes_queue": 53,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_5_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:12",
          "wallclock": "00:30",
          "x": 1501.2900000000002,
          "y": -112.5
      },
      {
          "children": 0,
          "children_list": [],
          "chunk": null,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 01 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_POST.20201105113406.err",
          "finish": "2020-11-05 11:38:20",
          "id": "a34f_19600101_fc0009_POST",
          "internal_id": "a34f_19600101_fc0009_POST",
          "label": "a34f_19600101_fc0009_POST",
          "level": 21,
          "member": "fc0009",
          "minutes": 2,
          "minutes_queue": 2,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_POST.20201105113406.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0009_5_SIM",
              "a34f_19600101_fc0009_6_SIM",
              "a34f_19600101_fc0009_9_SIM",
              "a34f_19600101_fc0009_7_SIM",
              "a34f_19600101_fc0009_8_SIM",
              "a34f_19600101_fc0009_1_SIM",
              "a34f_19600101_fc0009_2_SIM",
              "a34f_19600101_fc0009_3_SIM",
              "a34f_19600101_fc0009_4_SIM",
              "a34f_19600101_fc0009_10_SIM"
          ],
          "parents": 10,
          "platform_name": null,
          "priority": 2,
          "processors": "1",
          "rm_id": "12300483",
          "section": "POST",
          "shape": "hexagon",
          "start": "2020-11-05 11:38:18",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:15",
          "wallclock": "00:05",
          "x": 1363.77,
          "y": -22.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_6_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:14",
          "id": "a34f_19600101_fc0009_6_SIM",
          "internal_id": "a34f_19600101_fc0009_6_SIM",
          "label": "a34f_19600101_fc0009_6_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 189,
          "minutes_queue": 53,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_6_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:12",
          "wallclock": "00:30",
          "x": 1773.7199999999998,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_9_SIM.20201105113405.err",
          "finish": "2020-11-05 11:38:17",
          "id": "a34f_19600101_fc0009_9_SIM",
          "internal_id": "a34f_19600101_fc0009_9_SIM",
          "label": "a34f_19600101_fc0009_9_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 192,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_9_SIM.20201105113405.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:13",
          "wallclock": "00:30",
          "x": 2591.28,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_7_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:15",
          "id": "a34f_19600101_fc0009_7_SIM",
          "internal_id": "a34f_19600101_fc0009_7_SIM",
          "label": "a34f_19600101_fc0009_7_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 190,
          "minutes_queue": 53,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_7_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:12",
          "wallclock": "00:30",
          "x": 2046.24,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_8_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:16",
          "id": "a34f_19600101_fc0009_8_SIM",
          "internal_id": "a34f_19600101_fc0009_8_SIM",
          "label": "a34f_19600101_fc0009_8_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 191,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_8_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:13",
          "wallclock": "00:30",
          "x": 2318.7599999999998,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_1_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:10",
          "id": "a34f_19600101_fc0009_1_SIM",
          "internal_id": "a34f_19600101_fc0009_1_SIM",
          "label": "a34f_19600101_fc0009_1_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 185,
          "minutes_queue": 55,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_1_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:10",
          "wallclock": "00:30",
          "x": 408.753,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_2_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:31",
          "id": "a34f_19600101_fc0009_2_SIM",
          "internal_id": "a34f_19600101_fc0009_2_SIM",
          "label": "a34f_19600101_fc0009_2_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 206,
          "minutes_queue": 55,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_2_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:10",
          "wallclock": "00:30",
          "x": 681.246,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_3_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:11",
          "id": "a34f_19600101_fc0009_3_SIM",
          "internal_id": "a34f_19600101_fc0009_3_SIM",
          "label": "a34f_19600101_fc0009_3_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 186,
          "minutes_queue": 54,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_3_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:11",
          "wallclock": "00:30",
          "x": 953.7299999999999,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_4_SIM.20201105113404.err",
          "finish": "2020-11-05 11:38:12",
          "id": "a34f_19600101_fc0009_4_SIM",
          "internal_id": "a34f_19600101_fc0009_4_SIM",
          "label": "a34f_19600101_fc0009_4_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 187,
          "minutes_queue": 53,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_4_SIM.20201105113404.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:12",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0009_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_10_SIM.20201105113405.err",
          "finish": "2020-11-05 11:38:19",
          "id": "a34f_19600101_fc0009_10_SIM",
          "internal_id": "a34f_19600101_fc0009_10_SIM",
          "label": "a34f_19600101_fc0009_10_SIM",
          "level": 20,
          "member": "fc0009",
          "minutes": 194,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0009_10_SIM.20201105113405.out",
          "package": "a34f_ASThread_16045724436396_10_11",
          "parent_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300483",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:35:05",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:34:14",
          "wallclock": "00:30",
          "x": 131.24699999999999,
          "y": -112.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_8_SIM.20201105112952.err",
          "finish": "2020-11-05 11:33:50",
          "id": "a34f_19600101_fc0008_8_SIM",
          "internal_id": "a34f_19600101_fc0008_8_SIM",
          "label": "a34f_19600101_fc0008_8_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 219,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_8_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:57",
          "wallclock": "00:30",
          "x": 2316.2400000000002,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_1_SIM.20201105112951.err",
          "finish": "2020-11-05 11:33:42",
          "id": "a34f_19600101_fc0008_1_SIM",
          "internal_id": "a34f_19600101_fc0008_1_SIM",
          "label": "a34f_19600101_fc0008_1_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 211,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_1_SIM.20201105112951.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:56",
          "wallclock": "00:30",
          "x": 412.497,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_2_SIM.20201105112951.err",
          "finish": "2020-11-05 11:33:43",
          "id": "a34f_19600101_fc0008_2_SIM",
          "internal_id": "a34f_19600101_fc0008_2_SIM",
          "label": "a34f_19600101_fc0008_2_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 212,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_2_SIM.20201105112951.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:56",
          "wallclock": "00:30",
          "x": 683.748,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_10_SIM.20201105112952.err",
          "finish": "2020-11-05 11:34:03",
          "id": "a34f_19600101_fc0008_10_SIM",
          "internal_id": "a34f_19600101_fc0008_10_SIM",
          "label": "a34f_19600101_fc0008_10_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 232,
          "minutes_queue": 13,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_10_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:58",
          "wallclock": "00:30",
          "x": 136.251,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_3_SIM.20201105112951.err",
          "finish": "2020-11-05 11:33:44",
          "id": "a34f_19600101_fc0008_3_SIM",
          "internal_id": "a34f_19600101_fc0008_3_SIM",
          "label": "a34f_19600101_fc0008_3_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 213,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_3_SIM.20201105112951.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:56",
          "wallclock": "00:30",
          "x": 954.99,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_4_SIM.20201105112951.err",
          "finish": "2020-11-05 11:33:45",
          "id": "a34f_19600101_fc0008_4_SIM",
          "internal_id": "a34f_19600101_fc0008_4_SIM",
          "label": "a34f_19600101_fc0008_4_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 214,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_4_SIM.20201105112951.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:56",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_9_SIM.20201105112952.err",
          "finish": "2020-11-05 11:33:51",
          "id": "a34f_19600101_fc0008_9_SIM",
          "internal_id": "a34f_19600101_fc0008_9_SIM",
          "label": "a34f_19600101_fc0008_9_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 220,
          "minutes_queue": 13,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_9_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:58",
          "wallclock": "00:30",
          "x": 2588.7599999999998,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_5_SIM.20201105112952.err",
          "finish": "2020-11-05 11:33:47",
          "id": "a34f_19600101_fc0008_5_SIM",
          "internal_id": "a34f_19600101_fc0008_5_SIM",
          "label": "a34f_19600101_fc0008_5_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 216,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_5_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:57",
          "wallclock": "00:30",
          "x": 1500.0300000000002,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0008_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_6_SIM.20201105112952.err",
          "finish": "2020-11-05 11:33:48",
          "id": "a34f_19600101_fc0008_6_SIM",
          "internal_id": "a34f_19600101_fc0008_6_SIM",
          "label": "a34f_19600101_fc0008_6_SIM",
          "level": 18,
          "member": "fc0008",
          "minutes": 217,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0008_6_SIM.20201105112952.out",
          "package": "a34f_ASThread_16045721911220_10_11",
          "parent_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300291",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:30:11",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:29:57",
          "wallclock": "00:30",
          "x": 1772.4599999999998,
          "y": -292.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_10_SIM.20201105112553.err",
          "finish": "2020-11-05 11:29:50",
          "id": "a34f_19600101_fc0007_10_SIM",
          "internal_id": "a34f_19600101_fc0007_10_SIM",
          "label": "a34f_19600101_fc0007_10_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 41,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_10_SIM.20201105112553.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:45",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:04",
          "wallclock": "00:30",
          "x": 136.251,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_9_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:50",
          "id": "a34f_19600101_fc0007_9_SIM",
          "internal_id": "a34f_19600101_fc0007_9_SIM",
          "label": "a34f_19600101_fc0007_9_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 41,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_9_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:45",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:04",
          "wallclock": "00:30",
          "x": 2588.7599999999998,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_5_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:49",
          "id": "a34f_19600101_fc0007_5_SIM",
          "internal_id": "a34f_19600101_fc0007_5_SIM",
          "label": "a34f_19600101_fc0007_5_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 44,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_5_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:00",
          "wallclock": "00:30",
          "x": 1500.0300000000002,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_3_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:49",
          "id": "a34f_19600101_fc0007_3_SIM",
          "internal_id": "a34f_19600101_fc0007_3_SIM",
          "label": "a34f_19600101_fc0007_3_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 47,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_3_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:25:57",
          "wallclock": "00:30",
          "x": 954.99,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_8_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:50",
          "id": "a34f_19600101_fc0007_8_SIM",
          "internal_id": "a34f_19600101_fc0007_8_SIM",
          "label": "a34f_19600101_fc0007_8_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 186,
          "minutes_queue": 40,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_8_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:04",
          "wallclock": "00:30",
          "x": 2316.2400000000002,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_7_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:50",
          "id": "a34f_19600101_fc0007_7_SIM",
          "internal_id": "a34f_19600101_fc0007_7_SIM",
          "label": "a34f_19600101_fc0007_7_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 186,
          "minutes_queue": 40,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_7_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:26:04",
          "wallclock": "00:30",
          "x": 2044.98,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_4_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:49",
          "id": "a34f_19600101_fc0007_4_SIM",
          "internal_id": "a34f_19600101_fc0007_4_SIM",
          "label": "a34f_19600101_fc0007_4_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 46,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_4_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:25:58",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_2_SIM.20201105112552.err",
          "finish": "2020-11-05 11:29:49",
          "id": "a34f_19600101_fc0007_2_SIM",
          "internal_id": "a34f_19600101_fc0007_2_SIM",
          "label": "a34f_19600101_fc0007_2_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 186,
          "minutes_queue": 46,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_2_SIM.20201105112552.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:25:57",
          "wallclock": "00:30",
          "x": 683.748,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0007_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_1_SIM.20201105112551.err",
          "finish": "2020-11-05 11:29:48",
          "id": "a34f_19600101_fc0007_1_SIM",
          "internal_id": "a34f_19600101_fc0007_1_SIM",
          "label": "a34f_19600101_fc0007_1_SIM",
          "level": 16,
          "member": "fc0007",
          "minutes": 185,
          "minutes_queue": 47,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0007_1_SIM.20201105112551.out",
          "package": "a34f_ASThread_16045719512820_10_11",
          "parent_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300173",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:26:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:25:56",
          "wallclock": "00:30",
          "x": 412.497,
          "y": -472.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_6_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:34",
          "id": "a34f_19600101_fc0006_6_SIM",
          "internal_id": "a34f_19600101_fc0006_6_SIM",
          "label": "a34f_19600101_fc0006_6_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 174,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_6_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:25",
          "wallclock": "00:30",
          "x": 1773.7199999999998,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_8_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:36",
          "id": "a34f_19600101_fc0006_8_SIM",
          "internal_id": "a34f_19600101_fc0006_8_SIM",
          "label": "a34f_19600101_fc0006_8_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 176,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_8_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:26",
          "wallclock": "00:30",
          "x": 2318.7599999999998,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_10_SIM.20201105112220.err",
          "finish": "2020-11-05 11:25:39",
          "id": "a34f_19600101_fc0006_10_SIM",
          "internal_id": "a34f_19600101_fc0006_10_SIM",
          "label": "a34f_19600101_fc0006_10_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 179,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_10_SIM.20201105112220.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:26",
          "wallclock": "00:30",
          "x": 131.24699999999999,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_9_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:38",
          "id": "a34f_19600101_fc0006_9_SIM",
          "internal_id": "a34f_19600101_fc0006_9_SIM",
          "label": "a34f_19600101_fc0006_9_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 178,
          "minutes_queue": 14,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_9_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:26",
          "wallclock": "00:30",
          "x": 2591.28,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_1_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:51",
          "id": "a34f_19600101_fc0006_1_SIM",
          "internal_id": "a34f_19600101_fc0006_1_SIM",
          "label": "a34f_19600101_fc0006_1_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 192,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_1_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:39",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:23",
          "wallclock": "00:30",
          "x": 408.753,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_7_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:35",
          "id": "a34f_19600101_fc0006_7_SIM",
          "internal_id": "a34f_19600101_fc0006_7_SIM",
          "label": "a34f_19600101_fc0006_7_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 175,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_7_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:25",
          "wallclock": "00:30",
          "x": 2046.24,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_5_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:33",
          "id": "a34f_19600101_fc0006_5_SIM",
          "internal_id": "a34f_19600101_fc0006_5_SIM",
          "label": "a34f_19600101_fc0006_5_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 173,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_5_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:40",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:24",
          "wallclock": "00:30",
          "x": 1501.2900000000002,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_4_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:32",
          "id": "a34f_19600101_fc0006_4_SIM",
          "internal_id": "a34f_19600101_fc0006_4_SIM",
          "label": "a34f_19600101_fc0006_4_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 173,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_4_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:39",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:24",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0006_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_2_SIM.20201105112219.err",
          "finish": "2020-11-05 11:25:30",
          "id": "a34f_19600101_fc0006_2_SIM",
          "internal_id": "a34f_19600101_fc0006_2_SIM",
          "label": "a34f_19600101_fc0006_2_SIM",
          "level": 14,
          "member": "fc0006",
          "minutes": 171,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0006_2_SIM.20201105112219.out",
          "package": "a34f_ASThread_16045717386367_10_11",
          "parent_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12300024",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:22:39",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:22:23",
          "wallclock": "00:30",
          "x": 681.246,
          "y": -652.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_6_SIM.20201105111754.err",
          "finish": "2020-11-05 11:22:01",
          "id": "a34f_19600101_fc0005_6_SIM",
          "internal_id": "a34f_19600101_fc0005_6_SIM",
          "label": "a34f_19600101_fc0005_6_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 189,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_6_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:52",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:01",
          "wallclock": "00:30",
          "x": 1773.7199999999998,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_2_SIM.20201105111754.err",
          "finish": "2020-11-05 11:21:57",
          "id": "a34f_19600101_fc0005_2_SIM",
          "internal_id": "a34f_19600101_fc0005_2_SIM",
          "label": "a34f_19600101_fc0005_2_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 186,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_2_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:51",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:17:59",
          "wallclock": "00:30",
          "x": 681.246,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_5_SIM.20201105111754.err",
          "finish": "2020-11-05 11:22:00",
          "id": "a34f_19600101_fc0005_5_SIM",
          "internal_id": "a34f_19600101_fc0005_5_SIM",
          "label": "a34f_19600101_fc0005_5_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 189,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_5_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:51",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:00",
          "wallclock": "00:30",
          "x": 1501.2900000000002,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_1_SIM.20201105111754.err",
          "finish": "2020-11-05 11:21:56",
          "id": "a34f_19600101_fc0005_1_SIM",
          "internal_id": "a34f_19600101_fc0005_1_SIM",
          "label": "a34f_19600101_fc0005_1_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 185,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_1_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:51",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:17:59",
          "wallclock": "00:30",
          "x": 408.753,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_4_SIM.20201105111754.err",
          "finish": "2020-11-05 11:21:59",
          "id": "a34f_19600101_fc0005_4_SIM",
          "internal_id": "a34f_19600101_fc0005_4_SIM",
          "label": "a34f_19600101_fc0005_4_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 188,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_4_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:51",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:17:59",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_9_SIM.20201105111755.err",
          "finish": "2020-11-05 11:22:04",
          "id": "a34f_19600101_fc0005_9_SIM",
          "internal_id": "a34f_19600101_fc0005_9_SIM",
          "label": "a34f_19600101_fc0005_9_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 192,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_9_SIM.20201105111755.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:52",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:02",
          "wallclock": "00:30",
          "x": 2591.28,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_8_SIM.20201105111754.err",
          "finish": "2020-11-05 11:22:03",
          "id": "a34f_19600101_fc0005_8_SIM",
          "internal_id": "a34f_19600101_fc0005_8_SIM",
          "label": "a34f_19600101_fc0005_8_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 191,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_8_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:52",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:01",
          "wallclock": "00:30",
          "x": 2318.7599999999998,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_3_SIM.20201105111754.err",
          "finish": "2020-11-05 11:21:58",
          "id": "a34f_19600101_fc0005_3_SIM",
          "internal_id": "a34f_19600101_fc0005_3_SIM",
          "label": "a34f_19600101_fc0005_3_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 187,
          "minutes_queue": 52,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_3_SIM.20201105111754.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:51",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:17:59",
          "wallclock": "00:30",
          "x": 953.7299999999999,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0005_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_10_SIM.20201105111755.err",
          "finish": "2020-11-05 11:22:05",
          "id": "a34f_19600101_fc0005_10_SIM",
          "internal_id": "a34f_19600101_fc0005_10_SIM",
          "label": "a34f_19600101_fc0005_10_SIM",
          "level": 12,
          "member": "fc0005",
          "minutes": 193,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0005_10_SIM.20201105111755.out",
          "package": "a34f_ASThread_16045714733746_10_11",
          "parent_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299886",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:18:52",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:18:02",
          "wallclock": "00:30",
          "x": 131.24699999999999,
          "y": -832.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_4_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:36",
          "id": "a34f_19600101_fc0004_4_SIM",
          "internal_id": "a34f_19600101_fc0004_4_SIM",
          "label": "a34f_19600101_fc0004_4_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 173,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_4_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:52",
          "wallclock": "00:30",
          "x": 1226.25,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_2_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:35",
          "id": "a34f_19600101_fc0004_2_SIM",
          "internal_id": "a34f_19600101_fc0004_2_SIM",
          "label": "a34f_19600101_fc0004_2_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 172,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_2_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:52",
          "wallclock": "00:30",
          "x": 680.004,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_5_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:37",
          "id": "a34f_19600101_fc0004_5_SIM",
          "internal_id": "a34f_19600101_fc0004_5_SIM",
          "label": "a34f_19600101_fc0004_5_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 174,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_5_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:52",
          "wallclock": "00:30",
          "x": 1501.2900000000002,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_8_SIM.20201105111347.err",
          "finish": "2020-11-05 11:17:39",
          "id": "a34f_19600101_fc0004_8_SIM",
          "internal_id": "a34f_19600101_fc0004_8_SIM",
          "label": "a34f_19600101_fc0004_8_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 175,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_8_SIM.20201105111347.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:53",
          "wallclock": "00:30",
          "x": 2321.28,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_10_SIM.20201105111347.err",
          "finish": "2020-11-05 11:17:40",
          "id": "a34f_19600101_fc0004_10_SIM",
          "internal_id": "a34f_19600101_fc0004_10_SIM",
          "label": "a34f_19600101_fc0004_10_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 176,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_10_SIM.20201105111347.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:54",
          "wallclock": "00:30",
          "x": 129.99599999999998,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_1_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:52",
          "id": "a34f_19600101_fc0004_1_SIM",
          "internal_id": "a34f_19600101_fc0004_1_SIM",
          "label": "a34f_19600101_fc0004_1_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 189,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_1_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:52",
          "wallclock": "00:30",
          "x": 407.502,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_6_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:53",
          "id": "a34f_19600101_fc0004_6_SIM",
          "internal_id": "a34f_19600101_fc0004_6_SIM",
          "label": "a34f_19600101_fc0004_6_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 189,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_6_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:53",
          "wallclock": "00:30",
          "x": 1774.98,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_3_SIM.20201105111345.err",
          "finish": "2020-11-05 11:17:53",
          "id": "a34f_19600101_fc0004_3_SIM",
          "internal_id": "a34f_19600101_fc0004_3_SIM",
          "label": "a34f_19600101_fc0004_3_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 190,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_3_SIM.20201105111345.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:43",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:52",
          "wallclock": "00:30",
          "x": 952.47,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0004_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_7_SIM.20201105111347.err",
          "finish": "2020-11-05 11:17:38",
          "id": "a34f_19600101_fc0004_7_SIM",
          "internal_id": "a34f_19600101_fc0004_7_SIM",
          "label": "a34f_19600101_fc0004_7_SIM",
          "level": 10,
          "member": "fc0004",
          "minutes": 174,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0004_7_SIM.20201105111347.out",
          "package": "a34f_ASThread_1604571225486_10_11",
          "parent_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299739",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 11:14:44",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:13:53",
          "wallclock": "00:30",
          "x": 2048.7599999999998,
          "y": -1012.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_6_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:29",
          "id": "a34f_19600101_fc0003_6_SIM",
          "internal_id": "a34f_19600101_fc0003_6_SIM",
          "label": "a34f_19600101_fc0003_6_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 174,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_6_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:19",
          "wallclock": "00:30",
          "x": 1772.4599999999998,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_10_SIM.20201105111014.err",
          "finish": "2020-11-05 11:13:32",
          "id": "a34f_19600101_fc0003_10_SIM",
          "internal_id": "a34f_19600101_fc0003_10_SIM",
          "label": "a34f_19600101_fc0003_10_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 177,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_10_SIM.20201105111014.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:20",
          "wallclock": "00:30",
          "x": 136.251,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_7_SIM.20201105111014.err",
          "finish": "2020-11-05 11:13:44",
          "id": "a34f_19600101_fc0003_7_SIM",
          "internal_id": "a34f_19600101_fc0003_7_SIM",
          "label": "a34f_19600101_fc0003_7_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 189,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_7_SIM.20201105111014.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:19",
          "wallclock": "00:30",
          "x": 2044.98,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_9_SIM.20201105111014.err",
          "finish": "2020-11-05 11:13:31",
          "id": "a34f_19600101_fc0003_9_SIM",
          "internal_id": "a34f_19600101_fc0003_9_SIM",
          "label": "a34f_19600101_fc0003_9_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 176,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_9_SIM.20201105111014.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:20",
          "wallclock": "00:30",
          "x": 2588.7599999999998,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_1_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:26",
          "id": "a34f_19600101_fc0003_1_SIM",
          "internal_id": "a34f_19600101_fc0003_1_SIM",
          "label": "a34f_19600101_fc0003_1_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 172,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_1_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:34",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:18",
          "wallclock": "00:30",
          "x": 412.497,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_3_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:44",
          "id": "a34f_19600101_fc0003_3_SIM",
          "internal_id": "a34f_19600101_fc0003_3_SIM",
          "label": "a34f_19600101_fc0003_3_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 190,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_3_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:34",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:18",
          "wallclock": "00:30",
          "x": 954.99,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_4_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:27",
          "id": "a34f_19600101_fc0003_4_SIM",
          "internal_id": "a34f_19600101_fc0003_4_SIM",
          "label": "a34f_19600101_fc0003_4_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 173,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_4_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:34",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:18",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_5_SIM.20201105111013.err",
          "finish": "2020-11-05 11:13:28",
          "id": "a34f_19600101_fc0003_5_SIM",
          "internal_id": "a34f_19600101_fc0003_5_SIM",
          "label": "a34f_19600101_fc0003_5_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 173,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_5_SIM.20201105111013.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:19",
          "wallclock": "00:30",
          "x": 1500.0300000000002,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0003_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_8_SIM.20201105111014.err",
          "finish": "2020-11-05 11:13:30",
          "id": "a34f_19600101_fc0003_8_SIM",
          "internal_id": "a34f_19600101_fc0003_8_SIM",
          "label": "a34f_19600101_fc0003_8_SIM",
          "level": 8,
          "member": "fc0003",
          "minutes": 175,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0003_8_SIM.20201105111014.out",
          "package": "a34f_ASThread_16045710138880_10_11",
          "parent_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299604",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:10:35",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:10:19",
          "wallclock": "00:30",
          "x": 2316.2400000000002,
          "y": -1192.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_5_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:56",
          "id": "a34f_19600101_fc0002_5_SIM",
          "internal_id": "a34f_19600101_fc0002_5_SIM",
          "label": "a34f_19600101_fc0002_5_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 188,
          "minutes_queue": 17,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_5_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:31",
          "wallclock": "00:30",
          "x": 1500.0300000000002,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_6_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:57",
          "id": "a34f_19600101_fc0002_6_SIM",
          "internal_id": "a34f_19600101_fc0002_6_SIM",
          "label": "a34f_19600101_fc0002_6_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 189,
          "minutes_queue": 17,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_6_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:31",
          "wallclock": "00:30",
          "x": 1772.4599999999998,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_7_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:58",
          "id": "a34f_19600101_fc0002_7_SIM",
          "internal_id": "a34f_19600101_fc0002_7_SIM",
          "label": "a34f_19600101_fc0002_7_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 190,
          "minutes_queue": 17,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_7_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:31",
          "wallclock": "00:30",
          "x": 2044.98,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_10_SIM.20201105110626.err",
          "finish": "2020-11-05 11:10:12",
          "id": "a34f_19600101_fc0002_10_SIM",
          "internal_id": "a34f_19600101_fc0002_10_SIM",
          "label": "a34f_19600101_fc0002_10_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 204,
          "minutes_queue": 15,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_10_SIM.20201105110626.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:33",
          "wallclock": "00:30",
          "x": 136.251,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_8_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:59",
          "id": "a34f_19600101_fc0002_8_SIM",
          "internal_id": "a34f_19600101_fc0002_8_SIM",
          "label": "a34f_19600101_fc0002_8_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 191,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_8_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:32",
          "wallclock": "00:30",
          "x": 2316.2400000000002,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_1_SIM.20201105110624.err",
          "finish": "2020-11-05 11:09:52",
          "id": "a34f_19600101_fc0002_1_SIM",
          "internal_id": "a34f_19600101_fc0002_1_SIM",
          "label": "a34f_19600101_fc0002_1_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 185,
          "minutes_queue": 18,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_1_SIM.20201105110624.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:47",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:29",
          "wallclock": "00:30",
          "x": 412.497,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_2_SIM.20201105110624.err",
          "finish": "2020-11-05 11:09:53",
          "id": "a34f_19600101_fc0002_2_SIM",
          "internal_id": "a34f_19600101_fc0002_2_SIM",
          "label": "a34f_19600101_fc0002_2_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 186,
          "minutes_queue": 17,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_2_SIM.20201105110624.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:47",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:30",
          "wallclock": "00:30",
          "x": 683.748,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_3_SIM.20201105110625.err",
          "finish": "2020-11-05 11:09:54",
          "id": "a34f_19600101_fc0002_3_SIM",
          "internal_id": "a34f_19600101_fc0002_3_SIM",
          "label": "a34f_19600101_fc0002_3_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 186,
          "minutes_queue": 18,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_3_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:30",
          "wallclock": "00:30",
          "x": 954.99,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0002_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_9_SIM.20201105110625.err",
          "finish": "2020-11-05 11:10:00",
          "id": "a34f_19600101_fc0002_9_SIM",
          "internal_id": "a34f_19600101_fc0002_9_SIM",
          "label": "a34f_19600101_fc0002_9_SIM",
          "level": 6,
          "member": "fc0002",
          "minutes": 192,
          "minutes_queue": 16,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0002_9_SIM.20201105110625.out",
          "package": "a34f_ASThread_16045707844635_10_11",
          "parent_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299436",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:06:48",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:06:32",
          "wallclock": "00:30",
          "x": 2588.7599999999998,
          "y": -1372.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_7_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:08",
          "id": "a34f_19600101_fc0001_7_SIM",
          "internal_id": "a34f_19600101_fc0001_7_SIM",
          "label": "a34f_19600101_fc0001_7_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 184,
          "minutes_queue": 26,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_7_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:38",
          "wallclock": "00:30",
          "x": 2044.98,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_10_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:11",
          "id": "a34f_19600101_fc0001_10_SIM",
          "internal_id": "a34f_19600101_fc0001_10_SIM",
          "label": "a34f_19600101_fc0001_10_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 187,
          "minutes_queue": 25,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_10_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:39",
          "wallclock": "00:30",
          "x": 136.251,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_8_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:09",
          "id": "a34f_19600101_fc0001_8_SIM",
          "internal_id": "a34f_19600101_fc0001_8_SIM",
          "label": "a34f_19600101_fc0001_8_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 185,
          "minutes_queue": 26,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_8_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:38",
          "wallclock": "00:30",
          "x": 2316.2400000000002,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 1,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 01 01",
          "date_plus": "1960 02 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_1_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:24",
          "id": "a34f_19600101_fc0001_1_SIM",
          "internal_id": "a34f_19600101_fc0001_1_SIM",
          "label": "a34f_19600101_fc0001_1_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 200,
          "minutes_queue": 27,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_1_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:37",
          "wallclock": "00:30",
          "x": 412.497,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_9_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:10",
          "id": "a34f_19600101_fc0001_9_SIM",
          "internal_id": "a34f_19600101_fc0001_9_SIM",
          "label": "a34f_19600101_fc0001_9_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 186,
          "minutes_queue": 25,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_9_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:39",
          "wallclock": "00:30",
          "x": 2588.7599999999998,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_2_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:04",
          "id": "a34f_19600101_fc0001_2_SIM",
          "internal_id": "a34f_19600101_fc0001_2_SIM",
          "label": "a34f_19600101_fc0001_2_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 180,
          "minutes_queue": 27,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_2_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:37",
          "wallclock": "00:30",
          "x": 683.748,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_3_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:05",
          "id": "a34f_19600101_fc0001_3_SIM",
          "internal_id": "a34f_19600101_fc0001_3_SIM",
          "label": "a34f_19600101_fc0001_3_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 181,
          "minutes_queue": 27,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_3_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:37",
          "wallclock": "00:30",
          "x": 954.99,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_4_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:06",
          "id": "a34f_19600101_fc0001_4_SIM",
          "internal_id": "a34f_19600101_fc0001_4_SIM",
          "label": "a34f_19600101_fc0001_4_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 182,
          "minutes_queue": 27,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_4_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:37",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0001_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_5_SIM.20201105110232.err",
          "finish": "2020-11-05 11:06:24",
          "id": "a34f_19600101_fc0001_5_SIM",
          "internal_id": "a34f_19600101_fc0001_5_SIM",
          "label": "a34f_19600101_fc0001_5_SIM",
          "level": 4,
          "member": "fc0001",
          "minutes": 200,
          "minutes_queue": 26,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0001_5_SIM.20201105110232.out",
          "package": "a34f_ASThread_16045705526000_10_11",
          "parent_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299307",
          "section": "SIM",
          "shape": "square",
          "start": "2020-11-05 11:03:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 11:02:38",
          "wallclock": "00:30",
          "x": 1500.0300000000002,
          "y": -1552.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 2,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 02 01",
          "date_plus": "1960 03 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_2_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:08",
          "id": "a34f_19600101_fc0000_2_SIM",
          "internal_id": "a34f_19600101_fc0000_2_SIM",
          "label": "a34f_19600101_fc0000_2_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 185,
          "minutes_queue": 51,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_2_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:12",
          "wallclock": "00:30",
          "x": 681.246,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 3,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 03 01",
          "date_plus": "1960 04 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_3_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:09",
          "id": "a34f_19600101_fc0000_3_SIM",
          "internal_id": "a34f_19600101_fc0000_3_SIM",
          "label": "a34f_19600101_fc0000_3_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 186,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_3_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:13",
          "wallclock": "00:30",
          "x": 953.7299999999999,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 4,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 04 01",
          "date_plus": "1960 05 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_4_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:14",
          "id": "a34f_19600101_fc0000_4_SIM",
          "internal_id": "a34f_19600101_fc0000_4_SIM",
          "label": "a34f_19600101_fc0000_4_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 191,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_4_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:13",
          "wallclock": "00:30",
          "x": 1227.51,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 5,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 05 01",
          "date_plus": "1960 06 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_5_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:15",
          "id": "a34f_19600101_fc0000_5_SIM",
          "internal_id": "a34f_19600101_fc0000_5_SIM",
          "label": "a34f_19600101_fc0000_5_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 192,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_5_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:13",
          "wallclock": "00:30",
          "x": 1501.2900000000002,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 6,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 06 01",
          "date_plus": "1960 07 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_6_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:16",
          "id": "a34f_19600101_fc0000_6_SIM",
          "internal_id": "a34f_19600101_fc0000_6_SIM",
          "label": "a34f_19600101_fc0000_6_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 193,
          "minutes_queue": 49,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_6_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:14",
          "wallclock": "00:30",
          "x": 1773.7199999999998,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 7,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 07 01",
          "date_plus": "1960 08 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_7_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:17",
          "id": "a34f_19600101_fc0000_7_SIM",
          "internal_id": "a34f_19600101_fc0000_7_SIM",
          "label": "a34f_19600101_fc0000_7_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 194,
          "minutes_queue": 49,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_7_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:14",
          "wallclock": "00:30",
          "x": 2046.24,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 8,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 08 01",
          "date_plus": "1960 09 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_8_SIM.20201105105808.err",
          "finish": "2020-11-05 11:02:31",
          "id": "a34f_19600101_fc0000_8_SIM",
          "internal_id": "a34f_19600101_fc0000_8_SIM",
          "label": "a34f_19600101_fc0000_8_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 208,
          "minutes_queue": 49,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_8_SIM.20201105105808.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:03",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:14",
          "wallclock": "00:30",
          "x": 2318.7599999999998,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 9,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 09 01",
          "date_plus": "1960 10 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_9_SIM.20201105105809.err",
          "finish": "2020-11-05 11:02:18",
          "id": "a34f_19600101_fc0000_9_SIM",
          "internal_id": "a34f_19600101_fc0000_9_SIM",
          "label": "a34f_19600101_fc0000_9_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 194,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_9_SIM.20201105105809.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:14",
          "wallclock": "00:30",
          "x": 2591.28,
          "y": -1732.5
      },
      {
          "children": 1,
          "children_list": [
              "a34f_19600101_fc0000_POST"
          ],
          "chunk": 10,
          "custom_directives": [],
          "dashed": true,
          "date": "1960 10 01",
          "date_plus": "1960 11 01",
          "err": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_10_SIM.20201105105809.err",
          "finish": "2020-11-05 11:02:19",
          "id": "a34f_19600101_fc0000_10_SIM",
          "internal_id": "a34f_19600101_fc0000_10_SIM",
          "label": "a34f_19600101_fc0000_10_SIM",
          "level": 2,
          "member": "fc0000",
          "minutes": 195,
          "minutes_queue": 50,
          "out": "/esarchive/autosubmit/a34f/tmp/LOG_a34f/a34f_19600101_fc0000_10_SIM.20201105105809.out",
          "package": "a34f_ASThread_16045702873109_10_11",
          "parent_list": [
              "a34f_INI"
          ],
          "parents": 1,
          "platform_name": null,
          "priority": 1,
          "processors": "1",
          "rm_id": "12299173",
          "section": "SIM",
          "shape": "hexagon",
          "start": "2020-11-05 10:59:04",
          "status": "COMPLETED",
          "status_code": 5,
          "status_color": "yellow",
          "submit": "2020-11-05 10:58:14",
          "wallclock": "00:30",
          "x": 131.24699999999999,
          "y": -1732.5
      }
  ],
  "packages": {
      "a34f_ASThread_16045702873109_10_11": [
          "a34f_19600101_fc0000_5_SIM",
          "a34f_19600101_fc0000_POST",
          "a34f_19600101_fc0000_4_SIM",
          "a34f_19600101_fc0000_3_SIM",
          "a34f_19600101_fc0000_6_SIM",
          "a34f_19600101_fc0000_10_SIM",
          "a34f_19600101_fc0000_1_SIM",
          "a34f_19600101_fc0000_2_SIM",
          "a34f_19600101_fc0000_8_SIM",
          "a34f_19600101_fc0000_9_SIM",
          "a34f_19600101_fc0000_7_SIM"
      ],
      "a34f_ASThread_16045705526000_10_11": [
          "a34f_19600101_fc0001_6_SIM",
          "a34f_19600101_fc0001_7_SIM",
          "a34f_19600101_fc0001_4_SIM",
          "a34f_19600101_fc0001_9_SIM",
          "a34f_19600101_fc0001_8_SIM",
          "a34f_19600101_fc0001_POST",
          "a34f_19600101_fc0001_5_SIM",
          "a34f_19600101_fc0001_2_SIM",
          "a34f_19600101_fc0001_10_SIM",
          "a34f_19600101_fc0001_3_SIM",
          "a34f_19600101_fc0001_1_SIM"
      ],
      "a34f_ASThread_16045707844635_10_11": [
          "a34f_19600101_fc0002_4_SIM",
          "a34f_19600101_fc0002_10_SIM",
          "a34f_19600101_fc0002_POST",
          "a34f_19600101_fc0002_8_SIM",
          "a34f_19600101_fc0002_1_SIM",
          "a34f_19600101_fc0002_3_SIM",
          "a34f_19600101_fc0002_5_SIM",
          "a34f_19600101_fc0002_7_SIM",
          "a34f_19600101_fc0002_6_SIM",
          "a34f_19600101_fc0002_2_SIM",
          "a34f_19600101_fc0002_9_SIM"
      ],
      "a34f_ASThread_16045710138880_10_11": [
          "a34f_19600101_fc0003_1_SIM",
          "a34f_19600101_fc0003_8_SIM",
          "a34f_19600101_fc0003_4_SIM",
          "a34f_19600101_fc0003_9_SIM",
          "a34f_19600101_fc0003_POST",
          "a34f_19600101_fc0003_5_SIM",
          "a34f_19600101_fc0003_7_SIM",
          "a34f_19600101_fc0003_10_SIM",
          "a34f_19600101_fc0003_3_SIM",
          "a34f_19600101_fc0003_6_SIM",
          "a34f_19600101_fc0003_2_SIM"
      ],
      "a34f_ASThread_1604571225486_10_11": [
          "a34f_19600101_fc0004_4_SIM",
          "a34f_19600101_fc0004_8_SIM",
          "a34f_19600101_fc0004_POST",
          "a34f_19600101_fc0004_10_SIM",
          "a34f_19600101_fc0004_2_SIM",
          "a34f_19600101_fc0004_1_SIM",
          "a34f_19600101_fc0004_9_SIM",
          "a34f_19600101_fc0004_6_SIM",
          "a34f_19600101_fc0004_3_SIM",
          "a34f_19600101_fc0004_7_SIM",
          "a34f_19600101_fc0004_5_SIM"
      ],
      "a34f_ASThread_16045714733746_10_11": [
          "a34f_19600101_fc0005_6_SIM",
          "a34f_19600101_fc0005_4_SIM",
          "a34f_19600101_fc0005_3_SIM",
          "a34f_19600101_fc0005_5_SIM",
          "a34f_19600101_fc0005_1_SIM",
          "a34f_19600101_fc0005_10_SIM",
          "a34f_19600101_fc0005_9_SIM",
          "a34f_19600101_fc0005_7_SIM",
          "a34f_19600101_fc0005_8_SIM",
          "a34f_19600101_fc0005_POST",
          "a34f_19600101_fc0005_2_SIM"
      ],
      "a34f_ASThread_16045717386367_10_11": [
          "a34f_19600101_fc0006_8_SIM",
          "a34f_19600101_fc0006_7_SIM",
          "a34f_19600101_fc0006_POST",
          "a34f_19600101_fc0006_6_SIM",
          "a34f_19600101_fc0006_4_SIM",
          "a34f_19600101_fc0006_5_SIM",
          "a34f_19600101_fc0006_1_SIM",
          "a34f_19600101_fc0006_2_SIM",
          "a34f_19600101_fc0006_3_SIM",
          "a34f_19600101_fc0006_10_SIM",
          "a34f_19600101_fc0006_9_SIM"
      ],
      "a34f_ASThread_16045719512820_10_11": [
          "a34f_19600101_fc0007_2_SIM",
          "a34f_19600101_fc0007_1_SIM",
          "a34f_19600101_fc0007_10_SIM",
          "a34f_19600101_fc0007_6_SIM",
          "a34f_19600101_fc0007_9_SIM",
          "a34f_19600101_fc0007_3_SIM",
          "a34f_19600101_fc0007_POST",
          "a34f_19600101_fc0007_5_SIM",
          "a34f_19600101_fc0007_8_SIM",
          "a34f_19600101_fc0007_4_SIM",
          "a34f_19600101_fc0007_7_SIM"
      ],
      "a34f_ASThread_16045721911220_10_11": [
          "a34f_19600101_fc0008_3_SIM",
          "a34f_19600101_fc0008_8_SIM",
          "a34f_19600101_fc0008_4_SIM",
          "a34f_19600101_fc0008_5_SIM",
          "a34f_19600101_fc0008_1_SIM",
          "a34f_19600101_fc0008_9_SIM",
          "a34f_19600101_fc0008_7_SIM",
          "a34f_19600101_fc0008_10_SIM",
          "a34f_19600101_fc0008_POST",
          "a34f_19600101_fc0008_2_SIM",
          "a34f_19600101_fc0008_6_SIM"
      ],
      "a34f_ASThread_16045724436396_10_11": [
          "a34f_19600101_fc0009_6_SIM",
          "a34f_19600101_fc0009_2_SIM",
          "a34f_19600101_fc0009_1_SIM",
          "a34f_19600101_fc0009_8_SIM",
          "a34f_19600101_fc0009_3_SIM",
          "a34f_19600101_fc0009_9_SIM",
          "a34f_19600101_fc0009_4_SIM",
          "a34f_19600101_fc0009_5_SIM",
          "a34f_19600101_fc0009_10_SIM",
          "a34f_19600101_fc0009_7_SIM",
          "a34f_19600101_fc0009_POST"
      ]
  },
  "pkl_timestamp": 10000000,
  "total_jobs": 111
}

const nodesInBase = []; 
data.nodes.map((item) => nodesInBase.push(item.id));
const state = { visNetwork: null, selection: null };
let container = null;
beforeEach(() => {
  // setup DOM element as render target
  container = document.createElement("div");
  container.setAttribute("ref", "myRef");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Graph Representation renders with content, generates visNetwork object and visNetwork object contains all the specified nodes.", () => {

  var visData = null;
  var visNetwork = null;
  act(() => {
    render(<GraphNativeRep       
      data={data}
      updateSelection={() => null}
      loadingGraph={false}
      cleanGraphData={() => null}
      shouldUpdateGraph={true}
      setVisData={(visdata) => visData = visdata}
      setVisNetwork={(visnetwork) => visNetwork = visnetwork}
      navToLatest={() => null}
      clearStats={() => null}
      cleanNavData={() => null}
      current_grouped={null}
      experimentRunning={true}
      navigateAfterLoadGraph={() => null}
      updateCurrentSelected={() => null}
      canSelect={true}
      updateGraphSelectedNodes={() => null} />, container);
  });

  state.visNetwork = visNetwork;
  //console.log(container.innerHTML);
  //const tree = renderer.create()
  // console.log(container.textContent);
  //console.log(nodesInBase);
  const nodesIn = Object.keys(visNetwork.body.data.nodes._data);
  expect(container.innerHTML).toContain("vis-network");
  expect(visNetwork).not.toBeFalsy();
  expect(nodesIn).toEqual(expect.arrayContaining(nodesInBase));

});

// --- Test Graph object behavior ---
test("navigateGraph selects the right node", () => {
    const selectedNodeId = "a34f_19600101_fc0001_6_SIM";
    navigateGraph(selectedNodeId, 100, 100, 0.9, state.visNetwork);
    expect(state.visNetwork.getSelectedNodes()[0]).toEqual(selectedNodeId);
}); 

test("Add fake edge to visNetwork", () => {
    const source = "a34f_19600101_fc0001_6_SIM";
    const target = "a34f_19600101_fc0001_10_SIM";
    addFakeEdge(source, target, state);
    expect(Object.keys(state.visNetwork.body.data.edges._data)).toContain(source+"-"+target);
    //console.log(Object.keys());
});

test("Add fake edge to visNetwork using non-existent nodes", () => {
    const source = "a34f_19600101111";
    const target = "a34f_19600101222";
    addFakeEdge(source, target, state);
    expect(Object.keys(state.visNetwork.body.data.edges._data)).not.toContain(source+"-"+target);
    //console.log(Object.keys());
});

test("Update edge style succeeds", () => {
    const idEdge = "a34f_19600101_fc0001_6_SIM-a34f_19600101_fc0001_10_SIM";
    updateEdgeStyle(idEdge, state);
    expect(state.visNetwork.body.edges[idEdge].options.dashes).toEqual(false);
    expect(state.visNetwork.body.edges[idEdge].options.background.enabled).toEqual(true);
    expect(state.visNetwork.body.edges[idEdge].options.background.color).toEqual("rgba(63, 191, 63, 0.5)");
});

test("Update graph border suceeds", () => {
    const nodeId = "a34f_19600101_fc0001_6_SIM";
    updateGraphBorder(nodeId, state);
    const selectedNode = state.visNetwork.getSelectedNodes()[0];
    expect(selectedNode).toEqual(nodeId);
    expect(state.visNetwork.body.nodes[
        nodeId
      ].options.shapeProperties.borderDashes).toBe(true);
});

test("Update the color of a node in the graph", () => {
    const nodeId = "a34f_19600101_fc0008_7_SIM";
    updateGraphColor(nodeId, "yellow", state);
    const selectedNode = state.visNetwork.getSelectedNodes()[0];
    expect(selectedNode).toEqual(nodeId);
    expect(state.visNetwork.body.nodes[
        nodeId
      ].options.color.background ).toEqual("yellow");
});

test("Update the shape of a node in the graph", () => {
    const nodeId = "a34f_19600101_fc0004_4_SIM";
    updateGraphShape(nodeId, "square", state);
    const selectedNode = state.visNetwork.getSelectedNodes()[0];
    expect(selectedNode).toEqual(nodeId);
    // console.log(state.visNetwork.body.nodes[
    //     nodeId
    //   ].options.shape);
    expect(state.visNetwork.body.nodes[
        nodeId
      ].options.shape).toEqual("square");
});

test("Navigate to latest COMPLETED job", () => {
    const targetNode = "a34f_19600101_fc0009_POST";
    navToLatest(5, true, 0.9, state.visNetwork, data, state);
    expect(state.selection).not.toBeFalsy();
    // console.log(state.selection);
    expect(state.selection[0]).toEqual(targetNode);
    const selectedNode = state.visNetwork.getSelectedNodes()[0];
    expect(selectedNode).toEqual(targetNode);
});

test("Find existing nodeId in graph", () => {
    const target = "a34f_19600101_fc0009_7_SIM";
    const position = findIdinGraph(target, state);
    expect(position.x).toBeTruthy();
    expect(position.y).toBeTruthy();
});

test("Find non-existing nodeId in graph", () => {
    const target = "a34f_19600101_fc0009_7_SIN";
    const position = findIdinGraph(target, state);
    expect(position.x).toBeFalsy();
    expect(position.y).toBeFalsy();
});

// --- SelectionNode.js --- 

it("SelectionNode renders from graph data", () => {
    const selectedNode = ['a34f_19600101_fc0000_1_SIM'];//{ node: { refKey: "a2tl_20200511_000_1_REDUCE" }};
    const selectedTreeNode = { node: { refKey: "a34f_19600101_fc0000_1_SIM" }};
    act(() => {
        render(<ExperimentContext.Provider value={{ experiment: {expid: 'a34f'} }}>
            <TreeContext.Provider value={{ selectedTreeNode: selectedTreeNode}}>
                <GraphContext.Provider value={{selection: selectedNode, data: data}}>
                    <Selection />
                </GraphContext.Provider>    
            </TreeContext.Provider>                            
            </ExperimentContext.Provider>, container);
      });
    
    expect(container.textContent).toContain("a34f_19600101_fc0000_1_SIM");
    expect(container.textContent).toContain("a34f_19600101_fc0000_POST");
    expect(container.textContent).toContain("1960 01 01");
    expect(container.textContent).toContain("COMPLETED");
});