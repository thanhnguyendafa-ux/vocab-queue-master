export function calculateNextReview(item, isCorrect, settings) {
    // SM-2 inspired algorithm
    var halfLifeDays = settings.halfLifeDays, guessBaseline = settings.guessBaseline;
    var currentMastery = calculateMastery(item, halfLifeDays, guessBaseline);
    var newMastery = isCorrect
        ? Math.min(currentMastery + 0.3, 1.0)
        : Math.max(currentMastery - 0.2, 0.1);
    // Convert mastery to days (half-life formula)
    var nextReviewDays = halfLifeDays * (-Math.log(newMastery) / Math.log(2));
    return {
        nextReview: Date.now() + nextReviewDays * 86400000,
        newMastery: newMastery
    };
}
function calculateMastery(item, halfLifeDays, guessBaseline) {
    // Existing mastery calculation logic
    return 0.7; // Placeholder
}
//# sourceMappingURL=srs.js.map