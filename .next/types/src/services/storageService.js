import { __assign } from "tslib";
var STORAGE_KEYS = {
    VOCAB_DATA: 'vocab-queue-data',
    SETTINGS: 'vocab-queue-settings',
    BACKUP: 'vocab-queue-backup'
};
var StorageService = /** @class */ (function () {
    function StorageService() {
    }
    // Save app state to localStorage
    StorageService.saveAppState = function (state) {
        try {
            var dataToSave = {
                vocabItems: state.vocabItems,
                modules: state.modules,
                projects: state.projects,
                settings: state.settings,
                lastBackup: Date.now()
            };
            localStorage.setItem(STORAGE_KEYS.VOCAB_DATA, JSON.stringify(dataToSave));
            return true;
        }
        catch (error) {
            console.error('Failed to save app state:', error);
            return false;
        }
    };
    // Load app state from localStorage
    StorageService.loadAppState = function () {
        try {
            var saved = localStorage.getItem(STORAGE_KEYS.VOCAB_DATA);
            if (!saved)
                return null;
            var parsed = JSON.parse(saved);
            return {
                vocabItems: parsed.vocabItems || [],
                modules: parsed.modules || [],
                projects: parsed.projects || [],
                settings: parsed.settings || {
                    speedMode: false,
                    autoBackupInterval: 120,
                    compactUI: false,
                    language: 'en'
                }
            };
        }
        catch (error) {
            console.error('Failed to load app state:', error);
            return null;
        }
    };
    // Create backup
    StorageService.createBackup = function (state) {
        try {
            var backup = __assign(__assign({}, state), { backupCreatedAt: Date.now(), version: '1.0' });
            localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
            return true;
        }
        catch (error) {
            console.error('Failed to create backup:', error);
            return false;
        }
    };
    // Load backup
    StorageService.loadBackup = function () {
        try {
            var backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
            if (!backup)
                return null;
            return JSON.parse(backup);
        }
        catch (error) {
            console.error('Failed to load backup:', error);
            return null;
        }
    };
    // Export full data as JSON
    StorageService.exportData = function (state) {
        var exportData = __assign(__assign({}, state), { exportDate: Date.now(), version: '1.0' });
        return JSON.stringify(exportData, null, 2);
    };
    // Import data from JSON
    StorageService.importData = function (jsonString) {
        try {
            var imported = JSON.parse(jsonString);
            // Validate basic structure
            if (!imported.vocabItems || !Array.isArray(imported.vocabItems)) {
                throw new Error('Invalid data format: missing vocabItems');
            }
            return {
                vocabItems: imported.vocabItems,
                modules: imported.modules || [],
                projects: imported.projects || [],
                currentSession: imported.currentSession || null,
                settings: imported.settings || {
                    speedMode: false,
                    autoBackupInterval: 120,
                    compactUI: false,
                    language: 'en'
                },
                sampleMode: imported.sampleMode || false
            };
        }
        catch (error) {
            console.error('Failed to import data:', error);
            return null;
        }
    };
    // Clear all data
    StorageService.clearAllData = function () {
        Object.values(STORAGE_KEYS).forEach(function (key) {
            localStorage.removeItem(key);
        });
    };
    // Auto-backup functionality
    StorageService.startAutoBackup = function (state, intervalMinutes) {
        var _this = this;
        if (intervalMinutes === void 0) { intervalMinutes = 120; }
        var intervalMs = intervalMinutes * 60 * 1000;
        var backup = function () {
            _this.createBackup(state);
        };
        // Initial backup
        backup();
        // Set up interval
        var intervalId = setInterval(backup, intervalMs);
        // Return cleanup function
        return function () { return clearInterval(intervalId); };
    };
    return StorageService;
}());
export { StorageService };
//# sourceMappingURL=storageService.js.map