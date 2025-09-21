import React, { useState } from 'react';
import { useQuizStore } from '../../store/useQuizStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Plus, Search, BookOpen, Users, Upload, Trash2, Edit } from 'lucide-react';
import { VocabItemForm } from './components/VocabItemForm';
import { ProjectForm } from './components/ProjectForm';
import { ImportExportDialog } from './components/ImportExportDialog';
export function Library() {
    var _a = useQuizStore(), items = _a.items, projects = _a.projects, addItem = _a.addItem, updateItem = _a.updateItem, deleteItem = _a.deleteItem, addProject = _a.addProject, updateProject = _a.updateProject, deleteProject = _a.deleteProject;
    var _b = useState(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = useState(null), selectedProject = _c[0], setSelectedProject = _c[1];
    var _d = useState(false), showItemForm = _d[0], setShowItemForm = _d[1];
    var _e = useState(false), showProjectForm = _e[0], setShowProjectForm = _e[1];
    var _f = useState(false), showImportExport = _f[0], setShowImportExport = _f[1];
    var _g = useState(null), editingItem = _g[0], setEditingItem = _g[1];
    var _h = useState(null), editingProject = _h[0], setEditingProject = _h[1];
    // Filter items based on search and selected project
    var filteredItems = items.filter(function (item) {
        var matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
        if (!selectedProject)
            return matchesSearch;
        var project = projects.find(function (p) { return p.id === selectedProject; });
        return matchesSearch && (project === null || project === void 0 ? void 0 : project.items.includes(item.id));
    });
    var handleAddItem = function (itemData) {
        addItem(itemData);
        setShowItemForm(false);
    };
    var handleUpdateItem = function (itemData) {
        if (editingItem) {
            updateItem(editingItem.id, itemData);
            setEditingItem(null);
            setShowItemForm(false);
        }
    };
    var handleDeleteItem = function (itemId) {
        if (confirm('Are you sure you want to delete this vocabulary item?')) {
            deleteItem(itemId);
        }
    };
    var handleAddProject = function (projectData) {
        addProject(projectData);
        setShowProjectForm(false);
    };
    var handleUpdateProject = function (projectData) {
        if (editingProject) {
            updateProject(editingProject.id, projectData);
            setEditingProject(null);
            setShowProjectForm(false);
        }
    };
    var handleDeleteProject = function (projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(projectId);
            if (selectedProject === projectId) {
                setSelectedProject(null);
            }
        }
    };
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Library</h1>
          <p className="text-gray-600 mt-2">
            Manage your vocabulary items and organize them into projects
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={function () { return setShowImportExport(true); }} className="flex items-center gap-2">
            <Upload className="h-4 w-4"/>
            Import/Export
          </Button>
          
          <Button onClick={function () { return setShowProjectForm(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            New Project
          </Button>
          
          <Button onClick={function () { return setShowItemForm(true); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            Add Vocabulary
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vocabulary</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredItems.length} shown
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Active collections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastery Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.length > 0
            ? Math.round((items.filter(function (item) { return item.passed2 > 0; }).length / items.length) * 100)
            : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Items mastered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
              <CardDescription>
                Filter vocabulary by project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant={selectedProject === null ? "default" : "ghost"} className="w-full justify-start" onClick={function () { return setSelectedProject(null); }}>
                All Items ({items.length})
              </Button>
              
              {projects.map(function (project) { return (<div key={project.id} className="flex items-center gap-2">
                  <Button variant={selectedProject === project.id ? "default" : "ghost"} className="flex-1 justify-start" onClick={function () { return setSelectedProject(project.id); }}>
                    {project.name} ({project.items.length})
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={function () {
                setEditingProject(project);
                setShowProjectForm(true);
            }}>
                    <Edit className="h-3 w-3"/>
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={function () { return handleDeleteProject(project.id); }}>
                    <Trash2 className="h-3 w-3"/>
                  </Button>
                </div>); })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
              <Input placeholder="Search vocabulary..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10"/>
            </div>
          </div>

          {/* Vocabulary Items */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (<Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4"/>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No vocabulary items found
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first vocabulary item"}
                  </p>
                  <Button onClick={function () { return setShowItemForm(true); }}>
                    Add Vocabulary Item
                  </Button>
                </CardContent>
              </Card>) : (filteredItems.map(function (item) { return (<Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.term}
                          </h3>
                          
                          {/* Progress Indicators */}
                          <div className="flex gap-1">
                            {item.passed1 > 0 && (<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Level 1: {item.passed1}
                              </span>)}
                            {item.passed2 > 0 && (<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Mastered: {item.passed2}
                              </span>)}
                            {item.failed > 0 && (<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Failed: {item.failed}
                              </span>)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{item.meaning}</p>
                        
                        {item.example && (<p className="text-sm text-gray-600 italic mb-2">
                            Example: {item.example}
                          </p>)}
                        
                        {item.tags && item.tags.length > 0 && (<div className="flex flex-wrap gap-1">
                            {item.tags.map(function (tag) { return (<span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                              </span>); })}
                          </div>)}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={function () {
                setEditingItem(item);
                setShowItemForm(true);
            }}>
                          <Edit className="h-4 w-4"/>
                        </Button>
                        
                        <Button variant="ghost" size="sm" onClick={function () { return handleDeleteItem(item.id); }}>
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>); }))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showItemForm && (<VocabItemForm item={editingItem} projects={projects} onSave={editingItem ? handleUpdateItem : handleAddItem} onCancel={function () {
                setShowItemForm(false);
                setEditingItem(null);
            }}/>)}

      {showProjectForm && (<ProjectForm project={editingProject} onSave={editingProject ? handleUpdateProject : handleAddProject} onCancel={function () {
                setShowProjectForm(false);
                setEditingProject(null);
            }}/>)}

      {showImportExport && (<ImportExportDialog onClose={function () { return setShowImportExport(false); }}/>)}
    </div>);
}
//# sourceMappingURL=Library.jsx.map