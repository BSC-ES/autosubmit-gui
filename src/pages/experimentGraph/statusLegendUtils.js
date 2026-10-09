import { JOB_STATUSES, STATUS_COLORS } from "../../services/utils";

const LEGEND_TITLE = "Status legend";
const LEGEND_PADDING = 10;
const LEGEND_MARKER_SIZE = 11;
const LEGEND_ROW_HEIGHT = 20;
const LEGEND_COLUMN_WIDTH = 125;
const LEGEND_TITLE_HEIGHT = 22;
const LEGEND_COLUMNS = 2;

/**
 * Returns the dimensions of the status legend based on the number of job statuses.
 *
 * @returns {{width: number, height: number}} An object containing the width and 
 * height of the legend.
 */
const getLegendDimensions = () => {
    const rows = Math.ceil(JOB_STATUSES.length / LEGEND_COLUMNS);

    return {
        width: LEGEND_PADDING * 2 + LEGEND_COLUMN_WIDTH * LEGEND_COLUMNS,
        height: LEGEND_PADDING * 2 + LEGEND_TITLE_HEIGHT + LEGEND_ROW_HEIGHT * rows,
    };
};

/**
 * Draws the status legend at the bottom-left corner of the canvas.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} canvasHeight
 */
const drawStatusLegend = (context, canvasHeight) => {
    const { width, height } = getLegendDimensions();
    const x = LEGEND_PADDING;
    const y = Math.max(0, canvasHeight - height - LEGEND_PADDING);

    context.save();

    context.translate(x, y);

    // Legend background
    context.fillStyle = "rgba(229, 229, 229, 0.9)";
    context.fillRect(0, 0, width, height);

    // Legend border
    context.strokeStyle = "rgba(0, 0, 0, 0.25)";
    context.lineWidth = 1;
    context.strokeRect(0, 0, width, height);

    // Legend title
    context.textBaseline = "middle";
    context.fillStyle = "#000";
    context.font = "bold 12px sans-serif";
    context.fillText(
        LEGEND_TITLE,
        LEGEND_PADDING,
        LEGEND_PADDING + LEGEND_TITLE_HEIGHT / 2
    );

    // Status text
    context.font = "11px sans-serif";

    JOB_STATUSES.forEach((status, index) => {
        const column = index % LEGEND_COLUMNS;
        const row = Math.floor(index / LEGEND_COLUMNS);

        const x = LEGEND_PADDING + column * LEGEND_COLUMN_WIDTH;
        const y = LEGEND_PADDING + LEGEND_TITLE_HEIGHT + row * LEGEND_ROW_HEIGHT;

        // Color box
        context.fillStyle = STATUS_COLORS[status];
        context.fillRect(x, y, LEGEND_MARKER_SIZE, LEGEND_MARKER_SIZE);

        // Color box border
        context.strokeStyle = "#000";
        context.strokeRect(x, y, LEGEND_MARKER_SIZE, LEGEND_MARKER_SIZE);

        // Status text
        context.fillStyle = "#000";
        context.fillText(
            status,
            x + LEGEND_MARKER_SIZE + 6,
            y + LEGEND_MARKER_SIZE / 2
        );
    });

    context.restore();
};

/** 
 * Loads an image from the given source and returns a Promise that 
 * resolves with the loaded image.
 * 
 * @param {string} source - The source of the image to load.
 * @returns {Promise<HTMLImageElement>} A Promise that resolves with the loaded image.
 */
const loadImage = (source) => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => {
            reject(new Error(`Unable to load image: ${source}`));
        };

        image.src = source;
    });
};

/**
 * Converts a canvas to a blob.
 * @param {HTMLCanvasElement} canvas - The canvas to convert.
 * @returns {Promise<Blob>} A promise that resolves with the resulting blob.
 */
async function canvasToBlob(canvas) {
    return await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error("Unable to create graph image blob"));
            }
        }, "image/png");
    });
}

/**
 * Attaches the status legend to the given image source.
 *
 * @param {string} imageSource - The source of the image to which the legend will be attached.
 * @returns {Promise<string>} The new image source after the legend is attached, or the original
 * if an error occurs.
 */
export const attachStatusLegendToImage = async (imageSource) => {
    try {
        const graphImage = await loadImage(imageSource);

        const canvas = document.createElement("canvas");
        canvas.width = graphImage.width;
        canvas.height = graphImage.height;

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        context.drawImage(graphImage, 0, 0);

        drawStatusLegend(context, canvas.height);

        return URL.createObjectURL(await canvasToBlob(canvas));
    } catch (error) {
        console.error("Unable to export graph image", error);
    }

    return imageSource;
}
