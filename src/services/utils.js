

/**
 * Very simple export to CSV utility
 * @param {Array} columns 
 * @param {Array<Array>} data 
 * @param {string} filename 
 */
export const exportToCSV = (columns, data, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += columns.join(",") + "\n";

    csvContent += data.map( row => row.join(",") ).join("\n");

    const encodedUri = encodeURI(csvContent);

    // Trigger download action
    let link = document.createElement("a");
    link.href = encodedUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export const saveSVGObj = (svgData, filename) => {
    const svgString = (new XMLSerializer()).serializeToString(svgData);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    let link = document.createElement("a");
    link.href = svgUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }