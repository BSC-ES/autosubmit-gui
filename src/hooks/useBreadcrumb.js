

import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { appActions } from "../store/appSlice";

/**
 * Updates the Breadcrumb in the top of the GUI
 * @param {Array} items 
 */
const useBreadcrumb = (items) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(appActions.setBreadcrumbItems(items))
    }, [items])
}

export default useBreadcrumb