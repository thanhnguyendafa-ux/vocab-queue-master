import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { QueueManager } from '../queue/QueueManager';
import { DBService } from '../../services/db-service';
var StudySessionManager = /** @class */ (function () {
    function StudySessionManager() {
        this.queueManager = null;
        this.currentSession = null;
        this.startTime = 0;
    }
    StudySessionManager.prototype.startSession = function (projectId_1) {
        return __awaiter(this, arguments, void 0, function (projectId, maxItems) {
            var project, allItems, sessionItems;
            if (maxItems === void 0) { maxItems = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            throw new Error('Project not found');
                        return [4 /*yield*/, DBService.getVocabItems(projectId)];
                    case 2:
                        allItems = _a.sent();
                        sessionItems = this.selectSessionItems(allItems, maxItems);
                        // Initialize queue
                        this.queueManager = new QueueManager(sessionItems);
                        // Create new session
                        this.currentSession = {
                            id: crypto.randomUUID(),
                            projectId: projectId,
                            items: sessionItems.map(function (item) { return item.id; }),
                            originalItems: __spreadArray([], sessionItems, true),
                            currentIndex: 0,
                            completed: false,
                            startedAt: Date.now(),
                            quitCount: 0,
                            totalQuestions: sessionItems.length,
                            correctAnswers: 0,
                            settings: {
                                modules: project.modules,
                                maxItems: maxItems,
                                focusMode: []
                            }
                        };
                        this.startTime = Date.now();
                        return [4 /*yield*/, DBService.saveStudySession(this.currentSession)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.getNextQuestion()];
                }
            });
        });
    };
    StudySessionManager.prototype.selectSessionItems = function (items, maxItems) {
        // Simple implementation - prioritize items that need review
        var sorted = __spreadArray([], items, true).sort(function (a, b) {
            // Sort by last reviewed date (oldest first)
            var aTime = a.lastReviewedAt || 0;
            var bTime = b.lastReviewedAt || 0;
            return aTime - bTime;
        });
        return sorted.slice(0, maxItems);
    };
    StudySessionManager.prototype.processAnswer = function (questionId, isCorrect) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nextItem, isComplete, nextQuestion;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.queueManager || !this.currentSession) {
                            throw new Error('No active session');
                        }
                        _a = this.queueManager.processAnswer(questionId, isCorrect), nextItem = _a.nextItem, isComplete = _a.isComplete;
                        if (!this.currentSession) return [3 /*break*/, 2];
                        if (isCorrect) {
                            this.currentSession.correctAnswers++;
                        }
                        // Update current item stats in the database
                        return [4 /*yield*/, DBService.updateVocabItem(questionId, __assign({ lastReviewedAt: Date.now() }, (isCorrect
                                ? { passed1: 1 } // Simplified - should update based on temp state
                                : { failed: 1 })))];
                    case 1:
                        // Update current item stats in the database
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        nextQuestion = null;
                        if (!isComplete && nextItem) {
                            nextQuestion = this.createQuestion(nextItem);
                        }
                        if (!this.currentSession) return [3 /*break*/, 4];
                        this.currentSession.completed = isComplete;
                        if (isComplete) {
                            this.currentSession.completedAt = Date.now();
                        }
                        return [4 /*yield*/, DBService.saveStudySession(this.currentSession)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, {
                            nextQuestion: nextQuestion,
                            isComplete: isComplete,
                            feedback: {
                                isCorrect: isCorrect,
                                progress: this.queueManager.getProgress()
                            }
                        }];
                }
            });
        });
    };
    StudySessionManager.prototype.createQuestion = function (item) {
        // Simple implementation - always create MCQ for now
        return {
            id: item.id,
            type: 'mcq',
            item: item,
            options: this.generateOptions(item),
            correctAnswer: item.meaning,
            answeredAt: undefined,
            isCorrect: undefined,
            responseTime: undefined
        };
    };
    StudySessionManager.prototype.generateOptions = function (correctItem) {
        // In a real app, we would fetch other items to use as distractors
        // This is a simplified version
        var options = [correctItem.meaning];
        // Add some dummy options
        options.push('Incorrect Option 1');
        options.push('Incorrect Option 2');
        options.push('Incorrect Option 3');
        // Shuffle options
        return options.sort(function () { return Math.random() - 0.5; });
    };
    StudySessionManager.prototype.endSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentSession)
                            return [2 /*return*/];
                        if (!!this.currentSession.completed) return [3 /*break*/, 2];
                        this.currentSession.completed = true;
                        this.currentSession.completedAt = Date.now();
                        return [4 /*yield*/, DBService.saveStudySession(this.currentSession)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // Clean up
                        this.queueManager = null;
                        this.currentSession = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    StudySessionManager.prototype.getSessionStats = function () {
        if (!this.queueManager || !this.currentSession) {
            return null;
        }
        var progress = this.queueManager.getProgress();
        var timeElapsed = Date.now() - this.startTime;
        return {
            totalQuestions: this.currentSession.totalQuestions,
            correctAnswers: this.currentSession.correctAnswers,
            accuracy: this.currentSession.totalQuestions > 0
                ? Math.round((this.currentSession.correctAnswers / this.currentSession.totalQuestions) * 100)
                : 0,
            progress: progress.progress,
            timeElapsed: timeElapsed,
            itemsRemaining: progress.total - progress.completed
        };
    };
    return StudySessionManager;
}());
export { StudySessionManager };
//# sourceMappingURL=StudySessionManager.js.map