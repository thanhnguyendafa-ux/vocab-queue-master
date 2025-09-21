import { __assign, __spreadArray } from "tslib";
import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadSampleData } from '../data/sampleData';
import { StorageService } from '../services/storageService';
// Initial state
export var initialState = {
    vocabItems: [],
    modules: [],
    projects: [],
    currentSession: null,
    settings: {
        speedMode: false,
        autoBackupInterval: 120, // 2 hours
        compactUI: false,
        language: 'en'
    },
    sampleMode: false
};
// Reducer
export function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_VOCAB_ITEM':
            return __assign(__assign({}, state), { vocabItems: __spreadArray(__spreadArray([], state.vocabItems, true), [action.payload], false) });
        case 'UPDATE_VOCAB_ITEM':
            return __assign(__assign({}, state), { vocabItems: state.vocabItems.map(function (item) {
                    return item.id === action.payload.id
                        ? __assign(__assign({}, item), action.payload.updates) : item;
                }) });
        case 'DELETE_VOCAB_ITEM':
            return __assign(__assign({}, state), { vocabItems: state.vocabItems.filter(function (item) { return item.id !== action.payload; }) });
        case 'ADD_MODULE':
            return __assign(__assign({}, state), { modules: __spreadArray(__spreadArray([], state.modules, true), [action.payload], false) });
        case 'UPDATE_MODULE':
            return __assign(__assign({}, state), { modules: state.modules.map(function (module) {
                    return module.id === action.payload.id
                        ? __assign(__assign({}, module), action.payload.updates) : module;
                }) });
        case 'DELETE_MODULE':
            return __assign(__assign({}, state), { modules: state.modules.filter(function (module) { return module.id !== action.payload; }) });
        case 'ADD_PROJECT':
            return __assign(__assign({}, state), { projects: __spreadArray(__spreadArray([], state.projects, true), [action.payload], false) });
        case 'UPDATE_PROJECT':
            return __assign(__assign({}, state), { projects: state.projects.map(function (project) {
                    return project.id === action.payload.id
                        ? __assign(__assign({}, project), action.payload.updates) : project;
                }) });
        case 'DELETE_PROJECT':
            return __assign(__assign({}, state), { projects: state.projects.filter(function (project) { return project.id !== action.payload; }) });
        case 'START_SESSION':
            return __assign(__assign({}, state), { currentSession: action.payload });
        case 'UPDATE_SESSION':
            return __assign(__assign({}, state), { currentSession: state.currentSession
                    ? __assign(__assign({}, state.currentSession), action.payload) : null });
        case 'END_SESSION':
            return __assign(__assign({}, state), { currentSession: null });
        case 'UPDATE_SETTINGS':
            return __assign(__assign({}, state), { settings: __assign(__assign({}, state.settings), action.payload) });
        case 'TOGGLE_SAMPLE_MODE':
            var newSampleMode = !state.sampleMode;
            if (newSampleMode) {
                // Load sample data
                var sampleData = loadSampleData();
                return __assign(__assign({}, state), { sampleMode: true, vocabItems: sampleData.vocabItems, modules: sampleData.modules, projects: sampleData.projects });
            }
            else {
                // Clear sample data
                return __assign(__assign({}, state), { sampleMode: false, vocabItems: [], modules: [], projects: [] });
            }
        case 'LOAD_DATA':
            return __assign(__assign({}, state), action.payload);
        default:
            return state;
    }
}
// Context
var AppContext = createContext(null);
// Provider
export function AppProvider(_a) {
    var children = _a.children;
    var _b = useReducer(appReducer, initialState), state = _b[0], dispatch = _b[1];
    // Load saved data on mount
    useEffect(function () {
        var savedData = StorageService.loadAppState();
        if (savedData) {
            dispatch({ type: 'LOAD_DATA', payload: savedData });
        }
    }, []);
    // Auto-save data
    useEffect(function () {
        if (state.vocabItems.length > 0 || state.modules.length > 0 || state.projects.length > 0) {
            StorageService.saveAppState(state);
        }
    }, [state.vocabItems, state.modules, state.projects, state.settings]);
    return (<AppContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </AppContext.Provider>);
}
// Hook
export function useApp() {
    var context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
//# sourceMappingURL=AppContext.jsx.map