import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { DBService } from '../../services/db-service';
var ImportExportManager = /** @class */ (function () {
    function ImportExportManager() {
    }
    // Export project with all related data
    ImportExportManager.exportProject = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var project, _a, modules, items, exportData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _b.sent();
                        if (!project)
                            throw new Error('Project not found');
                        return [4 /*yield*/, Promise.all([
                                Promise.all(project.modules.map(function (moduleId) { return DBService.getModule(moduleId); })),
                                DBService.getVocabItems(projectId)
                            ])];
                    case 2:
                        _a = _b.sent(), modules = _a[0], items = _a[1];
                        exportData = {
                            project: project,
                            modules: modules.filter(Boolean),
                            items: items,
                            exportedAt: new Date().toISOString(),
                            version: '1.0'
                        };
                        return [2 /*return*/, JSON.stringify(exportData, null, 2)];
                }
            });
        });
    };
    // Import project from exported data
    ImportExportManager.importProject = function (jsonData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, idMap_1, savedItems, savedModules, newProjectId, newProject, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        data = JSON.parse(jsonData);
                        // Validate the import data
                        if (!data.project || !data.modules || !data.items) {
                            throw new Error('Invalid import data format');
                        }
                        idMap_1 = new Map();
                        return [4 /*yield*/, Promise.all(data.items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var newId, newItem;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            newId = crypto.randomUUID();
                                            idMap_1.set(item.id, newId);
                                            newItem = __assign(__assign({}, item), { id: newId, createdAt: Date.now(), updatedAt: Date.now() });
                                            return [4 /*yield*/, DBService.saveVocabItem(newItem)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, newItem];
                                    }
                                });
                            }); }))
                            // Save modules with new IDs and updated item references
                        ];
                    case 1:
                        savedItems = _a.sent();
                        return [4 /*yield*/, Promise.all(data.modules.map(function (module) { return __awaiter(_this, void 0, void 0, function () {
                                var newId, newModule;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            newId = crypto.randomUUID();
                                            idMap_1.set(module.id, newId);
                                            newModule = __assign(__assign({}, module), { id: newId, 
                                                // Update any item references in the module
                                                items: (_a = module.items) === null || _a === void 0 ? void 0 : _a.map(function (itemId) { return idMap_1.get(itemId) || itemId; }) });
                                            return [4 /*yield*/, DBService.saveModule(newModule)];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/, newModule];
                                    }
                                });
                            }); }))
                            // Save project with new IDs
                        ];
                    case 2:
                        savedModules = _a.sent();
                        newProjectId = crypto.randomUUID();
                        newProject = __assign(__assign({}, data.project), { id: newProjectId, modules: savedModules.map(function (m) { return m.id; }), items: savedItems.map(function (i) { return i.id; }), createdAt: Date.now(), updatedAt: Date.now() });
                        return [4 /*yield*/, DBService.saveProject(newProject)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, newProject];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Import failed:', error_1);
                        throw new Error("Import failed: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Export to CSV format
    ImportExportManager.exportToCSV = function (projectId_1) {
        return __awaiter(this, arguments, void 0, function (projectId, includeStats) {
            var project, items, headers, rows;
            if (includeStats === void 0) { includeStats = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            throw new Error('Project not found');
                        return [4 /*yield*/, DBService.getVocabItems(projectId)
                            // Define CSV headers
                        ];
                    case 2:
                        items = _a.sent();
                        headers = ['Term', 'Definition', 'Example', 'Tags'];
                        if (includeStats) {
                            headers.push('Passed', 'Failed', 'Last Reviewed');
                        }
                        rows = items.map(function (item) {
                            var _a;
                            var row = [
                                "\"".concat(item.term, "\""),
                                "\"".concat(item.meaning, "\""),
                                "\"".concat(item.example || '', "\""),
                                "\"".concat(((_a = item.tags) === null || _a === void 0 ? void 0 : _a.join(',')) || '', "\"")
                            ];
                            if (includeStats) {
                                row.push((item.passed1 + item.passed2).toString(), item.failed.toString(), item.lastReviewedAt ? new Date(item.lastReviewedAt).toISOString() : '');
                            }
                            return row.join(',');
                        });
                        // Combine headers and rows
                        return [2 /*return*/, __spreadArray([headers.join(',')], rows, true).join('\n')];
                }
            });
        });
    };
    // Import from CSV
    ImportExportManager.importFromCSV = function (csvData, projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var lines, headers, rows, requiredColumns, missingColumns, items, _loop_1, this_1, _i, rows_1, row, project, existingItems, existingIds_1, newItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lines = csvData.split('\n').filter(function (line) { return line.trim() !== ''; });
                        if (lines.length < 2)
                            throw new Error('CSV file is empty or has no headers');
                        headers = lines[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
                        rows = lines.slice(1);
                        requiredColumns = ['term', 'definition'];
                        missingColumns = requiredColumns.filter(function (col) {
                            return !headers.includes(col.toLowerCase());
                        });
                        if (missingColumns.length > 0) {
                            throw new Error("Missing required columns: ".concat(missingColumns.join(', ')));
                        }
                        items = [];
                        _loop_1 = function (row) {
                            var values = this_1.parseCSVRow(row);
                            var item = {
                                id: crypto.randomUUID(),
                                term: '',
                                meaning: '',
                                passed1: 0,
                                passed2: 0,
                                failed: 0,
                                createdAt: Date.now(),
                                updatedAt: Date.now()
                            };
                            // Map CSV columns to item properties
                            headers.forEach(function (header, index) {
                                var _a;
                                var value = (_a = values[index]) === null || _a === void 0 ? void 0 : _a.trim();
                                if (!value)
                                    return;
                                switch (header) {
                                    case 'term':
                                        item.term = value;
                                        break;
                                    case 'definition':
                                    case 'meaning':
                                        item.meaning = value;
                                        break;
                                    case 'example':
                                        item.example = value;
                                        break;
                                    case 'tags':
                                        item.tags = value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
                                        break;
                                    case 'passed1':
                                    case 'passed2':
                                    case 'failed':
                                        item[header] = parseInt(value, 10) || 0;
                                        break;
                                    case 'lastreviewed':
                                        item.lastReviewedAt = new Date(value).getTime() || undefined;
                                        break;
                                }
                            });
                            // Only add if we have required fields
                            if (item.term && item.meaning) {
                                items.push(item);
                            }
                        };
                        this_1 = this;
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            row = rows_1[_i];
                            _loop_1(row);
                        }
                        // Save items to database
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return DBService.saveVocabItem(item); }))
                            // Update project with new items
                        ];
                    case 1:
                        // Save items to database
                        _a.sent();
                        if (!projectId) return [3 /*break*/, 5];
                        return [4 /*yield*/, DBService.getProject(projectId)];
                    case 2:
                        project = _a.sent();
                        if (!project) return [3 /*break*/, 5];
                        return [4 /*yield*/, DBService.getVocabItems(projectId)];
                    case 3:
                        existingItems = _a.sent();
                        existingIds_1 = new Set(existingItems.map(function (i) { return i.id; }));
                        newItems = items.filter(function (item) { return !existingIds_1.has(item.id); });
                        if (!(newItems.length > 0)) return [3 /*break*/, 5];
                        project.items = __spreadArray([], new Set(__spreadArray(__spreadArray([], project.items, true), newItems.map(function (i) { return i.id; }), true)), true);
                        project.updatedAt = Date.now();
                        return [4 /*yield*/, DBService.saveProject(project)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, items];
                }
            });
        });
    };
    // Helper to parse CSV row with quoted values
    ImportExportManager.parseCSVRow = function (row) {
        var result = [];
        var inQuotes = false;
        var current = '';
        for (var i = 0; i < row.length; i++) {
            var char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            }
            else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
                current += char;
            }
        }
        // Add the last field
        result.push(current);
        return result;
    };
    return ImportExportManager;
}());
export { ImportExportManager };
//# sourceMappingURL=ImportExportManager.js.map