import { NavLink } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/osha', label: 'OSHA Forms' },
  { to: '/import', label: 'Import' },
  { to: '/settings', label: 'Settings' },
];

export function Layout({ children }: LayoutProps) {
  const { activeEstablishment, establishments, setActiveEstablishment } = useSettingsStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold text-safety-orange">Safety Tracker</h1>
          <p className="text-xs text-gray-400 mt-1">Construction Incident Management</p>
        </div>

        {/* Establishment Selector */}
        {establishments.length > 1 && (
          <div className="px-4 py-3 border-b border-gray-700">
            <select
              value={activeEstablishment?.id ?? ''}
              onChange={(e) => {
                const est = establishments.find(x => x.id === Number(e.target.value));
                if (est) setActiveEstablishment(est);
              }}
              className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
            >
              {establishments.map(est => (
                <option key={est.id} value={est.id}>{est.name}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-safety-orange text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          {activeEstablishment?.name ?? 'No establishment'}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
