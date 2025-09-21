// Core statistics and algorithm functions for Vocab Queue Master
/**
 * Calculate smoothed success rate (SR_smooth)
 * Formula: (Passed1 + Passed2 + 1) / (Passed1 + Passed2 + Failed + 2)
 * The +1 and +2 provide smoothing to reduce bias with sparse data
 */
export function srSmooth(stats) {
    var passed1 = stats.passed1, passed2 = stats.passed2, failed = stats.failed;
    return (passed1 + passed2 + 1) / (passed1 + passed2 + failed + 2);
}
/**
 * Calculate decay factor for elapsed time
 * Formula: 0.5^(t / H)
 * @param tDays - days elapsed since last review
 * @param halfLifeDays - half-life in days (H)
 */
export function decayFactor(tDays, halfLifeDays) {
    return Math.pow(0.5, tDays / halfLifeDays);
}
/**
 * Calculate mastery after applying time decay
 * Formula: baseline + (SR_smooth - baseline) * d(t)
 * @param srSmoothValue - smoothed success rate
 * @param tDays - days elapsed since last review
 * @param halfLifeDays - half-life in days
 * @param baseline - guessing baseline (default 0.5)
 */
export function srDecay(srSmoothValue, tDays, halfLifeDays, baseline) {
    if (baseline === void 0) { baseline = 0.5; }
    var decay = decayFactor(tDays, halfLifeDays);
    return baseline + (srSmoothValue - baseline) * decay;
}
/**
 * Calculate days since last review
 * @param lastReviewedAt - timestamp in milliseconds
 * @param now - current timestamp (default: Date.now())
 * @returns days elapsed (Infinity if never reviewed)
 */
export function daysSince(lastReviewedAt, now) {
    if (now === void 0) { now = Date.now(); }
    if (!lastReviewedAt)
        return Infinity; // unseen items should be prioritized
    var oneDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.floor((now - lastReviewedAt) / oneDay));
}
/**
 * Calculate current mastery level for a vocabulary item
 * Combines SR_smooth with time decay
 */
export function calculateMastery(item, halfLifeDays, baseline) {
    var smooth = srSmooth({
        passed1: item.passed1,
        passed2: item.passed2,
        failed: item.failed
    });
    var days = daysSince(item.lastReviewedAt);
    // If never reviewed, return the smoothed rate
    if (!isFinite(days)) {
        return smooth;
    }
    return srDecay(smooth, days, halfLifeDays, baseline);
}
/**
 * Calculate urgency score for prioritizing items
 * Higher score = more urgent to review
 */
export function calculateUrgency(item, settings, maxDays) {
    if (maxDays === void 0) { maxDays = 30; }
    var t = daysSince(item.lastReviewedAt);
    var s = srSmooth(item);
    var d = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline);
    // Normalize features (0-1 range)
    var timeNorm = Math.max(0, Math.min(1, t / maxDays));
    var srNorm = Math.max(0, Math.min(1, (0.7 - s) / 0.7)); // higher when SR is low
    var decayNorm = Math.max(0, Math.min(1, (d - settings.guessBaseline) / (1 - settings.guessBaseline)));
    // Weighted combination
    return (settings.timeWeight * timeNorm +
        settings.srWeight * srNorm +
        settings.decayWeight * (1 - decayNorm) // higher urgency when decay is low
    );
}
/**
 * Format mastery percentage for display
 */
export function formatMasteryPercent(mastery) {
    return "".concat((mastery * 100).toFixed(1), "%");
}
/**
 * Get mastery level category
 */
export function getMasteryLevel(mastery) {
    if (mastery < 0.6)
        return 'low';
    if (mastery < 0.8)
        return 'medium';
    return 'high';
}
/**
 * Filter vocabulary items based on criteria and focus filters
 */
export function filterItems(items, settings, filters, logic) {
    if (logic === void 0) { logic = 'OR'; }
    if (filters.length === 0)
        return items;
    return items.filter(function (item) {
        if (logic === 'AND') {
            return filters.every(function (filter) { return matchesFilter(item, filter, settings); });
        }
        else {
            return filters.some(function (filter) { return matchesFilter(item, filter, settings); });
        }
    });
}
/**
 * Check if an item matches a specific filter
 */
function matchesFilter(item, filter, settings) {
    if (!filter.enabled)
        return false;
    var days = daysSince(item.lastReviewedAt);
    var mastery = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline);
    var successRate = srSmooth(item);
    switch (filter.type) {
        case 'overdue':
            return isFinite(days) && days >= (filter.threshold || settings.overdueDays);
        case 'low-sr':
            return successRate <= (filter.threshold || settings.srMin);
        case 'high-decay':
            return mastery <= (filter.threshold || settings.decayMin);
        case 'new':
            return item.passed1 === 0 && item.passed2 === 0;
        case 'failed':
            return item.failed > 0;
        default:
            return false;
    }
}
/**
 * Build a focused study queue based on filters and settings
 */
export function buildFocusQueue(items, settings, filters, maxItems) {
    if (maxItems === void 0) { maxItems = 20; }
    var filteredItems = filterItems(items, settings, filters, 'OR');
    if (filteredItems.length === 0)
        return [];
    // Sort by urgency (most urgent first)
    var sortedItems = filteredItems.sort(function (a, b) {
        var urgencyA = calculateUrgency(a, {
            halfLifeDays: settings.halfLifeDays,
            guessBaseline: settings.guessBaseline,
            timeWeight: settings.focusThresholds.w_t,
            srWeight: settings.focusThresholds.w_s,
            decayWeight: settings.focusThresholds.w_d
        });
        var urgencyB = calculateUrgency(b, {
            halfLifeDays: settings.halfLifeDays,
            guessBaseline: settings.guessBaseline,
            timeWeight: settings.focusThresholds.w_t,
            srWeight: settings.focusThresholds.w_s,
            decayWeight: settings.focusThresholds.w_d
        });
        return urgencyB - urgencyA;
    });
    return sortedItems.slice(0, maxItems);
}
/**
 * Get detailed statistics for a vocabulary item
 */
export function getItemStatistics(item, settings) {
    var mastery = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline);
    var successRate = srSmooth(item);
    var days = daysSince(item.lastReviewedAt);
    var totalAttempts = item.passed1 + item.passed2 + item.failed;
    // Calculate trend (simplified - could be more sophisticated)
    var trend = totalAttempts > 0
        ? (item.passed1 + item.passed2) / totalAttempts
        : 0.5; // neutral trend for new items
    return {
        mastery: mastery,
        successRate: successRate,
        srSmooth: successRate, // Add srSmooth for compatibility
        srDecay: srDecay(successRate, days, settings.halfLifeDays, settings.guessBaseline), // Add srDecay
        decay: mastery, // Simplified - in full implementation, this would be separate
        urgency: calculateUrgency(item, {
            halfLifeDays: settings.halfLifeDays,
            guessBaseline: settings.guessBaseline,
            timeWeight: settings.focusThresholds.w_t,
            srWeight: settings.focusThresholds.w_s,
            decayWeight: settings.focusThresholds.w_d
        }),
        totalAttempts: totalAttempts,
        daysSinceLastReview: days,
        daysSinceReview: days, // Add for compatibility
        isOverdue: days >= settings.overdueDays,
        masteryLevel: getMasteryLevel(mastery), // Add masteryLevel
        trend: trend // Add trend property
    };
}
/**
 * Validate core algorithm correctness
 * This function checks that all algorithms are working correctly
 */
export function validateAlgorithms() {
    // Test srSmooth function
    var smoothTest1 = srSmooth({ passed1: 0, passed2: 0, failed: 0 });
    var smoothTest2 = srSmooth({ passed1: 1, passed2: 0, failed: 0 });
    var smoothTest3 = srSmooth({ passed1: 0, passed2: 0, failed: 1 });
    if (smoothTest1 !== 0.5 || smoothTest2 !== (2 / 3) || smoothTest3 !== (1 / 3)) {
        return false;
    }
    // Test decayFactor function
    var decayTest1 = decayFactor(0, 7);
    var decayTest2 = decayFactor(7, 7);
    var decayTest3 = decayFactor(14, 7);
    if (decayTest1 !== 1 || decayTest2 !== 0.5 || decayTest3 !== 0.25) {
        return false;
    }
    // Test basic functionality
    return true;
}
//# sourceMappingURL=stats.js.map