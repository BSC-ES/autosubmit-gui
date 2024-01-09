import React from "react";

function oldSchoolCopy(text) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
}

export default function useCopyToClipboard() {
    const [state, setState] = React.useState(null);

    const copyToClipboard = React.useCallback((value) => {
        const handleCopy = async () => {
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                    setState(value);
                } else {
                    throw new Error("writeText not supported");
                }
            } catch (e) {
                oldSchoolCopy(value);
                setState(value);
            }
        };

        handleCopy();
    }, []);

    return [state, copyToClipboard];
}
