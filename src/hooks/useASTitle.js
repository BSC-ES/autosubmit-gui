import { useEffect } from "react"

/**
 * Updates the document title of the Autosubmit GUI adding a suffix.
 * @param {string} title
 */
const useASTitle = (title) => {
    useEffect(() => {
        document.title = title + " | Autosubmit GUI";
    }, [title])
}

export default useASTitle