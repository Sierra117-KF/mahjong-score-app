'use client';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function ToggleButton<T extends string>({
  options,
  value,
  onChange,
  label,
}: ToggleButtonProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs text-gray-400">{label}</span>
      )}
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => { onChange(option.value); }}
            className={`
              flex-1 px-3 py-2 text-sm font-medium rounded-md
              transition-all duration-200 ease-in-out
              min-h-[44px] min-w-[44px]
              ${
                value === option.value
                  ? 'bg-accent text-primary-bg shadow-md'
                  : 'bg-card text-gray-300 hover:bg-card-hover'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
