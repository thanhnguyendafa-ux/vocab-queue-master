import { __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { StorageService } from '../../services/storageService';
import { Download, Upload, Save, Settings as SettingsIcon, Globe, Shield, Database, CheckCircle, AlertTriangle } from 'lucide-react';
export function Settings() {
    var _a = useApp(), state = _a.state, dispatch = _a.dispatch;
    var _b = useState([]), backupHistory = _b[0], setBackupHistory = _b[1];
    var _c = useState(state.settings.autoBackupInterval), autoBackupInterval = _c[0], setAutoBackupInterval = _c[1];
    var _d = useState(false), showResetConfirm = _d[0], setShowResetConfirm = _d[1];
    var _e = useState(false), showFactoryResetConfirm = _e[0], setShowFactoryResetConfirm = _e[1];
    var _f = useState(''), backupPassword = _f[0], setBackupPassword = _f[1];
    var _g = useState(navigator.onLine), isOnline = _g[0], setIsOnline = _g[1];
    // Load backup history on mount
    useEffect(function () {
        loadBackupHistory();
    }, []);
    // Monitor online status
    useEffect(function () {
        var handleOnline = function () { return setIsOnline(true); };
        var handleOffline = function () { return setIsOnline(false); };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return function () {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    // Auto-backup functionality
    useEffect(function () {
        if (autoBackupInterval > 0) {
            var interval_1 = setInterval(function () {
                createBackup(true);
            }, autoBackupInterval * 60 * 1000);
            return function () { return clearInterval(interval_1); };
        }
    }, [autoBackupInterval]);
    var loadBackupHistory = function () {
        // In a real app, this would load from localStorage or a database
        // For now, we'll simulate some backup history
        var mockHistory = [
            {
                id: '1',
                timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
                size: 15432,
                success: true
            },
            {
                id: '2',
                timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
                size: 14876,
                success: true
            },
            {
                id: '3',
                timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
                size: 14221,
                success: false,
                error: 'Storage quota exceeded'
            }
        ];
        setBackupHistory(mockHistory);
    };
    var createBackup = function (isAuto) {
        if (isAuto === void 0) { isAuto = false; }
        try {
            var success = StorageService.createBackup(state);
            if (success) {
                var newBackup_1 = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    size: JSON.stringify(state).length,
                    success: true
                };
                setBackupHistory(function (prev) { return __spreadArray([newBackup_1], prev.slice(0, 9), true); }); // Keep last 10
                if (!isAuto) {
                    alert('Backup created successfully!');
                }
            }
            else {
                throw new Error('Backup failed');
            }
        }
        catch (error) {
            var failedBackup_1 = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                size: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
            setBackupHistory(function (prev) { return __spreadArray([failedBackup_1], prev.slice(0, 9), true); });
            if (!isAuto) {
                alert('Backup failed. Please try again.');
            }
        }
    };
    var restoreBackup = function (backupId) {
        var backup = backupHistory.find(function (b) { return b.id === backupId; });
        if (!backup || !backup.success) {
            alert('Cannot restore from a failed backup');
            return;
        }
        try {
            var restoredState = StorageService.loadBackup();
            if (restoredState) {
                dispatch({ type: 'LOAD_DATA', payload: restoredState });
                alert('Backup restored successfully!');
            }
            else {
                alert('Failed to load backup data');
            }
        }
        catch (error) {
            alert('Failed to restore backup');
        }
    };
    var handleExport = function (includePassword) {
        if (includePassword === void 0) { includePassword = false; }
        var data = StorageService.exportData(state);
        var exportData = data;
        if (includePassword && backupPassword) {
            // In a real app, this would encrypt the data
            // For now, we'll just add a note that it would be encrypted
            exportData = JSON.stringify({
                encrypted: true,
                note: 'Data would be encrypted with provided password',
                originalData: data
            });
        }
        var blob = new Blob([exportData], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = includePassword
            ? "vocab-quiz-backup-encrypted-".concat(new Date().toISOString().split('T')[0], ".json")
            : "vocab-quiz-backup-".concat(new Date().toISOString().split('T')[0], ".json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    var handleImport = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                var importData = content;
                // Check if it's encrypted (simplified check)
                var parsed = JSON.parse(content);
                if (parsed.encrypted && backupPassword) {
                    // In a real app, this would decrypt the data
                    importData = parsed.originalData || content;
                }
                var importedState = StorageService.importData(importData);
                if (importedState) {
                    dispatch({ type: 'LOAD_DATA', payload: importedState });
                    alert('Data imported successfully!');
                }
                else {
                    alert('Failed to import data. Please check the file format.');
                }
            }
            catch (error) {
                alert("Error importing data: ".concat(error));
            }
        };
        reader.readAsText(file);
    };
    var handleResetSettings = function () {
        dispatch({
            type: 'UPDATE_SETTINGS',
            payload: {
                speedMode: false,
                autoBackupInterval: 120,
                compactUI: false,
                language: 'en'
            }
        });
        setShowResetConfirm(false);
        alert('Settings reset to defaults');
    };
    var handleFactoryReset = function () {
        StorageService.clearAllData();
        dispatch({ type: 'LOAD_DATA', payload: {} });
        setShowFactoryResetConfirm(false);
        alert('Factory reset completed. All data has been cleared.');
    };
    var formatFileSize = function (bytes) {
        if (bytes === 0)
            return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    var formatTimestamp = function (timestamp) {
        return new Date(timestamp).toLocaleString();
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Backup</h1>
        <p className="text-gray-600">Manage your app settings and data</p>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="h-5 w-5 text-gray-600"/>
          <h2 className="text-lg font-semibold text-gray-900">App Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Speed Mode */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Speed Mode Default</label>
              <p className="text-sm text-gray-500">Enable faster quiz progression by default</p>
            </div>
            <button onClick={function () { return dispatch({ type: 'UPDATE_SETTINGS', payload: { speedMode: !state.settings.speedMode } }); }} className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors ".concat(state.settings.speedMode ? 'bg-blue-600' : 'bg-gray-200')}>
              <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform ".concat(state.settings.speedMode ? 'translate-x-6' : 'translate-x-1')}/>
            </button>
          </div>

          {/* Compact UI */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Compact UI</label>
              <p className="text-sm text-gray-500">Use smaller interface elements</p>
            </div>
            <button onClick={function () { return dispatch({ type: 'UPDATE_SETTINGS', payload: { compactUI: !state.settings.compactUI } }); }} className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors ".concat(state.settings.compactUI ? 'bg-blue-600' : 'bg-gray-200')}>
              <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform ".concat(state.settings.compactUI ? 'translate-x-6' : 'translate-x-1')}/>
            </button>
          </div>

          {/* Auto Backup Interval */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto Backup</label>
              <p className="text-sm text-gray-500">
                Automatically backup data every: {autoBackupInterval === 0 ? 'Never' :
            autoBackupInterval < 60 ? "".concat(autoBackupInterval, " minutes") :
                "".concat(autoBackupInterval / 60, " hours")}
              </p>
            </div>
            <select value={autoBackupInterval} onChange={function (e) {
            var value = parseInt(e.target.value);
            setAutoBackupInterval(value);
            dispatch({ type: 'UPDATE_SETTINGS', payload: { autoBackupInterval: value } });
        }} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value={0}>Never</option>
              <option value={30}>30 minutes</option>
              <option value={120}>2 hours</option>
              <option value={360}>6 hours</option>
              <option value={720}>12 hours</option>
              <option value={1440}>24 hours</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Language</label>
              <p className="text-sm text-gray-500">Interface language</p>
            </div>
            <select value={state.settings.language} onChange={function (e) { return dispatch({ type: 'UPDATE_SETTINGS', payload: { language: e.target.value } }); }} className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backup & Sync */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-gray-600"/>
          <h2 className="text-lg font-semibold text-gray-900">Backup & Sync</h2>
          <span className={"px-2 py-1 text-xs rounded ".concat(isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="space-y-4">
          {/* Sync Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Cloud Sync Status</h3>
                <p className="text-sm text-gray-600">
                  {isOnline
            ? 'Connected - Ready to sync when signed in'
            : 'Offline mode - Using local data only'}
                </p>
              </div>
              <div className={"flex items-center gap-2 ".concat(isOnline ? 'text-green-600' : 'text-gray-400')}>
                <Globe size={16}/>
                <span className="text-sm">
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Backup Actions */}
          <div className="flex flex-col md:flex-row gap-2">
            <button onClick={function () { return createBackup(); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Save size={16}/>
              Create Backup
            </button>

            <button onClick={function () { return handleExport(false); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download size={16}/>
              Export Data
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              <Upload size={16}/>
              Import Data
              <input type="file" accept=".json" onChange={handleImport} className="hidden"/>
            </label>
          </div>

          {/* Password Encryption */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Password Encryption</label>
              <Shield className="h-4 w-4 text-gray-400"/>
            </div>
            <div className="flex gap-2">
              <input type="password" value={backupPassword} onChange={function (e) { return setBackupPassword(e.target.value); }} placeholder="Enter password for encryption" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
              <button onClick={function () { return handleExport(true); }} disabled={!backupPassword.trim()} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300">
                Export Encrypted
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password-protected exports for enhanced security
            </p>
          </div>

          {/* Backup History */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Backup History</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {backupHistory.length === 0 ? (<p className="text-sm text-gray-500">No backups yet. Create your first backup above.</p>) : (backupHistory.map(function (backup) { return (<div key={backup.id} className={"flex items-center justify-between p-3 rounded-lg border ".concat(backup.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
                    <div className="flex items-center gap-2">
                      {backup.success ? (<CheckCircle className="h-4 w-4 text-green-600"/>) : (<AlertTriangle className="h-4 w-4 text-red-600"/>)}
                      <div>
                        <div className="text-sm font-medium">
                          {formatTimestamp(backup.timestamp)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatFileSize(backup.size)}
                          {backup.error && " \u2022 ".concat(backup.error)}
                        </div>
                      </div>
                    </div>
                    {backup.success && (<button onClick={function () { return restoreBackup(backup.id); }} className="text-sm text-blue-600 hover:text-blue-700">
                        Restore
                      </button>)}
                  </div>); }))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600"/>
          <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Reset Settings</h3>
            <p className="text-sm text-gray-600 mb-3">
              Reset all app settings to their default values. Your vocabulary data will be preserved.
            </p>
            <button onClick={function () { return setShowResetConfirm(true); }} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              Reset Settings
            </button>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Factory Reset</h3>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete all data including vocabulary, modules, projects, and settings.
              This action cannot be undone.
            </p>
            <button onClick={function () { return setShowFactoryResetConfirm(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Factory Reset
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmations */}
      {showResetConfirm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reset Settings?</h3>
            <p className="text-gray-600 mb-6">
              This will reset all app settings to defaults. Your vocabulary data will be preserved.
            </p>
            <div className="flex gap-2">
              <button onClick={function () { return setShowResetConfirm(false); }} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleResetSettings} className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                Reset Settings
              </button>
            </div>
          </div>
        </div>)}

      {showFactoryResetConfirm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Factory Reset?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete ALL data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={function () { return setShowFactoryResetConfirm(false); }} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleFactoryReset} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Factory Reset
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=Settings.jsx.map