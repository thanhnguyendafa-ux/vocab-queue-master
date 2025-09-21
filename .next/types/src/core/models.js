// Core data models for Vocab Queue Master
export var DEFAULT_SETTINGS = {
    halfLifeDays: 7,
    guessBaseline: 0.5,
    speedMode: false,
    overdueDays: 7,
    decayMin: 0.6,
    srMin: 0.6,
    timeWeight: 0.5,
    srWeight: 0.3,
    decayWeight: 0.2,
    focusThresholds: {
        overdue_days: 7,
        decay_min: 0.6,
        sr_min: 0.6,
        w_t: 0.5,
        w_s: 0.3,
        w_d: 0.2
    }
};
export var DEFAULT_MODULE_SETTINGS = {
    mcq: {
        enabled: true,
        weight: 1.0,
        options: {
            numChoices: 4
        }
    },
    trueFalse: {
        enabled: true,
        weight: 1.0
    },
    typing: {
        enabled: true,
        weight: 1.0,
        options: {
            allowPartialCredit: true,
            caseSensitive: false
        }
    }
};
//# sourceMappingURL=models.js.map