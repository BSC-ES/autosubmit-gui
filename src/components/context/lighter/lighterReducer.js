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

import { UpperLimitQuickView } from "../vars";

/* eslint import/no-anonymous-default-export: ["error", {"allowArrowFunction": true}] */
export default (state, action) => {
  switch (action.type) {
    case GET_LIGHTER_VIEW:
      {
        const { 
          error,
          error_message,
          // view_data,
          tree_view,
          total,
          completed,
          failed,
          running,
          queuing, 
        } = action.payload;
        const currentData = [];
        const firstCurrentData = [];
        const IsValidResponse = tree_view && tree_view.length > 0 && error === false ? true : false;
        let validItemCount = 0;         
        if (IsValidResponse) {
          let i = 0;             
          while (validItemCount < Math.min(UpperLimitQuickView, tree_view.length) && i < tree_view.length){
            if (tree_view[i].title.indexOf("#WAITING") < 0) {
              currentData.push(tree_view[i]);
              firstCurrentData.push(tree_view[i]);
              validItemCount++;
            }     
            i++;     
          }        
        }    
        
        return {
          ...state,
          error: error,
          errorMessage: error_message,        
          baseData: tree_view,
          currentData: currentData,
          firstCurrentData: firstCurrentData,
          queueCount: queuing,
          runCount: running,
          totalCount: total,
          completedCount: completed,
          failedCount: failed,
          currentCount: validItemCount,
          elapsedLoadingQuickView: 1,
          loadingView: false,
          isValid: IsValidResponse,
        };
      }
    case CLEAN_LIGHTER_VIEW_DATA:
      return {
        ...state,
        error: false,
        errorMessage: null,
        baseData: null,
        currentData: null,
        firstCurrentData: null,
        queueCount: 0,
        runCount: 0,
        totalCount: 0,
        completedCount: 0,
        failedCount: 0,
        currentCount: 0,
        filterCount: -1,
        lightFancyTree: null,
        loadingView: false,
        loadingFilterTreeView: false,
        elapsedLoadingQuickView: 1,
        isValid: false,
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
      {
        const string = String(action.payload).toUpperCase();
        if (state.isValid && state.lightFancyTree) {        
          let isNegation = string.indexOf('!') === 0;
          if (string.indexOf("*") > -1) {
            const fields = isNegation === true ? string.substring(1).split('*') : string.split("*");            
            const baseData = state.baseData;
            const currentData = baseData.filter(item => {
              let result = false;
              let string_test = String(item.title).toUpperCase();
              for (let i = 0; i < fields.length; i++) {
                if (fields[i].length > 0) {
                  if (string_test.indexOf(fields[i]) > -1) {
                    let found_index =
                      string_test.indexOf(fields[i]) + fields[i].length;
                    string_test = string_test.substring(found_index);

                    if (isNegation){
                      result = false;
                      break;
                    } else {
                      result = true;
                    }
                  } else {

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
            return {
              ...state,
              currentData: currentData,
              currentCount: currentData.length,
              filterCount: currentData.length,
              loadingFilterTreeView: false,
            }
          } else {
            const searchString = isNegation === true ? string.substring(1) : string;
            const baseData = state.baseData;
            const currentData = baseData.filter(item => {
              let result = false;
              let stringTest = String(item.title).toUpperCase();
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
            return {
              ...state,
              currentData: currentData,
              currentCount: currentData.length,
              filterCount: currentData.length,
              loadingFilterTreeView: false,
            }
          }        
        } 
        return {
          ...state,
          filterCount: 0,
          currentCount: 0,
          loadingFilterTreeView: false,
        };
      }
    case CLEAR_LIGHTER_FILTER:
      const firstCurrentData = state.firstCurrentData;
      return {
        ...state,
        filterCount: -1,
        currentCount: firstCurrentData.length,
        currentData: firstCurrentData,
      };
    default:
      return null;
  }
};
