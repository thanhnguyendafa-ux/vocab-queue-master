// CSV import/export utilities for Vocab Queue Master
import Papa from 'papaparse';
/**
 * Parse CSV data into VocabItem array
 */
export function parseCSV(csvContent) {
    return new Promise(function (resolve, reject) {
        Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: function (header) { return header.toLowerCase().trim(); },
            complete: function (results) {
                if (results.errors.length > 0) {
                    reject(new Error("CSV parsing errors: ".concat(results.errors.map(function (e) { return e.message; }).join(', '))));
                    return;
                }
                var items = results.data
                    .filter(function (row) { return row.term && row.meaning; }) // Filter out rows without required fields
                    .map(function (row, index) {
                    var _a;
                    return ({
                        id: "csv_".concat(Date.now(), "_").concat(index),
                        term: row.term.trim(),
                        meaning: row.meaning.trim(),
                        example: ((_a = row.example) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                        tags: row.tags ? row.tags.split(';').map(function (tag) { return tag.trim(); }).filter(Boolean) : undefined,
                        passed1: 0,
                        passed2: 0,
                        failed: 0,
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    });
                });
                resolve(items);
            },
            error: function (error) {
                reject(new Error("CSV parsing failed: ".concat(error.message)));
            }
        });
    });
}
/**
 * Convert VocabItem array to CSV string
 */
export function exportToCSV(items) {
    var csvData = items.map(function (item) { return ({
        term: item.term,
        meaning: item.meaning,
        example: item.example || '',
        tags: item.tags ? item.tags.join(';') : ''
    }); });
    return Papa.unparse(csvData, {
        header: true,
        columns: ['term', 'meaning', 'example', 'tags']
    });
}
/**
 * Download CSV file
 */
export function downloadCSV(items, filename) {
    if (filename === void 0) { filename = 'vocabulary.csv'; }
    var csvContent = exportToCSV(items);
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
/**
 * Read file as text
 */
export function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                resolve(e.target.result);
            }
            else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = function () { return reject(new Error('File reading error')); };
        reader.readAsText(file, 'UTF-8');
    });
}
/**
 * Validate CSV structure
 */
export function validateCSVStructure(csvContent) {
    var errors = [];
    try {
        var result = Papa.parse(csvContent, { header: true, preview: 1 });
        var headers_1 = result.meta.fields || [];
        var requiredHeaders = ['term', 'meaning'];
        var missingHeaders = requiredHeaders.filter(function (header) {
            return !headers_1.some(function (h) { return h.toLowerCase().trim() === header; });
        });
        if (missingHeaders.length > 0) {
            errors.push("Missing required columns: ".concat(missingHeaders.join(', ')));
        }
        if (result.errors.length > 0) {
            errors.push.apply(errors, result.errors.map(function (e) { return e.message; }));
        }
    }
    catch (error) {
        errors.push("Invalid CSV format: ".concat(error instanceof Error ? error.message : 'Unknown error'));
    }
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
/**
 * Generate sample CSV content
 */
export function generateSampleCSV() {
    var sampleData = [
        {
            term: 'abundant',
            meaning: 'existing in large quantities; plentiful',
            example: 'The forest was abundant with wildlife.',
            tags: 'adjective;nature'
        },
        {
            term: 'curious',
            meaning: 'eager to know or learn something',
            example: 'She was curious about how the machine worked.',
            tags: 'adjective;personality'
        },
        {
            term: 'determine',
            meaning: 'to decide or establish exactly',
            example: 'We need to determine the best route to take.',
            tags: 'verb;decision'
        },
        {
            term: 'enormous',
            meaning: 'very large in size or quantity',
            example: 'The elephant was enormous compared to the mouse.',
            tags: 'adjective;size'
        },
        {
            term: 'fragile',
            meaning: 'easily broken or damaged',
            example: 'Handle the glass vase carefully because it is fragile.',
            tags: 'adjective;physical'
        }
    ];
    return Papa.unparse(sampleData, {
        header: true,
        columns: ['term', 'meaning', 'example', 'tags']
    });
}
//# sourceMappingURL=csv.js.map