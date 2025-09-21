import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, BookOpen, Play, BarChart3, Calendar, ChevronRight, Settings } from 'lucide-react';
export function Home() {
    var _a = useApp(), state = _a.state, dispatch = _a.dispatch;
    // Calculate today's statistics
    var todayStats = React.useMemo(function () {
        var today = new Date().toISOString().split('T')[0];
        var todayItems = state.vocabItems.filter(function (item) {
            return item.lastDayPractice === today;
        });
        var inQueueCount = state.vocabItems.reduce(function (sum, item) { return sum + item.inQueue; }, 0);
        var quitQueueCount = state.vocabItems.reduce(function (sum, item) { return sum + item.quitQueue; }, 0);
        var streakDays = calculateStreakDays(state.vocabItems);
        return {
            inQueue: inQueueCount,
            quitQueue: quitQueueCount,
            todayPractice: todayItems.length,
            streakDays: streakDays,
            totalItems: state.vocabItems.length,
            totalModules: state.modules.length,
            totalProjects: state.projects.length
        };
    }, [state.vocabItems, state.modules, state.projects]);
    // Calculate streak days
    function calculateStreakDays(items) {
        if (items.length === 0)
            return 0;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var streak = 0;
        var currentDate = new Date(today);
        var _loop_1 = function () {
            var dateStr = currentDate.toISOString().split('T')[0];
            var hasPractice = items.some(function (item) { return item.lastDayPractice === dateStr; });
            if (hasPractice) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
            else {
                return "break";
            }
        };
        while (streak < 30) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        return streak;
    }
    // Get recent projects for quick start
    var recentProjects = React.useMemo(function () {
        return state.projects.slice(0, 3);
    }, [state.projects]);
    // Get top performing items
    var topPerformers = React.useMemo(function () {
        return state.vocabItems
            .filter(function (item) { return item.successRate > 0.8; })
            .sort(function (a, b) { return b.successRate - a.successRate; })
            .slice(0, 5);
    }, [state.vocabItems]);
    // Get items needing attention
    var needsAttention = React.useMemo(function () {
        return state.vocabItems
            .filter(function (item) { return item.successRate < 0.6 || item.inQueue > 0; })
            .sort(function (a, b) { return (b.inQueue - a.inQueue) || (a.successRate - b.successRate); })
            .slice(0, 5);
    }, [state.vocabItems]);
    var handlePracticeSample = function () {
        dispatch({ type: 'TOGGLE_SAMPLE_MODE' });
    };
    var handleStudyMyWords = function () {
        // Navigate to study tab with user data
        if (todayStats.totalItems > 0) {
            window.location.hash = '/study';
        }
        else {
            alert('No vocabulary data available. Please import some data first.');
        }
    };
    var handleCreateTable = function () {
        // Navigate to library tab for CSV import
        window.location.hash = '/library';
    };
    var handleResumeProject = function (projectId) {
        // TODO: Navigate to study with specific project
        window.location.hash = '/study';
    };
    var handleViewDetails = function (type) {
        switch (type) {
            case 'today':
                window.location.hash = '/study';
                break;
            case 'performance':
                window.location.hash = '/library';
                break;
            case 'attention':
                window.location.hash = '/library';
                break;
        }
    };
    return (<div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocab Quiz Master</h1>
        <p className="text-gray-600">Master vocabulary with spaced repetition</p>
      </div>

      {/* Today's Stats - Mobile 2-col / Desktop 3-4 col grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={function () { return handleViewDetails('today'); }} title="Click to view today's study sessions">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Queue</p>
              <p className="text-2xl font-bold text-blue-600">{todayStats.inQueue}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600"/>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {todayStats.todayPractice} practiced today
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={function () { return handleViewDetails('today'); }} title="Click to view quit sessions">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quit Queue</p>
              <p className="text-2xl font-bold text-red-600">{todayStats.quitQueue}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-600"/>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Items quit mid-session
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={function () { return handleViewDetails('today'); }} title="Click to view streak details">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-green-600">{todayStats.streakDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600"/>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Days practiced in a row
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={function () { return handleViewDetails('performance'); }} title="Click to view all vocabulary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-purple-600">{todayStats.totalItems}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-600"/>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {todayStats.totalModules} modules, {todayStats.totalProjects} projects
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handlePracticeSample} className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Play className="h-5 w-5 text-blue-600"/>
            <div className="text-left">
              <div className="text-blue-600 font-medium">Practice Sample</div>
              <div className="text-xs text-blue-500">Try with built-in data</div>
            </div>
          </button>

          <button onClick={handleStudyMyWords} disabled={todayStats.totalItems === 0} className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 disabled:bg-gray-50 rounded-lg transition-colors disabled:cursor-not-allowed">
            <BookOpen className="h-5 w-5 text-green-600"/>
            <div className="text-left">
              <div className="text-green-600 font-medium">Study My Words</div>
              <div className="text-xs text-green-500">Use your vocabulary</div>
            </div>
          </button>

          <button onClick={handleCreateTable} className="flex items-center justify-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Plus className="h-5 w-5 text-purple-600"/>
            <div className="text-left">
              <div className="text-purple-600 font-medium">Import Data</div>
              <div className="text-xs text-purple-500">Upload CSV file</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (<div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <button onClick={function () { return window.location.hash = '/build'; }} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight size={16}/>
            </button>
          </div>
          <div className="space-y-3">
            {recentProjects.map(function (project) { return (<div key={project.id} onClick={function () { return handleResumeProject(project.id); }} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className={"w-3 h-3 rounded-full ".concat(project.mode === 'Random' ? 'bg-orange-500' : 'bg-indigo-500')}></div>
                  <div>
                    <span className="font-medium">{project.name}</span>
                    <div className="text-sm text-gray-600">
                      {project.moduleIds.length} modules • {project.mode} mode
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400"/>
              </div>); })}
          </div>
        </div>)}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            <button onClick={function () { return handleViewDetails('performance'); }} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight size={16}/>
            </button>
          </div>
          <div className="space-y-3">
            {topPerformers.length === 0 ? (<p className="text-gray-500 text-sm">No top performers yet. Start studying to see your progress!</p>) : (topPerformers.map(function (item, index) { return (<div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-sm">{item.keyword}</span>
                      <div className="text-xs text-gray-500">{item.tag || 'General'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {Math.round(item.successRate * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.passed1 + item.passed2} correct
                    </div>
                  </div>
                </div>); }))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
            <button onClick={function () { return handleViewDetails('attention'); }} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight size={16}/>
            </button>
          </div>
          <div className="space-y-3">
            {needsAttention.length === 0 ? (<p className="text-gray-500 text-sm">Great! All items are performing well.</p>) : (needsAttention.map(function (item) { return (<div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={"w-3 h-3 rounded-full ".concat(item.successRate < 0.4 ? 'bg-red-500' : 'bg-yellow-500')}></div>
                    <div>
                      <span className="font-medium text-sm">{item.keyword}</span>
                      <div className="text-xs text-gray-500">{item.tag || 'General'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={"text-sm font-medium ".concat(item.successRate < 0.4 ? 'text-red-600' : 'text-yellow-600')}>
                      {Math.round(item.successRate * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.inQueue > 0 && "".concat(item.inQueue, " in queue")}
                    </div>
                  </div>
                </div>); }))}
          </div>
        </div>
      </div>

      {/* Sample Mode Indicator */}
      {state.sampleMode && (<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-600"/>
              <span className="text-sm font-medium text-blue-800">Sample Mode Active</span>
            </div>
            <button onClick={function () { return dispatch({ type: 'TOGGLE_SAMPLE_MODE' }); }} className="text-sm text-blue-600 hover:text-blue-700">
              Exit Sample Mode
            </button>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            You're currently using sample data. Import your own vocabulary to get started with real data.
          </p>
        </div>)}
    </div>);
}
//# sourceMappingURL=Home.jsx.map