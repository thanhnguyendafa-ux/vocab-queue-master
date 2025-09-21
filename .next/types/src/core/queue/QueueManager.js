import { __spreadArray } from "tslib";
var QueueManager = /** @class */ (function () {
    function QueueManager(items) {
        this.queue = [];
        this.states = new Map();
        this.originalOrder = [];
        this.initializeQueue(items);
    }
    QueueManager.prototype.initializeQueue = function (items) {
        var _this = this;
        this.queue = __spreadArray([], items, true);
        this.originalOrder = items.map(function (item) { return item.id; });
        items.forEach(function (item) {
            _this.states.set(item.id, {
                tempPassed1: 0,
                tempPassed2: 0,
                tempFailed: 0
            });
        });
    };
    QueueManager.prototype.processAnswer = function (itemId, isCorrect) {
        var state = this.states.get(itemId);
        if (!state)
            return { nextItem: null, isComplete: true };
        var itemIndex = this.queue.findIndex(function (item) { return item.id === itemId; });
        if (itemIndex === -1)
            return { nextItem: null, isComplete: true };
        if (isCorrect) {
            if (state.tempPassed1 === 0) {
                // First correct answer
                state.tempPassed1 = 1;
                // Move to end of queue
                var item = this.queue.splice(itemIndex, 1)[0];
                this.queue.push(item);
            }
            else {
                // Second correct answer
                state.tempPassed2 = 1;
                // Remove from queue
                this.queue = this.queue.filter(function (item) { return item.id !== itemId; });
            }
        }
        else {
            // Incorrect answer
            state.tempFailed++;
            if (state.tempPassed1 === 1) {
                // Reset progress if they had previously passed once
                state.tempPassed1 = 0;
            }
            // Reinsert at i+2 position (or end if not enough items)
            var newPosition = Math.min(itemIndex + 2, this.queue.length);
            var item = this.queue.splice(itemIndex, 1)[0];
            this.queue.splice(newPosition, 0, item);
        }
        this.states.set(itemId, state);
        // Check if session is complete
        var isComplete = Array.from(this.states.values())
            .every(function (state) { return state.tempPassed2 === 1; });
        return {
            nextItem: this.queue[0] || null,
            isComplete: isComplete
        };
    };
    QueueManager.prototype.getCurrentState = function () {
        return {
            queue: __spreadArray([], this.queue, true),
            states: new Map(this.states),
            originalOrder: __spreadArray([], this.originalOrder, true)
        };
    };
    QueueManager.prototype.getProgress = function () {
        var states = Array.from(this.states.values());
        var total = states.length;
        var completed = states.filter(function (s) { return s.tempPassed2 === 1; }).length;
        return {
            completed: completed,
            total: total,
            progress: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    };
    return QueueManager;
}());
export { QueueManager };
//# sourceMappingURL=QueueManager.js.map