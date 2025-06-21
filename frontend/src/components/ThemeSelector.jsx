import { PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';
import {useThemeStore} from '../store/useThemeStore.js';

const ThemeSelector = () => {

  const {theme, setTheme} = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
        <button tabIndex={0} className="btn btn-ghost btn-circle">
            <PaletteIcon className="size-5" />
        </button>
      <div
        tabIndex={0} 
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-64 overflow-y-auto overflow-x-hidden"
      >
        <div className="space-y-1">
            {THEMES.map((themeOptions) => (
              <button className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
              ${
                theme === themeOptions.name 
                ? 'bg-primary text-primary-content'
                : 'hover:bg-base-content/5'
              }
            `}
              onClick={() => setTheme(themeOptions.name)}
            >
              <PaletteIcon className='size-4' />
              <span className="font-medium text-sm">{themeOptions.name}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto flex gap-1">
                {themeOptions.colors.map((color, idx) => (
                  <span 
                    key={idx}
                    style={{ backgroundColor: color }}
                    className="size-2"
                  />
                ))}
              </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
