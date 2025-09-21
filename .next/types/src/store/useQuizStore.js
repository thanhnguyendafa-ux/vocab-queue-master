// Zustand store placeholder - will be implemented in next steps
import { __assign, __spreadArray } from "tslib";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS, DEFAULT_MODULE_SETTINGS } from '../core/models';
import { calculateUrgency, filterItems, buildFocusQueue, getItemStatistics } from '../core/algo/stats';
import { processAnswer, createInitialQueue, isSessionComplete, calculateSessionStats, handleSessionInterruption, loadQueueState, clearQueueState } from '../core/algo/queue';
export var useQuizStore = create()(persist(function (set, get) { return ({
    // Initial state
    items: [],
    modules: [
        {
            id: 'mcq_default',
            name: 'Multiple Choice Questions',
            description: 'Choose the correct meaning from 4 options',
            type: 'mcq',
            settings: DEFAULT_MODULE_SETTINGS.mcq,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'tf_default',
            name: 'True or False',
            description: 'Decide if the statement is true or false',
            type: 'true-false',
            settings: DEFAULT_MODULE_SETTINGS.trueFalse,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        },
        {
            id: 'typing_default',
            name: 'Type the Answer',
            description: 'Type the correct meaning or term',
            type: 'typing',
            settings: DEFAULT_MODULE_SETTINGS.typing,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    ],
    projects: [],
    settings: DEFAULT_SETTINGS,
    currentSession: null,
    sessionHistory: [],
    currentQuestions: [],
    completedItems: [],
    loading: false,
    error: null,
    // Item management actions
    addItem: function (itemData) {
        var newItem = __assign(__assign({}, itemData), { id: "item_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), passed1: 0, passed2: 0, failed: 0, createdAt: Date.now(), updatedAt: Date.now() });
        set(function (state) { return ({
            items: __spreadArray(__spreadArray([], state.items, true), [newItem], false)
        }); });
    },
    updateItem: function (id, updates) {
        set(function (state) { return ({
            items: state.items.map(function (item) {
                return item.id === id
                    ? __assign(__assign(__assign({}, item), updates), { updatedAt: Date.now() }) : item;
            })
        }); });
    },
    deleteItem: function (id) {
        set(function (state) { return ({
            items: state.items.filter(function (item) { return item.id !== id; }),
            projects: state.projects.map(function (project) { return (__assign(__assign({}, project), { items: project.items.filter(function (itemId) { return itemId !== id; }) })); })
        }); });
    },
    importItems: function (items) {
        set(function (state) { return ({
            items: __spreadArray(__spreadArray([], state.items, true), items, true)
        }); });
    },
    // Module management actions
    addModule: function (moduleData) {
        var newModule = __assign(__assign({}, moduleData), { id: "module_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), createdAt: Date.now(), updatedAt: Date.now() });
        set(function (state) { return ({
            modules: __spreadArray(__spreadArray([], state.modules, true), [newModule], false)
        }); });
    },
    updateModule: function (id, updates) {
        set(function (state) { return ({
            modules: state.modules.map(function (module) {
                return module.id === id
                    ? __assign(__assign(__assign({}, module), updates), { updatedAt: Date.now() }) : module;
            })
        }); });
    },
    deleteModule: function (id) {
        set(function (state) { return ({
            modules: state.modules.filter(function (module) { return module.id !== id; }),
            projects: state.projects.map(function (project) { return (__assign(__assign({}, project), { modules: project.modules.filter(function (moduleId) { return moduleId !== id; }) })); })
        }); });
    },
    // Project management actions
    addProject: function (projectData) {
        var newProject = __assign(__assign({}, projectData), { id: "project_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), createdAt: Date.now(), updatedAt: Date.now() });
        set(function (state) { return ({
            projects: __spreadArray(__spreadArray([], state.projects, true), [newProject], false)
        }); });
    },
    updateProject: function (id, updates) {
        set(function (state) { return ({
            projects: state.projects.map(function (project) {
                return project.id === id
                    ? __assign(__assign(__assign({}, project), updates), { updatedAt: Date.now() }) : project;
            })
        }); });
    },
    deleteProject: function (id) {
        set(function (state) { return ({
            projects: state.projects.filter(function (project) { return project.id !== id; })
        }); });
    },
    // Session management actions
    startSession: function (projectId, options) {
        if (options === void 0) { options = {}; }
        var state = get();
        var project = state.projects.find(function (p) { return p.id === projectId; });
        if (!project)
            return;
        var projectItems = state.items.filter(function (item) {
            return project.items.includes(item.id);
        });
        // Apply focus filters if specified
        var sessionItems = projectItems;
        if (options.focusFilters && options.focusFilters.length > 0) {
            sessionItems = buildFocusQueue(projectItems, state.settings, options.focusFilters, options.maxItems || 20);
        }
        else if (options.maxItems && sessionItems.length > options.maxItems) {
            // Sort by urgency and take top items
            var urgencyCalculator = function (item) { return calculateUrgency(item, {
                halfLifeDays: state.settings.halfLifeDays,
                guessBaseline: state.settings.guessBaseline,
                timeWeight: state.settings.focusThresholds.w_t,
                srWeight: state.settings.focusThresholds.w_s,
                decayWeight: state.settings.focusThresholds.w_d
            }); };
            sessionItems = createInitialQueue(sessionItems, urgencyCalculator)
                .slice(0, options.maxItems);
        }
        else {
            // Create initial queue with urgency-based ordering
            var urgencyCalculator = function (item) { return calculateUrgency(item, {
                halfLifeDays: state.settings.halfLifeDays,
                guessBaseline: state.settings.guessBaseline,
                timeWeight: state.settings.focusThresholds.w_t,
                srWeight: state.settings.focusThresholds.w_s,
                decayWeight: state.settings.focusThresholds.w_d
            }); };
            sessionItems = createInitialQueue(sessionItems, urgencyCalculator);
        }
        var newSession = {
            id: "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)),
            projectId: projectId,
            items: __spreadArray([], sessionItems, true),
            originalItems: __spreadArray([], sessionItems, true),
            currentIndex: 0,
            completed: false,
            startedAt: Date.now(),
            quitCount: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            settings: {
                modules: options.modules || project.modules,
                maxItems: options.maxItems || sessionItems.length,
                focusMode: options.focusFilters
            }
        };
        set(function () { return ({
            currentSession: newSession,
            currentQuestions: [],
            completedItems: []
        }); });
    },
    processAnswer: function (questionId, answer, isCorrect, responseTime) {
        set(function (state) {
            if (!state.currentSession)
                return state;
            var question = state.currentQuestions.find(function (q) { return q.id === questionId; });
            if (!question)
                return state;
            // Update question with answer
            var updatedQuestions = state.currentQuestions.map(function (q) {
                return q.id === questionId
                    ? __assign(__assign({}, q), { userAnswer: answer, isCorrect: isCorrect, answeredAt: Date.now(), responseTime: responseTime }) : q;
            });
            // Process the answer using queue algorithm
            var currentItem = state.currentSession.items.find(function (item) { return item.id === question.item.id; });
            if (!currentItem)
                return state;
            var _a = processAnswer(currentItem, isCorrect, state.currentSession.items), updatedItem = _a.updatedItem, newQueue = _a.newQueue;
            // Update the item in the main items array
            var updatedItems = state.items.map(function (item) {
                return item.id === updatedItem.id ? updatedItem : item;
            });
            // Update completed items if item was removed from queue
            var updatedCompletedItems = state.completedItems;
            if (!newQueue.find(function (item) { return item.id === updatedItem.id; }) && updatedItem.passed2 > 0) {
                updatedCompletedItems = __spreadArray(__spreadArray([], state.completedItems, true), [updatedItem], false);
            }
            // Check if session is complete
            var sessionComplete = isSessionComplete(state.currentSession.originalItems, newQueue, updatedCompletedItems);
            var updatedSession = __assign(__assign({}, state.currentSession), { items: newQueue, currentIndex: Math.min(state.currentSession.currentIndex, newQueue.length - 1), totalQuestions: state.currentSession.totalQuestions + 1, correctAnswers: state.currentSession.correctAnswers + (isCorrect ? 1 : 0), completed: sessionComplete, completedAt: sessionComplete ? Date.now() : undefined });
            return {
                items: updatedItems,
                currentSession: sessionComplete ? null : updatedSession,
                sessionHistory: sessionComplete
                    ? __spreadArray(__spreadArray([], state.sessionHistory, true), [updatedSession], false) : state.sessionHistory,
                currentQuestions: updatedQuestions,
                completedItems: updatedCompletedItems
            };
        });
    },
    quitSession: function () {
        set(function (state) {
            if (!state.currentSession)
                return state;
            var _a = handleSessionInterruption(state.currentSession, state.currentSession.items, state.completedItems, 'quit'), updatedSession = _a.updatedSession, shouldSave = _a.shouldSave;
            return {
                currentSession: null,
                sessionHistory: __spreadArray(__spreadArray([], state.sessionHistory, true), [updatedSession], false),
                currentQuestions: [],
                completedItems: []
            };
        });
    },
    completeSession: function () {
        set(function (state) {
            if (!state.currentSession)
                return state;
            var completedSession = __assign(__assign({}, state.currentSession), { completed: true, completedAt: Date.now() });
            // Clear any saved queue state since session is complete
            clearQueueState(state.currentSession.id);
            return {
                currentSession: null,
                sessionHistory: __spreadArray(__spreadArray([], state.sessionHistory, true), [completedSession], false),
                currentQuestions: [],
                completedItems: []
            };
        });
    },
    resumeSession: function (sessionId) {
        var state = get();
        var savedState = loadQueueState(sessionId);
        if (savedState) {
            var session_1 = state.sessionHistory.find(function (s) { return s.id === sessionId; });
            if (session_1 && !session_1.completed) {
                set(function () { return ({
                    currentSession: __assign(__assign({}, session_1), { items: savedState.queue, quitCount: savedState.quitCount }),
                    sessionHistory: state.sessionHistory.filter(function (s) { return s.id !== sessionId; }),
                    completedItems: savedState.completedItems || [],
                    currentQuestions: []
                }); });
            }
        }
    },
    // Settings actions
    updateSettings: function (updates) {
        set(function (state) { return ({
            settings: __assign(__assign({}, state.settings), updates)
        }); });
    },
    resetSettings: function () {
        set(function () { return ({
            settings: DEFAULT_SETTINGS
        }); });
    },
    // Statistics and filtering actions
    getItemStats: function (itemId) {
        var state = get();
        var item = state.items.find(function (i) { return i.id === itemId; });
        if (!item)
            return null;
        return getItemStatistics(item, state.settings);
    },
    getSessionStats: function () {
        var state = get();
        if (!state.currentSession)
            return null;
        return calculateSessionStats(state.currentSession, state.currentQuestions);
    },
    getFilteredItems: function (filters, logic) {
        if (logic === void 0) { logic = 'OR'; }
        var state = get();
        return filterItems(state.items, state.settings, filters, logic);
    },
    getFocusQueue: function (filters, maxItems) {
        if (maxItems === void 0) { maxItems = 20; }
        var state = get();
        return buildFocusQueue(state.items, state.settings, filters, maxItems);
    },
    // Data management actions
    exportData: function () {
        var state = get();
        return JSON.stringify({
            version: '1.0.0',
            createdAt: Date.now(),
            data: {
                items: state.items,
                modules: state.modules,
                projects: state.projects,
                settings: state.settings
            }
        }, null, 2);
    },
    importData: function (jsonData) {
        try {
            var backup_1 = JSON.parse(jsonData);
            if (backup_1.data) {
                set(function () { return ({
                    items: backup_1.data.items || [],
                    modules: backup_1.data.modules || [],
                    projects: backup_1.data.projects || [],
                    settings: __assign(__assign({}, DEFAULT_SETTINGS), backup_1.data.settings)
                }); });
            }
        }
        catch (error) {
            console.error('Failed to import data:', error);
            get().setError('Failed to import data. Please check the file format.');
        }
    },
    clearAllData: function () {
        set(function () { return ({
            items: [],
            projects: [],
            currentSession: null,
            sessionHistory: [],
            currentQuestions: [],
            completedItems: [],
            settings: DEFAULT_SETTINGS
        }); });
    },
    // UI state actions
    setLoading: function (loading) {
        set(function () { return ({ loading: loading }); });
    },
    setError: function (error) {
        set(function () { return ({ error: error }); });
    }
}); }, {
    name: 'vocab-queue-master-store',
    partialize: function (state) { return ({
        items: state.items,
        modules: state.modules,
        projects: state.projects,
        settings: state.settings,
        sessionHistory: state.sessionHistory
    }); }
}));
//# sourceMappingURL=useQuizStore.js.map