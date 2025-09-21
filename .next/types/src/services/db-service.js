import { __assign, __awaiter, __generator } from "tslib";
import { db } from '../lib/db';
var DBService = /** @class */ (function () {
    function DBService() {
    }
    // Vocab Items
    DBService.getVocabItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db.items.toArray()];
            });
        });
    };
    DBService.saveVocabItem = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                now = Date.now();
                return [2 /*return*/, db.items.add(__assign(__assign({}, item), { createdAt: now, updatedAt: now, lastReviewedAt: 0, nextReviewDate: 0, mastery: 0, passed1: 0, passed2: 0, failed: 0 }))];
            });
        });
    };
    // Study Sessions
    DBService.getStudySessions = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, db.sessions
                        .orderBy('startedAt')
                        .reverse()
                        .limit(limit)
                        .toArray()];
            });
        });
    };
    DBService.saveStudySession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db.sessions.add(__assign(__assign({}, session), { id: crypto.randomUUID() }))];
            });
        });
    };
    return DBService;
}());
export { DBService };
//# sourceMappingURL=db-service.js.map