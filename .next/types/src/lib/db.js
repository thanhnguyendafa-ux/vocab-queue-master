import { __extends } from "tslib";
import Dexie from 'dexie';
var AppDB = /** @class */ (function (_super) {
    __extends(AppDB, _super);
    function AppDB() {
        var _this = _super.call(this, 'VocabDB') || this;
        _this.version(1).stores({
            items: 'id, nextReviewDate',
            sessions: 'id, startedAt'
        });
        return _this;
    }
    return AppDB;
}(Dexie));
export var db = new AppDB();
//# sourceMappingURL=db.js.map