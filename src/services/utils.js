

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

    let encodedUri = encodeURI(csvContent);

    // Trigger download action
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}