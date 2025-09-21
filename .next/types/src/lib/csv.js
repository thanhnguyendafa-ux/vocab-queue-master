import Papa from 'papaparse';
export function exportToCSV(data, filename) {
    var csv = Papa.unparse(data);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "".concat(filename, ".csv");
    link.click();
}
export function importFromCSV(file) {
    return new Promise(function (resolve) {
        Papa.parse(file, {
            header: true,
            complete: function (results) { return resolve(results.data); }
        });
    });
}
//# sourceMappingURL=csv.js.map