import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getTypeColor } from '../services/pokedex-service';

interface TypeFilterProps {
  types: string[];
  value: string;
  onChange: (value: string) => void;
  labelsMap?: Record<string, string>; // opcional: traducir nombres de tipo
}

const TypeFilter = ({ types, value, onChange, labelsMap }: TypeFilterProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const options: { value: string; label: string; color?: string }[] = useMemo(() => {
    return [
      { value: 'all', label: 'Todos los tipos' },
      ...types.map(t => ({ value: t, label: labelsMap?.[t] ?? t, color: getTypeColor(t) })),
    ];
  }, [types, labelsMap]);

  const selected = options.find(o => o.value === value) ?? options[0];

  const hexToRgba = (hex?: string, alpha: number = 1): string | undefined => {
    if (!hex) return undefined;
    const match = hex.replace('#', '');
    const bigint = parseInt(match, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border backdrop-blur text-sm font-medium text-gray-900 dark:text-gray-100 transition relative overflow-hidden"
        style={
          selected.value !== 'all' && selected.color
            ? {
                borderColor: selected.color,
                background: `linear-gradient(135deg, ${hexToRgba(
                  selected.color,
                  0.18
                )} 0%, ${hexToRgba(selected.color, 0.08)} 100%)`,
              }
            : undefined
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span>{selected.label}</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-white/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-xl z-20"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition flex items-center gap-2 relative overflow-hidden`}
              style={
                opt.value !== 'all' && opt.color
                  ? {
                      background:
                        value === opt.value
                          ? `linear-gradient(135deg, ${hexToRgba(opt.color, 0.22)} 0%, ${hexToRgba(
                              opt.color,
                              0.1
                            )} 100%)`
                          : `linear-gradient(135deg, ${hexToRgba(opt.color, 0.12)} 0%, ${hexToRgba(
                              opt.color,
                              0.2
                            )} 100%)`,
                    }
                  : undefined
              }
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeFilter;
