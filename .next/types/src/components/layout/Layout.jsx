import { Navigation } from './Navigation';
export function Layout(_a) {
    var children = _a.children;
    return (<div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>);
}
//# sourceMappingURL=Layout.jsx.map