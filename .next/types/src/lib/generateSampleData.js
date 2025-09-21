export function generateSampleAnalyticsData() {
    return {
        items: Array.from({ length: 20 }, function (_, i) { return ({
            id: "item".concat(i),
            term: "Term ".concat(i),
            mastery: Math.min(0.9, (i * 0.05) + 0.1)
        }); }),
        sessions: Array.from({ length: 14 }, function (_, i) { return ({
            startedAt: Date.now() - (i * 86400000),
            correctAnswers: Math.floor(Math.random() * 15) + 5,
            totalQuestions: 20
        }); })
    };
}
//# sourceMappingURL=generateSampleData.js.map