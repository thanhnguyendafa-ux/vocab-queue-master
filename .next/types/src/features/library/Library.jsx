import { __assign, __spreadArray } from "tslib";
import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CSVService } from '../../services/csvService';
import { Upload, Download, Plus, Search, Filter, MoreVertical, Edit, CheckSquare, Square } from 'lucide-react';
export function Library() {
    var _a = useApp(), state = _a.state, dispatch = _a.dispatch;
    var _b = useState('table'), viewMode = _b[0], setViewMode = _b[1];
    var _c = useState(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = useState(new Set()), selectedItems = _d[0], setSelectedItems = _d[1];
    var _e = useState(false), showAdvanced = _e[0], setShowAdvanced = _e[1];
    var fileInputRef = useRef(null);
    var _f = useState([
        {
            name: 'Main Vocabulary',
            columns: ['Keyword', 'Tag', 'Definition', 'Example', 'Pronunciation', 'ImageURL'],
            items: state.vocabItems
        }
    ]), tables = _f[0], setTables = _f[1];
    var filteredItems = state.vocabItems.filter(function (item) {
        return item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tag && item.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    var handleFileUpload = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                var csvRows = CSVService.parseCSV(content);
                // Define schema for validation
                var schema = ['Keyword', 'Tag', 'Definition', 'Example', 'Pronunciation', 'ImageURL'];
                var result = CSVService.validateCSV(csvRows, schema);
                if (result.success) {
                    var vocabItems_1 = result.data.map(function (row, index) { return ({
                        id: crypto.randomUUID(),
                        keyword: row.Keyword || '',
                        definition: row.Definition || '',
                        example: row.Example,
                        pronunciation: row.Pronunciation,
                        imageUrl: row.ImageURL,
                        tag: row.Tag,
                        failed: 0,
                        passed1: 0,
                        passed2: 0,
                        successRate: 0,
                        inQueue: 0,
                        quitQueue: 0,
                        rankPoint: 0
                    }); });
                    vocabItems_1.forEach(function (item) {
                        dispatch({ type: 'ADD_VOCAB_ITEM', payload: item });
                    });
                    // Update tables
                    setTables(function (prev) { return prev.map(function (table) {
                        return table.name === 'Main Vocabulary'
                            ? __assign(__assign({}, table), { items: __spreadArray(__spreadArray([], table.items, true), vocabItems_1, true) }) : table;
                    }); });
                    alert("Successfully imported ".concat(vocabItems_1.length, " items!"));
                    // Clear the file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
                else {
                    alert("Import failed:\n".concat(result.errors.join('\n')));
                }
            }
            catch (error) {
                alert("Error parsing CSV: ".concat(error));
            }
        };
        reader.readAsText(file);
    };
    var handleExportCSV = function (includeStats) {
        if (includeStats === void 0) { includeStats = false; }
        var csvData = state.vocabItems.map(function (item) {
            var baseData = {
                Keyword: item.keyword,
                Tag: item.tag || '',
                Definition: item.definition,
                Example: item.example || '',
                Pronunciation: item.pronunciation || '',
                ImageURL: item.imageUrl || ''
            };
            if (includeStats) {
                return __assign(__assign({}, baseData), { Failed: item.failed.toString(), Passed1: item.passed1.toString(), Passed2: item.passed2.toString(), SuccessRate: item.successRate.toString(), InQueue: item.inQueue.toString(), QuitQueue: item.quitQueue.toString(), LastDayPractice: item.lastDayPractice || '', RankPoint: item.rankPoint.toString() });
            }
            return baseData;
        });
        var csvContent = CSVService.generateCSV(csvData);
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = includeStats
            ? "vocabulary-with-stats-".concat(new Date().toISOString().split('T')[0], ".csv")
            : "vocabulary-data-".concat(new Date().toISOString().split('T')[0], ".csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    var handleExportTemplate = function () {
        var templateData = [
            {
                Keyword: 'example',
                Tag: 'Vocabulary',
                Definition: 'A thing characteristic of its kind or illustrating a general rule',
                Example: 'This is an example sentence showing how the word is used.',
                Pronunciation: '/ɪɡˈzæmpəl/',
                ImageURL: 'https://example.com/image.jpg'
            }
        ];
        var csvContent = CSVService.generateCSV(templateData);
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'vocabulary-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    var handleQuickStudy = function () {
        if (selectedItems.size === 0) {
            alert('Please select items to study.');
            return;
        }
        var itemsToStudy = state.vocabItems.filter(function (item) { return selectedItems.has(item.id); });
        // TODO: Navigate to study tab with selected items
        alert("Starting study session with ".concat(itemsToStudy.length, " selected items."));
    };
    var handleDeleteSelected = function () {
        if (selectedItems.size === 0) {
            alert('Please select items to delete.');
            return;
        }
        if (confirm("Are you sure you want to delete ".concat(selectedItems.size, " selected items?"))) {
            selectedItems.forEach(function (id) {
                dispatch({ type: 'DELETE_VOCAB_ITEM', payload: id });
            });
            setSelectedItems(new Set());
        }
    };
    var toggleItemSelection = function (itemId) {
        var newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        }
        else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };
    var selectAllItems = function () {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        }
        else {
            setSelectedItems(new Set(filteredItems.map(function (item) { return item.id; })));
        }
    };
    return (<div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600">Manage your vocabulary data</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportTemplate} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Download size={16}/>
            CSV Template
          </button>

          <button onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload size={16}/>
            Import CSV
          </button>

          <div className="relative">
            <button onClick={function () { return setShowAdvanced(!showAdvanced); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download size={16}/>
              Export Data
            </button>

            {showAdvanced && (<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button onClick={function () {
                handleExportCSV(false);
                setShowAdvanced(false);
            }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Data Only
                </button>
                <button onClick={function () {
                handleExportCSV(true);
                setShowAdvanced(false);
            }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Data + Stats
                </button>
              </div>)}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus size={16}/>
            Add Item
          </button>
        </div>
      </div>

      {/* Table Management */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tables</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Manage Tables
          </button>
        </div>
        <div className="space-y-2">
          {tables.map(function (table, index) { return (<div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{table.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({table.items.length} items)
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit size={14}/>
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Download size={14}/>
                </button>
              </div>
            </div>); })}
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <button onClick={function () { return setViewMode('table'); }} className={"px-4 py-2 rounded ".concat(viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            Table View
          </button>
          <button onClick={function () { return setViewMode('board'); }} className={"px-4 py-2 rounded ".concat(viewMode === 'board' ? 'bg-blue-600 text-white' : 'bg-gray-200')}>
            Board View
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
            <input type="text" placeholder="Search items..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16}/>
          </button>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedItems.size > 0 && (<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.size} item(s) selected
            </span>
            <div className="flex gap-2">
              <button onClick={handleQuickStudy} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Quick Study
              </button>
              <button onClick={handleDeleteSelected} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
              <button onClick={function () { return setSelectedItems(new Set()); }} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                Clear
              </button>
            </div>
          </div>
        </div>)}

      {/* Content */}
      {viewMode === 'table' ? (<TableView items={filteredItems} selectedItems={selectedItems} onToggleSelection={toggleItemSelection} onSelectAll={selectAllItems} allSelected={selectedItems.size === filteredItems.length && filteredItems.length > 0}/>) : (<BoardView items={filteredItems} selectedItems={selectedItems} onToggleSelection={toggleItemSelection}/>)}

      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden"/>
    </div>);
}
function TableView(_a) {
    var items = _a.items, selectedItems = _a.selectedItems, onToggleSelection = _a.onToggleSelection, onSelectAll = _a.onSelectAll, allSelected = _a.allSelected;
    if (items.length === 0) {
        return (<div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No vocabulary items found</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
      </div>);
    }
    return (<div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button onClick={onSelectAll} className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {allSelected ? <CheckSquare size={16}/> : <Square size={16}/>}
                  Select All
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Definition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Queue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(function (item) { return (<tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button onClick={function () { return onToggleSelection(item.id); }} className="flex items-center">
                    {selectedItems.has(item.id) ?
                <CheckSquare size={16} className="text-blue-600"/> :
                <Square size={16} className="text-gray-400"/>}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.keyword}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {item.definition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.tag || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "".concat(item.successRate * 100, "%") }}></div>
                    </div>
                    {Math.round(item.successRate * 100)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.inQueue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16}/>
                  </button>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>
    </div>);
}
function BoardView(_a) {
    var items = _a.items, selectedItems = _a.selectedItems, onToggleSelection = _a.onToggleSelection;
    if (items.length === 0) {
        return (<div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No vocabulary items found</p>
      </div>);
    }
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(function (item) { return (<div key={item.id} className={"border rounded-lg shadow ".concat(selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : '')}>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <button onClick={function () { return onToggleSelection(item.id); }} className="flex items-center gap-2 mb-2">
                {selectedItems.has(item.id) ?
                <CheckSquare size={16} className="text-blue-600"/> :
                <Square size={16} className="text-gray-400"/>}
              </button>
              <h3 className="font-semibold text-gray-900 flex-1">{item.keyword}</h3>
              <span className={"px-2 py-1 text-xs rounded ml-2 ".concat(item.successRate > 0.8 ? 'bg-green-100 text-green-800' :
                item.successRate > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800')}>
                {Math.round(item.successRate * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.definition}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tag: {item.tag || 'General'}</span>
              <span>In Queue: {item.inQueue}</span>
            </div>
          </div>
        </div>); })}
    </div>);
}
//# sourceMappingURL=Library.jsx.map