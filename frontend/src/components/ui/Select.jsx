import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function SelectTrigger({ children, id, className = '' }) {
  return (
    <button
      id={id}
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-muted-foreground">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return (
    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }) {
  return (
    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
      {children}
    </div>
  );
}

// Simple version for now
export function SelectSimple({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}