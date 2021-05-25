import {
  GET_LIGHTER_VIEW,
  SET_LOADING_LIGHTER_VIEW,
  CLEAN_LIGHTER_VIEW_DATA,
  SET_LIGHTER_FANCY_TREE,
  FILTER_LIGHTER_TREE_VIEW,
  SET_LOADING_FILTER_LIGHTER_TREE_VIEW,
  CLEAR_LIGHTER_FILTER,
  INCREASE_LOADING_QUICK_VIEW,
} from "../types";

//import { DEBUG } from "../vars";

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
export default (state, action) => {
  switch (action.type) {
    case GET_LIGHTER_VIEW:
      // const result = action.payload;
      return {
        ...state,
        lightData: action.payload,
        elapsedLoadingQuickView: 1,
        loadingView: false,
      };
    case CLEAN_LIGHTER_VIEW_DATA:
      return {
        ...state,
        lightData: null,
        lightFancyTree: null,
        loadingView: false,
        loadingFilterTreeView: false,
      };
    case SET_LOADING_LIGHTER_VIEW:
      return {
        ...state,
        loadingView: true,
      };
    case SET_LIGHTER_FANCY_TREE:
      return {
        ...state,
        lightFancyTree: action.payload,
      };
    case SET_LOADING_FILTER_LIGHTER_TREE_VIEW:
      return {
        ...state,
        loadingFilterTreeView: true,
      };
    case INCREASE_LOADING_QUICK_VIEW:
      return {
        ...state,
        elapsedLoadingQuickView: state.elapsedLoadingQuickView + 1,
      };
    case FILTER_LIGHTER_TREE_VIEW:
      const string = action.payload;
      if (state.lightData && state.lightFancyTree) {
        let count = 0;
        let isNegation = string.indexOf('!') === 0;
        if (string.indexOf("*") > -1) {
          const fields = isNegation === true ? string.substring(1).split('*') : string.split("*");            
          count = state.lightFancyTree.filterNodes(function (node) {
            let result = false;
            let string_test = node.title;
            for (let i = 0; i < fields.length; i++) {
              if (fields[i].length > 0) {
                if (string_test.indexOf(fields[i]) > -1) {
                  //debug && console.log(fields[i] + " found in " + string_test);
                  let found_index =
                    string_test.indexOf(fields[i]) + fields[i].length;
                  string_test = string_test.substring(found_index);
                  //debug && console.log(found_index + " in " + string_test);
                  if (isNegation){
                    result = false;
                    break;
                  } else {
                    result = true;
                  }
                } else {
                  // debug &&
                  //   console.log(fields[i] + " Not found in " + string_test);
                  if (isNegation){
                    result = true;
                  } else {
                    result = false;
                    break;         
                  }
                }
              }
            }
            return result;
          });
        } else {
          const searchString = isNegation === true ? string.substring(1) : string;
          count = state.lightFancyTree.filterNodes(function (node) {
            let result = false;
            let stringTest = node.title;
            if (stringTest.indexOf(searchString) > -1){
              if (isNegation){
                result = false;
              } else {
                result = true;
              }
            } else {
              if (isNegation){
                result = true;
              } else {
                result = false;
              }
            }
            return result;
          });
          // count = state.lightFancyTree.filterNodes(string);
        }
        //debug && console.log(count);
        state.filterCount = count;
      } else {
        state.filterCount = 0;
      }
      return {
        ...state,
        loadingFilterTreeView: false,
      };
    case CLEAR_LIGHTER_FILTER:
      if (state.lightData && state.lightFancyTree) {
        state.lightFancyTree.clearFilter();
      }
      return {
        ...state,
        filterCount: 0,
      };
    default:
      return null;
  }
};
