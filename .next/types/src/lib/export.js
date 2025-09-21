import { __awaiter, __generator } from "tslib";
import { htmlToImage } from 'dom-to-image';
import { saveAs } from 'file-saver';
export function exportDashboard(elementId, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var node, blob, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = document.getElementById(elementId);
                    if (!node)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, htmlToImage.toPng(node)];
                case 2:
                    blob = _a.sent();
                    saveAs(blob, "".concat(fileName, ".png"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Export failed:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function exportDataAsJSON(data, fileName) {
    var blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    saveAs(blob, "".concat(fileName, ".json"));
}
//# sourceMappingURL=export.js.map