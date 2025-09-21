import { __assign, __spreadArray } from "tslib";
var QueueService = /** @class */ (function () {
    function QueueService() {
    }
    // Create initial queue from selected items
    QueueService.createQueue = function (items) {
        return items.map(function (item, index) { return (__assign(__assign({}, item), { tempPassed1: 0, tempPassed2: 0, tempFailed: 0, currentIndex: index })); });
    };
    // Process user answer and update queue
    QueueService.processAnswer = function (queue, currentItem, isCorrect, questionType) {
        var updatedQueue = __spreadArray([], queue, true);
        var nextIndex = 0;
        if (isCorrect) {
            // Correct answer
            if (questionType === 'typing') {
                // For typing questions, check if this is first or second correct
                if (currentItem.tempPassed1 === 1) {
                    // Second correct - mark as passed2 and remove from queue
                    updatedQueue = updatedQueue.filter(function (item) { return item.id !== currentItem.id; });
                    // Find the new current index (next item in original order)
                    var remainingItems = updatedQueue.filter(function (item) { return item.currentIndex > currentItem.currentIndex; });
                    nextIndex = remainingItems.length > 0 ? Math.min.apply(Math, remainingItems.map(function (item) { return item.currentIndex; })) : 0;
                }
                else {
                    // First correct - mark as passed1 and move to end
                    updatedQueue = updatedQueue.filter(function (item) { return item.id !== currentItem.id; });
                    updatedQueue.push(__assign(__assign({}, currentItem), { tempPassed1: 1, currentIndex: Math.max.apply(Math, __spreadArray(__spreadArray([], updatedQueue.map(function (item) { return item.currentIndex; }), false), [0], false)) + 1 }));
                    nextIndex = Math.min.apply(Math, updatedQueue.map(function (item) { return item.currentIndex; }));
                }
            }
            else {
                // For MCQ/True-False, single correct is enough
                updatedQueue = updatedQueue.filter(function (item) { return item.id !== currentItem.id; });
                var remainingItems = updatedQueue.filter(function (item) { return item.currentIndex > currentItem.currentIndex; });
                nextIndex = remainingItems.length > 0 ? Math.min.apply(Math, remainingItems.map(function (item) { return item.currentIndex; })) : 0;
            }
        }
        else {
            // Incorrect answer
            var updatedItem = __assign(__assign({}, currentItem), { tempPassed1: 0, tempFailed: currentItem.tempFailed + 1 });
            // Remove current item
            updatedQueue = updatedQueue.filter(function (item) { return item.id !== currentItem.id; });
            // Find insertion point (position i+2 from original position)
            var originalIndex = currentItem.currentIndex;
            var insertIndex = Math.min(originalIndex + 2, updatedQueue.length);
            // Insert at the calculated position
            updatedQueue.splice(insertIndex, 0, __assign(__assign({}, updatedItem), { currentIndex: insertIndex }));
            // Update indices for items after insertion point
            for (var i = insertIndex + 1; i < updatedQueue.length; i++) {
                updatedQueue[i].currentIndex = i;
            }
            nextIndex = insertIndex;
        }
        // Check if session is completed
        var completed = updatedQueue.every(function (item) { return item.tempPassed2 === 1; });
        return {
            updatedQueue: updatedQueue,
            nextIndex: nextIndex,
            completed: completed
        };
    };
    // Generate MCQ question
    QueueService.generateMCQQuestion = function (item, allItems, distractors) {
        if (distractors === void 0) { distractors = 3; }
        var correctAnswer = item.keyword;
        var question = item.definition;
        // Generate distractors (other keywords)
        var otherItems = allItems.filter(function (i) { return i.id !== item.id; });
        var distractorOptions = otherItems
            .sort(function () { return Math.random() - 0.5; })
            .slice(0, distractors)
            .map(function (i) { return i.keyword; });
        // Combine correct answer with distractors
        var options = __spreadArray([correctAnswer], distractorOptions, true).sort(function () { return Math.random() - 0.5; }); // Shuffle
        return {
            id: "mcq-".concat(item.id),
            type: 'mcq',
            item: item,
            question: question,
            correctAnswer: correctAnswer,
            options: options
        };
    };
    // Generate True/False question
    QueueService.generateTrueFalseQuestion = function (item) {
        var correctAnswer = item.keyword;
        var question = "Is the definition \"".concat(item.definition, "\" correct for the word \"").concat(correctAnswer, "\"?");
        return {
            id: "tf-".concat(item.id),
            type: 'true-false',
            item: item,
            question: question,
            correctAnswer: 'true',
            options: ['true', 'false']
        };
    };
    // Generate Typing question
    QueueService.generateTypingQuestion = function (item) {
        var correctAnswer = item.keyword;
        var question = item.definition;
        return {
            id: "typing-".concat(item.id),
            type: 'typing',
            item: item,
            question: question,
            correctAnswer: correctAnswer
        };
    };
    // Calculate urgency score for item prioritization
    QueueService.calculateUrgency = function (item) {
        var now = Date.now();
        var daysSincePractice = item.lastDayPractice
            ? Math.floor((now - new Date(item.lastDayPractice).getTime()) / (24 * 60 * 60 * 1000))
            : 30; // Default to high urgency if never practiced
        // Factors affecting urgency:
        // 1. Time since last practice (older = more urgent)
        // 2. Success rate (lower = more urgent)
        // 3. Failed count (higher = more urgent)
        var timeUrgency = Math.min(daysSincePractice / 30, 1); // Normalize to 0-1
        var srUrgency = Math.max(0, (1 - item.successRate)); // Lower SR = higher urgency
        var failUrgency = Math.min(item.failed / 10, 1); // Normalize failed count
        // Weighted combination
        return (timeUrgency * 0.4) + (srUrgency * 0.4) + (failUrgency * 0.2);
    };
    // Sort items by urgency (most urgent first)
    QueueService.sortByUrgency = function (items) {
        var _this = this;
        return items.sort(function (a, b) { return _this.calculateUrgency(b) - _this.calculateUrgency(a); });
    };
    return QueueService;
}());
export { QueueService };
//# sourceMappingURL=queueService.js.map