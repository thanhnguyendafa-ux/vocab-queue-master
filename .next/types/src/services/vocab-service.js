import { __awaiter, __generator } from "tslib";
import { DBService } from './db-service';
import { calculateNextReview } from '../core/algo/srs';
var VocabService = /** @class */ (function () {
    function VocabService() {
    }
    VocabService.importFromCSV = function (csvData) {
        return __awaiter(this, void 0, void 0, function () {
            var parse, data, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, import('papaparse')];
                    case 1:
                        parse = (_a.sent()).parse;
                        data = parse(csvData, { header: true }).data;
                        items = data.map(function (row) { return ({
                            term: row.term || '',
                            definition: row.definition || '',
                            examples: row.examples ? row.examples.split('|') : [],
                            tags: row.tags ? row.tags.split(',') : []
                        }); });
                        return [4 /*yield*/, Promise.all(items.map(function (item) { return DBService.saveVocabItem(item); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VocabService.exportToCSV = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unparse, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, import('papaparse')];
                    case 1:
                        unparse = (_a.sent()).unparse;
                        return [4 /*yield*/, DBService.getVocabItems()];
                    case 2:
                        items = _a.sent();
                        return [2 /*return*/, unparse(items)];
                }
            });
        });
    };
    VocabService.updateAfterReview = function (itemId, isCorrect, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var item, _a, nextReview, newMastery;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, DBService.getVocabItem(itemId)];
                    case 1:
                        item = _c.sent();
                        if (!item)
                            return [2 /*return*/];
                        _a = calculateNextReview(item, isCorrect, settings), nextReview = _a.nextReview, newMastery = _a.newMastery;
                        return [4 /*yield*/, DBService.updateVocabItem(itemId, (_b = {
                                    lastReviewedAt: Date.now(),
                                    nextReviewDate: nextReview,
                                    mastery: newMastery
                                },
                                _b[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] = item[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] + 1,
                                _b))];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return VocabService;
}());
export { VocabService };
//# sourceMappingURL=vocab-service.js.map