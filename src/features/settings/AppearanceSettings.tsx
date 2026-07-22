import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Moon, Sun, Maximize2, Palette, Check } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
  const { theme, toggleTheme, compactMode, toggleCompactMode, accentColor, setAccentColor } = useTheme();

  const colors = [
    { id: 'indigo', name: 'Indigo Accent', class: 'bg-indigo-600' },
    { id: 'purple', name: 'Purple Accent', class: 'bg-purple-600' },
    { id: 'emerald', name: 'Emerald Accent', class: 'bg-emerald-600' },
    { id: 'amber', name: 'Amber Accent', class: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Interface Theme Mode</span>
          </CardTitle>
          <CardDescription>Select preferred contrast and color scheme for KalaTrack dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`p-4 rounded-xl border text-left transition-all ${
              theme === 'dark' ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs font-semibold text-zinc-100">Dark Mode First (Default)</p>
            <p className="text-[11px] text-zinc-400 mt-1">High-contrast dark canvas engineered for event monitoring.</p>
          </button>

          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`p-4 rounded-xl border text-left transition-all ${
              theme === 'light' ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className="w-5 h-5 text-amber-400" />
              {theme === 'light' && <Check className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs font-semibold text-zinc-100">Light Mode</p>
            <p className="text-[11px] text-zinc-400 mt-1">Clean light interface layout for daytime operations.</p>
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>System Accent Color</span>
          </CardTitle>
          <CardDescription>Customize primary highlight color across buttons and badges.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                className={`w-10 h-10 rounded-xl ${c.class} flex items-center justify-center transition-transform hover:scale-105 border-2 ${
                  accentColor === c.id ? 'border-white' : 'border-transparent'
                }`}
                title={c.name}
              >
                {accentColor === c.id && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span>Density & Spacing</span>
          </CardTitle>
          <CardDescription>Adjust dashboard table and card spacing density.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-zinc-200">Compact Table Layout</p>
              <p className="text-[11px] text-zinc-400">Reduces table padding to display more member records per page.</p>
            </div>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={toggleCompactMode}
              className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
