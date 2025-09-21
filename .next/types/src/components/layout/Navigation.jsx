import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Library, Wrench, Settings } from 'lucide-react';
var navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/study', label: 'Study', icon: BookOpen },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/build', label: 'Build', icon: Wrench },
    { path: '/settings', label: 'Settings', icon: Settings },
];
export function Navigation() {
    return (<nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600"/>
            <h1 className="text-xl font-bold text-gray-900">Vocab Queue Master</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(function (_a) {
            var path = _a.path, label = _a.label, Icon = _a.icon;
            return (<NavLink key={path} to={path} className={function (_a) {
                    var isActive = _a.isActive;
                    return "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ".concat(isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100');
                }}>
                <Icon className="h-4 w-4"/>
                <span>{label}</span>
              </NavLink>);
        })}
          </div>
        </div>
      </div>
    </nav>);
}
//# sourceMappingURL=Navigation.jsx.map