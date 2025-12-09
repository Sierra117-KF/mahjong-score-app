"use client";

import type { ToggleButtonProps } from "@/types";

export function ToggleButton<T extends string>({
  options,
  value,
  onChange,
  label,
}: ToggleButtonProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label != null && label !== "" ? (
        <span className="text-sm font-medium text-gray-300 text-center">
          {label}
        </span>
      ) : null}
      <div className="flex gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
            }}
            className={`
              flex-1 px-3 py-2 text-base font-medium rounded-md
              transition-all duration-200 ease-in-out
              min-h-[44px] min-w-[44px]
              ${
                value === option.value
                  ? "bg-accent text-primary-bg shadow-md"
                  : "bg-card text-gray-300 hover:bg-card-hover"
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
