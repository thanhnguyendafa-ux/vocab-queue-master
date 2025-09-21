import { __assign, __spreadArray } from "tslib";
import React, { useState } from 'react';
import { useQuizStore } from '../../../store/useQuizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ArrowLeft, Play, Settings, Filter, Target } from 'lucide-react';
export function StudySetup(_a) {
    var onCancel = _a.onCancel, onStart = _a.onStart;
    var _b = useQuizStore(), projects = _b.projects, modules = _b.modules, items = _b.items;
    var _c = useState(''), selectedProject = _c[0], setSelectedProject = _c[1];
    var _d = useState(20), maxItems = _d[0], setMaxItems = _d[1];
    var _e = useState(['mcq_default']), selectedModules = _e[0], setSelectedModules = _e[1];
    var _f = useState([
        { type: 'overdue', enabled: false, threshold: 7 },
        { type: 'low-sr', enabled: false, threshold: 0.6 },
        { type: 'high-decay', enabled: false, threshold: 0.6 },
        { type: 'new', enabled: false },
        { type: 'failed', enabled: false }
    ]), focusFilters = _f[0], setFocusFilters = _f[1];
    var selectedProjectData = projects.find(function (p) { return p.id === selectedProject; });
    var availableItems = selectedProjectData
        ? items.filter(function (item) { return selectedProjectData.items.includes(item.id); })
        : [];
    var handleModuleToggle = function (moduleId) {
        setSelectedModules(function (prev) {
            return prev.includes(moduleId)
                ? prev.filter(function (id) { return id !== moduleId; })
                : __spreadArray(__spreadArray([], prev, true), [moduleId], false);
        });
    };
    var handleFilterToggle = function (filterType) {
        setFocusFilters(function (prev) {
            return prev.map(function (filter) {
                return filter.type === filterType
                    ? __assign(__assign({}, filter), { enabled: !filter.enabled }) : filter;
            });
        });
    };
    var handleFilterThresholdChange = function (filterType, threshold) {
        setFocusFilters(function (prev) {
            return prev.map(function (filter) {
                return filter.type === filterType
                    ? __assign(__assign({}, filter), { threshold: threshold }) : filter;
            });
        });
    };
    var handleStart = function () {
        if (!selectedProject)
            return;
        var enabledFilters = focusFilters.filter(function (f) { return f.enabled; });
        onStart(selectedProject, {
            modules: selectedModules,
            maxItems: maxItems,
            focusFilters: enabledFilters.length > 0 ? enabledFilters : undefined
        });
    };
    var getFilterDescription = function (filter) {
        switch (filter.type) {
            case 'overdue':
                return "Items not reviewed for ".concat(filter.threshold || 7, " days");
            case 'low-sr':
                return "Items with success rate below ".concat(Math.round((filter.threshold || 0.6) * 100), "%");
            case 'high-decay':
                return "Items with high memory decay (below ".concat(Math.round((filter.threshold || 0.6) * 100), "%)");
            case 'new':
                return 'Items never studied before';
            case 'failed':
                return 'Items with recent incorrect answers';
            default:
                return '';
        }
    };
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2"/>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Session Setup</h1>
          <p className="text-gray-600 mt-2">
            Configure your study session preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5"/>
                Select Project
              </CardTitle>
              <CardDescription>
                Choose which vocabulary collection to study
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length === 0 ? (<div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No projects available</p>
                  <Button variant="outline" onClick={function () { return window.location.href = '/library'; }}>
                    Create Project
                  </Button>
                </div>) : (<div className="grid grid-cols-1 gap-3">
                  {projects.map(function (project) { return (<div key={project.id} className={"p-4 border rounded-lg cursor-pointer transition-colors ".concat(selectedProject === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')} onClick={function () { return setSelectedProject(project.id); }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">
                            {project.items.length} vocabulary items
                          </p>
                          {project.description && (<p className="text-sm text-gray-600 mt-1">
                              {project.description}
                            </p>)}
                        </div>
                        <input type="radio" checked={selectedProject === project.id} onChange={function () { return setSelectedProject(project.id); }} className="text-blue-600"/>
                      </div>
                    </div>); })}
                </div>)}
            </CardContent>
          </Card>

          {/* Study Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5"/>
                Question Types
              </CardTitle>
              <CardDescription>
                Select which types of questions to include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {modules.filter(function (m) { return m.isActive; }).map(function (module) { return (<label key={module.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={selectedModules.includes(module.id)} onChange={function () { return handleModuleToggle(module.id); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <div className="flex-1">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-gray-500">{module.description}</div>
                    </div>
                  </label>); })}
              </div>
            </CardContent>
          </Card>

          {/* Focus Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5"/>
                Focus Filters
              </CardTitle>
              <CardDescription>
                Target specific types of vocabulary items (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {focusFilters.map(function (filter) { return (<div key={filter.type} className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" checked={filter.enabled} onChange={function () { return handleFilterToggle(filter.type); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {filter.type.replace('-', ' ')} Items
                        </div>
                        <div className="text-sm text-gray-500">
                          {getFilterDescription(filter)}
                        </div>
                      </div>
                    </label>
                    
                    {filter.enabled && filter.threshold !== undefined && (<div className="ml-6">
                        <Input type="number" value={filter.threshold} onChange={function (e) { return handleFilterThresholdChange(filter.type, parseFloat(e.target.value) || 0); }} className="w-24" step={filter.type === 'overdue' ? 1 : 0.1} min={0} max={filter.type === 'overdue' ? 365 : 1}/>
                      </div>)}
                  </div>); })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Items
                </label>
                <Input type="number" value={maxItems} onChange={function (e) { return setMaxItems(parseInt(e.target.value) || 20); }} min={1} max={100}/>
                <p className="text-xs text-gray-500 mt-1">
                  Limit the number of items in this session
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedProjectData && (<Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Items:</span>
                  <span className="font-medium">{availableItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Items:</span>
                  <span className="font-medium">
                    {availableItems.filter(function (item) { return item.passed1 === 0 && item.passed2 === 0; }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress:</span>
                  <span className="font-medium">
                    {availableItems.filter(function (item) { return item.passed1 > 0 && item.passed2 === 0; }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mastered:</span>
                  <span className="font-medium">
                    {availableItems.filter(function (item) { return item.passed2 > 0; }).length}
                  </span>
                </div>
              </CardContent>
            </Card>)}

          <div className="space-y-3">
            <Button onClick={handleStart} disabled={!selectedProject || selectedModules.length === 0} className="w-full">
              <Play className="h-4 w-4 mr-2"/>
              Start Study Session
            </Button>
            
            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=StudySetup.jsx.map