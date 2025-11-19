'use client';

import { useState, useRef, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  quickButtons?: number[];
  selectOptions?: number[];
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  quickButtons,
  selectOptions,
}: NumberInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  const handleOptionSelect = (option: number) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>

      {selectOptions ? (
        // カスタムドロップダウン（符用）- 上方向に開く
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => { setIsOpen(!isOpen); }}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="
              w-full px-3 py-2 text-sm font-medium rounded-md
              bg-card text-white
              min-h-[44px] cursor-pointer text-left
              focus:outline-none focus:ring-2 focus:ring-accent
              flex items-center justify-between
            "
          >
            <span>{value}</span>
            <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {isOpen && (
            <ul
              role="listbox"
              className="
                absolute bottom-full left-0 right-0 mb-1
                bg-card rounded-md shadow-lg
                max-h-48 overflow-y-auto
                z-50 border border-gray-600
              "
            >
              {selectOptions.map((option) => (
                <li
                  key={option}
                  role="option"
                  tabIndex={0}
                  aria-selected={value === option}
                  onClick={() => { handleOptionSelect(option); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOptionSelect(option);
                    }
                  }}
                  className={`
                    px-3 py-2 text-sm cursor-pointer
                    hover:bg-card-hover
                    ${value === option ? 'bg-accent text-primary-bg font-medium' : 'text-white'}
                  `}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        // 通常の数値入力（本場用）
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="
            px-3 py-2 text-sm font-medium rounded-md
            bg-card text-white border-none
            min-h-[44px] w-full
            focus:outline-none focus:ring-2 focus:ring-accent
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />
      )}

      {/* クイックボタン（飜用） */}
      {quickButtons && (
        <div className="flex flex-wrap gap-1 mt-1 w-full">
          {quickButtons.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => { onChange(num); }}
              className={`
                flex-1 min-w-0 px-1.5 py-1.5 text-xs font-medium rounded
                transition-all duration-200 ease-in-out
                min-h-[36px]
                ${
                  value === num
                    ? 'bg-accent text-primary-bg'
                    : 'bg-card text-gray-300 hover:bg-card-hover'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
