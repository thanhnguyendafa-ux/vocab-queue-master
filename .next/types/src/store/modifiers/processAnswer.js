import { __assign } from "tslib";
import { calculateNextReview } from '../../core/algo/srs';
export function processAnswer(set, get, questionId, userAnswer, isCorrect, responseTime) {
    var _a;
    var _b = get(), currentSession = _b.currentSession, items = _b.items, settings = _b.settings;
    if (!currentSession)
        return;
    // Find the question and corresponding vocab item
    var question = currentSession.questions.find(function (q) { return q.id === questionId; });
    var vocabItem = items.find(function (item) { return item.id === (question === null || question === void 0 ? void 0 : question.item.id); });
    if (!question || !vocabItem)
        return;
    // Apply SRS algorithm
    var _c = calculateNextReview(vocabItem, isCorrect, settings), nextReview = _c.nextReview, newMastery = _c.newMastery;
    // Update state
    set({
        items: items.map(function (item) {
            var _a;
            return item.id === vocabItem.id
                ? __assign(__assign({}, item), (_a = {}, _a[isCorrect ? 'passed' + question.type : 'failed'] = item[isCorrect ? 'passed' + question.type : 'failed'] + 1, _a.lastReviewedAt = Date.now(), _a.nextReviewDate = nextReview, _a.mastery = newMastery, _a)) : item;
        }),
        currentSession: __assign(__assign({}, currentSession), (_a = { questions: currentSession.questions.map(function (q) {
                    return q.id === questionId
                        ? __assign(__assign({}, q), { userAnswer: userAnswer, isCorrect: isCorrect, answeredAt: Date.now(), responseTime: responseTime }) : q;
                }) }, _a[isCorrect ? 'correctAnswers' : 'incorrectAnswers'] = currentSession[isCorrect ? 'correctAnswers' : 'incorrectAnswers'] + 1, _a.totalQuestions = currentSession.totalQuestions + 1, _a))
    });
}
//# sourceMappingURL=processAnswer.js.map