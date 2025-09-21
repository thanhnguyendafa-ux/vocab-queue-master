import { __spreadArray } from "tslib";
var CSVService = /** @class */ (function () {
    function CSVService() {
    }
    // Parse CSV content to rows
    CSVService.parseCSV = function (content) {
        var lines = content.trim().split('\n');
        if (lines.length < 2) {
            throw new Error('CSV must have at least a header row and one data row');
        }
        var headers = lines[0].split(',').map(function (h) { return h.trim(); });
        var rows = [];
        var _loop_1 = function (i) {
            var values = this_1.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                var row_1 = {};
                headers.forEach(function (header, index) {
                    row_1[header] = values[index].trim();
                });
                rows.push(row_1);
            }
        };
        var this_1 = this;
        for (var i = 1; i < lines.length; i++) {
            _loop_1(i);
        }
        return rows;
    };
    // Parse a single CSV line, handling quoted values
    CSVService.parseCSVLine = function (line) {
        var result = [];
        var current = '';
        var inQuotes = false;
        var i = 0;
        while (i < line.length) {
            var char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i += 2;
                }
                else {
                    inQuotes = !inQuotes;
                    i++;
                }
            }
            else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
                i++;
            }
            else {
                current += char;
                i++;
            }
        }
        result.push(current);
        return result;
    };
    // Generate CSV content from rows
    CSVService.generateCSV = function (rows) {
        if (rows.length === 0)
            return '';
        var headers = Object.keys(rows[0]);
        var csvRows = __spreadArray([
            headers.join(',')
        ], rows.map(function (row) {
            return headers.map(function (header) {
                var value = row[header] || '';
                return value.includes(',') || value.includes('"') || value.includes('\n')
                    ? "\"".concat(value.replace(/"/g, '""'), "\"")
                    : value;
            }).join(',');
        }), true);
        return csvRows.join('\n');
    };
    // Validate CSV data against schema
    CSVService.validateCSV = function (rows, schema) {
        var errors = [];
        var validRows = [];
        // Required headers
        var requiredHeaders = ['Keyword'];
        var headerErrors = requiredHeaders.filter(function (h) { return !Object.keys(rows[0] || {}).includes(h); });
        if (headerErrors.length > 0) {
            errors.push("Missing required headers: ".concat(headerErrors.join(', ')));
        }
        // Validate each row
        rows.forEach(function (row, index) {
            var rowErrors = [];
            // Check required fields
            if (!row.Keyword || row.Keyword.trim() === '') {
                rowErrors.push('Keyword is required');
            }
            // Check schema compliance
            var rowKeys = Object.keys(row);
            var extraHeaders = rowKeys.filter(function (key) { return !schema.includes(key) && key !== 'Keyword'; });
            if (extraHeaders.length > 0) {
                rowErrors.push("Invalid headers: ".concat(extraHeaders.join(', ')));
            }
            if (rowErrors.length === 0) {
                validRows.push(row);
            }
            else {
                errors.push("Row ".concat(index + 1, ": ").concat(rowErrors.join(', ')));
            }
        });
        return {
            success: errors.length === 0,
            data: validRows,
            errors: errors
        };
    };
    // Convert CSV rows to VocabItems
    CSVService.csvToVocabItems = function (csvRows) {
        return csvRows.map(function (row) { return ({
            keyword: row.Keyword,
            definition: row.Definition || '',
            example: row.Example,
            pronunciation: row.Pronunciation,
            imageUrl: row.ImageURL,
            tag: row.Tag
        }); });
    };
    return CSVService;
}());
export { CSVService };
//# sourceMappingURL=csvService.js.map