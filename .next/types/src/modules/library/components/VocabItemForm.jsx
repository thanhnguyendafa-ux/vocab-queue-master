import { __assign, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
export function VocabItemForm(_a) {
    var item = _a.item, projects = _a.projects, onSave = _a.onSave, onCancel = _a.onCancel;
    var _b = useState({
        term: '',
        meaning: '',
        example: '',
        tags: [],
        selectedProjects: []
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState(''), newTag = _c[0], setNewTag = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    useEffect(function () {
        if (item) {
            setFormData({
                term: item.term,
                meaning: item.meaning,
                example: item.example || '',
                tags: item.tags || [],
                selectedProjects: projects.filter(function (p) { return p.items.includes(item.id); }).map(function (p) { return p.id; })
            });
        }
    }, [item, projects]);
    var validateForm = function () {
        var newErrors = {};
        if (!formData.term.trim()) {
            newErrors.term = 'Term is required';
        }
        if (!formData.meaning.trim()) {
            newErrors.meaning = 'Meaning is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!validateForm())
            return;
        var itemData = {
            term: formData.term.trim(),
            meaning: formData.meaning.trim(),
            example: formData.example.trim() || undefined,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            lastReviewedAt: item === null || item === void 0 ? void 0 : item.lastReviewedAt
        };
        onSave(itemData);
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
    var toggleProject = function (projectId) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { selectedProjects: prev.selectedProjects.includes(projectId)
                ? prev.selectedProjects.filter(function (id) { return id !== projectId; })
                : __spreadArray(__spreadArray([], prev.selectedProjects, true), [projectId], false) })); });
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{item ? 'Edit Vocabulary Item' : 'Add New Vocabulary Item'}</CardTitle>
              <CardDescription>
                {item ? 'Update the vocabulary item details' : 'Create a new vocabulary item for your collection'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Term */}
            <div>
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                Term *
              </label>
              <Input id="term" value={formData.term} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { term: e.target.value })); }); }} placeholder="Enter the vocabulary term" error={!!errors.term}/>
              {errors.term && (<p className="text-sm text-red-500 mt-1">{errors.term}</p>)}
            </div>

            {/* Meaning */}
            <div>
              <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
                Meaning *
              </label>
              <textarea id="meaning" value={formData.meaning} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { meaning: e.target.value })); }); }} placeholder="Enter the meaning or definition" rows={3} className={"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.meaning ? 'border-red-500' : 'border-gray-300')}/>
              {errors.meaning && (<p className="text-sm text-red-500 mt-1">{errors.meaning}</p>)}
            </div>

            {/* Example */}
            <div>
              <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-2">
                Example (Optional)
              </label>
              <textarea id="example" value={formData.example} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { example: e.target.value })); }); }} placeholder="Enter an example sentence" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
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

            {/* Projects */}
            {projects.length > 0 && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add to Projects (Optional)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {projects.map(function (project) { return (<label key={project.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.selectedProjects.includes(project.id)} onChange={function () { return toggleProject(project.id); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      <span className="text-sm text-gray-700">{project.name}</span>
                    </label>); })}
                </div>
              </div>)}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {item ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
//# sourceMappingURL=VocabItemForm.jsx.map