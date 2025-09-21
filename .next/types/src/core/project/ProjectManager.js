import { __assign, __awaiter, __generator } from "tslib";
import { DBService } from '../../services/db-service';
var ProjectManager = /** @class */ (function () {
    function ProjectManager() {
    }
    ProjectManager.createProject = function (name_1) {
        return __awaiter(this, arguments, void 0, function (name, description) {
            var project;
            if (description === void 0) { description = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        project = {
                            id: crypto.randomUUID(),
                            name: name,
                            description: description,
                            items: [],
                            modules: [],
                            tags: [],
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        };
                        return [4 /*yield*/, DBService.saveProject(project)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, project];
                }
            });
        });
    };
    ProjectManager.addModuleToProject = function (projectId, moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            throw new Error('Project not found');
                        if (!!project.modules.includes(moduleId)) return [3 /*break*/, 3];
                        project.modules.push(moduleId);
                        project.updatedAt = Date.now();
                        return [4 /*yield*/, DBService.saveProject(project)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, project];
                }
            });
        });
    };
    ProjectManager.removeModuleFromProject = function (projectId, moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            throw new Error('Project not found');
                        project.modules = project.modules.filter(function (id) { return id !== moduleId; });
                        project.updatedAt = Date.now();
                        return [4 /*yield*/, DBService.saveProject(project)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, project];
                }
            });
        });
    };
    ProjectManager.getProjectModules = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var project, modules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, Promise.all(project.modules.map(function (moduleId) { return DBService.getModule(moduleId); }))];
                    case 2:
                        modules = _a.sent();
                        return [2 /*return*/, modules.filter(Boolean)];
                }
            });
        });
    };
    ProjectManager.getProjectItems = function (projectId) {
        return __awaiter(this, void 0, void 0, function () {
            var project, modules, allItems, itemMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getProjectModules(projectId)];
                    case 2:
                        modules = _a.sent();
                        return [4 /*yield*/, Promise.all(modules.map(function (module) {
                                return DBService.getVocabItems(module.id);
                            }))
                            // Flatten and deduplicate items
                        ];
                    case 3:
                        allItems = _a.sent();
                        itemMap = new Map();
                        allItems.flat().forEach(function (item) {
                            if (!itemMap.has(item.id)) {
                                itemMap.set(item.id, item);
                            }
                        });
                        return [2 /*return*/, Array.from(itemMap.values())];
                }
            });
        });
    };
    ProjectManager.updateProjectSettings = function (projectId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var project, updatedProject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DBService.getProject(projectId)];
                    case 1:
                        project = _a.sent();
                        if (!project)
                            throw new Error('Project not found');
                        updatedProject = __assign(__assign(__assign({}, project), updates), { updatedAt: Date.now() });
                        return [4 /*yield*/, DBService.saveProject(updatedProject)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, updatedProject];
                }
            });
        });
    };
    return ProjectManager;
}());
export { ProjectManager };
//# sourceMappingURL=ProjectManager.js.map