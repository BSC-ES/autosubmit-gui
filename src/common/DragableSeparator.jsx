const DragableSeparator = ({ setIsResizing, orientation, margin }) => {
    if (orientation !== "vertical" && orientation !== "horizontal") {
        throw new Error("Invalid orientation. Must be 'vertical' or 'horizontal'.");
    }

    let cursorClass, height, width, padding;
    if (orientation === "vertical") {
        cursorClass = "cursor-row-resize";
        height = 1;
        width = "full";
        padding = "py-1";
        margin = "my-" + (margin || 0);
    } else {
        cursorClass = "cursor-col-resize";
        height = "full";
        width = 1;
        padding = "px-1";
        margin = "mx-" + (margin || 0);
    }

    return (
        <div
            role="separator"
            title="Drag to resize"
            className={`relative h-${height} w-${width} ${cursorClass} ${margin} ${padding} opacity-0 transition-opacity hover:opacity-100 active:opacity-100 bg-[radial-gradient(circle,#9ca3af_1px,transparent_1px)] [background-size:4px_4px]`}
            onMouseDown={(event) => {
                event.preventDefault();
                setIsResizing(true);
            }}
        />
    );
};

export default DragableSeparator;
