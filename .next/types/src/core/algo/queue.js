// Queue management algorithm for Vocab Queue Master
import { __assign, __spreadArray } from "tslib";
/**
 * Process an answer and update the queue accordingly
 * Rules:
 * - Incorrect: insert back at i+2, reset passed1, increment failed
 * - First correct: passed1++, move to end
 * - Second correct: passed2++, remove from session
 */
export function processAnswer(item, isCorrect, queue) {
    var updatedItem = __assign({}, item);
    var newQueue = __spreadArray([], queue, true);
    var currentIndex = newQueue.findIndex(function (q) { return q.id === item.id; });
    if (currentIndex === -1) {
        throw new Error('Item not found in queue');
    }
    // Remove item from current position
    newQueue.splice(currentIndex, 1);
    if (!isCorrect) {
        // Incorrect answer: reset passed1, increment failed, insert at i+2
        updatedItem.passed1 = 0;
        updatedItem.failed += 1;
        updatedItem.lastReviewedAt = Date.now();
        updatedItem.updatedAt = Date.now();
        var insertIndex = Math.min(currentIndex + 2, newQueue.length);
        newQueue.splice(insertIndex, 0, updatedItem);
    }
    else {
        // Correct answer
        updatedItem.lastReviewedAt = Date.now();
        updatedItem.updatedAt = Date.now();
        if (updatedItem.passed1 === 0) {
            // First-time correct: increment passed1, move to end
            updatedItem.passed1 = 1;
            newQueue.push(updatedItem);
        }
        else {
            // Second-time correct: increment passed2, remove from session
            updatedItem.passed2 += 1;
            // Item is not added back to queue (removed from session)
        }
    }
    return { updatedItem: updatedItem, newQueue: newQueue };
}
/**
 * Check if session is complete
 * Session ends when all original items have reached passed2 >= 1
 */
export function isSessionComplete(originalItems, currentQueue, completedItems) {
    // Session is complete when queue is empty (all items reached passed2)
    return currentQueue.length === 0;
}
/**
 * Create initial queue from vocabulary items
 * Sorts by urgency (most urgent first)
 */
export function createInitialQueue(items, urgencyCalculator) {
    if (!urgencyCalculator) {
        // Simple shuffle if no urgency calculator provided
        return __spreadArray([], items, true).sort(function () { return Math.random() - 0.5; });
    }
    return __spreadArray([], items, true).sort(function (a, b) { return urgencyCalculator(b) - urgencyCalculator(a); });
}
/**
 * Get session progress information
 */
export function getSessionProgress(originalItems, currentQueue, completedItems) {
    var total = originalItems.length;
    var remaining = currentQueue.length;
    var completed = total - remaining;
    var progress = total > 0 ? (completed / total) * 100 : 0;
    // Count items at different levels
    var itemsAtLevel1 = currentQueue.filter(function (item) { return item.passed1 > 0; }).length;
    var itemsAtLevel2 = completedItems.filter(function (item) { return item.passed2 > 0; }).length;
    return {
        total: total,
        completed: completed,
        remaining: remaining,
        progress: progress,
        itemsAtLevel1: itemsAtLevel1,
        itemsAtLevel2: itemsAtLevel2
    };
}
/**
 * Save queue state for resuming later
 */
export function saveQueueState(sessionId, queue, completedItems, quitCount, additionalData) {
    var state = __assign({ sessionId: sessionId, queue: queue.map(function (item) { return (__assign({}, item)); }), completedItems: completedItems.map(function (item) { return (__assign({}, item)); }), quitCount: quitCount + 1, savedAt: Date.now() }, additionalData);
    localStorage.setItem("queue_state_".concat(sessionId), JSON.stringify(state));
}
/**
 * Load saved queue state
 */
export function loadQueueState(sessionId) {
    var saved = localStorage.getItem("queue_state_".concat(sessionId));
    if (!saved)
        return null;
    try {
        return JSON.parse(saved);
    }
    catch (_a) {
        return null;
    }
}
/**
 * Clear saved queue state
 */
export function clearQueueState(sessionId) {
    localStorage.removeItem("queue_state_".concat(sessionId));
}
/**
 * Get next item from queue
 */
export function getNextItem(queue) {
    return queue.length > 0 ? queue[0] : null;
}
/**
 * Calculate session statistics
 */
export function calculateSessionStats(session, questions) {
    if (questions === void 0) { questions = []; }
    var totalQuestions = session.totalQuestions;
    var correctAnswers = session.correctAnswers;
    var accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    // Calculate response times
    var responseTimes = questions
        .filter(function (q) { return q.responseTime && q.responseTime > 0; })
        .map(function (q) { return q.responseTime; });
    var averageResponseTime = responseTimes.length > 0
        ? responseTimes.reduce(function (sum, time) { return sum + time; }, 0) / responseTimes.length
        : 0;
    // Calculate progress
    var itemsCompleted = session.originalItems.length - session.items.length;
    var itemsRemaining = session.items.length;
    var progress = session.originalItems.length > 0
        ? (itemsCompleted / session.originalItems.length) * 100
        : 0;
    var timeElapsed = Date.now() - session.startedAt;
    return {
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        accuracy: accuracy,
        averageResponseTime: averageResponseTime,
        itemsCompleted: itemsCompleted,
        itemsRemaining: itemsRemaining,
        progress: progress,
        timeElapsed: timeElapsed
    };
}
/**
 * Validate queue state integrity
 */
export function validateQueueState(originalItems, currentQueue, completedItems) {
    var errors = [];
    // Check that all items are accounted for
    var allCurrentIds = new Set(__spreadArray(__spreadArray([], currentQueue.map(function (item) { return item.id; }), true), completedItems.map(function (item) { return item.id; }), true));
    var originalIds = new Set(originalItems.map(function (item) { return item.id; }));
    // Check for missing items
    originalIds.forEach(function (id) {
        if (!allCurrentIds.has(id)) {
            errors.push("Missing item: ".concat(id));
        }
    });
    // Check for extra items
    allCurrentIds.forEach(function (id) {
        if (!originalIds.has(id)) {
            errors.push("Extra item found: ".concat(id));
        }
    });
    // Validate completed items have passed2 > 0
    completedItems.forEach(function (item) {
        if (item.passed2 === 0) {
            errors.push("Completed item ".concat(item.id, " has passed2 = 0"));
        }
    });
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
/**
 * Reorder queue based on priority/urgency
 */
export function reorderQueue(queue, urgencyCalculator, preserveFirstN) {
    if (preserveFirstN === void 0) { preserveFirstN = 3; }
    if (queue.length <= preserveFirstN) {
        return __spreadArray([], queue, true);
    }
    // Keep first N items in place, reorder the rest
    var preserved = queue.slice(0, preserveFirstN);
    var toReorder = queue.slice(preserveFirstN);
    var reordered = toReorder.sort(function (a, b) {
        return urgencyCalculator(b) - urgencyCalculator(a);
    });
    return __spreadArray(__spreadArray([], preserved, true), reordered, true);
}
/**
 * Get queue insights for debugging/analytics
 */
export function getQueueInsights(queue, completedItems) {
    var queueStats = {
        totalItems: queue.length,
        level0Items: queue.filter(function (item) { return item.passed1 === 0; }).length,
        level1Items: queue.filter(function (item) { return item.passed1 > 0; }).length,
        avgFailed: queue.length > 0
            ? queue.reduce(function (sum, item) { return sum + item.failed; }, 0) / queue.length
            : 0,
        avgPassed1: queue.length > 0
            ? queue.reduce(function (sum, item) { return sum + item.passed1; }, 0) / queue.length
            : 0
    };
    var completedStats = {
        totalCompleted: completedItems.length,
        avgPassed2: completedItems.length > 0
            ? completedItems.reduce(function (sum, item) { return sum + item.passed2; }, 0) / completedItems.length
            : 0,
        avgTotalAttempts: completedItems.length > 0
            ? completedItems.reduce(function (sum, item) { return sum + item.passed1 + item.passed2 + item.failed; }, 0) / completedItems.length
            : 0
    };
    // Distribution analysis
    var byTag = {};
    var byMasteryLevel = { low: 0, medium: 0, high: 0 };
    var allItems = __spreadArray(__spreadArray([], queue, true), completedItems, true);
    allItems.forEach(function (item) {
        // Tag distribution
        if (item.tags) {
            item.tags.forEach(function (tag) {
                byTag[tag] = (byTag[tag] || 0) + 1;
            });
        }
        // Mastery level distribution (simplified)
        var totalAttempts = item.passed1 + item.passed2 + item.failed;
        var successRate = totalAttempts > 0 ? (item.passed1 + item.passed2) / totalAttempts : 0;
        if (successRate < 0.4)
            byMasteryLevel.low++;
        else if (successRate < 0.7)
            byMasteryLevel.medium++;
        else
            byMasteryLevel.high++;
    });
    return {
        queueStats: queueStats,
        completedStats: completedStats,
        distribution: { byTag: byTag, byMasteryLevel: byMasteryLevel }
    };
}
/**
 * Handle session interruption (quit/pause)
 */
export function handleSessionInterruption(session, currentQueue, completedItems, reason) {
    if (reason === void 0) { reason = 'quit'; }
    var updatedSession = __assign(__assign({}, session), { quitCount: session.quitCount + 1, updatedAt: Date.now() });
    var shouldSave = currentQueue.length > 0; // only save if there's progress to resume
    var resumable = reason !== 'error' && currentQueue.length > 0;
    if (shouldSave) {
        saveQueueState(session.id, currentQueue, completedItems, session.quitCount, {
            reason: reason,
            interruptedAt: Date.now()
        });
    }
    return {
        updatedSession: updatedSession,
        shouldSave: shouldSave,
        resumable: resumable
    };
}
//# sourceMappingURL=queue.js.map