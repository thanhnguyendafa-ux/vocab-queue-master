import { __assign, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
export function ProjectForm(_a) {
    var project = _a.project, onSave = _a.onSave, onCancel = _a.onCancel;
    var _b = useState({
        name: '',
        description: '',
        tags: []
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState(''), newTag = _c[0], setNewTag = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    useEffect(function () {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                tags: project.tags || []
            });
        }
    }, [project]);
    var validateForm = function () {
        var newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!validateForm())
            return;
        var projectData = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            items: (project === null || project === void 0 ? void 0 : project.items) || [],
            modules: (project === null || project === void 0 ? void 0 : project.modules) || ['mcq_default', 'tf_default', 'typing_default']
        };
        onSave(projectData);
    };
    var addTag = function () {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { tags: __spreadArray(__spreadArray([], prev.tags, true), [newTag.trim()], false) })); });
            setNewTag('');
        }
    };
    var removeTag = function (tagToRemove) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { tags: prev.tags.filter(function (tag) { return tag !== tagToRemove; }) })); });
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
              <CardDescription>
                {project ? 'Update the project details' : 'Create a new project to organize your vocabulary'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input id="name" value={formData.name} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} placeholder="Enter project name" error={!!errors.name}/>
              {errors.name && (<p className="text-sm text-red-500 mt-1">{errors.name}</p>)}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea id="description" value={formData.description} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} placeholder="Enter project description" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              
              {/* Existing Tags */}
              {formData.tags.length > 0 && (<div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(function (tag) { return (<span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag}
                      <button type="button" onClick={function () { return removeTag(tag); }} className="ml-2 text-blue-600 hover:text-blue-800">
                        <Minus className="h-3 w-3"/>
                      </button>
                    </span>); })}
                </div>)}
              
              {/* Add New Tag */}
              <div className="flex gap-2">
                <Input value={newTag} onChange={function (e) { return setNewTag(e.target.value); }} placeholder="Add a tag" onKeyPress={function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        }}/>
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4"/>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
//# sourceMappingURL=ProjectForm.jsx.map